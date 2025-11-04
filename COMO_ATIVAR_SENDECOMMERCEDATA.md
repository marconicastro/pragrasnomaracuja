# 🔧 COMO ATIVAR `sendEcommerceData` no GTM

**Problema:** `sendEcommerceData: false` em todas as tags GA4 Event  
**Solução:** Ativar essa opção na interface do GTM

---

## 📍 ONDE ENCONTRAR ESSA OPÇÃO

### **Na Interface do GTM:**

A opção `sendEcommerceData` aparece na **interface do GTM** com o nome:

**"Enviar dados de ecommerce"** (português)  
ou  
**"Send Ecommerce Data"** (inglês)

---

## 🎯 PASSO A PASSO - Como Ativar

### **1. Abrir a Tag GA4**

1. GTM Web Container → **Tags**
2. Encontrar a tag GA4 que você quer editar (ex: `GA4 - purchase`)
3. **Clicar na tag** para editar

### **2. Localizar a Opção**

A opção **"Enviar dados de ecommerce"** pode estar em **2 lugares**:

#### **OPÇÃO A: Seção Principal (mais comum)**

Na tela de edição da tag GA4 Event, procure por:

**Seção:** **"Configurações de evento"** ou **"Event Settings"**

Dentro dessa seção, você verá:
- ✅ **Checkbox:** "Enviar dados de ecommerce" / "Send Ecommerce Data"
- ⬜ **Status atual:** Desmarcado (precisa marcar)

#### **OPÇÃO B: Seção Avançadas (se não aparecer na principal)**

Se não encontrar na seção principal:

1. Procurar por **"Configurações avançadas"** ou **"Advanced Settings"**
2. Expandir essa seção
3. Procurar por **"Enviar dados de ecommerce"** ou **"Send Ecommerce Data"**

---

## 📋 EVENTOS QUE PRECISAM SER ATIVADOS

Ativar `sendEcommerceData: true` para:

- ✅ **GA4 - purchase** (CRÍTICO)
- ✅ **GA4 - view_content** (CRÍTICO)
- ✅ **GA4 - add_to_cart** (CRÍTICO)
- ✅ **GA4 - begin_checkout** (CRÍTICO)
- ❌ **GA4 - generate_lead** (NÃO precisa - não é evento de ecommerce)
- ❌ **GA4 - page_view** (NÃO precisa - não é evento de ecommerce)

---

## 🖼️ ONDE APARECE NA INTERFACE (Visual)

```
┌─────────────────────────────────────────────────────────┐
│ Tag: GA4 - purchase                                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ Tipo de tag: Google Analytics: Evento GA4                │
│                                                           │
│ ID de medição: {{const - ga4 measurement id}}            │
│                                                           │
│ Nome do evento: purchase                                  │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Configurações de evento                              │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │                                                       │ │
│ │ ☐ Enviar dados de ecommerce  ← AQUI!                │ │
│ │                                                       │ │
│ │ Parâmetros do evento:                                 │ │
│ │   - transaction_id: {{dlv - ecommerce...}}           │ │
│ │   - value: {{dlv - ecommerce.value}}                 │ │
│ │   ...                                                 │ │
│ │                                                       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ Propriedades do usuário:                                  │
│   - first_name: {{dlv - user_data.first_name}}           │
│   ...                                                     │
│                                                           │
│ Trigger: ce - purchase                                    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## ⚠️ IMPORTANTE: Se Não Encontrar a Opção

### **Possíveis Razões:**

1. **Versão do GTM:** Algumas versões antigas não têm essa opção
2. **Tipo de tag errado:** Certifique-se de que é **"Google Analytics: Evento GA4"** (não GA4 Configuration)
3. **Interface em inglês:** Procure por **"Send Ecommerce Data"** ao invés de "Enviar dados de ecommerce"

### **Alternativa: Usar `eventSettingsTable`**

Se a opção não aparecer, você pode adicionar os parâmetros manualmente em **"Parâmetros do evento"**:

- `transaction_id` → `{{dlv - ecommerce.transaction_id}}`
- `value` → `{{dlv - ecommerce.value}}`
- `currency` → `{{dlv - ecommerce.currency}}`
- `items` → `{{dlv - ecommerce.items}}`

**Mas:** A opção `sendEcommerceData: true` é **mais eficiente** porque envia automaticamente no formato correto do GA4.

---

## 🔍 VERIFICAÇÃO - Como Saber se Está Ativo

### **No JSON Exportado:**

1. Exportar o container do GTM
2. Procurar por `\"sendEcommerceData\"`
3. Verificar se está como `\"true\"` ou `\"false\"`

### **No DebugView do GA4:**

1. Abrir GA4 → DebugView
2. Disparar um evento (ex: `purchase`)
3. Verificar se os dados de ecommerce aparecem automaticamente:
   - `transaction_id`
   - `value`
   - `currency`
   - `items`

---

## ✅ CHECKLIST - O Que Fazer

- [ ] Abrir `GA4 - purchase` no GTM
- [ ] Procurar por "Enviar dados de ecommerce" ou "Send Ecommerce Data"
- [ ] ✅ **Marcar o checkbox**
- [ ] Salvar a tag
- [ ] Repetir para `GA4 - view_content`
- [ ] Repetir para `GA4 - add_to_cart`
- [ ] Repetir para `GA4 - begin_checkout`
- [ ] Publicar a versão do container

---

## 💡 DICA

Se você não encontrar a opção na interface, pode ser que:

1. **A interface do GTM mudou** - Procure em **"Configurações avançadas"**
2. **Você está editando a tag errada** - Certifique-se de que é uma tag **GA4 Event** (não Configuration)
3. **A versão do GTM é antiga** - Atualize ou use parâmetros manuais

**Próximo passo:** Me avise se encontrou ou não a opção, e eu te ajudo com uma alternativa!

