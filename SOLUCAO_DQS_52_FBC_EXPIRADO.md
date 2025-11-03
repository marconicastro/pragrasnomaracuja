# 🔧 Solução: DQS 52 - fbc Expirado e Dados Não Enviados

## 🔍 Problema Identificado nos Logs

### ✅ **O que FUNCIONOU:**
- Lead encontrado por email ✅
- fbp presente ✅
- city/state/zip presentes no KV ✅

### ❌ **O que FALHOU:**
- **fbc expirado** (> 24h) → Removido do payload
- **DQS 85 calculado, mas Meta mostra 52** → Dados não chegaram no Meta

---

## 🎯 Soluções

### **Solução 1: Criar Lead NOVO com fbc Válido**

O fbc expirou porque foi criado há mais de 24h ou o timestamp estava errado.

**Passo a passo:**

1. **Acessar URL com fbclid (gerar fbc novo):**
   ```
   https://maracujazeropragas.com/?fbclid=IwAR0novo123456789
   ```

2. **Preencher formulário:**
   - Email: `marconi.castro.mc@gmail.com`
   - Telefone: `77998276042`
   - Nome: `marconi augusto de castro`

3. **Clicar ENVIAR** (Lead será salvo com fbc válido!)

4. **Aguardar 5 segundos**

5. **Enviar webhook novamente** no ReqBin

**Resultado esperado:**
```
✅ fbc do KV válido e dentro da janela de 24h
📊 Purchase Data Quality Score: 92
```

---

### **Solução 2: Verificar Por Que city/state/zip Não Foram Enviados**

Mesmo tendo city/state/zip no KV, eles não aparecem no Meta.

**Possíveis causas:**

1. **Dados não chegaram no userData** → Verificar se `getUserDataFromKVOrPrisma` retorna corretamente
2. **Hashing falhou** → Verificar se hashSHA256 está funcionando
3. **Meta rejeitou** → Verificar mensagens de erro do Meta

**Como debugar:**

Adicionar log antes de enviar:
```typescript
console.log('🔍 DEBUG - user_data final antes de enviar:', {
  hasCity: !!user_data.ct,
  hasState: !!user_data.st,
  hasZip: !!user_data.zp,
  hasFbp: !!user_data.fbp,
  hasFbc: !!user_data.fbc
});
```

---

### **Solução 3: Criar Lead Via API com Timestamp Atual**

Se o formulário não gerar fbc válido, criar via API:

**Payload ReqBin:**
```
POST https://maracujazeropragas.com/api/save-tracking
```

**Body:**
```json
{
  "email": "marconi.castro.mc@gmail.com",
  "phone": "77998276042",
  "firstName": "marconi",
  "lastName": "augusto de castro",
  "city": "caculé",
  "state": "ba",
  "zip": "46300",
  "fbp": "fb.1.1762196089000.123456789",
  "fbc": "fb.1.1762196089.abc123def456"
}
```

**⚠️ IMPORTANTE:** Usar timestamp ATUAL em segundos:
- Agora: `Math.floor(Date.now() / 1000)`
- Exemplo: `1762196089` (válido por 24h)

---

## 📊 Resultado Esperado Após Corrigir

### **Antes (Atual):**
- DQS: 52 ❌
- EQM: ~8.0 ❌
- Dados: 7 campos

### **Depois (Esperado):**
- DQS: **92** ✅
- EQM: **9.3** ✅
- Dados: **12 campos** ✅
  - ✅ País, Cidade, Estado, CEP
  - ✅ Email, Nome, Sobrenome, Telefone
  - ✅ fbp (Identificação do navegador)
  - ✅ fbc (Identificação de clique) ← **CRÍTICO!**
  - ✅ Endereço IP
  - ✅ Identificação externa

---

## ✅ Checklist

- [ ] Criar Lead novo com fbc válido (< 24h)
- [ ] Verificar logs: "fbc do KV válido e dentro da janela de 24h"
- [ ] Verificar logs: city/state/zip sendo adicionados ao user_data
- [ ] Enviar webhook novamente
- [ ] Verificar no Meta: DQS 92+

---

**Prioridade: Criar Lead novo com fbc válido!** 🎯

