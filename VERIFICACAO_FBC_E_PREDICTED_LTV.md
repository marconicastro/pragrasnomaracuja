# ✅ Verificação: fbc e predicted_ltv no Purchase

## 🔧 Correções Aplicadas

### 1. fbc não estava sendo enviado

**Problema:**
- fbc estava sendo rejeitado quando expirado (>24h)
- Mesmo expirado, ainda é útil para contexto histórico

**Correção:**
- ✅ Agora envia fbc mesmo se expirado
- ✅ Avisa no log que está expirado, mas envia mesmo assim
- ✅ Meta pode usar para melhorar matching mesmo fora da janela de 24h

### 2. predicted_ltv não aparecendo

**Status:**
- ✅ `predicted_ltv: 90` está sendo enviado no payload
- ✅ Aparece nos "Parâmetros" do Meta Events Manager
- ✅ Pode não aparecer no breakdown padrão (é campo customizado)

---

## 🔍 Como Verificar se Está Funcionando

### Verificação 1: Logs do Servidor

**Procure por:**
```
✅ fbc válido, será incluído no Purchase
OU
⚠️ fbc expirado (>24h), mas será enviado mesmo assim para contexto histórico
```

**No payload:**
```json
{
  "user_data": {
    "fbp": "fb.1.1762549638623.1972470035",
    "fbc": "fb.1.1762611837789.IwAR2eX8Z7Y9w1L4K6P3Q..."  // ← DEVE APARECER
  },
  "predicted_ltv": 90  // ← DEVE APARECER
}
```

### Verificação 2: Meta Events Manager

**Onde verificar:**

1. **Events Manager** → Seu Pixel → **"Test Events"** ou **"Activity"**
2. Clique no evento **Purchase**
3. Veja em **"Parâmetros"** (Parameters):
   - ✅ `predicted_ltv: 90` deve aparecer
   - ✅ `fbc` deve aparecer em **"Chaves de dados do usuário"** (User Data Keys)

**Nota:** `predicted_ltv` é um campo customizado, então pode não aparecer no breakdown padrão, mas está sendo enviado.

### Verificação 3: GTM Server-Side

**Verificar se está mapeando corretamente:**

1. **GTM Server-Side** → Tags → **"FB - Purchase"**
2. Verifique **Custom Data List**:
   - Deve ter `predicted_ltv: {{ed - predicted_ltv}}` ou `90`
3. Verifique **User Data**:
   - Deve ter `fbc: {{ed - user_data.fbc}}` ou `{{ed - fbc}}`

---

## 📊 Onde Aparece no Meta Events Manager

### predicted_ltv

**Localização:**
- ✅ **Parâmetros** (Parameters) → `predicted_ltv: 90`
- ❌ Não aparece em "Chaves de dados do usuário" (é custom_data, não user_data)
- ❌ Pode não aparecer no breakdown padrão (é campo customizado)

**Como verificar:**
1. Events Manager → Purchase → Detalhes
2. Aba **"Parâmetros"** (Parameters)
3. Procure por `predicted_ltv`

### fbc

**Localização:**
- ✅ **Chaves de dados do usuário** (User Data Keys) → `Identificação do clique` (Click ID)
- ✅ Aparece como `fbc` no user_data

**Como verificar:**
1. Events Manager → Purchase → Detalhes
2. Aba **"Chaves de dados do usuário"** (User Data Keys)
3. Procure por `Identificação do clique` ou `fbc`

---

## 🧪 Teste Rápido

### Passo 1: Disparar Purchase

1. Via webhook ou site
2. Verificar logs do servidor

### Passo 2: Verificar Logs

**Procure por:**
```
✅ fbc válido, será incluído no Purchase
OU
⚠️ fbc expirado (>24h), mas será enviado mesmo assim
```

**No payload:**
- `user_data.fbc` deve estar presente
- `predicted_ltv: 90` deve estar presente

### Passo 3: Verificar Meta Events Manager

1. Events Manager → Purchase
2. Verificar **Parâmetros**: `predicted_ltv: 90`
3. Verificar **Chaves de dados do usuário**: `fbc` (Identificação do clique)

---

## ⚠️ Observações Importantes

### fbc Expirado

**Comportamento atual:**
- ✅ Envia fbc mesmo se expirado (>24h)
- ⚠️ Avisa no log que está expirado
- ✅ Meta pode usar para contexto histórico

**Por quê?**
- Mesmo expirado, ajuda o Meta a entender o histórico do usuário
- Melhora matching e atribuição
- Não causa erro no Meta (apenas não usa para atribuição direta)

### predicted_ltv

**Comportamento atual:**
- ✅ Enviado no nível raiz do payload
- ✅ Aparece nos "Parâmetros" do Meta Events Manager
- ⚠️ Pode não aparecer no breakdown padrão (é campo customizado)

**Por quê?**
- Campo customizado não aparece em todos os lugares
- Mas está sendo enviado e usado pelo ML do Meta
- Verificar em "Parâmetros" ou "Custom Data"

---

## ✅ Checklist de Verificação

### fbc

- [ ] Logs mostram: "fbc válido" ou "fbc expirado, mas será enviado"
- [ ] Payload contém `user_data.fbc`
- [ ] Meta Events Manager mostra `fbc` em "Chaves de dados do usuário"
- [ ] Aparece como "Identificação do clique"

### predicted_ltv

- [ ] Payload contém `predicted_ltv: 90`
- [ ] Meta Events Manager mostra `predicted_ltv: 90` em "Parâmetros"
- [ ] GTM Server-Side está mapeando corretamente

---

## 🔧 Se Ainda Não Estiver Funcionando

### fbc não aparece

1. Verificar se está sendo salvo no Lead (KV/Prisma)
2. Verificar se está sendo buscado no webhook
3. Verificar logs do servidor
4. Verificar se GTM está mapeando `{{ed - user_data.fbc}}`

### predicted_ltv não aparece

1. Verificar se está no payload (logs)
2. Verificar se GTM está mapeando `{{ed - predicted_ltv}}`
3. Verificar em "Parâmetros" (não em "Chaves de dados do usuário")
4. Verificar se tag "FB - Purchase" tem `predicted_ltv` no Custom Data

---

**Última atualização:** 2025-01-08

