# ❌ ERRO: Invalid Ecommerce event name

**Erros encontrados:**
- `Invalid Ecommerce event name "page_view"`
- `Invalid Ecommerce event name "view_content"`

---

## 🔍 CAUSA DO PROBLEMA

### **O que está acontecendo:**
Você ativou `sendEcommerceData: true` em tags GA4 que **NÃO são eventos de ecommerce**.

**No GA4, apenas eventos específicos de ecommerce podem usar `sendEcommerceData: true`:**

✅ **Eventos de ecommerce válidos:**
- `purchase`
- `add_to_cart`
- `begin_checkout`
- `view_item` (não `view_content`)

❌ **Eventos NÃO de ecommerce:**
- `page_view` → **NÃO é evento de ecommerce**
- `view_content` → **NÃO é evento de ecommerce padrão**
- `generate_lead` → **NÃO é evento de ecommerce**

---

## ✅ SOLUÇÃO

### **Desativar `sendEcommerceData` em eventos que não são de ecommerce:**

#### **1. GA4 - page_view**
- Abrir tag `GA4 - page_view`
- **Desmarcar** "Enviar dados de ecommerce" (`sendEcommerceData: false`)
- Salvar

#### **2. GA4 - view_content**
- Abrir tag `GA4 - view_content`
- **Desmarcar** "Enviar dados de ecommerce" (`sendEcommerceData: false`)
- Salvar

#### **3. GA4 - generate_lead**
- Abrir tag `GA4 - generate_lead`
- **Desmarcar** "Enviar dados de ecommerce" (`sendEcommerceData: false`)
- Salvar

---

## 📋 CHECKLIST CORRETO

### **Ativar `sendEcommerceData: true` APENAS em:**
- ✅ `GA4 - purchase` → ✅ **ATIVAR**
- ✅ `GA4 - add_to_cart` → ✅ **ATIVAR**
- ✅ `GA4 - begin_checkout` → ✅ **ATIVAR**
- ✅ `GA4 - view_item` → ✅ **ATIVAR** (se existir)

### **Desativar `sendEcommerceData: false` em:**
- ❌ `GA4 - page_view` → ❌ **DESATIVAR**
- ❌ `GA4 - view_content` → ❌ **DESATIVAR**
- ❌ `GA4 - generate_lead` → ❌ **DESATIVAR**

---

## 🔧 CORREÇÃO RÁPIDA

### **Para cada tag GA4:**

1. **GA4 - page_view:**
   - Abrir tag
   - Procurar "Enviar dados de ecommerce"
   - ❌ **Desmarcar**
   - Salvar

2. **GA4 - view_content:**
   - Abrir tag
   - Procurar "Enviar dados de ecommerce"
   - ❌ **Desmarcar**
   - Salvar

3. **GA4 - generate_lead:**
   - Abrir tag
   - Procurar "Enviar dados de ecommerce"
   - ❌ **Desmarcar**
   - Salvar

---

## 📊 RESUMO

| Tag GA4 | sendEcommerceData | Motivo |
|---------|-------------------|--------|
| `page_view` | ❌ **false** | Não é evento de ecommerce |
| `view_content` | ❌ **false** | Não é evento de ecommerce |
| `generate_lead` | ❌ **false** | Não é evento de ecommerce |
| `view_item` | ✅ **true** | É evento de ecommerce |
| `add_to_cart` | ✅ **true** | É evento de ecommerce |
| `begin_checkout` | ✅ **true** | É evento de ecommerce |
| `purchase` | ✅ **true** | É evento de ecommerce |

---

## 🎯 APÓS CORRIGIR

1. **Salvar todas as tags**
2. **Publicar versão do container**
3. **Verificar Preview Mode** - erros devem desaparecer
4. **Testar eventos** - devem funcionar normalmente

---

## 💡 NOTA IMPORTANTE

**`view_content` vs `view_item`:**
- `view_content` → evento genérico (não é ecommerce)
- `view_item` → evento de ecommerce específico (pode usar `sendEcommerceData`)

Se você tem `GA4 - view_content`, pode ser que deva ser `GA4 - view_item` para ecommerce. Mas se quiser manter `view_content`, **não ative** `sendEcommerceData`.

---

✅ **Correção:** Desative `sendEcommerceData` em `page_view` e `view_content`!





