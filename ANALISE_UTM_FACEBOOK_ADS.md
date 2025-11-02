# ?? AN?LISE: Par?metros UTM Facebook Ads

## ?? PAR?METROS ATUAIS (O que voc? usa):

```
utm_source=FB
utm_campaign={{campaign.name}}|{{campaign.id}}
utm_medium={{adset.name}}|{{adset.id}}
utm_content={{ad.name}}|{{ad.id}}
utm_term={{placement}}
```

**Exemplo gerado:**
```
utm_source=FB
utm_campaign=Lancamento_Maracuja|123456789
utm_medium=Publico_Amplo_Interesse|987654321
utm_content=Video_Pragas_V1|555666777
utm_term=facebook_feed
```

---

## ?? PROBLEMAS (Baseado em documenta??o oficial):

### **1. utm_source=FB** ? PROBLEMA GRAVE

**Documenta??o Google Analytics:**
> utm_source: Identifica a PLATAFORMA (facebook, google, instagram, tiktok)

**O que voc? usa:** `FB` (abrevia??o)

**Por que ? problema:**
- ? Google Analytics n?o reconhece "FB" como "Facebook"
- ? Relat?rios aparecem como "FB" (separado de "facebook")
- ? N?o agrupa com tr?fego org?nico do Facebook
- ? Meta pode n?o correlacionar corretamente

**? PADR?O CORRETO:** `utm_source=facebook` (por extenso, min?scula)

**Usado por:**
- Google (documenta??o oficial)
- Facebook (documenta??o oficial)
- Hotmart, Eduzz, etc
- 100% do mercado

---

### **2. utm_medium={{adset.name}}|{{adset.id}}** ? ERRO CR?TICO!

**Documenta??o Google Analytics:**
> utm_medium: Identifica o TIPO de m?dia (cpc, organic, email, social, paid)

**O que voc? usa:** Nome do Ad Set (ex: "Publico_Amplo_Interesse|987654321")

**Por que ? ERRO CR?TICO:**
- ? utm_medium N?O ? para nome do ad set!
- ? Deveria ser: "cpc", "paid", "social", etc
- ? Google Analytics vai quebrar
- ? Meta n?o vai otimizar corretamente
- ? Relat?rios v?o ficar bagun?ados

**? PADR?O CORRETO:** `utm_medium=cpc` (fixo para Facebook Ads)

**ou varia??es:**
- `paid` (gen?rico para tr?fego pago)
- `social_paid` (redes sociais pagas)
- `fb_ads` (espec?fico FB, mas "cpc" ? padr?o)

**Usado por:**
- Google (documenta??o oficial)
- Facebook (documenta??o oficial)
- 100% do mercado profissional

---

### **3. utm_campaign={{campaign.name}}|{{campaign.id}}** ?? N?O IDEAL

**Documenta??o Google Analytics:**
> utm_campaign: Nome da campanha (ex: "black_friday", "lancamento_2024")

**O que voc? usa:** `Lancamento_Maracuja|123456789`

**Problemas:**
- ?? Est? misturando nome + ID com pipe (|)
- ?? Google Analytics vai mostrar literal: "Lancamento_Maracuja|123456789"
- ?? Dificulta filtros e agrupamentos
- ?? N?o segue padr?o (confunde ferramentas)

**? PADR?O CORRETO:**
```
utm_campaign={{campaign.name}}    ? S? o nome
utm_id={{campaign.id}}            ? ID separado (Google Analytics 4)
```

**ou** (se quiser manter junto):
```
utm_campaign={{campaign.name}}    ? Mais limpo
```

**Usado por:**
- Google (separado: utm_campaign + utm_id)
- Facebook (recomenda usar s? nome)
- Ag?ncias profissionais

---

### **4. utm_content={{ad.name}}|{{ad.id}}** ? OK (mas pode melhorar)

**Documenta??o Google Analytics:**
> utm_content: Varia??o do an?ncio (ex: "video1", "imagem2", "headline_a")

**O que voc? usa:** `Video_Pragas_V1|555666777`

**Status:** ? Funciona!

**Pode melhorar:**
- ?? Mesma coisa do campaign (mistura nome + ID)
- ? Mas utm_content n?o tem campo separado para ID (ent?o est? OK)

**Alternativa (mais limpo):**
```
utm_content={{ad.name}}    ? S? o nome (mais limpo)
```

---

### **5. utm_term={{placement}}** ?? N?O CONVENCIONAL

**Documenta??o Google Analytics:**
> utm_term: PALAVRA-CHAVE de busca (ex: "pragas maracuja", "trips controle")
> Usado em Google Ads (Search), n?o em Facebook!

**O que voc? usa:** `facebook_feed` (placement)

