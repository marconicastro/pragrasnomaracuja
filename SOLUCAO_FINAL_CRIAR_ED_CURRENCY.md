# ✅ SOLUÇÃO FINAL: Criar `ed - currency` e Atualizar Tag

## 🎯 **PROBLEMA IDENTIFICADO**

O Facebook retorna erro 400 porque falta `currency` no `custom_data`:

```json
"custom_data": {
  "content_ids": ["hacr962"],
  "contents": [{"id": "hacr962", "quantity": 1, "item_price": 39.9}],
  "num_items": 1
  // ❌ FALTA "currency": "BRL"
}
```

### **Causa:**
- Tag FB - InitiateCheckout usa `{{ed - ecommerce.currency}}`
- Essa variável retorna `undefined`
- Resultado: `currency` não é enviado no `custom_data` → Erro 400

### **Solução:**
- Dados mostram que `currency: "BRL"` chega no nível raiz ✅
- Criar variável `{{ed - currency}}` (nível raiz)
- Atualizar tag para usar `{{ed - currency}}`

---

## ✅ **AÇÃO IMEDIATA (2 PASSOS)**

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

### **PASSO 2: Atualizar Tag FB - InitiateCheckout**

1. Abrir tag **FB - InitiateCheckout**
2. Ir em **Custom Data**
3. Encontrar campo **currency**
4. **Alterar** de `{{ed - ecommerce.currency}}` para `{{ed - currency}}`
5. **Salvar**

---

## ✅ **RESULTADO ESPERADO**

Após criar a variável e atualizar a tag:

```json
"custom_data": {
  "content_ids": ["hacr962"],
  "contents": [{"id": "hacr962", "quantity": 1, "item_price": 39.9}],
  "num_items": 1,
  "currency": "BRL"  // ✅ Agora será enviado!
}
```

**Erro 400 será resolvido!** ✅

---

## 📋 **REPETIR PARA OUTRAS TAGS**

Após resolver InitiateCheckout, fazer o mesmo para:

1. **FB - ViewContent** → Custom Data → currency: `{{ed - currency}}`
2. **FB - AddToCart** → Custom Data → currency: `{{ed - currency}}`

---

**Status:** ⚠️ **CRIAR 1 VARIÁVEL E ATUALIZAR 1 TAG (depois repetir para outras 2)**

