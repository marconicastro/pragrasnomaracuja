# 🚀 Setup - Maracuja Zero Pragas

## 📋 Pré-requisitos

- Node.js 18+
- Conta Vercel
- Google Tag Manager (Web + Server-Side)
- Facebook Business Manager
- Cakto (checkout)

---

## 🔧 Instalação

```bash
# 1. Clonar repositório
git clone <repo-url>
cd pragrasnomaracuja

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais

# 4. Rodar em desenvolvimento
npm run dev

# 5. Build para produção
npm run build
```

---

## ⚙️ Variáveis de Ambiente

```env
# Vercel KV (required)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

# Checkout
NEXT_PUBLIC_CAKTO_CHECKOUT_URL=https://pay.cakto.com.br/hacr962_605077

# GTM (optional - já está hardcoded)
NEXT_PUBLIC_GTM_WEB_ID=GTM-WCDP2ZLH
NEXT_PUBLIC_GTM_SERVER_URL=https://gtm.maracujazeropragas.com
```

---

## 📊 GTM Setup

### **GTM Web Container**
- **ID:** GTM-WCDP2ZLH
- **Função:** Captura eventos e envia para Server-Side
- **Tags Facebook:** Desativadas (usa Server-Side)

### **GTM Server-Side Container**
- **ID:** GTM-W4PGS3LR
- **Servidor:** Stape.io
- **Tags Facebook:** 5 tags ativas
  - FB - ViewContent
  - FB - AddToCart
  - FB - InitiateCheckout
  - FB - Lead
  - FB - Purchase

### **Variáveis Críticas (Server-Side)**
```
ed - items → keyPath: "items"
ed - contents → keyPath: "contents"
ed - content_ids → keyPath: "content_ids"
ed - value → keyPath: "value"
ed - currency → keyPath: "currency"
ed - fbc → keyPath: "fbc"
ed - fbp → keyPath: "fbp"
```

---

## 🔄 Fluxo de Tracking

```
USUÁRIO → Frontend (Next.js)
   ↓
   ├→ gtmDataLayer.ts (envia para DataLayer)
   ↓
GTM Web Container (repassa)
   ↓
GTM Server-Side (Stape.io)
   ↓
   ├→ Facebook Conversions API
   ├→ Google Analytics 4
   └→ Outras integrações
```

---

## 🧪 Testar Localmente

```bash
# 1. Abrir com GTM Debug
http://localhost:3000/?gtm_debug=1

# 2. Verificar eventos no console
# - page_view
# - view_item
# - add_to_cart
# - generate_lead
# - begin_checkout

# 3. Verificar no Facebook Events Manager
# - Navegador vs Servidor
# - Deduplicação funcionando
```

---

## 🚀 Deploy

```bash
# Deploy automático via Vercel
git push origin main

# Vercel detecta push e faz deploy automaticamente
# URL: https://www.maracujazeropragas.com
```

---

## 📈 Monitoramento

- **Facebook Events Manager:** Ver eventos em tempo real
- **GTM Preview Mode:** Debug de tags e variáveis
- **Vercel Logs:** Erros de runtime
- **Browser Console:** Eventos do DataLayer

---

## 🆘 Troubleshooting

Ver arquivo `TROUBLESHOOTING.md`

