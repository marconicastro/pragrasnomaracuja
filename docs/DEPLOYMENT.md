# 🚀 Guia de Deploy - Socket.IO vs Serverless

## ⚠️ Decisão Crítica: Arquitetura de Deploy

Seu projeto **atualmente usa Socket.IO**, que **NÃO é compatível com Vercel** (plataforma serverless). Você precisa escolher uma das duas opções abaixo:

---

## 📊 Comparação Rápida

| Aspecto | **Opção 1: Vercel (Serverless)** | **Opção 2: VPS/Railway (Socket.IO)** |
|---------|----------------------------------|---------------------------------------|
| **Socket.IO** | ❌ NÃO suporta | ✅ Suporta nativamente |
| **Custo** | 🟢 GRÁTIS até 100GB/mês | 🟡 $5-20/mês |
| **Setup** | 🟢 Extremamente fácil | 🟡 Requer configuração |
| **Escalabilidade** | 🟢 Automática e ilimitada | 🟡 Manual (vertical/horizontal) |
| **CI/CD** | 🟢 Automático (git push) | 🟡 Configurar manualmente |
| **Performance** | 🟢 Edge network global | 🟢 Bom (depende do VPS) |
| **Manutenção** | 🟢 Zero (managed) | 🟡 Você gerencia |

---

## 🎯 Opção 1: Vercel (Serverless) - RECOMENDADO ⭐

### Quando Escolher
- ✅ Você **NÃO precisa** de comunicação real-time bidirecional
- ✅ Quer deploy **automático e gratuito**
- ✅ Prioriza **zero manutenção**
- ✅ Quer **escalabilidade automática**

### O que fazer

#### 1. Remover Socket.IO
```bash
npm uninstall socket.io socket.io-client
```

#### 2. Deletar/Desabilitar arquivos relacionados
```bash
# Deletar
rm server.ts
rm src/lib/socket.ts

# Ou comentar código no server.ts
```

#### 3. Usar `next start` padrão
Editar `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

#### 4. Alternativas ao Socket.IO

##### A) Polling (Simples)
```typescript
// Fazer requisições periódicas a cada X segundos
useEffect(() => {
  const interval = setInterval(async () => {
    const data = await fetch('/api/status').then(r => r.json());
    setStatus(data);
  }, 3000); // 3 segundos
  
  return () => clearInterval(interval);
}, []);
```

##### B) Server-Sent Events (Unidirecional)
```typescript
// Server (API Route)
export async function GET() {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      setInterval(() => {
        const data = `data: ${JSON.stringify({ time: Date.now() })}\n\n`;
        controller.enqueue(encoder.encode(data));
      }, 1000);
    }
  });
  
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' }
  });
}

// Client
useEffect(() => {
  const eventSource = new EventSource('/api/stream');
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
  };
  return () => eventSource.close();
}, []);
```

##### C) Pusher/Ably (Managed WebSockets)
```bash
npm install pusher-js
```

```typescript
// server
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: 'us2'
});

pusher.trigger('my-channel', 'my-event', { message: 'hello' });

// client
import Pusher from 'pusher-js';

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: 'us2'
});

const channel = pusher.subscribe('my-channel');
channel.bind('my-event', (data) => {
  console.log(data.message);
});
```

**Custos:**
- Pusher: Grátis até 200k mensagens/dia
- Ably: Grátis até 3M mensagens/mês

#### 5. Deploy no Vercel

##### Via Dashboard (Mais fácil)
1. Acesse: https://vercel.com/new
2. Conecte seu repositório GitHub
3. Configure variáveis de ambiente (copie do `.env.example`)
4. Clique em "Deploy"
5. ✅ PRONTO! URL: `seu-projeto.vercel.app`

##### Via CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

#### 6. Configurar variáveis de ambiente
No dashboard do Vercel:
1. Settings → Environment Variables
2. Adicione todas as variáveis do `.env.example`
3. Redeploy (automático)

---

## 🖥️ Opção 2: VPS/Railway (Manter Socket.IO)

### Quando Escolher
- ✅ Você **REALMENTE precisa** de Socket.IO
- ✅ Tem casos de uso de real-time bidirecional
- ✅ Não se importa com $5-20/mês
- ✅ Quer controle total do servidor

### Provedores Recomendados

#### Railway (Mais fácil) ⭐
- **Custo:** $5/mês (500h de execução)
- **Setup:** 5 minutos
- **CI/CD:** Automático (git push)
- **Link:** https://railway.app

##### Setup Railway
```bash
# 1. Instalar CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Criar projeto
railway init

