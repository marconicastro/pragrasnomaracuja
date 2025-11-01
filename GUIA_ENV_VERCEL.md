# ?? Guia: Como Configurar Environment Variables na Vercel

## ?? Vari?veis Dispon?veis

Criei 2 arquivos para voc?:

1. **`.env.example`** - Template seguro (pode versionar no Git)
2. **`.env.production`** - Com valores REAIS (N?O versionar! Apenas para copiar)

---

## ?? M?todo 1: Importar via Dashboard Vercel (RECOMENDADO)

### Passo a Passo:

1. **Abra o arquivo `.env.production`** que criei

2. **Copie TODO o conte?do** (menos as linhas comentadas com #)

3. **Acesse a Vercel:**
   - https://vercel.com/dashboard
   - Selecione seu projeto: **pragrasnomaracuja**
   - Settings ? Environment Variables

4. **Adicione cada vari?vel manualmente:**

   | Variable Name | Value | Environments |
   |--------------|-------|--------------|
   | `NEXT_PUBLIC_META_PIXEL_ID` | `642933108377475` | ? Production, ? Preview, ? Development |
   | `NEXT_PUBLIC_STAPE_CONTAINER_URL` | `https://capig.maracujazeropragas.com` | ? Production, ? Preview, ? Development |
   | `NEXT_PUBLIC_CAKTO_CHECKOUT_URL` | `https://pay.cakto.com.br/hacr962_605077` | ? Production, ? Preview, ? Development |
   | `CAKTO_WEBHOOK_SECRET` | `12f4848f-35e9-41a8-8da4-1032642e3e89` | ? Production |
   | `META_ACCESS_TOKEN` | (obter depois) | ? Production |

5. **Save** - A Vercel vai fazer redeploy autom?tico!

---

## ?? M?todo 2: Via Vercel CLI (Mais R?pido!)

Se voc? tem o Vercel CLI instalado:

### 1. Instalar Vercel CLI (se n?o tiver):
```bash
npm i -g vercel
```

### 2. Fazer login:
```bash
vercel login
```

### 3. Adicionar vari?veis de uma vez:

**Crie um arquivo tempor?rio** `temp-env.txt` com:
```
NEXT_PUBLIC_META_PIXEL_ID=642933108377475
NEXT_PUBLIC_STAPE_CONTAINER_URL=https://capig.maracujazeropragas.com
NEXT_PUBLIC_CAKTO_CHECKOUT_URL=https://pay.cakto.com.br/hacr962_605077
CAKTO_WEBHOOK_SECRET=12f4848f-35e9-41a8-8da4-1032642e3e89
```

**Execute:**
```bash
# Production
vercel env add NEXT_PUBLIC_META_PIXEL_ID production < temp-env.txt

# Ou adicione uma por uma:
vercel env add NEXT_PUBLIC_META_PIXEL_ID production
# Cole o valor quando solicitado: 642933108377475

vercel env add NEXT_PUBLIC_STAPE_CONTAINER_URL production
# Cole: https://capig.maracujazeropragas.com

vercel env add NEXT_PUBLIC_CAKTO_CHECKOUT_URL production
# Cole: https://pay.cakto.com.br/hacr962_605077

vercel env add CAKTO_WEBHOOK_SECRET production
# Cole: 12f4848f-35e9-41a8-8da4-1032642e3e89
```

**Depois delete o arquivo tempor?rio:**
```bash
rm temp-env.txt
```

---

## ?? Criar Vercel KV (Redis)

**IMPORTANTE:** Fa?a isso ANTES de configurar as env vars ou LOGO DEPOIS!

### Passo a Passo:

1. **Vercel Dashboard** ? Seu Projeto ? **Storage** tab

2. **Create Database** ? **KV** (Redis)

3. **Configura??es:**
   - Name: `maracuja-tracking`
   - Region: **Washington D.C. (iad1)** (ou mais pr?xima do Brasil)
   - Click: **Create**

4. **Conectar ao Projeto:**
   - Select Project: `pragrasnomaracuja`
   - Environment: ? Production, ? Preview, ? Development
   - Click: **Connect**

5. **Pronto!** A Vercel adiciona automaticamente:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`
   - `KV_URL`

---

## ?? Como Obter META_ACCESS_TOKEN (Opcional)

**Quando configurar:** Depois que tudo estiver funcionando

**Onde obter:**

1. **Acesse:** https://business.facebook.com/settings/system-users

2. **Add System User:**
   - Name: `Stape CAPI`
   - Role: `Employee`

3. **Add Assets:**
   - Click no System User criado
   - Add Assets ? Pixels
   - Select Pixel: `642933108377475`
   - Permissions: `Full Control`

4. **Generate Token:**
   - Click: **Generate New Token**
   - App: `Choose any` (ou Create New App)
   - Permissions:
     - ? `ads_management`
     - ? `business_management`
   - Token Expiration: `Never` (recomendado)
   - Click: **Generate Token**

5. **Copiar Token:**
   - **COPIE AGORA!** (N?o ser? mostrado novamente)
   - Adicione na Vercel:
     ```
     META_ACCESS_TOKEN=EAABsb...seu_token_aqui
     ```

---

## ? Verificar Se Funcionou

### 1. Build Success
```bash
# Vercel Dashboard ? Deployments ? Latest
# Status: ? Ready
```

### 2. Teste os Endpoints:

**Health Check do Webhook:**
```bash
curl https://maracujazeropragas.com/api/webhook-cakto
```

**Esperado:**
```json
{
  "status": "ok",
  "endpoint": "/api/webhook-cakto",
  "message": "Webhook Cakto endpoint is running",
  "config": {
    "hasSecret": true,
    "hasStapeUrl": true,
    "hasPixelId": true
  }
}
```

### 3. Verificar Vercel KV:
```bash
# Vercel Dashboard ? Storage ? KV ? Data Browser
# Deve estar vazio inicialmente (ser? populado quando houver Leads)
```

### 4. Testar no Site:
1. Abra: https://maracujazeropragas.com
2. Aceite cookies
3. Abra Console (F12)
4. Deve ver: `?? ELITE Meta Pixel inicializado`

---

## ?? Troubleshooting

### Erro: "Environment variable not found"

**Solu??o:**
- Vercel ? Settings ? Environment Variables
- Verifique se todas as 4-5 vari?veis est?o l?
- Se n?o estiverem, adicione manualmente

### Erro: "KV is not defined"

**Solu??o:**
- Voc? n?o criou o Vercel KV ainda
- Siga a se??o "Criar Vercel KV" acima
- Aguarde 1-2 minutos ap?s criar
- Redeploy (Settings ? Deployments ? Redeploy)

### Erro: "Webhook secret not configured"

**Solu??o:**
```
Vercel ? Settings ? Environment Variables
Add: CAKTO_WEBHOOK_SECRET = 12f4848f-35e9-41a8-8da4-1032642e3e89
Environment: Production
Save ? Redeploy
```

---

## ?? Webhook Cakto - Configura??o Final

**Quando configurar:** Depois que o deploy estiver OK

1. **Acesse:** https://app.cakto.com.br
2. **Produtos** ? Seu Produto ? **Configura??es** ? **Webhooks**
3. **Adicionar Webhook:**
   - URL: `https://maracujazeropragas.com/api/webhook-cakto`
   - Secret: `12f4848f-35e9-41a8-8da4-1032642e3e89`
   - Eventos: ? `purchase_approved`
   - Click: **Salvar**

---

## ?? Checklist Final

```
? Todas as env vars adicionadas na Vercel
? Vercel KV criado e conectado
? Deploy com status Ready
? Health check do webhook OK
? Site carregando normalmente
? Meta Pixel inicializando (console do browser)
? Webhook Cakto configurado
? (Opcional) META_ACCESS_TOKEN configurado
```

---

## ?? Refer?ncias

- **Documenta??o Completa:** `IMPLEMENTACAO_COMPLETA.md`
- **Tarefas Pendentes:** `TAREFAS_PENDENTES.md`
- **An?lise T?cnica:** `ANALISE_ESTRUTURA_TRACKING.md`

---

**Tempo Estimado:** 10-15 minutos para configurar tudo! ??
