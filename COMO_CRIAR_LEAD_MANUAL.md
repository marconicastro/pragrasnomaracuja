# 🛠️ Como Criar Lead Manualmente (Você Mesmo)

## 📋 Método 1: Via Console do Navegador (Mais Fácil)

### **Passo 1: Abrir Console**
1. Acesse: `https://maracujazeropragas.com`
2. Pressione `F12` (ou `Ctrl+Shift+I`)
3. Vá na aba **Console**

### **Passo 2: Copiar e Colar Este Código**

```javascript
// Gerar fbc válido (< 24h)
const now = Math.floor(Date.now() / 1000);
const randomFbclid = Math.random().toString(36).substring(2, 15);
const fbc = `fb.1.${now}.${randomFbclid}`;

// Gerar fbp válido
const fbp = `fb.1.${Date.now()}.123456789`;

// Dados do Lead
const leadData = {
  email: 'teste.webhook.fbc@maracujazeropragas.com',
  phone: '77998877666',
  firstName: 'Teste',
  lastName: 'Webhook FBC',
  city: 'Salvador',
  state: 'BA',
  zip: '40000',
  fbp: fbp,
  fbc: fbc
};

// Chamar API para salvar
fetch('/api/save-tracking', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: leadData.email,
    fbp: leadData.fbp,
    fbc: leadData.fbc,
    firstName: leadData.firstName,
    lastName: leadData.lastName,
    phone: leadData.phone,
    city: leadData.city,
    state: leadData.state,
    zip: leadData.zip,
    firstTouchSource: 'facebook',
    firstTouchMedium: 'cpc',
    lastTouchSource: 'facebook',
    lastTouchMedium: 'cpc',
    touchpointCount: 1,
    hasPaidClick: true,
    client_user_agent: navigator.userAgent
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Lead criado:', {
    email: leadData.email,
    fbc: leadData.fbc,
    fbcValido: true
  });
})
.catch(e => console.error('❌ Erro:', e));
```

### **Passo 3: Executar**
1. Cole o código no Console
2. Pressione `Enter`
3. Deve aparecer: `✅ Lead criado:`

---

## 📋 Método 2: Via ReqBin (Direto na API)

### **URL:**
```
https://maracujazeropragas.com/api/save-tracking
```

### **Método:**
```
POST
```

### **Headers:**
```
Content-Type: application/json
```

### **Body (JSON):**
```json
{
  "email": "teste.webhook.fbc@maracujazeropragas.com",
  "phone": "77998877666",
  "firstName": "Teste",
  "lastName": "Webhook FBC",
  "city": "Salvador",
  "state": "BA",
  "zip": "40000",
  "fbp": "fb.1.1737110400000.123456789",
  "fbc": "fb.1.1737110400.abc123def456",
  "firstTouchSource": "facebook",
  "firstTouchMedium": "cpc",
  "lastTouchSource": "facebook",
  "lastTouchMedium": "cpc",
  "touchpointCount": 1,
  "hasPaidClick": true
}
```

**Nota:** Substitua `1737110400` por timestamp atual (em segundos):
```javascript
Math.floor(Date.now() / 1000)
```

---

## 📋 Método 3: Via Formulário Real (Mais Realista)

### **Passo 1: Gerar fbc no Navegador**

No Console do navegador, execute:
```javascript
// Simular clique em anúncio do Facebook (gera fbc real)
document.cookie = '_fbc=fb.1.' + Math.floor(Date.now() / 1000) + '.' + Math.random().toString(36).substring(2, 15) + '; path=/; max-age=7776000';
document.cookie = '_fbp=fb.1.' + Date.now() + '.123456789; path=/; max-age=7776000';

console.log('✅ Cookies _fbc e _fbp criados');
```

### **Passo 2: Preencher Formulário Normal**

1. Preencha o formulário no site com:
   - Email: `teste.webhook.fbc@maracujazeropragas.com`
   - Telefone: `77998877666`
   - Nome: `Teste Webhook FBC`
2. Clique em **ENVIAR**

Isso vai disparar o Lead automaticamente e salvar fbc/fbp!

---

## ✅ Como Verificar se Funcionou

### **No Console:**
```javascript
// Verificar se Lead foi salvo
fetch('/api/get-recent-purchase?email=teste.webhook.fbc@maracujazeropragas.com')
  .then(r => r.json())
  .then(data => {
    console.log('📊 Lead encontrado:', {
      hasFbc: !!data.userData?.fbc,
      fbc: data.userData?.fbc,
      createdAt: data.userData?.createdAt
    });
  });
```

**Resultado esperado:**
```json
{
  "success": true,
  "userData": {
    "email": "teste.webhook.fbc@maracujazeropragas.com",
    "fbc": "fb.1.1737110400.abc123",
    "fbp": "fb.1.1737110400000.123456789",
    "hasFbc": true,
    "fbcValid": true
  }
}
```

---

## 🎯 Qual Método Usar?

- **Método 1 (Console)**: ✅ Mais rápido, tudo em um código
- **Método 2 (ReqBin)**: ✅ Se prefere interface visual
- **Método 3 (Formulário)**: ✅ Mais realista, simula usuário real

---

## ⚠️ Importante: fbc Válido

O `fbc` precisa ter formato válido:
```
fb.1.{timestamp_segundos}.{fbclid}
```

Exemplo válido:
```
fb.1.1737110400.abc123def456
```

**Timestamp deve ser:**
- Em **segundos** (não milissegundos)
- Dentro das últimas **24 horas**
- Não pode ser futuro

---

## 🚀 Depois de Criar o Lead

1. Use os dados no ReqBin para testar webhook:
   - Email: `teste.webhook.fbc@maracujazeropragas.com`
   - Phone: `77998877666`

2. O webhook vai:
   - ✅ Buscar Lead por email
   - ✅ Encontrar fbc válido
   - ✅ Enviar Purchase com DQS 92+!

---

**Pronto! Agora você cria Lead manualmente!** 🎉

