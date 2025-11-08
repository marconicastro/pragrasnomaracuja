/**
 * 🎯 Sistema de Fila de Eventos - Garantia de Ordem e Timing
 * 
 * Conforme padrão Facebook/Stape CAPIG:
 * 1. PageView (primeiro, sempre)
 * 2. ViewContent (após PageView)
 * 3. ScrollDepth (após ViewContent ou simultâneo, mas ordenado)
 * 4. AddToCart (quando necessário)
 * 5. Lead (CRÍTICO - aguarda dados persistirem)
 * 6. InitiateCheckout (CRÍTICO - delay mínimo após Lead para não perder dados)
 * 
 * Garante que eventos cheguem na ordem correta na CAPIG e Meta.
 */

type EventType = 'PageView' | 'ViewContent' | 'ScrollDepth' | 'AddToCart' | 'Lead' | 'InitiateCheckout' | 'InputData' | 'CTAClick';

interface QueuedEvent {
  type: EventType;
  fn: () => Promise<any>;
  priority: number; // Menor = maior prioridade
  requiredBefore?: EventType[]; // Eventos que devem ter sido enviados antes
  minDelayAfter?: EventType; // Delay mínimo após outro evento
  minDelayMs?: number; // Delay mínimo em ms
}

class EventQueue {
  private queue: QueuedEvent[] = [];
  private sentEvents: Set<EventType> = new Set();
  private processing = false;
  private lastEventTime: Map<EventType, number> = new Map();

  /**
   * Prioridades dos eventos (menor = maior prioridade)
   */
  private priorities: Record<EventType, number> = {
    PageView: 1,
    ViewContent: 2,
    ScrollDepth: 3,
    CTAClick: 3,
    AddToCart: 4,
    InputData: 5,
    Lead: 6,
    InitiateCheckout: 7
  };

  /**
   * Requisitos de ordem (evento só pode ser enviado após esses)
   */
  private requirements: Record<EventType, EventType[]> = {
    PageView: [],
    ViewContent: ['PageView'],
    ScrollDepth: ['PageView'],
    CTAClick: ['PageView'],
    AddToCart: ['PageView'],
    InputData: ['PageView'],
    Lead: ['PageView'], // Lead pode vir depois de PageView, mas idealmente após ViewContent
    InitiateCheckout: ['Lead'] // CRÍTICO: InitiateCheckout SEMPRE após Lead
  };

  /**
   * Delays mínimos após eventos específicos (em ms)
   */
  private delaysAfter: Record<EventType, { after: EventType; delay: number }[]> = {
    PageView: [],
    ViewContent: [{ after: 'PageView', delay: 500 }], // 500ms após PageView
    ScrollDepth: [{ after: 'PageView', delay: 500 }],
    CTAClick: [{ after: 'PageView', delay: 500 }],
    AddToCart: [],
    InputData: [],
    Lead: [{ after: 'PageView', delay: 1000 }], // 1s após PageView para garantir dados carregados
    InitiateCheckout: [{ after: 'Lead', delay: 2000 }] // CRÍTICO: 2s após Lead para garantir dados salvos
  };

