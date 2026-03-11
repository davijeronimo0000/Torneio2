import requests
import time
import random

BASE_URL = 'http://127.0.0.1:5000/api'

def run_tests():
    print("--- 1. Testando Login Admin ---")
    res = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin", "password": "admin123"})
    assert res.status_code == 200, "Falha no login admin"
    token = res.json()['token']
    headers = {"Authorization": f"Bearer {token}"}
    print("OK - Token obtido:", token[:20] + "...")

    print("--- 2. Criando Times ---")
    rnd = random.randint(1000, 9999)
    res1 = requests.post(f"{BASE_URL}/admin/times", json={"nome": f"Time Teste A {rnd}", "sigla": f"TA{rnd}", "responsavel": "Resp A"}, headers=headers)
    assert res1.status_code == 201
    time1_id = res1.json()['id']
    
    res2 = requests.post(f"{BASE_URL}/admin/times", json={"nome": f"Time Teste B {rnd}", "sigla": f"TB{rnd}", "responsavel": "Resp B"}, headers=headers)
    assert res2.status_code == 201
    time2_id = res2.json()['id']
    print("OK - Times criados IDs:", time1_id, time2_id)

    print("--- 3. Criando Jogo ---")
    res_jogo = requests.post(f"{BASE_URL}/admin/jogos", json={
        "torneio_id": 1, 
        "fase": "Final", 
        "time_a_id": time1_id, 
        "time_b_id": time2_id, 
        "data_hora": "2023-12-01 10:00"
    }, headers=headers)
    assert res_jogo.status_code == 201
    print("OK - Jogo criado ID:", res_jogo.json()['id'])

    print("--- 4. Testando Geração de PIX (Spectator Flow) ---")
    device_token = "meu_device_token_unico_123"
    res_pix = requests.post(f"{BASE_URL}/payment/pix", json={
        "valor": 10,
        "token_dispositivo": device_token
    })
    assert res_pix.status_code == 201
    pagamento_uuid = res_pix.json()['uuid']
    print("OK - PIX gerado. UUID:", pagamento_uuid)

    print("--- 5. Checando Status (Deve ser pendente) ---")
    res_check = requests.get(f"{BASE_URL}/payment/check/{pagamento_uuid}")
    assert res_check.status_code == 200
    assert res_check.json()['status'] == 'pendente'
    print("OK - Status: pendente")

    print("--- 6. Simulando Webhook de Aprovação ---")
    res_hook = requests.post(f"{BASE_URL}/payment/webhook", json={
        "pagamento_uuid": pagamento_uuid,
        "status": "approved"
    })
    assert res_hook.status_code == 200
    print("OK - Webhook processado")

    print("--- 7. Checando Status Novamente (Deve ser aprovado) ---")
    res_check2 = requests.get(f"{BASE_URL}/payment/check/{pagamento_uuid}")
    assert res_check2.status_code == 200
    assert res_check2.json()['status'] == 'aprovado'
    token_acesso = res_check2.json()['token_acesso']
    print("OK - Acesso liberado! Token:", token_acesso)

    print("--- 8. Verificando Acesso via verify-access Endpoint ---")
    res_verify = requests.post(f"{BASE_URL}/payment/verify-access", json={
        "token_acesso": token_acesso,
        "token_dispositivo": device_token
    })
    assert res_verify.status_code == 200
    assert res_verify.json()['has_access'] == True
    print("OK - Acesso confirmado ao device!")

    print("\\nTODOS OS TESTES PASSARAM COM SUCESSO!")

if __name__ == '__main__':
    run_tests()
