# 📋 GUIA: Criar Tags GA4 Manualmente no GTM

**Motivo:** Tags GA4 não podem ser importadas via JSON (tipo não reconhecido)  
**Solução:** Criar manualmente no GTM usando a interface

---

## 🎯 GTM WEB CONTAINER

### **1. Criar Variável GA4 Measurement ID**

**Passos:**
1. GTM → **Variáveis** → **Nova**
2. **Nome:** `const - ga4 measurement id`
3. **Tipo:** Constante
4. **Valor:** `G-7DRG46JMBH`
5. **Pasta:** Settings (mesma pasta da variável `const - meta pixel id`)
6. **Salvar**

---

### **2. Criar GA4 Configuration Tag**

**Passos:**
1. GTM → **Tags** → **Nova**
2. **Nome:** `GA4 - Configuration`
3. **Tipo:** **Tag do Google** → **Google Analytics: Configuração do GA4**
4. **ID de medição:** `{{const - ga4 measurement id}}`
5. **Enviar evento de visualização de página:** ❌ Desmarcado
6. **Trigger:** `dom - page_view` (ou criar trigger "All Pages")
7. **Pasta:** Meta (mesma pasta das tags FB)
8. **Salvar**

---

### **3. Criar GA4 Event Tags (6 tags)**

#### **3.1. GA4 - page_view**

1. **Tags** → **Nova**
2. **Nome:** `GA4 - page_view`
3. **Tipo:** **Tag do Google** → **Google Analytics: Evento GA4**
4. **ID de medição:** `{{const - ga4 measurement id}}`
5. **Nome do evento:** `page_view`
6. **Parâmetros do evento:** (nenhum)
7. **Propriedades do usuário:**
   - `user_id`: `{{dlv - user_data.user_id}}`
   - `email`: `{{dlv - user_data.email_address}}`
   - `phone`: `{{dlv - user_data.phone_number}}`
8. **Trigger:** `dom - page_view`
9. **Pasta:** Meta
10. **Salvar**

---

#### **3.2. GA4 - view_item**

1. **Tags** → **Nova**
2. **Nome:** `GA4 - view_item`
3. **Tipo:** **Tag do Google** → **Google Analytics: Evento GA4**
4. **ID de medição:** `{{const - ga4 measurement id}}`
5. **Nome do evento:** `view_item`
6. **Parâmetros do evento:**
   - `value`: `{{dlv - ecommerce.value}}`
   - `currency`: `{{dlv - ecommerce.currency}}`
   - `items`: `{{dlv - ecommerce.items}}`
7. **Propriedades do usuário:**
   - `user_id`: `{{dlv - user_data.user_id}}`
   - `email`: `{{dlv - user_data.email_address}}`
   - `phone`: `{{dlv - user_data.phone_number}}`
8. **Trigger:** `ce - view_item`
9. **Pasta:** Meta
10. **Salvar**

---

#### **3.3. GA4 - add_to_cart**

1. **Tags** → **Nova**
2. **Nome:** `GA4 - add_to_cart`
3. **Tipo:** **Tag do Google** → **Google Analytics: Evento GA4**
4. **ID de medição:** `{{const - ga4 measurement id}}`
5. **Nome do evento:** `add_to_cart`
6. **Parâmetros do evento:**
   - `value`: `{{dlv - ecommerce.value}}`
   - `currency`: `{{dlv - ecommerce.currency}}`
   - `items`: `{{dlv - ecommerce.items}}`
7. **Propriedades do usuário:**
   - `user_id`: `{{dlv - user_data.user_id}}`
   - `email`: `{{dlv - user_data.email_address}}`
   - `phone`: `{{dlv - user_data.phone_number}}`
8. **Trigger:** `ce - add_to_cart`
9. **Pasta:** Meta
10. **Salvar**

---

#### **3.4. GA4 - begin_checkout**

1. **Tags** → **Nova**
2. **Nome:** `GA4 - begin_checkout`
3. **Tipo:** **Tag do Google** → **Google Analytics: Evento GA4**
4. **ID de medição:** `{{const - ga4 measurement id}}`
5. **Nome do evento:** `begin_checkout`
6. **Parâmetros do evento:**
   - `value`: `{{dlv - ecommerce.value}}`
   - `currency`: `{{dlv - ecommerce.currency}}`
   - `items`: `{{dlv - ecommerce.items}}`
7. **Propriedades do usuário:**
   - `user_id`: `{{dlv - user_data.user_id}}`
   - `email`: `{{dlv - user_data.email_address}}`
   - `phone`: `{{dlv - user_data.phone_number}}`
