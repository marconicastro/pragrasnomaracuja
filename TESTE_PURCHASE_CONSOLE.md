# 🧪 Teste Purchase via Console (SOLUÇÃO RÁPIDA)

## ⚠️ Página /teste-purchase com 404?

**Causa:** Precisa fazer deploy na Vercel.

**Solução Rápida:** Testar direto pelo Console do navegador!

---

## 🚀 Teste Rápido pelo Console

### **1️⃣ Abrir Console (F12)**

### **2️⃣ Copiar e Colar Este Código:**

```javascript
// ===== TESTE PURCHASE VIA CONSOLE =====

(async function testePurchase() {
  try {
    console.log('🧪 Iniciando teste Purchase via Console...');
    
    // Importar função (já está disponível globalmente via window ou precisa importar)
    // Se não funcionar, vamos usar window.fbq direto
    
    // 1. Gerar Order ID único
    const orderId = `TEST_CONSOLE_${Date.now()}`;
    console.log('📋 Order ID:', orderId);
    
    // 2. Buscar dados do localStorage (do Lead)
    const storedData = localStorage.getItem('userTrackingData');
    let email = '';
    let phone = '';
    let firstName = '';
    let lastName = '';
    
    if (storedData) {
      const parsed = JSON.parse(storedData);
      email = parsed.email || 'teste@teste.com';
      phone = parsed.phone || '';
      firstName = parsed.firstName || 'Teste';
      lastName = parsed.lastName || 'Usuario';
      console.log('✅ Dados carregados do localStorage:', { email, phone, firstName, lastName });
    } else {
      // Se não tiver localStorage, usar dados padrão
      email = 'teste@teste.com';
      firstName = 'Teste';
      lastName = 'Usuario';
      console.warn('⚠️ Nenhum dado no localStorage, usando dados padrão');
    }
    
    // 3. Verificar se Meta Pixel está carregado
    if (typeof window.fbq === 'undefined') {
      console.error('❌ Meta Pixel não está carregado! Aguarde alguns segundos e tente novamente.');
      return;
    }
    
    console.log('✅ Meta Pixel carregado:', typeof window.fbq);
    
    // 4. Disparar Purchase via fbq direto (simula trackPurchaseElite)
    const eventId = `Purchase_${orderId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('📤 Disparando Purchase via browser + CAPIG...');
    console.log('📊 Order ID:', orderId);
    console.log('📧 Email:', email);
    console.log('🔑 Event ID:', eventId);
    
    // Preparar user_data (advanced matching)
    const userData = {};
    if (email) userData.em = email;
    if (phone) userData.ph = phone;
    if (firstName) userData.fn = firstName;
    if (lastName) userData.ln = lastName;
    
    // Disparar Purchase
    window.fbq('track', 'Purchase', {
      value: 39.9,
      currency: 'BRL',
      content_ids: ['hacr962'],
      content_type: 'product',
      content_name: 'Sistema 4 Fases - Ebook Trips',
      num_items: 1,
      order_id: orderId,
      ...(Object.keys(userData).length > 0 && { user_data: userData })
    }, {
      eventID: eventId
    });
    
    console.log('✅ Purchase disparado via Meta Pixel!');
    console.log('📊 Verifique no Meta Events Manager: Test Events');
    console.log('🎯 EQM esperado: 9.3 (via CAPIG)');
    
    return {
      success: true,
      orderId,
      email,
      eventId,
      message: 'Purchase enviado! Verifique no Meta Events Manager.'
    };
    
  } catch (error) {
    console.error('❌ Erro ao disparar Purchase:', error);
    return {
      success: false,
      error: error.message
    };
  }
})();
```

---

## 📋 Passo a Passo

1. **Fazer Lead primeiro** (para ter email no localStorage)
2. **Abrir Console** (F12)
3. **Colar código acima** e pressionar Enter
4. **Verificar resultado** no console
5. **Confirmar no Meta Events Manager**

---

## ✅ O Que Esperar no Console

```
🧪 Iniciando teste Purchase via Console...
📋 Order ID: TEST_CONSOLE_1762191234567
✅ Dados carregados do localStorage: { email: '...', phone: '...', ... }
✅ Meta Pixel carregado: function
📤 Disparando Purchase via browser + CAPIG...
📊 Order ID: TEST_CONSOLE_1762191234567
📧 Email: seu@email.com
🔑 Event ID: Purchase_TEST_CONSOLE_...
✅ Purchase disparado via Meta Pixel!
📊 Verifique no Meta Events Manager: Test Events
🎯 EQM esperado: 9.3 (via CAPIG)
```

---

## 🔍 Verificar no Meta Events Manager

1. Acessar: https://business.facebook.com/events_manager2
2. Ir em: **Test Events**
3. Procurar por: `Purchase` recente
4. Verificar:
   - ✅ Event Name: `Purchase`
   - ✅ Order ID: `TEST_CONSOLE_...`
   - ✅ **EQM: 9.3** ✅
   - ✅ DQS: 90+

---

## 🐛 Troubleshooting

### **❌ "Meta Pixel não está carregado"**

**Solução:**
- Aguardar alguns segundos após carregar a página
- Recarregar a página (F5)
- Verificar se `window.fbq` existe no console

---

### **❌ "Nenhum dado no localStorage"**

**Solução:**
- Fazer Lead primeiro
- Ou editar o código para usar seu email:
  ```javascript
  email = 'seu@email.com';
  ```

---

## 🎉 Pronto!

Agora você pode testar Purchase **sem precisar da página de teste**!

Depois que o deploy for feito, a página `/teste-purchase` estará disponível.

---

**Nota:** Este método funciona exatamente igual à página de teste, mas via console!

