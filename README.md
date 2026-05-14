# n8n-nodes-digitalsac

[![npm version](https://img.shields.io/npm/v/n8n-nodes-digitalsac.svg)](https://www.npmjs.com/package/n8n-nodes-digitalsac)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-digitalsac.svg)](https://www.npmjs.com/package/n8n-nodes-digitalsac)
[![license](https://img.shields.io/npm/l/n8n-nodes-digitalsac.svg)](LICENSE.md)

Community node for [n8n](https://n8n.io) that integrates with the **Digitalsac Izing Pro** API for WhatsApp messaging, ticket management, scheduling and WhatsApp Business (WABA) templates.

---

## ✨ Features

- 🟢 **WhatsApp** — send text, buttons, lists, carousels, media (file or base64)
- 🎫 **Tickets** — transfer to queue/agent, close, fetch next assignee, transfer to next assignee
- 🏷️ **Tags · Kanbans · Wallets** — list, create, link to tickets
- 📅 **Scheduling** — services, available users, available slots, schedule and cancel appointments, generate `.ics` calendar links
- 💬 **WABA Templates** — list templates and send with **dynamic body, header (TEXT/IMAGE/VIDEO/DOCUMENT) and URL buttons**
- 📲 **Short SMS**
- ✅ Input/output validators (WhatsApp number, CPF, date)

## 🆕 What's new in 1.2.1

- 🔧 **n8n verification compliance**: removed `overrides` field from `package.json`, declared `n8n-workflow` as a `peerDependency`, and the documentation is now English-only

## What's new in 1.2.0

- ✅ **Send WABA Template** now supports fully dynamic payloads:
  - **Header Media URL** (`mediaUrl`) — overrides stored media for `IMAGE`/`VIDEO`/`DOCUMENT` headers
  - **Header Parameters** (`headerParams`) — variables for `TEXT` headers
  - **Button Parameters** (`buttonParams`) — values for URL buttons with placeholders
- 🐛 Fixed: header component was not sent for `IMAGE`/`VIDEO`/`DOCUMENT` templates without `header_text` stored
- 🐛 Static URL buttons no longer send invalid parameters (rejected by Meta)
- 🔁 100% backward compatible — existing workflows keep working unchanged
- 🔧 **n8n verification compliance**: `httpRequestWithAuthentication`, `pairedItem` tracking, `NodeApiError`/`NodeOperationError`, `continueOnFail()` handling, English UI, node `subtitle`, codex file, credential icon and a GitHub Actions publish workflow with NPM provenance

See [`CHANGELOG-1.2.0.md`](./CHANGELOG-1.2.0.md) for details.

## 🚀 Installation

### Via the n8n UI
1. Open **Settings → Community Nodes**
2. Search for `n8n-nodes-digitalsac`
3. Click **Install**

### Via CLI
```bash
npm install -g n8n-nodes-digitalsac
```

If your n8n is installed in a custom directory:
```bash
cd ~/.n8n
npm install n8n-nodes-digitalsac
```

## 🔐 Credentials

Create a **Digitalsac Izing Pro API** credential with:

| Field          | Description                                            | Example                                |
|----------------|--------------------------------------------------------|----------------------------------------|
| API Base URL   | Base URL of your Digitalsac instance (no trailing `/`) | `https://yourdomain.digitalsac.com.br` |
| Bearer Token   | API token issued by Digitalsac                         | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV...` |

The node automatically attaches the `Authorization: Bearer <token>` header on every request via n8n's authenticated HTTP helper.

## ⚙️ Operations overview

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

## 📖 Detailed usage

### Validate WhatsApp
1. Choose **Validate WhatsApp**.
2. Fill **Parameter** with the phone number you want to validate.

### Validate CPF
1. Choose **Validate CPF**.
2. Fill **Parameter** with the CPF number.

### Validate Date
1. Choose **Validate Date**.
2. Fill **Data (JSON)** with:
```json
{ "data": "2024-01-15" }
```

### List Queues / Agents
- **List Queues** and **List Agents** require no extra parameters.
- For **List Agents** you can pick the response format: `Full JSON` (default) or `Formatted Text` (compatibility).

### Transfer to Queue
```json
{ "ticketId": 123, "queueId": 5 }
```

### Transfer to Agent
```json
{ "ticketId": 123, "userId": 10 }
```

### Close Ticket
```json
{ "ticketId": 123 }
```

### Next Assignee in Queue / Transfer to Next Assignee
Both require the **Parameter** field filled with the connection UUID and the JSON body:
```json
{ "queueId": 3, "ticketId": 1201, "method": "S", "allowOffline": false }
```

### Send Message (text or file)
1. Fill **Parameter** with the connection UUID (e.g. `999ab3a2-9f1f-4ffb-969a-bfb72234ece1`).
2. Fill **Message Body**, **Phone Number** (`5511999999999`) and **External Key**.
3. **Optional**: connect a previous node that emits binary data (HTTP Request, Read Binary File, Google Drive, …) and the node will automatically switch to multipart upload (`FormData`).

### Send Buttons
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

### Send List
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

### Send Carousel
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

### Send Media With Caption
1. Connect a node providing binary data.
2. Choose **Send Media With Caption**, fill the connection UUID, **Caption**, **Phone Number** and **External Key**.
3. Supported types: images (JPG/PNG/GIF), documents (PDF/DOC), videos (MP4/AVI), audio (MP3/WAV).

### Send Base64 File
Provide the file as base64, the MIME type, the file name and (optionally) a caption.

To convert a file to base64:
- Linux/macOS: `base64 file.pdf`
- Windows: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("file.pdf"))`

### Tags
- **List Tags** — no extra params.
- **Link Tag** — `{ "ticketId": 123, "tagId": 456 }`.
- **Create Tag** — fill **Tag Name** and **Tag Color** (hex format like `#FF5733`).

### Kanbans
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

### Wallets
- **List Wallets** — no extra params.
- **Link Wallet** — `{ "ticketId": 123, "userId": 456 }`.

### Scheduling

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

### List WABA Templates
Lists all WhatsApp Business templates available for a connection. Fill **WhatsApp ID**.

Sample response:
```json
[
  { "id": "123456789", "name": "welcome", "language": "pt_BR", "category": "MARKETING", "status": "APPROVED", "alreadyImported": true },
  { "id": "987654321", "name": "order_confirmation", "language": "pt_BR", "category": "UTILITY", "status": "APPROVED", "alreadyImported": false }
]
```

### 📤 Send WABA Template (dynamic)

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

### Send Short SMS
Fill **Phone Number** and **SMS Message** to use the `/typebot/enviar_sms` endpoint.

---

## 🧪 Example flows

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

## 💡 Practical use cases

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

## 🤝 Contributing

Issues and pull requests are welcome at [github.com/digitalsac-io/n8n-nodes-digitalsac](https://github.com/digitalsac-io/n8n-nodes-digitalsac).

## 📄 License

[MIT](LICENSE.md). Support: [contato@digitalsac.io](mailto:contato@digitalsac.io).
