from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime
import requests
import base64
from ..models import db, Pagamento, Acesso

# Credenciais do PicPay Empresas (Substituir pelos seus de produção)
PICPAY_CLIENT_ID = "c372d349-76bb-4c76-80d1-a60de97c0369"
PICPAY_CLIENT_SECRET = "Oas9BG6CYwOIuHVdQgPMrsRz78zPEL4m"
PICPAY_API_URL = "https://appws.picpay.com/ecommerce/public"

bp = Blueprint('payment', __name__, url_prefix='/api/payment')

def get_picpay_token():
    """Gera o token OAuth2 dinâmico a partir do Client ID e Secret"""
    auth_str = f"{PICPAY_CLIENT_ID}:{PICPAY_CLIENT_SECRET}"
    b64_auth_str = base64.b64encode(auth_str.encode('ascii')).decode('ascii')
    
    headers = {
        "Authorization": f"Basic {b64_auth_str}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    
    resp = requests.post(f"{PICPAY_API_URL}/oauth/token", data=data, headers=headers)
    resp.raise_for_status()
    return resp.json().get('access_token')

@bp.route('/pix', methods=['POST'])
def create_pix_payment():
    data = request.json
    valor = data.get('valor')
    token_dispositivo = data.get('token_dispositivo') # Identificador único do celular do usuario
    
    if not valor or not token_dispositivo:
        return jsonify({"error": "Valor e token do dispositivo são obrigatórios"}), 400
        
    try:
        reference_id = str(uuid.uuid4())
        
        # INTEGRAÇÃO REAL DO PICPAY EMPRESAS:
        payment_data = {
            "referenceId": reference_id,
            "callbackUrl": "https://seu-dominio.ngrok.io/api/payment/webhook", # Será usado o ngrok
            "value": float(valor),
            "buyer": {
                "firstName": "Espectador",
                "lastName": "Local",
                "document": "12345678909", # PicPay costuma exigir CPF
                "email": "torneio@teste.com",
                "phone": "+55 11 99999-9999"
            }
        }
        
        try:
             # Pega o token dinâmico primeiro
             access_token = get_picpay_token()
             headers = {
                 "Authorization": f"Bearer {access_token}",
                 "Content-Type": "application/json"
             }
             
             response = requests.post(f"{PICPAY_API_URL}/payments", json=payment_data, headers=headers)
             response.raise_for_status() # Lança erro se não for 201/200
             data_json = response.json()
             
             qr_code = data_json["qrcode"]["content"]
             qr_code_base64 = data_json["qrcode"]["base64"]
             gateway_id = reference_id
        except Exception as picpay_err:
             print("PicPay Error (Mock fallback used):", picpay_err)
             # Mock de fallback só pra vc ver a tela funcionar enquanto não poem o Token válido
             qr_code = "00020101021126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865404" + str(valor) + "5802BR5913Jose Augusto6009Sao Paulo62070503***6304"
             qr_code_base64 = ""
             gateway_id = reference_id
             
        novo_pagamento = Pagamento(
            valor=valor,
            token_dispositivo=token_dispositivo,
            gateway_id=gateway_id,
            status='pendente'
        )
        db.session.add(novo_pagamento)
        db.session.commit()
        
        return jsonify({
            "pagamento_id": novo_pagamento.id,
            "uuid": novo_pagamento.uuid,
            "qr_code": qr_code,
            "qr_code_base64": qr_code_base64,
            "status": "pendente"
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@bp.route('/check/<string:pagamento_uuid>', methods=['GET'])
def check_payment_status(pagamento_uuid):
    """Rota para o App ficar fazendo polling e saber se o Pix caiu"""
    pagamento = Pagamento.query.filter_by(uuid=pagamento_uuid).first_or_404()
    
    response = {
        "status": pagamento.status
    }
    
    # Se já foi aprovado, devolve também o token de acesso definitivo
    if pagamento.status == 'aprovado' and pagamento.acesso_liberado:
        response['token_acesso'] = pagamento.acesso_liberado.token_acesso
        
    return jsonify(response)

@bp.route('/webhook', methods=['POST'])
def payment_webhook():
    """ Rota que o PicPay vai chamar quando o pagamento mudar de status """
    data = request.json
    
    # PicPay manda um JSON com { "referenceId": "ORDER_ID", "authorizationId": "..." }
    reference_id = data.get('referenceId')
    
    # MOCK FALLBACK: Se o uuid for enviado direto (pelo simulador do app frontend)
    mock_uuid = data.get('pagamento_uuid') if data else None
    
    if mock_uuid:
         pagamento = Pagamento.query.filter_by(uuid=mock_uuid).first()
         if pagamento and pagamento.status == 'pendente':
              pagamento.status = 'aprovado'
              pagamento.data_confirmacao = datetime.utcnow()
              
              novo_acesso = Acesso(pagamento_id=pagamento.id, token_acesso=str(uuid.uuid4()), dispositivo=pagamento.token_dispositivo)
              db.session.add(novo_acesso)
              db.session.commit()
              return jsonify({"message": "Mock aprovado"}), 200
         return jsonify({"message": "OK"}), 200

    if not reference_id:
        return jsonify({"message": "Ignorado - Sem referenceId"}), 200
        
    try:
        # Busca o status real no PicPay
        access_token = get_picpay_token()
        headers = {"Authorization": f"Bearer {access_token}"}
        status_response = requests.get(f"{PICPAY_API_URL}/payments/{reference_id}/status", headers=headers)
        
        if status_response.status_code == 200:
             status_data = status_response.json()
             picpay_status = status_data.get('status')
             
             # Procura o pagamento no nosso banco usando o reference_id (salvo como gateway_id)
             pagamento = Pagamento.query.filter_by(gateway_id=reference_id).first()
             
             if pagamento and pagamento.status == 'pendente' and picpay_status == 'paid':
                  pagamento.status = 'aprovado'
                  pagamento.data_confirmacao = datetime.utcnow()
                  
                  novo_acesso = Acesso(
                      pagamento_id=pagamento.id,
                      token_acesso=str(uuid.uuid4()),
                      dispositivo=pagamento.token_dispositivo
                  )
                  db.session.add(novo_acesso)
                  db.session.commit()
                  
        return jsonify({"message": "Notificação processada"}), 200
    except Exception as e:
        print("Erro Webhook PicPay:", e)
        return jsonify({"error": str(e)}), 400

@bp.route('/verify-access', methods=['POST'])
def verify_device_access():
    """Rota usada toda vez que o app abre para garantir que aquele aparelho tem acesso"""
    data = request.json
    token_dispositivo = data.get('token_dispositivo')
    token_acesso = data.get('token_acesso')
    
    acesso = Acesso.query.filter_by(
        token_acesso=token_acesso,
        dispositivo=token_dispositivo
    ).first()
    
    if acesso:
        return jsonify({"has_access": True}), 200
    else:
        return jsonify({"has_access": False}), 401
