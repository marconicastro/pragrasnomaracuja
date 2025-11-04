# 📊 ANÁLISE COMPLETA: Tags GA4, FB e DT

**Data:** 04/11/2024  
**Status:** Análise concluída - Correções necessárias identificadas

---

## ✅ RESUMO EXECUTIVO

### **GA4 Tags:**
- ✅ **User Properties:** 9 propriedades bem configuradas
- ✅ **Event Parameters:** 9 parâmetros configurados
- ❌ **`sendEcommerceData: false`** → **PRECISA SER `true`** ⚠️
- ⚠️ Erro de digitação: `server_conainer_url` (deveria ser `server_container_url`)

### **FB Tags:**
- ✅ **Advanced Matching:** 9 campos bem configurados
- ❌ **Custom Data:** NÃO configurado (faltando dados de ecommerce)

### **DT Tags:**
- ✅ **OK** - Não precisa de parâmetros (passa tudo para Server Container)

---

## 🔍 ANÁLISE DETALHADA

### **1. GA4 - purchase**

#### ✅ **Configurado Corretamente:**

**User Properties (9):**
- `first_name` → `{{dlv - user_data.first_name}}`
- `last_name` → `{{dlv - user_data.last_name}}`
- `email` → `{{dlv - user_data.email_address}}`
- `phone_nunmber` → `{{dlv - user_data.phone_number}}` (⚠️ typo: `phone_nunmber`)
- `city` → `{{dlv - user_data.city}}`
- `country` → `{{dlv - user_data.country}}`
- `state` → `{{dlv - user_data.region}}`
- `zip_code` → `{{dlv - user_data.postal_code}}`
- `user_id` → `{{dlv - user_data.user_id}}`

**Event Parameters (9):**
- `content_id` → `{{ucv - content_ids}}`
- `contents` → `{{ucv - contents}}`
- `currency` → `{{dlv - ecommerce.currency}}`
- `value` → `{{dlv - ecommerce.value}}`
- `event_id` → `{{Unique Event ID}}`
- `items` → `{{dlv - ecommerce.items}}`
- `transaction_id` → `{{dlv - ecommerce.transaction_id}}`
- `num_items` → `{{ucv - num_items}}`
- `server_conainer_url` → `{{const - server_container_url}}` (⚠️ typo)

#### ❌ **Problemas Encontrados:**

1. **`sendEcommerceData: false`** → **CRÍTICO**
   - **Impacto:** Os dados de ecommerce não serão enviados automaticamente
   - **Solução:** Alterar para `true`
   - **Por quê:** Quando `sendEcommerceData: true`, o GA4 automaticamente envia `transaction_id`, `value`, `currency`, `items` no formato correto

2. **Erro de digitação:**
   - `server_conainer_url` → deveria ser `server_container_url`
   - **Impacto:** Parâmetro pode não funcionar corretamente

3. **Typo em User Property:**
   - `phone_nunmber` → deveria ser `phone_number` (padrão GA4)

---

### **2. FB - Purchase**

#### ✅ **Configurado Corretamente:**

**Advanced Matching (9 campos):**
- `ct` (city) → `{{dlv - user_data.city}}`
- `cn` (country) → `{{dlv - user_data.country}}`
- `em` (email) → `{{dlv - user_data.email_address}}`
- `external_id` → `{{dlv - user_data.user_id}}`
- `fn` (first_name) → `{{dlv - user_data.first_name}}`
- `ln` (last_name) → `{{dlv - user_data.last_name}}`
- `ph` (phone) → `{{dlv - user_data.phone_number}}`
- `st` (state) → `{{dlv - user_data.region}}`
- `zp` (zip) → `{{dlv - user_data.postal_code}}`

#### ❌ **Problemas Encontrados:**

**Custom Data NÃO configurado:**
- ❌ Faltando: `value` (valor da compra)
- ❌ Faltando: `currency` (moeda)
- ❌ Faltando: `content_ids` (IDs dos produtos)
- ❌ Faltando: `contents` (detalhes dos produtos)

**Impacto:**
- Meta não receberá dados de valor/transação
- EQM pode ser menor
- DQS (Data Quality Score) pode ser afetado

**Solução:**
Adicionar Custom Data com:
- `value` → `{{dlv - ecommerce.value}}`
- `currency` → `{{dlv - ecommerce.currency}}`
- `content_ids` → `{{ucv - content_ids}}`
- `contents` → `{{ucv - contents}}`

---

