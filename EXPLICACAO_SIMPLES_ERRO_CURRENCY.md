# 🔍 EXPLICAÇÃO SIMPLES: Erro Currency

## ❌ **O QUE ESTÁ ACONTECENDO**

O Facebook está rejeitando os eventos ViewContent, AddToCart e InitiateCheckout com este erro:

```
"Parâmetro de preço do item sem moeda"
```

### **Por quê?**

Quando você envia `contents` com `item_price` assim:
```json
"contents": [{"id": "hacr962", "quantity": 1, "item_price": 39.9}]
```

O Facebook **OBRIGA** você a enviar também `currency` no `custom_data`:
```json
"custom_data": {
  "contents": [...],
  "currency": "BRL"  // ← FALTA ISSO!
}
```

---

## 🔍 **O PROBLEMA**

No GTM Server-Side, as tags estão configuradas assim:

**Tag FB - ViewContent:**
```
Custom Data:
  currency: {{ed - ecommerce.currency}}  ← Esta variável está retornando UNDEFINED
```

**Resultado:** O Facebook recebe `custom_data` SEM `currency` → Erro 400 ❌

---

## ✅ **A SOLUÇÃO**

O código **JÁ ESTÁ ENVIANDO** `currency` no nível raiz:
```javascript
{
  currency: "BRL",           // ← No nível raiz
  ecommerce: {
    currency: "BRL"          // ← Dentro de ecommerce
  }
}
```

### **O que fazer:**

**No GTM Server-Side, alterar as tags:**

1. **FB - ViewContent**
2. **FB - AddToCart**
3. **FB - InitiateCheckout**

**Em cada uma, na seção "Custom Data", alterar:**

**DE:**
```
currency: {{ed - ecommerce.currency}}  ← Não funciona (undefined)
```

**PARA:**
```
currency: {{ed - currency}}  ← Funciona! (pega do nível raiz)
```

---

## 📋 **PASSO A PASSO**

1. Abrir GTM Server-Side
2. Ir em **Tags**
3. Abrir tag **FB - ViewContent**
4. Ir em **Custom Data**
5. Encontrar campo **currency**
6. **Alterar** `{{ed - ecommerce.currency}}` para `{{ed - currency}}`
7. **Salvar**
8. **Repetir** para FB - AddToCart e FB - InitiateCheckout

---

## ✅ **RESULTADO**

Depois da alteração, o Facebook vai receber:

```json
{
  "custom_data": {
    "content_ids": ["hacr962"],
    "contents": [{"id": "hacr962", "quantity": 1, "item_price": 39.9}],
    "currency": "BRL"  // ✅ Agora vai aparecer!
  }
}
```

E o erro 400 vai sumir! ✅

---

## 🤔 **POR QUE `{{ed - ecommerce.currency}}` NÃO FUNCIONA?**

A variável `{{ed - ecommerce.currency}}` está configurada para ler de `ecommerce.currency`, mas por algum motivo está retornando `undefined` no GTM Server-Side.

A variável `{{ed - currency}}` lê de `currency` (nível raiz), que o código **JÁ ESTÁ ENVIANDO**, então funciona! ✅

---

**Resumo:** O código está correto. Só precisa alterar no GTM Server-Side para usar `{{ed - currency}}` ao invés de `{{ed - ecommerce.currency}}`.

