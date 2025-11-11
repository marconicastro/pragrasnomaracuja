# ✅ Verificação: predicted_ltv no GTM Server-Side

## 🎯 Checklist de Verificação

### 1. Variável Criada ✅

**Verificar no GTM Server-Side:**

- [ ] Acessar: **Variables** (Variáveis)
- [ ] Procurar por: **"predicted_ltv"**
- [ ] Verificar configuração:
  - ✅ Tipo: **Event Data** (ou Data Layer Variable)
  - ✅ Variable Name: **predicted_ltv**
  - ✅ Data Layer Variable Name: **predicted_ltv**
  - ✅ Default Value: **150** (opcional, mas recomendado)

**Como verificar:**
1. GTM Server-Side → Variables
2. Procure por "predicted_ltv"
3. Clique para ver detalhes
4. Confirme os campos acima

---

### 2. Tag "FB - Purchase" Configurada ✅

**Verificar no GTM Server-Side:**

- [ ] Acessar: **Tags** → **"FB - Purchase"**
- [ ] Editar a tag
- [ ] Ir em **"Custom Data"** ou **"Custom Data List"**
- [ ] Verificar se existe:
  - ✅ Name: **predicted_ltv**
  - ✅ Value: **{{predicted_ltv}}** (ou `{{ed - predicted_ltv}}`)

**Como verificar:**
1. GTM Server-Side → Tags
2. Encontre "FB - Purchase"
3. Clique para editar
4. Procure por "Custom Data" ou "Custom Parameters"
5. Verifique se `predicted_ltv` está na lista

---

### 3. Alterações Publicadas ✅

**Verificar no GTM Server-Side:**

- [ ] Verificar se as alterações foram publicadas
- [ ] Verificar versão atual (deve ter a descrição da alteração)
- [ ] Confirmar que está ativa

**Como verificar:**
1. GTM Server-Side → Versions (Versões)
2. Verifique a versão mais recente
3. Deve ter descrição como: "Adicionar predicted_ltv" ou similar
4. Status deve estar como "Published" (Publicada)

---

## 🧪 Como Testar se Está Funcionando

### Teste 1: Events Manager (Test Events)

**Passo a passo:**

1. **Events Manager** → Seu Pixel → **"Test Events"**
2. Use o **Test Event Code** (se tiver no `.env`):
   ```env
   META_TEST_EVENT_CODE=seu_codigo_aqui
   ```
3. Dispare um Purchase:
   - Via site (página de obrigado)
   - OU via webhook (teste manual)
4. Verifique no Events Manager:
   - Evento deve aparecer em **"Test Events"**
   - Clique no evento para ver detalhes
   - Procure por **"Custom Data"** ou **"Parameters"**
   - Deve aparecer: `predicted_ltv: 150`

**O que procurar:**
```json
{
  "event_name": "Purchase",
  "custom_data": {
    "value": 39.9,
    "currency": "BRL",
    "predicted_ltv": 150,  // ← DEVE APARECER AQUI!
    "content_ids": ["hacr962"],
    ...
  }
}
```

---

### Teste 2: Preview Mode (GTM)

**Passo a passo:**

1. **GTM Server-Side** → Ative **Preview Mode**
2. Dispare um Purchase (via site ou webhook)
3. No Preview Mode, verifique:
   - Evento "purchase" foi disparado
   - Variável `{{predicted_ltv}}` está preenchida com `150`
   - Tag "FB - Purchase" foi acionada
   - Custom Data contém `predicted_ltv: 150`

**Como verificar:**
1. Preview Mode → Tags Fired
2. Clique na tag "FB - Purchase"
3. Veja os dados enviados
4. Procure por `predicted_ltv` no Custom Data

---

### Teste 3: Console do Browser (Debug)

**Passo a passo:**

