# 🔗 URL de Teste com fbclid (Muito Mais Fácil!)

## ✅ Solução Simples

Acesse esta URL no navegador (com fbclid):

```
https://maracujazeropragas.com/?fbclid=IwAR1234567890abcdefghijklmnopqrstuvwxyz1234567890
```

Isso vai:
1. ✅ Gerar cookie `_fbc` automaticamente (via Facebook Pixel)
2. ✅ Gerar cookie `_fbp` automaticamente
3. ✅ Você só precisa preencher o formulário
4. ✅ Lead será salvo com fbc válido!

---

## 🎯 Como Usar

### **Passo 1: Acessar URL com fbclid**

Cole no navegador:
```
https://maracujazeropragas.com/?fbclid=IwAR1234567890abcdefghijklmnopqrstuvwxyz1234567890
```

Ou qualquer URL com `fbclid`:
```
https://maracujazeropragas.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=teste&fbclid=IwAR0abc123def456ghi789
```

### **Passo 2: Preencher Formulário**

1. Email: `teste.webhook.fbc@maracujazeropragas.com`
2. Telefone: `77998877666`
3. Nome: `Teste Webhook FBC`
4. Clicar em **ENVIAR**

### **Passo 3: Pronto!**

✅ Lead criado automaticamente com `fbc` válido!

---

## 🔍 Verificar se Funcionou

No Console do navegador (F12):

```javascript
// Verificar cookies
console.log('fbp:', document.cookie.match(/_fbp=([^;]+)/)?.[1]);
console.log('fbc:', document.cookie.match(/_fbc=([^;]+)/)?.[1]);
```

Deve aparecer algo como:
```
fbp: fb.1.1762195045000.123456789
fbc: fb.1.1762195045.abc123def456
```

---

## ✅ Vantagens

- ✅ **Automático** - Facebook Pixel gera fbc sozinho
- ✅ **Válido** - fbc sempre válido (< 24h)
- ✅ **Simples** - Só acessar URL e preencher formulário
- ✅ **Realista** - Simula usuário real vindo de anúncio do Facebook

---

## 🎯 URLs Prontas

### **URL 1: Simples**
```
https://maracujazeropragas.com/?fbclid=IwAR0test123456789
```

### **URL 2: Com UTMs**
```
https://maracujazeropragas.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=teste&fbclid=IwAR0test123456789
```

### **URL 3: Longa (mais realista)**
```
https://maracujazeropragas.com/?fbclid=IwAR1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890abcdefghijklmnopqrstuvwxyz
```

**Qualquer uma funciona!** O importante é ter `fbclid` na URL.

---

## 🚀 Depois de Criar o Lead

1. Use no ReqBin para testar webhook:
   - Email: `teste.webhook.fbc@maracujazeropragas.com`
   - Phone: `77998877666`

2. O webhook vai encontrar Lead com `fbc` válido! ✅

---

**Muito mais fácil assim!** 🎉

