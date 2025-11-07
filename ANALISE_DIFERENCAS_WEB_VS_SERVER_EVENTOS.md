# 🔍 ANÁLISE: Diferenças Web vs Server - Eventos Facebook

**Data:** 2025-01-06  
**Status:** 📋 **ANÁLISE COMPLETA - PRONTO PARA CORREÇÃO**

---

## 🎯 **OBJETIVO**

Igualar as informações enviadas do **Web** e do **Server** para que o Facebook faça deduplicação correta.

---

## 📊 **DIFERENÇAS IDENTIFICADAS**

### **1. ViewContent**

#### **Navegador (Web):**
- ✅ **Parâmetros:** value, currency, content_ids (8 parâmetros no total)
- ✅ **Parâmetros de correspondência avançada:** Email, Endereço IP, Sobrenome, Telefone, Agente do usuário
- ❌ **Faltando:** fbc, fbp (não aparecem nos parâmetros)

#### **Servidor:**
- ✅ **Parâmetros:** value, currency, content_ids (4 parâmetros - **FALTA: contents, content_name, content_type, num_items**)
- ✅ **Chaves de dados do usuário:** País, Cidade, Email, Identificação externa, Identificação do clique, Identificação do navegador, Nome, Endereço IP, Sobrenome, Telefone, Estado, Agente do usuário, Código postal
- ❌ **Faltando:** fbc, fbp (não aparecem nos parâmetros)

**Diferenças:**
1. ❌ Servidor não envia: `contents`, `content_name`, `content_type`, `num_items`
2. ❌ Ambos não enviam: `fbc`, `fbp` (mas estão no user_data)

---

### **2. AddToCart**

#### **Navegador (Web):**
- ✅ **Parâmetros:** value, currency, content_ids (8 parâmetros no total)
- ✅ **Parâmetros de correspondência avançada:** Email, Endereço IP, Sobrenome, Telefone, Agente do usuário
- ❌ **Faltando:** fbc, fbp (não aparecem nos parâmetros)

#### **Servidor:**
- ✅ **Parâmetros:** value, currency, content_ids (4 parâmetros - **FALTA: contents, content_name, content_type, num_items**)
- ✅ **Chaves de dados do usuário:** País, Cidade, Email, Identificação externa, Identificação do clique, Identificação do navegador, Nome, Endereço IP, Sobrenome, Telefone, Estado, Agente do usuário, Código postal
- ❌ **Faltando:** fbc, fbp (não aparecem nos parâmetros)

**Diferenças:**
1. ❌ Servidor não envia: `contents`, `content_name`, `content_type`, `num_items`
2. ❌ Ambos não enviam: `fbc`, `fbp` (mas estão no user_data)

---

### **3. Lead**

#### **Navegador (Web):**
- ✅ **Parâmetros:** fbc, fbp (2 parâmetros) ✅ **CORRETO!**
- ✅ **Parâmetros de correspondência avançada:** Email, Endereço IP, Sobrenome, Telefone, Agente do usuário

#### **Servidor:**
- ❌ **Parâmetros:** Nenhum parâmetro visível
- ✅ **Chaves de dados do usuário:** País, Cidade, Email, Identificação externa, Identificação do clique, Identificação do navegador, Nome, Endereço IP, Sobrenome, Telefone, Estado, Agente do usuário, Código postal
- ❌ **Faltando:** fbc, fbp (não aparecem nos parâmetros)

**Diferenças:**
1. ❌ Servidor não envia: `fbc`, `fbp` nos parâmetros (mas estão no user_data)
2. ⚠️ Servidor não mostra parâmetros (pode ser que não tenha nenhum, o que é OK para Lead)

---

### **4. InitiateCheckout**

#### **Navegador (Web):**
- ✅ **Parâmetros:** value, currency, content_ids (8 parâmetros no total)
- ✅ **Parâmetros de correspondência avançada:** Email, Endereço IP, Sobrenome, Telefone, Agente do usuário
- ❌ **Faltando:** fbc, fbp (não aparecem nos parâmetros)

#### **Servidor:**
- ✅ **Parâmetros:** value, currency, content_ids (5 parâmetros - **FALTA: contents, content_name, content_type, num_items**)
- ✅ **Chaves de dados do usuário:** País, Cidade, Email, Identificação externa, Identificação do clique, Identificação do navegador, Nome, Endereço IP, Sobrenome, Telefone, Estado, Agente do usuário, Código postal
- ❌ **Faltando:** fbc, fbp (não aparecem nos parâmetros)

**Diferenças:**
1. ❌ Servidor não envia: `contents`, `content_name`, `content_type`, `num_items`
2. ❌ Ambos não enviam: `fbc`, `fbp` (mas estão no user_data)

---

## 🔍 **ANÁLISE DO DATALAYER (GTM Web Debug)**

### **Evento: begin_checkout**

