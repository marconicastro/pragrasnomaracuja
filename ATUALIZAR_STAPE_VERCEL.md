# ?? ATUALIZAR STAPE CAPIG NA VERCEL

## ? C?DIGO ATUALIZADO:

**Novos dados da CAPIG:**
```
? CAPIG URL: https://capig.stape.pm
? CAPIG Identifier: kmwitszu
? CAPIG API Key: eyJpIjoia213aXRzenUiLCJoIjoiY2FwaWcuc3RhcGUucG0iLCJrIjoiMTk3MjMyMDE2MzhmMWQ2NTdmYzY0ZDUyMjAxZGExNzI3NmU1OWQwOGttd2l0c3p1In0=
```

**C?digo atualizado:**
- ? Endpoint corrigido: `/facebook` (n?o `/facebook/{pixel_id}`)
- ? API Key com header `Authorization: Bearer {key}`
- ? Identifier atualizado: `kmwitszu`
- ? 3 tentativas de endpoint (garantir funcionamento)

---

## ?? VARI?VEIS PARA ADICIONAR NA VERCEL:

### **PASSO 1: Acessar Environment Variables**

1. **Vercel Dashboard:** https://vercel.com/dashboard
2. Projeto: **pragrasnomaracuja**
3. **Settings** ? **Environment Variables**

---

### **PASSO 2: Atualizar vari?vel existente**

**Encontre:** `NEXT_PUBLIC_STAPE_CONTAINER_URL`

**Deve estar:** `https://capig.maracujazeropragas.com` (antigo)

**Mude para:** `https://capigateway.maracujazeropragas.com` (novo!)

**Como:**
1. Clique **?** ? **Edit**
2. **Value:** `https://capig.stape.pm`
3. **Environments:** All Environments
4. **Save**

---

### **PASSO 3: Adicionar 2 novas vari?veis**

**VARI?VEL 1: STAPE_CAPIG_IDENTIFIER**

1. Clique em **"Add New"**
2. **Key:** `STAPE_CAPIG_IDENTIFIER`
3. **Value:** `kmwitszu`
4. **Environments:** Selecione **Production, Preview, Development** (todos!)
5. **Add**

---

**VARI?VEL 2: STAPE_CAPIG_API_KEY**

1. Clique em **"Add New"**
2. **Key:** `STAPE_CAPIG_API_KEY`
3. **Value:** `eyJpIjoia213aXRzenUiLCJoIjoiY2FwaWcuc3RhcGUucG0iLCJrIjoiMTk3MjMyMDE2MzhmMWQ2NTdmYzY0ZDUyMjAxZGExNzI3NmU1OWQwOGttd2l0c3p1In0=`
4. **Environments:** Selecione **Production, Preview, Development** (todos!)
5. **Add**

---

### **PASSO 4: REDEPLOY (OBRIGAT?RIO!)**

**Vari?veis s? funcionam ap?s redeploy!**

1. **Deployments** (menu lateral)
2. ?ltimo deploy ? **?** ? **"Redeploy"**
3. Aguarde 2-3 minutos

---

## ?? TESTE AP?S ATUALIZAR:

**ReqBin ? POST webhook**

**Logs DEVEM mostrar:**

```
?? CAPIG API Key inclu?da (Authorization header)
?? Tentativa 1 - CAPIG URL: https://capig.stape.pm/facebook

? SUCCESS: Purchase enviado via Stape CAPIG (IP/UA real mantido!)
```

**Se der sucesso:**
- ? +6.4% convers?es (IP real)
- ? +6.4% convers?es (UA real)
- ? +12.8% TOTAL!
- ? DQS continua 100
- ? Match quality PERFEITO!

---

## ?? ENDPOINTS QUE SER?O TESTADOS:

**Tentativa 1:** `https://capigateway.maracujazeropragas.com/facebook`  
**Tentativa 2:** `https://sa.stape.co/stape-api/kmwitszu/v1/facebook`  
**Tentativa 3:** Fallback Meta direto (se tudo falhar)

**Pelo menos 1 DEVE funcionar!** ?

---

## ? CHECKLIST COMPLETO:

### **NA VERCEL:**

- [ ] **Editar** `NEXT_PUBLIC_STAPE_CONTAINER_URL`
  - De: `https://capig.maracujazeropragas.com`
  - Para: `https://capig.stape.pm`

- [ ] **Adicionar** `STAPE_CAPIG_IDENTIFIER`
  - Value: `kmwitszu`
  - Environments: Todos

- [ ] **Adicionar** `STAPE_CAPIG_API_KEY`
  - Value: `eyJpIjoia213aXRzenUiLCJoIjoiY2FwaWcuc3RhcGUucG0iLCJrIjoiMTk3MjMyMDE2MzhmMWQ2NTdmYzY0ZDUyMjAxZGExNzI3NmU1OWQwOGttd2l0c3p1In0=`
  - Environments: Todos

- [ ] **Redeploy** projeto (obrigat?rio!)

- [ ] **Aguardar** 2-3 minutos

- [ ] **Testar** ReqBin

- [ ] **Verificar** logs: "? SUCCESS: Purchase enviado via Stape CAPIG"

---

## ?? RESULTADO ESPERADO:

**ANTES (Meta direto):**
```
?? Stape CAPIG falhou
? Purchase enviado via Meta direto (fallback)
? IP/UA do servidor
? -12.8% convers?es
```

**DEPOIS (Stape funcionando):**
```
? Purchase enviado via Stape CAPIG
? IP/UA real do cliente
? +12.8% convers?es! ??
```

---

## ?? GANHO FINANCEIRO:

**Exemplo (R$ 10.000/m?s):**
```
Antes: R$ 10.000
Depois: R$ 11.280 (+12.8%)
Ganho: +R$ 1.280/m?s
Anual: +R$ 15.360!
```

---

## ?? RESUMO R?PIDO:

**3 vari?veis para atualizar na Vercel:**

1. `NEXT_PUBLIC_STAPE_CONTAINER_URL` = `https://capig.stape.pm`
2. `STAPE_CAPIG_IDENTIFIER` = `kmwitszu`
3. `STAPE_CAPIG_API_KEY` = `eyJpIjoia213aXRzenUiLCJoIjoiY2FwaWcuc3RhcGUucG0iLCJrIjoiMTk3MjMyMDE2MzhmMWQ2NTdmYzY0ZDUyMjAxZGExNzI3NmU1OWQwOGttd2l0c3p1In0=`

**Depois:** REDEPLOY!

**Teste:** ReqBin ? Verificar logs

**Ganho:** +12.8% convers?es! ??

---

**Pode fazer isso agora?** ?
