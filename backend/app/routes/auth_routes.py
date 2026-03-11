from flask import Blueprint, request, jsonify, current_app
import jwt
from datetime import datetime, timedelta

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Usuário Admin Estático (Pode ser migrado para o banco se necessário)
ADMIN_USER = "admin"
ADMIN_PASS = "Francisco25@"

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Preencha usuário e senha!'}), 400
        
    if data['username'] == ADMIN_USER and data['password'] == ADMIN_PASS:
        token = jwt.encode({
            'user': data['username'],
            'role': 'admin',
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, current_app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({'token': token})
        
    return jsonify({'message': 'Credenciais inválidas!'}), 401
