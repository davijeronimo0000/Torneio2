Plataforma do Torneio da Quadra José Augusto
1. Visão Geral

Este projeto consiste em uma plataforma digital para acompanhamento do torneio da Quadra José Augusto, patrocinada pela Infacoz.

O objetivo é permitir que espectadores acompanhem o andamento completo do torneio através de um aplicativo mobile, enquanto a organização do evento controla todas as informações por meio de um painel administrativo web.

A plataforma exibirá:

jogos do torneio

placar ao vivo

próximos confrontos

jogos finalizados

chaveamento do torneio

progressão até a final

O acesso do espectador será liberado mediante Pix de apoio, com valor mínimo de R$1,00, podendo o usuário contribuir com um valor maior caso queira apoiar o projeto.

2. Estrutura do Sistema

O sistema será dividido em duas partes principais.

2.1 Aplicativo do Espectador

Os espectadores utilizarão um aplicativo mobile, que exibirá a plataforma do torneio.

Este aplicativo pode funcionar como um app com conteúdo web interno (WebView), o que permite:

desenvolvimento mais rápido

manutenção simplificada

dados salvos dentro do aplicativo

sessão persistente no dispositivo

Funcionalidades do aplicativo

O espectador poderá:

instalar o aplicativo

abrir o app e acessar a tela inicial

escolher um valor de apoio via Pix

gerar QR Code Pix

realizar pagamento

ter o acesso liberado automaticamente

visualizar o jogo atual

acompanhar placar ao vivo

ver próximos jogos

ver jogos finalizados

acompanhar o chaveamento do torneio

2.2 Painel Administrativo

O painel administrativo será um sistema web, utilizado apenas pelos organizadores do torneio.

Funcionalidades do administrador

O administrador poderá:

fazer login no painel

cadastrar o torneio

cadastrar os times participantes

gerar pareamento automático

cadastrar partidas

editar confrontos

atualizar placar ao vivo

encerrar partidas

registrar vencedores

definir confrontos das próximas fases

visualizar pagamentos realizados

visualizar acessos liberados

3. Fluxo do Usuário
3.1 Instalação

O espectador instala o aplicativo do torneio.

3.2 Primeira abertura

Ao abrir o aplicativo, será exibida uma tela explicando o apoio ao torneio.

O usuário poderá selecionar quanto deseja contribuir.

Exemplo de valores:

R$1

R$2

R$5

R$10

outro valor

3.3 Pagamento

Após escolher o valor, o sistema gera:

QR Code Pix

código Pix copia e cola

O usuário realiza o pagamento usando seu banco.

3.4 Confirmação

Após o pagamento ser confirmado:

o sistema libera o acesso

o aplicativo recebe autorização

a plataforma do torneio é exibida

4. Regra de Acesso

O acesso ficará vinculado ao aplicativo instalado no dispositivo.

Regras:

pagamento realizado → acesso liberado

acesso salvo dentro do app

trocar de celular → precisa pagar novamente

limpar dados do app → perde acesso

Isso elimina a necessidade de cadastro tradicional.

5. Telas do Aplicativo
Tela 1 — Boas-vindas

logo do torneio

logo do patrocinador (Infacoz)

mensagem de apoio ao torneio

botão para continuar

Tela 2 — Seleção de valor

O usuário escolhe o valor do Pix.

Tela 3 — Pagamento

Exibe:

QR Code Pix

Pix copia e cola

status do pagamento

Tela 4 — Confirmação

Mensagem de pagamento aprovado.

Tela 5 — Plataforma do torneio

A partir daqui o usuário pode acessar:

jogo atual

próximos jogos

jogos finalizados

chaveamento

6. Telas da Plataforma
Página inicial

Mostra:

jogo atual

placar ao vivo

tempo ou status da partida

Próximos jogos

Lista de confrontos agendados.

Jogos finalizados

Resultados de partidas já encerradas.

Chaveamento

Mostra o avanço do torneio.

Exemplo:

Quartas → Semifinais → Final
7. Estrutura do Banco de Dados
Tabela torneios
id
nome
local
data_inicio
status
Tabela times
id
nome
sigla
responsavel
escudo
Tabela jogos
id
torneio_id
fase
time_a_id
time_b_id
placar_a
placar_b
status
data_hora
vencedor_id
Tabela pagamentos
id
valor
status
data_criacao
data_confirmacao
token_dispositivo
Tabela acessos
id
pagamento_id
token_acesso
dispositivo
data_liberacao
8. Arquitetura do Sistema

A arquitetura do projeto seguirá o seguinte fluxo:

Aplicativo Android
        │
        │
        ▼
API Backend (Flask)
        │
        │
        ▼
Banco de Dados
9. Tecnologias Sugeridas
Aplicativo

Android App usando WebView.

Backend

Python + Flask.

Banco de dados

SQLite ou MySQL.

Painel administrativo

Aplicação web simples.

10. Benefícios do Modelo

Esse modelo traz diversas vantagens:

elimina cadastro tradicional

entrada rápida do usuário

monetização simples

fácil para eventos locais

experiência mais profissional

integração direta com patrocinador

11. Definição do Projeto

Uma plataforma mobile patrocinada pela Infacoz para acompanhamento completo do torneio da Quadra José Augusto, com acesso liberado via Pix de apoio e painel administrativo para controle manual das partidas.
