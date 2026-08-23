from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import datetime
import hashlib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import os

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


# ==========================================
# MACHINE LEARNING DATASET TRAINING ON STARTUP
# ==========================================

# Relative path pointing to src/data/Phishing_Email.csv
# for seamless repo sharing
csv_path = os.path.join("src", "data", "Phishing_Email.csv")


if os.path.exists(csv_path):
    print(f"📂 Loading email dataset from '{csv_path}'...")
    df = pd.read_csv(csv_path)
    
    # Safely identify text and label columns
    # regardless of variations in naming
    text_col = None
    
    for col in ['text', 'Email Text', 'body', 'message']:
        if col in df.columns:
            text_col = col
            break
            
    label_col = None
    
    for col in ['label', 'Email Type', 'target', 'spam']:
        if col in df.columns:
            label_col = col
            break
            
    if text_col and label_col:
        X_data = df[text_col].fillna("").astype(str)
        y_data = df[label_col].astype(str)
    else:
        # Fallback to index-based extraction
        # if specific names aren't matched
        X_data = df.iloc[:, 0].fillna("").astype(str)
        y_data = df.iloc[:, 1].astype(str)

else:
    print(
        "⚠️ Dataset not found in 'src/data/'. "
        "Falling back to baseline training set."
    )
    
    X_data = [
        "Congratulations you have won a free iPhone click here",
        "URGENT your bank account is locked verify immediately",
        "Hi team, let's schedule the review meeting for tomorrow",
        "Attached is the weekly status report for our engineering sprint"
    ]
    
    y_data = [
        "spam",
        "spam",
        "not spam",
        "not spam"
    ]


# Train vectorizer and Naive Bayes classifier
vectorizer = TfidfVectorizer(stop_words='english')

X_train = vectorizer.fit_transform(X_data)

spam_model = MultinomialNB()

spam_model.fit(X_train, y_data)

print("🚀 ML Spam Model successfully trained on dataset!")


# ==========================================
# HOME API
# ==========================================

@app.route('/', methods=['GET'])
def home():
    return "🚀 Sentinel-X Database & ML Backend is Running!"


# ==========================================
# REPORTS API
# ==========================================

