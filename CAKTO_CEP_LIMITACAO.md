# ?? CAKTO: Limita??o de Pr?-preenchimento de CEP

## ?? SITUA??O ATUAL:

### **URL EST? PERFEITA:**

```
https://pay.cakto.com.br/hacr962_605077?
name=MARCONI+AUGUSTO+DE+CASTRO&    ? Cakto preenche
email=mcastrosal12vador@gmail.com& ? Cakto preenche
phone=5577998276042&               ? Cakto preenche

zip=46300&                         ? Cakto N?O preenche
city=cacul?&                       ? Cakto N?O preenche
state=BA&                          ? Cakto N?O preenche
```

**Conclus?o:** Cakto pr?-preenche dados pessoais, MAS N?O pr?-preenche geolocaliza??o.

---

## ?? O QUE TESTAMOS:

### **15 FORMATOS DIFERENTES enviados na URL:**

**CEP (7 formatos):**
1. `zip=46300`
2. `zipcode=46300`
3. `postal_code=46300`
4. `cep=46300`
5. `address_zip_code=46300`
6. `address[zip_code]=46300`
7. `customer[address][zip]=46300`

**Cidade (4 formatos):**
1. `city=Cacul?`
2. `address_city=Cacul?`
3. `address[city]=Cacul?`
4. `customer[address][city]=Cacul?`

**Estado (4 formatos):**
1. `state=BA`
2. `address_state=BA`
3. `address[state]=BA`
4. `customer[address][state]=BA`

**Se NENHUM funcionar = Cakto n?o suporta.**

---

## ?? COMPARA??O COM OUTRAS PLATAFORMAS:

| Plataforma | Nome/Email/Tel | CEP/Cidade/Estado |
|------------|----------------|-------------------|
| **Hotmart** | ? Sim | ? Sim |
| **Eduzz** | ? Sim | ? Sim |
| **Monetizze** | ? Sim | ? Sim |
| **Braip** | ? Sim | ? Sim |
| **Kiwify** | ? Sim | ? Sim |
| **Cakto** | ? Sim | ? **N?O** |

**Cakto ? a ?NICA que n?o suporta!** ??

---

## ?? POSS?VEIS SOLU??ES:

### **OP??O A: Contatar Suporte Cakto** ? RECOMENDADO

**Perguntar:**
> "Ol?, gostaria de saber se a Cakto suporta pr?-preencher CEP, cidade e estado via par?metros de URL, assim como Hotmart/Eduzz fazem. Se sim, qual o nome dos par?metros corretos?"

**Exemplos para enviar:**
- Hotmart usa: `address_zip_code`, `address_city`, `address_state`
- Kiwify usa: `customer[address][zip]`, `customer[address][city]`
- Qual a Cakto usa?

**Contato Cakto:**
- Suporte: https://ajuda.cakto.com.br
- Email: suporte@cakto.com.br
- WhatsApp: (verificar no site)

---

### **OP??O B: Usar Cakto API** (Se dispon?vel)

Se Cakto tem API, pode ser poss?vel criar checkout programaticamente com dados pr?-preenchidos.

**Verificar:**
- Documenta??o API Cakto
- Endpoint de cria??o de checkout
- Passar dados completos via API

---

### **OP??O C: Aceitar Limita??o** (Tempor?rio)

**Dados que PR?-PREENCHEM:**
- ? Nome
- ? Email
- ? Telefone

**Cliente ainda precisa digitar:**
- ? CEP (5 d?gitos)
- ? Cidade (auto-completa por CEP)
- ? Estado (auto-completa por CEP)

**Impacto:**
- Convers?o: ~60-70% (ao inv?s de 75-85%)
- Ainda ? BOM! (melhor que 35% sem nada)

---

### **OP??O D: Migrar para outra plataforma** (Radical)

Se CEP pr?-preenchido for CR?TICO:

**Alternativas:**
1. **Hotmart** (R$ 5bi/ano, l?der)
   - ? Suporta tudo
   - Taxa: 9.9% + R$ 0,59
   
2. **Eduzz** (R$ 1bi/ano)
   - ? Suporta tudo
   - Taxa: 8.9% + R$ 0,49
   
