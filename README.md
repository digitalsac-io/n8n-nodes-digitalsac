# n8n-nodes-digitalsac

Este pacote adiciona um nó personalizado ao n8n para interagir com a API do Digitalsac Izing Pro.

## ⚠️ IMPORTANTE: Compatibilidade de Versões

Este pacote suporta **duas linhas de compatibilidade**:

| n8n Version | Versão do Pacote | Tag NPM | Como Instalar |
|-------------|------------------|---------|---------------|
| **n8n 2.x** | **1.0.3** | `latest` (oficial) | `npm install n8n-nodes-digitalsac` |
| **n8n 1.x** | **0.6.3** | `old` | `npm install n8n-nodes-digitalsac@old` |

- **latest** = compatível com n8n v2 (recomendado).
- **old** = compatível com n8n v1 (legado).

**📖 Leia a documentação completa:** [README-DUAL-VERSION.md](./README-DUAL-VERSION.md)

---

## Funcionalidades

- Validar número de WhatsApp
- Validar CPF
- Validar Data
- Listar Filas
- Listar Atendentes
- Transferir para Fila
- Transferir para Atendente
- Fechar Ticket
- Enviar Mensagem (texto e arquivos)
- **Enviar Botões Interativos**
- **Enviar Listas**
- **Enviar Mídia com Caption**
- **Enviar Arquivo Base64**
- Listar Tags
- Vincular Tag
- Criar Tag
- Listar Kanbans
- Vincular Kanban
- Listar Carteiras
- Vincular Carteira
- **Agendamento:**
  - Listar Serviços
  - Listar Usuários Disponíveis
  - Listar Horários Disponíveis
  - Criar Agendamento
  - Cancelar Agendamento
  - Gerar Link do Calendário (.ics)
- **Templates WABA:**
  - Listar Templates WABA
  - Enviar Template WABA

## Instalação

### Via interface do n8n
1. Vá para **Configurações > Community Nodes**
2. Digite `n8n-nodes-digitalsac` na caixa de pesquisa
3. Clique em **Instalar**

### Via linha de comando
```bash
npm install -g n8n-nodes-digitalsac
```

Ou se você estiver usando o n8n com um diretório específico:
```bash
cd ~/.n8n
npm install n8n-nodes-digitalsac
```

## ✨ Novas Funcionalidades (v0.5.6)

### 📱 Templates WABA
Envie templates pré-aprovados do WhatsApp Business API:
- **Listar Templates WABA**: Busca todos os templates disponíveis na conta WABA
- **Enviar Template WABA**: Envia template com variáveis dinâmicas para contatos

**Benefícios:**
- ✅ Templates aprovados pelo Meta/Facebook
- ✅ Baixo custo de envio
- ✅ Alta taxa de entrega
- ✅ Suporte a variáveis personalizadas
- ✅ Ideais para notificações transacionais

## ✨ Funcionalidades Anteriores (v0.5.1)

### 🔘 Enviar Botões Interativos
Envie mensagens com botões clicáveis:
- **Resposta Rápida**: Botão que responde instantaneamente
- **URL**: Botão que abre links
- **Copiar**: Botão que copia texto
- **Ligar**: Botão que inicia chamada

### 📋 Enviar Listas
Crie menus organizados com:
- Múltiplas seções
- Opções clicáveis
- Descrições detalhadas

### 🖼️ Enviar Mídia com Caption
Envie arquivos com legendas personalizadas:
- Upload direto de arquivos
- Caption obrigatório
- Suporte a imagens, PDFs, vídeos

### 📁 Enviar Base64
Envie arquivos via base64:
- Sem necessidade de upload
- Caption opcional
- Ideal para integração com APIs

## Autenticação

