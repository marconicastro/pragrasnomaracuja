# 🧪 Guia: Testar Webhook Purchase no ReqBin

## 📋 Informações para o Teste

### **1. URL do Webhook:**
```
https://maracujazeropragas.com/api/webhook-cakto
```
OU (se estiver rodando localmente):
```
http://localhost:3000/api/webhook-cakto
```

### **2. Método HTTP:**
```
POST
```

### **3. Headers:**
```
Content-Type: application/json
```

---

## 📦 JSON para Teste (ReqBin)

### **IMPORTANTE:**
1. **Substitua `SEU_CAKTO_WEBHOOK_SECRET_AQUI`** pelo valor real da variável `CAKTO_WEBHOOK_SECRET` configurada na Vercel
2. **Substitua `ORDER-TEST-` + Date.now()** por um ID único (ou deixe como está, será gerado automaticamente)

### **JSON Completo:**

```json
{
  "secret": "SEU_CAKTO_WEBHOOK_SECRET_AQUI",
  "event": "purchase_approved",
  "data": {
    "id": "test-purchase-001",
    "refId": "ORDER-TEST-1737110400000",
    "customer": {
      "name": "marconi augusto de castro",
      "birthDate": null,
      "email": "marconi.castro.mc@gmail.com",
      "phone": "77998276042",
      "docNumber": null
    },
    "affiliate": null,
    "offer": {
      "id": "hacr962",
      "name": "Sistema 4 Fases - Ebook Trips",
      "price": 39.9
    },
    "offer_type": "digital",
    "product": {
      "name": "Sistema 4 Fases - Ebook Trips",
      "id": "hacr962",
      "short_id": "hacr962",
      "supportEmail": "suporte@maracujazeropragas.com",
      "type": "digital_product",
      "invoiceDescription": "Sistema 4 Fases - Ebook Trips"
    },
    "parent_order": null,
    "checkoutUrl": null,
    "status": "paid",
    "baseAmount": 39.9,
    "discount": null,
    "amount": 39.9,
    "fees": 0,
    "paymentMethod": "credit_card",
    "paymentMethodName": "Cartão de Crédito",
    "installments": 1,
    "utm_source": null,
    "utm_medium": null,
    "utm_campaign": null,
    "sck": null,
    "fbc": null,
    "fbp": null,
    "paidAt": "2025-01-17T10:00:00.000Z",
    "createdAt": "2025-01-17T09:58:00.000Z"
  }
}
```

---

## 🔧 Como Fazer o Teste no ReqBin

### **Passo 1: Preparar Lead Primeiro**

**IMPORTANTE:** Para capturar fbp/fbc, você precisa:

1. **Abrir o site** no navegador
2. **Preencher o formulário** com:
   - Email: `marconi.castro.mc@gmail.com`
   - Telefone: `77998276042`
   - Nome: `marconi augusto de castro`
3. **Clicar em "ENVIAR"** (isso dispara Lead e salva fbp/fbc no KV)
4. **Aguardar 2-3 segundos** para dados serem salvos

### **Passo 2: Obter Secret do Webhook**

1. Acesse **Vercel Dashboard**
2. Vá em **Settings → Environment Variables**
3. Procure por `CAKTO_WEBHOOK_SECRET`
4. **Copie o valor** (é um UUID)

### **Passo 3: Configurar ReqBin**

1. Acesse: https://reqbin.com/
2. **Method:** Selecione `POST`
3. **URL:** Cole `https://maracujazeropragas.com/api/webhook-cakto`
4. **Headers:**
   - Clique em "Add Header"
   - Key: `Content-Type`
   - Value: `application/json`
5. **Body:**
   - Selecione "JSON"
   - Cole o JSON acima (substituindo o secret)

### **Passo 4: Enviar Request**

1. Clique em **"Send"**
2. Aguarde a resposta

---

## ✅ Respostas Esperadas

