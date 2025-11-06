# 🚨 SOLUÇÃO URGENTE: Variáveis Faltando no GTM Server-Side

## ❌ **PROBLEMA IDENTIFICADO**

As variáveis `ed - currency` e `ed - value` **NÃO EXISTEM** no GTM Server-Side!

### **Situação Atual:**
- ✅ Código envia `currency` e `value` no nível raiz
- ❌ GTM não tem variável `ed - currency` (só tem `ed - ecommerce.currency`)
- ❌ GTM não tem variável `ed - value` (só tem `ed - ecommerce.value`)
- ❌ `ed - ecommerce.currency` retorna `undefined`
- ❌ `ed - ecommerce.value` retorna `undefined`

---

## ✅ **SOLUÇÃO IMEDIATA**

### **Criar Variáveis Faltantes no GTM Server-Side:**

1. **Criar `ed - currency`:**
   - Tipo: Event Data Variable
   - Nome do campo de evento: `currency`
   - Tipo de valor: Texto

2. **Criar `ed - value`:**
   - Tipo: Event Data Variable
   - Nome do campo de evento: `value`
   - Tipo de valor: Número

3. **Atualizar Tags para usar as novas variáveis:**
   - FB - ViewContent → Custom Data → `currency`: `{{ed - currency}}`
   - FB - ViewContent → Custom Data → `value`: `{{ed - value}}`
   - FB - AddToCart → Custom Data → `currency`: `{{ed - currency}}`
   - FB - AddToCart → Custom Data → `value`: `{{ed - value}}`
   - FB - InitiateCheckout → Custom Data → `currency`: `{{ed - currency}}`
   - FB - InitiateCheckout → Custom Data → `value`: `{{ed - value}}`

---

## 🔍 **VARIÁVEIS QUE PRECISAM SER CRIADAS**

| Variável | Path | Tipo | Status |
|----------|------|------|--------|
| `ed - currency` | `currency` | Texto | ❌ **FALTANDO** |
| `ed - value` | `value` | Número | ❌ **FALTANDO** |

---

## 📋 **PASSO A PASSO**

### **1. Criar Variável `ed - currency`:**

1. GTM Server-Side → **Variáveis**
2. **Novo** → **Event Data**
3. Configurar:
   - **Nome da variável:** `ed - currency`
   - **Nome do campo de evento:** `currency`
   - **Tipo de valor:** Texto
   - **Valor padrão:** (deixar vazio)
4. **Salvar**

### **2. Criar Variável `ed - value`:**

1. GTM Server-Side → **Variáveis**
2. **Novo** → **Event Data**
3. Configurar:
   - **Nome da variável:** `ed - value`
   - **Nome do campo de evento:** `value`
   - **Tipo de valor:** Número
   - **Valor padrão:** (deixar vazio)
4. **Salvar**

### **3. Atualizar Tags:**

**FB - ViewContent:**
1. Abrir tag
2. Ir em **Custom Data**
3. Encontrar campo `currency`
4. Alterar de `{{ed - ecommerce.currency}}` para `{{ed - currency}}`
5. Encontrar campo `value`
6. Alterar de `{{ed - ecommerce.value}}` para `{{ed - value}}`
7. **Salvar**

**Repetir para FB - AddToCart e FB - InitiateCheckout**

---

## ✅ **RESULTADO ESPERADO**

Após criar as variáveis e atualizar as tags:

- ✅ `{{ed - currency}}` vai retornar `"BRL"`
- ✅ `{{ed - value}}` vai retornar `39.9`
- ✅ Facebook vai receber `currency` e `value` no `custom_data`
- ✅ Erro 400 vai desaparecer!

---

**Status:** ⚠️ **AÇÃO IMEDIATA NECESSÁRIA NO GTM SERVER-SIDE**

