# 🔍 DIAGNÓSTICO: Data Tags disparam mas não chegam ao Server-Side

**Situação:** 
- ✅ GTM Web Preview: DT, FB e GA4 disparam normalmente
- ❌ GTM Server-Side: Não recebe eventos (stream em branco)

**Causa provável:** Data Tags disparam mas não conseguem enviar para Server-Side

---

## 🔍 VERIFICAÇÕES NECESSÁRIAS

### **1. Verificar Network Tab (CRÍTICO)**

**Passos:**
1. Abrir DevTools → Network
2. **Limpar** requisições (botão Clear)
3. Filtrar por: `event.maracujazeropragas.com`
4. Navegar no site (ou recarregar página)
5. Verificar se aparecem requisições

**O que procurar:**
- ✅ Requisições para `https://event.maracujazeropragas.com/...`
- ✅ Método: POST ou GET
- ✅ Status: 200 OK, 404, 500, CORS error, etc.
- ✅ Tipo: xhr ou fetch

**Se NÃO houver requisições:**
- ❌ Data Tags não estão enviando (problema na configuração)

**Se houver requisições mas com erro:**
- ❌ Status 404: URL incorreta ou Server-Side não encontrado
- ❌ Status 500: Erro no Server-Side
- ❌ CORS error: Problema de CORS
- ❌ Network error: Server-Side offline ou inacessível

---

### **2. Verificar Status das Data Tags no GTM Web Preview**

**No GTM Web Preview, ao ver uma Data Tag disparar:**

**Verificar:**
- ✅ Status: "Success" ou "Failed"?
- ✅ Se "Failed", qual o erro?
- ✅ Tempo de resposta
- ✅ Payload enviado

**Exemplo de erro comum:**
- "Failed to send" → Server-Side não está acessível
- "404 Not Found" → URL incorreta
- "CORS error" → Problema de CORS
- "Network error" → Server-Side offline

---

### **3. Verificar URL do Server-Side**

**No GTM Web:**
1. Variables → `const - server_container_url`
2. Verificar valor:
   - ✅ Deve ser: `https://event.maracujazeropragas.com`
   - ❌ Se estiver diferente: corrigir

**Testar URL manualmente:**
```bash
curl https://event.maracujazeropragas.com
```

**Se retornar erro:**
- ❌ Server-Side pode estar offline
- ❌ URL incorreta
- ❌ Problema de DNS

---

### **4. Verificar Configuração das Data Tags**

**No GTM Web → Tags → Abrir uma Data Tag (ex: DT - page_view):**

**Verificar:**
- ✅ **Tag Type:** Server Container URL
- ✅ **Server Container URL:** 
  - Deve usar: `{{const - server_container_url}}`
  - OU URL direta: `https://event.maracujazeropragas.com`
- ✅ **Trigger:** Configurado corretamente (ex: `ce - page_view`)
- ✅ **Tag está ativa** (não desativada)
- ✅ **Tag está publicada**

---

### **5. Verificar Data Client no GTM Server-Side**

**No GTM Server-Side:**
1. Clients → Abrir "Data Client"
2. Verificar:
   - ✅ Está ativo
   - ✅ Aceita eventos do Web Container
   - ✅ Não tem filtros bloqueando
   - ✅ Accepted Path Settings está configurado

**Se Data Client não aceita eventos do Web Container:**
- ❌ Eventos não serão processados
- ✅ Solução: Configurar Data Client para aceitar eventos do Web Container

---

## 🔧 SOLUÇÕES POR PROBLEMA

### **Problema 1: Sem requisições HTTP no Network Tab**

**Causa:** Data Tags não estão enviando

**Soluções:**
1. Verificar se Data Tags estão ativas e publicadas
2. Verificar se Triggers estão configurados corretamente
3. Verificar se URL do Server-Side está correta
4. Publicar container novamente

---

### **Problema 2: Requisições com erro 404**

**Causa:** URL incorreta ou Server-Side não encontrado

**Soluções:**
1. Verificar URL: `https://event.maracujazeropragas.com`
2. Testar URL manualmente (curl)
3. Verificar se Server-Side está rodando
4. Verificar se URL está correta na variável `const - server_container_url`

---

### **Problema 3: Requisições com erro 500**

**Causa:** Erro no Server-Side

**Soluções:**
1. Verificar logs do Server-Side (Stape.io)
2. Verificar se Server-Side está configurado corretamente
3. Verificar se Data Client está ativo

---

### **Problema 4: CORS Error**

**Causa:** Problema de CORS

**Soluções:**
1. Verificar configuração de CORS no Server-Side
2. Verificar se Server-Side permite requisições do domínio
3. Verificar configuração do Stape.io

---

### **Problema 5: Requisições 200 OK mas Server-Side não mostra eventos**

**Causa:** Data Client não está processando

**Soluções:**
1. Verificar se Data Client está ativo
2. Verificar se Data Client aceita eventos do Web Container
3. Verificar se há filtros bloqueando
4. Verificar Accepted Path Settings

---

## 📋 CHECKLIST RÁPIDO

### **Network Tab:**
- [ ] Há requisições para `event.maracujazeropragas.com`?
- [ ] Status das requisições? (200, 404, 500, CORS, etc.)
- [ ] Método? (POST, GET)

### **GTM Web Preview:**
- [ ] Data Tags aparecem no stream?
- [ ] Status das Data Tags? (Success, Failed)
- [ ] Se Failed, qual o erro?

### **GTM Web (Configuração):**
- [ ] URL do Server-Side está correta?
- [ ] Data Tags estão ativas e publicadas?
- [ ] Triggers estão configurados?

### **GTM Server-Side:**
- [ ] Data Client está ativo?
- [ ] Data Client aceita eventos do Web Container?
- [ ] Server-Side está acessível?

---

## 🎯 PRÓXIMOS PASSOS

**Me diga:**
1. ✅ Há requisições HTTP no Network tab para `event.maracujazeropragas.com`?
2. ✅ Se houver, qual o status? (200, 404, 500, CORS, etc.)
3. ✅ No GTM Web Preview, qual o status das Data Tags? (Success, Failed)
4. ✅ Se Failed, qual a mensagem de erro?

Com essas informações, posso identificar exatamente o problema!

