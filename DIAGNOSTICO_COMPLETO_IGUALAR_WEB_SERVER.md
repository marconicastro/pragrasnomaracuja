# 🔍 DIAGNÓSTICO COMPLETO: Igualar Eventos Web e Server

**Data:** 2025-01-06  
**Status:** 🔴 **URGENTE - CORREÇÃO NECESSÁRIA**

---

## 🎯 **PROBLEMA IDENTIFICADO**

**Evento do Navegador (Facebook Events Manager):**
```
Parâmetros de correspondência avançada: 
Email, Endereço IP, Sobrenome, Telefone, Agente do usuário

❌ FALTANDO:
- País (cn)
- Cidade (ct)
- Nome (fn)
- Identificação externa (external_id)
- Identificação do clique (fbc)
- Identificação do navegador (fbp)
- Estado (st)
- Código postal (zp)
```

**Evento do Servidor (Facebook Events Manager):**
```
Chaves de dados do usuário: 
País ✅, Cidade ✅, Email ✅, Identificação externa ✅, Identificação do clique ✅, 
Identificação do navegador ✅, Nome ✅, Endereço IP ✅, Sobrenome ✅, Telefone ✅, 
Estado ✅, Agente do usuário ✅, Código postal ✅

✅ TEM TUDO!
```

---

## 📊 **ANÁLISE DO GTM DEBUG**

### **DataLayer (✅ CORRETO):**
```javascript
{
  event: "begin_checkout",
  email_address: "marconicastro04@gmail.com",
  phone_number: "77998276042",
  first_name: "Marconi",
  last_name: "Augusto De Castro",
  city: "caculé",
  region: "ba",
  postal_code: "46300",
  country: "BR",
  user_id: "sess_1762031294521_e5kv5ly8b",
  fbp: "fb.1.1762197216212.722663367903060652",
  fbc: "fb.1.1762520944469.IwAR2eX8Z7Y9w1L4K6P3Q8R5T2U1V4W6X9Y2Z3A7B8C1D2E3F4G5H6I7J8K9L0",
  user_data: {
    user_id: "sess_1762031294521_e5kv5ly8b",
    email_address: "marconicastro04@gmail.com",
    phone_number: "77998276042",
    first_name: "Marconi",
    last_name: "Augusto De Castro",
    city: "caculé",
    region: "ba",
    postal_code: "46300",
    country: "BR",
    fbp: "fb.1.1762197216212.722663367903060652",
    fbc: "fb.1.1762520944469.IwAR2eX8Z7Y9w1L4K6P3Q8R5T2U1V4W6X9Y2Z3A7B8C1D2E3F4G5H6I7J8K9L0"
  }
}
```

**✅ O DataLayer tem TODOS os dados corretamente!**

### **Tag FB - InitiateCheckout (❌ INCOMPLETO):**

**Advanced Matching List:**
```javascript
[
  {name: "fn", value: "Marconi"},                    // ✅ TEM
  {name: "ln", value: "Augusto De Castro"},          // ✅ TEM
  {name: "em", value: "marconicastro04@gmail.com"},  // ✅ TEM
  {name: "ph", value: "77998276042"},                // ✅ TEM
  {name: "ct", value: "caculé"},                     // ✅ TEM
  {name: "cn", value: "BR"},                         // ✅ TEM
  {name: "st", value: "ba"},                         // ✅ TEM
  {name: "zp", value: "46300"},                      // ✅ TEM
  {name: "external_id", value: "sess_1762031294521_e5kv5ly8b"}  // ✅ TEM
]

❌ FALTANDO:
- {name: "fbp", value: "..."}  // ❌ NÃO TEM
- {name: "fbc", value: "..."}   // ❌ NÃO TEM
```

**Object Property List:**
```javascript
[
  {name: "fbc", value: "fb.1.1762520944469..."},  // ✅ TEM (mas não é Advanced Matching!)
  {name: "fbp", value: "fb.1.1762197216212..."}   // ✅ TEM (mas não é Advanced Matching!)
]
```

**⚠️ PROBLEMA:** `fbp` e `fbc` estão em `objectPropertyList`, mas **NÃO estão em `advancedMatchingList`**!

---

## 🔧 **SOLUÇÃO: ADICIONAR fbp E fbc AO ADVANCED MATCHING**