### **3. Comparação com Outras Tags**

#### **GA4 - view_content:**
- ✅ User Properties: 9
- ✅ Event Parameters: 9
- ❌ `sendEcommerceData: false` → precisa ser `true`

#### **GA4 - add_to_cart:**
- ✅ User Properties: 9
- ❌ Event Parameters: 0 → **FALTANDO**
- ❌ `sendEcommerceData: false` → precisa ser `true`

#### **GA4 - begin_checkout:**
- ✅ User Properties: 9
- ❌ Event Parameters: 0 → **FALTANDO**
- ❌ `sendEcommerceData: false` → precisa ser `true`

#### **FB - ViewContent:**
- ✅ Advanced Matching: 9
- ❌ Custom Data: 0 → **FALTANDO**

#### **FB - AddToCart:**
- ✅ Advanced Matching: 9
- ❌ Custom Data: 0 → **FALTANDO**

#### **FB - InitiateCheckout:**
- ✅ Advanced Matching: 9
- ❌ Custom Data: 0 → **FALTANDO**

---

## 🔧 CORREÇÕES NECESSÁRIAS

### **PRIORIDADE ALTA:**

#### **1. GA4 Tags - Ativar `sendEcommerceData`**
- ✅ **GA4 - purchase:** `sendEcommerceData: false` → `true`
- ✅ **GA4 - view_content:** `sendEcommerceData: false` → `true`
- ✅ **GA4 - add_to_cart:** `sendEcommerceData: false` → `true`
- ✅ **GA4 - begin_checkout:** `sendEcommerceData: false` → `true`

**Como fazer:**
1. Abrir cada tag GA4 no GTM
2. Marcar checkbox **"Enviar dados de ecommerce"** ou **"Send Ecommerce Data"**
3. Salvar

**Por quê:**
- Quando ativado, o GA4 automaticamente envia `transaction_id`, `value`, `currency`, `items` no formato correto
- Os parâmetros manuais em `eventSettingsTable` podem ser redundantes ou conflitar

---

#### **2. GA4 Tags - Corrigir Event Parameters**

**Para `add_to_cart` e `begin_checkout`:**

Adicionar Event Parameters:
- `value` → `{{dlv - ecommerce.value}}`
- `currency` → `{{dlv - ecommerce.currency}}`
- `items` → `{{dlv - ecommerce.items}}`

**Para `purchase` e `view_content`:**

**Se `sendEcommerceData: true` estiver ativo:**
- Remover parâmetros redundantes de `eventSettingsTable`:
  - `transaction_id` (enviado automaticamente)
  - `value` (enviado automaticamente)
  - `currency` (enviado automaticamente)
  - `items` (enviado automaticamente)

**Manter apenas:**
- `content_id` → `{{ucv - content_ids}}` (se necessário)
- `contents` → `{{ucv - contents}}` (se necessário)
- `event_id` → `{{Unique Event ID}}`
- `num_items` → `{{ucv - num_items}}` (se necessário)
- Corrigir: `server_conainer_url` → `server_container_url`

---

#### **3. FB Tags - Adicionar Custom Data**

**Para todas as tags FB de ecommerce:**
- `FB - Purchase`
- `FB - ViewContent`
- `FB - AddToCart`
- `FB - InitiateCheckout`

**Adicionar Custom Data:**

1. **FB - Purchase:**
   - `value` → `{{dlv - ecommerce.value}}`
   - `currency` → `{{dlv - ecommerce.currency}}`
   - `content_ids` → `{{ucv - content_ids}}`
   - `contents` → `{{ucv - contents}}`

2. **FB - ViewContent:**
   - `value` → `{{dlv - ecommerce.value}}`
   - `currency` → `{{dlv - ecommerce.currency}}`
   - `content_ids` → `{{ucv - content_ids}}`
   - `contents` → `{{ucv - contents}}`

3. **FB - AddToCart:**
   - `value` → `{{dlv - ecommerce.value}}`
   - `currency` → `{{dlv - ecommerce.currency}}`
   - `content_ids` → `{{ucv - content_ids}}`
   - `contents` → `{{ucv - contents}}`

4. **FB - InitiateCheckout:**
   - `value` → `{{dlv - ecommerce.value}}`
   - `currency` → `{{dlv - ecommerce.currency}}`
   - `content_ids` → `{{ucv - content_ids}}`
   - `contents` → `{{ucv - contents}}`

---

### **PRIORIDADE MÉDIA:**

