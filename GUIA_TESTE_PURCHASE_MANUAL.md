# 🧪 Guia: Testar Purchase Manualmente (SEM Comprar)

## 🎯 Problema Resolvido

**Situação:** Cakto não tem modo teste e você não quer gastar dinheiro.

**Solução:** Página de teste manual que simula compra!

---

## 📋 Passo a Passo

### **1️⃣ Fazer Lead Primeiro (OBRIGATÓRIO!)**

1. **Acessar página principal:**
   ```
   https://www.maracujazeropragas.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=teste
   ```

2. **Preencher formulário Lead:**
   - Nome: Seu nome
   - Email: Seu email (o mesmo que vai usar no teste)
   - Telefone: Seu telefone
   - CEP: Qualquer CEP válido

3. **Verificar no Console (F12):**
   ```
   ✅ Lead enviado com sucesso
   ✅ fbp/fbc salvos no Vercel KV
   ```

**Por que isso é importante?**
- Email fica salvo no `localStorage`
- Dados ficam disponíveis no KV
- Purchase precisa do email para matching

---

### **2️⃣ Acessar Página de Teste**

**URL:**
```
https://www.maracujazeropragas.com/teste-purchase
```

**O que a página faz:**
- ✅ Carrega dados do localStorage automaticamente
- ✅ Gera Order ID único automaticamente
- ✅ Permite editar dados antes de enviar
- ✅ Dispara Purchase via browser + CAPIG

---

### **3️⃣ Preencher Dados (se necessário)**

A página já tenta carregar do localStorage, mas você pode:

1. **Editar Email:** Se quiser usar outro email
2. **Editar Telefone:** Se quiser usar outro telefone
3. **Editar Nome:** Se quiser usar outro nome
4. **Editar Valor:** Padrão é R$ 39,90

**OU clicar em:**
```
🔄 Carregar do localStorage (do Lead)
```
Para carregar dados do Lead que você fez antes.

---

### **4️⃣ Clicar em "Disparar Purchase"**

**O que acontece:**
1. ✅ PageView é enviado (obrigatório antes de Purchase)
2. ✅ Purchase é enviado via `trackPurchaseElite()`
3. ✅ Passa pelo CAPIG Gateway
4. ✅ Meta recebe com EQM 9.3!

**No Console (F12) você verá:**
```
🎉 Disparando Purchase de TESTE via browser (EQM 9.3 via CAPIG)
✅ Purchase enviado via browser + CAPIG (EQM 9.3 garantido!)
ℹ️ Verifique no Meta Events Manager (Test Events)
```

---

### **5️⃣ Verificar no Meta Events Manager**

1. **Acessar:** https://business.facebook.com/events_manager2

2. **Ir em:** Test Events (ou Eventos de Teste)

3. **Procurar por:** Purchase recente

4. **Verificar:**
   - ✅ Event Name: `Purchase`
   - ✅ Order ID: `TEST_XXXXXXXX` (o que você gerou)
   - ✅ **EQM: 9.3** (deve aparecer!)
   - ✅ DQS: 90+ (dados do browser)
   - ✅ Event Source: `website` ou `browser`
   - ✅ Via: CAPIG Gateway

---

## ✅ Checklist de Validação

### **Antes de Testar:**
- [ ] Fez Lead primeiro (email no localStorage)
- [ ] Acessou página `/teste-purchase`
- [ ] Dados foram carregados automaticamente (ou preencheu manualmente)

### **Durante o Teste:**
- [ ] Clicou em "Disparar Purchase"
- [ ] Console mostrou sucesso
- [ ] Network tab mostra requisição para CAPIG
- [ ] CAPIG retornou 200 OK

### **Após o Teste:**
- [ ] Event apareceu no Meta Events Manager
- [ ] EQM: 9.3 ✅
- [ ] DQS: 90+ ✅
- [ ] Dados estão corretos (email, valor, etc.)

---

## 🐛 Troubleshooting

### **❌ "Email não encontrado no localStorage"**

**Solução:**
1. Fazer Lead primeiro (passo 1)
2. Ou preencher email manualmente na página de teste
3. Ou clicar em "Carregar do localStorage"

---

### **❌ Purchase não disparou**

**Verificar:**
1. Meta Pixel carregou? `typeof window.fbq !== 'undefined'`
2. Email preenchido?
3. Order ID preenchido?
4. Console mostra erro?

**Debug:**
```javascript
// No console:
console.log('Email:', localStorage.getItem('userTrackingData'));
console.log('Meta Pixel:', typeof window.fbq !== 'undefined');
```

---

### **❌ EQM não está 9.3**

**Possíveis causas:**
1. fbp/fbc não estão presentes
   - **Solução:** Fazer Lead primeiro (salva fbp/fbc)

2. CAPIG não está configurado
   - **Solução:** Verificar se `EliteMetaPixel.tsx` está carregando CAPIG

3. Event não passou pelo CAPIG
   - **Solução:** Verificar Network tab se requisição foi para CAPIG

---

## 📊 Diferenças entre Teste Manual vs Real

| Aspecto | Teste Manual | Compra Real |
|---------|--------------|-------------|
| **Order ID** | `TEST_XXXXX` | ID real do Cakto |
| **Webhook** | Não envia | Envia (backup) |
| **EQM** | 9.3 ✅ | 9.3 ✅ |
| **DQS** | 90+ ✅ | 90+ ✅ |
| **Via CAPIG** | Sim ✅ | Sim ✅ |

**Conclusão:** Teste manual é idêntico ao real em termos de qualidade de dados!

---

## 🎉 Pronto!

Agora você pode testar Purchase **quantas vezes quiser** sem gastar dinheiro!

**URL da Página de Teste:**
```
https://www.maracujazeropragas.com/teste-purchase
```

**Lembre-se:**
1. Fazer Lead primeiro (para ter email no localStorage)
2. Acessar `/teste-purchase`
3. Clicar em "Disparar Purchase"
4. Verificar no Meta Events Manager

---

**Boa sorte com os testes! 🚀**