  /**
   * Adiciona evento à fila
   */
  async enqueue(
    type: EventType,
    fn: () => Promise<any>,
    options?: {
      minDelayMs?: number;
      skipQueue?: boolean;
    }
  ): Promise<any> {
    // Se skipQueue, enviar imediatamente (útil para PageView inicial)
    if (options?.skipQueue && type === 'PageView') {
      const result = await fn();
      this.sentEvents.add(type);
      this.lastEventTime.set(type, Date.now());
      console.log(`✅ ${type} enviado imediatamente (skipQueue)`);
      return result;
    }

    const event: QueuedEvent = {
      type,
      fn,
      priority: this.priorities[type],
      requiredBefore: this.requirements[type],
      minDelayMs: options?.minDelayMs
    };

    // Verificar delays específicos
    const delaysConfig = this.delaysAfter[type];
    if (delaysConfig && delaysConfig.length > 0) {
      for (const delayConfig of delaysConfig) {
        const lastTime = this.lastEventTime.get(delayConfig.after);
        if (lastTime) {
          const timeSinceLast = Date.now() - lastTime;
          const remainingDelay = delayConfig.delay - timeSinceLast;
          if (remainingDelay > 0) {
            event.minDelayMs = Math.max(event.minDelayMs || 0, remainingDelay);
          }
        }
      }
    }

    this.queue.push(event);
    this.queue.sort((a, b) => a.priority - b.priority);

    console.log(`📋 ${type} adicionado à fila (prioridade: ${event.priority})`);

    // Processar fila se não estiver processando
    if (!this.processing) {
      this.processQueue();
    }

    // Aguardar evento ser processado (retornar quando completar)
    return new Promise((resolve) => {
      const checkProcessed = setInterval(() => {
        if (this.sentEvents.has(type)) {
          clearInterval(checkProcessed);
          resolve(true);
        }
      }, 100);
    });
  }

  /**
   * Processa a fila de eventos em ordem
   */
  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      // Ordenar fila novamente antes de processar (caso eventos foram reinseridos)
      this.queue.sort((a, b) => a.priority - b.priority);
      
      const event = this.queue.shift();
      if (!event) break;

      // Verificar se eventos requeridos já foram enviados
      if (event.requiredBefore && event.requiredBefore.length > 0) {
        const missingRequirements = event.requiredBefore.filter(
          req => !this.sentEvents.has(req)
        );

        if (missingRequirements.length > 0) {
          console.warn(`⏳ ${event.type} aguardando eventos:`, missingRequirements);
          // Reinserir no início da fila (mantém prioridade)
          this.queue.unshift(event);
          await this.delay(500); // Aguardar 500ms antes de tentar novamente
          continue;
        }
      }

      // Verificar delay mínimo após eventos específicos
      const delaysConfig = this.delaysAfter[event.type];
      if (delaysConfig && delaysConfig.length > 0) {
        for (const delayConfig of delaysConfig) {
          const lastTime = this.lastEventTime.get(delayConfig.after);
          if (lastTime) {
            const timeSinceLast = Date.now() - lastTime;
            const remainingDelay = delayConfig.delay - timeSinceLast;
            if (remainingDelay > 0) {
              console.log(`⏱️ ${event.type} aguardando ${remainingDelay}ms após ${delayConfig.after}...`);
              await this.delay(remainingDelay);
            }
          }
        }
      }

      // Verificar delay mínimo geral
      if (event.minDelayMs && event.minDelayMs > 0) {
        console.log(`⏱️ ${event.type} aguardando ${event.minDelayMs}ms...`);
        await this.delay(event.minDelayMs);
      }

      try {
        console.log(`🚀 Processando ${event.type}...`);
        const result = await event.fn();
        this.sentEvents.add(event.type);
        this.lastEventTime.set(event.type, Date.now());
        console.log(`✅ ${event.type} enviado com sucesso`);
      } catch (error) {
        console.error(`❌ Erro ao processar ${event.type}:`, error);
        // Não reinserir - deixar passar para próximo evento
      }
    }

    this.processing = false;
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Verifica se um evento já foi enviado
   */
  hasSent(type: EventType): boolean {
    return this.sentEvents.has(type);
  }

  /**
   * Limpa a fila (útil para testes ou reset)
   */
  clear() {
    this.queue = [];
    this.sentEvents.clear();
    this.lastEventTime.clear();
    this.processing = false;
  }
}

// Singleton instance
export const eventQueue = new EventQueue();

// Exportar instância para verificação externa
export { EventQueue };

/**
 * Helper para adicionar evento à fila de forma simples
 */
export async function queueEvent(
  type: EventType,
  fn: () => Promise<any>,
  options?: { minDelayMs?: number; skipQueue?: boolean }
): Promise<any> {
  return eventQueue.enqueue(type, fn, options);
}

