# 🚨 URGENTE: Criar Variável `ed - currency`

## ❌ **ERRO IDENTIFICADO**

Facebook retorna erro 400:
```
"Parâmetro de preço do item sem moeda"
"Você está enviando um parâmetro de preço do item dentro do seu parâmetro de conteúdos, mas não está enviando um parâmetro de moeda."
```

### **Payload Enviado (ERRADO):**
```json
"custom_data": {
  "content_ids": ["hacr962"],
  "contents": [{"id": "hacr962", "quantity": 1, "item_price": 39.9}],
  "num_items": 1
  // ❌ FALTA "currency": "BRL"
}
```

### **Payload Esperado (CORRETO):**
```json
"custom_data": {
  "content_ids": ["hacr962"],
  "contents": [{"id": "hacr962", "quantity": 1, "item_price": 39.9}],
  "num_items": 1,
  "currency": "BRL"  // ✅ OBRIGATÓRIO quando há item_price
}
```

---

## ✅ **SOLUÇÃO IMEDIATA**

### **PASSO 1: Criar Variável `ed - currency`**

No GTM Server-Side:

1. Ir em **Variáveis**
2. Clicar em **Novo**
3. Selecionar **Event Data**
4. Configurar:
   - **Nome da variável:** `ed - currency`
   - **Nome do campo de evento:** `currency`
   - **Tipo de valor:** Texto
   - **Valor padrão:** (deixar vazio)
5. **Salvar**

### **PASSO 2: Atualizar Tags**

Nas tags **FB - ViewContent**, **FB - AddToCart** e **FB - InitiateCheckout**:

1. Abrir a tag
2. Ir em **Custom Data**
3. Encontrar campo **currency**
4. **Alterar** de `{{ed - ecommerce.currency}}` para `{{ed - currency}}`
5. **Salvar**

---

## ✅ **RESULTADO ESPERADO**

Após criar a variável e atualizar as tags:

```json
"custom_data": {
  "content_ids": ["hacr962"],
  "contents": [{"id": "hacr962", "quantity": 1, "item_price": 39.9}],
  "num_items": 1,
  "currency": "BRL"  // ✅ Agora será enviado!
}
```

E o erro 400 será resolvido! ✅

---

## 📋 **CHECKLIST**

- [ ] Criar variável `ed - currency` no GTM Server-Side
- [ ] Atualizar FB - ViewContent → Custom Data → currency: `{{ed - currency}}`
- [ ] Atualizar FB - AddToCart → Custom Data → currency: `{{ed - currency}}`
- [ ] Atualizar FB - InitiateCheckout → Custom Data → currency: `{{ed - currency}}`
- [ ] Testar eventos no Preview Mode
- [ ] Verificar se erro 400 desapareceu

---

**Status:** ⚠️ **AÇÃO IMEDIATA - Criar variável e atualizar 3 tags**

