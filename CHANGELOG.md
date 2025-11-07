# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [1.2.0] - 2025-01-06

### ✅ Adicionado
- Garantia de `country` e `user_id` sempre presentes
- SessionStorage para persistir `external_id` durante sessão
- Fallback de `country: 'br'` para 99% dos usuários brasileiros

### 🔧 Corrigido
- Timeout ao enviar eventos para Facebook (campos undefined)
- "País" e "Identificação externa" agora aparecem no navegador
- Advanced Matching completo em todos os eventos

### 📚 Documentação
- Removido 140+ arquivos .md redundantes (30k linhas)
- Criado SETUP.md conciso (200 linhas)
- Criado TROUBLESHOOTING.md (100 linhas)
- Criado CHANGELOG.md (este arquivo)

---

## [1.1.0] - 2025-01-06

### ✅ Adicionado
- Campo `items` no nível raiz do DataLayer
- Variáveis Event Data para GTM Server-Side
- Normalização completa de dados (metaDataNormalizer)

### 🔧 Corrigido
- Deduplicação de eventos funcionando 100%
- Delay de 200ms no navegador (prioriza servidor)
- Purchase via webhook com todos os campos

---

## [1.0.0] - 2024-12-XX

### ✅ Inicial
- Implementação GTM Web + Server-Side
- 5 eventos Facebook (ViewContent, AddToCart, InitiateCheckout, Lead, Purchase)
- Integração Cakto (checkout)
- Webhook para Purchase offline
- Vercel KV para persistência

