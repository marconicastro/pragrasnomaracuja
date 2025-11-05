# 🔍 ANÁLISE: Formato do Payload vs Trigger

**Problema:** Código envia `event: 'purchase'`, mas trigger pode não estar acessando corretamente.

---

## 🔍 ANÁLISE ATUAL

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
- `event = "purchase"` (nos dados do evento)

### **O que o trigger precisa:**
- `event_name = "Data"` ✅
- `event = "purchase"` (mas pode não estar acessível como variável)

---

## 🔧 POSSÍVEIS SOLUÇÕES

### **Solução 1: Ajustar Formato do Payload**

**Enviar evento no formato que o GTM espera:**
```javascript
{
  event: 'purchase',  // Manter
  event_name: 'purchase',  // Adicionar também?
  // ... resto
}
```

**Mas isso pode não funcionar porque o GTM sempre converte para "Data".**

---

### **Solução 2: Usar Variável Event Data**

**No GTM Server-Side, usar variável Event Data:**
- Tipo: Event Data Variable
- Variable Name: `event`
- Isso pega o campo `event` dos dados do evento

---

### **Solução 3: Ajustar Trigger para Usar Event Data Variable**

**Criar variável:**
1. GTM Server-Side → Variáveis → Novo
2. Tipo: **Event Data Variable**
3. Variable Name: `event`
4. Nome: `ed - event`

**No trigger:**
- Campo: `{{ed - event}}`
- Operador: `igual a`
- Valor: `purchase`

---

## 🎯 RECOMENDAÇÃO

**Usar Event Data Variable ao invés de Data Layer Variable:**
- Event Data Variable acessa dados do evento diretamente
- Data Layer Variable pode não funcionar para webhooks server-side

---

**Status**: Verificando formato correto do payload