Configure as credenciais Digitalsac com a URL base e seu Bearer Token:
1. Vá para **Credenciais > Criar Nova Credencial**
2. Selecione **Izing Pro Digitalsac API**
3. Preencha:
   - **API Base URL**: URL da sua instalação do Digitalsac (ex: https://seudominio.digitalsac.com.br)
   - **Bearer Token**: Seu token de autenticação

## Como Usar

### Validar WhatsApp
1. Selecione a operação **Validar WhatsApp**
2. No campo **Parâmetro**, insira o número de telefone a ser validado

### Validar CPF
1. Selecione a operação **Validar CPF**
2. No campo **Parâmetro**, insira o CPF a ser validado

### Validar Data
1. Selecione a operação **Validar Data**
2. No campo **Dados (JSON)**, insira os dados no formato:
```json
{
  "data": "string com a data a ser validada"
}
```

### Listar Filas/Atendentes
1. Selecione a operação **Listar Filas** ou **Listar Atendentes**
2. Não é necessário configurar parâmetros adicionais

### Transferir para Fila
1. Selecione a operação **Transferir para Fila**
2. No campo **Dados (JSON)**, insira os dados no formato:
```json
{
  "ticketId": 0,
  "queueId": 0
}
```
Onde:
- `ticketId`: ID do ticket a ser transferido
- `queueId`: ID da fila de destino

### Transferir para Atendente
1. Selecione a operação **Transferir para Atendente**
2. No campo **Dados (JSON)**, insira os dados no formato:
```json
{
  "ticketId": 0,
  "userId": 0
}
```
Onde:
- `ticketId`: ID do ticket a ser transferido
- `userId`: ID do atendente de destino

### Fechar Ticket
1. Selecione a operação **Fechar Ticket**
2. No campo **Dados (JSON)**, insira os dados no formato:
```json
{
  "ticketId": 0
}
```
Onde:
- `ticketId`: ID do ticket a ser fechado

### Enviar Mensagem de Texto
1. Selecione a operação **Enviar Mensagem**
2. No campo **Parâmetro**, insira o UUID da conexão (ex: 999ab3a2-9f1f-4ffb-969a-bfb72234ece1)
3. No campo **Corpo da Mensagem**, insira o texto da mensagem
4. No campo **Número de Telefone**, insira o número no formato DDI+DDD+Número (ex: 5511999999999)
5. No campo **Chave Externa**, insira um identificador único opcional

### Enviar Arquivo
1. Conecte um nó que forneça dados binários (ex: **HTTP Request**, **Read Binary File**, **Google Drive**)
2. Conecte ao nó **Digitalsac**
3. Selecione a operação **Enviar Mensagem**
4. No campo **Parâmetro**, insira o UUID da conexão
5. Preencha os demais campos normalmente
6. O nó detectará automaticamente o arquivo binário e enviará via FormData

**Nota**: O nó detecta automaticamente se há dados binários conectados e escolhe o método correto:
- **Sem arquivo**: Envia como JSON (texto)
- **Com arquivo**: Envia como FormData (arquivo + texto)

### 🔘 Enviar Botões Interativos
1. Selecione a operação **Enviar Botões**
2. No campo **Parâmetro**, insira o UUID da conexão
3. Preencha os campos básicos:
   - **Título**: "Escolha uma opção"
   - **Corpo da Mensagem**: "Clique em uma das opções abaixo:"
   - **Número de Telefone**: "5511999999999"
   - **Chave Externa**: "btn_001"
4. No campo **Botões (JSON)**, configure os botões:

```json
[
  {
    "tipo": {"label": "Resposta Rápida", "value": "quick_reply"},
    "display_text": "✅ Sim",
    "conteudo": "sim"
  },
  {
    "tipo": {"label": "Resposta Rápida", "value": "quick_reply"},
    "display_text": "❌ Não",
    "conteudo": "nao"
  },
  {
    "tipo": {"label": "URL", "value": "url"},
    "display_text": "🌐 Visitar Site",
    "conteudo": "https://www.digitalsac.com.br"
  },
  {
    "tipo": {"label": "Copiar", "value": "copy"},
    "display_text": "📋 Copiar Código",
    "conteudo": "PROMO2024"
  },
  {
    "tipo": {"label": "Ligar", "value": "call"},
    "display_text": "📞 Ligar Agora",
    "conteudo": "5511999999999"
  }
]
```

**Tipos de botão disponíveis:**
- `quick_reply`: Resposta rápida (o texto vai para o chat)
- `url`: Abre um link no navegador
- `copy`: Copia texto para área de transferência
- `call`: Inicia uma chamada telefônica

### 📋 Enviar Lista
1. Selecione a operação **Enviar Lista**
2. No campo **Parâmetro**, insira o UUID da conexão
3. Preencha os campos básicos:
   - **Título**: "Menu de Opções"
   - **Texto**: "Escolha uma categoria:"
   - **Texto do Botão**: "Ver Opções"
   - **Rodapé**: "Powered by DigitalSac"
   - **Número de Telefone**: "5511999999999"
   - **Chave Externa**: "list_001"
4. No campo **Seções (JSON)**, configure as seções:

```json
[
  {
    "title": "🛍️ Produtos",
    "lines": [
      {
        "title": "Smartphone Premium",
        "description": "iPhone 15 Pro Max 256GB",
        "rowId": 1
      },
      {
        "title": "Notebook Gamer",
        "description": "Dell Alienware com RTX 4090",
        "rowId": 2
      }
    ]
  },
  {
    "title": "🛠️ Serviços",
    "lines": [
      {
        "title": "Suporte Técnico",
        "description": "Assistência técnica especializada",
        "rowId": 3
      },
      {
        "title": "Consultoria",
        "description": "Consultoria personalizada",
        "rowId": 4
      }
    ]
  },
  {
    "title": "📞 Contato",
    "lines": [
      {
        "title": "Falar com Vendedor",
        "description": "Atendimento comercial",
        "rowId": 5
      }
    ]
  }
]
```

### 🖼️ Enviar Mídia com Caption
1. **Conecte um nó com arquivo** (ex: HTTP Request, Read Binary File, Google Drive)
2. Conecte ao nó **Digitalsac**
3. Selecione a operação **Enviar Mídia com Caption**
4. No campo **Parâmetro**, insira o UUID da conexão
5. Preencha os campos:
   - **Caption**: "Esta é uma imagem importante do produto"
   - **Número de Telefone**: "5511999999999"
   - **Chave Externa**: "media_001"

**Tipos de arquivo suportados:**
- 🖼️ Imagens: JPG, PNG, GIF
- 📄 Documentos: PDF, DOC, DOCX
- 🎥 Vídeos: MP4, AVI
- 🎵 Áudio: MP3, WAV

### 📁 Enviar Base64
1. Selecione a operação **Enviar Base64**
2. No campo **Parâmetro**, insira o UUID da conexão
3. Preencha os campos:
   - **Caption (Opcional)**: "Documento enviado via API"
   - **Número de Telefone**: "5511999999999"
   - **Arquivo Base64**: Cole o arquivo codificado em base64
   - **Tipo MIME**: "application/pdf" (ou conforme o arquivo)
   - **Nome do Arquivo**: "documento.pdf"
   - **Chave Externa**: "base64_001"

**Exemplo de uso com código base64:**
```json
{
  "caption": "Relatório mensal de vendas",
  "mediaBase64": "JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQo+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmCjAwMDAwMDAwMDkgMDAwMDAgbgowMDAwMDAwMDc0IDAwMDAwIG4KMDAwMDAwMDEyMCAwMDAwMCBuCnRyYWlsZXIKPDwKL1NpemUgNAovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMTc5CiUlRU9G",
  "mimeType": "application/pdf",
  "fileName": "relatorio.pdf"
}
```

**Dica**: Para converter arquivo para base64:
- **Linux/Mac**: `base64 arquivo.pdf`
- **Windows**: Use PowerShell: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("arquivo.pdf"))`
- **Online**: Use conversores como base64encode.org

### Listar Tags
1. Selecione a operação **Listar Tags**
2. Não é necessário configurar parâmetros adicionais

### Vincular Tag
1. Selecione a operação **Vincular Tag**
2. No campo **Dados (JSON)**, insira os dados no formato:
```json
{
  "ticketId": 123,
  "tagId": 456
}
```
Onde:
- `ticketId`: ID do ticket
- `tagId`: ID da tag a ser vinculada

### Criar Tag
1. Selecione a operação **Criar Tag**
2. No campo **Nome da Tag**, insira o nome da tag
3. No campo **Cor da Tag**, insira a cor em formato hexadecimal (ex: #FF5733, #2196F3, #4CAF50)

### Listar Kanbans
1. Selecione a operação **Listar Kanbans**
2. No campo **User ID**, insira o ID do usuário

### Vincular Kanban
1. Selecione a operação **Vincular Kanban**
2. No campo **Dados (JSON)**, insira os dados no formato:
```json
{
  "ticketId": 123,
  "kanbanId": 456,
  "userId": 789
}
```
Onde:
- `ticketId`: ID do ticket
- `kanbanId`: ID do kanban a ser vinculado
- `userId`: ID do usuário

### Listar Carteiras
1. Selecione a operação **Listar Carteiras**
2. Não é necessário configurar parâmetros adicionais

### Vincular Carteira
1. Selecione a operação **Vincular Carteira**
2. No campo **Dados (JSON)**, insira os dados no formato:
```json
{
  "ticketId": 123,
  "userId": 456
}
```
Onde:
- `ticketId`: ID do ticket
- `userId`: ID do usuário da carteira

## Exemplos de Respostas da API

### Transferir para Fila
**Resposta de sucesso:**
```json
{
  "status": 0
}
```

### Transferir para Atendente
**Resposta de sucesso:**
```json
{
  "status": 0
}
```

### Fechar Ticket
**Resposta de sucesso:**
```json
"string"
```

### Validar Data
**Resposta de sucesso:**
```json
{
  "status": 0
}
```

### Criar Tag
**Resposta de sucesso (tag criada):**
```json
{
  "status": 1,
  "tagId": 456
}
```

**Resposta quando tag já existe:**
```json
{
  "status": 2
}
```

**Resposta de erro:**
```json
{
  "status": 0
}
```

### Vincular Tag/Kanban/Carteira
**Resposta de sucesso:**
```json
{
  "status": 0
}
```

## Exemplo de Fluxo

### Enviar PDF para um contato
1. Adicione um nó **Read Binary File**
   - Configure para ler um arquivo PDF
2. Conecte ao nó **Digitalsac**
   - Operação: **Enviar Mensagem**
   - Parâmetro: `999ab3a2-9f1f-4ffb-969a-bfb72234ece1` (seu UUID de conexão)
   - Corpo da Mensagem: `Segue o PDF solicitado`
   - Número de Telefone: `5511999999999`
   - Chave Externa: `pdf_documento_123`

### Transferir ticket para uma fila específica
1. Adicione um nó **Digitalsac**
   - Operação: **Transferir para Fila**
   - Dados (JSON):
   ```json
   {
     "ticketId": 123,
     "queueId": 5
   }
   ```

### Transferir ticket para um atendente específico
1. Adicione um nó **Digitalsac**
   - Operação: **Transferir para Atendente**
   - Dados (JSON):
   ```json
   {
     "ticketId": 123,
     "userId": 10
   }
   ```

### Criar uma tag e vincular a um ticket
1. Adicione um nó **Digitalsac**
   - Operação: **Criar Tag**
   - Nome da Tag: `Suporte Técnico`
   - Cor da Tag: `#2196F3`
