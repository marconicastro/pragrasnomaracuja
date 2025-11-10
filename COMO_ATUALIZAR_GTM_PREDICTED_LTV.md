# 🔧 Como Atualizar predicted_ltv no GTM Server-Side

## 🎯 Precisa Alterar?

**Depende de como você configurou:**

### ✅ Se usou VARIÁVEL `{{ed - predicted_ltv}}`:
- **NÃO precisa alterar nada!** ✅
- A variável vai pegar automaticamente o valor `90` do código
- Já está funcionando!

### ❌ Se usou VALOR FIXO `150`:
- **SIM, precisa alterar!** ⚠️
- Precisa mudar de `150` para `90`

---

## 🔍 Como Verificar Qual Você Usou

### Passo 1: Acessar GTM Server-Side

1. Acesse: **https://tagmanager.google.com**
2. Selecione o container: **GTM-W4PGS3LR** (Server-Side)

### Passo 2: Verificar a Tag "FB - Purchase"

1. Vá em **"Tags"** (Tags)
2. Encontre a tag: **"FB - Purchase"**
3. Clique para **editar**

### Passo 3: Verificar Custom Data

1. Procure por **"Custom Data"** ou **"Custom Data List"**
2. Procure pelo campo: **`predicted_ltv`**
3. Veja o **Value** (valor):

**Se o Value for:**
- `{{ed - predicted_ltv}}` ou `{{predicted_ltv}}` → **NÃO precisa alterar** ✅
- `150` (número fixo) → **PRECISA alterar para `90`** ⚠️

---

## 📝 Como Alterar (Se Precisar)

### Opção 1: Usar Variável (Recomendado)

**Se está usando valor fixo `150`, mude para variável:**

1. **GTM Server-Side** → **Tags** → **"FB - Purchase"** → **Editar**
2. Vá em **"Custom Data"** ou **"Custom Data List"**
3. Encontre o campo: **`predicted_ltv`**
4. Clique para editar
5. Em **"Value"**, altere de `150` para: `{{ed - predicted_ltv}}`
6. **Salvar**

**Vantagem:** Vai pegar automaticamente do código (não precisa alterar mais no GTM)

---

### Opção 2: Atualizar Valor Fixo

**Se preferir manter valor fixo:**

1. **GTM Server-Side** → **Tags** → **"FB - Purchase"** → **Editar**
2. Vá em **"Custom Data"** ou **"Custom Data List"**
3. Encontre o campo: **`predicted_ltv`**
4. Clique para editar
5. Em **"Value"**, altere de `150` para: `90`
6. **Salvar**

**Desvantagem:** Se mudar o valor no código, precisa atualizar no GTM também

---

## ✅ Passo a Passo Visual

```
GTM Server-Side
├── Tags
│   └── FB - Purchase
│       └── Custom Data List
│           └── predicted_ltv
│               └── Value: {{ed - predicted_ltv}}  ← ALTERAR AQUI
│                   OU
│                   Value: 90  ← ALTERAR AQUI (se usar fixo)
```

---

## 🎯 Recomendação

**Use a variável `{{ed - predicted_ltv}}`:**

1. ✅ Pega automaticamente do código
2. ✅ Não precisa atualizar no GTM quando mudar no código
3. ✅ Mais flexível e fácil de manter

**Como fazer:**
- Se está usando valor fixo `150`, mude para `{{ed - predicted_ltv}}`
- Se já está usando variável, não precisa fazer nada!

---

## 📊 Verificação Rápida

### Checklist:

- [ ] Acessar GTM Server-Side
- [ ] Ir em Tags → "FB - Purchase" → Editar
- [ ] Verificar Custom Data → `predicted_ltv`
- [ ] Se Value = `150` (fixo) → Alterar para `{{ed - predicted_ltv}}` ou `90`
- [ ] Se Value = `{{ed - predicted_ltv}}` → Não precisa alterar ✅
- [ ] Salvar tag
- [ ] Publicar alterações

---

## 🧪 Como Testar Após Alterar

1. **Events Manager** → Seu Pixel → **"Test Events"**
2. Dispare um Purchase (via site ou webhook)
3. Verifique se aparece: `predicted_ltv: 90` no `custom_data`

**Se aparecer `90`, está funcionando!** ✅

---

## ⚠️ Importante

### Se usar variável `{{ed - predicted_ltv}}`:

- Certifique-se de que a **variável `predicted_ltv`** existe no GTM
- Se não existir, crie seguindo o guia: `PASSO_A_PASSO_CRIAR_VARIAVEL_GTM.md`

### Se usar valor fixo `90`:

- Se mudar o valor no código no futuro, lembre-se de atualizar no GTM também
- Menos flexível, mas funciona

---

**Última atualização:** 2025-01-08

