# ⚡ Corrigir Secret do Webhook - Solução Rápida

## 🔍 Problema

```
"error": "Invalid webhook signature"
```

O secret no payload não corresponde ao configurado na Vercel.

---

## ✅ Solução Rápida

### **Opção 1: Verificar Secret na Vercel**

1. Acesse: https://vercel.com/dashboard
2. Selecione projeto: `pragrasnomaracuja`
3. Settings → Environment Variables
4. Procure: `CAKTO_WEBHOOK_SECRET`
5. **Copie o valor** (UUID completo)

### **Opção 2: Usar Secret Atual (Se Confirmado)**

Se você confirmou que o secret é `12f4848f-35e9-41a8-8da4-1032642e3e89`, verifique:

- ✅ Sem espaços antes/depois
- ✅ Aspas duplas corretas: `"secret"`
- ✅ UUID completo (36 caracteres com hífens)

---

## 📋 Payload Corrigido (Template)

Substitua `SEU_SECRET_AQUI` pelo secret da Vercel:

```json
{
  "secret": "SEU_SECRET_AQUI",
  "event": "purchase_approved",
  "data": {
    "id": "TEST52522",
    "refId": "TEST52522",
    "customer": {
      "name": "marconi augusto de castro",
      "email": "marconi.castro.mc@gmail.com",
      "phone": "77998276042"
    },
    "status": "paid",
    "amount": 39.9
  }
}
```

---

## 🔧 Se Não Sabe o Secret

1. **Gere novo UUID:**
   - https://www.uuidgenerator.net/
   - Copie o UUID gerado

2. **Configure na Vercel:**
   - Settings → Environment Variables
   - Add New: `CAKTO_WEBHOOK_SECRET` = (UUID gerado)
   - Ambiente: Production (e Preview/Development se quiser)

3. **Use no ReqBin:**
   - Cole o mesmo UUID no campo `secret` do payload

---

## ⚠️ Importante

- Secret deve ser **EXATAMENTE IGUAL** na Vercel e no payload
- Sem espaços extras
- Sem caracteres invisíveis
- UUID completo (formato: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

**Depois de corrigir, teste novamente!** ✅

