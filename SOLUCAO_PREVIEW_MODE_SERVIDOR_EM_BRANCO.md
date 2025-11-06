# 🚨 SOLUÇÃO: GTM Server-Side Preview Mode em Branco

**Problema:** GTM Server-Side Preview Mode está em branco, não aparece nada no stream.

**Situação:**
- ✅ Data Tag dispara no GTM Web
- ✅ Requisição chega no servidor (Network Tab mostra 200 OK)
- ❌ Preview Mode do servidor está em branco
- ❌ Nada aparece no stream

---

## 🔍 CAUSAS POSSÍVEIS

### **1. Preview Mode não está conectado corretamente**
- Cookies `gtm_preview` e `gtm_debug` não estão sendo enviados
- Sessão de Preview expirou
- URL do Preview Mode está incorreta

### **2. Data Client não está processando eventos**
- Data Client pode estar desativado
- Configuração do Data Client pode estar incorreta

### **3. Requisições não estão sendo enviadas com cookies de Preview**
- Cookies não estão sendo incluídos nas requisições
- CORS pode estar bloqueando cookies

---

## ✅ SOLUÇÃO PASSO A PASSO

### **PASSO 1: Fechar e Reabrir Preview Mode**

**1.1. Fechar Preview Mode atual:**
1. No GTM Server-Side, clicar em **"Exit Preview"** ou **"Sair do Preview"**
2. Fechar todas as abas do Preview Mode

**1.2. Abrir Preview Mode novamente:**
1. GTM Server-Side → **Preview/Debug**
2. **Adicionar URL:** `https://www.maracujazeropragas.com`
3. **IMPORTANTE:** Usar exatamente a mesma URL que está no navegador
4. Clicar em **"Connect"** ou **"Conectar"**

**1.3. Verificar se Preview Mode está conectado:**
- Deve aparecer uma mensagem: "Preview Mode Connected" ou similar
- Deve aparecer um link para abrir o site

---

### **PASSO 2: Verificar Cookies no Navegador**

**2.1. Abrir DevTools:**
1. Pressionar `F12` ou `Ctrl+Shift+I`
2. Ir para aba **Application** (ou **Armazenamento**)
3. Ir para **Cookies** → `https://event.maracujazeropragas.com`

**2.2. Verificar cookies:**
- ✅ `gtm_preview` - Deve existir
- ✅ `gtm_debug` - Deve existir
- ✅ `gtm_auth` - Deve existir

**2.3. Se cookies não existirem:**
- Preview Mode não está conectado
- Voltar ao PASSO 1

---

### **PASSO 3: Verificar Network Tab - Cookies sendo enviados**

**3.1. Abrir Network Tab:**
1. DevTools → **Network**
2. Filtrar por: `event.maracujazeropragas.com`
3. Recarregar a página

**3.2. Verificar requisição:**
1. Clicar em uma requisição para `event.maracujazeropragas.com`
2. Ir para aba **Headers**
3. Procurar por **"Cookie"** no Request Headers

**3.3. Verificar se cookies estão sendo enviados:**
- ✅ Deve conter: `gtm_preview=GTM-W4PGS3LR=...`
- ✅ Deve conter: `gtm_debug=GTM-W4PGS3LR=...`
- ✅ Deve conter: `gtm_auth=GTM-W4PGS3LR=...`

**3.4. Se cookies não estiverem sendo enviados:**
- Problema de CORS ou SameSite
- Verificar configuração do servidor

---

### **PASSO 4: Verificar Data Client**

**4.1. No GTM Server-Side:**
1. Ir para **Clients**
2. Abrir **"Data Client"**
3. Verificar configuração:
   - ✅ Client está ativo?
   - ✅ Path `/data` está em "Accepted Path Settings"?
   - ✅ "Accept Server-Side Events" está habilitado?

**4.2. Se Data Client estiver desativado:**
- Ativar o Client
- Salvar e publicar

---

### **PASSO 5: Verificar se eventos estão sendo recebidos**

