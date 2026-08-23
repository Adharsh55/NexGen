from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import datetime
import hashlib

app = Flask(__name__)
CORS(app)

DB_NAME = "sentinel_database.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Reports table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            raw_text TEXT,
            risk_score INTEGER,
            risk_level TEXT,
            indicators TEXT
        )
    ''')
    
    # Users table for encrypted authentication
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password_hash TEXT,
            clearance TEXT,
            created_at TEXT
        )
    ''')
    
    conn.commit()
    conn.close()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/', methods=['GET'])
def home():
    return "🚀 Sentinel-X Database Backend is Running!"

# --- REPORTS API ---
@app.route('/api/reports', methods=['GET', 'POST'])
def handle_reports():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    if request.method == 'POST':
        data = request.json
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        cursor.execute('''
            INSERT INTO reports (timestamp, raw_text, risk_score, risk_level, indicators)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            now,
            data.get('rawText', ''),
            data.get('riskScore', 88),
            data.get('riskLevel', 'High Risk'),
            ", ".join(data.get('indicators', []))
        ))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Saved to database file successfully!"})
    
    cursor.execute('SELECT * FROM reports ORDER BY id DESC')
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

# --- REGISTRATION API ---
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    clearance = data.get('clearance', 'Level 3 — Lead Commander')
    
    if not email or not password:
        return jsonify({"status": "error", "message": "Email and password required!"}), 400

    hashed_password = hash_password(password)
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    try:
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        cursor.execute('''
            INSERT INTO users (email, password_hash, clearance, created_at)
            VALUES (?, ?, ?, ?)
        ''', (email, hashed_password, clearance, now))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Analyst registered successfully!"})
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"status": "error", "message": "Email already registered!"}), 400

# --- LOGIN API ---
@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    hashed_password = hash_password(password)
    
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()
    
    if not user:
        conn.close()
        return jsonify({"status": "error", "message": "User not found. Please register first!"}), 404
    
    if user['password_hash'] == hashed_password:
        conn.close()
        return jsonify({"status": "success", "message": "Authentication successful!"})
    else:
        conn.close()
        return jsonify({"status": "error", "message": "Invalid password!"}), 401

if __name__ == '__main__':
    init_db()
    print("🚀 Sentinel-X Python Database Server running on http://localhost:5000")
    app.run(port=5000, debug=True)