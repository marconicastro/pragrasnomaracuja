# ✅ SOLUÇÃO: Sincronizar Código com Trigger

**Problema:** Código envia `event: 'purchase'`, mas trigger não está acessando corretamente.

---

## 🔍 ANÁLISE

### **O que o código envia:**
```javascript
{
  event: 'purchase',  // Nível raiz
  ecommerce: { ... },
  user_data: { ... }
}
```

### **O que o GTM recebe:**
- `event_name = "Data"` (padrão para webhooks)
- Dados do evento contêm `event: "purchase"` no nível raiz

### **O que o trigger precisa:**
- **Variável Event Data** para acessar `event` dos dados do evento
- **NÃO Data Layer Variable** (pode não funcionar para webhooks server-side)

---

## 🔧 SOLUÇÃO: Usar Event Data Variable

### **No GTM Server-Side:**

**1. Criar Variável Event Data:**
- GTM Server-Side → Variáveis → Novo
- **Nome:** `ed - event`
- **Tipo:** Event Data Variable
- **Variable Name:** `event`
- **Salvar**

**2. Ajustar Trigger:**
- Trigger: `dc - purchase`
- Nome do evento: `Data`
- Filtro:
  - Campo: `{{ed - event}}` (Event Data Variable)
  - Operador: `igual a`
  - Valor: `purchase`

---

## 📝 VERIFICAÇÃO

### **No Stream do GTM:**
1. Abrir evento no stream
2. Ir em "Variáveis"
3. Verificar se `{{ed - event}}` aparece com valor `"purchase"`

### **Se não aparecer:**
- A variável Event Data pode não estar pegando o campo
- Pode precisar usar outro nome de variável
- Verificar estrutura completa dos dados do evento

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Criar variável Event Data `ed - event`**
2. ✅ **Ajustar trigger para usar `{{ed - event}}`**
3. ✅ **Testar webhook**
4. ✅ **Verificar se tag dispara**

---

**Status**: Criar variável Event Data e ajustar trigger

