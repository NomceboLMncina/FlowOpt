import os
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from dotenv import load_dotenv
import bcrypt
import json

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'dev-fallback-key')

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# User model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Helper functions
def get_user_data_file():
    if not current_user.is_authenticated:
        return None
    user_dir = os.path.join('data', str(current_user.id))
    os.makedirs(user_dir, exist_ok=True)
    return os.path.join(user_dir, 'workflows.json')

def load_workflows():
    data_file = get_user_data_file()
    if not data_file:
        return []
    try:
        with open(data_file, 'r') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_workflows(workflows):
    data_file = get_user_data_file()
    if data_file:
        with open(data_file, 'w') as file:
            json.dump(workflows, file, indent=4)

# Authentication routes
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        
        if not username or not password:
            flash('Both username and password are required', 'error')
            return redirect(url_for('login'))
        
        user = User.query.filter_by(username=username).first()
        
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password):
            login_user(user)
            return redirect(url_for('home'))
        
        flash('Invalid username or password', 'error')
        return redirect(url_for('login'))
    
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        
        # Validation
        if not username or not password:
            flash('Username and password are required', 'error')
            return redirect(url_for('signup'))
        
        if len(username) < 3:
            flash('Username must be at least 3 characters', 'error')
            return redirect(url_for('signup'))
            
        if len(password) < 6:
            flash('Password must be at least 6 characters', 'error')
            return redirect(url_for('signup'))

        # Check for existing user
        if User.query.filter_by(username=username).first():
            flash('Username already exists', 'error')
            return redirect(url_for('signup'))
            
        try:
            # Create and save new user
            hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            new_user = User(username=username, password=hashed_pw)
            db.session.add(new_user)
            db.session.commit()
            
            # Create user data directory
            user_dir = os.path.join('data', str(new_user.id))
            os.makedirs(user_dir, exist_ok=True)
            
            flash('Account created successfully! Please login.', 'success')
            return redirect(url_for('login'))
            
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Signup error: {str(e)}")
            flash('Could not create account. Please try again.', 'error')
            return redirect(url_for('signup'))
    
    return render_template('signup.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

# Task management routes
@app.route('/')
@login_required
def home():
    return render_template('index.html')

@app.route('/settings')
@login_required
def settings():
    return render_template('settings.html')

@app.route('/add_task', methods=['POST'])
@login_required
def add_task():
    try:
        data = request.json
        if not data or not data.get('name'):
            return jsonify({"error": "Task name is required"}), 400
            
        workflows = load_workflows()
        workflows.append(data)
        save_workflows(workflows)
        return jsonify({"message": "Task added successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_tasks', methods=['GET'])
@login_required
def get_tasks():
    try:
        return jsonify(load_workflows())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/delete_task', methods=['POST'])
@login_required
def delete_task():
    try:
        task_name = request.json.get('name')
        if not task_name:
            return jsonify({"error": "Task name is required"}), 400
            
        workflows = [task for task in load_workflows() if task.get('name') != task_name]
        save_workflows(workflows)
        return jsonify({"message": "Task deleted successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/clear_tasks', methods=['POST'])
@login_required
def clear_tasks():
    try:
        save_workflows([])
        return jsonify({"message": "All tasks cleared successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/import_tasks', methods=['POST'])
@login_required
def import_tasks():
    try:
        if not isinstance(request.json, list):
            return jsonify({"error": "Invalid data format"}), 400
            
        save_workflows(request.json)
        return jsonify({"message": "Tasks imported successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Initialize database
def initialize_database():
    with app.app_context():
        db.create_all()
        # Create data directory if it doesn't exist
        if not os.path.exists('data'):
            os.makedirs('data')

if __name__ == '__main__':
    initialize_database()
    app.run(debug=True)
