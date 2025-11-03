# 🔍 Análise: DQS 52 (Muito Baixo!)

## ⚠️ Problema Detectado

**DQS Esperado:** 85-92  
**DQS Atual:** 52  
**Diferença:** -33 pontos

---

## 📊 Dados Enviados vs Dados Esperados

### ✅ **Dados Enviados (7 campos):**
- País ✅
- Email ✅
- Identificação externa ✅
- Nome ✅
- Endereço IP ✅
- Sobrenome ✅
- Telefone ✅

### ❌ **Dados FALTANDO (5 campos críticos):**
- **fbp** (Identificação do navegador) ❌ → **-20 pontos DQS**
- **fbc** (Identificação de clique) ❌ → **-20 pontos DQS**
- **Cidade** ❌ → **-5 pontos DQS**
- **Estado** ❌ → **-5 pontos DQS**
- **Código postal** ❌ → **-3 pontos DQS**

**Total perdido:** -53 pontos!

---

## 🔍 Possíveis Causas

### **Causa 1: Lead Não Encontrado**
O webhook não encontrou o Lead no KV/Prisma.

**Verificar nos logs:**
```
⚠️ User data NÃO encontrado: { email: '...', phone: '...' }
```

---

### **Causa 2: Lead Encontrado Mas Sem Dados**
Lead foi encontrado, mas não tinha fbc/fbp salvos.

**Verificar nos logs:**
```
✅ User data encontrado no Vercel KV: {
  hasFbp: false,  ← PROBLEMA!
  hasFbc: false,  ← PROBLEMA!
  hasCity: false, ← PROBLEMA!
  ...
}
```

---

### **Causa 3: fbc Inválido/Expirado**
Lead tinha fbc, mas estava expirado (> 24h).

**Verificar nos logs:**
```
⚠️ fbc do KV expirado ou inválido: fbc timestamp outside valid window (24h)
```

---

## ✅ Como Resolver

### **Passo 1: Verificar Logs do Webhook**

Após enviar webhook, veja os logs da Vercel:
1. Vercel Dashboard → Deployments
2. Clique no deployment mais recente
3. Functions → `/api/webhook-cakto`
4. Veja os logs:

**Se aparecer:**
```
✅ User data encontrado por EMAIL: marconi.castro.mc@gmail.com
✅ User data encontrado no Vercel KV: {
  hasFbp: true,
  hasFbc: true,
  ...
}
```
→ **Lead foi encontrado com dados!** Mas por que não enviou?

**Se aparecer:**
```
⚠️ User data NÃO encontrado
```
→ **Lead não foi encontrado!** Verificar email/telefone no payload.

---

### **Passo 2: Verificar Se Lead Tem Dados Completos**

Verificar no KV/Prisma se Lead tem:
- ✅ fbp
- ✅ fbc (válido < 24h)
- ✅ city
- ✅ state
- ✅ zip

**Via API:**
```bash
curl https://maracujazeropragas.com/api/get-recent-purchase?email=marconi.castro.mc@gmail.com
```

---

### **Passo 3: Criar Lead NOVO Com Dados Completos**

Se Lead não tem todos os dados:
1. Acessar URL com fbclid: `https://maracujazeropragas.com/?fbclid=IwAR...`
2. Preencher formulário completo (nome, email, telefone)
3. Aguardar Lead ser salvo
4. Enviar webhook novamente

---

## 📋 Checklist de Debug

- [ ] Logs mostram Lead encontrado?
- [ ] Lead tem fbp salvo?
- [ ] Lead tem fbc salvo?
- [ ] fbc está válido (< 24h)?
- [ ] Lead tem city/state/zip?
- [ ] Email no webhook = Email do Lead?
- [ ] Phone no webhook = Phone do Lead?

---

## 🎯 Resultado Esperado Após Corrigir

**DQS:** 52 → **92** ✅
**EQM:** ~8.0 → **9.3** ✅

**Dados esperados no Meta:**
- ✅ País, Cidade, Estado, CEP
- ✅ Email, Nome, Sobrenome, Telefone
- ✅ Identificação do navegador (fbp)
- ✅ Identificação de clique (fbc)
- ✅ Endereço IP
- ✅ Identificação externa

---

**Verifique os logs do webhook para identificar a causa exata!** 🔍

