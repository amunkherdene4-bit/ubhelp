import sqlite3
from flask import Flask, render_template, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.secret_key = 'ub_association_secret_key' # Session нууцлахад ашиглана

# 1. Өгөгдлийн сангийн тохиргоо
DATABASE = 'database.db'

def get_db_connection():
    """Өгөгдлийн сантай холболт тогтоох функц"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row # Ингэснээр үр дүнг dictionary шиг ашиглаж болно
    return conn

def init_db():
    """Программ анх ачаалахад хүснэгт байхгүй бол үүсгэх функц"""
    if not os.path.exists(DATABASE):
        conn = get_db_connection()
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()
        print("Database and 'users' table created successfully!")

# 2. Үндсэн хуудсыг харуулах
@app.route('/')
def home():
    return render_template('index.html')
    if __name__ == '__main__':
     app.run(debug=True)

# 3. Бүртгүүлэх (Sign Up) функц
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required!"}), 400

    # Нууц үгийг шууд хадгалахгүй, Hash (нууцлал) хийж хадгална
    hashed_password = generate_password_hash(password)

    try:
        conn = get_db_connection()
        conn.execute('INSERT INTO users (email, password) VALUES (?, ?)', (email, hashed_password))
        conn.commit()
        conn.close()
        return jsonify({"message": "Account created! You can now log in."}), 201
    except sqlite3.IntegrityError:
        return jsonify({"message": "This email is already registered!"}), 400

# 4. Нэвтрэх (Login) функц
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()

    # Хэрэглэгч олдсон эсэх болон нууц үг таарч байгааг шалгах
    if user and check_password_hash(user['password'], password):
        session['user_id'] = user['id']
        session['user_email'] = user['email']
        return jsonify({"message": "Welcome back! Login successful."}), 200
    else:
        return jsonify({"message": "Invalid email or password!"}), 401

# 5. Системээс гарах (Logout)
@app.route('/logout')
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

if __name__ == '__main__':
    init_db() # Өгөгдлийн санг шалгаж бэлдэнэ
    app.run(debug=True) # Программыг ажиллуулна