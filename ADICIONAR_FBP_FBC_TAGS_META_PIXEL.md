# ✅ ADICIONAR: fbp e fbc nas Tags Meta Pixel (GTM Web)

**Data:** 2025-01-06  
**Status:** 📋 **GUIA DE CONFIGURAÇÃO**

---

## 🎯 **OBJETIVO**

Adicionar `fbp` (Facebook Browser ID) e `fbc` (Facebook Click ID) ao Advanced Matching das tags Meta Pixel no GTM Web.

**IMPORTANTE:** Mesmo que as tags estejam pausadas agora, este guia serve para quando forem reativadas.

---

## 📋 **TAGS QUE PRECISAM SER ATUALIZADAS**

- `FB - PageView`
- `FB - ViewContent`
- `FB - AddToCart`
- `FB - InitiateCheckout`
- `FB - Lead`
- `FB - Purchase`

---

## 🔧 **PASSO A PASSO**

### **1. Criar Variáveis Data Layer (se não existirem)**

#### **Variável 1: `dlv - user_data.fbp`**

1. **GTM Web → Variáveis → Nova**
2. **Configuração:**
   - Nome: `dlv - user_data.fbp`
   - Tipo: **Data Layer Variable**
   - Nome da variável do Data Layer: `user_data.fbp`
   - Tipo de valor: Texto
   - Valor padrão: (deixar vazio)

#### **Variável 2: `dlv - user_data.fbc`**

1. **GTM Web → Variáveis → Nova**
2. **Configuração:**
   - Nome: `dlv - user_data.fbc`
   - Tipo: **Data Layer Variable**
   - Nome da variável do Data Layer: `user_data.fbc`
   - Tipo de valor: Texto
   - Valor padrão: (deixar vazio)

---

### **2. Adicionar ao Advanced Matching**

#### **Para cada tag `FB - *`:**

1. **Abrir a tag** (ex: `FB - InitiateCheckout`)
2. **Rolar até "Advanced Matching"**
3. **Clicar em "Adicionar linha"** (ou "+")
4. **Adicionar `fbp`:**

   ```
   Property Name: fbp
   Property Value: {{dlv - user_data.fbp}}
   ```

5. **Clicar em "Adicionar linha"** novamente
6. **Adicionar `fbc`:**

   ```
   Property Name: fbc
   Property Value: {{dlv - user_data.fbc}}
   ```

7. **Salvar a tag**

---

## 📊 **CONFIGURAÇÃO COMPLETA DO ADVANCED MATCHING**

### **Todas as tags `FB - *` devem ter:**

| Property Name | Property Value | Status Atual |
|--------------|----------------|--------------|
| `fn` | `{{dlv - user_data.first_name}}` | ✅ Já tem |
| `ln` | `{{dlv - user_data.last_name}}` | ✅ Já tem |
| `em` | `{{dlv - user_data.email_address}}` | ✅ Já tem |
| `ph` | `{{dlv - user_data.phone_number}}` | ✅ Já tem |
| `ct` | `{{dlv - user_data.city}}` | ✅ Já tem |
| `st` | `{{dlv - user_data.region}}` | ✅ Já tem |
| `zp` | `{{dlv - user_data.postal_code}}` | ✅ Já tem |
| `cn` | `{{dlv - user_data.country}}` | ✅ Já tem |
| `external_id` | `{{dlv - user_data.user_id}}` | ✅ Já tem |
| `fbp` | `{{dlv - user_data.fbp}}` | ❌ **ADICIONAR** |
| `fbc` | `{{dlv - user_data.fbc}}` | ❌ **ADICIONAR** |

---

## ✅ **VERIFICAÇÃO**

### **Após adicionar, verificar no Facebook Events Manager:**

1. **Evento do navegador deve mostrar:**
   - ✅ **Identificação do navegador** (fbp)
   - ✅ **Identificação do clique** (fbc)
   - ✅ País
   - ✅ Identificação externa

2. **Parâmetros de correspondência avançada deve incluir:**
   - ✅ Todos os campos acima

---

## ⚠️ **IMPORTANTE**

1. **Ordem não importa:** Os campos podem estar em qualquer ordem no Advanced Matching
2. **Valores vazios:** Se `fbp` ou `fbc` não estiverem disponíveis, a tag não enviará esses campos (isso é normal)
3. **Formato:** `fbp` e `fbc` devem ser preservados EXATAMENTE como vêm do cookie (sem modificações)

---

## 🎯 **RESULTADO ESPERADO**

**ANTES:**
```
Parâmetros de correspondência avançada: 
Cidade, Email, Nome, Endereço IP, Sobrenome, Telefone, Estado, Agente do usuário, Código postal

❌ FALTA: País, Identificação externa, Identificação do clique, Identificação do navegador
```

**DEPOIS:**
```
Parâmetros de correspondência avançada: 
País ✅, Cidade ✅, Email ✅, Identificação externa ✅, Identificação do clique ✅, 
Identificação do navegador ✅, Nome ✅, Endereço IP ✅, Sobrenome ✅, Telefone ✅, 
Estado ✅, Agente do usuário ✅, Código postal ✅

✅ TEM TUDO!
```

---

**Data:** 2025-01-06  
**Prioridade:** 🟡 **MÉDIA** (se tags estiverem pausadas, pode ser feito depois)

