# 📊 Cálculo do LTV Real - Ebook Trips

## 🎯 Estrutura da Oferta

### Produto Principal
- **Nome:** Controle de Trips no Maracujá
- **Valor:** R$ 39,90

### Order Bumps
1. **30 Pragas e Doenças:** R$ 17,90
2. **Produção de Mudas:** R$ 17,90 (ou R$ 15,90 conforme imagem)
3. **Adubação:** R$ 17,90

---

## 💰 Cálculo do LTV

### Cenário 1: Máximo (Todos compram tudo)
```
Produto Principal: R$ 39,90
Order Bump 1:      R$ 17,90
Order Bump 2:      R$ 17,90
Order Bump 3:      R$ 17,90
────────────────────────────
TOTAL MÁXIMO:      R$ 93,60
```

### Cenário 2: Conservador (Taxa de conversão baixa)
```
Produto Principal: R$ 39,90
Order Bump 1:      R$ 17,90 × 20% = R$ 3,58
Order Bump 2:      R$ 17,90 × 15% = R$ 2,69
Order Bump 3:      R$ 17,90 × 10% = R$ 1,79
────────────────────────────────────────────
TOTAL CONSERVADOR: R$ 47,96 ≈ R$ 48,00
```

### Cenário 3: Médio (Taxa de conversão média)
```
Produto Principal: R$ 39,90
Order Bump 1:      R$ 17,90 × 30% = R$ 5,37
Order Bump 2:      R$ 17,90 × 25% = R$ 4,48
Order Bump 3:      R$ 17,90 × 20% = R$ 3,58
────────────────────────────────────────────
TOTAL MÉDIO:       R$ 53,33 ≈ R$ 53,00
```

### Cenário 4: Otimista (Taxa de conversão alta)
```
Produto Principal: R$ 39,90
Order Bump 1:      R$ 17,90 × 40% = R$ 7,16
Order Bump 2:      R$ 17,90 × 35% = R$ 6,27
Order Bump 3:      R$ 17,90 × 30% = R$ 5,37
────────────────────────────────────────────
TOTAL OTIMISTA:    R$ 58,70 ≈ R$ 59,00
```

### Cenário 5: Agressivo (Para otimização do Meta)
```
Produto Principal: R$ 39,90
Order Bump 1:      R$ 17,90 × 50% = R$ 8,95
Order Bump 2:      R$ 17,90 × 45% = R$ 8,06
Order Bump 3:      R$ 17,90 × 40% = R$ 7,16
────────────────────────────────────────────
TOTAL AGRESSIVO:   R$ 64,07 ≈ R$ 64,00
```

---

## 🎯 Recomendação

### Para Value Optimization (Meta ML)

**Valor recomendado:** `predicted_ltv: 93.6` (máximo) ou `90` (arredondado)

**Por quê?**
- Meta vai priorizar clientes com maior potencial
- Mesmo que nem todos comprem todos os order bumps, o algoritmo vai aprender
- Valor mais alto = melhor otimização para clientes de alto valor

**Alternativa conservadora:** `predicted_ltv: 60` (baseado em cenário otimista)

---

## 📝 Valores Sugeridos

| Cenário | LTV | Quando Usar |
|---------|-----|-------------|
| Conservador | 48 | Se quiser ser realista |
| Médio | 53 | Se quiser balanceado |
| Otimista | 59 | Se quiser agressivo |
| Agressivo | 64 | Para otimização máxima |
| Máximo | 90-94 | Para priorizar clientes de alto valor |

---

## 🔧 Como Ajustar no Futuro

### Opção 1: Variável de Ambiente (Recomendado)

```env
# .env.local
PREDICTED_LTV=90
```

### Opção 2: Constante no Código

```typescript
const LTV_CONFIG = {
  predicted_ltv: 90.0  // Ajustar aqui quando mudar ofertas
};
```

### Opção 3: Cálculo Dinâmico

```typescript
// Calcular baseado em valores reais
const calculateLTV = (basePrice: number, orderBumps: number[]) => {
  const maxLTV = basePrice + orderBumps.reduce((sum, price) => sum + price, 0);
  return maxLTV * 0.95; // 95% do máximo (considerando conversão)
};
```

---

## 📊 Ajuste Baseado em Dados Reais

Após coletar dados reais (30-60 dias):

1. **Calcular taxa de conversão real:**
   - Quantos % compram Order Bump 1?
   - Quantos % compram Order Bump 2?
   - Quantos % compram Order Bump 3?

2. **Ajustar predicted_ltv:**
   - Se taxa real for maior: aumentar predicted_ltv
   - Se taxa real for menor: diminuir predicted_ltv

3. **Fórmula:**
   ```
   predicted_ltv = basePrice + (orderBump1 × taxa1) + (orderBump2 × taxa2) + (orderBump3 × taxa3)
   ```

---

**Última atualização:** 2025-01-08

