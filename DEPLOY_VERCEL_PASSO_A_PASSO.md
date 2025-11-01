# ?? DEPLOY VERCEL - Passo a Passo Completo

## ? Guia Definitivo para Deploy do Sistema Elite

**Tempo total:** ~30 minutos  
**Dificuldade:** F?cil (com este guia!)

---

## ?? CHECKLIST COMPLETO

```
?? 1. Adicionar @vercel/kv ao projeto (2 min)
?? 2. Integrar frontend (copy-paste) (5 min)
?? 3. Configurar Vercel KV (5 min)
?? 4. Configurar vari?veis de ambiente Vercel (5 min)
?? 5. Deploy (5 min)
?? 6. Configurar webhook Cakto (5 min)
?? 7. Testar (3 min)

Total: ~30 minutos
```

---

## 1?? Adicionar @vercel/kv ao Projeto (2 min)

### Comando:

```bash
npm install @vercel/kv
```

**Pronto!** ?

---

## 2?? Integrar Frontend (5 min)

### Arquivo: `src/app/page.tsx`

**Localiza??o:** Procure por `await trackLeadElite(trackingUserData);` (linha ~232)

**Cole este c?digo LOGO AP?S:**

```typescript
// Salvar fbp/fbc no banco para Offline Conversions
try {
  const { getMetaCookies } = await import('@/lib/advancedDataPersistence');
  const metaCookies = getMetaCookies();
  
  await fetch('/api/save-tracking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: formData.email,
      fbp: metaCookies.fbp,
      fbc: metaCookies.fbc,
      firstName: trackingUserData.firstName,
      lastName: trackingUserData.lastName,
      phone: trackingUserData.phone,
      city: trackingUserData.city,
      state: trackingUserData.state,
      zip: trackingUserData.zip
    })
  });
  
  console.log('? fbp/fbc salvos no banco');
} catch (error) {
  console.error('?? Erro ao salvar tracking:', error);
}
```

**Pronto!** ?

---

## 3?? Configurar Vercel KV (5 min)

### No Painel da Vercel:

```
1. https://vercel.com/dashboard
2. Seu projeto ? Storage
3. Clicar em "Create Database"
4. Selecionar "KV" (Redis)
5. Nome: "maracuja-tracking" (ou qualquer nome)
6. Create

? Vercel cria automaticamente as vari?veis:
   - KV_REST_API_URL
   - KV_REST_API_TOKEN
   - KV_REST_API_READ_ONLY_TOKEN
   - KV_URL
```

**N?o precisa configurar nada manualmente!** Vercel faz automaticamente! ?

---

## 4?? Configurar Vari?veis de Ambiente Vercel (5 min)

### No Painel da Vercel:

```
1. https://vercel.com/dashboard
2. Seu projeto ? Settings ? Environment Variables
3. Adicionar as seguintes vari?veis:
```

### Vari?veis para Adicionar:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `NEXT_PUBLIC_META_PIXEL_ID` | `642933108377475` | Production, Preview, Development |
| `NEXT_PUBLIC_STAPE_CONTAINER_URL` | `https://capig.maracujazeropragas.com` | Production, Preview, Development |
| `CAKTO_WEBHOOK_SECRET` | `12f4848f-35e9-41a8-8da4-1032642e3e89` | Production |
| `NEXT_PUBLIC_CAKTO_CHECKOUT_URL` | `https://pay.cakto.com.br/hacr962_605077` | Production, Preview, Development |
| `META_ACCESS_TOKEN` | `seu_token_meta_aqui` | Production |

### Como Obter META_ACCESS_TOKEN:

```
1. https://business.facebook.com/settings/system-users
2. Criar System User (se n?o tiver)
3. Assign Assets ? Add Pixel (642933108377475)
4. Generate Token:
   - Permissions: ads_management, business_management
   - Copiar token
5. Colar em META_ACCESS_TOKEN na Vercel
```

**Nota:** Vercel KV (KV_REST_API_URL, etc) ? criado automaticamente no passo 3!

---

## 5?? Deploy (5 min)

### M?todo A: Push para Git (Recomendado)

```bash
# Commit suas mudan?as
git add .
git commit -m "feat: implementar offline conversions com Vercel KV"
git push

# Vercel detecta e faz deploy autom?tico!
```

### M?todo B: Deploy Manual

```bash
# Instalar Vercel CLI (se n?o tiver)
npm i -g vercel

# Deploy
vercel --prod
```

**Aguardar:** ~2-5 minutos para build completar

---

## 6?? Configurar Webhook na Cakto (5 min)

### Na Cakto:

```
1. Login: https://app.cakto.com.br
2. Produtos ? Seu Produto
3. Configura??es ? Webhooks
4. Adicionar novo webhook:
   
   URL: https://maracujazeropragas.com/api/webhook-cakto
   
   Secret: 12f4848f-35e9-41a8-8da4-1032642e3e89
   
   Eventos: ? purchase_approved
   
5. Salvar
```

**Pronto!** ?

---

## 7?? Testar Tudo (3 min)

### A. Health Check

```bash
curl https://maracujazeropragas.com/api/webhook-cakto

# Deve retornar:
{
  "status": "ok",
  "config": {
    "hasSecret": true,
    "hasStapeUrl": true,
    "hasPixelId": true
  }
}
```

