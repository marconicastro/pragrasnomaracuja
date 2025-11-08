# 🔄 Guia de Migração para PostgreSQL (Produção)

## ⚠️ Por que migrar?

Atualmente, seu projeto usa **SQLite** (`file:./db/custom.db`), que é excelente para desenvolvimento local, mas **NÃO é recomendado para produção** porque:

- ❌ **Não é serverless-friendly** (arquivo local não persiste em Vercel)
- ❌ **Performance limitada** em alta concorrência
- ❌ **Sem backups automáticos**
- ❌ **Sem escalabilidade horizontal**

---

## ✅ Solução: PostgreSQL

### Provedores Gratuitos/Baratos

#### 1. **Vercel Postgres** (Integração perfeita) ⭐
- **Custo:** GRÁTIS até 256MB
- **Setup:** 2 minutos
- **Link:** https://vercel.com/storage/postgres

**Como configurar:**
```bash
# 1. No dashboard Vercel: Storage → Create Database → Postgres
# 2. Copie a connection string gerada
# 3. Cole no .env.local
```

#### 2. **Supabase** (Generoso)
- **Custo:** GRÁTIS até 500MB
- **Inclui:** Auth, Storage, Real-time
- **Link:** https://supabase.com

#### 3. **Railway** (Fácil)
- **Custo:** $5/mês (500h)
- **Link:** https://railway.app

#### 4. **Neon** (Serverless Postgres)
- **Custo:** GRÁTIS até 3GB
- **Link:** https://neon.tech

---

## 🔧 Passo a Passo da Migração

### 1. Criar banco PostgreSQL

**Opção A: Vercel Postgres (Recomendado)**
```bash
# Via dashboard Vercel
1. Vá em: https://vercel.com/dashboard
2. Storage → Create Database → Postgres
3. Copie a connection string
```

**Opção B: Supabase**
```bash
1. Crie conta em: https://supabase.com
2. New Project → PostgreSQL
3. Settings → Database → Connection String
```

### 2. Atualizar Prisma Schema

**Antes:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**Depois:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Ajustar Models (se necessário)

Algumas mudanças podem ser necessárias:

**SQLite:**
```prisma
model User {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
}
```

**PostgreSQL:** (mesmo código, mas com recursos extras disponíveis)
```prisma
model User {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  
  // PostgreSQL permite tipos avançados
  metadata  Json?    // JSON nativo
  tags      String[] // Arrays nativos
}
```

### 4. Configurar variável de ambiente

**Desenvolvimento (.env.local):**
```env
# SQLite (local)
DATABASE_URL="file:./db/custom.db"

# PostgreSQL (desenvolvimento remoto - opcional)
# DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```

**Produção (Vercel Dashboard):**
```env
# PostgreSQL (Vercel Postgres)
DATABASE_URL="postgres://default:xxx@ep-xxx.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"

# Ou Supabase
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

### 5. Rodar migrações

```bash
# 1. Gerar migração inicial
npx prisma migrate dev --name init

# 2. Gerar Prisma Client (atualizado para PostgreSQL)
npx prisma generate

# 3. Aplicar migrations em produção
npx prisma migrate deploy
```

### 6. Migrar dados (se tiver dados importantes)

**Opção A: Export/Import Manual**
```bash
# 1. Exportar dados do SQLite
npx prisma studio
# Copie os dados manualmente

# 2. Popular PostgreSQL
# Cole os dados no Prisma Studio conectado ao PostgreSQL
```

**Opção B: Script de migração**
```typescript
// scripts/migrate-data.ts
import { PrismaClient as SQLiteClient } from '@prisma/client';
import { PrismaClient as PostgresClient } from '@prisma/client';

const sqlite = new SQLiteClient({
  datasources: { db: { url: 'file:./db/custom.db' } }
});

const postgres = new PostgresClient({
  datasources: { db: { url: process.env.POSTGRES_URL } }
});

async function migrate() {
  // Migrar users
  const users = await sqlite.user.findMany();
  await postgres.user.createMany({ data: users });
  
  // Migrar outros modelos...
  console.log('✅ Migração completa!');
}

migrate();
```

### 7. Testar localmente

```bash
# 1. Conectar ao PostgreSQL de desenvolvimento
DATABASE_URL="postgresql://..." npm run dev

# 2. Testar todas as funcionalidades
# - Criar usuário
# - Tracking
# - Webhooks

# 3. Verificar no Prisma Studio
npx prisma studio
```

### 8. Deploy

```bash
# 1. Commit das mudanças
git add prisma/schema.prisma
git commit -m "feat: migrar de SQLite para PostgreSQL"
git push

# 2. Deploy automático no Vercel
# (Se conectou o GitHub, deploy é automático)

# 3. Aplicar migrations em produção
# Vercel roda automaticamente: npx prisma generate
# Se necessário, rodar manualmente:
vercel env pull .env.production
DATABASE_URL="..." npx prisma migrate deploy
```

---

## 🔍 Checklist de Validação

Após migração, verifique:

- [ ] ✅ App inicia sem erros
- [ ] ✅ Prisma Studio conecta ao PostgreSQL
- [ ] ✅ Criar registro funciona
- [ ] ✅ Ler registros funciona
- [ ] ✅ Atualizar registros funciona
- [ ] ✅ Deletar registros funciona
- [ ] ✅ Webhook `/api/webhook-cakto` salva no PostgreSQL
- [ ] ✅ Tracking `/api/save-tracking` funciona
- [ ] ✅ Deploy em produção bem-sucedido

---

## 📊 Comparação de Custos

| Provedor | Grátis | Pago | Limite Grátis |
|----------|--------|------|---------------|
| **Vercel Postgres** | ✅ | $20/mês | 256MB / 60h compute |
| **Supabase** | ✅ | $25/mês | 500MB / 2 projetos |
| **Railway** | ❌ | $5/mês | 500h compute |
| **Neon** | ✅ | $19/mês | 3GB / 100h compute |

**Recomendação:** Comece com **Vercel Postgres** ou **Supabase** (grátis).

---

## 🚨 Problemas Comuns

### Erro: "column does not exist"
```
Causa: Schema do PostgreSQL diferente do SQLite
Solução: Rodar `npx prisma migrate reset` (ATENÇÃO: apaga dados)
```

### Erro: "SSL connection required"
```
Adicione ao DATABASE_URL: ?sslmode=require
```

### Erro: "Too many clients"
```
Adicione connection pooling:
DATABASE_URL="postgresql://...?connection_limit=10"
```

### Performance lenta
```
Adicione índices no schema:

model User {
  email String @unique
  
  @@index([email]) // ← Índice
}
```

---

## 💡 Dicas de Performance

1. **Use connection pooling:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Bypass pooling para migrations
}
```

2. **Adicione índices:**
```prisma
model UserTracking {
  email String @unique
  
  @@index([email])
  @@index([phone])
}
```

3. **Use transações:**
```typescript
await prisma.$transaction([
  prisma.user.create({ data: ... }),
  prisma.tracking.create({ data: ... })
]);
```

---

## 📞 Precisa de Ajuda?

- **Vercel Postgres:** https://vercel.com/docs/storage/vercel-postgres
- **Supabase Docs:** https://supabase.com/docs/guides/database
- **Prisma Docs:** https://www.prisma.io/docs/guides/migrate

---

**✅ Pronto para migrar?**

Siga os passos acima e você terá um banco de dados de produção em **menos de 15 minutos**! 🚀