2. Conecte a outro nó **Digitalsac**
   - Operação: **Vincular Tag**
   - Dados (JSON):
   ```json
   {
     "ticketId": 123,
     "tagId": "{{$json.tagId}}"
   }
   ```

### Listar kanbans de um usuário e vincular a um ticket
1. Adicione um nó **Digitalsac**
   - Operação: **Listar Kanbans**
   - User ID: `10`
2. Conecte a outro nó **Digitalsac**
   - Operação: **Vincular Kanban**
   - Dados (JSON):
   ```json
   {
     "ticketId": 123,
     "kanbanId": 5,
     "userId": 10
   }
   ```

### Vincular carteira a um ticket
1. Adicione um nó **Digitalsac**
   - Operação: **Vincular Carteira**
   - Dados (JSON):
   ```json
   {
     "ticketId": 123,
     "userId": 15
   }
   ```

### Gerar link de calendário para um agendamento
1. Adicione um nó **Digitalsac**
   - Operação: **Gerar Link do Calendário (.ics)**
   - ID do Agendamento: `123`
2. O retorno pode ser usado para:
   - Enviar o link direto para o cliente
   - Fazer download automático do arquivo .ics
   - Integrar com outros sistemas de calendário

## Funcionalidades de Agendamento

### Listar Serviços
Lista todos os serviços disponíveis para agendamento.
1. Selecione a operação **Listar Serviços**
2. (Opcional) No campo **ID do Usuário**, insira o ID do usuário para filtrar apenas os serviços que ele atende

