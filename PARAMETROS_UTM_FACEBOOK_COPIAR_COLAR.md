# ?? PAR?METROS UTM PARA FACEBOOK ADS - COPIAR E COLAR

## ?? ONDE COLAR NO FACEBOOK ADS:

1. **Gerenciador de An?ncios** ? https://business.facebook.com/adsmanager
2. Selecione sua **Campanha**
3. Clique em **Editar**
4. Role at? **Par?metros de URL** (ou "URL Parameters")
5. Cole um dos padr?es abaixo no campo **"Par?metros de URL"**

---

## ?? OP??O A: RECOMENDADO (Dados Ricos Corrigidos)

### **COPIE E COLE ISSO:**

```
utm_source=facebook&utm_medium=cpc&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}&fb_adset_name={{adset.name}}&fb_adset_id={{adset.id}}
```

### **O que ser? gerado (exemplo real):**

```
utm_source=facebook
utm_medium=cpc
utm_campaign=Lancamento_Maracuja|123456789
utm_content=Video_Pragas_V1|555666777
utm_term=facebook_feed
fb_adset_name=Publico_Amplo_Interesse
fb_adset_id=987654321
```

### **Benef?cios:**
- ? Corrige source (FB ? facebook)
- ? Corrige medium (ad set name ? cpc) ? CR?TICO!
- ? Mant?m IDs completos (rastreamento preciso)
- ? Ad set em par?metro separado (mais organizado)
- ? Compat?vel com Google Analytics
- ? Meta otimiza corretamente

---

## ?? OP??O B: PADR?O GA4 (Mais Limpo e Moderno)

### **COPIE E COLE ISSO:**

```
utm_source=facebook&utm_medium=cpc&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_id={{campaign.id}}&fb_adset_name={{adset.name}}&fb_adset_id={{adset.id}}&fb_ad_id={{ad.id}}&fb_placement={{placement}}
```

### **O que ser? gerado (exemplo real):**

```
utm_source=facebook
utm_medium=cpc
utm_campaign=Lancamento_Maracuja
utm_content=Video_Pragas_V1
utm_id=123456789
fb_adset_name=Publico_Amplo_Interesse
fb_adset_id=987654321
fb_ad_id=555666777
fb_placement=facebook_feed
```

### **Benef?cios:**
- ? Padr?o Google Analytics 4 (moderno)
- ? Nomenclatura profissional
- ? IDs separados (mais limpo)
- ? M?ximo de dados ricos
- ? Usado por grandes ag?ncias

---

## ?? COMPARA??O:

| Aspecto | Seu Atual | Op??o A | Op??o B |
|---------|-----------|---------|---------|
| **Compatibilidade** | ? Quebrado | ? 100% | ? 100% |
| **Meta otimiza** | ? Confuso | ? Perfeitamente | ? Perfeitamente |
| **Relat?rios** | ? Bagun?ado | ? Limpos | ? Limpos |
| **IDs rastre?veis** | ?? Sim (mas errado) | ? Sim | ? Sim |
| **Modernidade** | ? Antigo | ? Atual | ? GA4 (novo) |

---

## ?? MINHA RECOMENDA??O:

### **USE OP??O A** ?????

Por qu??
- ? Corrige os erros cr?ticos
- ? Mant?m sua estrutura (IDs com pipe)
- ? Menos mudan?a = menos risco
- ? Funciona 100%

**ou**

### **USE OP??O B** (se quiser o mais moderno)

Por qu??
- ? Padr?o GA4 (mais novo)
- ? Mais profissional
- ? Usado por grandes players

---

## ?? PASSO A PASSO PARA APLICAR:

### **1. Acesse Facebook Ads Manager:**
```
https://business.facebook.com/adsmanager
```

### **2. Editar Campanha Existente:**
```
Selecione campanha ? Editar
?
Role at? "Acompanhamento"
?
Expanda "Par?metros de URL"
?
Cole o padr?o escolhido (Op??o A ou B)
?
Salvar
```

### **3. Para Novas Campanhas:**
```
Criar campanha ? Preencher tudo
?
Na etapa de "An?ncio"
?
Se??o "Acompanhamento"
?
"Par?metros de URL"
?
Cole o padr?o
?
Publicar
```

### **4. Template de Campanha (Recomendado):**
```
Crie 1 campanha com par?metros corretos
?
Use "Duplicar campanha" para as pr?ximas
?
Par?metros j? v?m preenchidos!
```

---

## ?? O QUE VOC? DEVE MUDAR (Urgente):

### **? REMOVA ISSO (Atual):**
```
utm_source=FB
utm_medium={{adset.name}}|{{adset.id}}
```

