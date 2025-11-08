# 📚 Documentação do Projeto

Este diretório contém toda a documentação técnica e arquivos de configuração do projeto.

## 📁 Estrutura

```
docs/
├── gtm/                    # Configurações do Google Tag Manager
│   ├── GTM-W4PGS3LR_workspace54.json    # GTM Server-Side Container
│   └── GTM-WCDP2ZLH_workspace34.json    # GTM Web Container
├── tests/                  # Arquivos de teste e exemplos
│   └── TESTE_WEBHOOK_REQBIN_PRONTO.json # Exemplo de payload do webhook Cakto
├── DEPLOYMENT.md           # Guia completo de deploy (Socket.IO vs Serverless)
└── README.md               # Este arquivo
```

---

## 📖 Documentos Principais

### [DEPLOYMENT.md](./DEPLOYMENT.md)
Guia completo para fazer deploy do projeto. Cobre:
- ✅ Deploy no Vercel (Serverless) - **RECOMENDADO**
- ✅ Deploy em VPS/Railway (com Socket.IO)
- ✅ Comparação entre as opções
- ✅ Configuração de variáveis de ambiente
- ✅ Alternativas ao Socket.IO

### [../README.md](../README.md)
README principal do projeto com:
- Visão geral do sistema
- Arquitetura de tracking
- Instruções de instalação
- Guia de uso

### [../SETUP.md](../SETUP.md)
Instruções detalhadas de setup inicial

### [../TROUBLESHOOTING.md](../TROUBLESHOOTING.md)
Soluções para problemas comuns

### [../CHANGELOG.md](../CHANGELOG.md)
Histórico de versões e mudanças

---

## 🏷️ GTM Containers

### Server-Side Container (GTM-W4PGS3LR)
Container do Google Tag Manager Server-Side hospedado em:
- **URL:** https://event.maracujazeropragas.com
- **Função:** Receber eventos do browser e enviar para Facebook CAPI
- **Arquivo:** `gtm/GTM-W4PGS3LR_workspace54.json`

### Web Container (GTM-WCDP2ZLH)
Container do Google Tag Manager Web (client-side)
- **Função:** Capturar eventos do browser e enviar para server-side
- **Arquivo:** `gtm/GTM-WCDP2ZLH_workspace34.json`

#### Como importar containers no GTM:
1. Acesse: https://tagmanager.google.com
2. Vá em **Admin → Import Container**
3. Selecione o arquivo JSON
4. Escolha **Merge** (mesclar) ou **Overwrite** (sobrescrever)
5. Publique o workspace

---

## 🧪 Arquivos de Teste

### Webhook Cakto (TESTE_WEBHOOK_REQBIN_PRONTO.json)
Exemplo de payload enviado pelo Cakto ao webhook `/api/webhook-cakto` após uma compra:

```json
{
  "type": "sale",
  "event": "APPROVED",
  "customer": {
    "email": "cliente@example.com",
    "name": "João Silva",
    "phone": "77998276042"
  },
  "product": {
    "id": "hacr962",
    "name": "Sistema 4 Fases - Ebook Trips",
    "price": 39.90
  }
}
```

**Como testar:**
```bash
# Usando curl
curl -X POST http://localhost:3000/api/webhook-cakto \
  -H "Content-Type: application/json" \
  -d @docs/tests/TESTE_WEBHOOK_REQBIN_PRONTO.json

# Ou usando Postman/Insomnia
# Importe o arquivo JSON como body da requisição
```

---

## 🔧 Ferramentas e Integrações

### Configuradas no Projeto:
- ✅ **Google Tag Manager** (Web + Server-Side)
- ✅ **Facebook Pixel** + **Conversions API**
- ✅ **Sentry** (Error tracking)
- ✅ **Vercel KV** (Redis - storage)
- ✅ **Prisma** (ORM)
- ✅ **Jest** (Testes)
- ✅ **Husky** (Git hooks)

### Para Configurar:
Veja variáveis de ambiente necessárias em: [../.env.example](../.env.example)

---

## 📞 Suporte

Encontrou algo errado na documentação?
- **Email:** maracujalucrativo@gmail.com
- **Crie uma issue** no repositório

---

## 🔗 Links Úteis

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Google Tag Manager](https://tagmanager.google.com)
- [Facebook Events Manager](https://business.facebook.com/events_manager2)
- [Sentry Dashboard](https://sentry.io)
- [Prisma Studio](https://www.prisma.io/studio) - `npx prisma studio`

---

**Última atualização:** 2025-11-08

