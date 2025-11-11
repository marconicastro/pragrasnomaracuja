# ✅ Esclarecimento: Valores Corretos

## 🎯 Diferença entre os Valores

### 1. `predicted_ltv` (Predicted Lifetime Value)

**Valor:** `150` (não 15.0!)

**O que é:**
- Valor esperado do cliente ao longo do tempo
- Considera upsells, downsells, recorrência
- Para o Ebook Trips: R$ 150,00 (ebook R$39,90 + upsells)

**Onde usar:**
- No evento **Purchase** (custom_data)
- No GTM Server-Side: `{{ed - predicted_ltv}}` ou valor fixo `150`

**Código atual:**
```typescript
predicted_ltv: 150.0  // ✅ Correto!
```

---

### 2. `value` (Value Optimization)

**Valores diferentes para cada evento:**

#### Lead Event:
- **Valor:** `15.0` (R$ 15,00)
- **O que é:** Valor do Lead para Value Optimization
- **Uso:** Meta otimiza para encontrar leads que valem R$ 15,00

#### Purchase Event:
- **Valor:** `39.9` (R$ 39,90)
- **O que é:** Valor da compra para Value Optimization
- **Uso:** Meta otimiza para encontrar compras de R$ 39,90

**Código atual:**
```typescript
// Lead
value: 15.0  // ✅ Correto!

// Purchase
value: 39.9  // ✅ Correto!
```

---

## 📊 Resumo dos Valores

| Campo | Evento | Valor | O que é |
|-------|--------|-------|---------|
| `predicted_ltv` | Purchase | **150** | Valor esperado ao longo do tempo |
| `value` | Lead | **15.0** | Valor do Lead (Value Optimization) |
| `value` | Purchase | **39.9** | Valor da compra (Value Optimization) |

---

## ✅ Configuração no GTM Server-Side

### Para `predicted_ltv`:

**Opção 1: Usar variável (recomendado)**
```
Name: predicted_ltv
Value: {{ed - predicted_ltv}}
```
→ Vai pegar `150.0` do código automaticamente ✅

**Opção 2: Valor fixo**
```
Name: predicted_ltv
Value: 150
```
→ Valor fixo de 150 ✅

**⚠️ NÃO use:**
- ❌ `15.0` (esse é o value do Lead!)
- ❌ `39.9` (esse é o value do Purchase!)

---

## 🎯 Para Value Optimization no Ads Manager

### Lead:
- Meta usa automaticamente: `value: 15.0`
- Não precisa configurar nada no GTM
- Só ativar "Maximize Value of Conversions" no Ads Manager

### Purchase:
- Meta usa automaticamente: `value: 39.9`
- Não precisa configurar nada no GTM
- Só ativar "Maximize Value of Conversions" no Ads Manager

---

## ✅ Checklist de Valores

- [x] `predicted_ltv` = **150** (não 15.0!) ✅
- [x] `value` no Lead = **15.0** ✅
- [x] `value` no Purchase = **39.9** ✅
- [ ] Configurar `predicted_ltv: 150` no GTM Server-Side
- [ ] Ativar Value Optimization no Ads Manager

---

**Última atualização:** 2025-01-08