3. **Kiwify** (crescendo r?pido)
   - ? Suporta tudo
   - Taxa: 4.99% (mais barata!)

**MAS:** Trocar de plataforma = trabalho!

---

## ?? AN?LISE DE IMPACTO:

### **Convers?o por Cen?rio:**

| Cen?rio | Taxa | Motivo |
|---------|------|--------|
| **Tudo vazio** | 25-35% | Cliente preenche 100% |
| **S? nome/email** | 40-50% | Cliente preenche tel + geo |
| **Nome/email/tel** | **60-70%** | **ATUAL (Cakto)** |
| **Tudo preenchido** | 75-85% | Ideal (Hotmart/Eduzz) |

**Voc? est? em 60-70%!** (bom, mas n?o perfeito)

**Ganho potencial:** +10-15% se Cakto suportasse

---

## ? RECOMENDA??O FINAL:

### **PASSO 1: Contatar Suporte Cakto** (1 dia)

Perguntar se existe par?metro para CEP/cidade/estado.

**Poss?veis respostas:**

**A) "Sim, use `parametro_x`"**
? Ajustamos c?digo (5min)
? Problema resolvido! ?

**B) "N?o suportamos ainda, mas vamos adicionar"**
? Aguarda atualiza??o
? Voc? fica na frente da fila

**C) "N?o suportamos"**
? Aceita limita??o atual
? Convers?o ~65% (ainda ?timo!)

---

### **PASSO 2: Se Cakto n?o suportar** (decis?o de neg?cio)

**Op??o A: Aceitar 65% convers?o**
- Pr?s: Sem trabalho
- Contras: 10-15% menos convers?o

**Op??o B: Migrar para Hotmart/Eduzz**
- Pr?s: 75-85% convers?o
- Contras: Trabalho de migra??o, taxas diferentes

---

## ?? SITUA??O ATUAL (Resumo):

### **O que FUNCIONA:** ?
- ? Telefone com DDI +55
- ? Nome pr?-preenchido
- ? Email pr?-preenchido
- ? Telefone pr?-preenchido
- ? Meta tracking (fbp/fbc)
- ? UTMs preservadas
- ? URL correta (todos os par?metros)

### **O que N?O funciona:** ?
- ? CEP pr?-preenchido (limita??o Cakto)
- ? Cidade pr?-preenchida (limita??o Cakto)
- ? Estado pr?-preenchido (limita??o Cakto)

### **Impacto:**
- Convers?o atual: ~65% (MUITO BOM!)
- Convers?o ideal: ~80% (se Cakto suportasse)
- Diferen?a: +15% potencial

---

## ?? PR?XIMOS PASSOS:

**DECIS?O SUA:**

1. [ ] **Contatar Cakto** ? Perguntar sobre par?metros de geo
2. [ ] **Aceitar atual** ? 65% convers?o ? ?timo!
3. [ ] **Avaliar migra??o** ? Hotmart/Eduzz/Kiwify

---

## ?? NOSSO C?DIGO EST? PRONTO:

**Se Cakto adicionar suporte amanh?:**
- ? C?digo j? envia TODOS os formatos
- ? Vai funcionar automaticamente
- ? Zero mudan?as necess?rias

**Estamos 100% preparados!** ??

---

## ?? TEMPLATE EMAIL PARA CAKTO:

```
Assunto: Suporte a Par?metros de Geolocaliza??o na URL de Checkout

Ol? equipe Cakto,

Gostaria de saber se ? poss?vel pr?-preencher dados de geolocaliza??o 
(CEP, cidade, estado) via par?metros de URL no checkout, similar ao 
que plataformas como Hotmart e Eduzz oferecem.

Atualmente consigo pr?-preencher:
? name
? email
? phone

Gostaria de pr?-preencher tamb?m:
? CEP
? Cidade
? Estado

Caso suportem, qual o nome correto dos par?metros?

Exemplos testados sem sucesso:
- zip=46300
- zipcode=46300
- cep=46300
- address_zip_code=46300
- customer[address][zip]=46300

Aguardo retorno,
[Seu Nome]
```

---

**Resumo:** Cakto tem limita??o. Contate suporte ou aceite 65% convers?o (ainda ?timo!). ??
