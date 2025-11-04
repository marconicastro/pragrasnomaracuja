const fs = require('fs');

// GA4 Measurement ID
const GA4_MEASUREMENT_ID = 'G-7DRG46JMBH';

// ===== FUNÇÕES AUXILIARES =====

function generateId() {
  return Math.floor(Math.random() * 1000000).toString();
}

function getNextVariableId(variables) {
  if (!variables || variables.length === 0) return '1';
  const maxId = Math.max(...variables.map(v => parseInt(v.variableId) || 0));
  return (maxId + 1).toString();
}

function getNextTagId(tags) {
  if (!tags || tags.length === 0) return '1';
  const maxId = Math.max(...tags.map(t => parseInt(t.tagId) || 0));
  return (maxId + 1).toString();
}

// ===== ADICIONAR GA4 AO WEB CONTAINER =====

function addGA4ToWebContainer() {
  console.log('\n📦 Processando Web Container...');
  
  const container = JSON.parse(fs.readFileSync('GTM-WCDP2ZLH_workspace10.json', 'utf8'));
  const version = container.containerVersion;
  
  // 1. Adicionar variável GA4 Measurement ID
  const nextVarId = getNextVariableId(version.variable);
  const ga4VarId = parseInt(nextVarId);
  
  const ga4Variable = {
    "accountId": "6311132475",
    "containerId": "228923953",
    "variableId": ga4VarId.toString(),
    "name": "const - ga4 measurement id",
    "type": "c",
    "parameter": [
      {
        "type": "TEMPLATE",
        "key": "value",
        "value": GA4_MEASUREMENT_ID
      }
    ],
    "fingerprint": Date.now().toString(),
    "parentFolderId": "171" // Settings folder (mesmo da variável meta pixel id)
  };
  
  if (!version.variable) version.variable = [];
  version.variable.push(ga4Variable);
  console.log(`✅ Variável GA4 adicionada: ${ga4VarId}`);
  
  // 2. Criar tags GA4
  const nextTagId = getNextTagId(version.tag);
  let currentTagId = parseInt(nextTagId);
  
  // 2.1. GA4 Configuration Tag
  const ga4ConfigTag = {
    "accountId": "6311132475",
    "containerId": "228923953",
    "tagId": currentTagId.toString(),
    "name": "GA4 - Configuration",
    "type": "GOOGLE_ANALYTICS_GA4_CONFIGURATION",
    "parameter": [
      {
        "type": "TEMPLATE",
        "key": "measurementIdOverride",
        "value": `{{const - ga4 measurement id}}`
      },
      {
        "type": "BOOLEAN",
        "key": "sendPageView",
        "value": "false"
      }
    ],
    "firingTriggerId": ["228"], // dom - page_view trigger
    "tagFiringOption": "ONCE_PER_EVENT",
    "fingerprint": Date.now().toString(),
    "parentFolderId": "185", // Mesma pasta das tags FB
    "monitoringMetadata": {
      "type": "MAP"
    },
    "consentSettings": {
      "consentStatus": "NOT_SET"
    }
  };
  
  version.tag.push(ga4ConfigTag);
  console.log(`✅ GA4 Configuration Tag: ${currentTagId}`);
  currentTagId++;
  
  // 2.2. GA4 Event Tags (uma por evento)
  const events = [
    { name: 'page_view', trigger: '228', folderId: '185' }, // dom - page_view, mesma pasta FB
    { name: 'view_item', trigger: '170', folderId: '185' }, // ce - view_item
    { name: 'add_to_cart', trigger: '205', folderId: '185' }, // ce - add_to_cart
    { name: 'begin_checkout', trigger: '202', folderId: '185' }, // ce - begin_checkout
    { name: 'purchase', trigger: '216', folderId: '185' }, // ce - purchase
    { name: 'generate_lead', trigger: '222', folderId: '185' } // ce - generate_lead
  ];
  
  events.forEach(event => {
    const ga4EventTag = {
      "accountId": "6311132475",
      "containerId": "228923953",
      "tagId": currentTagId.toString(),
      "name": `GA4 - ${event.name}`,
      "type": "GOOGLE_ANALYTICS_GA4_EVENT",
      "parameter": [
        {
          "type": "TEMPLATE",
          "key": "measurementIdOverride",
          "value": `{{const - ga4 measurement id}}`
        },
        {
          "type": "TEMPLATE",
          "key": "eventName",
          "value": event.name
        },
        {
          "type": "LIST",
          "key": "eventParameters",
          "list": event.name === 'purchase' ? [
            {
              "type": "MAP",
              "map": [
                { "type": "TEMPLATE", "key": "name", "value": "transaction_id" },
                { "type": "TEMPLATE", "key": "value", "value": "{{dlv - ecommerce.transaction_id}}" }
              ]
            },
            {
              "type": "MAP",
              "map": [
                { "type": "TEMPLATE", "key": "name", "value": "value" },
                { "type": "TEMPLATE", "key": "value", "value": "{{dlv - ecommerce.value}}" }
              ]
            },
            {
              "type": "MAP",
              "map": [
                { "type": "TEMPLATE", "key": "name", "value": "currency" },
                { "type": "TEMPLATE", "key": "value", "value": "{{dlv - ecommerce.currency}}" }
              ]
            },
            {
              "type": "MAP",
              "map": [
                { "type": "TEMPLATE", "key": "name", "value": "items" },
                { "type": "TEMPLATE", "key": "value", "value": "{{dlv - ecommerce.items}}" }
              ]
            }
          ] : event.name === 'view_item' || event.name === 'add_to_cart' || event.name === 'begin_checkout' ? [
            {
              "type": "MAP",
              "map": [
                { "type": "TEMPLATE", "key": "name", "value": "value" },
                { "type": "TEMPLATE", "key": "value", "value": "{{dlv - ecommerce.value}}" }
              ]
            },
            {
              "type": "MAP",
              "map": [
                { "type": "TEMPLATE", "key": "name", "value": "currency" },
                { "type": "TEMPLATE", "key": "value", "value": "{{dlv - ecommerce.currency}}" }
              ]
            },
            {
              "type": "MAP",
              "map": [
                { "type": "TEMPLATE", "key": "name", "value": "items" },
                { "type": "TEMPLATE", "key": "value", "value": "{{dlv - ecommerce.items}}" }
              ]
            }
          ] : []
        },
        {
          "type": "LIST",
          "key": "userProperties",
          "list": [
            {
              "type": "MAP",
              "map": [
                { "type": "TEMPLATE", "key": "name", "value": "user_id" },
                { "type": "TEMPLATE", "key": "value", "value": "{{dlv - user_data.user_id}}" }
              ]
            },
            {
              "type": "MAP",
              "map": [
                { "type": "TEMPLATE", "key": "name", "value": "email" },
                { "type": "TEMPLATE", "key": "value", "value": "{{dlv - user_data.email_address}}" }
              ]
            },
            {
              "type": "MAP",
              "map": [
                { "type": "TEMPLATE", "key": "name", "value": "phone" },
                { "type": "TEMPLATE", "key": "value", "value": "{{dlv - user_data.phone_number}}" }
              ]
            }
          ]
        }
      ],
      "firingTriggerId": [event.trigger],
      "tagFiringOption": "ONCE_PER_EVENT",
      "fingerprint": Date.now().toString(),
      "monitoringMetadata": {
        "type": "MAP"
      },
      "consentSettings": {
        "consentStatus": "NOT_SET"
      }
    };
    
    ga4EventTag.parentFolderId = event.folderId;
    version.tag.push(ga4EventTag);
    console.log(`✅ GA4 - ${event.name} Tag: ${currentTagId}`);
    currentTagId++;
  });
  
  // Salvar
  fs.writeFileSync('GTM-WCDP2ZLH_workspace10.json', JSON.stringify(container, null, 4));
  console.log('✅ Web Container atualizado!');
  
  return { nextVarId, nextTagId: currentTagId };
}

