# ✅ CRIAR: Variáveis fbp e fbc no GTM Web

**Data:** 2025-01-06  
**Status:** 📋 **GUIA COMPLETO**

---

## 🎯 **OBJETIVO**

Criar variáveis no GTM Web para acessar `fbp` e `fbc` do DataLayer e mapeá-las nas tags Meta Pixel.

---

## 📊 **ESTRUTURA DO DATALAYER**

O código envia `fbp` e `fbc` em **DOIS lugares**:

### **1. No nível raiz:**
```javascript
{
  event: 'view_item',
  fbp: 'fb.1.1234567890...',  // ✅ Nível raiz
  fbc: 'fb.1.1234567890...',  // ✅ Nível raiz
  user_data: {
    fbp: 'fb.1.1234567890...',  // ✅ Dentro de user_data
    fbc: 'fb.1.1234567890...'   // ✅ Dentro de user_data
  }
}
```

### **2. Dentro de `user_data`:**
```javascript
{
  event: 'view_item',
  user_data: {
    fbp: 'fb.1.1234567890...',  // ✅ Dentro de user_data
    fbc: 'fb.1.1234567890...'   // ✅ Dentro de user_data
  }
}
```

---

## 🔧 **PASSO 1: CRIAR VARIÁVEIS DATA LAYER**

### **Variável 1: `dlv - user_data.fbp`**

1. **GTM Web → Variáveis → Nova**
2. **Configuração:**
   - **Nome:** `dlv - user_data.fbp`
   - **Tipo:** **Data Layer Variable**
   - **Nome da variável do Data Layer:** `user_data.fbp`
   - **Tipo de valor:** Texto
   - **Valor padrão:** (deixar vazio)
   - **Versão do Data Layer:** Versão 2

3. **Salvar**

### **Variável 2: `dlv - user_data.fbc`**

1. **GTM Web → Variáveis → Nova**
2. **Configuração:**
   - **Nome:** `dlv - user_data.fbc`
   - **Tipo:** **Data Layer Variable**
   - **Nome da variável do Data Layer:** `user_data.fbc`
   - **Tipo de valor:** Texto
   - **Valor padrão:** (deixar vazio)
   - **Versão do Data Layer:** Versão 2

3. **Salvar**

### **Variável 3 (OPCIONAL): `dlv - fbp` (nível raiz)**

1. **GTM Web → Variáveis → Nova**
2. **Configuração:**
   - **Nome:** `dlv - fbp`
   - **Tipo:** **Data Layer Variable**
   - **Nome da variável do Data Layer:** `fbp`
   - **Tipo de valor:** Texto
   - **Valor padrão:** (deixar vazio)
   - **Versão do Data Layer:** Versão 2

3. **Salvar**

### **Variável 4 (OPCIONAL): `dlv - fbc` (nível raiz)**

1. **GTM Web → Variáveis → Nova**
2. **Configuração:**
   - **Nome:** `dlv - fbc`
   - **Tipo:** **Data Layer Variable**
   - **Nome da variável do Data Layer:** `fbc`
   - **Tipo de valor:** Texto
   - **Valor padrão:** (deixar vazio)
   - **Versão do Data Layer:** Versão 2

3. **Salvar**

---

## 🔧 **PASSO 2: CRIAR VARIÁVEIS COM FALLBACK (RECOMENDADO)**

Para garantir que sempre pegue o valor (nível raiz OU dentro de user_data), criar variáveis com fallback:

### **Variável: `dlv - fbp (com fallback)`**

1. **GTM Web → Variáveis → Nova**
2. **Configuração:**
   - **Nome:** `dlv - fbp (com fallback)`
   - **Tipo:** **Variável personalizada**
   - **Código:**
   ```javascript
   function() {
     // Tentar nível raiz primeiro
     var fbp = {{dlv - fbp}};
     if (fbp) return fbp;
     
     // Se não tiver, tentar dentro de user_data
     return {{dlv - user_data.fbp}};
   }
   ```

3. **Salvar**

### **Variável: `dlv - fbc (com fallback)`**

1. **GTM Web → Variáveis → Nova**
2. **Configuração:**
   - **Nome:** `dlv - fbc (com fallback)`
   - **Tipo:** **Variável personalizada**
   - **Código:**
   ```javascript
   function() {
     // Tentar nível raiz primeiro
     var fbc = {{dlv - fbc}};
     if (fbc) return fbc;
     
     // Se não tiver, tentar dentro de user_data
     return {{dlv - user_data.fbc}};
   }
   ```

3. **Salvar**

---

## 🔧 **PASSO 3: MAPEAR NAS TAGS META PIXEL**