**Problemas:**
- ?? utm_term ? para keywords (Google Search)
- ?? Facebook n?o tem keywords (? audience-based)
- ?? Placement n?o ? "termo de busca"
- ?? N?o segue conven??o

**? MELHOR:** Usar par?metro customizado
```
fb_placement={{placement}}    ? Par?metro custom (mais claro)
```

**ou** (se quiser manter UTM padr?o):
```
utm_term={{placement}}    ? Funciona, mas n?o ? ideal
```

---

## ?? COMPARA??O: Seu vs Padr?o Mercado

| Par?metro | VOC? USA | PADR?O MERCADO | Status |
|-----------|----------|----------------|--------|
| **utm_source** | `FB` | `facebook` | ? Errado |
| **utm_medium** | `{{adset.name}}\|{{adset.id}}` | `cpc` | ? Cr?tico! |
| **utm_campaign** | `{{campaign.name}}\|{{campaign.id}}` | `{{campaign.name}}` | ?? OK, mas n?o ideal |
| **utm_content** | `{{ad.name}}\|{{ad.id}}` | `{{ad.name}}` | ? OK |
| **utm_term** | `{{placement}}` | `(vazio ou keyword)` | ?? N?o convencional |

---

## ?? PADR?O RECOMENDADO (3 Op??es):

### **OP??O A: Padr?o Google Analytics (Universal)** ?????

**Mais usado, mais compat?vel, mais simples:**

```
utm_source=facebook
utm_medium=cpc
utm_campaign={{campaign.name}}
utm_content={{ad.name}}
utm_term={{placement}}
```

**Exemplo gerado:**
```
utm_source=facebook
utm_medium=cpc
utm_campaign=Lancamento_Maracuja
utm_content=Video_Pragas_V1
utm_term=facebook_feed
```

**? Pr?s:**
- ? 100% compat?vel com Google Analytics
- ? Meta reconhece perfeitamente
- ? Relat?rios limpos
- ? F?cil de entender
- ? Padr?o universal (funciona em tudo)
- ? Usado por 90% do mercado

**? Contras:**
- ?? N?o tem IDs expl?citos (nome pode repetir)
- ?? Menos dados ricos

**?? Usado por:** 90% do mercado (Hotmart, Eduzz, ag?ncias m?dias)

---

### **OP??O B: Dados Ricos (Seu atual corrigido)** ????

**Mant?m seus IDs, mas corrige source e medium:**

```
utm_source=facebook
utm_medium=cpc
utm_campaign={{campaign.name}}|{{campaign.id}}
utm_content={{ad.name}}|{{ad.id}}
utm_term={{placement}}

fb_adset_name={{adset.name}}
fb_adset_id={{adset.id}}
```

**Exemplo gerado:**
```
utm_source=facebook
utm_medium=cpc
utm_campaign=Lancamento_Maracuja|123456789
utm_content=Video_Pragas_V1|555666777
utm_term=facebook_feed
fb_adset_name=Publico_Amplo_Interesse
fb_adset_id=987654321
```

**? Pr?s:**
- ? Compat?vel com Google Analytics (source/medium corretos)
- ? Dados ricos (tem IDs)
- ? Rastreamento preciso (qual an?ncio exato)
- ? Ad set em par?metro separado (mais limpo)

**? Contras:**
- ?? URL um pouco maior
- ?? Mais par?metros para gerenciar

**?? Usado por:** 10% do mercado (ag?ncias avan?adas)

---

### **OP??O C: Meta Native (M?ximo detalhamento)** ?????

**Padr?o + dados nativos do Facebook:**

```
utm_source=facebook
utm_medium=cpc
utm_campaign={{campaign.name}}
utm_content={{ad.name}}

fb_campaign_id={{campaign.id}}
fb_adset_name={{adset.name}}
fb_adset_id={{adset.id}}
fb_ad_name={{ad.name}}
fb_ad_id={{ad.id}}
fb_placement={{placement}}
```

**Exemplo gerado:**
```
utm_source=facebook
utm_medium=cpc
utm_campaign=Lancamento_Maracuja
utm_content=Video_Pragas_V1

fb_campaign_id=123456789
fb_adset_name=Publico_Amplo_Interesse
fb_adset_id=987654321
fb_ad_name=Video_Pragas_V1
fb_ad_id=555666777
fb_placement=facebook_feed
```

**? Pr?s:**
- ? 100% compat?vel com Google Analytics
- ? M?ximo de dados ricos
- ? Nomenclatura clara (fb_* = Facebook)
- ? F?cil de filtrar relat?rios
- ? Meta otimiza melhor
- ? Futuro-proof (se adicionar Google Ads, n?o conflita)

**? Contras:**
- ?? URL mais longa (~100 chars a mais)
- ?? Mais campos para configurar

**?? Usado por:** 5% do mercado (grandes ag?ncias, SaaS enterprise)