### **Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Purchase enviado para Meta com sucesso",
  "processedIn": "250ms"
}
```

### **Erro: Secret Inválido (401):**
```json
{
  "error": "Invalid webhook signature"
}
```
**Solução:** Verifique se o secret está correto

### **Erro: Secret Não Configurado (500):**
```json
{
  "error": "Webhook secret not configured"
}
```
**Solução:** Configure `CAKTO_WEBHOOK_SECRET` na Vercel

### **Erro: Lead Não Encontrado:**
```json
{
  "success": false,
  "message": "Lead não encontrado no KV. Purchase enviado sem fbp/fbc."
}
```
**Solução:** Faça o Lead primeiro (Passo 1)

---

## 🔍 O Que Será Processado

1. **Validação do Secret** ✅
2. **Busca fbp/fbc no KV** usando email/telefone
3. **Envio para Meta CAPI** com:
   - Dados do cliente (email, phone, name)
   - fbp/fbc (se encontrado no Lead)
   - IP address (se disponível)
   - User Agent (se disponível)
   - Valor da compra (39.9 BRL)
   - Order ID único

---

## 📊 Como Verificar se Funcionou

### **1. Logs do Vercel:**
Acesse **Vercel Dashboard → Deployments → Logs** e procure por:
```
📨 Webhook Cakto recebido: { event: 'purchase_approved', ... }
✅ Purchase enviado para Meta com sucesso
```

### **2. Meta Events Manager:**
1. Acesse: https://business.facebook.com/events_manager2
2. Vá em **Test Events** ou **All Events**
3. Procure por evento **Purchase**
4. Verifique se tem:
   - Email: `marconi.castro.mc@gmail.com`
   - Order ID: `ORDER-TEST-...`
   - Valor: `39.9 BRL`
   - fbp/fbc (se Lead foi feito antes)

### **3. CAPIG Dashboard:**
- Purchase deve aparecer nos eventos recebidos

---

## ⚠️ Troubleshooting

### **Problema: "Invalid webhook signature"**
- ✅ Verifique se o secret está correto
- ✅ Certifique-se de copiar o valor completo (UUID)

### **Problema: "Lead não encontrado"**
- ✅ Faça o Lead primeiro no site
- ✅ Use exatamente o mesmo email/telefone
- ✅ Aguarde 2-3 segundos após enviar o Lead

### **Problema: Purchase não aparece no Meta**
- ✅ Verifique logs do Vercel para erros
- ✅ Verifique se `META_ACCESS_TOKEN` está configurado
- ✅ Verifique se Pixel ID está correto (`1403975024017865`)

### **Problema: Timeout no ReqBin**
- ✅ Timeout padrão do webhook é 10 segundos
- ✅ Se demorar muito, verifique logs do Vercel

---

## 📝 Dados do Teste

**Cliente:**
- Nome: `marconi augusto de castro`
- Email: `marconi.castro.mc@gmail.com`
- Telefone: `77998276042`

**Compra:**
- Produto: `Sistema 4 Fases - Ebook Trips`
- Valor: `39.9 BRL`
- Order ID: `ORDER-TEST-1737110400000` (ou gerado automaticamente)
- Status: `paid`

---

## 🎯 Objetivo do Teste

1. ✅ Validar que webhook está funcionando
2. ✅ Validar que fbp/fbc são capturados do Lead
3. ✅ Validar que Purchase é enviado para Meta CAPI
4. ✅ Validar que dados completos estão sendo enviados (email, phone, name, fbp/fbc)

---

## ✅ Checklist

Antes de testar:
- [ ] Secret do webhook copiado
- [ ] Lead feito no site com mesmo email/telefone
- [ ] Aguardado 2-3 segundos após Lead
- [ ] JSON montado corretamente
- [ ] ReqBin configurado (POST, URL, Headers, Body)

Após teste:
- [ ] Resposta 200 OK recebida
- [ ] Logs do Vercel confirmam sucesso
- [ ] Purchase aparece no Meta Events Manager
- [ ] fbp/fbc presentes no evento (se Lead foi feito)

---

**Boa sorte com o teste!** 🚀

