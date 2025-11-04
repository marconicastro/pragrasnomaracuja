# 🔍 DIAGNÓSTICO: Tags Não Disparam

**Problema:** Evento chega ao GTM Server-Side, mas tags não disparam.

---

## 🔍 POSSÍVEIS CAUSAS

### **1. Event Name Incorreto**
Quando um evento chega via webhook `/webhook`, o GTM Server-Side pode estar convertendo o nome do evento.

**Verificar:**
- No stream do GTM, qual é o `event_name` do evento?
- O trigger está procurando por esse nome?

### **2. Trigger Não Aceita Webhook Client**
O trigger pode estar configurado para aceitar apenas "Data Client".

**Verificar:**
- Trigger `ce - purchase` tem filtro de Client Name?
- Filtro aceita "Webhook Client"?

### **3. Variáveis Não Estão Disponíveis**
As tags podem precisar de variáveis que não estão sendo passadas.

**Verificar:**
- No stream, quais variáveis estão disponíveis?
- As variáveis necessárias estão mapeadas?

---

## 🔧 SOLUÇÕES PARA TESTAR

### **Solução 1: Verificar Event Name no Stream**

1. Abrir GTM Server-Side Preview Mode
2. Clicar no evento `purchase` no stream
3. Verificar na aba "Dados do evento":
   - Qual é o `event_name`?
   - É `"purchase"` ou `"Data"`?

### **Solução 2: Ajustar Trigger**

Se o `event_name` for `"Data"` ao invés de `"purchase"`:

1. Criar novo trigger ou ajustar existente:
   - Tipo: Evento personalizado
   - Nome do evento: `Data` (ou o nome que aparecer)
   - Filtro adicional: `event = purchase` (em variáveis)

### **Solução 3: Verificar Variáveis Disponíveis**

No stream do GTM, verificar:
- `event` → deve ser `"purchase"`
- `ecommerce.transaction_id` → deve estar disponível
- `user_data.user_id` → deve estar disponível

---

## 📝 INFORMAÇÕES NECESSÁRIAS

Para diagnosticar melhor, preciso saber:

1. **No stream do GTM Server-Side:**
   - Qual é o `event_name` do evento?
   - Qual é o `event` (dentro dos dados do evento)?
   - Quais variáveis estão disponíveis?

2. **No trigger `ce - purchase`:**
   - Qual é o "Nome do evento" configurado?
   - Há algum filtro de Client Name?
   - Há outros filtros?

3. **Nas tags:**
   - Tag "FB - Purchase" está ativa?
   - Tag "GA4 - All Events" está ativa?

---

**Status**: Aguardando informações do stream e triggers para diagnosticar