// ===== ADICIONAR GA4 AO SERVER CONTAINER =====

function addGA4ToServerContainer() {
  console.log('\n📦 Processando Server Container...');
  
  const container = JSON.parse(fs.readFileSync('GTM-W4PGS3LR_workspace6.json', 'utf8'));
  const version = container.containerVersion;
  
  // 1. Adicionar variável GA4 Measurement ID
  const nextVarId = getNextVariableId(version.variable);
  const ga4VarId = parseInt(nextVarId);
  
  const ga4Variable = {
    "accountId": "6311132475",
    "containerId": "229856759",
    "variableId": ga4VarId.toString(),
    "name": "const - ga4 measurement id",
    "type": "c",
    "parameter": [
      {
        "type": "TEMPLATE",
        "key": "value",
        "value": GA4_MEASUREMENT_ID
      }
    ],
    "fingerprint": Date.now().toString(),
    "parentFolderId": "20" // Settings folder
  };
  
  if (!version.variable) version.variable = [];
  version.variable.push(ga4Variable);
  console.log(`✅ Variável GA4 adicionada: ${ga4VarId}`);
  
  // 2. Criar GA4 Event Tag (única, dinâmica)
  const nextTagId = getNextTagId(version.tag);
  
  const ga4EventTag = {
    "accountId": "6311132475",
    "containerId": "229856759",
    "tagId": nextTagId.toString(),
    "name": "GA4 - All Events",
    "type": "GOOGLE_ANALYTICS_GA4_EVENT",
    "parameter": [
      {
        "type": "TEMPLATE",
        "key": "measurementIdOverride",
        "value": `{{const - ga4 measurement id}}`
      },
      {
        "type": "TEMPLATE",
        "key": "eventName",
        "value": "{{Event Name}}"
      },
      {
        "type": "LIST",
        "key": "eventParameters",
        "list": [
          {
            "type": "MAP",
            "map": [
              { "type": "TEMPLATE", "key": "name", "value": "transaction_id" },
              { "type": "TEMPLATE", "key": "value", "value": "{{ed - transaction_id}}" }
            ]
          },
          {
            "type": "MAP",
            "map": [
              { "type": "TEMPLATE", "key": "name", "value": "value" },
              { "type": "TEMPLATE", "key": "value", "value": "{{ed - value}}" }
            ]
          },
          {
            "type": "MAP",
            "map": [
              { "type": "TEMPLATE", "key": "name", "value": "currency" },
              { "type": "TEMPLATE", "key": "value", "value": "{{ed - currency}}" }
            ]
          },
          {
            "type": "MAP",
            "map": [
              { "type": "TEMPLATE", "key": "name", "value": "items" },
              { "type": "TEMPLATE", "key": "value", "value": "{{ed - ecommerce.items}}" }
            ]
          }
        ]
      },
      {
        "type": "LIST",
        "key": "userProperties",
        "list": [
          {
            "type": "MAP",
            "map": [
              { "type": "TEMPLATE", "key": "name", "value": "user_id" },
              { "type": "TEMPLATE", "key": "value", "value": "{{ed - user_id}}" }
            ]
          },
          {
            "type": "MAP",
            "map": [
              { "type": "TEMPLATE", "key": "name", "value": "email" },
              { "type": "TEMPLATE", "key": "value", "value": "{{ed - email_address}}" }
            ]
          },
          {
            "type": "MAP",
            "map": [
              { "type": "TEMPLATE", "key": "name", "value": "phone" },
              { "type": "TEMPLATE", "key": "value", "value": "{{ed - phone_number}}" }
            ]
          },
          {
            "type": "MAP",
            "map": [
              { "type": "TEMPLATE", "key": "name", "value": "city" },
              { "type": "TEMPLATE", "key": "value", "value": "{{ed - city}}" }
            ]
          },
          {
            "type": "MAP",
            "map": [
              { "type": "TEMPLATE", "key": "name", "value": "region" },
              { "type": "TEMPLATE", "key": "value", "value": "{{ed - region}}" }
            ]
          },
          {
            "type": "MAP",
            "map": [
              { "type": "TEMPLATE", "key": "name", "value": "country" },
              { "type": "TEMPLATE", "key": "value", "value": "{{ed - country}}" }
            ]
          }
        ]
      }
    ],
    "firingTriggerId": ["14", "37", "40", "50", "52", "58"], // Todos os triggers de eventos (dc - view_item, dc - purchase, etc)
    "tagFiringOption": "ONCE_PER_EVENT",
    "fingerprint": Date.now().toString(),
    "parentFolderId": "16", // Mesma pasta das tags FB (Meta)
    "monitoringMetadata": {
      "type": "MAP"
    },
    "consentSettings": {
      "consentStatus": "NOT_SET"
    }
  };
  
  if (!version.tag) version.tag = [];
  version.tag.push(ga4EventTag);
  console.log(`✅ GA4 - All Events Tag: ${nextTagId}`);
  
  // Salvar
  fs.writeFileSync('GTM-W4PGS3LR_workspace6.json', JSON.stringify(container, null, 4));
  console.log('✅ Server Container atualizado!');
}

// ===== EXECUTAR =====

console.log('🚀 Adicionando GA4 aos containers GTM...');
console.log(`📊 GA4 Measurement ID: ${GA4_MEASUREMENT_ID}\n`);

try {
  addGA4ToWebContainer();
  addGA4ToServerContainer();
  
  console.log('\n✅ CONCLUÍDO!');
  console.log('\n📋 Resumo:');
  console.log('Web Container:');
  console.log('  - Variável: const - ga4 measurement id');
  console.log('  - Tags: GA4 - Configuration + 6 Event Tags');
  console.log('\nServer Container:');
  console.log('  - Variável: const - ga4 measurement id');
  console.log('  - Tag: GA4 - All Events (única, dinâmica)');
  console.log('\n⚠️ IMPORTANTE:');
  console.log('1. Verifique os trigger IDs no GTM');
  console.log('2. Ajuste parentFolderId se necessário');
  console.log('3. Teste no Preview Mode antes de publicar');
  
} catch (error) {
  console.error('❌ Erro:', error.message);
  process.exit(1);
}