# 4. Deploy
railway up

# 5. Variáveis de ambiente
railway variables set DATABASE_URL="postgresql://..."
```

#### Render (Alternativa)
- **Custo:** $7/mês (starter)
- **Link:** https://render.com

#### DigitalOcean (Mais controle)
- **Custo:** $6/mês (básico)
- **Requer:** Configuração manual completa
- **Link:** https://www.digitalocean.com

---

## 🔍 Seu Projeto Usa Socket.IO Para Quê?

Verificando seu código:

```typescript:1:5:server.ts
// server.ts - Next.js Standalone + Socket.IO
import { setupSocket } from '@/lib/socket';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
```

**IMPORTANTE:** Verifique o arquivo `src/lib/socket.ts` para entender:
1. Quais eventos estão sendo emitidos?
2. É realmente necessário comunicação bidirecional?
3. Polling ou SSE poderiam substituir?

---

## 📝 Recomendação Final

### Para 95% dos casos (incluindo seu projeto de e-commerce):

**👉 ESCOLHA OPÇÃO 1 (Vercel Serverless)**

**Motivos:**
1. ✅ Seu projeto é **e-commerce/landing page** (não precisa real-time)
2. ✅ Vercel é **GRÁTIS** para seu caso de uso
3. ✅ **Zero configuração** de deploy
4. ✅ **Escalabilidade automática**
5. ✅ **Edge network global** (melhor performance)

**Se realmente precisa de notificações real-time:**
- Use **Pusher** (grátis até 200k msg/dia)
- Ou **Server-Sent Events** (nativo, grátis)

### Para casos específicos de real-time (chat, jogos, dashboards live):

**👉 ESCOLHA OPÇÃO 2 (Railway + Socket.IO)**

---

## 🚀 Próximos Passos (Opção 1 - RECOMENDADO)

```bash
# 1. Remover Socket.IO
npm uninstall socket.io socket.io-client

# 2. Deletar arquivos
rm server.ts
rm src/lib/socket.ts

# 3. Atualizar package.json
# Remover referências ao server.ts nos scripts

# 4. Testar localmente
npm run dev

# 5. Build de produção
npm run build
npm start

# 6. Deploy no Vercel
# Via dashboard: https://vercel.com/new
# Ou CLI: vercel --prod
```

---

## 📚 Recursos Adicionais

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Pusher Docs:** https://pusher.com/docs
- **Ably Docs:** https://ably.com/docs

---

## ❓ FAQ

### P: Perco funcionalidades sem Socket.IO?
**R:** Não, se você não está usando real-time bidirecional. Polling ou SSE cobrem 95% dos casos.

### P: Posso usar Socket.IO no Vercel?
**R:** Não. Vercel é serverless (stateless). Socket.IO precisa de conexões persistentes.

### P: E se eu quiser migrar depois?
**R:** Tranquilo! Você pode migrar entre as opções a qualquer momento.

### P: Railway é confiável?
**R:** Sim! Usado por milhares de projetos. Uptime de 99.9%.

### P: Preciso mudar meu código?
**R:** Se escolher Vercel: remover Socket.IO e usar alternativas.
Se escolher Railway: manter código atual.

---

**✅ DECISÃO TOMADA?**

Atualize a variável de ambiente no `.env.local`:
```env
# Opção 1 (Vercel)
ENABLE_SOCKET_IO="false"

# Opção 2 (Railway/VPS)
ENABLE_SOCKET_IO="true"
```

Boa sorte! 🚀

