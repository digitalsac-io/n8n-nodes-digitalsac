# n8n-nodes-digitalsac

[![npm version](https://img.shields.io/npm/v/n8n-nodes-digitalsac.svg)](https://www.npmjs.com/package/n8n-nodes-digitalsac)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-digitalsac.svg)](https://www.npmjs.com/package/n8n-nodes-digitalsac)
[![license](https://img.shields.io/npm/l/n8n-nodes-digitalsac.svg)](LICENSE.md)

Community node for [n8n](https://n8n.io) that integrates with the **Digitalsac Izing Pro** API for WhatsApp messaging, ticket management, scheduling and WhatsApp Business (WABA) templates.

> 🇺🇸 [English](#-english) · 🇧🇷 [Português (pt-BR)](#-português-pt-br)

---

## 🇺🇸 English

### ✨ Features

- 🟢 **WhatsApp** — send text, buttons, lists, carousels, media (file or base64)
- 🎫 **Tickets** — transfer to queue/agent, close, fetch next assignee, transfer to next assignee
- 🏷️ **Tags · Kanbans · Wallets** — list, create, link to tickets
- 📅 **Scheduling** — services, available users, available slots, schedule and cancel appointments, generate `.ics` calendar links
- 💬 **WABA Templates** — list templates and send with **dynamic body, header (TEXT/IMAGE/VIDEO/DOCUMENT) and URL buttons**
- 📲 **Short SMS**
- ✅ Input/output validators (WhatsApp number, CPF, date)

### 🆕 What's new in 1.2.0

- ✅ **Send WABA Template** now supports fully dynamic payloads:
  - **Header Media URL** (`mediaUrl`) — overrides stored media for `IMAGE`/`VIDEO`/`DOCUMENT` headers
  - **Header Parameters** (`headerParams`) — variables for `TEXT` headers
  - **Button Parameters** (`buttonParams`) — values for URL buttons with placeholders
- 🐛 Fixed: header component was not sent for `IMAGE`/`VIDEO`/`DOCUMENT` templates without `header_text` stored
- 🐛 Static URL buttons no longer send invalid parameters (rejected by Meta)
- 🔁 100% backward compatible — existing workflows keep working unchanged
- 🔧 **n8n verification compliance**: `httpRequestWithAuthentication`, `pairedItem` tracking, `NodeApiError`/`NodeOperationError`, `continueOnFail()` handling, English UI, node `subtitle`, codex file, credential icon and a GitHub Actions publish workflow with NPM provenance

See [`CHANGELOG-1.2.0.md`](./CHANGELOG-1.2.0.md) for details.

### 🚀 Installation

#### Via the n8n UI
1. Open **Settings → Community Nodes**
2. Search for `n8n-nodes-digitalsac`
3. Click **Install**

#### Via CLI
```bash
npm install -g n8n-nodes-digitalsac
```

If your n8n is installed in a custom directory:
```bash
cd ~/.n8n
npm install n8n-nodes-digitalsac
```

### 🔐 Credentials

Create a **Digitalsac Izing Pro API** credential with:

| Field          | Description                                            | Example                                |
|----------------|--------------------------------------------------------|----------------------------------------|
| API Base URL   | Base URL of your Digitalsac instance (no trailing `/`) | `https://yourdomain.digitalsac.com.br` |
| Bearer Token   | API token issued by Digitalsac                         | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV...` |

The node automatically attaches the `Authorization: Bearer <token>` header on every request via n8n's authenticated HTTP helper.

### ⚙️ Operations overview

| Group              | Operation                                                                                |
|--------------------|------------------------------------------------------------------------------------------|
| Validation         | Validate WhatsApp · Validate CPF · Validate Date                                         |
| Queues / Agents    | List Queues · List Agents · Next Assignee · Transfer to Queue / Agent / Next Assignee    |
| Tickets            | Close Ticket                                                                             |
| Messaging          | Send Message · Send Buttons · Send List · Send Carousel · Send Media With Caption · Send Base64 |
| Tags               | List Tags · Link Tag · Create Tag                                                        |
| Kanbans            | List Kanbans · Link Kanban                                                               |
| Wallets            | List Wallets · Link Wallet                                                               |
| Scheduling         | List Services · List Available Users · List Available Slots · List Schedules · Create Schedule · Cancel Schedule · Calendar Link |
| WABA Templates     | List WABA Templates · **Send WABA Template** (dynamic)                                   |
| SMS                | Send Short SMS                                                                           |

---

### 📖 Detailed usage

#### Validate WhatsApp
1. Choose **Validate WhatsApp**.
2. Fill **Parameter** with the phone number you want to validate.

#### Validate CPF
1. Choose **Validate CPF**.
2. Fill **Parameter** with the CPF number.

#### Validate Date
1. Choose **Validate Date**.
2. Fill **Data (JSON)** with:
```json
{ "data": "2024-01-15" }
```

#### List Queues / Agents
- **List Queues** and **List Agents** require no extra parameters.
- For **List Agents** you can pick the response format: `Full JSON` (default) or `Formatted Text` (compatibility).

#### Transfer to Queue
```json
{ "ticketId": 123, "queueId": 5 }
```

#### Transfer to Agent
```json
{ "ticketId": 123, "userId": 10 }
```

#### Close Ticket
```json
{ "ticketId": 123 }
```

#### Next Assignee in Queue / Transfer to Next Assignee
Both require the **Parameter** field filled with the connection UUID and the JSON body:
```json
{ "queueId": 3, "ticketId": 1201, "method": "S", "allowOffline": false }
```

#### Send Message (text or file)
1. Fill **Parameter** with the connection UUID (e.g. `999ab3a2-9f1f-4ffb-969a-bfb72234ece1`).
2. Fill **Message Body**, **Phone Number** (`5511999999999`) and **External Key**.
3. **Optional**: connect a previous node that emits binary data (HTTP Request, Read Binary File, Google Drive, …) and the node will automatically switch to multipart upload (`FormData`).

#### Send Buttons
Button JSON example:
```json
[
  {
    "tipo": {"label": "Quick Reply", "value": "quick_reply"},
    "display_text": "✅ Yes",
    "conteudo": "yes"
  },
  {
    "tipo": {"label": "Quick Reply", "value": "quick_reply"},
    "display_text": "❌ No",
    "conteudo": "no"
  },
  {
    "tipo": {"label": "URL", "value": "url"},
    "display_text": "🌐 Visit site",
    "conteudo": "https://www.digitalsac.com.br"
  },
  {
    "tipo": {"label": "Copy", "value": "copy"},
    "display_text": "📋 Copy code",
    "conteudo": "PROMO2024"
  },
  {
    "tipo": {"label": "Call", "value": "call"},
    "display_text": "📞 Call now",
    "conteudo": "5511999999999"
  }
]
```

Available button types:
- `quick_reply` — replies are echoed back into the conversation
- `url` — opens a link in the browser
- `copy` — copies text to the clipboard
- `call` — starts a phone call

#### Send List
```json
[
  {
    "title": "🛍️ Products",
    "lines": [
      { "title": "Premium Smartphone", "description": "iPhone 15 Pro Max 256GB", "rowId": 1 },
      { "title": "Gaming Laptop", "description": "Dell Alienware with RTX 4090", "rowId": 2 }
    ]
  },
  {
    "title": "🛠️ Services",
    "lines": [
      { "title": "Tech Support", "description": "Specialized assistance", "rowId": 3 },
      { "title": "Consulting", "description": "Custom consulting", "rowId": 4 }
    ]
  }
]
```

#### Send Carousel
```json
[
  {
    "body": "Starter Plan",
    "footer": "Starting at $49.90",
    "image": { "url": "https://picsum.photos/800/600" },
    "buttons": [
      { "type": "url", "text": "See details", "url": "https://digitalsac.com.br" }
    ]
  },
  {
    "body": "Pro Plan",
    "footer": "Starting at $99.98",
    "image": { "url": "https://picsum.photos/801/600" },
    "buttons": [
      { "type": "reply", "text": "Tell me more", "id": "pro_plan" }
    ]
  }
]
```

#### Send Media With Caption
1. Connect a node providing binary data.
2. Choose **Send Media With Caption**, fill the connection UUID, **Caption**, **Phone Number** and **External Key**.
3. Supported types: images (JPG/PNG/GIF), documents (PDF/DOC), videos (MP4/AVI), audio (MP3/WAV).

#### Send Base64 File
Provide the file as base64, the MIME type, the file name and (optionally) a caption.

To convert a file to base64:
- Linux/macOS: `base64 file.pdf`
- Windows: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("file.pdf"))`

#### Tags
- **List Tags** — no extra params.
- **Link Tag** — `{ "ticketId": 123, "tagId": 456 }`.
- **Create Tag** — fill **Tag Name** and **Tag Color** (hex format like `#FF5733`).

#### Kanbans
- **List Kanbans** — fill **User ID**.
- **Link Kanban** — full payload supported:
```json
{
  "ticketId": 123,
  "kanbanId": 456,
  "userId": 789,
  "value": 500.5,
  "status": "new",
  "kanbanCreatedAt": "2026-03-09T10:00:00Z",
  "shortDesc": "Inbound lead",
  "probability": 70,
  "funnelStatus": "open",
  "expectedCloseAt": "2026-04-01T12:00:00Z",
  "assignedUserId": 12
}
```
Required: `ticketId`, `kanbanId`, `userId`. Everything else is optional.

#### Wallets
- **List Wallets** — no extra params.
- **Link Wallet** — `{ "ticketId": 123, "userId": 456 }`.

#### Scheduling

**List Services** — optional **User ID** to filter services by attendant.

**List Available Users**
- **Service ID**, **Date** (`YYYY-MM-DD`), optional **Time** (`HH:mm`).

**List Available Slots**
- **Service ID**, **User ID**, **Date** (`YYYY-MM-DD`).

**List Schedules**
- **Date** (`YYYY-MM-DD`), optional **User ID**.

**Create Schedule**
| Field                      | Required | Notes                                                       |
|----------------------------|----------|-------------------------------------------------------------|
| Service ID                 | yes      |                                                             |
| User ID                    | yes      |                                                             |
| Date / Time                | yes      | `YYYY-MM-DD` and `HH:mm`                                    |
| Contact Name / Phone       | yes      | Contact is created if it does not exist yet                 |
| Notes                      | no       |                                                             |
| WhatsApp Connection ID     | no       | Defaults to the first available connection                  |
| Custom Message             | no       |                                                             |
| Reminders (minutes)        | no       | Comma separated, e.g. `60,240,1440`                         |
| Interval Duration          | no       | Default `30` minutes                                        |
| Close Ticket After         | no       | Closes the originating ticket on success                    |

Sample response:
```json
{
  "status": 1,
  "mensagem": "Schedule created successfully",
  "scheduleId": 123,
  "contactId": 456,
  "whatsappId": 789
}
```

**Cancel Schedule** — fill **Schedule ID**.

**Generate Calendar Link (.ics)** — fill **Schedule ID**. Returns a downloadable `.ics` URL plus schedule metadata (client, service, date, attendant) so you can:
- send the link directly to the customer,
- trigger an automated `.ics` download,
- import into Google Calendar / Outlook / Apple Calendar.

#### List WABA Templates
Lists all WhatsApp Business templates available for a connection. Fill **WhatsApp ID**.

Sample response:
```json
[
  { "id": "123456789", "name": "welcome", "language": "pt_BR", "category": "MARKETING", "status": "APPROVED", "alreadyImported": true },
  { "id": "987654321", "name": "order_confirmation", "language": "pt_BR", "category": "UTILITY", "status": "APPROVED", "alreadyImported": false }
]
```

#### 📤 Send WABA Template (dynamic)

The most powerful operation in this release. Supports any combination of static template fields, dynamic body variables, dynamic header media or text, and URL button parameters.

**Fields**

| Field                       | Type     | Required | Description                                                                                              |
|-----------------------------|----------|----------|----------------------------------------------------------------------------------------------------------|
| WhatsApp ID                 | number   | yes      | WhatsApp WABA connection ID                                                                              |
| Template ID                 | number   | yes      | Template ID stored in Digitalsac after sync                                                              |
| Phone Number                | string   | yes      | Recipient with country and area code (e.g. `5511999999999`)                                              |
| Body Parameters (JSON)      | json     | no       | Body variables — supports `{"1":"John","2":"123"}` and named keys                                        |
| Header Media URL            | string   | no       | Public URL for `IMAGE`/`VIDEO`/`DOCUMENT` headers — overrides stored media                               |
| Header Parameters (JSON)    | json     | no       | Variables for `TEXT` headers (e.g. `{"1":"April Promotion"}`)                                            |
| Button Parameters (JSON)    | json     | no       | Overrides for dynamic URL buttons — e.g. `[{"index":0,"type":"url","value":"order-123"}]`                |

**Usage scenarios**

1. **Body variables only**
```json
{
  "templateId": 1,
  "phoneNumber": "5511999999999",
  "whatsappId": 10,
  "templateParams": { "1": "John", "2": "9988" }
}
```

2. **Image header dynamic**
```json
{
  "templateId": 1,
  "phoneNumber": "5511999999999",
  "whatsappId": 10,
  "mediaUrl": "https://cdn.example.com/banner.jpg",
  "templateParams": { "1": "John" }
}
```

3. **Image header — fallback to stored media**
```json
{
  "templateId": 1,
  "phoneNumber": "5511999999999",
  "whatsappId": 10
}
```

4. **Document header dynamic**
```json
{
  "templateId": 1,
  "phoneNumber": "5511999999999",
  "whatsappId": 10,
  "mediaUrl": "https://cdn.example.com/contract.pdf"
}
```

5. **Dynamic URL button**
```json
{
  "templateId": 1,
  "phoneNumber": "5511999999999",
  "whatsappId": 10,
  "buttonParams": [
    { "index": 0, "type": "url", "value": "order-123" }
  ]
}
```

6. **Text header with variable**
```json
{
  "templateId": 1,
  "phoneNumber": "5511999999999",
  "whatsappId": 10,
  "headerParams": { "1": "April Promotion" }
}
```

7. **Combined header + body + button**
```json
{
  "templateId": 1,
  "phoneNumber": "5511999999999",
  "whatsappId": 10,
  "mediaUrl": "https://cdn.example.com/banner.jpg",
  "templateParams": { "1": "John", "2": "9988" },
  "buttonParams": [{ "index": 0, "type": "url", "value": "order-123" }]
}
```

**Sample successful response**
```json
{
  "success": true,
  "message": "Template sent successfully",
  "messageId": "wamid.HBgNNTUxMTk4NzY1NDMyMRUCABIYIDNBNjdFRjg5...",
  "templateName": "welcome",
  "recipient": "5511999999999",
  "whatsappId": 3,
  "ticketId": 4521
}
```

**HTTP errors**

| Status | Reason                                                                                            |
|--------|---------------------------------------------------------------------------------------------------|
| 400    | Missing required fields, invalid JSON, template requires media but neither `mediaUrl` nor stored `header_media` is available, invalid button override |
| 404    | Template or WABA connection not found                                                             |
| 500    | Meta Graph API error (full error returned in `details`)                                           |

**Notes**

- Empty optional fields fall back to template-level defaults (full backward compatibility).
- Placeholders `{{1}}`, `{{2}}`, … are replaced from `templateParams` / `headerParams` indexed by number.
- Static URL buttons no longer send invalid `parameters` (Meta would reject them).
- Template language is taken from the stored template; falls back to `pt_BR`.

#### Send Short SMS
Fill **Phone Number** and **SMS Message** to use the `/typebot/enviar_sms` endpoint.

---

### 🧪 Example flows

**Send a PDF to a contact**
1. Read Binary File → reads `report.pdf`.
2. Digitalsac → **Send Message** with the connection UUID and the binary attachment connected.

**Create a tag and link it to a ticket**
1. Digitalsac → **Create Tag** (`Tech Support`, `#2196F3`).
2. Digitalsac → **Link Tag** with `{ "ticketId": 123, "tagId": "{{$json.tagId}}" }`.

**Schedule + close ticket**
1. Webhook captures the lead.
2. Digitalsac → **Create Schedule** with `closeTicket: true`.

**Marketing campaign with WABA template + banner + dynamic URL**
1. Database → list of customers.
2. Loop Over Items.
3. Digitalsac → **Send WABA Template** with `mediaUrl`, `templateParams` and `buttonParams`.

**Order approved notification (WABA)**
```
Webhook (order approved)
    ↓
Digitalsac → List WABA Templates (find confirmation template)
    ↓
Digitalsac → Send WABA Template
    templateParams: {
      "1": "{{$json.customer_name}}",
      "2": "{{$json.order_id}}",
      "3": "{{$json.total}}",
      "4": "{{$json.delivery_date}}"
    }
```

### 💡 Practical use cases

**Interactive support bot**
1. Send Buttons → main menu
2. Send List → product/service catalog
3. Send Media → product images
4. Send Base64 → contracts / documents

**E-commerce automation**
```
Webhook → Send Buttons → Send List (payment methods) → Send Base64 (PDF contract) → Send Media (receipt)
```

**Automated visual reports**
```
Scheduler → HTTP Request → Code (build chart base64) → Send Base64 (visual report)
```

### 🤝 Contributing

Issues and pull requests are welcome at [github.com/digitalsac-io/n8n-nodes-digitalsac](https://github.com/digitalsac-io/n8n-nodes-digitalsac).

### 📄 License

[MIT](LICENSE.md). Support: [contato@digitalsac.io](mailto:contato@digitalsac.io).

---

## 🇧🇷 Português (pt-BR)

Pacote da comunidade para [n8n](https://n8n.io) que integra com a API do **Digitalsac Izing Pro**: mensagens WhatsApp, tickets, agendamento e templates WhatsApp Business (WABA).

### ✨ Funcionalidades

- 🟢 **WhatsApp** — texto, botões, listas, carousel, mídia (arquivo ou base64)
- 🎫 **Tickets** — transferir para fila/atendente, fechar, próximo atendente, transferir para próximo
- 🏷️ **Tags · Kanbans · Carteiras** — listar, criar, vincular a tickets
- 📅 **Agendamento** — serviços, usuários disponíveis, horários, criar/cancelar agendamento, link `.ics`
- 💬 **Templates WABA** — listar e enviar com **body, header (TEXT/IMAGE/VIDEO/DOCUMENT) e botões URL dinâmicos**
- 📲 **SMS Short**
- ✅ Validadores (WhatsApp, CPF, data)

### 🆕 Novidades 1.2.0

- ✅ **Enviar Template WABA** com payload 100% dinâmico:
  - **URL da Mídia do Header** (`mediaUrl`) — sobrescreve a mídia salva
  - **Parâmetros do Header** (`headerParams`) — variáveis para header `TEXT`
  - **Parâmetros de Botões** (`buttonParams`) — valores para botões URL com placeholders
- 🐛 Corrigido: header não era enviado para templates `IMAGE`/`VIDEO`/`DOCUMENT` sem `header_text`
- 🐛 Botões URL estáticos não enviam mais parâmetros indevidos
- 🔁 100% retrocompatível
- 🔧 **Conformidade com verificação n8n:** uso de `httpRequestWithAuthentication`, `pairedItem`, `NodeApiError`, `NodeOperationError`, `continueOnFail()`, UI em inglês, `subtitle`, codex file, ícone na credencial, workflow do GitHub Actions com provenance NPM

Detalhes em [`CHANGELOG-1.2.0.md`](./CHANGELOG-1.2.0.md).

### 🚀 Instalação

**Via UI do n8n**
1. **Configurações → Community Nodes**
2. Pesquise `n8n-nodes-digitalsac`
3. Clique em **Instalar**

**Via CLI**
```bash
npm install -g n8n-nodes-digitalsac
# ou no diretório do n8n
cd ~/.n8n && npm install n8n-nodes-digitalsac
```

### 🔐 Credenciais

| Campo          | Descrição                                              | Exemplo                                |
|----------------|--------------------------------------------------------|----------------------------------------|
| API Base URL   | URL base da sua instância Digitalsac (sem `/` no fim)  | `https://seudominio.digitalsac.com.br` |
| Bearer Token   | Token de API do Digitalsac                             | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV...` |

O node aplica o header `Authorization: Bearer <token>` automaticamente em toda requisição.

### ⚙️ Operações

| Grupo              | Operação                                                                                  |
|--------------------|-------------------------------------------------------------------------------------------|
| Validação          | Validar WhatsApp · Validar CPF · Validar Data                                             |
| Filas/Atendentes   | Listar Filas · Listar Atendentes · Próximo Atendente · Transferir para Fila/Atendente/Próximo |
| Tickets            | Fechar Ticket                                                                             |
| Mensagens          | Enviar Mensagem · Botões · Lista · Carousel · Mídia com Caption · Base64                  |
| Tags               | Listar · Vincular · Criar                                                                 |
| Kanbans            | Listar · Vincular                                                                         |
| Carteiras          | Listar · Vincular                                                                         |
| Agendamento        | Listar Serviços/Usuários/Horários/Agendamentos · Criar/Cancelar · Calendar Link           |
| Templates WABA     | Listar · **Enviar Template WABA** (dinâmico)                                              |
| SMS                | Enviar SMS Short                                                                          |

---

### 📖 Como usar (detalhado)

#### Validar WhatsApp / CPF
1. Selecione a operação correspondente.
2. Preencha **Parameter** com o número de telefone ou CPF.

#### Validar Data
**Data (JSON)**:
```json
{ "data": "2024-01-15" }
```

#### Listar Filas/Atendentes
- **Listar Filas** e **Listar Atendentes** não exigem parâmetros adicionais.
- **Listar Atendentes** permite escolher entre `JSON Completo` (padrão) ou `Texto Formatado` (compatibilidade).

#### Transferir para Fila
```json
{ "ticketId": 123, "queueId": 5 }
```

#### Transferir para Atendente
```json
{ "ticketId": 123, "userId": 10 }
```

#### Fechar Ticket
```json
{ "ticketId": 123 }
```

#### Próximo Atendente / Transferir para Próximo
Ambos exigem **Parameter** com o UUID da conexão e o JSON:
```json
{ "queueId": 3, "ticketId": 1201, "method": "S", "allowOffline": false }
```

#### Enviar Mensagem (texto ou arquivo)
1. **Parameter**: UUID da conexão (ex: `999ab3a2-9f1f-4ffb-969a-bfb72234ece1`).
2. **Corpo da Mensagem**, **Número de Telefone** (`5511999999999`) e **Chave Externa**.
3. **Opcional**: conecte um nó anterior que produza dados binários (HTTP Request, Read Binary File, Google Drive…) — o node detecta e troca automaticamente para upload `FormData`.

#### Enviar Botões
JSON exemplo:
```json
[
  { "tipo": {"label": "Resposta Rápida", "value": "quick_reply"}, "display_text": "✅ Sim", "conteudo": "sim" },
  { "tipo": {"label": "Resposta Rápida", "value": "quick_reply"}, "display_text": "❌ Não", "conteudo": "nao" },
  { "tipo": {"label": "URL", "value": "url"}, "display_text": "🌐 Visitar Site", "conteudo": "https://www.digitalsac.com.br" },
  { "tipo": {"label": "Copiar", "value": "copy"}, "display_text": "📋 Copiar Código", "conteudo": "PROMO2024" },
  { "tipo": {"label": "Ligar", "value": "call"}, "display_text": "📞 Ligar Agora", "conteudo": "5511999999999" }
]
```

Tipos: `quick_reply`, `url`, `copy`, `call`.

#### Enviar Lista
```json
[
  {
    "title": "🛍️ Produtos",
    "lines": [
      { "title": "Smartphone Premium", "description": "iPhone 15 Pro Max 256GB", "rowId": 1 },
      { "title": "Notebook Gamer", "description": "Dell Alienware com RTX 4090", "rowId": 2 }
    ]
  },
  {
    "title": "🛠️ Serviços",
    "lines": [
      { "title": "Suporte Técnico", "description": "Assistência técnica especializada", "rowId": 3 },
      { "title": "Consultoria", "description": "Consultoria personalizada", "rowId": 4 }
    ]
  }
]
```

#### Enviar Carousel
```json
[
  {
    "body": "Plano Starter",
    "footer": "A partir de R$ 49,90",
    "image": { "url": "https://picsum.photos/800/600" },
    "buttons": [
      { "type": "url", "text": "Ver detalhes", "url": "https://digitalsac.com.br" }
    ]
  },
  {
    "body": "Plano Pro",
    "footer": "A partir de R$ 99,98",
    "image": { "url": "https://picsum.photos/801/600" },
    "buttons": [
      { "type": "reply", "text": "Quero saber mais", "id": "plano_pro" }
    ]
  }
]
```

#### Enviar Mídia com Caption
1. Conecte um nó com arquivo binário (HTTP Request, Read Binary File, Google Drive).
2. Selecione **Enviar Mídia com Caption** e preencha UUID, **Caption**, **Número de Telefone** e **Chave Externa**.
3. Tipos suportados: imagens (JPG/PNG/GIF), documentos (PDF/DOC), vídeos (MP4/AVI), áudio (MP3/WAV).

#### Enviar Base64
Forneça o arquivo em base64, o **MIME Type**, o **Nome do Arquivo** e (opcional) caption.

Para gerar base64:
- Linux/macOS: `base64 arquivo.pdf`
- Windows: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("arquivo.pdf"))`

#### Tags
- **Listar Tags** — sem parâmetros.
- **Vincular Tag** — `{ "ticketId": 123, "tagId": 456 }`.
- **Criar Tag** — preencha **Tag Name** e **Tag Color** (hex, ex: `#FF5733`).

#### Kanbans
- **Listar Kanbans** — preencha **User ID**.
- **Vincular Kanban** — payload completo:
```json
{
  "ticketId": 123,
  "kanbanId": 456,
  "userId": 789,
  "value": 500.5,
  "status": "novo",
  "kanbanCreatedAt": "2026-03-09T10:00:00Z",
  "shortDesc": "Lead inbound",
  "probability": 70,
  "funnelStatus": "open",
  "expectedCloseAt": "2026-04-01T12:00:00Z",
  "assignedUserId": 12
}
```
Obrigatórios: `ticketId`, `kanbanId`, `userId`. O resto é opcional.

#### Carteiras
- **Listar Carteiras** — sem parâmetros.
- **Vincular Carteira** — `{ "ticketId": 123, "userId": 456 }`.

#### Agendamento

**Listar Serviços** — opcional **User ID** para filtrar por atendente.

**Listar Usuários Disponíveis** — **Service ID**, **Date** (`YYYY-MM-DD`), opcional **Time** (`HH:mm`).

**Listar Horários Disponíveis** — **Service ID**, **User ID**, **Date** (`YYYY-MM-DD`).

**Listar Agendamentos** — **Date** (`YYYY-MM-DD`), opcional **User ID**.

**Criar Agendamento**

| Campo                        | Obrigatório | Observação                                              |
|------------------------------|-------------|---------------------------------------------------------|
| Service ID                   | sim         |                                                         |
| User ID                      | sim         |                                                         |
| Date / Time                  | sim         | `YYYY-MM-DD` e `HH:mm`                                  |
| Contact Name / Phone         | sim         | Contato é criado caso ainda não exista                  |
| Notes                        | não         |                                                         |
| WhatsApp Connection ID       | não         | Usa a primeira conexão disponível por padrão            |
| Custom Message               | não         |                                                         |
| Reminders (minutes)          | não         | Lista por vírgula (ex: `60,240,1440`)                   |
| Interval Duration            | não         | Padrão `30` minutos                                     |
| Close Ticket After           | não         | Fecha o ticket que originou o agendamento               |

Exemplo de resposta:
```json
{
  "status": 1,
  "mensagem": "Agendamento criado com sucesso",
  "scheduleId": 123,
  "contactId": 456,
  "whatsappId": 789
}
```

**Cancelar Agendamento** — preencha **Schedule ID**.

**Gerar Link do Calendário (.ics)** — preencha **Schedule ID**. Retorna URL para download do `.ics` + metadados (cliente, serviço, data, atendente). Pode ser:
- enviado direto ao cliente,
- baixado automaticamente,
- importado em Google Calendar / Outlook / Apple Calendar.

#### Listar Templates WABA
Preencha **WhatsApp ID**. Retorna lista com `id`, `name`, `language`, `category` (`MARKETING`/`UTILITY`/`AUTHENTICATION`), `status` (`APPROVED`/`PENDING`/`REJECTED`) e `alreadyImported` (se já está sincronizado no sistema).

#### 📤 Enviar Template WABA (dinâmico)

A operação principal desta release. Aceita combinações livres de body dinâmico, header dinâmico (TEXT/IMAGE/VIDEO/DOCUMENT) e botões URL.

**Campos**

| Campo                         | Tipo   | Obrigatório | Descrição                                                                                       |
|-------------------------------|--------|-------------|-------------------------------------------------------------------------------------------------|
| WhatsApp ID                   | number | sim         | ID da conexão WhatsApp WABA                                                                     |
| Template ID                   | number | sim         | ID do template já sincronizado                                                                  |
| Número de Telefone            | string | sim         | DDI+DDD+Número (ex: `5511999999999`)                                                            |
| Parâmetros do Body (JSON)     | json   | não         | Variáveis do body — `{"1":"João","2":"123"}` ou chaves nomeadas                                 |
| URL da Mídia do Header        | string | não         | URL pública para headers `IMAGE`/`VIDEO`/`DOCUMENT` (sobrescreve mídia salva)                   |
| Parâmetros do Header (JSON)   | json   | não         | Variáveis para header `TEXT` (ex: `{"1":"Promoção de Abril"}`)                                  |
| Parâmetros de Botões (JSON)   | json   | não         | Overrides para botões URL dinâmicos (`[{"index":0,"type":"url","value":"pedido-123"}]`)         |

**Exemplos de payload**

1. Apenas body
```json
{ "templateId": 1, "phoneNumber": "5511999999999", "whatsappId": 10, "templateParams": { "1": "João", "2": "9988" } }
```

2. Header IMAGE dinâmico
```json
{ "templateId": 1, "phoneNumber": "5511999999999", "whatsappId": 10, "mediaUrl": "https://cdn.exemplo.com/banner.jpg" }
```

3. Header IMAGE com fallback (usa mídia salva no template)
```json
{ "templateId": 1, "phoneNumber": "5511999999999", "whatsappId": 10 }
```

4. Header DOCUMENT dinâmico
```json
{ "templateId": 1, "phoneNumber": "5511999999999", "whatsappId": 10, "mediaUrl": "https://cdn.exemplo.com/contrato.pdf" }
```

5. Botão URL dinâmico
```json
{
  "templateId": 1,
  "phoneNumber": "5511999999999",
  "whatsappId": 10,
  "buttonParams": [{ "index": 0, "type": "url", "value": "pedido-123" }]
}
```

6. Header TEXT com variável
```json
{ "templateId": 1, "phoneNumber": "5511999999999", "whatsappId": 10, "headerParams": { "1": "Promoção de Abril" } }
```

7. Combinação completa
```json
{
  "templateId": 1,
  "phoneNumber": "5511999999999",
  "whatsappId": 10,
  "mediaUrl": "https://cdn.exemplo.com/banner.jpg",
  "templateParams": { "1": "João", "2": "9988" },
  "buttonParams": [{ "index": 0, "type": "url", "value": "pedido-123" }]
}
```

**Resposta de sucesso**
```json
{
  "success": true,
  "message": "Template enviado com sucesso",
  "messageId": "wamid.HBgNNTUxMTk4NzY1NDMyMRUCABIYIDNBNjdFRjg5...",
  "templateName": "boas_vindas",
  "recipient": "5511999999999",
  "whatsappId": 3,
  "ticketId": 4521
}
```

**Erros HTTP**

| Status | Motivo                                                                                                          |
|--------|-----------------------------------------------------------------------------------------------------------------|
| 400    | Campos obrigatórios faltando, JSON inválido, template exige mídia mas nem `mediaUrl` nem `header_media` existem |
| 404    | Template ou conexão WABA não encontrados                                                                        |
| 500    | Erro retornado pela Graph API da Meta (campo `details`)                                                         |

**Observações**

- Campos opcionais vazios fazem fallback para os defaults do template (retrocompatibilidade total).
- Placeholders `{{1}}`, `{{2}}`, … são substituídos por `templateParams` / `headerParams` indexados por número.
- Botões URL estáticos não enviam mais `parameters` indevidos (a Meta rejeitaria).
- Idioma do template vem do template salvo; fallback para `pt_BR`.

#### Enviar SMS Short
Preencha **Phone Number** e **SMS Message** para usar o endpoint `/typebot/enviar_sms`.

---

### 🧪 Fluxos de exemplo

**Enviar PDF para um contato**
1. Read Binary File → lê `relatorio.pdf`.
2. Digitalsac → **Enviar Mensagem** com UUID da conexão.

**Criar tag e vincular ao ticket**
1. Digitalsac → **Criar Tag** (`Suporte Técnico`, `#2196F3`).
2. Digitalsac → **Vincular Tag** com `{ "ticketId": 123, "tagId": "{{$json.tagId}}" }`.

**Agendamento + fechar ticket**
1. Webhook captura o lead.
2. Digitalsac → **Criar Agendamento** com `closeTicket: true`.

**Campanha WABA com banner + URL dinâmica**
1. Database → lista de clientes.
2. Loop Over Items.
3. Digitalsac → **Enviar Template WABA** com `mediaUrl`, `templateParams` e `buttonParams`.

**Notificação de pedido aprovado (WABA)**
```
Webhook (pedido aprovado)
    ↓
Digitalsac → Listar Templates WABA (achar template de confirmação)
    ↓
Digitalsac → Enviar Template WABA
    templateParams: {
      "1": "{{$json.customer_name}}",
      "2": "{{$json.order_id}}",
      "3": "{{$json.total}}",
      "4": "{{$json.delivery_date}}"
    }
```

### 💡 Casos de uso práticos

**Bot de atendimento interativo**
1. Enviar Botões → menu inicial
2. Enviar Lista → catálogo de produtos/serviços
3. Enviar Mídia → imagens dos produtos
4. Enviar Base64 → contratos / documentos

**E-commerce automation**
```
Webhook → Botões → Lista (formas de pagamento) → Base64 (contrato PDF) → Mídia (comprovante)
```

**Relatórios automatizados**
```
Scheduler → HTTP Request → Code (gera gráfico base64) → Base64 (relatório visual)
```

### 🤝 Contribuindo

Issues e pull requests são bem-vindos em [github.com/digitalsac-io/n8n-nodes-digitalsac](https://github.com/digitalsac-io/n8n-nodes-digitalsac).

### 📄 Licença

[MIT](LICENSE.md). Suporte: [contato@digitalsac.io](mailto:contato@digitalsac.io).