**Retorno exemplo:**
```json
{
  "servicos": "*1* - Consulta (30min - R$ 100,00)\n*2* - Retorno (15min - R$ 50,00)"
}
```

### Listar Usuários Disponíveis
Lista os usuários/atendentes disponíveis para um serviço em uma data específica.
1. Selecione a operação **Listar Usuários Disponíveis**
2. Preencha:
   - **ID do Serviço**: ID do serviço desejado
   - **Data**: Data no formato YYYY-MM-DD (ex: 2025-08-07)
   - **Horário** (opcional): Horário específico no formato HH:mm (ex: 09:00)

**Retorno exemplo:**
```json
{
  "usuarios": "*28* - João Silva\n*29* - Maria Santos"
}
```

### Listar Horários Disponíveis
Lista os horários disponíveis para um serviço e usuário em uma data específica.
1. Selecione a operação **Listar Horários Disponíveis**
2. Preencha:
   - **ID do Serviço**: ID do serviço desejado
   - **ID do Usuário**: ID do atendente/usuário
   - **Data**: Data no formato YYYY-MM-DD

**Retorno exemplo:**
```json
{
  "horarios": "*1* - 09:00\n*2* - 09:30\n*3* - 10:00\n*4* - 10:30"
}
```

### Criar Agendamento
Cria um novo agendamento no sistema.
1. Selecione a operação **Criar Agendamento**
2. Preencha:
   - **ID do Serviço**: ID do serviço
   - **ID do Usuário**: ID do atendente/usuário
   - **Data**: Data do agendamento (YYYY-MM-DD)
   - **Horário**: Horário do agendamento (HH:mm)
   - **Nome do Contato**: Nome do cliente
   - **Telefone do Contato**: Telefone do cliente (formato: 5511999999999)
   - **Observações** (opcional): Notas sobre o agendamento
   - **ID da Conexão WhatsApp** (opcional): ID da conexão WhatsApp (usa primeira disponível se não informado)
   - **Mensagem Personalizada** (opcional): Mensagem personalizada do agendamento
   - **Lembretes (minutos)**: Lembretes em minutos antes do agendamento (separados por vírgula, ex: 60,240,1440)
   - **Duração do Intervalo (minutos)**: Duração do intervalo em minutos (padrão: 30)
   - **Fechar Ticket**: Se deve fechar o ticket após criar agendamento

