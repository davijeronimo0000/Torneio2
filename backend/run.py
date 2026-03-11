import os
from app import create_app, db
from app.models import Torneio, Time, Jogo, Pagamento, Acesso

app = create_app()

def init_db():
    with app.app_context():
        # Cria as tabelas
        db.create_all()
        print("Banco de dados SQLite inicializado com sucesso!")
        
        # Opcional: Adicionar dados iniciais de teste aqui
        if Torneio.query.count() == 0:
            from datetime import date
            t = Torneio(nome="Torneio Praça José Augusto", local="Quadra José Augusto", data_inicio=date.today())
            db.session.add(t)
            db.session.commit()
            print("Torneio inicial criado!")

if __name__ == '__main__':
    # Inicializa o banco ao rodar o script (apenas para ambiente de desenvolvimento/MVP)
    if not os.path.exists('instance/torneio.db'):
        os.makedirs('instance', exist_ok=True)
        init_db()
        
    app.run(host='0.0.0.0', port=5000, debug=True)
