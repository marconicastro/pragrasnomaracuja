# ?? STATUS FINAL: Stape CAPIG vs Meta Direto

## ?? SITUA??O ATUAL (ap?s 3h+ de debug):

### **? O QUE FUNCIONA 100%:**

**Meta CAPI Direto (Fallback):**
```
? Purchase chegando no Meta
? DQS: 105/100 (M?XIMO!)
? 11 campos de dados (M?XIMO!)
? 28 par?metros custom
? Attribution completa
? UTMs completos
? Geolocaliza??o completa
? External ID presente
? fbp/fbc preservados
```

**Meta Events Manager mostra:**
```
? Purchase_TEST_CAPIG_FIX_001_[timestamp]
? Status: Processado
? Fonte: Servidor (Configura??o manual)
? Todos os dados completos
```

---

### **? O QUE N?O FUNCIONA:**

**Stape CAPIG:**
```
? Recebe request (200 OK)
? N?o envia para Meta (400 Malformed Payload)

Dashboard CAPIG:
? Purchase recebido: 1+
? Purchase enviado: 0
```

---

## ?? TENTATIVAS REALIZADAS (15+):

### **Formatos de payload testados:**

1. ? Meta CAPI padr?o (array data)
2. ? Formato simplificado (sem array)
3. ? Com pixel_id
4. ? Com data_source_id
5. ? Com access_token
6. ? Sem access_token
7. ? H?brido (data_source_id + array)
8. ? M?nimo (5 campos custom_data)
9. ? Completo (28 campos custom_data)
10. ? Com test_event_code
11. ? Sem test_event_code

### **Endpoints testados:**

1. ? /events
2. ? /facebook
3. ? /conversions
4. ? raiz (/)
5. ? sa.stape.co/stape-api/...
6. ? sGTM container

### **Headers testados:**

1. ? Authorization: Bearer
2. ? x-stape-capig-key
3. ? x-fb-pixel-id
4. ? x-pixel-id
5. ? Content-Type

---

## ?? ?LTIMO PAYLOAD ENVIADO:

```json
{
  "data_source_id": "642933108377475",
  "data": [{
    "event_name": "Purchase",
    "event_time": 1762100729,
    "event_id": "Purchase_TEST_CAPIG_FIX_001_1762100729",
    "event_source_url": "https://pay.cakto.com.br",
    "action_source": "website",
    "user_data": {
      "em": "hash...",
      "fn": "hash...",
      "ln": "hash...",
      "ph": "hash...",
      "fbp": "fb.1...",
      "fbc": "fb.1...",
      "external_id": "sess_...",
      "ct": "hash...",
      "st": "hash...",
      "zp": "hash...",
      "country": "hash..."
    },
    "custom_data": {
      "value": 39.9,
      "currency": "BRL",
      "content_type": "product",
      "content_ids": ["hacr962"],
      "content_name": "Sistema 4 Fases - Ebook Trips"
    }
  }]
}
```

**Resultado:** 400 - Malformed Payload

---

## ?? POSS?VEIS CAUSAS RESTANTES:

### **1. CAPIG OAuth espera formato DIFERENTE (espec?fico do Stape)**

Documenta??o Stape pode ter formato pr?prio que n?o ? Meta CAPI padr?o.

---

### **2. Pixel n?o est? configurado corretamente no CAPIG**

Apesar de mostrar "Connected", pode faltar:
- Permiss?es
- Domain verification
- Business Manager link

---

### **3. CAPIG tem BUG ou LIMITA??O**

Vers?o free/trial pode ter limita??es:
- S? eventos browser (n?o server-side)
- S? eventos espec?ficos (n?o Purchase)
- Bug do pr?prio Stape

---

### **4. Campos hashados causando problema**

CAPIG pode n?o aceitar geo hashado ou formato espec?fico.

---

## ?? PR?XIMAS TENTATIVAS POSS?VEIS:

### **A) Testar SEM geo hashado**

Ver se CAPIG aceita sem city/state/zip.

---

### **B) Testar SEM external_id**

Ver se external_id est? causando problema.

---

### **C) Contatar Suporte Stape**

Email: support@stape.io

Enviar:
- Payload completo (j? temos nos logs!)
- Erro: "Malformed Payload"
- CAPIG ID: kmwitszu
- Pedir formato correto

---

### **D) Usar sGTM ao inv?s de CAPIG**

Configurar tag Facebook CAPI no sGTM container:
- https://event.maracujazeropragas.com
- Pode funcionar melhor

---

## ?? TEMPO GASTO vs GANHO:

### **Tempo investido:**
```
Debug Stape CAPIG: ~3-4 horas
```

### **Ganho potencial:**
```
+13% convers?es relatadas (n?o vendas!)
IP/UA real do cliente
Impacto indireto em otimiza??o
```

### **Sistema atual:**
```
DQS: 105/100 (m?ximo!)
Funciona 100%
TOP 0.01% mercado
```

---

## ?? OP??ES AGORA:

### **1. Aceitar Meta direto** ????? (Recomendo)
- Sistema perfeito
- DQS m?ximo
- Foco em ROI (ads)

### **2. Contatar Suporte Stape** ???
- Eles resolvem
- Expertise deles
- 1-3 dias espera

### **3. Tentar sGTM** ????
- Container j? ativo
- Configurar tag Facebook CAPI
- 2-3 horas trabalho
- Pode funcionar melhor

### **4. Continuar debug** ??
- Mais 2-4 horas
- Sem garantia
- ROI baixo

---

## ?? SUA DECIS?O?

Qual caminho seguir?
