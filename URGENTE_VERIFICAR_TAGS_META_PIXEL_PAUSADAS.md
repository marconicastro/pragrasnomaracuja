# 🚨 URGENTE: Verificar se Tags Meta Pixel estão PAUSADAS

**Data:** 2025-01-06  
**Status:** ⚠️ **VERIFICAR URGENTEMENTE**

---

## 🔍 **PROBLEMA IDENTIFICADO**

O evento do navegador está chegando no Facebook **SEM** os campos críticos:
- ❌ **País** (country)
- ❌ **Identificação externa** (external_id/user_id)
- ❌ **Identificação do clique** (fbc)
- ❌ **Identificação do navegador** (fbp)

**Evento do Navegador (17:40:14):**
```
Parâmetros de correspondência avançada: 
Cidade, Email, Nome, Endereço IP, Sobrenome, Telefone, Estado, Agente do usuário, Código postal

❌ FALTA: País, Identificação externa, Identificação do clique, Identificação do navegador
```

**Evento do Servidor (17:40:15):**
```
Chaves de dados do usuário: 
País ✅, Cidade ✅, Email ✅, Identificação externa ✅, Identificação do clique ✅, 
Identificação do navegador ✅, Nome ✅, Endereço IP ✅, Sobrenome ✅, Telefone ✅, 
Estado ✅, Agente do usuário ✅, Código postal ✅

✅ TEM TUDO!
```

---

## ⚠️ **CAUSA RAIZ**

**As tags do Meta Pixel no GTM Web estão enviando eventos, mas:**
1. ❌ **NÃO têm `fbp` e `fbc` mapeados no Advanced Matching**
2. ❌ **NÃO têm `country` mapeado corretamente**
3. ❌ **NÃO têm `external_id` mapeado corretamente**

**Resultado:**
- Evento do navegador chega PRIMEIRO (17:40:14) → Processado ✅
- Evento do servidor chega DEPOIS (17:40:15) → Desduplicado ❌

---

## ✅ **SOLUÇÃO 1: PAUSAR TAGS (RECOMENDADO)**

### **No GTM Web Container (GTM-WCDP2ZLH):**

1. **Ir para Tags**
2. **Verificar se estas tags estão PAUSADAS:**
   - `FB - PageView`
   - `FB - ViewContent`
   - `FB - AddToCart`
   - `FB - InitiateCheckout` ⚠️ **VERIFICAR ESTA!**
   - `FB - Lead`
   - `FB - Purchase`

3. **Se NÃO estiverem pausadas:**
   - Clicar em cada tag
   - Clicar no botão **"Pausar"** ou **"Desativar"**
   - Salvar e publicar

4. **Resultado esperado:**
   - ✅ Apenas servidor envia eventos
   - ✅ Sem duplicação
   - ✅ Eventos chegam como "Processado"

---

## ✅ **SOLUÇÃO 2: ADICIONAR CAMPOS FALTANTES (SE NÃO PUDER PAUSAR)**

Se por algum motivo não puder pausar as tags, adicione os campos faltantes:

### **No GTM Web → Tag `FB - InitiateCheckout`:**

#### **1. Adicionar `fbp` (Facebook Browser ID):**

**Advanced Matching:**
```
Property Name: fbp
Property Value: {{dlv - user_data.fbp}}
```

**OU criar variável:**
```
Nome: dlv - user_data.fbp
Tipo: Data Layer Variable
Data Layer Variable Name: user_data.fbp
```

#### **2. Adicionar `fbc` (Facebook Click ID):**

**Advanced Matching:**
```
Property Name: fbc
Property Value: {{dlv - user_data.fbc}}
```

**OU criar variável:**
```
Nome: dlv - user_data.fbc
Tipo: Data Layer Variable
Data Layer Variable Name: user_data.fbc
```

#### **3. Verificar `country`:**

**Advanced Matching:**
```
Property Name: cn (country)
Property Value: {{dlv - user_data.country}}
```

**OU criar variável:**
```
Nome: dlv - user_data.country
Tipo: Data Layer Variable
Data Layer Variable Name: user_data.country
```

#### **4. Verificar `external_id`:**

**Advanced Matching:**
```
Property Name: external_id
Property Value: {{dlv - user_data.user_id}}
```

**OU criar variável:**
```
Nome: dlv - user_data.user_id
Tipo: Data Layer Variable
Data Layer Variable Name: user_data.user_id
```

---

## 📋 **CONFIGURAÇÃO COMPLETA DO ADVANCED MATCHING**

### **Tag `FB - InitiateCheckout` deve ter:**

| Property Name | Property Value | Status |
|--------------|----------------|--------|
| `fn` | `{{dlv - user_data.first_name}}` | ✅ Já tem |
| `ln` | `{{dlv - user_data.last_name}}` | ✅ Já tem |
| `em` | `{{dlv - user_data.email_address}}` | ✅ Já tem |
| `ph` | `{{dlv - user_data.phone_number}}` | ✅ Já tem |
| `ct` | `{{dlv - user_data.city}}` | ✅ Já tem |
| `st` | `{{dlv - user_data.region}}` | ✅ Já tem |
| `zp` | `{{dlv - user_data.postal_code}}` | ✅ Já tem |
| `cn` | `{{dlv - user_data.country}}` | ⚠️ **VERIFICAR** |
| `external_id` | `{{dlv - user_data.user_id}}` | ⚠️ **VERIFICAR** |
| `fbp` | `{{dlv - user_data.fbp}}` | ❌ **FALTANDO** |
| `fbc` | `{{dlv - user_data.fbc}}` | ❌ **FALTANDO** |

---

## 🎯 **RECOMENDAÇÃO FINAL**

**OPÇÃO 1 (RECOMENDADA):** Pausar todas as tags `FB - *` no GTM Web
- ✅ Mais simples
- ✅ Evita duplicação
- ✅ Servidor já envia tudo corretamente

**OPÇÃO 2:** Adicionar `fbp`, `fbc`, `country` e `external_id` ao Advanced Matching
- ⚠️ Mais trabalhoso
- ⚠️ Ainda pode haver duplicação (timing)
- ⚠️ Precisa manter sincronizado com servidor

---

## ✅ **VERIFICAÇÃO**

**Após aplicar a solução, verificar no Facebook Events Manager:**

1. **Evento do navegador deve ter:**
   - ✅ País
   - ✅ Identificação externa
   - ✅ Identificação do clique (fbc)
   - ✅ Identificação do navegador (fbp)

2. **OU (se pausar tags):**
   - ✅ Apenas evento do servidor aparece
   - ✅ Status: "Processado" (não "Desduplicado")

---

**Data:** 2025-01-06  
**Prioridade:** 🔴 **ALTA**

