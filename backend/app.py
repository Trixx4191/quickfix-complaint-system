from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate 

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SECRET_KEY'] = 'your_secret_key'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)

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


# Routes
@app.route('/')
def home():
    return {"status": "QuickFix API Running"}



@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    
    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        return jsonify({
            'message': 'Login successful',
            'role': user.role
        }), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# Create a complaint
@app.route('/complaints', methods=['POST'])
def create_complaint():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    email = data.get('email', 'anonymous@example.com')  # Add user tracking

    if not title or not description:
        return jsonify({'message': 'Missing title or description'}), 400

    complaint = Complaint(title=title, description=description, user_email=email)
    db.session.add(complaint)
    db.session.commit()

    return jsonify({'message': 'Complaint created successfully'}), 201


@app.route('/complaints', methods=['GET'])
def list_complaints():
    complaints = Complaint.query.all()
    return jsonify([
        {
            'id': c.id,
            'title': c.title,
            'description': c.description,
            'status': c.status,
            'user_email': c.user_email

        } for c in complaints
    ])

@app.route('/complaints/<int:id>', methods=['PATCH'])
def update_complaint_status(id):
    data = request.get_json()
    status = data.get('status')
    if not status:
        return jsonify({'message': 'Missing status'}), 400

    complaint = Complaint.query.get_or_404(id)
    complaint.status = status
    db.session.commit()

    return jsonify({'message': 'Status updated successfully'})


@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    email = data['email']
    password = data['password']
    role = data.get('role', 'user')  

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 409

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password=hashed_pw, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

# DB Init
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)


