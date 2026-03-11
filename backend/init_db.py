from app import create_app, db
from app.models import Torneio
from datetime import date
import os

app = create_app()

with app.app_context():
    # Cria as tabelas do banco de dados caso não existam
    db.create_all()
    print("Banco de dados verificado/criado com sucesso.")
    
    # Adicionar dados iniciais de teste se o banco estiver vazio
    if Torneio.query.count() == 0:
        t = Torneio(nome="Torneio Praça José Augusto", local="Quadra José Augusto", data_inicio=date.today())
        db.session.add(t)
        db.session.commit()
        print("Torneio inicial criado!")