**5.1. No Network Tab:**
1. Filtrar por: `event.maracujazeropragas.com`
2. Verificar requisições:
   - ✅ Status: 200 OK?
   - ✅ Método: GET ou POST?
   - ✅ Payload contém `event_name=view_item`?

**5.2. Se requisições estão sendo enviadas:**
- Eventos estão chegando no servidor
- Problema é no Preview Mode ou Data Client

---

### **PASSO 6: Tentar Preview Mode em modo anônimo**

**6.1. Abrir janela anônima:**
1. Pressionar `Ctrl+Shift+N` (Chrome) ou `Ctrl+Shift+P` (Firefox)
2. Abrir Preview Mode do GTM Server-Side
3. Conectar com URL: `https://www.maracujazeropragas.com`
4. Acessar o site

**6.2. Verificar se eventos aparecem:**
- Se aparecerem: Problema com cookies/extensões
- Se não aparecerem: Problema com Preview Mode ou Data Client

---

## 🔧 SOLUÇÕES ALTERNATIVAS

### **Solução 1: Verificar se servidor está respondendo**

**No Network Tab:**
1. Filtrar por: `event.maracujazeropragas.com`
2. Verificar se requisições retornam 200 OK
3. Verificar se response contém dados

**Se retornar erro:**
- Servidor pode estar com problema
- Verificar logs do servidor

---

### **Solução 2: Verificar configuração do servidor**

**No GTM Server-Side:**
1. Ir para **Admin** → **Container Settings**
2. Verificar **Tagging Server URLs:**
   - ✅ Deve conter: `https://event.maracujazeropragas.com`
3. Verificar se servidor está ativo

---

### **Solução 3: Verificar se há bloqueadores**

**Desativar temporariamente:**
- Ad blockers
- Privacy extensions
- VPN
- Firewall

**Testar novamente:**
- Abrir Preview Mode
- Acessar o site
- Verificar se eventos aparecem

---

## 📋 CHECKLIST COMPLETO

### **Preview Mode:**
- [ ] Preview Mode foi fechado e reaberto?
- [ ] URL do Preview Mode está correta?
- [ ] Preview Mode mostra "Connected"?

### **Cookies:**
- [ ] Cookies `gtm_preview` existem?
- [ ] Cookies `gtm_debug` existem?
- [ ] Cookies `gtm_auth` existem?
- [ ] Cookies estão sendo enviados nas requisições?

### **Network Tab:**
- [ ] Requisições para `event.maracujazeropragas.com` aparecem?
- [ ] Status: 200 OK?
- [ ] Cookies estão no Request Headers?

### **Data Client:**
- [ ] Data Client está ativo?
- [ ] Path `/data` está configurado?
- [ ] "Accept Server-Side Events" está habilitado?

### **Servidor:**
- [ ] Servidor está respondendo (200 OK)?
- [ ] Tagging Server URL está correta?
- [ ] Servidor está ativo?

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Fechar e reabrir Preview Mode
2. ✅ Verificar cookies no navegador
3. ✅ Verificar Network Tab - cookies sendo enviados
4. ✅ Verificar Data Client
5. ✅ Tentar Preview Mode em modo anônimo

---

## ⚠️ OBSERVAÇÃO IMPORTANTE

**Se Preview Mode continuar em branco após todos os passos:**
- Pode ser problema com o servidor Stape.io
- Pode ser problema com a configuração do GTM Server-Side
- Pode ser necessário contatar suporte do Stape.io

**Alternativa:**
- Verificar logs do servidor diretamente
- Verificar se eventos estão chegando na Meta (mesmo sem Preview Mode)

---

## ✅ CONCLUSÃO

**Problema:**
- ❌ Preview Mode do servidor está em branco
- ✅ Eventos estão chegando no servidor (Network Tab mostra)

**Causa mais provável:**
- ⚠️ Preview Mode não está conectado corretamente
- ⚠️ OU cookies não estão sendo enviados
- ⚠️ OU Data Client não está processando eventos

**Solução:**
- ✅ Fechar e reabrir Preview Mode
- ✅ Verificar cookies
- ✅ Verificar Data Client
- ✅ Tentar modo anônimo

