# 🔍 ANÁLISE: Deduplicação de Eventos no Facebook

## 🎯 **SITUAÇÃO ATUAL**

Os eventos do servidor estão sendo **desduplicados** pelo Facebook:

- ✅ **Navegador:** 2 eventos processados
- ❌ **Servidor:** 1 evento desduplicado (mesmo `event_id`)

**Exemplo:**
```
InitiateCheckout:
- Navegador: 1762265997000_17624410479919 (Processado)
- Navegador: 1762265997000_17624410479919 (Processado) ← DUPLICADO!
- Servidor: 1762265997000_17624410479919 (Desduplicado) ← CORRETO!
```

---

## ✅ **ISSO É CORRETO E ESPERADO!**

A deduplicação é o **comportamento desejado**:

1. ✅ **Browser envia primeiro** → Processado
2. ✅ **Server envia depois** → Desduplicado (mesmo `event_id`)
3. ✅ **Facebook conta apenas 1 evento** → Evita duplicação

**Isso é BOM!** Significa que a deduplicação está funcionando corretamente.

---

## ⚠️ **PROBLEMA REAL: 2 Eventos do Navegador**

O problema **NÃO é** a deduplicação do servidor.

O problema é que há **2 eventos do navegador** com o mesmo `event_id`:

```
InitiateCheckout:
- Navegador: 1762265997000_17624410479919 (Processado) ← 1º
- Navegador: 1762265997000_17624410479919 (Processado) ← 2º (DUPLICADO!)
```

**Isso pode ser causado por:**

### **1. Evento sendo disparado duas vezes no código**

Verificar se `trackInitiateCheckoutElite()` está sendo chamado duas vezes.

### **2. Dois Meta Pixels configurados**

Verificar se há dois pixels Meta na página (pode causar duplicação).

### **3. Stape.io enviando duas vezes**

Verificar se o Stape.io está interceptando e enviando o evento duas vezes.

---

## 🔍 **VERIFICAÇÃO NECESSÁRIA**

### **1. Verificar se há duplicação no código:**

```typescript
// Verificar se trackInitiateCheckoutElite() está sendo chamado duas vezes
// Verificar se há múltiplos event listeners
// Verificar se há múltiplos componentes disparando o evento
```

### **2. Verificar Meta Pixel:**

```javascript
// No console do navegador:
console.log(window.fbq);
// Verificar se há apenas uma instância do pixel
```

### **3. Verificar Stape.io:**

- Verificar configuração do Stape.io
- Verificar se há múltiplos `server_event_uri` configurados

---

## ✅ **SOLUÇÃO: Prevenir Duplicação no Navegador**

### **Opção 1: Adicionar debounce/throttle**

```typescript
let lastEventId: string | null = null;
let lastEventTime: number = 0;

export async function trackInitiateCheckoutElite(...) {
  const eventID = generateEventId('InitiateCheckout');
  
  // ✅ Prevenir duplicação: não disparar se mesmo event_id em < 1 segundo
  const now = Date.now();
  if (lastEventId === eventID && (now - lastEventTime) < 1000) {
    console.warn('⚠️ Evento duplicado ignorado:', eventID);
    return;
  }
  
  lastEventId = eventID;
  lastEventTime = now;
  
  // ... resto do código
}
```

### **Opção 2: Verificar se evento já foi disparado**

```typescript
const dispatchedEvents = new Set<string>();

export async function trackInitiateCheckoutElite(...) {
  const eventID = generateEventId('InitiateCheckout');
  
  // ✅ Prevenir duplicação: não disparar se já foi disparado
  if (dispatchedEvents.has(eventID)) {
    console.warn('⚠️ Evento já foi disparado:', eventID);
    return;
  }
  
  dispatchedEvents.add(eventID);
  
  // ... resto do código
}
```

---

## 📊 **RESUMO**

### **✅ O que está CORRETO:**
- Deduplicação do servidor (esperado e desejado)
- `event_id` sendo compartilhado entre browser e server

### **❌ O que está ERRADO:**
- 2 eventos do navegador com o mesmo `event_id`
- Possível duplicação no código ou configuração

### **🎯 AÇÃO:**
1. Investigar por que há 2 eventos do navegador
2. Implementar prevenção de duplicação
3. Verificar configuração do Meta Pixel e Stape.io

---

**Status:** 🔍 **AGUARDANDO INVESTIGAÇÃO DA DUPLICAÇÃO NO NAVEGADOR**

