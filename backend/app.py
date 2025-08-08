from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from functools import wraps
from datetime import datetime
from flasgger import Swagger

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
swagger = Swagger(app, template_file="docs/swagger.yaml")

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'

# Extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False)

class Complaint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='Pending')
    user_email = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = db.Column(db.DateTime, nullable=True)
    resolved_by = db.Column(db.String(120), nullable=True)
    resolved_description = db.Column(db.Text, nullable=True)

# Role-based Admin Decorator
def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user = get_jwt_identity()
        if current_user['role'] != 'admin':
            return jsonify({'message': 'Admins only'}), 403
        return fn(*args, **kwargs)
    return wrapper

# Routes
@app.route('/')
def home():
    return jsonify({"status": "QuickFix API Running"}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400

    user = User.query.filter_by(email=email).first()
    success = user and bcrypt.check_password_hash(user.password, password)

    print(f"[LOGIN ATTEMPT] {email} - {'✅ Success' if success else '❌ Failed'}")

    if success:
        token = create_access_token(identity={'email': user.email, 'role': user.role})
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'role': user.role
        }), 200

    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    email = data.get('email', '').strip()
    password = data.get('password', '')
    role = data.get('role', 'user')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    if len(password) < 6:
        return jsonify({'message': 'Password must be at least 6 characters'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 409

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password=hashed_pw, role=role)
    db.session.add(new_user)
    db.session.commit()

    print(f"[REGISTER] New user: {email} - Role: {role}")
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/complaints', methods=['POST'])
@jwt_required()
def create_complaint():
    data = request.get_json()
    current_user = get_jwt_identity()

    title = data.get('title', '').strip()
    description = data.get('description', '').strip()

    if not title or not description:
        return jsonify({'message': 'Missing title or description'}), 400

    complaint = Complaint(
        title=title,
        description=description,
        user_email=current_user['email']
    )
    db.session.add(complaint)
    db.session.commit()

    return jsonify({'message': 'Complaint created successfully'}), 201

@app.route('/complaints', methods=['GET'])
@admin_required
def list_complaints():
    complaints = Complaint.query.all()
    return jsonify([
        {
            'id': c.id,
            'title': c.title,
            'description': c.description,
            'status': c.status,
            'user_email': c.user_email,
            'created_at': c.created_at.isoformat() if c.created_at else None,
            'updated_at': c.updated_at.isoformat() if c.updated_at else None,
            'resolved_at': c.resolved_at.isoformat() if c.resolved_at else None,
            'resolved_by': c.resolved_by,
            'resolved_description': c.resolved_description
        } for c in complaints
    ]), 200

@app.route('/complaints/<int:id>', methods=['PATCH'])
@admin_required
def update_complaint_status(id):
    data = request.get_json()
    current_user = get_jwt_identity()
    complaint = Complaint.query.get_or_404(id)

    status = data.get('status', '').strip()
    resolved_by = data.get('resolved_by', current_user['email'])
    resolved_description = data.get('resolved_description', '')

    if status:
        complaint.status = status
        if status.lower() == 'resolved':
            complaint.resolved_at = datetime.utcnow()
            complaint.resolved_by = resolved_by
            complaint.resolved_description = resolved_description

        db.session.commit()
        return jsonify({'message': 'Status updated successfully'}), 200

    return jsonify({'message': 'No status provided'}), 400

# NEW: Complaint stats for admin
@app.route('/admin/complaints/stats', methods=['GET'])
@admin_required
def complaint_stats():
    total = Complaint.query.count()
    pending = Complaint.query.filter_by(status='Pending').count()
    resolved = Complaint.query.filter_by(status='Resolved').count()
    return jsonify({
        "total": total,
        "pending": pending,
        "resolved": resolved
    }), 200

# NEW: Search + filter
@app.route('/admin/complaints', methods=['GET'])
@admin_required
def list_complaints_advanced():
    status = request.args.get('status')
    search = request.args.get('search')

    query = Complaint.query
    if status:
        query = query.filter_by(status=status)
    if search:
        query = query.filter(
            Complaint.title.ilike(f"%{search}%") |
            Complaint.user_email.ilike(f"%{search}%")
        )

    complaints = query.all()
    return jsonify([{
        'id': c.id,
        'title': c.title,
        'description': c.description,
        'status': c.status,
        'user_email': c.user_email,
        'created_at': c.created_at.isoformat() if c.created_at else None
    } for c in complaints]), 200

@app.route('/me', methods=['GET'])
@jwt_required()
def me():
    return jsonify(get_jwt_identity()), 200

# DB Initialization
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
