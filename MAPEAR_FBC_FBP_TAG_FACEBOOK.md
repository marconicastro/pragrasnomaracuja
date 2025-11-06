# 🔧 MAPEAR fbc e fbp na Tag "FB - Purchase" (GTM Server-Side)

## 🚨 **PROBLEMA IDENTIFICADO**

O `fbc` e `fbp` estão no payload enviado ao GTM Server-Side, mas **NÃO estão sendo enviados ao Facebook** porque a tag "FB - Purchase" não está mapeada para recebê-los.

---

## ✅ **SOLUÇÃO: Mapear fbc e fbp na Tag Facebook**

### **Passo 1: Criar Variáveis Event Data para fbc e fbp**

No GTM Server-Side → **Variáveis** → **Nova** → **Event Data Variable**:

#### **Variável 1: `{{ed - user_data.fbp}}`**
```
Nome da variável: ed - user_data.fbp
Tipo de variável: Event Data
Nome do campo de evento: 0.user_data.fbp
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**⚠️ IMPORTANTE:** Usar prefixo `0.` porque Purchase via webhook vem como array!

#### **Variável 2: `{{ed - user_data.fbc}}`**
```
Nome da variável: ed - user_data.fbc
Tipo de variável: Event Data
Nome do campo de evento: 0.user_data.fbc
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**⚠️ IMPORTANTE:** Usar prefixo `0.` porque Purchase via webhook vem como array!

---

### **Passo 2: Mapear na Tag "FB - Purchase"**

No GTM Server-Side → **Tags** → **FB - Purchase** → **User Data**:

#### **Adicionar fbp:**
```
Property Name: fbp
Property Value: {{ed - user_data.fbp}}
```

#### **Adicionar fbc:**
```
Property Name: fbc
Property Value: {{ed - user_data.fbc}}
```

---

## 📋 **CONFIGURAÇÃO COMPLETA DA TAG "FB - Purchase"**

### **User Data (Seção completa):**

| Property Name | Property Value | Path |
|--------------|----------------|------|
| `First Name` | `{{ed - purchase.user_data.first_name}}` | `0.user_data.first_name` |
| `Last Name` | `{{ed - purchase.user_data.last_name}}` | `0.user_data.last_name` |
| `Email` | `{{ed - purchase.user_data.email_address}}` | `0.user_data.email_address` |
| `Phone` | `{{ed - purchase.user_data.phone_number}}` | `0.user_data.phone_number` |
| `Country` | `{{ed - purchase.user_data.country}}` | `0.user_data.country` |
| `City` | `{{ed - purchase.user_data.city}}` | `0.user_data.city` |
| `State` | `{{ed - purchase.user_data.region}}` | `0.user_data.region` |
| `Zip` | `{{ed - purchase.user_data.postal_code}}` | `0.user_data.postal_code` |
| `External ID` | `{{cs - x-stape-user-id}}` | (Cookie) |
| **`fbp`** | **`{{ed - user_data.fbp}}`** | **`0.user_data.fbp`** ⚠️ **ADICIONAR** |
| **`fbc`** | **`{{ed - user_data.fbc}}`** | **`0.user_data.fbc`** ⚠️ **ADICIONAR** |

---

## 🔍 **VERIFICAÇÃO**

### **1. Verificar se variáveis existem:**

No GTM Server-Side Preview Mode, ao clicar no evento `purchase`:
- Verificar se `{{ed - user_data.fbp}}` retorna valor
- Verificar se `{{ed - user_data.fbc}}` retorna valor

### **2. Verificar se tag está mapeada:**

Na tag "FB - Purchase", verificar se:
- `fbp` está mapeado para `{{ed - user_data.fbp}}`
- `fbc` está mapeado para `{{ed - user_data.fbc}}`

### **3. Verificar no Meta Events Manager:**

Após enviar Purchase, verificar se aparece:
- ✅ **Identificação do navegador** (fbp) - Já aparece
- ✅ **Facebook Click ID** (fbc) - Deve aparecer após mapear

---

## 🚨 **IMPORTANTE**

### **Por que usar `0.user_data.fbp` e `0.user_data.fbc`?**

O Purchase via webhook é enviado como **array** `[eventData]`, então o GTM Server-Side coloca os dados em `0: {...}`.

**Formato no GTM Server-Side:**
```
0: {
  event: "purchase",
  user_data: {
    fbp: "fb.1.1762197216212.722663367903060652",
    fbc: "fb.1.1762427256361.IwAR2eX8Z7Y9w1L4K6P3Q..."
  }
}
```

**Por isso os paths precisam começar com `0.`!**

---

## ✅ **CHECKLIST**

- [ ] Criar variável `{{ed - user_data.fbp}}` → Path: `0.user_data.fbp`
- [ ] Criar variável `{{ed - user_data.fbc}}` → Path: `0.user_data.fbc`
- [ ] Mapear `fbp` na tag "FB - Purchase" → `{{ed - user_data.fbp}}`
- [ ] Mapear `fbc` na tag "FB - Purchase" → `{{ed - user_data.fbc}}`
- [ ] Testar no Preview Mode
- [ ] Verificar se variáveis retornam valores
- [ ] Verificar se tag dispara corretamente
- [ ] Verificar no Meta Events Manager se `fbc` aparece

---

**Última atualização**: 2025-01-05  
**Versão**: 1.0  
**Status**: ✅ GUIA COMPLETO - PRONTO PARA MAPEAR

