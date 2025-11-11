# ✅ Checklist Rápido: O que fazer agora?

## 🎯 Status Atual

✅ **Código já está implementado!** (não precisa mexer em código)
- Value Optimization: ✅
- Predicted LTV: ✅

❌ **Falta apenas configurar no Ads Manager e GTM Server-Side**

---

## 📋 Passo a Passo (15 minutos)

### 1️⃣ Value Optimization no Ads Manager (5 min)

#### Opção A: Editar Campanha Existente

1. **Ads Manager** → Abra uma campanha existente
2. Clique em **"Edit"** (Editar)
3. Vá em **"Optimization & Delivery"**
4. Em **"Optimization"**, selecione: **"Maximize Value of Conversions"**
5. Em **"Conversion Event"**, selecione: **"Purchase"**
6. Em **"Target ROAS"**, defina: **2.5** (ou 2x-3x)
7. Clique em **"Publish"** (Publicar)

#### Opção B: Criar Nova Campanha de Teste

1. **Ads Manager** → **"Create"** (Criar)
2. Escolha objetivo: **"Sales"** ou **"Conversions"**
3. Configure normalmente (público, criativos, etc.)
4. Em **"Optimization & Delivery"**:
   - **Optimization:** "Maximize Value of Conversions"
   - **Conversion Event:** "Purchase"
   - **Target ROAS:** 2.5
5. **Budget:** R$50/dia (para teste)
6. **Schedule:** 3-5 dias
7. Clique em **"Publish"**

#### Verificar no Events Manager

1. **Events Manager** → Seu Pixel
2. Vá em **"Settings"**
3. Verifique se **"Value Optimization"** está ativo (geralmente é automático)

---

### 2️⃣ Predicted LTV no GTM Server-Side (10 min)

#### Passo 1: Acessar GTM Server-Side

1. Acesse: **https://tagmanager.google.com**
2. Selecione o container: **GTM-W4PGS3LR** (Server-Side)
3. Vá em **"Tags"**

#### Passo 2: Editar Tag "FB - Purchase"

1. Encontre a tag: **"FB - Purchase"**
2. Clique para editar

#### Passo 3: Adicionar predicted_ltv no Custom Data

1. Vá em **"User Data"** ou **"Custom Data"** (depende da tag)
2. Procure por **"Custom Data List"** ou **"Custom Parameters"**
3. Clique em **"Add"** ou **"+"**
4. Adicione:
   - **Name:** `predicted_ltv`
   - **Value:** `{{ed - predicted_ltv}}` (vai pegar 150.0 do código)
5. **OU** se não tiver a variável, use valor fixo:
   - **Name:** `predicted_ltv`
   - **Value:** `150` (não 15.0! É 150 mesmo - valor esperado ao longo do tempo)

**⚠️ IMPORTANTE:**
- `predicted_ltv` = **150** (não 15.0!) - Valor esperado ao longo do tempo
- `value` para Value Optimization:
  - Lead: **15.0** (valor do lead)
  - Purchase: **39.9** (valor da compra)

#### Passo 4: Salvar e Publicar

1. Clique em **"Save"** (Salvar)
2. Vá em **"Submit"** (Enviar) ou **"Publish"** (Publicar)
3. Adicione uma descrição: "Adicionar predicted_ltv no Purchase"
4. Clique em **"Publish"**

#### Verificar Variável (se necessário)

Se a variável `{{ed - predicted_ltv}}` não existir:

1. Vá em **"Variables"** (Variáveis)
2. Clique em **"New"** (Nova)
3. Tipo: **"Event Data"**
4. **Variable Name:** `predicted_ltv`
5. **Data Layer Variable Name:** `predicted_ltv`
6. Clique em **"Save"**

---

### 3️⃣ Testar (Opcional, mas recomendado)

#### Teste no Events Manager

1. **Events Manager** → Seu Pixel → **"Test Events"**
2. Use o **Test Event Code** do seu `.env` (se tiver)
3. Dispare um Purchase (via site ou webhook)
4. Verifique se aparece:
   - `value: 39.9`
   - `predicted_ltv: 150` (no custom_data)

#### Teste em Campanha Pequena

1. Crie uma campanha teste com **R$50/dia**
2. Rode por **3-5 dias**
3. Monitore:
   - **ROAS** (deve melhorar)
   - **Value per Conversion** (deve aparecer)
   - **Custo por aquisição** (deve diminuir)

---

## 📊 Como Monitorar Resultados

### No Ads Manager

1. Vá em **"Columns"** → **"Customize"**
2. Adicione:
   - ✅ **ROAS** (Return on Ad Spend)
   - ✅ **Value per Conversion**
   - ✅ **Cost per Purchase**
3. Compare com campanhas anteriores

### No Events Manager

1. Vá em **"Diagnostics"** → **"Custom Parameters"**
2. Verifique se `predicted_ltv` está sendo usado
3. Após 50+ events, deve aparecer em "Aggregated Event Measurement"

### O que esperar (7-14 dias)

- ✅ ROAS: 2x → 3-4x
- ✅ Custo por aquisição: -25%
- ✅ Qualidade de leads: +30%
- ✅ Score no Events Manager: 9.3 → 9.5+

---

## ⚠️ Importante

### Não precisa mexer em código!
- ✅ Tudo já está implementado
- ✅ Só falta configurar no Ads Manager e GTM

### Se algo der errado:
- Remova as configurações
- Volta ao normal (não quebra nada)
- Custom params são opcionais

### Ajustes futuros:
- Se `predicted_ltv: 150` não estiver ideal, ajuste no código
- Mas primeiro teste com 150 por 7-14 dias
- Depois ajuste baseado em dados reais

---

## 🎯 Resumo Ultra-Rápido

1. **Ads Manager:** Ativar "Maximize Value of Conversions" (5 min)
2. **GTM Server-Side:** Adicionar `predicted_ltv` na tag "FB - Purchase" (10 min)
3. **Testar:** Verificar no Events Manager (opcional)
4. **Monitorar:** Acompanhar resultados por 7-14 dias

**Total: 15 minutos de configuração!** ⚡

---

## ❓ Dúvidas?

### "Não encontro a opção no Ads Manager"
- Pode variar conforme a versão
- Procure por "Value Optimization" ou "Maximize Value"
- Se não encontrar, pode estar em "Advanced Options"

### "A variável {{ed - predicted_ltv}} não existe"
- Use valor fixo: `150`
- Ou crie a variável (instruções acima)

### "Como sei se está funcionando?"
- Verifique no Events Manager → Test Events
- Veja se `predicted_ltv` aparece no custom_data
- Monitore ROAS nas campanhas

---

**Última atualização:** 2025-01-08