### **? SUBSTITUA POR (Op??o A):**
```
utm_source=facebook
utm_medium=cpc
(+ fb_adset_name={{adset.name}}&fb_adset_id={{adset.id}})
```

---

## ?? IMPACTO DA CORRE??O:

### **ANTES (seu atual):**
```
Google Analytics:
Medium: Publico_A|123 ? 10 convers?es
Medium: Publico_B|456 ? 8 convers?es
Medium: Publico_C|789 ? 12 convers?es

? Cada ad set = medium diferente
? N?o consegue agrupar
? Relat?rios quebrados
```

### **DEPOIS (corrigido):**
```
Google Analytics:
Source: facebook | Medium: cpc ? 30 convers?es

Filtros dispon?veis:
?? Campaign: Lancamento|123 ? 15 convers?es
?? Campaign: Retargeting|456 ? 10 convers?es
?? Campaign: BlackFriday|789 ? 5 convers?es

Custom dimensions (fb_*):
?? AdSet: Publico_A (ID: 123) ? 10 convers?es
?? AdSet: Publico_B (ID: 456) ? 8 convers?es
?? AdSet: Publico_C (ID: 789) ? 12 convers?es

? Relat?rios perfeitos!
? An?lise completa!
```

---

## ?? EXEMPLO PR?TICO:

### **URL que o cliente vai acessar:**

**ANTES (seu atual):**
```
https://www.maracujazeropragas.com/?
utm_source=FB&
utm_medium=Publico_Amplo_Interesse|987654321&
utm_campaign=Lancamento_Maracuja|123456789&
utm_content=Video_Pragas_V1|555666777&
utm_term=facebook_feed
```

**DEPOIS (Op??o A recomendada):**
```
https://www.maracujazeropragas.com/?
utm_source=facebook&
utm_medium=cpc&
utm_campaign=Lancamento_Maracuja|123456789&
utm_content=Video_Pragas_V1|555666777&
utm_term=facebook_feed&
fb_adset_name=Publico_Amplo_Interesse&
fb_adset_id=987654321
```

---

## ? CHECKLIST DE IMPLEMENTA??O:

### **Depois de aplicar no Facebook Ads:**

- [ ] Teste com 1 an?ncio primeiro (n?o altere todos de uma vez)
- [ ] Acesse site via an?ncio de teste
- [ ] Verifique console (F12): UTMs capturados
- [ ] Preencha formul?rio ? v? pro checkout
- [ ] Verifique Events Manager ? Purchase com UTMs
- [ ] Se funcionar ? Aplique em todas as campanhas

---

## ?? RESULTADO ESPERADO:

### **Ap?s aplicar:**

1. **Google Analytics:**
   - Source/Medium agrupam corretamente
   - Relat?rios limpos
   - F?cil de analisar

2. **Meta Events Manager:**
   - Attribution perfeita
   - CBO otimiza melhor
   - Sabe exatamente qual an?ncio converte

3. **Seu Sistema:**
   - Captura tudo automaticamente
   - Salva no Vercel KV
   - Purchase com attribution completa

---

## ?? SUPORTE (Se precisar):

### **Documenta??o Facebook:**
- URL Parameters: https://www.facebook.com/business/help/1016122818401732

### **Documenta??o Google Analytics:**
- UTM Builder: https://ga-dev-tools.google/campaign-url-builder/

---

## ?? TEMPLATE FINAL (COPIE E COLE):

### **? OP??O A - RECOMENDADO:**

```
utm_source=facebook&utm_medium=cpc&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}&fb_adset_name={{adset.name}}&fb_adset_id={{adset.id}}
```

**COLE NO CAMPO "PAR?METROS DE URL" DO FACEBOOK ADS!**

---

## ?? LEMBRETE:

**AP?S VOC? APLICAR NO FACEBOOK ADS:**

Eu vou te lembrar de:
1. ? Testar com 1 an?ncio
2. ? Verificar se captura corretamente
3. ? Validar no Events Manager
4. ? Aplicar em todos os an?ncios

**Nosso c?digo j? est? 100% preparado!** ?

---

## ?? RESUMO:

### **O que voc? tinha:**
```
utm_source=FB ?
utm_medium={{adset.name}}|{{adset.id}} ? CR?TICO!
```

### **O que voc? vai usar:**
```
utm_source=facebook ?
utm_medium=cpc ? CORRIGIDO!
fb_adset_name={{adset.name}} ? Separado
fb_adset_id={{adset.id}} ? Separado
```

---

**Salve esse arquivo! Quando for configurar Facebook Ads, ? s? copiar e colar!** ???

**Deploy feito! C?digo 100% preparado!** ??
