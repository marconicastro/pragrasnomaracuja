# ? Aguardando Documenta??o Cakto

## ? Informa??es Recebidas

```
Checkout URL: https://pay.cakto.com.br/hacr962_605077
Webhook URL: https://maracujazeropragas.com/api/webhook-cakto
Secret Key: 12f4848f-35e9-41a8-8da4-1032642e3e89
```

---

## ?? Prepara??o Conclu?da

### ? Estrutura Base Criada:

```
src/lib/offlineConversions.ts (8KB)
??? validateCaktoWebhook() - valida??o de assinatura
??? getUserDataByEmail() - busca fbp/fbc persistidos
??? hashSHA256() - hash de PII
??? sendOfflinePurchase() - envia via Stape CAPI
??? processCaktoWebhook() - processador principal

.env.local.example
??? CAKTO_WEBHOOK_SECRET
??? NEXT_PUBLIC_CAKTO_CHECKOUT_URL
??? META_ACCESS_TOKEN
```

---

## ?? O Que Precisamos da Documenta??o Cakto

### 1. Estrutura do Payload do Webhook

```typescript
// Precisamos saber:
interface CaktoWebhookPayload {
  event: string;              // Nome do evento? Ex: "purchase.approved"
  transaction_id: string;     // ID da transa??o?
  customer_email: string;     // Email do cliente?
  customer_name: string;      // Nome do cliente?
  customer_phone?: string;    // Telefone?
  amount: number;             // Valor da compra?
  currency: string;           // Moeda? (BRL)
  status: string;             // Status? Ex: "paid", "approved"
  created_at?: string;        // Timestamp?
  
  // Quais outros campos v?m?
  // Como est? estruturado exatamente?
}
```

**Perguntas:**
- Qual o nome exato do evento de compra confirmada?
- Quais campos est?o dispon?veis no payload?
- Como vem o nome do cliente (nome completo ou separado)?
- Tem algum campo de timestamp?

### 2. Valida??o de Assinatura

```typescript
// Como validar que o webhook ? leg?timo?

// Op??o A: HMAC SHA256
const signature = crypto
  .createHmac('sha256', secret)
  .update(JSON.stringify(payload))
  .digest('hex');

// Op??o B: Header espec?fico
const signature = req.headers['x-cakto-signature'];

// Op??o C: Outro m?todo?
```

**Perguntas:**
- Como a Cakto assina os webhooks?
- Qual algoritmo? (HMAC-SHA256, SHA256, outro?)
- Em qual header vem a assinatura?
- O que exatamente ? assinado? (body inteiro, campos espec?ficos?)

### 3. Headers do Webhook

```typescript
// Quais headers a Cakto envia?
{
  'x-cakto-signature'?: string;
  'x-cakto-event'?: string;
  'content-type': 'application/json';
  // outros?
}
```

**Perguntas:**
- Quais headers s?o enviados?
- Tem algum header de identifica??o?
- Tem algum header com timestamp?

### 4. Tipos de Eventos

```typescript
// Quais eventos a Cakto envia?
'purchase.approved'
'purchase.pending'
'purchase.cancelled'
'purchase.refunded'
// outros?
```

**Perguntas:**
- Quais eventos existem?
- Qual evento devemos escutar para compra confirmada?
- Tem eventos de teste?

### 5. Retry e Idempot?ncia

**Perguntas:**
- A Cakto faz retry se nosso webhook falhar?
- Quantas vezes? Com qual delay?
- Como garantir idempot?ncia (n?o processar duplicados)?
- Tem algum campo unique ID?

---

## ?? O Que J? Est? Pronto

### ? Implementado (aguardando apenas docs):

1. **Estrutura base do webhook handler**
   - Rota ser? criada em `/api/webhook-cakto`
   - Valida??o de assinatura (precisa algoritmo)
   - Parser de payload (precisa estrutura)

2. **Sistema de busca de user data**
   - Buscar fbp/fbc por email
   - Precisamos decidir: localStorage ou banco?

3. **Envio via Stape CAPI**
   - Hash SHA-256 de PII ?
   - Payload formatado para Meta ?
   - Envio via Stape container ?

4. **Logging e monitoring**
   - Logs estruturados ?
   - Error handling ?

---

## ?? Pr?ximos Passos (ap?s documenta??o)

### Quando recebermos a documenta??o:

1. **Adaptar estrutura do payload** (5 min)
   ```typescript
   // Exemplo:
   interface CaktoWebhookPayload {
     // campos reais conforme doc
   }
   ```

2. **Implementar valida??o de assinatura** (10 min)
   ```typescript
   export function validateCaktoWebhook(
     payload: any,
     signature: string,
     secret: string
   ): boolean {
     // algoritmo conforme doc
   }
   ```

3. **Criar rota `/api/webhook-cakto`** (15 min)
   ```typescript
   export async function POST(req: Request) {
     // validar assinatura
     // processar webhook
     // enviar Purchase
     // retornar 200
   }
   ```

4. **Implementar persist?ncia de user data** (20 min)
   - Salvar fbp/fbc em banco quando Lead acontece
   - Buscar por email quando webhook chega

5. **Testar com webhook de teste** (10 min)
   - Cakto tem webhook de teste?
   - Validar fluxo completo

6. **Deploy e monitorar** (5 min)

**Total:** ~1 hora ap?s documenta??o ?

---

## ?? Decis?o Importante: Persist?ncia de Dados

### Op??o A: SQLite (Prisma - j? est? no projeto)

```typescript
// prisma/schema.prisma
model UserTracking {
  id        String   @id @default(cuid())
  email     String   @unique
  fbp       String?
  fbc       String?
  firstName String?
  lastName  String?
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Pr?s:**
- ? J? tem Prisma no projeto
- ? F?cil de implementar
- ? Persistente (n?o perde dados)

**Contras:**
- ?? Precisa migration
- ?? Precisa backup

### Op??o B: In-Memory Cache (Redis ou similar)

**Pr?s:**
- ? R?pido
- ? Simples

**Contras:**
- ? Perde dados se reiniciar
- ? Precisa Redis instalado

### Op??o C: File-based (JSON)

**Pr?s:**
- ? Muito simples
- ? N?o precisa nada extra

**Contras:**
- ? N?o escala bem
- ? Performance ruim

**Recomenda??o:** Op??o A (Prisma/SQLite) - j? est? no projeto!

---

## ?? Checklist

### ? Aguardando:

```
? Estrutura do payload do webhook
? Como validar assinatura
? Quais headers s?o enviados
? Tipos de eventos dispon?veis
? Pol?tica de retry
```

### ? Pronto:

```
? Estrutura base do c?digo
? Hash SHA-256 de PII
? Envio via Stape CAPI
? Error handling
? Logging
? .env configuration
```

### ?? Pr?ximo (ap?s docs):

```
?? Adaptar payload
?? Implementar valida??o
?? Criar rota webhook
?? Implementar persist?ncia
?? Testar
?? Deploy
```

---

## ?? Tempo Estimado

```
Documenta??o recebida
    ?
Adaptar c?digo: 30 min
    ?
Implementar persist?ncia: 20 min
    ?
Testar: 10 min
    ?
Deploy: 5 min
    ?
Total: ~1 hora ?
```

---

**Aguardando documenta??o da Cakto para continuar!** ??

Assim que receber, implemento em ~1 hora! ??
