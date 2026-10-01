# Terra Santa — Registro vivo SpecDrive

Versão de implementação: 1.0. Data: 2026-10-01. Documentos 01–04 permanecem normativos.

## D-001 — Workspace e origem (TS-0001)

O workspace começou vazio, apenas com `work/` e `outputs/`. Nenhuma stack ou alteração do usuário foi encontrada. Não há repositório Git nem AGENTS.md no workspace ou ancestrais examinados. Node 24.15.0 e npm 11.12.1 estão disponíveis. O pacote foi encontrado em `../bo/outputs/terra-santa-spec` e copiado para `specs/`, preservando a origem. Será criado repositório local para versionar a especificação e a implementação.

Evidência: inventário do workspace e leitura integral de README, 01, 02, 03 e 04, nessa ordem, antes de editar. Os únicos ativos copiados são as duas fontes indicadas no README.

## D-002 — Referências (TS-0002)

Logo inspecionada: composição quadrada; árvore orgânica terracota, serifada editorial em grafite e fundo marfim. Usar fonte original preservada e derivadas otimizadas. Paleta dos tokens de 02 permanece apropriada.

Planta inspecionada: imagem horizontal com três espaços de dormir aparentes, dois sanitários aparentes, área social/cozinha e vegetação. Tudo isso é inferência visual, não informação comercial. A associação à Casa 2 continua não confirmada. Será exibida separadamente como “Referência recebida · associação a confirmar”, dentro da exploração da Casa 2, jamais como planta confirmada. A Casa 1 terá esquema conceitual coerente com seus fatos confirmados, sem medidas.

Referência https://landonorris.com/ inspecionada no navegador: composição fullscreen, tipografia grande, objeto central em profundidade, contornos topográficos, recortes e colagem editorial. Transferir esses comportamentos, com ritmo mais calmo e cores Terra Santa; nenhum ativo dessa referência será reutilizado.

## D-003 — Camada visual e arquitetura (antes de TS-0101)

Implementar React/TypeScript/Vite, CSS por tokens, Context/estado de sessão, Vitest e Playwright. Camada C: cena SVG procedimental projetada em perspectiva, com ângulo e construção controlados, planta aberta e atmosfera. Não depende de WebGL; é também o fallback universal. Renderizações conceituais opcionais complementam os ambientes e a galeria. Modelos, proporções, implantação, materiais e renderizações são placeholders substituíveis. A interface os identifica como estudo conceitual, sem medidas ou promessas arquitetônicas.

Abertura: animação até 3,2 s, ações Explorar/Pular disponíveis imediatamente. Navegação essencial também por botões e controles range nativos; gestos são opcionais. Apenas ativos leves de marca/território no primeiro carregamento; exploração e imagens detalhadas após intenção.

Recomendação: favorito ativo +5, comparação distinta +2, hotspot distinto +1, retorno +2, permanência de 15 s +1 (máximo 3 por modelo), diferencial selecionado +2 e afinidade de tags +2 por tag distinta. Sem sinais suficientes: convite à exploração. Desfavoritar remove contribuição do favorito; repetição não acumula favoritos/comparações/hotspots/diferenciais. Empate por exploração e depois ordem estável. Armazenamento local de sessão, nenhuma transmissão.

## D-004 — Definições de pronto e verificação antes de implementar

Todas as tarefas de 04 mantêm suas definições originais. Para as que apenas apontavam requisitos, explicitar abaixo o critério verificável. A conclusão só será marcada após teste e QA. As relações NFR/MOT/AC aplicam-se também às tarefas de conteúdo e fundação.

