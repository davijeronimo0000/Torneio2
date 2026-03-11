import os
from datetime import datetime
from app import create_app, db
from app.models import Torneio, Time, Jogo

app = create_app()

def seed_db():
    with app.app_context():
        # Limpa dados existentes para não duplicar se rodar várias vezes
        db.drop_all()
        db.create_all()
        
        # 1. Cria Torneio
        torneio = Torneio(
            nome="Torneio Praça José Augusto",
            local="Quadra José Augusto, SP",
            data_inicio=datetime.now().date(),
            status="andamento"
        )
        db.session.add(torneio)
        db.session.flush() # Para pegar o ID
        
        # 2. Cria Times
        times_nativos = [
            Time(nome="Os Galácticos", sigla="GAL"),
            Time(nome="Unidos da Praça", sigla="UNI"),
            Time(nome="Vila Nova FC", sigla="VIL"),
            Time(nome="Trovão Azul", sigla="TRO")
        ]
        db.session.add_all(times_nativos)
        db.session.flush()
        
        # 3. Cria Jogos (Um ao vivo, um agendado)
        jogo_ao_vivo = Jogo(
            torneio_id=torneio.id,
            fase="Semifinal",
            time_a_id=times_nativos[0].id,
            time_b_id=times_nativos[1].id,
            placar_a=2,
            placar_b=1,
            status="andamento",
            data_hora=datetime.now()
        )
        
        jogo_agendado = Jogo(
            torneio_id=torneio.id,
            fase="Semifinal",
            time_a_id=times_nativos[2].id,
            time_b_id=times_nativos[3].id,
            placar_a=0,
            placar_b=0,
            status="agendado",
            data_hora=datetime.now()
        )
        
        db.session.add_all([jogo_ao_vivo, jogo_agendado])
        db.session.commit()
        
        print("Banco de dados populado com sucesso!")

if __name__ == '__main__':
    seed_db()
