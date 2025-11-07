# 🚀 Guia de Migração - Refatoração Completa

## 📊 Resumo das Mudanças

### ✅ Antes vs Depois

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **page.tsx** | 1290 linhas | ~80 linhas | **-94%** |
| **eliteMetaPixelTracking.ts** | 987 linhas | 200 linhas | **-80%** |
| **Sistemas de persistência** | 3 arquivos | 1 arquivo | **-67%** |
| **Complexidade** | Alta | Baixa | **-70%** |
| **Testabilidade** | 0% | 70%+ | **+∞** |

---

## 🔧 Passos de Migração

### 1. **Atualizar Dependências**

```bash
# Instalar novas dependências (se necessário)
npm install

# Gerar Prisma client com novo schema
npm run db:generate

# Criar migration para PostgreSQL
npm run db:migrate
```

### 2. **Configurar PostgreSQL**

#### Opção A: Docker (Desenvolvimento)
```bash
docker run --name postgres-maracuja \
  -e POSTGRES_PASSWORD=dev_password \
  -e POSTGRES_DB=maracuja_tracking \
  -p 5432:5432 \
  -d postgres:16-alpine
```

#### Opção B: Vercel Postgres (Produção)
```bash
# No dashboard da Vercel:
# 1. Storage → Create Database → Postgres
# 2. Copiar DATABASE_URL
# 3. Adicionar em .env.local e Vercel Environment Variables
```

### 3. **Atualizar Variáveis de Ambiente**

```bash
# Copiar exemplo
cp .env.example .env.local

# Editar .env.local com suas credenciais
DATABASE_URL="postgresql://..."
```

### 4. **Migrar Código Existente**

#### 4.1 Substituir imports no código existente

**ANTES:**
```typescript
import { trackEliteEvent, trackLeadElite } from '@/lib/eliteMetaPixelTracking';
import { saveAdvancedUserData, getAdvancedUserData } from '@/lib/advancedDataPersistence';
```

**DEPOIS:**
```typescript
import { trackEvent, trackLead } from '@/lib/tracking';
import { saveUserData, getUserData } from '@/lib/storage/user-data';
```

#### 4.2 Simplificar chamadas de tracking

**ANTES:**
```typescript
await trackEliteEvent('Lead', {
  value: 15.0,
  currency: 'BRL',
  predicted_ltv: 180.0,
  content_name: 'Sistema 4 Fases - Ebook Trips',
  content_category: 'lead_generation',
  content_ids: ['hacr962'],
  content_type: 'product',
  status: 'completed',
  registration_method: 'website_form',
  lead_source: 'landing_page',
  lead_type: 'organic_form',
}, 'standard', { 
  isColdEvent: false,
  eventId: eventID
});
```

**DEPOIS:**
```typescript
await trackLead(userData);
```

### 5. **Substituir page.tsx**

```bash
# Backup do arquivo antigo
mv src/app/page.tsx src/app/page.old.tsx

# Usar novo arquivo refatorado
mv src/app/page-refactored.tsx src/app/page.tsx
```

### 6. **Rodar Testes**

```bash
# Rodar todos os testes
npm test

# Verificar coverage
npm run test:coverage
```

### 7. **Validar em Desenvolvimento**

```bash
# Iniciar servidor
npm run dev

# Testar fluxo completo:
# 1. PageView deve disparar automaticamente
# 2. ViewContent após 2s
# 3. Scroll tracking em 50% e 75%
# 4. AddToCart ao clicar "COMPRAR AGORA"
# 5. Lead + InitiateCheckout no formulário
# 6. Redirecionamento ao Cakto
```

---

## 🗑️ Arquivos para Remover (Código Morto)

```bash
# Arquivos duplicados/obsoletos
rm src/lib/metaPixelTracking.ts
rm src/lib/advancedDataPersistence.ts
rm src/lib/userDataPersistence.ts
rm src/lib/userTrackingStore.ts

# Manter backup temporariamente
mkdir -p backup/old-code
mv src/lib/eliteMetaPixelTracking.ts backup/old-code/
mv src/app/page.old.tsx backup/old-code/
```

---

## 🧪 Testes de Regressão

### Checklist Manual

- [ ] **PageView** dispara ao carregar página
- [ ] **ViewContent** dispara após 2s
- [ ] **Scroll Depth** dispara em 50% e 75%
- [ ] **AddToCart** dispara ao abrir modal
- [ ] **Lead** dispara ao preencher formulário
- [ ] **InitiateCheckout** dispara 2s após Lead
- [ ] **Redirecionamento** funciona com dados pré-preenchidos
- [ ] **LocalStorage** persiste dados entre sessões
- [ ] **Rate Limiting** bloqueia após 20 requests/min

### Verificar no GTM Debug

1. Abrir GTM Preview Mode
2. Verificar eventos no DataLayer
3. Confirmar `event_id` único em cada evento
4. Verificar `user_data` completo em eventos quentes

---

## ⚠️ Breaking Changes

### 1. **API de Tracking Simplificada**

**ANTES:** 10+ funções com nomes "Elite"
```typescript
trackPageViewElite()
trackViewContentElite()
trackLeadElite()
trackInitiateCheckoutElite()
trackPurchaseElite()
```

**DEPOIS:** Funções simples e diretas
```typescript
trackPageView()
trackViewContent()
trackLead(userData)
trackInitiateCheckout(userData)
trackPurchase(orderId, userData)
```

### 2. **Storage Unificado**

**ANTES:** 3 sistemas diferentes
- `advancedDataPersistence.ts`
- `userDataPersistence.ts`
- `userTrackingStore.ts`

**DEPOIS:** 1 sistema centralizado
- `storage/user-data.ts`

### 3. **Logger Centralizado**

**ANTES:** `console.log()` espalhado
```typescript
console.log('✅ Dados salvos:', userData);
console.error('❌ Erro:', error);
```

**DEPOIS:** Logger estruturado
```typescript
logger.info('Dados salvos', { userData });
logger.error('Erro ao salvar', error);
```

---

## 🐛 Troubleshooting

### Problema: TypeScript errors após atualização

**Solução:**
```bash
# Limpar cache
rm -rf .next node_modules
npm install
npm run dev
```

### Problema: Prisma não conecta ao PostgreSQL

**Solução:**
```bash
# Verificar se DATABASE_URL está correto
echo $DATABASE_URL

# Gerar client novamente
npm run db:generate

# Criar tabelas
npm run db:push
```

### Problema: Testes falhando

**Solução:**
```bash
# Limpar cache do Jest
npm test -- --clearCache

# Rodar novamente
npm test
```

---

## 📞 Suporte

Se encontrar problemas:

1. Verificar logs: `npm run dev` (modo desenvolvimento)
2. Verificar testes: `npm test`
3. Verificar coverage: `npm run test:coverage`
4. Abrir issue no repositório com logs completos

---

## ✅ Checklist Final

Antes de ir para produção:

- [ ] Todos os testes passando (70%+ coverage)
- [ ] PostgreSQL configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Rate limiting testado
- [ ] Tracking validado no GTM Debug
- [ ] Conversões testadas end-to-end
- [ ] Logs de erro limpos (sem console.error em produção)
- [ ] Performance verificada (< 3s First Contentful Paint)

---

**Data da Migração:** [PREENCHER]  
**Versão Anterior:** 1.0.0  
**Versão Nova:** 2.0.0