### B. Teste Frontend

```
1. Abrir https://maracujazeropragas.com
2. Aceitar cookies
3. Preencher formul?rio
4. Console (F12) deve mostrar:
   ? fbp/fbc salvos no banco
```

### C. Verificar Vercel KV

```
1. Vercel Dashboard ? Storage ? KV
2. Data Browser
3. Procurar por: user:email:seu@email.com
4. Deve ter: fbp, fbc, firstName, etc
```

### D. Teste Webhook (Compra Real ou Simulada)

```
Op??o 1: Compra real no checkout
Op??o 2: Webhook de teste da Cakto (se tiver)
Op??o 3: curl simulando webhook (ver abaixo)
```

**Simular webhook:**

```bash
curl -X POST https://maracujazeropragas.com/api/webhook-cakto \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "12f4848f-35e9-41a8-8da4-1032642e3e89",
    "event": "purchase_approved",
    "data": {
      "refId": "TEST123",
      "customer": {
        "name": "Teste Usuario",
        "email": "teste@test.com",
        "phone": "11999999999"
      },
      "offer": {"id": "test", "name": "Test", "price": 39.9},
      "product": {"name": "Test", "id": "test", "short_id": "test", "supportEmail": "test@test.com", "type": "unique", "invoiceDescription": ""},
      "status": "paid",
      "amount": 39.9,
      "baseAmount": 39.9,
      "fees": 5,
      "paymentMethod": "pix",
      "installments": 1,
      "createdAt": "2024-01-01T00:00:00Z",
      "paidAt": "2024-01-01T00:00:00Z"
    }
  }'
```

**Ver logs na Vercel:**

```
1. Vercel Dashboard ? Seu Projeto
2. Logs (tab superior)
3. Filtrar por "webhook-cakto"
4. Deve ver: "User data encontrado" ou "n?o encontrado"
```

---

## ?? VALIDA??O FINAL

### Checklist de Sucesso:

```
? Site carregando
? Consent banner aparece
? Meta Pixel carrega (console)
? PageView com EQM 7.5+
? Formul?rio funciona
? Lead com EQM 9.5-10.0
? fbp/fbc salvos no Vercel KV
? Webhook responde (health check)
? Purchase enviado quando webhook chega
? Meta Events Manager mostra Purchase
? Atribui??o correta (fbp/fbc presente)
```

---

## ?? Troubleshooting

### Erro: "KV_REST_API_URL not defined"

**Solu??o:**
```
1. Vercel Dashboard ? Storage
2. Criar KV database
3. Vercel adiciona vari?veis automaticamente
4. Redeploy (push git ou vercel --prod)
```

### Erro: "Webhook secret not configured"

**Solu??o:**
```
1. Vercel Dashboard ? Settings ? Environment Variables
2. Adicionar: CAKTO_WEBHOOK_SECRET
3. Valor: 12f4848f-35e9-41a8-8da4-1032642e3e89
4. Redeploy
```

### Erro: "Meta Pixel not loading"

**Solu??o:**
```
1. Verificar NEXT_PUBLIC_META_PIXEL_ID est? correto
2. Verificar NEXT_PUBLIC_STAPE_CONTAINER_URL est? correto
3. Limpar cache do browser
4. Testar em aba an?nima
```

### Erro: "Failed to save tracking data"

**Solu??o:**
```
1. Verificar Vercel KV est? criado
2. Ver logs da Vercel (pode ser cold start)
3. N?o bloqueia o fluxo (s? log de erro)
```

---

## ?? Comandos ?teis Vercel

### Ver Logs em Tempo Real:

```bash
vercel logs --follow
```

### Ver Vari?veis de Ambiente:

```bash
vercel env ls
```

### Pull Vari?veis Localmente:

```bash
vercel env pull .env.local
```

### Redeploy For?ado:

```bash
vercel --prod --force
```

---

## ?? RESUMO SUPER SIMPLES

### 5 Passos Essenciais:

```
1. npm install @vercel/kv                    (2 min)
2. Copiar c?digo em src/app/page.tsx         (5 min)
3. Vercel ? Storage ? Create KV              (3 min)
4. Vercel ? Settings ? Environment Variables (5 min)
5. git push (deploy autom?tico)              (5 min)

Total: 20 minutos

EXTRA:
6. Cakto ? Webhook ? Configurar URL          (5 min)
7. Testar (health check + formul?rio)        (5 min)

Total Final: 30 minutos
```

---

## ? O Que Voc? Precisa Fazer

### AGORA (antes de deploy):

```
1. ? npm install @vercel/kv
2. ? Adicionar c?digo no src/app/page.tsx
   (ver INTEGRACAO_FRONTEND_COPYPASTE.md)
3. ? Commit e push
```

### NA VERCEL (durante deploy):

```
1. ? Storage ? Create Database ? KV
2. ? Settings ? Environment Variables ? Adicionar 5 vari?veis
3. ? Aguardar deploy completar
```

### P?S-DEPLOY:

```
1. ? Cakto ? Configurar webhook
2. ? Testar health check
3. ? Testar formul?rio
4. ? Verificar Meta Events Manager
```

---

## ?? EST? F?CIL AGORA?

**SIM!** Com este guia, voc? consegue fazer em 30 minutos! ??

**Tem d?vidas em algum passo espec?fico?** Me pergunte! ??