| Tarefa | Requisitos relacionados | Definição de pronto / teste |
|---|---|---|
| TS-0003 | FR-013, AC-006 | 4 registros centrais com confiança e ausência de medidas inventadas; teste de dados |
| TS-0101 | AC-005 | npm install, lint, test e build aprovados |
| TS-0102 | NFR-009, MOT-004 | tokens únicos para cores/tempos/espaçamento e contraste AA |
| TS-0103 | AC-002/003/004/007, NFR-006/007/010 | shell, menu e sessão funcionais sem overflow nos dois viewports; TST-007 |
| TS-0201 | FR-001, NFR-001/003/008 | logo original preservada; marca nítida na abertura e cabeçalho |
| TS-0202 | FR-005, AC-006, NFR-002/003/008 | referência sem distorção, alternativa textual e associação incerta |
| TS-0203 | FR-003/004/005/006, AC-006 | hero, ângulos, topo, etapas e quatro ambientes coerentes; TST-002/003 |
| TS-0204 | FR-002/013, AC-006 | quatro silhuetas distintas e selecionáveis; TST-001 |
| TS-0301 | FR-001, MOT-001/004/006, AC-007 | abertura pulável e livre em até 4 s; TST-001 |
| TS-0302 | FR-002, MOT-003, AC-002/003 | quatro modelos acessíveis em composição espacial; TST-001 |
| TS-0303 | FR-003, MOT-001/005 | terreno/planta/estrutura/residência nos dois sentidos; TST-002 |
| TS-0304 | FR-004, MOT-003/005, NFR-007 | ângulos reversíveis e zoom limitado por controles e arrasto |
| TS-0305 | FR-005/006, NFR-008 | topo aberto, referência provisória e quatro hotspots da piloto; TST-003 |
| TS-0306 | FR-007, AC-002 | dia/entardecer altera cena e iluminação |
| TS-0307 | MOT-002/003/004/006, AC-003/004 | colagem editorial, máscaras e até três níveis de parallax; QA |
| TS-0401 | FR-008, NFR-006 | favoritos toggle persistidos na sessão e afetam pontuação; TST-004 |
| TS-0402 | FR-009, AC-006 | dois modelos, fatos confiáveis e demais a confirmar; TST-004 |
| TS-0403 | FR-010, AC-006 | sinais locais de abertura, tempo e diferenciais; TST-005/006 |
| TS-0404 | FR-011, AC-007 | explicação com 2–3 sinais quando disponíveis, empate e estado vazio; TST-005 |
| TS-0405 | FR-012, AC-002/007 | confirmação simulada, nenhum dado transmitido |
| TS-0406 | FR-014 | limpa sessão/favoritos/sinais e retorna território; TST-006 |
| TS-0501 | MOT-006, NFR-005 | redução de movimento elimina complexidade; TST-008 |
| TS-0502 | FR-004, NFR-004/007 | fluxo completo com WebGL indisponível; TST-008 |
| TS-0503 | NFR-006/007/008/009/010 | controles 44 px, nomes, foco, teclado e contraste; auditoria axe |
| TS-0504 | NFR-001/002/003/004/005 | lazy chunks/imagens WebP/fallback e animação adaptativa |
| TS-0505 | AC-001/002/005/006/007 | TST-001 a 008 aprovados e evidência registrada |
| TS-0506 | AC-003/004 | screenshots de estados importantes mobile/desktop inspecionadas |
| TS-0601 | FR-013 | README com execução e conteúdo central |
| TS-0602 | AC-006 | lista explícita de provisórios e perguntas ao cliente |
| TS-0603 | AC-007 | preview funcional aberto e pacote entregue |

## D-005 — Parâmetros substituíveis de representação

Antes da implementação de TS-0003, estender Residence.features com livingRoom e kitchen (booleanos com confiança; somente Casa 1 confirmada). Acrescentar visual { layout: compact/linear/courtyard/split, roof: gable/flat/mono, tone: sand/ivory/terracotta/leaf } como parâmetros gráficos, sem unidades e sem correspondência a arquitetura aprovada. assetMetadata conserva confiança e origem. Tags luz/contemplação/convivência/natureza são interesses exploratórios de cenas conceituais, não diferenciais comerciais confirmados. Media procedural pode apontar identificadores internos; fotos conceituais compartilhadas nunca são apresentadas como documentação dos outros modelos.

## Evidências de conclusão

- TS-0001: inventário acima; cópias novas, origem sem alteração.
- TS-0002: inspeção visual dos dois arquivos por view_image e screenshot da referência no navegador; observações em D-002.
- Demais tarefas: pendentes de implementação, teste e QA.
