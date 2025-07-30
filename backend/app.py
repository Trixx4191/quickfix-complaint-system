from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SECRET_KEY'] = 'your_secret_key'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)

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
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401


# Temporary in-memory store
complaints = []

@app.route('/complaints', methods=['POST'])
def create_complaint():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    if not title or not description:
        return jsonify({'message': 'Missing title or description'}), 400

    complaints.append({
        'title': title,
        'description': description
    })

    print(f"New complaint: {title} - {description}")
    return jsonify({'message': 'Complaint created successfully'}), 201

@app.route('/complaints', methods=['GET'])
def list_complaints():
    return jsonify(complaints)

@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    email = data['email']
    password = data['password']
    
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 409

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

# DB Init
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)