1. Abra o site no navegador
2. Abra o **Console** (F12)
3. Dispare um Purchase (se possível)
4. Verifique os logs:
   - Deve aparecer: `predicted_ltv: 150` no DataLayer

**O que procurar:**
```javascript
// No console, digite:
window.dataLayer

// Procure pelo último evento "purchase"
// Deve ter:
{
  event: "purchase",
  predicted_ltv: 150,  // ← DEVE APARECER AQUI!
  value: 39.9,
  ...
}
```

---

### Teste 4: Logs do GTM Server-Side (Se tiver acesso)

**Passo a passo:**

1. Acesse os logs do GTM Server-Side (Stape.io)
2. Procure por eventos "purchase" recentes
3. Verifique o payload enviado para Meta CAPI
4. Deve conter `predicted_ltv: 150` no `custom_data`

---

## 🔍 O que Verificar em Cada Teste

### ✅ Sucesso (Está funcionando):

- `predicted_ltv: 150` aparece no Events Manager
- Variável `{{predicted_ltv}}` está preenchida no Preview Mode
- Custom Data da tag contém `predicted_ltv: 150`
- Logs mostram o valor sendo enviado

### ❌ Problema (Não está funcionando):

- `predicted_ltv` não aparece no Events Manager
- Variável está vazia ou undefined no Preview Mode
- Custom Data não contém `predicted_ltv`
- Erro nos logs do GTM

---

## 🛠️ Troubleshooting

### Problema: "predicted_ltv não aparece no Events Manager"

**Possíveis causas:**
1. Variável não foi criada corretamente
2. Tag não está usando a variável
3. Valor não está vindo do DataLayer
4. GTM não foi publicado

**Soluções:**
1. Verificar se a variável existe e está configurada corretamente
2. Verificar se a tag está usando `{{predicted_ltv}}`
3. Verificar se o código está enviando `predicted_ltv: 150.0` no DataLayer
4. Publicar novamente o GTM

---

### Problema: "Variável está vazia no Preview Mode"

**Possíveis causas:**
1. Nome da variável está errado
2. Data Layer Variable Name está errado
3. Valor não está vindo do DataLayer

**Soluções:**
1. Verificar se o nome é exatamente `predicted_ltv` (sem espaços, minúsculas)
2. Verificar se Data Layer Variable Name é `predicted_ltv`
3. Adicionar Default Value: `150` como fallback
4. Verificar se o código está enviando `predicted_ltv: 150.0` no DataLayer

---

### Problema: "Tag não está acionando"

**Possíveis causas:**
1. Trigger não está configurado
2. Tag não está ativa
3. Evento não está sendo disparado

**Soluções:**
1. Verificar se o trigger `ce - purchase` existe e está ativo
2. Verificar se a tag está ativa
3. Verificar se o evento "purchase" está sendo disparado

---

## 📊 Verificação Rápida (5 minutos)

### Checklist Rápido:

1. [ ] Variável `predicted_ltv` existe no GTM
2. [ ] Tag "FB - Purchase" tem `predicted_ltv` no Custom Data
3. [ ] GTM foi publicado
4. [ ] Teste no Events Manager mostra `predicted_ltv: 150`

**Se todos os itens estiverem ✅, está funcionando!**

---

## 🎯 Próximos Passos (Após Verificação)

1. ✅ Confirmar que `predicted_ltv` está sendo enviado
2. ✅ Monitorar campanhas por 7-14 dias
3. ✅ Verificar ROAS e Value per Conversion
4. ✅ Ajustar valor se necessário (baseado em dados reais)

---

## 📝 Resumo

**O que verificar:**
- ✅ Variável criada: `predicted_ltv`
- ✅ Tag configurada: `predicted_ltv: {{predicted_ltv}}`
- ✅ GTM publicado
- ✅ Teste funcionando: `predicted_ltv: 150` aparece no Events Manager

**Se tudo estiver ✅, está pronto para usar!**

---

**Última atualização:** 2025-01-08