8. **Trigger:** `ce - begin_checkout`
9. **Pasta:** Meta
10. **Salvar**

---

#### **3.5. GA4 - purchase**

1. **Tags** → **Nova**
2. **Nome:** `GA4 - purchase`
3. **Tipo:** **Tag do Google** → **Google Analytics: Evento GA4**
4. **ID de medição:** `{{const - ga4 measurement id}}`
5. **Nome do evento:** `purchase`
6. **Parâmetros do evento:**
   - `transaction_id`: `{{dlv - ecommerce.transaction_id}}`
   - `value`: `{{dlv - ecommerce.value}}`
   - `currency`: `{{dlv - ecommerce.currency}}`
   - `items`: `{{dlv - ecommerce.items}}`
7. **Propriedades do usuário:**
   - `user_id`: `{{dlv - user_data.user_id}}`
   - `email`: `{{dlv - user_data.email_address}}`
   - `phone`: `{{dlv - user_data.phone_number}}`
8. **Trigger:** `ce - purchase`
9. **Pasta:** Meta
10. **Salvar**

---

#### **3.6. GA4 - generate_lead**

1. **Tags** → **Nova**
2. **Nome:** `GA4 - generate_lead`
3. **Tipo:** **Tag do Google** → **Google Analytics: Evento GA4**
4. **ID de medição:** `{{const - ga4 measurement id}}`
5. **Nome do evento:** `generate_lead`
6. **Parâmetros do evento:** (nenhum)
7. **Propriedades do usuário:**
   - `user_id`: `{{dlv - user_data.user_id}}`
   - `email`: `{{dlv - user_data.email_address}}`
   - `phone`: `{{dlv - user_data.phone_number}}`
8. **Trigger:** `ce - generate_lead`
9. **Pasta:** Meta
10. **Salvar**

---

## 🎯 GTM SERVER-SIDE CONTAINER

### **1. Criar Variável GA4 Measurement ID**

**Passos:**
1. GTM Server → **Variáveis** → **Nova**
2. **Nome:** `const - ga4 measurement id`
3. **Tipo:** Constante
4. **Valor:** `G-7DRG46JMBH`
5. **Pasta:** Settings (mesma pasta da variável `const - meta pixel id`)
6. **Salvar**

---

### **2. Criar GA4 - All Events Tag (ÚNICA)**

**Passos:**
1. GTM Server → **Tags** → **Nova**
2. **Nome:** `GA4 - All Events`
3. **Tipo:** **Tag do Google** → **Google Analytics: Evento GA4**
4. **ID de medição:** `{{const - ga4 measurement id}}`
5. **Nome do evento:** `{{Event Name}}` (dinâmico - pega do evento)
6. **Parâmetros do evento:**
   - `transaction_id`: `{{ed - transaction_id}}`
   - `value`: `{{ed - value}}`
   - `currency`: `{{ed - currency}}`
   - `items`: `{{ed - ecommerce.items}}`
7. **Propriedades do usuário:**
   - `user_id`: `{{ed - user_id}}`
   - `email`: `{{ed - email_address}}`
   - `phone`: `{{ed - phone_number}}`
   - `city`: `{{ed - city}}`
   - `region`: `{{ed - region}}`
   - `country`: `{{ed - country}}`
8. **Triggers:** Todos os triggers de eventos:
   - `dc - view_item`
   - `dc - purchase`
   - `dc - begin_checkout`
   - `dc - add_to_cart`
   - `dc - generate_lead`
   - `dc - page_view`
9. **Pasta:** Meta (mesma pasta das tags FB)
10. **Salvar**

---

## ✅ CHECKLIST

### **Web Container:**
- [ ] Variável `const - ga4 measurement id` criada
- [ ] Tag `GA4 - Configuration` criada
- [ ] Tag `GA4 - page_view` criada
- [ ] Tag `GA4 - view_item` criada
- [ ] Tag `GA4 - add_to_cart` criada
- [ ] Tag `GA4 - begin_checkout` criada
- [ ] Tag `GA4 - purchase` criada
- [ ] Tag `GA4 - generate_lead` criada

### **Server Container:**
- [ ] Variável `const - ga4 measurement id` criada
- [ ] Tag `GA4 - All Events` criada

---

## 🧪 TESTAR

1. **Preview Mode** (Web + Server)
2. Disparar eventos no site
3. Verificar GA4 Real-Time
4. Validar eventos chegando

---

**Nota:** As tags GA4 precisam ser criadas manualmente no GTM, pois o tipo "Tag do Google" não pode ser importado via JSON.

