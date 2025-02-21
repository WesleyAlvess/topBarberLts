salon-app/
├── src/
│   ├── controllers/       # Lógica de cada rota
│   ├── models/            # Modelos do MongoDB
│   ├── routes/            # Definição das rotas
│   ├── config/            # Configurações (BD, Firebase, etc.)
│   ├── utils/             # Funções utilitárias (envio de e-mail, etc.)
│   └── app.js             # Inicialização do Express
├── .env                   # Variáveis de ambiente
├── package.json
└── README.md


Entidades Principais
Usuário (User)

Representa tanto os clientes quanto os donos de salão.

Campos:

id: Identificador único.

name: Nome do usuário.

email: E-mail do usuário.

password: Senha (hash).

role: Papel do usuário (client ou admin).

phone: Telefone de contato.

createdAt: Data de criação.

Salão (Salon)

Representa um salão de beleza.

Campos:

id: Identificador único.

name: Nome do salão.

address: Endereço do salão.

phone: Telefone de contato.

ownerId: ID do usuário que é dono do salão (relacionamento com User).

services: Lista de IDs dos serviços oferecidos (relacionamento com Service).

createdAt: Data de criação.

Serviço (Service)

Representa um serviço oferecido pelo salão.

Campos:

id: Identificador único.

name: Nome do serviço (ex: "Corte de Cabelo").

description: Descrição do serviço.

price: Preço do serviço.

duration: Duração do serviço em minutos.

salonId: ID do salão que oferece o serviço (relacionamento com Salon).

createdAt: Data de criação.

Agendamento (Booking)

Representa um agendamento feito por um cliente.

Campos:

id: Identificador único.

userId: ID do usuário que fez o agendamento (relacionamento com User).

salonId: ID do salão onde o agendamento foi feito (relacionamento com Salon).

serviceId: ID do serviço agendado (relacionamento com Service).

date: Data e hora do agendamento.

status: Status do agendamento (pending, confirmed, canceled).

createdAt: Data de criação.

Notificação (Notification)

Representa uma notificação enviada ao usuário.

Campos:

id: Identificador único.

userId: ID do usuário que recebe a notificação (relacionamento com User).

message: Mensagem da notificação.

read: Indica se a notificação foi lida (true ou false).

createdAt: Data de criação.

Relacionamentos
User ↔ Salon

Um usuário (User) pode ser dono de um ou mais salões (Salon).

Relacionamento: Salon.ownerId → User.id.

Salon ↔ Service

Um salão (Salon) oferece vários serviços (Service).

Relacionamento: Service.salonId → Salon.id.

User ↔ Booking

Um usuário (User) pode fazer vários agendamentos (Booking).

Relacionamento: Booking.userId → User.id.

Salon ↔ Booking

Um salão (Salon) pode ter vários agendamentos (Booking).

Relacionamento: Booking.salonId → Salon.id.

Service ↔ Booking

Um serviço (Service) pode estar associado a vários agendamentos (Booking).

Relacionamento: Booking.serviceId → Service.id.

User ↔ Notification

Um usuário (User) pode receber várias notificações (Notification).

Relacionamento: Notification.userId → User.id.