**Dados enviados no DataLayer:**
```javascript
{
  event: "begin_checkout",
  ecommerce: {
    value: 39.9,
    currency: "BRL",
    items: [...]
  },
  content_ids: ["hacr962"],
  contents: [{id: "hacr962", quantity: 1, item_price: 39.9}],
  content_name: "Sistema 4 Fases - Ebook Trips",
  content_type: "product",
  num_items: 1,
  value: 39.9,
  currency: "BRL",
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
  },
  event_id: "InitiateCheckout_1762521209762_3lhjs8z7hx"
}
```

**✅ Dados disponíveis no DataLayer:**
- ✅ `value`, `currency`
- ✅ `content_ids`, `contents`
- ✅ `content_name`, `content_type`
- ✅ `num_items`
- ✅ `fbp`, `fbc` (no nível raiz E dentro de `user_data`)
- ✅ Todos os dados de `user_data`

---

## 🚨 **PROBLEMAS IDENTIFICADOS**

### **1. Servidor não envia parâmetros completos no Custom Data**

**Problema:** O servidor está enviando apenas:
- `value`
- `currency`
- `content_ids`

**Falta enviar:**
- ❌ `contents`
- ❌ `content_name`
- ❌ `content_type`
- ❌ `num_items`

**Causa:** As variáveis Event Data podem não estar criadas ou não estão mapeadas no Custom Data da tag Facebook.

---

### **2. Servidor não envia fbc e fbp nos parâmetros**

**Problema:** O servidor tem `fbc` e `fbp` no `user_data`, mas eles não aparecem como parâmetros separados.

**Causa:** O Facebook Conversion API aceita `fbc` e `fbp` tanto em `user_data` quanto como parâmetros de nível raiz. Para igualar ao Web, precisamos enviar também como parâmetros.

**Observação:** No Meta Events Manager, `fbc` e `fbp` aparecem como "Chaves de dados do usuário" quando estão em `user_data`, mas não aparecem como "Parâmetros" separados.

---

### **3. Web não envia fbc e fbp nos parâmetros (exceto Lead)**

**Problema:** O Web tem `fbc` e `fbp` no DataLayer, mas não aparecem como parâmetros nos eventos ViewContent, AddToCart, InitiateCheckout.

**Causa:** As tags Meta Pixel no GTM Web podem não estar mapeando `fbc` e `fbp` corretamente.

**Observação:** No evento Lead, `fbc` e `fbp` aparecem como parâmetros, então a configuração está correta para Lead.

---

## ✅ **SOLUÇÕES NECESSÁRIAS**

### **Solução 1: Adicionar parâmetros faltantes no Custom Data (Server-Side)**

**No GTM Server-Side → Tags → FB - ViewContent, FB - AddToCart, FB - InitiateCheckout:**

**Adicionar ao Custom Data:**
```
Property Name          Property Value
contents              {{ed - contents}}              ❌ FALTANDO
content_name          {{ed - content_name}}         ❌ FALTANDO
content_type          {{ed - content_type}}         ❌ FALTANDO
num_items             {{ed - num_items}}            ❌ FALTANDO (AddToCart, InitiateCheckout)
```

**Verificar se variáveis Event Data existem:**
- [ ] `{{ed - contents}}` → Path: `contents`
- [ ] `{{ed - content_name}}` → Path: `content_name`
- [ ] `{{ed - content_type}}` → Path: `content_type`
- [ ] `{{ed - num_items}}` → Path: `num_items`

---

### **Solução 2: Adicionar fbc e fbp ao Custom Data (Server-Side)**

**No GTM Server-Side → Tags → FB - ViewContent, FB - AddToCart, FB - InitiateCheckout, FB - Lead:**

**Adicionar ao Custom Data:**
```
Property Name          Property Value
fbc                   {{ed - fbc}}                 ❌ FALTANDO
fbp                   {{ed - fbp}}                 ❌ FALTANDO
```

**OU adicionar ao User Data (se preferir):**
```
Property Name          Property Value
fbc                   {{ed - user_data.fbc}}        ❌ FALTANDO
fbp                   {{ed - user_data.fbp}}       ❌ FALTANDO
```

**Verificar se variáveis Event Data existem:**
- [ ] `{{ed - fbc}}` → Path: `fbc` (nível raiz)
- [ ] `{{ed - fbp}}` → Path: `fbp` (nível raiz)
- [ ] `{{ed - user_data.fbc}}` → Path: `user_data.fbc`
- [ ] `{{ed - user_data.fbp}}` → Path: `user_data.fbp`

**⚠️ IMPORTANTE:** O Facebook aceita `fbc` e `fbp` tanto em `user_data` quanto como parâmetros de nível raiz. Para igualar ao Web, podemos enviar em ambos os lugares.

---

### **Solução 3: Adicionar fbc e fbp ao Object Properties (Web)**

**No GTM Web → Tags → FB - ViewContent, FB - AddToCart, FB - InitiateCheckout:**

**Adicionar ao Object Properties:**
```
Property Name          Property Value
fbc                   {{dlv - fbc}}                ❌ FALTANDO
fbp                   {{dlv - fbp}}                ❌ FALTANDO
```

