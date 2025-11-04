# ✅ CORREÇÃO: external_id não estava sendo gerado

**Problema identificado:** `external_id` estava como `undefined` porque não estava sendo atribuído em `saveAdvancedUserData`

---

## 🔍 PROBLEMA ENCONTRADO

**No código `saveAdvancedUserData()`:**
- ✅ Gera `sessionId` (linha 334)
- ❌ **NÃO atribui `external_id`** (campo nunca era preenchido!)

**Resultado:**
- `savedData?.external_id` sempre retorna `undefined`
- `user_id` no DataLayer fica `undefined`
- GTM Server-Side não consegue encontrar o valor

---

## ✅ CORREÇÃO APLICADA

**Modificado `saveAdvancedUserData()` para:**

```typescript
// Session (manter existente ou criar novo)
const sessionId = existingData?.sessionId || generateSessionId();

const mergedData: UserDataComplete = {
  // ... outros campos
  
  // Session
  sessionId: sessionId,
  
  // External ID (usar sessionId como external_id - Meta requer)
  // CRÍTICO: external_id deve ser único por sessão/usuário
  external_id: userData.external_id || existingData?.external_id || sessionId,
  
  // ... outros campos
};
```

**Agora:**
- ✅ Se `userData.external_id` for fornecido → usa ele
- ✅ Se não, mas `existingData.external_id` existir → mantém existente
- ✅ Se não, usa `sessionId` como `external_id` (fallback)

---

## 📊 RESULTADO ESPERADO

**Agora o DataLayer terá:**
```javascript
{
  event: 'begin_checkout',
  user_data: {
    user_id: 'sess_1761312196590_bookidhkx',  // ✅ Agora será preenchido!
    email_address: '...',
    // ...
  }
}
```

**GTM Server-Side:**
- `{{ed - user_id}}` ou `{{dlv - user_data.user_id}}` → `'sess_1761312196590_bookidhkx'` ✅

---

## ✅ VERIFICAÇÃO

**Para testar:**
1. Recarregar a página
2. Preencher formulário e enviar (dispara Lead)
3. Verificar no Console: `console.log(window.dataLayer.filter(e => e.user_data))`
4. Verificar se `user_data.user_id` está preenchido

---

## 📝 RESUMO

✅ **Correção aplicada:**
- `external_id` agora é atribuído em `saveAdvancedUserData()`
- Usa `sessionId` como fallback se não houver `external_id` fornecido
- Garante que `user_id` sempre será enviado no DataLayer

✅ **Próximo passo:**
- Testar e verificar se `external_id` aparece no payload do Meta