**Observações importantes:**
- Se o contato não existir no sistema, ele será criado automaticamente
- Se não informar conexão WhatsApp, será usada a primeira disponível
- Os lembretes são em minutos (60 = 1 hora, 240 = 4 horas, 1440 = 1 dia)

**Retorno exemplo:**
```json
{
  "status": 1,
  "mensagem": "Agendamento criado com sucesso",
  "scheduleId": 123,
  "contactId": 456,
  "whatsappId": 789
}
```

### Cancelar Agendamento
Cancela um agendamento existente.
1. Selecione a operação **Cancelar Agendamento**
2. Preencha:
   - **ID do Agendamento**: ID do agendamento a ser cancelado

**Retorno exemplo:**
```json
{
  "status": 0,
  "mensagem": "Agendamento cancelado com sucesso"
}
```

### Gerar Link do Calendário (.ics)
Gera um link para download do arquivo .ics (calendário) de um agendamento específico.
1. Selecione a operação **Gerar Link do Calendário (.ics)**
2. Preencha:
   - **ID do Agendamento**: ID do agendamento para gerar o link do calendário

**Retorno exemplo:**
```json
{
  "status": 1,
  "link": "https://seudominio.com/schedules/123/ics",
  "scheduleId": 123,
  "info": {
    "cliente": "João Silva",
    "servico": "Consulta Médica",
    "data": "2025-01-15T14:30:00.000Z",
    "funcionario": "Dr. Pedro Santos"
  }
}
```

**Uso do link:**
- O link gerado pode ser usado diretamente para download do arquivo .ics
- O arquivo .ics contém todas as informações do agendamento
- Pode ser importado em qualquer aplicativo de calendário (Google Calendar, Outlook, Apple Calendar, etc.)
- É útil para integração com sistemas externos ou envio para clientes

### 📱 Listar Templates WABA
Lista todos os templates disponíveis na conta WABA (WhatsApp Business API).
1. Selecione a operação **Listar Templates WABA**
2. Preencha:
   - **WhatsApp ID**: ID da conexão WhatsApp WABA

**Retorno exemplo:**
```json
[
  {
    "id": "123456789",
    "name": "boas_vindas",
    "language": "pt_BR",
    "category": "MARKETING",
    "status": "APPROVED",
    "alreadyImported": true
  },
  {
    "id": "987654321",
    "name": "confirmacao_pedido",
    "language": "pt_BR",
    "category": "UTILITY",
    "status": "APPROVED",
    "alreadyImported": false
  }
]
```