**OU adicionar ao Advanced Matching (se preferir):**
```
Property Name          Property Value
fbc                   {{dlv - user_data.fbc}}      ❌ FALTANDO
fbp                   {{dlv - user_data.fbp}}      ❌ FALTANDO
```

**Verificar se variáveis Data Layer existem:**
- [ ] `{{dlv - fbc}}` → Path: `fbc` (nível raiz)
- [ ] `{{dlv - fbp}}` → Path: `fbp` (nível raiz)
- [ ] `{{dlv - user_data.fbc}}` → Path: `user_data.fbc`
- [ ] `{{dlv - user_data.fbp}}` → Path: `user_data.fbp`

**Observação:** No evento Lead, `fbc` e `fbp` já aparecem como parâmetros, então a configuração está correta. Precisamos replicar para os outros eventos.

---

## 📋 **CHECKLIST DE CORREÇÃO**

### **GTM Server-Side:**

#### **1. Criar Variáveis Event Data (se não existirem):**
- [ ] `{{ed - contents}}` → Path: `contents`
- [ ] `{{ed - content_name}}` → Path: `content_name`
- [ ] `{{ed - content_type}}` → Path: `content_type`
- [ ] `{{ed - num_items}}` → Path: `num_items`
- [ ] `{{ed - fbc}}` → Path: `fbc`
- [ ] `{{ed - fbp}}` → Path: `fbp`
- [ ] `{{ed - user_data.fbc}}` → Path: `user_data.fbc`
- [ ] `{{ed - user_data.fbp}}` → Path: `user_data.fbp`

#### **2. Adicionar ao Custom Data das Tags:**
- [ ] **FB - ViewContent:** Adicionar `contents`, `content_name`, `content_type`, `fbc`, `fbp`
- [ ] **FB - AddToCart:** Adicionar `contents`, `content_name`, `content_type`, `num_items`, `fbc`, `fbp`
- [ ] **FB - InitiateCheckout:** Adicionar `contents`, `content_name`, `content_type`, `num_items`, `fbc`, `fbp`
- [ ] **FB - Lead:** Adicionar `fbc`, `fbp` (se necessário)

#### **3. Adicionar ao User Data das Tags (opcional, para garantir):**
- [ ] **FB - ViewContent:** Adicionar `fbc`, `fbp` ao User Data
- [ ] **FB - AddToCart:** Adicionar `fbc`, `fbp` ao User Data
- [ ] **FB - InitiateCheckout:** Adicionar `fbc`, `fbp` ao User Data
- [ ] **FB - Lead:** Adicionar `fbc`, `fbp` ao User Data

---

### **GTM Web:**

#### **1. Criar Variáveis Data Layer (se não existirem):**
- [ ] `{{dlv - fbc}}` → Path: `fbc`
- [ ] `{{dlv - fbp}}` → Path: `fbp`
- [ ] `{{dlv - user_data.fbc}}` → Path: `user_data.fbc`
- [ ] `{{dlv - user_data.fbp}}` → Path: `user_data.fbp`

#### **2. Adicionar ao Object Properties das Tags:**
- [ ] **FB - ViewContent:** Adicionar `fbc`, `fbp` ao Object Properties
- [ ] **FB - AddToCart:** Adicionar `fbc`, `fbp` ao Object Properties
- [ ] **FB - InitiateCheckout:** Adicionar `fbc`, `fbp` ao Object Properties
- [ ] **FB - Lead:** ✅ Já está correto (fbc e fbp aparecem como parâmetros)

---

## 🎯 **RESULTADO ESPERADO**

### **Após as correções:**

#### **ViewContent/AddToCart/InitiateCheckout (Navegador):**
- ✅ **Parâmetros:** value, currency, content_ids, contents, content_name, content_type, num_items, fbc, fbp
- ✅ **Parâmetros de correspondência avançada:** Email, Endereço IP, Sobrenome, Telefone, Agente do usuário

#### **ViewContent/AddToCart/InitiateCheckout (Servidor):**
- ✅ **Parâmetros:** value, currency, content_ids, contents, content_name, content_type, num_items, fbc, fbp
- ✅ **Chaves de dados do usuário:** País, Cidade, Email, Identificação externa, Identificação do clique, Identificação do navegador, Nome, Endereço IP, Sobrenome, Telefone, Estado, Agente do usuário, Código postal

**✅ Eventos Web e Server terão EXATAMENTE os mesmos parâmetros!**

---

## 📝 **PRÓXIMOS PASSOS**

1. ✅ **Analisar** as diferenças (FEITO)
2. ⏳ **Criar variáveis** no GTM Server-Side
3. ⏳ **Adicionar parâmetros** ao Custom Data das tags Server-Side
4. ⏳ **Criar variáveis** no GTM Web (se necessário)
5. ⏳ **Adicionar parâmetros** ao Object Properties das tags Web
6. ⏳ **Testar** e verificar no Meta Events Manager
7. ⏳ **Validar** que eventos Web e Server têm os mesmos parâmetros

---

**Última atualização:** 2025-01-06  
**Status:** 📋 **ANÁLISE COMPLETA - PRONTO PARA IMPLEMENTAÇÃO**