#### **4. Corrigir Typo em User Property GA4**
- `phone_nunmber` → `phone_number` (padrão GA4)

**Impacto:** Baixo (pode não afetar funcionalidade, mas não segue padrão GA4)

---

## 📋 CHECKLIST DE CORREÇÕES

### **GA4 Tags:**
- [ ] `GA4 - purchase`: Ativar `sendEcommerceData`
- [ ] `GA4 - purchase`: Corrigir `server_conainer_url` → `server_container_url`
- [ ] `GA4 - purchase`: Corrigir `phone_nunmber` → `phone_number`
- [ ] `GA4 - view_content`: Ativar `sendEcommerceData`
- [ ] `GA4 - add_to_cart`: Ativar `sendEcommerceData`
- [ ] `GA4 - add_to_cart`: Adicionar Event Parameters (value, currency, items)
- [ ] `GA4 - begin_checkout`: Ativar `sendEcommerceData`
- [ ] `GA4 - begin_checkout`: Adicionar Event Parameters (value, currency, items)

### **FB Tags:**
- [ ] `FB - Purchase`: Adicionar Custom Data (value, currency, content_ids, contents)
- [ ] `FB - ViewContent`: Adicionar Custom Data (value, currency, content_ids, contents)
- [ ] `FB - AddToCart`: Adicionar Custom Data (value, currency, content_ids, contents)
- [ ] `FB - InitiateCheckout`: Adicionar Custom Data (value, currency, content_ids, contents)

### **DT Tags:**
- [x] ✅ **OK** - Não precisa de alterações (passa tudo para Server Container)

---

## 🎯 RESPOSTA ÀS SUAS PERGUNTAS

### **1. "Terei que fazer o mesmo para FB e DT?"**

**FB:** ✅ **SIM** - Precisa adicionar Custom Data (value, currency, content_ids, contents)

**DT:** ❌ **NÃO** - DT não precisa de parâmetros adicionais, pois passa tudo para o Server Container via Event Data

---

### **2. "Veja se os parâmetros estão todos corretos"**

#### **GA4:**
- ✅ User Properties: **Corretos** (9 campos)
- ✅ Event Parameters: **Configurados** (9 parâmetros)
- ❌ **CRÍTICO:** `sendEcommerceData: false` → precisa ser `true`
- ⚠️ **Typo:** `server_conainer_url` → `server_container_url`
- ⚠️ **Typo:** `phone_nunmber` → `phone_number`

#### **FB:**
- ✅ Advanced Matching: **Corretos** (9 campos)
- ❌ **FALTANDO:** Custom Data (value, currency, content_ids, contents)

#### **DT:**
- ✅ **OK** - Não precisa de parâmetros

---

## 💡 RECOMENDAÇÕES

### **1. Priorizar Correções:**
1. **CRÍTICO:** Ativar `sendEcommerceData` nas tags GA4
2. **ALTO:** Adicionar Custom Data nas tags FB
3. **MÉDIO:** Corrigir typos e adicionar Event Parameters faltantes

### **2. Testar Após Correções:**
- Verificar no GA4 DebugView se os eventos estão chegando com dados completos
- Verificar no Meta Events Manager se Custom Data está sendo enviado
- Comparar EQM antes e depois das correções

### **3. Manter Consistência:**
- Usar sempre as mesmas variáveis do DataLayer (`{{dlv - *}}` e `{{ucv - *}}`)
- Seguir padrões GA4 para nomes de parâmetros
- Seguir padrões Meta para Custom Data

---

## 📝 NOTAS TÉCNICAS

### **Sobre `sendEcommerceData` no GA4:**
- Quando `true`, o GA4 automaticamente envia dados de ecommerce no formato Enhanced Ecommerce
- Os parâmetros manuais podem ser redundantes ou conflitar
- **Recomendação:** Ativar `sendEcommerceData` e remover parâmetros redundantes de `eventSettingsTable`

### **Sobre Custom Data no FB:**
- Custom Data é essencial para EQM e DQS altos
- `value` e `currency` são obrigatórios para eventos de compra
- `content_ids` e `contents` melhoram a qualidade dos dados

### **Sobre DT Tags:**
- DT Tags são "pass-through" - apenas enviam dados para Server Container
- Não precisam de configuração adicional no Web Container
- Toda a lógica fica no Server Container

---

**✅ Próximo passo:** Você quer que eu crie um script para corrigir automaticamente os JSONs ou prefere fazer manualmente no GTM?