**Campos retornados:**
- `id`: ID do template no Facebook Graph API
- `name`: Nome do template
- `language`: Idioma do template
- `category`: Categoria (MARKETING, UTILITY, AUTHENTICATION)
- `status`: Status (APPROVED, PENDING, REJECTED)
- `alreadyImported`: Indica se o template já foi importado no sistema

### 📤 Enviar Template WABA
Envia um template WABA pré-aprovado para um número de WhatsApp.
1. Selecione a operação **Enviar Template WABA**
2. Preencha:
   - **WhatsApp ID**: ID da conexão WhatsApp WABA
   - **Template ID**: ID do template no sistema (obtido após importação)
   - **Número de Telefone**: Número do destinatário com DDI (ex: 5511999999999)
   - **Parâmetros do Template**: JSON com variáveis para substituir no template (opcional)

**Exemplo de parâmetros:**
```json
{
  "nome_cliente": "João Silva",
  "numero_pedido": "12345",
  "data_entrega": "15/01/2025"
}
```

**Retorno exemplo:**
```json
{
  "success": true,
  "message": "Template enviado com sucesso",
  "messageId": "wamid.HBgNNTUxMTk4NzY1NDMyMRUCABIYIDNBNjdFRjg5RjY4OTRDNTA5MDk5",
  "templateName": "boas_vindas",
  "recipient": "5511999999999",
  "whatsappId": 3
}
```

**Observações importantes:**
- Templates WABA precisam ser pré-aprovados pelo Meta/Facebook
- O template deve estar importado no sistema para ser enviado
- Use `listWabaTemplates` para ver quais templates estão disponíveis
- Os parâmetros devem corresponder às variáveis definidas no template
- Templates WABA são ideais para notificações, confirmações e mensagens de marketing

## 💡 Casos de Uso Práticos

### 🤖 Bot de Atendimento Interativo
Combine as novas operações para criar um fluxo completo:

1. **Enviar Botões** → Menu inicial com opções
2. **Enviar Lista** → Catálogo de produtos/serviços  
3. **Enviar Mídia** → Imagens dos produtos
4. **Enviar Base64** → Contratos/documentos

### 🛒 E-commerce Automation
```
Trigger (Webhook) 
    ↓
Enviar Botões (Confirmar pedido?)
    ↓
Enviar Lista (Formas de pagamento)
    ↓
Enviar Base64 (Contrato PDF)
    ↓
Enviar Mídia (Comprovante)
```

### 📊 Relatórios Automatizados
```
Scheduler (Diário)
    ↓
HTTP Request (Buscar dados)
    ↓
Code (Gerar gráfico base64)
    ↓
Enviar Base64 (Relatório visual)
```

### 🎯 Marketing Campaigns
```
Database (Lista clientes)
    ↓
Loop (Para cada cliente)
    ↓
Enviar Botões (CTA personalizado)
    ↓
Webhook (Capturar resposta)
```

### 🔄 Workflow Exemplo Completo
**Cenário**: Venda de produto com confirmação interativa

```
1. Webhook (Novo lead)
    ↓
2. Enviar Botões ("Interesse em comprar?")
    ↓
3. IF (Resposta = "Sim")
    ↓
4. Enviar Lista (Catálogo produtos)
    ↓
5. HTTP Request (Buscar detalhes do produto)
    ↓
6. Enviar Mídia (Foto do produto)
    ↓
7. Enviar Botões ("Fechar pedido?")
    ↓
8. Enviar Base64 (Contrato PDF)
    ↓
9. Webhook (Notificar vendedor)
```

### 📱 Templates WABA
**Cenário**: Notificação de pedido aprovado

```
1. Webhook (Pedido aprovado)
    ↓
2. Listar Templates WABA (Buscar template de confirmação)
    ↓
3. Enviar Template WABA (Notificar cliente)
    ↓
    Parâmetros: {
      "nome_cliente": "{{$json.customer_name}}",
      "numero_pedido": "{{$json.order_id}}",
      "valor_total": "{{$json.total}}",
      "data_entrega": "{{$json.delivery_date}}"
    }
    ↓
4. Database (Registrar envio)
```

**Vantagens dos Templates WABA:**
- ✅ Aprovação prévia do Meta/Facebook
- ✅ Baixo custo de envio
- ✅ Alta taxa de entrega
- ✅ Ideais para notificações transacionais
- ✅ Suporte a variáveis dinâmicas
- ✅ Podem incluir botões e mídia

## Suporte

Para suporte, entre em contato com [contato@digitalsac.io](mailto:contato@digitalsac.io).