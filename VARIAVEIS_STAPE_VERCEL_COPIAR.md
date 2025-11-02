# ?? VARI?VEIS STAPE PARA VERCEL - COPIAR E COLAR

## ? CUSTOM DOMAIN ATUALIZADO!

**DE:** `https://capig.maracujazeropragas.com`  
**PARA:** `https://capigateway.maracujazeropragas.com` ?

---

## ?? VARI?VEIS PARA ADICIONAR/ATUALIZAR NA VERCEL:

### **Settings ? Environment Variables**

---

### **1. EDITAR (j? existe):**

**Key:** `NEXT_PUBLIC_STAPE_CONTAINER_URL`

**Valor ANTIGO:** `https://capig.maracujazeropragas.com`

**Valor NOVO (copie):**
```
https://capigateway.maracujazeropragas.com
```

**Environments:** Production, Preview, Development (todos!)

---

### **2. ADICIONAR (nova):**

**Key:** `STAPE_CAPIG_IDENTIFIER`

**Value (copie):**
```
kmwitszu
```

**Environments:** Production, Preview, Development (todos!)

---

### **3. ADICIONAR (nova):**

**Key:** `STAPE_CAPIG_API_KEY`

**Value (copie):**
```
eyJpIjoia213aXRzenUiLCJoIjoiY2FwaWcuc3RhcGUucG0iLCJrIjoiMTk3MjMyMDE2MzhmMWQ2NTdmYzY0ZDUyMjAxZGExNzI3NmU1OWQwOGttd2l0c3p1In0=
```

**Environments:** Production, Preview, Development (todos!)

---

## ?? DEPOIS: REDEPLOY!

1. **Deployments**
2. ?ltimo deploy ? **?** ? **Redeploy**
3. Aguarde 2-3 minutos

---

## ?? TESTE AP?S REDEPLOY:

**ReqBin ? POST webhook**

**Logs DEVEM mostrar:**

```
?? CAPIG API Key inclu?da (Authorization header)
?? Tentativa 1 - CAPIG URL: https://capigateway.maracujazeropragas.com/facebook

? SUCCESS: Purchase enviado via Stape CAPIG (IP/UA real mantido!)
```

**Se funcionar:**
- ? +12.8% convers?es relatadas
- ? IP/UA real do cliente
- ? Match quality perfeito
- ? Sistema 100% completo! ??

---

## ? RESUMO R?PIDO:

**3 VARI?VEIS:**

1. `NEXT_PUBLIC_STAPE_CONTAINER_URL` = `https://capigateway.maracujazeropragas.com`
2. `STAPE_CAPIG_IDENTIFIER` = `kmwitszu`
3. `STAPE_CAPIG_API_KEY` = `eyJpIjoia213aXRzenUiLCJoIjoiY2FwaWcuc3RhcGUucG0iLCJrIjoiMTk3MjMyMDE2MzhmMWQ2NTdmYzY0ZDUyMjAxZGExNzI3NmU1OWQwOGttd2l0c3p1In0=`

**REDEPLOY ? TESTE ? GANHO +12.8%!** ??