### **Para cada tag `FB - *`:**

1. **Abrir a tag** (ex: `FB - InitiateCheckout`)
2. **Rolar até "Advanced Matching"**
3. **Clicar em "Adicionar linha"** (ou "+")
4. **Adicionar `fbp`:**

   ```
   Property Name: fbp
   Property Value: {{dlv - user_data.fbp}}
   ```

   **OU (se usar variável com fallback):**
   ```
   Property Name: fbp
   Property Value: {{dlv - fbp (com fallback)}}
   ```

5. **Clicar em "Adicionar linha"** novamente
6. **Adicionar `fbc`:**

   ```
   Property Name: fbc
   Property Value: {{dlv - user_data.fbc}}
   ```

   **OU (se usar variável com fallback):**
   ```
   Property Name: fbc
   Property Value: {{dlv - fbc (com fallback)}}
   ```

7. **Salvar a tag**

---

## 📋 **TAGS QUE PRECISAM SER ATUALIZADAS**

- `FB - PageView`
- `FB - ViewContent`
- `FB - AddToCart`
- `FB - InitiateCheckout`
- `FB - Lead`
- `FB - Purchase`

---

## ✅ **VERIFICAÇÃO**

### **1. Testar no GTM Preview:**

1. **Abrir GTM Preview**
2. **Navegar para a página**
3. **Verificar no DataLayer:**
   - `dataLayer` deve ter `fbp` e `fbc` no nível raiz
   - `dataLayer` deve ter `user_data.fbp` e `user_data.fbc`

4. **Verificar variáveis:**
   - `{{dlv - user_data.fbp}}` deve retornar o valor
   - `{{dlv - user_data.fbc}}` deve retornar o valor

### **2. Testar na tag Meta Pixel:**

1. **Abrir GTM Preview**
2. **Disparar evento** (ex: `begin_checkout`)
3. **Verificar tag `FB - InitiateCheckout`:**
   - Advanced Matching deve mostrar `fbp` e `fbc` com valores

### **3. Verificar no Facebook Events Manager:**

1. **Abrir Facebook Events Manager**
2. **Verificar evento do navegador:**
   - Deve mostrar **"Identificação do navegador"** (fbp)
   - Deve mostrar **"Identificação do clique"** (fbc)

---

## 🎯 **CONFIGURAÇÃO RECOMENDADA**

### **Opção 1: Usar variáveis simples (mais fácil)**
```
fbp → {{dlv - user_data.fbp}}
fbc → {{dlv - user_data.fbc}}
```

### **Opção 2: Usar variáveis com fallback (mais robusto)**
```
fbp → {{dlv - fbp (com fallback)}}
fbc → {{dlv - fbc (com fallback)}}
```

**Recomendação:** Usar **Opção 1** (mais simples e o código sempre envia dentro de `user_data`)

---

## 📊 **ESTRUTURA FINAL DO ADVANCED MATCHING**

### **Todas as tags `FB - *` devem ter:**

| Property Name | Property Value | Status |
|--------------|----------------|--------|
| `fn` | `{{dlv - user_data.first_name}}` | ✅ Já tem |
| `ln` | `{{dlv - user_data.last_name}}` | ✅ Já tem |
| `em` | `{{dlv - user_data.email_address}}` | ✅ Já tem |
| `ph` | `{{dlv - user_data.phone_number}}` | ✅ Já tem |
| `ct` | `{{dlv - user_data.city}}` | ✅ Já tem |
| `st` | `{{dlv - user_data.region}}` | ✅ Já tem |
| `zp` | `{{dlv - user_data.postal_code}}` | ✅ Já tem |
| `cn` | `{{dlv - user_data.country}}` | ✅ Já tem |
| `external_id` | `{{dlv - user_data.user_id}}` | ✅ Já tem |
| `fbp` | `{{dlv - user_data.fbp}}` | ❌ **CRIAR E ADICIONAR** |
| `fbc` | `{{dlv - user_data.fbc}}` | ❌ **CRIAR E ADICIONAR** |

---

## ⚠️ **IMPORTANTE**

1. **Ordem não importa:** Os campos podem estar em qualquer ordem no Advanced Matching
2. **Valores vazios:** Se `fbp` ou `fbc` não estiverem disponíveis, a tag não enviará esses campos (isso é normal)
3. **Formato:** `fbp` e `fbc` devem ser preservados EXATAMENTE como vêm do cookie (sem modificações)
4. **Teste sempre:** Após criar as variáveis, testar no GTM Preview antes de publicar

---

## ✅ **RESULTADO ESPERADO**

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
**Prioridade:** 🔴 **ALTA** (se tags Meta Pixel estiverem ativas)

