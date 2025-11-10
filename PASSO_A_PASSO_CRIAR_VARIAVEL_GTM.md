# 📝 Passo a Passo: Criar Variável `{{ed - predicted_ltv}}` no GTM Server-Side

## 🎯 Objetivo

Criar a variável `{{ed - predicted_ltv}}` no GTM Server-Side para usar na tag "FB - Purchase" e enviar o `predicted_ltv: 150.0` para o Meta CAPI.

---

## 📋 Passo a Passo Completo

### Passo 1: Acessar o GTM Server-Side

1. Acesse: **https://tagmanager.google.com**
2. Faça login com sua conta Google
3. Selecione o container: **GTM-W4PGS3LR** (Server-Side)
   - Se não aparecer, procure por "[SERVER-Ebook Trips]"

---

### Passo 2: Ir para Variáveis

1. No menu lateral esquerdo, clique em **"Variables"** (Variáveis)
2. Você verá uma lista de variáveis existentes

---

### Passo 3: Criar Nova Variável

1. Clique no botão **"New"** (Nova) ou **"+"** (no canto superior direito)
2. Uma nova janela/tela será aberta

---

### Passo 4: Configurar a Variável

#### 4.1. Escolher Tipo de Variável

1. Em **"Variable Type"** (Tipo de Variável), selecione:
   - **"Event Data"** ou **"Data Layer Variable"**
   - (Depende da versão do GTM, mas geralmente é "Event Data")

#### 4.2. Preencher Nome da Variável

1. Em **"Variable Name"** (Nome da Variável), digite:
   ```
   predicted_ltv
   ```
   - Sem espaços, sem caracteres especiais
   - Minúsculas (padrão do GTM)

#### 4.3. Preencher Data Layer Variable Name

1. Em **"Data Layer Variable Name"** (Nome da Variável do DataLayer), digite:
   ```
   predicted_ltv
   ```
   - Deve ser exatamente igual ao campo que vem no DataLayer
   - No seu caso, o código já envia `predicted_ltv: 150.0`

#### 4.4. Valor Padrão (Opcional)

1. Em **"Default Value"** (Valor Padrão), você pode deixar vazio
2. **OU** coloque `150` como fallback (caso o valor não venha do DataLayer)
   - Isso garante que sempre terá um valor

#### 4.5. Versão do Data Layer (Opcional)

1. Geralmente pode deixar em branco (usa a versão padrão)
2. Se tiver opção, deixe como está

---

### Passo 5: Salvar a Variável

1. Clique no botão **"Save"** (Salvar)
2. A variável será criada e aparecerá na lista

---

### Passo 6: Verificar a Variável

1. Na lista de variáveis, procure por **"predicted_ltv"**
2. Verifique se está configurada corretamente:
   - Tipo: Event Data
   - Nome: predicted_ltv
   - Data Layer Variable Name: predicted_ltv

---

### Passo 7: Usar a Variável na Tag "FB - Purchase"

1. Vá em **"Tags"** (Tags) no menu lateral
2. Encontre a tag: **"FB - Purchase"**
3. Clique para editar

#### 7.1. Adicionar no Custom Data

1. Procure por **"Custom Data"** ou **"Custom Data List"**
2. Clique em **"Add"** ou **"+"** para adicionar um novo campo
3. Preencha:
   - **Name:** `predicted_ltv`
   - **Value:** `{{predicted_ltv}}` ou `{{ed - predicted_ltv}}`
     - (Depende da versão do GTM, mas geralmente é `{{predicted_ltv}}`)

#### 7.2. Salvar a Tag

1. Clique em **"Save"** (Salvar)
2. A tag será atualizada

---

### Passo 8: Publicar as Alterações

1. No canto superior direito, clique em **"Submit"** (Enviar) ou **"Publish"** (Publicar)
2. Uma janela será aberta para adicionar uma descrição
3. Digite algo como: "Adicionar variável predicted_ltv e configurar na tag FB - Purchase"
4. Clique em **"Publish"** (Publicar)
5. As alterações serão publicadas e estarão ativas

---

## 🎯 Resumo Visual

```
GTM Server-Side
├── Variables (Variáveis)
│   └── predicted_ltv (Nova variável)
│       ├── Type: Event Data
│       ├── Variable Name: predicted_ltv
│       └── Data Layer Variable Name: predicted_ltv
│
└── Tags (Tags)
    └── FB - Purchase
        └── Custom Data List
            └── predicted_ltv: {{predicted_ltv}}
```

---

## ✅ Checklist

- [ ] Acessar GTM Server-Side (GTM-W4PGS3LR)
- [ ] Ir em "Variables"
- [ ] Criar nova variável "predicted_ltv"
- [ ] Tipo: "Event Data"
- [ ] Data Layer Variable Name: "predicted_ltv"
- [ ] Salvar variável
- [ ] Editar tag "FB - Purchase"
- [ ] Adicionar "predicted_ltv" no Custom Data List
- [ ] Value: "{{predicted_ltv}}"
- [ ] Salvar tag
- [ ] Publicar alterações

---

## 🔍 Como Verificar se Funcionou

### Opção 1: Test Events (Events Manager)

1. Vá em **Events Manager** → Seu Pixel → **"Test Events"**
2. Use o **Test Event Code** (se tiver no `.env`)
3. Dispare um Purchase (via site ou webhook)
4. Verifique se aparece:
   - `predicted_ltv: 150` no `custom_data`

### Opção 2: Preview Mode (GTM)

1. No GTM Server-Side, ative o **Preview Mode**
2. Dispare um Purchase
3. Verifique se a variável `{{predicted_ltv}}` está sendo preenchida com `150`

### Opção 3: Logs do GTM Server-Side

1. Verifique os logs do GTM Server-Side (se tiver acesso)
2. Procure por `predicted_ltv` nos eventos enviados

---

## ⚠️ Problemas Comuns

### "A variável não aparece na lista"

**Solução:**
- Verifique se salvou a variável corretamente
- Recarregue a página
- Verifique se está no container correto (GTM-W4PGS3LR)

### "O valor não está sendo preenchido"

**Solução:**
- Verifique se o código está enviando `predicted_ltv: 150.0` no DataLayer
- Verifique se o nome da variável está correto: `predicted_ltv`
- Use valor padrão `150` como fallback

### "Não encontro 'Custom Data List' na tag"

**Solução:**
- Pode estar em **"Custom Parameters"** ou **"Additional Parameters"**
- Procure por campos que aceitam valores customizados
- Depende da versão/configuração da tag

---

## 📚 Alternativa: Valor Fixo (Mais Simples)

Se não quiser criar a variável, pode usar valor fixo:

1. Edite a tag **"FB - Purchase"**
2. Em **"Custom Data List"**, adicione:
   - **Name:** `predicted_ltv`
   - **Value:** `150` (valor fixo)
3. Salve e publique

**Vantagem:** Mais simples, não precisa criar variável  
**Desvantagem:** Se mudar o valor no código, precisa atualizar no GTM também

---

## 🎯 Próximos Passos

Após criar a variável e configurar na tag:

1. ✅ Publicar alterações no GTM
2. ✅ Testar no Events Manager (Test Events)
3. ✅ Verificar se `predicted_ltv: 150` aparece no `custom_data`
4. ✅ Monitorar campanhas por 7-14 dias
5. ✅ Acompanhar ROAS e Value per Conversion

---

**Última atualização:** 2025-01-08