### **PASSO 1: Verificar se as Variáveis Existem**

No GTM Web → **Variáveis**, verificar se existem:
- `dlv - user_data.fbp`
- `dlv - user_data.fbc`

**Se NÃO existirem, criar:**

#### **Variável 1: `dlv - user_data.fbp`**
1. **GTM Web → Variáveis → Nova**
2. **Configuração:**
   - **Nome:** `dlv - user_data.fbp`
   - **Tipo:** **Data Layer Variable**
   - **Nome da variável do Data Layer:** `user_data.fbp`
   - **Tipo de valor:** Texto
   - **Valor padrão:** (deixar vazio)
   - **Versão do Data Layer:** Versão 2

#### **Variável 2: `dlv - user_data.fbc`**
1. **GTM Web → Variáveis → Nova**
2. **Configuração:**
   - **Nome:** `dlv - user_data.fbc`
   - **Tipo:** **Data Layer Variable**
   - **Nome da variável do Data Layer:** `user_data.fbc`
   - **Tipo de valor:** Texto
   - **Valor padrão:** (deixar vazio)
   - **Versão do Data Layer:** Versão 2

---

### **PASSO 2: Adicionar fbp e fbc ao Advanced Matching**

**Para TODAS as tags `FB - *`:**

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

### **PASSO 3: Verificar Todas as Tags**

**Todas estas tags devem ter fbp e fbc no Advanced Matching:**

- ✅ `FB - PageView`
- ✅ `FB - ViewContent`
- ✅ `FB - AddToCart`
- ✅ `FB - InitiateCheckout`
- ✅ `FB - Lead`
- ✅ `FB - Purchase`

---

## 📋 **CONFIGURAÇÃO COMPLETA DO ADVANCED MATCHING**

### **Todas as tags `FB - *` devem ter EXATAMENTE:**

| Property Name | Property Value | Status Atual | Ação |
|--------------|----------------|--------------|------|
| `fn` | `{{dlv - user_data.first_name}}` | ✅ TEM | ✅ OK |
| `ln` | `{{dlv - user_data.last_name}}` | ✅ TEM | ✅ OK |
| `em` | `{{dlv - user_data.email_address}}` | ✅ TEM | ✅ OK |
| `ph` | `{{dlv - user_data.phone_number}}` | ✅ TEM | ✅ OK |
| `ct` | `{{dlv - user_data.city}}` | ✅ TEM | ✅ OK |
| `cn` | `{{dlv - user_data.country}}` | ✅ TEM | ✅ OK |
| `st` | `{{dlv - user_data.region}}` | ✅ TEM | ✅ OK |
| `zp` | `{{dlv - user_data.postal_code}}` | ✅ TEM | ✅ OK |
| `external_id` | `{{dlv - user_data.user_id}}` | ✅ TEM | ✅ OK |
| `fbp` | `{{dlv - user_data.fbp}}` | ❌ **FALTA** | 🔴 **ADICIONAR** |
| `fbc` | `{{dlv - user_data.fbc}}` | ❌ **FALTA** | 🔴 **ADICIONAR** |

---

## ✅ **VERIFICAÇÃO NO GTM PREVIEW**

### **Após adicionar fbp e fbc:**

1. **Abrir GTM Preview**
2. **Disparar evento** (ex: `begin_checkout`)
3. **Verificar tag `FB - InitiateCheckout`:**
   - **Advanced Matching** deve mostrar:
     ```
     [
       {name: "fn", value: "Marconi"},
       {name: "ln", value: "Augusto De Castro"},
       {name: "em", value: "marconicastro04@gmail.com"},
       {name: "ph", value: "77998276042"},
       {name: "ct", value: "caculé"},
       {name: "cn", value: "BR"},
       {name: "st", value: "ba"},
       {name: "zp", value: "46300"},
       {name: "external_id", value: "sess_1762031294521_e5kv5ly8b"},
       {name: "fbp", value: "fb.1.1762197216212.722663367903060652"},  // ✅ DEVE APARECER
       {name: "fbc", value: "fb.1.1762520944469..."}                     // ✅ DEVE APARECER
     ]
     ```

4. **Verificar variáveis:**
   - `{{dlv - user_data.fbp}}` deve retornar: `fb.1.1762197216212.722663367903060652`
   - `{{dlv - user_data.fbc}}` deve retornar: `fb.1.1762520944469...`

