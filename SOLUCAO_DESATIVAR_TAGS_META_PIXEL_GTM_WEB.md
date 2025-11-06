# ✅ SOLUÇÃO: Desativar Tags Meta Pixel no GTM Web

**Problema:** Tags do Meta Pixel no GTM Web estão enviando eventos ANTES do servidor, causando desduplicação.

**Solução:** Desativar todas as tags do Meta Pixel no GTM Web, deixando apenas o servidor enviar.

---

## 🔍 PROBLEMA IDENTIFICADO

### **Tags do Meta Pixel no GTM Web:**
- ✅ `FB - PageView` → Trigger: `dom - page_view` (DOM_READY)
- ✅ `FB - ViewContent` → Trigger: `ce - view_item` (CUSTOM_EVENT)
- ✅ `FB - AddToCart` → Trigger: `ce - add_to_cart` (CUSTOM_EVENT)
- ✅ `FB - InitiateCheckout` → Trigger: `ce - begin_checkout` (CUSTOM_EVENT)
- ✅ `FB - Lead` → Trigger: `ce - generate_lead` (CUSTOM_EVENT)
- ✅ `FB - Purchase` → Trigger: `ce - purchase` (CUSTOM_EVENT)

### **O que está acontecendo:**
```
1. Código → DataLayer.push({ event: 'view_item' })
2. GTM Web detecta → Dispara FB - ViewContent IMEDIATAMENTE
3. FB - ViewContent → Meta Pixel → Chega PRIMEIRO → Processado ✅
4. Data Tag → GTM Server-Side → Chega DEPOIS → Desduplicado ❌
5. GTM Server-Side → Meta → Chega DEPOIS → Desduplicado ❌
```

**Resultado:** Todos os eventos (browser e server) são desduplicados porque a tag do Meta Pixel chega primeiro!

---

## ✅ SOLUÇÃO: DESATIVAR TAGS META PIXEL

### **Passo 1: Desativar Tags no GTM Web**

**No GTM Web Container (`GTM-WCDP2ZLH`):**

1. **Abrir cada tag do Meta Pixel:**
   - `FB - PageView`
   - `FB - ViewContent`
   - `FB - AddToCart`
   - `FB - InitiateCheckout`
   - `FB - Lead`
   - `FB - Purchase`

2. **Para cada tag:**
   - Clicar no botão **"Desativar"** (ou remover o trigger)
   - OU remover a tag completamente

3. **Salvar e publicar**

---

## 🎯 RESULTADO ESPERADO

### **Após desativar:**
```
1. Código → DataLayer.push({ event: 'view_item' })
2. Data Tag → GTM Server-Side → Chega PRIMEIRO → Processado ✅
3. (Sem tag Meta Pixel no GTM Web)
```

**Resultado:** Apenas eventos do servidor são enviados, sem duplicação!

---

## ⚠️ IMPORTANTE

### **Por que desativar?**
- ✅ GTM Server-Side já envia todos os eventos
- ✅ Servidor tem mais dados (IP, User-Agent, etc.)
- ✅ Servidor é mais confiável (não bloqueado por ad blockers)
- ✅ Evita duplicação desnecessária

### **O que manter?**
- ✅ Data Tags (enviam para GTM Server-Side)
- ✅ GTM Server-Side (envia para Meta)
- ✅ Tags do Meta Pixel no GTM Server-Side (já configuradas)

### **O que remover?**
- ❌ Tags do Meta Pixel no GTM Web (causam duplicação)

---

## 📋 CHECKLIST

### **GTM Web:**
- [ ] Desativar `FB - PageView`
- [ ] Desativar `FB - ViewContent`
- [ ] Desativar `FB - AddToCart`
- [ ] Desativar `FB - InitiateCheckout`
- [ ] Desativar `FB - Lead`
- [ ] Desativar `FB - Purchase`
- [ ] Manter Data Tags ativas
- [ ] Publicar container

### **GTM Server-Side:**
- [ ] Verificar se tags do Meta Pixel estão ativas
- [ ] Verificar se `event_id` está configurado
- [ ] Verificar se variáveis estão mapeadas corretamente

---

## ✅ CONCLUSÃO

**Problema:**
- ❌ Tags do Meta Pixel no GTM Web enviam antes do servidor
- ❌ Todos os eventos são desduplicados

**Solução:**
- ✅ Desativar tags do Meta Pixel no GTM Web
- ✅ Deixar apenas GTM Server-Side enviar eventos
- ✅ Garantir que servidor chegue primeiro (mais rico)

**Resultado:**
- ✅ Apenas eventos do servidor são enviados
- ✅ Sem duplicação
- ✅ Dados mais ricos (IP, User-Agent, etc.)

