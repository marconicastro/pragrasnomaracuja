# ✅ GA4 ADICIONADO AOS CONTAINERS GTM

**Data:** 04/11/2024  
**GA4 Measurement ID:** `G-7DRG46JMBH`  
**Status:** ✅ Configurações adicionadas

---

## 📦 GTM WEB CONTAINER (GTM-WCDP2ZLH)

### **Variável Adicionada:**
- ✅ `const - ga4 measurement id` (ID: 258)
  - Valor: `G-7DRG46JMBH`
  - Folder: Settings (171)

### **Tags Adicionadas:**

1. **GA4 - Configuration** (ID: 268)
   - Tipo: Google Analytics: GA4 Configuration
   - Measurement ID: `{{const - ga4 measurement id}}`
   - Send Page View: `false`
   - Trigger: `dom - page_view` (228)
   - Folder: Meta (185)

2. **GA4 - page_view** (ID: 269)
   - Tipo: Google Analytics: GA4 Event
   - Event Name: `page_view`
   - Trigger: `dom - page_view` (228)
   - Folder: Meta (185)

3. **GA4 - view_item** (ID: 270)
   - Tipo: Google Analytics: GA4 Event
   - Event Name: `view_item`
   - Event Parameters: `value`, `currency`, `items`
   - User Properties: `user_id`, `email`, `phone`
   - Trigger: `ce - view_item` (170)
   - Folder: Meta (185)

4. **GA4 - add_to_cart** (ID: 271)
   - Tipo: Google Analytics: GA4 Event
   - Event Name: `add_to_cart`
   - Event Parameters: `value`, `currency`, `items`
   - User Properties: `user_id`, `email`, `phone`
   - Trigger: `ce - add_to_cart` (205)
   - Folder: Meta (185)

5. **GA4 - begin_checkout** (ID: 272)
   - Tipo: Google Analytics: GA4 Event
   - Event Name: `begin_checkout`
   - Event Parameters: `value`, `currency`, `items`
   - User Properties: `user_id`, `email`, `phone`
   - Trigger: `ce - begin_checkout` (202)
   - Folder: Meta (185)

6. **GA4 - purchase** (ID: 273)
   - Tipo: Google Analytics: GA4 Event
   - Event Name: `purchase`
   - Event Parameters: `transaction_id`, `value`, `currency`, `items`
   - User Properties: `user_id`, `email`, `phone`
   - Trigger: `ce - purchase` (216)
   - Folder: Meta (185)

7. **GA4 - generate_lead** (ID: 274)
   - Tipo: Google Analytics: GA4 Event
   - Event Name: `generate_lead`
   - User Properties: `user_id`, `email`, `phone`
   - Trigger: `ce - generate_lead` (222)
   - Folder: Meta (185)

---

## 📦 GTM SERVER-SIDE CONTAINER (GTM-W4PGS3LR)

### **Variável Adicionada:**
- ✅ `const - ga4 measurement id` (ID: 67)
  - Valor: `G-7DRG46JMBH`
  - Folder: Settings (20)

### **Tag Adicionada:**

1. **GA4 - All Events** (ID: 62)
   - Tipo: Google Analytics: GA4 Event
   - Measurement ID: `{{const - ga4 measurement id}}`
   - Event Name: `{{Event Name}}` (dinâmico - pega automaticamente do evento)
   - Event Parameters:
     - `transaction_id`: `{{ed - transaction_id}}`
     - `value`: `{{ed - value}}`
     - `currency`: `{{ed - currency}}`
     - `items`: `{{ed - ecommerce.items}}`
   - User Properties:
     - `user_id`: `{{ed - user_id}}`
     - `email`: `{{ed - email_address}}`
     - `phone`: `{{ed - phone_number}}`
     - `city`: `{{ed - city}}`
     - `region`: `{{ed - region}}`
     - `country`: `{{ed - country}}`
   - Triggers: `dc - view_item`, `dc - purchase`, `dc - begin_checkout`, `dc - add_to_cart`, `dc - generate_lead`, `dc - page_view`
   - Folder: Meta (16)

---

## 📊 VARIÁVEIS UTILIZADAS

### **Web Container (DataLayer Variables):**
- `{{dlv - ecommerce.transaction_id}}`
- `{{dlv - ecommerce.value}}`
- `{{dlv - ecommerce.currency}}`
- `{{dlv - ecommerce.items}}`
- `{{dlv - user_data.user_id}}`
- `{{dlv - user_data.email_address}}`
- `{{dlv - user_data.phone_number}}`

### **Server Container (Event Data Variables):**
- `{{ed - transaction_id}}`
- `{{ed - value}}`
- `{{ed - currency}}`
- `{{ed - ecommerce.items}}`
- `{{ed - user_id}}`
- `{{ed - email_address}}`
- `{{ed - phone_number}}`
- `{{ed - city}}`
- `{{ed - region}}`
- `{{ed - country}}`

---

## ✅ PRÓXIMOS PASSOS

1. **Importar no GTM:**
   - Abrir GTM Web Container
   - Workspace → Import Container
   - Selecionar `GTM-WCDP2ZLH_workspace10.json`
   - Revisar mudanças
   - Publicar

2. **Importar Server Container:**
   - Abrir GTM Server-Side Container
   - Workspace → Import Container
   - Selecionar `GTM-W4PGS3LR_workspace6.json`
   - Revisar mudanças
   - Publicar

3. **Testar:**
   - GTM Preview Mode (Web + Server)
   - Disparar eventos no site
   - Verificar GA4 Real-Time
   - Validar eventos chegando corretamente

4. **Ajustes (se necessário):**
   - Verificar trigger IDs
   - Ajustar parentFolderId se necessário
   - Confirmar variáveis Event Data mapeadas corretamente

---

## 📝 NOTAS

- ✅ Todos os IDs foram gerados automaticamente
- ✅ Estrutura mantida igual ao padrão existente
- ✅ Variáveis reutilizam as mesmas do DataLayer
- ✅ Server Container usa tag única dinâmica (recomendado)
- ⚠️ Verificar se os triggers existem antes de publicar
- ⚠️ Testar no Preview Mode primeiro

---

**Arquivos atualizados:**
- `GTM-WCDP2ZLH_workspace10.json` (Web Container)
- `GTM-W4PGS3LR_workspace6.json` (Server Container)