@app.route('/api/reports', methods=['GET', 'POST'])
def handle_reports():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    if request.method == 'POST':
        data = request.json
        
        now = datetime.datetime.now().strftime(
            "%Y-%m-%d %H:%M"
        )
        
        cursor.execute('''
            INSERT INTO reports (
                timestamp,
                raw_text,
                risk_score,
                risk_level,
                indicators
            )
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
        
        return jsonify({
            "status": "success",
            "message": "Saved to database file successfully!"
        })
    
    cursor.execute(
        'SELECT * FROM reports ORDER BY id DESC'
    )
    
    rows = cursor.fetchall()
    
    conn.close()
    
    return jsonify([
        dict(row) for row in rows
    ])


# ==========================================
# REGISTRATION API
# ==========================================

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    
    email = data.get('email')
    password = data.get('password')
    clearance = data.get(
        'clearance',
        'Level 3 — Lead Commander'
    )
    
    if not email or not password:
        return jsonify({
            "status": "error",
            "message": "Email and password required!"
        }), 400

    hashed_password = hash_password(password)
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    try:
        now = datetime.datetime.now().strftime(
            "%Y-%m-%d %H:%M"
        )
        
        cursor.execute('''
            INSERT INTO users (
                email,
                password_hash,
                clearance,
                created_at
            )
            VALUES (?, ?, ?, ?)
        ''', (
            email,
            hashed_password,
            clearance,
            now
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            "status": "success",
            "message": "Analyst registered successfully!"
        })
        
    except sqlite3.IntegrityError:
        conn.close()
        
        return jsonify({
            "status": "error",
            "message": "Email already registered!"
        }), 400


# ==========================================
# LOGIN API
# ==========================================

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    
    email = data.get('email')
    password = data.get('password')
    
    hashed_password = hash_password(password)
    
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute(
        'SELECT * FROM users WHERE email = ?',
        (email,)
    )
    
    user = cursor.fetchone()
    
    conn.close()
    
    if not user:
        return jsonify({
            "status": "error",
            "message": "User not found. Please register first!"
        }), 404
    
    if user['password_hash'] == hashed_password:
        return jsonify({
            "status": "success",
            "message": "Authentication successful!"
        })
    else:
        return jsonify({
            "status": "error",
            "message": "Invalid password!"
        }), 401


# ==========================================
# ML EMAIL SPAM & PHISHING PERCENTAGE ANALYSIS API
# ==========================================

@app.route('/api/analyze-email', methods=['POST'])
def analyze_email():
    data = request.json
    text = data.get('text', '').strip()
    
    if not text:
        return jsonify({
            "status": "error",
            "message": "No text provided"
        }), 400
        
    # ==========================================
    # SAFE-TEXT HEURISTIC BYPASS
    # ==========================================
    
    # If the text is very short or a standard greeting
    # with no malicious tokens, classify as safe
    
    safe_greetings = [
        "hi",
        "hello",
        "hey",
        "good morning",
        "good evening",
        "greetings"
    ]
    
    if (
        len(text.split()) <= 3
        and text.lower() in safe_greetings
    ):
        return jsonify({
            "status": "success",
            "riskPercentage": 4.5,
            "classification": "SAFE PASS",
            "indicators": [
                "Normal conversational greeting identified."
            ]
        })

    # ==========================================
    # VECTORIZE INPUT TEXT
    # ==========================================
    
    input_vector = vectorizer.transform([text])
    
    # Compute probability
    probabilities = spam_model.predict_proba(
        input_vector
    )[0]
    
    classes = spam_model.classes_
    
    # ==========================================
    # LOCATE SPAM / PHISHING CLASS
    # ==========================================
    
    spam_index = None
    
    for idx, cls in enumerate(classes):
        if str(cls).lower() in [
            'spam',
            '1',
            'phishing',
            'true',
            'unsafe'
        ]:
            spam_index = idx
            break
            
    # ==========================================
    # CALCULATE RISK
    # ==========================================
    
    # Fallback to max probability if label format varies
    spam_probability = (
        probabilities[spam_index]
        if spam_index is not None
        else max(probabilities)
    )
    
    risk_percentage = round(
        float(spam_probability) * 100,
        1
    )
    
    # ==========================================
    # CLASSIFICATION
    # ==========================================
    
    if risk_percentage >= 70:
        classification = "CRITICAL PHISHING THREAT"
        
    elif risk_percentage >= 40:
        classification = "SUSPICIOUS / SPAM"
        
    else:
        classification = "SAFE PASS"
        
    # ==========================================
    # WARNING INDICATORS
    # ==========================================
    
    indicators = []
    
    if risk_percentage > 50:
        indicators.append(
            "High probability match against dataset "
            "spam/phishing signatures."
        )
    
    # Detect external URLs
    if (
        "http://" in text
        or "https://" in text
    ):
        indicators.append(
            "External URL hyperlink detected "
            "in message text."
        )
    
    # Detect suspicious / coercive keywords
    if (
        "urgent" in text.lower()
        or "verify" in text.lower()
        or "click" in text.lower()
        or "account" in text.lower()
    ):
        indicators.append(
            "Coercive or high-urgency psychological "
            "triggers matched."
        )
        
    # If no indicators detected
    if not indicators:
        indicators.append(
            "No structural anomalies or malicious "
            "tokens identified."
        )

    # ==========================================
    # RETURN RESULT
    # ==========================================
    
    return jsonify({
        "status": "success",
        "riskPercentage": risk_percentage,
        "classification": classification,
        "indicators": indicators
    })


# ==========================================
# START SERVER
# ==========================================

if __name__ == '__main__':
    init_db()
    
    print(
        "🚀 Sentinel-X Python Database Server "
        "running on http://localhost:5000"
    )
    
    app.run(
        port=5000,
        debug=True
    )