---

## ✅ **VERIFICAÇÃO NO FACEBOOK EVENTS MANAGER**

### **Após publicar e testar:**

**Evento do Navegador deve mostrar:**
```
Parâmetros de correspondência avançada: 
País ✅, Cidade ✅, Email ✅, Identificação externa ✅, Identificação do clique ✅, 
Identificação do navegador ✅, Nome ✅, Endereço IP ✅, Sobrenome ✅, Telefone ✅, 
Estado ✅, Agente do usuário ✅, Código postal ✅

✅ TEM TUDO! (igual ao servidor)
```

---

## ⚠️ **IMPORTANTE**

1. **Ordem não importa:** Os campos podem estar em qualquer ordem no Advanced Matching
2. **Valores vazios:** Se `fbp` ou `fbc` não estiverem disponíveis, a tag não enviará esses campos (isso é normal em eventos frios)
3. **Formato:** `fbp` e `fbc` devem ser preservados EXATAMENTE como vêm do cookie (sem modificações)
4. **Teste sempre:** Após adicionar, testar no GTM Preview antes de publicar
5. **Publicar:** Após verificar, publicar a versão do GTM Web

---

## 🎯 **RESULTADO ESPERADO**

**ANTES:**
```
Evento do Navegador:
Parâmetros de correspondência avançada: 
Email, Endereço IP, Sobrenome, Telefone, Agente do usuário

❌ FALTA: País, Cidade, Nome, Identificação externa, Identificação do clique, 
Identificação do navegador, Estado, Código postal
```

**DEPOIS:**
```
Evento do Navegador:
Parâmetros de correspondência avançada: 
País ✅, Cidade ✅, Email ✅, Identificação externa ✅, Identificação do clique ✅, 
Identificação do navegador ✅, Nome ✅, Endereço IP ✅, Sobrenome ✅, Telefone ✅, 
Estado ✅, Agente do usuário ✅, Código postal ✅

✅ TEM TUDO! (igual ao servidor)
```

**Evento do Servidor:**
```
Chaves de dados do usuário: 
País ✅, Cidade ✅, Email ✅, Identificação externa ✅, Identificação do clique ✅, 
Identificação do navegador ✅, Nome ✅, Endereço IP ✅, Sobrenome ✅, Telefone ✅, 
Estado ✅, Agente do usuário ✅, Código postal ✅

✅ TEM TUDO!
```

**✅ AGORA OS DOIS ESTÃO IGUAIS!**

---

## 📝 **CHECKLIST DE IMPLEMENTAÇÃO**

- [ ] Criar variável `dlv - user_data.fbp` (se não existir)
- [ ] Criar variável `dlv - user_data.fbc` (se não existir)
- [ ] Adicionar `fbp` ao Advanced Matching de `FB - PageView`
- [ ] Adicionar `fbc` ao Advanced Matching de `FB - PageView`
- [ ] Adicionar `fbp` ao Advanced Matching de `FB - ViewContent`
- [ ] Adicionar `fbc` ao Advanced Matching de `FB - ViewContent`
- [ ] Adicionar `fbp` ao Advanced Matching de `FB - AddToCart`
- [ ] Adicionar `fbc` ao Advanced Matching de `FB - AddToCart`
- [ ] Adicionar `fbp` ao Advanced Matching de `FB - InitiateCheckout`
- [ ] Adicionar `fbc` ao Advanced Matching de `FB - InitiateCheckout`
- [ ] Adicionar `fbp` ao Advanced Matching de `FB - Lead`
- [ ] Adicionar `fbc` ao Advanced Matching de `FB - Lead`
- [ ] Adicionar `fbp` ao Advanced Matching de `FB - Purchase`
- [ ] Adicionar `fbc` ao Advanced Matching de `FB - Purchase`
- [ ] Testar no GTM Preview
- [ ] Verificar que `advancedMatchingList` tem fbp e fbc
- [ ] Publicar versão do GTM Web
- [ ] Verificar no Facebook Events Manager que eventos do navegador têm todos os campos

---

**Data:** 2025-01-06  
**Prioridade:** 🔴 **URGENTE** (eventos estão diferentes, causando deduplicação incorreta)

