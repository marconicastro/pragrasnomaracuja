# ❌ ERRO: Currency Faltando no Custom Data

## 🎯 **PROBLEMA IDENTIFICADO**

O Facebook está retornando erro 400 para ViewContent, AddToCart e InitiateCheckout:

```
"error_user_title": "Parâmetro de preço do item sem moeda",
"error_user_msg": "Você está enviando um parâmetro de preço do item dentro do seu parâmetro de conteúdos, mas não está enviando um parâmetro de moeda. Insira uma moeda para o preço do item. Por exemplo: US$"
```

### **Payload Enviado (ERRADO):**
```json
{
  "custom_data": {
    "content_ids": ["hacr962"],
    "contents": [{"id": "hacr962", "quantity": 1, "item_price": 39.9}]
  }
}
```

### **Payload Esperado (CORRETO):**
```json
{
  "custom_data": {
    "content_ids": ["hacr962"],
    "contents": [{"id": "hacr962", "quantity": 1, "item_price": 39.9}],
    "currency": "BRL"  // ✅ OBRIGATÓRIO quando há item_price
  }
}
```

---

## 🔍 **CAUSA RAIZ**

As tags do GTM Server-Side estão configuradas para usar:
- `{{ed - ecommerce.currency}}` no `custom_data`

Mas a variável está retornando `undefined` porque:
1. O código envia `ecommerce.currency` ✅
2. Mas a variável `{{ed - ecommerce.currency}}` pode não estar encontrando o valor

---

## ✅ **SOLUÇÃO**

### **Opção 1: Garantir que `currency` está no nível raiz também**

O código já envia `currency` no nível raiz, mas precisamos garantir que a variável `{{ed - currency}}` também funcione como fallback.

### **Opção 2: Verificar se `ecommerce.currency` está sendo enviado**

Verificar se o código está enviando `ecommerce.currency` corretamente para todos os eventos.

### **Opção 3: Criar variável `{{ed - currency}}` no nível raiz**

Criar variável Event Data com path `currency` (nível raiz) como fallback.

---

## 🔧 **AÇÃO IMEDIATA**

1. **Verificar no GTM Preview Mode:**
   - Abrir Preview Mode
   - Disparar evento ViewContent
   - Verificar se `{{ed - ecommerce.currency}}` retorna valor
   - Se retornar `undefined`, verificar se `ecommerce.currency` está no payload

2. **Se `ecommerce.currency` estiver no payload mas variável retornar `undefined`:**
   - Verificar se o path da variável está correto: `ecommerce.currency`
   - Verificar se há espaços ou caracteres especiais no nome da variável

3. **Se `ecommerce.currency` NÃO estiver no payload:**
   - Verificar código `pushViewItem()`, `pushAddToCart()`, `pushBeginCheckout()`
   - Garantir que `ecommerce.currency` está sendo enviado

---

## 📋 **VERIFICAÇÃO NO CÓDIGO**

O código atual envia:
```typescript
ecommerce: {
  value: value,
  currency: currency,  // ✅ Está sendo enviado
  items: [...]
}
```

Mas pode ser que o GTM Server-Side não esteja recebendo corretamente. Preciso verificar se há algum problema na estrutura do payload.

---

**Status:** 🔍 Investigando causa raiz