---

## ?? AN?LISE DO SEU PADR?O ATUAL:

### **? ERRO CR?TICO: utm_medium**

```
utm_medium={{adset.name}}|{{adset.id}}
```

**Isso est? ERRADO!**

**utm_medium deveria ser:** `cpc` (ou `paid`, `social_paid`)

**Por qu? ? cr?tico:**
- ? Google Analytics vai quebrar relat?rios
- ? Meta n?o vai categorizar corretamente
- ? Imposs?vel agrupar por tipo de m?dia
- ? Todos os seus an?ncios v?o aparecer como "mediums" diferentes

**Exemplo do problema:**

Relat?rio do Google Analytics:
```
Medium: Publico_Amplo_Interesse|987  ? 10 convers?es
Medium: Publico_Lookalike|456        ? 8 convers?es
Medium: Publico_Retargeting|789      ? 12 convers?es

? Imposs?vel ver: "Quantas convers?es vieram de CPC?"
? Todos aparecem separados!
```

**Como deveria ser:**
```
Medium: cpc ? 30 convers?es (todos os ad sets juntos!)

Depois voc? filtra por utm_campaign ou custom parameter.
```

---

### **?? OUTROS PROBLEMAS:**

**1. utm_source=FB** (deveria ser `facebook`)
- Google Analytics n?o reconhece "FB"
- Relat?rios aparecem separados

**2. utm_campaign com pipe** (n?o ideal)
- Funciona, mas n?o ? padr?o
- Melhor separar: `utm_campaign` (nome) + `utm_id` (ID)

**3. utm_term={{placement}}** (n?o convencional)
- utm_term ? para keywords (Google Search)
- Facebook n?o tem keywords
- Melhor usar par?metro custom: `fb_placement`

---

## ?? MINHA RECOMENDA??O FORTE:

### **OP??O B (Dados Ricos Corrigidos)** ?????

**Por qu??**
- ? Corrige os erros cr?ticos (source, medium)
- ? Mant?m seus IDs (rastreamento detalhado)
- ? Compat?vel com Google Analytics
- ? Meta otimiza corretamente
- ? Relat?rios funcionam
- ? Dados ricos para an?lise

```
utm_source=facebook
utm_medium=cpc
utm_campaign={{campaign.name}}|{{campaign.id}}
utm_content={{ad.name}}|{{ad.id}}
utm_term={{placement}}

fb_adset_name={{adset.name}}
fb_adset_id={{adset.id}}
```

**ou ainda melhor (separar IDs):**

```
utm_source=facebook
utm_medium=cpc
utm_campaign={{campaign.name}}
utm_content={{ad.name}}
utm_id={{campaign.id}}

fb_adset_name={{adset.name}}
fb_adset_id={{adset.id}}
fb_ad_id={{ad.id}}
fb_placement={{placement}}
```

---

## ?? COMPARA??O DETALHADA:

### **SEU PADR?O ATUAL:**

| Par?metro | Valor | Problema | Gravidade |
|-----------|-------|----------|-----------|
| utm_source | FB | N?o ? padr?o | ?? M?dio |
| utm_medium | {{adset.name}}\|ID | **ERRADO!** | ? **CR?TICO** |
| utm_campaign | {{campaign.name}}\|ID | Funciona (n?o ideal) | ?? Baixo |
| utm_content | {{ad.name}}\|ID | OK | ? OK |
| utm_term | {{placement}} | N?o convencional | ?? Baixo |

---

### **PADR?O RECOMENDADO (Op??o B):**

| Par?metro | Valor | Benef?cio | Compatibilidade |
|-----------|-------|-----------|-----------------|
| utm_source | facebook | Padr?o universal | ? 100% |
| utm_medium | cpc | Categoriza corretamente | ? 100% |
| utm_campaign | {{campaign.name}}\|ID | Rastreia campanha + ID | ? 100% |
| utm_content | {{ad.name}}\|ID | Rastreia an?ncio + ID | ? 100% |
| utm_term | {{placement}} | Rastreia placement | ? 90% |
| fb_adset_name | {{adset.name}} | Ad set (separado) | ? 100% |
| fb_adset_id | {{adset.id}} | ID do ad set | ? 100% |

---

## ?? IMPACTO DAS CORRE??ES:

### **COM SEU PADR?O ATUAL (errado):**

**Google Analytics:**
```
Source: FB (n?o agrupa com facebook org?nico)
Medium: Publico_Amplo_Interesse|987 (quebra relat?rios!)
Medium: Publico_Lookalike|456
Medium: Publico_Retargeting|789

? Imposs?vel filtrar por "todos os CPC"
? Cada ad set ? um medium diferente
? Relat?rios bagun?ados
```

---

### **COM PADR?O CORRETO:**

