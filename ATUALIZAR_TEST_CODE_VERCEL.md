# ?? Atualizar Test Event Code na Vercel

## ? ATUALIZADO LOCALMENTE:

**Arquivo:** `.env.production`

```
META_TEST_EVENT_CODE=TEST79665  ? Novo c?digo
```

---

## ?? AGORA PRECISA ATUALIZAR NA VERCEL:

### **PASSO 1: Acessar vari?veis de ambiente**

1. **Vercel Dashboard:** https://vercel.com/dashboard
2. Selecione projeto: **pragrasnomaracuja**
3. **Settings** ? **Environment Variables**

---

### **PASSO 2: Encontrar vari?vel antiga**

Procure por: `META_TEST_EVENT_CODE`

**Deve estar assim:**
```
META_TEST_EVENT_CODE
All Environments
TEST60998  ? ANTIGO
```

---

### **PASSO 3: Editar vari?vel**

1. Clique nos **3 pontinhos** (?) ao lado da vari?vel
2. Clique em **"Edit"**
3. **Value:** Mude de `TEST60998` para `TEST79665`
4. **Environments:** Mantenha "All Environments"
5. Clique em **"Save"**

---

### **PASSO 4: REDEPLOY (Obrigat?rio!)**

**Vari?veis s? atualizam ap?s redeploy!**

1. **Deployments** (menu lateral)
2. ?ltimo deploy ? **?** ? **"Redeploy"**
3. Aguarde 2-3 minutos

---

## ?? TESTE AP?S ATUALIZAR:

**ReqBin ? POST webhook**

**Logs devem mostrar:**
```
?? Test Event Code ativado: TEST79665  ? NOVO!
```

---

## ?? META EVENTS MANAGER:

**Eventos v?o aparecer em:**

1. **Test Events:** https://business.facebook.com/events_manager2/test_events
   - C?digo: **TEST79665**
   - Eventos em tempo real
   - Purchase com DQS 100

2. **Activity:** Eventos normais (todos)

---

## ? CHECKLIST:

- [x] Atualizado localmente (.env.production) ?
- [x] Atualizado documenta??o (STATUS_ATUAL.md) ?
- [ ] **VOC?: Atualizar na Vercel** (Settings ? Env Variables)
- [ ] **VOC?: Editar META_TEST_EVENT_CODE** ? TEST79665
- [ ] **VOC?: Redeploy** (Deployments)
- [ ] **VOC?: Testar** (ReqBin)
- [ ] **VOC?: Verificar** Test Events no Meta

---

## ?? RESUMO:

**C?digo local:** ? Atualizado para TEST79665

**Vercel:** ?? Voc? precisa atualizar manualmente

**Tempo:** 2 minutos (editar vari?vel + redeploy)

---

**Depois do redeploy, todos os eventos v?o usar TEST79665!** ?
