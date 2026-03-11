import jwt
from functools import wraps
from flask import request, jsonify, current_app

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'message': 'Token está faltando!'}), 401
            
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            # Em um sistema real, veriicariamos o user no banco. 
            if data.get('role') != 'admin':
                return jsonify({'message': 'Acesso negado!'}), 401
        except Exception as e:
            return jsonify({'message': 'Token é inválido!'}), 401
            
        return f(*args, **kwargs)
        
    return decorated