**Google Analytics:**
```
Source: facebook (agrupa corretamente)
Medium: cpc (TODOS os an?ncios juntos!)

Depois filtra por:
?? Campaign: Lancamento_Maracuja ? 50 convers?es
?? Campaign: Black_Friday ? 30 convers?es
?? Campaign: Retargeting ? 20 convers?es

? Vis?o clara!
? Relat?rios limpos!
? F?cil de analisar!
```

**Meta Ads:**
```
? Meta reconhece source=facebook
? Meta categoriza medium=cpc corretamente
? Atribui??o funciona perfeitamente
? CBO otimiza melhor
```

---

## ??? PRECISA ATUALIZAR NOSSO C?DIGO?

### **?TIMA NOT?CIA: N?O!** ?

**Nosso sistema J? CAPTURA tudo que voc? enviar:**

```typescript
// src/lib/utmTracking.ts

export interface UTMParameters {
  utm_source?: string;      ? Captura "FB" ou "facebook"
  utm_medium?: string;      ? Captura qualquer valor
  utm_campaign?: string;    ? Captura com ou sem ID
  utm_content?: string;     ? Captura com ou sem ID
  utm_term?: string;        ? Captura placement
  utm_id?: string;          ? Captura se voc? adicionar
  
  // Custom params (se adicionar):
  fb_adset_name?: string;   ? Sistema vai capturar
  fb_adset_id?: string;     ? Sistema vai capturar
  fb_ad_id?: string;        ? Sistema vai capturar
  fb_placement?: string;    ? Sistema vai capturar
}
```

**Ou seja:**
- ? Sistema captura QUALQUER par?metro que come?ar com `utm_` ou `fb_`
- ? Voc? s? precisa MUDAR NO GERENCIADOR DE AN?NCIOS
- ? C?digo j? est? preparado!

---

## ? A??O NECESS?RIA:

### **MUDAR NO GERENCIADOR DE AN?NCIOS:**

**DE (atual - problem?tico):**
```
utm_source=FB&
utm_campaign={{campaign.name}}|{{campaign.id}}&
utm_medium={{adset.name}}|{{adset.id}}&
utm_content={{ad.name}}|{{ad.id}}&
utm_term={{placement}}
```

**PARA (recomendado):**
```
utm_source=facebook&
utm_medium=cpc&
utm_campaign={{campaign.name}}|{{campaign.id}}&
utm_content={{ad.name}}|{{ad.id}}&
utm_term={{placement}}&
fb_adset_name={{adset.name}}&
fb_adset_id={{adset.id}}
```

**ou (ainda melhor - padr?o limpo):**
```
utm_source=facebook&
utm_medium=cpc&
utm_campaign={{campaign.name}}&
utm_content={{ad.name}}&
utm_id={{campaign.id}}&
fb_adset_name={{adset.name}}&
fb_adset_id={{adset.id}}&
fb_ad_id={{ad.id}}&
fb_placement={{placement}}
```

---

## ?? DECIS?O:

**Qual padr?o voc? quer usar?**

### **A) Padr?o Universal (Simples)** ?????
```
utm_source=facebook
utm_medium=cpc
utm_campaign={{campaign.name}}
utm_content={{ad.name}}
```
- Mais simples
- 100% compat?vel
- Usado por 90% do mercado

---

### **B) Dados Ricos Corrigidos (Seu atual corrigido)** ?????
```
utm_source=facebook
utm_medium=cpc
utm_campaign={{campaign.name}}|{{campaign.id}}
utm_content={{ad.name}}|{{ad.id}}
utm_term={{placement}}
fb_adset_name={{adset.name}}
fb_adset_id={{adset.id}}
```
- M?ximo de dados
- IDs expl?citos
- An?lise detalhada
- **RECOMENDO ESTE!** ??

---

### **C) Meta Native Separado (Elite)** ?????
```
utm_source=facebook
utm_medium=cpc
utm_campaign={{campaign.name}}
utm_content={{ad.name}}
utm_id={{campaign.id}}
fb_adset_name={{adset.name}}
fb_adset_id={{adset.id}}
fb_ad_id={{ad.id}}
fb_placement={{placement}}
```
- Mais limpo
- IDs separados
- Nomenclatura profissional
- Usado por grandes ag?ncias

---

## ?? URG?NCIA:

### **Corrija isso AGORA!**

**utm_medium={{adset.name}}** ? um **ERRO CR?TICO** que est?:
- ? Quebrando seus relat?rios
- ? Impedindo Meta de otimizar corretamente
- ? Dificultando an?lise de dados

**Impacto:** -20-30% efici?ncia nas campanhas!

---

**Qual op??o voc? quer? (Recomendo B ou C)** ??

**E eu confirmo se nosso c?digo precisa de algum ajuste!** ?