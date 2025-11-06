# ⚠️ REVERTER: Alterações de event_id podem ter quebrado Server-Side

**Problema:** Server-Side parou de receber eventos após alterações de `event_id`

---

## 🔍 ALTERAÇÕES RECENTES QUE PODEM TER CAUSADO O PROBLEMA

### **Commits relacionados a event_id:**
1. `dce0799` - fix: adicionar eventId em Lead e AddToCart também
2. `c13fef2` - fix: garantir mesmo event_id em todos os eventos
3. `2751013` - fix: garantir mesmo event_id entre DataLayer e trackEliteEvent

**Possível problema:** Alterações na geração/passagem de `event_id` podem ter quebrado algo

---

## ✅ SOLUÇÃO: REVERTER ALTERAÇÕES

### **Opção 1: Reverter commits de event_id**

**Reverter para antes das alterações de event_id:**
```bash
git revert dce0799 c13fef2 2751013 --no-commit
git commit -m "revert: reverter alterações de event_id que quebraram Server-Side"
git push
```

### **Opção 2: Voltar para commit anterior**

**Voltar para commit antes das alterações:**
```bash
git log --oneline | grep -B5 "fix: garantir mesmo event_id"
# Encontrar commit anterior
git checkout <commit-anterior>
# Testar se funciona
# Se funcionar, criar branch e fazer merge
```

---

## 🔍 VERIFICAÇÃO ANTES DE REVERTER

### **Verificar se o problema é realmente o código:**

1. **Verificar se eventos estão sendo enviados:**
   - Console do navegador: `window.dataLayer`
   - Network tab: requisições para Server-Side

2. **Verificar se Server-Side está recebendo:**
   - Status 200 nas requisições
   - Response do Server-Side

3. **Verificar Preview Mode:**
   - Preview Mode está conectado?
   - Tentar reiniciar Preview Mode

---

## 🎯 DECISÃO

**Se eventos estão sendo enviados (status 200) mas Preview não mostra:**
- ⚠️ Problema pode ser Preview Mode, não código
- ✅ Tentar reiniciar Preview Mode primeiro

**Se eventos NÃO estão sendo enviados:**
- ❌ Problema é no código
- ✅ Reverter alterações de event_id

---

## 📋 CHECKLIST ANTES DE REVERTER

- [ ] Verificar se requisições estão sendo enviadas (Network tab)
- [ ] Verificar status das requisições (200, 404, 500)
- [ ] Tentar reiniciar Preview Mode
- [ ] Verificar se eventos aparecem no Meta Events Manager
- [ ] Se nada funcionar, reverter alterações

