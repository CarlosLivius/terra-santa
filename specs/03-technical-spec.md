# 03 — Especificação Técnica

## 1. Estratégia

Construir uma aplicação web mobile-first, executável localmente e preparada para publicação como PWA. A arquitetura deve aceitar a substituição progressiva de simulações por modelos 3D reais.

## 2. Stack recomendada

- React + TypeScript;
- Vite;
- React Router apenas se necessário;
- Three.js ou React Three Fiber para cena espacial;
- GSAP/ScrollTrigger ou Framer Motion para narrativa e máscaras;
- Zustand ou Context para estado de sessão;
- CSS Modules, Tailwind ou CSS organizado por tokens;
- Vitest para lógica;
- Playwright para fluxo crítico, se disponível.

Se o workspace já tiver stack definida, preservá-la e adaptar esta especificação.

## 3. Estrutura sugerida

```text
src/
  app/
  components/
  experiences/
    opening/
    territory/
    construction/
    residence-explorer/
    comparison/
    recommendation/
  data/
    residences.ts
  state/
  motion/
  styles/
  assets/
    brand/
    residences/
      casa-1/
      casa-2/
      casa-3/
      casa-4/
  utils/
```

## 4. Modelo de dados

```ts
type Confidence = "confirmed" | "inferred" | "placeholder";

type ResidenceFeature<T> = {
  value: T | null;
  confidence: Confidence;
  source?: string;
};

type ResidenceHotspot = {
  id: string;
  label: string;
  roomType: string;
  position: { x: number; y: number; z?: number };
  image?: string;
  description?: string;
  tags: string[];
};

type Residence = {
  id: "casa-1" | "casa-2" | "casa-3" | "casa-4";
  name: string;
  tagline: string;
  status: Confidence;
  features: {
    bedrooms: ResidenceFeature<number>;
    suites: ResidenceFeature<number>;
    bathrooms: ResidenceFeature<number>;
    parkingSpaces: ResidenceFeature<number>;
    builtAreaM2: ResidenceFeature<number>;
    lotSize: ResidenceFeature<string>;
  };
  lifestyleTags: string[];
  media: {
    hero: string;
    exteriorAngles: string[];
    floorPlan?: string;
    openTop?: string;
    constructionStages: string[];
    interiors: string[];
    model3d?: string;
  };
  hotspots: ResidenceHotspot[];
};
```

Na interface pública, `confidence` não precisa ser exibido. Contudo, valores `inferred` ou `placeholder` não podem ser redigidos como fatos confirmados.

## 5. Estado de sessão

```ts
type PreferenceSignal = {
  residenceId: string;
  type:
    | "view"
    | "favorite"
    | "hotspot-open"
    | "feature-focus"
    | "compare"
    | "time-spent";
  key?: string;
  weight: number;
  timestamp: number;
};
```

Persistir somente em memória ou `sessionStorage` durante o protótipo.

## 6. Recomendação

Usar uma pontuação determinística e explicável.

Exemplo inicial:

- favorito: +5;
- residência comparada: +2;
- hotspot aberto: +1;
- retorno à mesma residência: +2;
- permanência relevante: +1;
- correspondência entre tag explorada e tag da residência: +2.

Em empate, recomendar a residência mais explorada. Se não houver sinais suficientes, convidar o usuário a explorar mais em vez de inventar certeza.

## 7. Camada 3D

### Nível A — Modelo real

Usar GLB/GLTF otimizado, Draco/Meshopt quando aplicável, texturas WebP/AVIF e carregamento progressivo.

### Nível B — Modelo procedimental

Criar volumes simplificados a partir de proporções conceituais. O resultado deve ser apresentado como experiência visual, não como documentação executiva.

### Nível C — Pseudo-3D

Usar sequência de ângulos, parallax, sprites e máscaras. Deve existir fallback estático para dispositivos sem WebGL.

## 8. Desempenho

### NFR-001

Carregar inicialmente apenas abertura, identidade e miniatura do território.

### NFR-002

Carregar ativos detalhados de uma residência somente após intenção do usuário.

### NFR-003

Imagens responsivas em WebP/AVIF, mantendo fallback quando necessário.

### NFR-004

Evitar mais de uma cena WebGL pesada ativa simultaneamente.

### NFR-005

Manter interação fluida em celular intermediário; reduzir efeitos automaticamente quando a taxa de quadros cair ou quando houver preferência de redução de movimento.

## 9. Acessibilidade

### NFR-006

Todo controle possui nome acessível e estado perceptível.

### NFR-007

Todas as funções essenciais são utilizáveis sem gesto complexo obrigatório.

### NFR-008

Imagens informativas têm texto alternativo; imagens decorativas não poluem leitores de tela.

### NFR-009

Contraste atende WCAG AA para textos e controles essenciais.

### NFR-010

O foco do teclado é visível em desktop.

## 10. Segurança e privacidade

- Não transmitir dados no protótipo;
- não incluir telefone real sem confirmação;
- não carregar trackers;
- não solicitar localização;
- não afirmar análise por IA;
- não incorporar segredos no frontend.

## 11. Telemetria futura

Preparar eventos sem ativar serviço externo:

- `experience_started`;
- `residence_opened`;
- `construction_completed`;
- `hotspot_opened`;
- `residence_favorited`;
- `comparison_opened`;
- `recommendation_viewed`;
- `interest_clicked`.

## 12. Testes mínimos

### TST-001

Abrir, pular a introdução e selecionar cada residência.

### TST-002

Concluir a construção da casa-piloto nos dois sentidos.

### TST-003

Abrir todos os hotspots da casa-piloto.

### TST-004

Favoritar, comparar e desfavoritar.

### TST-005

Gerar recomendação com sinais e testar estado sem sinais.

### TST-006

Reiniciar sessão e confirmar limpeza.

### TST-007

Validar viewport mobile e desktop.

### TST-008

Validar `prefers-reduced-motion` e fallback sem WebGL.
