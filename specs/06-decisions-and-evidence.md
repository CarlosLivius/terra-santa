# Terra Santa — Registro vivo SpecDrive

## D-014 — Cinco estados de imagem/overlay e scroll contínuo da Casa 1 (2026-10-02)

### Ajuste solicitado antes da simplificação da página

A Casa 1 passa a priorizar exclusivamente o objeto espacial/underlay e sua construção pelo scroll. Remover desta página favoritos, ambiente/modal, preferências, galeria, comparação e recomendação; essas funções permanecem disponíveis nas outras partes do protótipo. A cena ocupa o maior elemento do viewport. Permanecem retorno ao território, progresso nativo, dois botões de etapa e cobertura removível, com labels discretos. O gate deste ajuste verifica a transformação e seus cinco estados, não atribui conclusão aos demais requisitos globais.

Antes de alterar a implementação, estender D-011 para cinco estados substituíveis: planta recebida (0%), paredes (25%), aberturas (50%), cobertura (75%) e casa no terreno (100%). A cena dedicada mantém a proporção horizontal da imagem e sobrepõe segmentos rastreados visualmente, em coordenadas normalizadas sem escala. O desenho recebido é um underlay, não uma confirmação comercial de cômodos ou medidas; o aviso permanece visível. A geometria, as fontes e os textos dos capítulos ficam em `src/data/pilotSequence.ts`.

O scroll interpola continuamente entre os centros dos cinco capítulos e reverte ao subir. Botões e range nativo também controlam o mesmo progresso. O teto pode ser ocultado após a conclusão; ambiente, atmosfera, comparação e recomendação permanecem funcionais. A camada SVG é o fallback sem WebGL e poderá ser substituída por imagens renderizadas de Blender. Esta integração não certifica nem conclui o arquivo Blender de D-013.

Requisitos: FR-003/005/006/007/013; MOT-001/005/006; NFR-006/007/008; AC-003/004/005/006. Tarefas: TS-0303/0305/0502/0506. DoD adicional: cinco overlays observáveis, progresso intermediário e reversão por scroll em mobile/desktop, build aprovado, ausência de overflow e captura dos cinco estados. Evidência será registrada após execução, sem marcar conclusão antecipada.

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

## D-006 — Detalhamento de sinais e mídia

O campo de origem/confiança das imagens chama-se mediaMetadata. O limiar suficiente da recomendação é favorito ativo, retorno deliberado, comparação, diferencial ou dois sinais substantivos; abertura inicial ou um único ambiente não bastam. O favorito isolado tem uma explicação; são mostrados até três sinais quando disponíveis. Selecionar um interesse é uma escolha de sessão concluída (controle fica selecionado e desabilitado), sem fingir alternância. Para remover todos os interesses, reiniciar a sessão.

Cinco imagens foram geradas pelo recurso integrado com um prompt comum: fotografia arquitetônica editorial, casa térrea modesta brasileira, paredes marfim, pedra areia, madeira, terracota e vegetação; luz natural quente; sem textos, pessoas, marcas, medidas ou luxo ostensivo. Variantes: exterior 3:2 com telhado inclinado e jardim, sala 2:3 com sofá de linho, cozinha 2:3 compacta, quarto 2:3 com cama de casal, banheiro 2:3 com bancada simples. Todas são estudos conceituais, não fotografias dos modelos reais. Arquivos finais `public/assets/concept-{exterior,living,kitchen,bedroom,bath}.webp`, versões responsivas e fallback JPEG. A fachada é inspiração de atmosfera; a cena procedimental continua como representação de ângulos coerentes.

## D-008 — QA do piloto e composição dos hotspots

Inspeção em 390 × 844 mostrou que os quatro hotspots ficam muito próximos no exterior. Exibir hotspots na planta aberta, com geometria ampliada e cena imóvel; a galeria oferece acesso alternativo aos mesmos ambientes. Isso mantém FR-006 e NFR-007 com áreas de toque de 44 px. O exterior fica livre para contemplação e rotação. Ajustar o posicionamento do quarto modelo no território para preservar separação entre etiqueta e rodapé.

## Evidências de conclusão

- TS-0001: inventário acima; cópias novas, origem sem alteração.
- TS-0002: inspeção visual dos dois arquivos por view_image e screenshot da referência no navegador; observações em D-002.
- Demais tarefas: pendentes de implementação, teste e QA.

## D-007 — Mídia responsiva e preparação reprodutível (antes de TS-0203)

Para atender NFR-002/003/008 e TS-0203/0504, centralizar as fontes de imagens conceituais em `src/data/imageSources.ts`: cada entrada define `src` WebP, `srcSet` de larguras 400/700/1100 e `fallback` JPEG. `ConceptImage` usa `picture/source` WebP com alternativa JPEG e recebe texto alternativo e carregamento preguiçoso ou prioritário; não contém informações arquitetônicas.

O script `scripts/prepare-assets.mjs` transforma tecnicamente as cinco fontes preservadas em `work/concept-*-source.png`, mantém dimensões proporcionais e gera versões WebP até 1100 px de largura, além de JPEG. Marca e planta continuam derivadas das fontes originais preservadas em `src/assets`. A árvore recortada recebe transparência técnica somente no fundo claro uniforme, por distância à cor de fundo e borda suave; os traços originais não são redesenhados. As fontes conceituais podem ser omitidas no pacote de entrega se todas as derivadas correspondentes já existirem; uma derivada incompleta provoca erro claro. Formatos e dimensões são otimização técnica com Sharp. A validação registra formato, largura, altura e tamanho de cada ativo; conclusão ainda depende de QA visual da integração.

`npm run assets -- <pasta-de-fontes-conceituais>` permite indicar outra pasta de fontes; a pasta padrão é `work/`. Isso também permite verificar o modo de entrega com fontes conceituais ausentes e derivados completos, sem mover nem apagar os arquivos originais.

Evidência técnica de D-007 em 2026-10-01: `npm run assets` aprovado, 28 derivados lidos e validados por Sharp. As cinco imagens têm WebP 400/700/1100 e JPEG: WebP 400 entre 24.970–36.586 bytes, WebP 700 entre 74.526–102.470 bytes, WebP 1100 entre 183.694–240.920 bytes; JPEG entre 189.330–269.379 bytes. Exterior final 1100 × 733, interiores 1100 × 1650. Árvore 420 × 320, WebP com alfa, 80.222 bytes. As cinco imagens e a árvore composta sobre marfim foram inspecionadas visualmente: proporções preservadas, materiais e luz coerentes; sem texto embutido ou retângulo no recorte da árvore. `npm run assets -- work/absent-source-validation` também aprovado: cinco fontes opcionais ausentes, todos os derivados mantidos e verificados. ESLint focal de ConceptImage/imageSources/script e `tsc --noEmit` aprovados. Integração, responsividade e QA final permanecem sob o gate do agente principal.

## D-010 — Hotspots nas variantes conceituais (antes da replicação)

Após o gate da casa-piloto, Casa 2/3/4 usam silhuetas procedimentais distintas. Para manter FR-006/NFR-006/007 e evitar sobreposição no mobile, o modelo central define posições normalizadas específicas por variante. Na ordem living/kitchen/bedroom/bath: Casa 2 usa (0,25;0,90), (0,75;0,90), (0,25;0,10), (0,75;0,10); Casa 3 usa (0,14;0,75), (0,48;0,20), (0,14;0,20), (0,83;0,20); Casa 4 usa (0,25;0,85), (0,75;0,85), (0,25;0,12), (0,75;0,12). São coordenadas gráficas sem unidades, não definições arquitetônicas. Casa 1 preserva as posições validadas no piloto. TST-003 verifica os quatro botões após integrar cada cena, e o teste de dados verifica que as variantes não reutilizam inadvertidamente as posições do piloto.
## D-011 — Casa 1: planta recebida como origem e construção pelo scroll (mudança solicitada pelo cliente)

O cliente solicitou que a Casa 1 parta visualmente da planta enviada (`src/assets/floor-plan-reference-provisional.png`) e evolua dessa planta para uma casa 3D ao rolar no celular. A mudança está coberta por FR-003, FR-005, MOT-001/005, NFR-007 e AC-003/006; TS-0303, TS-0305, TS-0502 e TS-0506 passam a exigir também evidência dos estados vinculados ao scroll.

Implementação: a Casa 1 terá uma jornada dedicada, com cena sticky e quatro capítulos de scroll: “a planta recebida”, “paredes que se levantam”, “aberturas e cobertura” e “a casa no terreno”. A imagem recebida aparece como referência visual inicial e se dissolve à medida que paredes e cobertura sobem. Um `input[type=range]` e botões de etapa permanecem como alternativa acessível ao gesto. A cena é SVG procedimental sem WebGL, mas a geometria da planta é o ponto de partida visual; nenhum número, área, cômodo aparente ou detalhe da imagem é promovido a fato comercial. A tela da Casa 1 prioriza exclusivamente a transformação; comparação, recomendação e interesse aparecem depois da conclusão como ações discretas.

Definição de pronto adicional: em 390 × 844, rolar cada capítulo altera `data-progress`, `data-stage`, a camada da planta recebida e a altura dos volumes; rolar para cima reverte a evolução; a Casa 1 não exibe uma galeria editorial antes da conclusão. TST-002/TST-003 e uma captura de cada capítulo são evidência obrigatória.
D-013 — Casa 1: reconstrução fiel da planta como base do modelo Blender (2026-10-02)

Feedback do cliente: a primeira cena Blender ficou genérica e não preservou a leitura da planta. A próxima versão deve usar a planta recebida como underlay geométrico e rastrear o contorno real antes de criar volumes. A imagem gerada permanece apenas como referência de linguagem visual; não deve definir a geometria. O modelo deve manter proporção horizontal, paredes e vãos rastreáveis, cobertura removível, coleções separadas e um estado de comparação planta/modelo. Se a planta original não trouxer escala ou cotas verificáveis, o arquivo deve declarar explicitamente que as proporções são conceituais.

DoD: (1) underlay da planta visível e alinhado ao piso; (2) paredes externas e divisórias derivadas do desenho, sem alas inventadas; (3) portas, janelas e jardins posicionados por referência visual; (4) cobertura separada/ocultável; (5) render superior comparando planta e modelo; (6) arquivo .blend e script regenerável; (7) TST/inspeção visual registram que o modelo pode ser reconhecido como a mesma planta sem depender de texto ou legenda.

# D015 — Registro da planta e paredes (2026-10-02)

Evidência: npm run build aprovado; scripts/verify-plan-alignment.mjs aprovado em 1440 × 900 e 390 × 844, verificando registro da imagem e progresso reversível 0 → 25 → 0. Capturas evidence/alignment-desktop.png, alignment-mobile.png e alignment-walls-desktop.png mostram o registro corrigido. Validação limitada ao alinhamento da cena local; cobertura e vídeo gerado continuam conceituais.

Correção solicitada: contornos atravessavam os ambientes. A imagem recebida tem proporção 1600 × 323; o componente aplicava altura 333,33 e deslocamento -60 em coordenadas de largura 1000, distorcendo e recortando a referência. Usar imagem integral 1000 × 201,875 e coordenadas de paredes derivadas da mesma imagem, respeitando as interrupções visíveis de portas. Traço e base das paredes compartilham a mesma projeção no plano y=0.

Rastreabilidade: FR-003/004/005/013, MOT-005, NFR-008, AC-003/004/006 → TS-0202/0303/0506 → pilotSequence e PilotSequenceScene → TST-002/007. Definição de pronto desta correção: proporção preservada, eixos visuais alinhados, portas sem traçado contínuo atravessando vãos, build e sobreposição visual verificados. Coordenadas visuais são inferidas, sem escala executiva. Não declara o modelo completo nem a fidelidade do vídeo Higgsfield aprovados.

# D016 — Materiais e entorno progressivo (2026-10-02)

Solicitação: preservar o alinhamento D015 e substituir cores planas por acabamentos com textura e contexto externo. FR-003/004/013, MOT-005/006, NFR-005/008, AC-003/004/006 → TS-0203/0303/0506 → TST-002/007. DoD: paredes minerais, cobertura com juntas, vidro com reflexos, sombras de contato, solo inicial transformado em jardim e passeio pelo mesmo progresso reversível, sem mudar coordenadas aprovadas. Materiais e paisagismo são propostas visuais substituíveis em pilotSequence, não especificações arquitetônicas confirmadas. A cena permanece uma simulação SVG, sem declarar render fotorrealista ou passeio interno.

# D017 — Nova base visual solicitada (2026-10-02)

Evidência: geração integrada via ferramenta image_gen, arquivo public/assets/casa1-foundation-generated-v2.png, original preservado. Prompt: edição precisa, vista ortográfica superior, manter contornos da planta, remover móveis e paredes altas, pisos de carvalho/pedra clara, jardim baixo, luz uniforme, sem texto nem novos ambientes. Margem branca da geração compensada no mapeamento central (y=-66,4, altura=334,1014 para largura=1000). Build e scripts/verify-plan-alignment.mjs aprovados em desktop/mobile; capturas alignment-desktop.png e materials-complete-desktop.png inspecionadas. A geração simplificou alguns detalhes interiores, portanto não representa levantamento executivo. A mesma base permanece sob a estrutura ao longo da animação, sem troca por uma casa independente. D016 também implementado: padrões de materiais, reflexos, juntas, passeio, via, solo e paisagismo progressivos. Permanece uma representação SVG com detalhes, não fotorrealismo.

Criar variante raster inicial com acabamentos compatíveis com D016. Preservar topologia da referência aprovada; remover móveis e sombras de paredes altas para representar piso e fundação, evitando dupla representação quando as paredes sobem. FR-003/013, MOT-005, AC-006 → TS-0203/0303/0506 → TST-002/007. DoD: salvar variante sem sobrescrever original, conferir limites e vãos antes de ativar; manter original se geração deslocar a geometria. Nenhuma imagem gerada é automaticamente considerada geometricamente exata. Projeção e geometria da construção continuam compartilhadas em todos os estados.

# D018 — Cena tridimensional mobiliada (2026-10-02)

Pedido autorizado: elevar o detalhamento e permitir exploração real de todos os ângulos, com móveis que surgem na rolagem. Substituir SVG como visualização principal por Three.js com geometria volumétrica, materiais físicos, sombras, móveis compostos com bordas arredondadas, esquadrias, portas, soleiras e paisagismo. Manter os eixos normalizados de D015. O estado inicial será o piso e o traçado do próprio modelo 3D, eliminando divergência de projeção entre imagens. Referência raster preservada no repositório, não aplicada como substituto da geometria.

FR-003/004/005/013, MOT-005/006, NFR-002/004/005/006/007/008, AC-003/004/005/006 → TS-0203/0303/0304/0305/0502/0506 → TST-002/007/008. DoD: construção reversível, mobiliário posicionado pela referência, rotação 360° e zoom em modo Explorar, modos sem conflito com scroll, controles acessíveis de vista e cobertura, canvas principal ocupando a tela, fallback WebGL, descarte de recursos, build e inspeção visual desktop/mobile.

Alturas, materiais, objetos e entorno são interpretação visual sem cotas aprovadas. Móveis mantêm tipologia e posição da referência; não são modelos comerciais exatos. Perímetro junto a jardins é mureta no estudo para preservar a leitura interior. Cobertura é estudo removível. Usar móveis estáticos detalhados compostos em grupos 3D e aparecer por escala/elevação com progresso. Esta etapa não afirma qualidade fotorrealista, nem modifica vídeo Higgsfield.

## D019 — Navegação centrada e cozinha sem colisões

- **Motivação:** a leitura das casas na visão de território estava prejudicada por sobreposição de miniaturas e títulos, e a geladeira da Casa 1 intersectava o conjunto de armários da cozinha.
- **Decisão:** substituir o posicionamento livre das quatro casas por uma grade responsiva centralizada; adotar uma navegação inferior fixa em formato de cápsula; manter cada página no enquadramento útil da viewport sempre que o conteúdo couber; modelar a geladeira como um eletrodoméstico independente, apoiado no piso e separado fisicamente do balcão.
- **Requisitos relacionados:** FR-002, FR-003, FR-004, NFR-005, NFR-006, NFR-007, NFR-009, NFR-010, AC-002, AC-003, AC-004, AC-005.
- **Tarefas e testes:** TS-0103, TS-0302, TS-0503, TS-0506; TST-001, TST-002 e TST-007.
- **Critério verificável:** títulos e imagens das quatro casas devem permanecer legíveis sem colisão em 390 × 844 px e desktop; o menu deve permanecer acessível junto à margem inferior; nenhuma parte da geladeira pode ocupar o volume dos armários ou da bancada.

### Evidência D019

- `npm run build`: concluído sem erros.
- `npm test -- --run`: 16/16 testes aprovados.
- `node scripts/verify-three.mjs`: construção, mobiliário, câmeras, vistas de cômodos, reversão, overflow e console aprovados em desktop e 390 × 844 px.
- `node scripts/verify-navigation.mjs`: quatro cartões integralmente dentro da viewport, sem sobreposição com a navegação fixa e sem erros de console em desktop e mobile.
- Capturas: `evidence/navigation-desktop.png`, `evidence/navigation-mobile.png`, `evidence/three-desktop-living.png` e equivalentes mobile.
- Cozinha: bancada e módulos inferiores encurtados; geladeira recriada como grupo independente apoiado no piso, com duas portas e folga lateral fora do volume dos armários.

## D020 — Banheiro funcional e livre de colisões

- **Motivação:** a implantação atual do banheiro da Casa 1 apresenta sobreposição visual entre box, ducha, bancada e vaso, prejudicando a leitura espacial e o realismo.
- **Decisão:** reorganizar os equipamentos dentro dos limites do banheiro, reduzir o box à área molhada, fixar a ducha na parede interna, preservar circulação central e impedir interseções entre louças, vidro, marcenaria e paredes.
- **Requisitos relacionados:** FR-003, FR-004, NFR-005, NFR-006, NFR-007, NFR-010, AC-003, AC-004.
- **Tarefas e testes:** TS-0302, TS-0503, TS-0506; TST-002 e TST-007.
- **Critério verificável:** bancada, vaso e box devem ser reconhecíveis, permanecer dentro do cômodo e possuir volumes independentes sem colisão perceptível nos ângulos principal e exploratório.
- **Ajuste de implantação:** no banheiro da suíte, a bancada deve permanecer fora da projeção da porta e o box deve fechar o fundo do ambiente, encostado nas paredes lateral e posterior. No banheiro central, o box também deve encontrar a parede posterior sem invadir o setor seco.

### Evidência D020

- `npm run build`: concluído sem erros após a reconstrução dos equipamentos.
- `npm test -- --run`: 16/16 testes aprovados.
- `node scripts/verify-three.mjs`: vista dedicada “Banheiros” validada em desktop e 390 × 844 px, sem overflow ou erros de console.
- Capturas: `evidence/three-desktop-bathroom.png` e `evidence/three-mobile-bathroom.png`.
- Resultado: box compacto delimitado por dois painéis de vidro, ducha fixada à parede do box, bancada e vaso no setor seco e equipamentos reposicionados nos dois banheiros.
- Revisão da suíte: bancada retirada da projeção da porta; vaso alinhado à parede seca; box específico com largura total no fundo, encostado nas laterais e na parede posterior. Vista dedicada registrada em `evidence/three-desktop-suite-bathroom.png` e `evidence/three-mobile-suite-bathroom.png`.

## D021 — Splash minimalista e roleta vertical de residências

- **Motivação:** a abertura deve funcionar apenas como carregamento da experiência, enquanto a seleção das residências precisa abandonar a grade estática em favor de uma navegação espacial orientada pelo scroll.
- **Decisão:** apresentar no estado inicial somente a marca Terra Santa, uma barra de carregamento e a transição final para o aplicativo; substituir a grade de quatro casas por uma roleta vertical, com indicador no lado esquerdo, seleção contínua por roda/gesto e residência ativa ampliada e acionável.
- **Requisitos relacionados:** FR-001, FR-002, FR-011, NFR-005, NFR-006, NFR-007, NFR-009, NFR-010, MOT-001, AC-001, AC-002, AC-005.
- **Tarefas e testes:** TS-0102, TS-0103, TS-0503, TS-0506; TST-001 e TST-007.
- **Critério verificável:** o splash não deve exibir navegação, botões ou textos editoriais; a roleta deve selecionar as quatro casas por scroll/gesto, manter somente um modelo em destaque e permitir abrir a residência ativa por clique ou teclado.

### Evidência D021

- `npm run build`: concluído sem erros.
- `node scripts/verify-navigation.mjs`: splash sem botões ou navegação, marca e barra presentes, transição para o aplicativo e seleção por scroll aprovados em desktop e 390 × 844 px.
- A roleta mantém exatamente uma residência ativa, sincroniza o indicador lateral e permite abertura por clique ou teclado.
- Capturas: `evidence/splash-desktop.png`, `evidence/splash-mobile.png`, `evidence/navigation-desktop.png` e `evidence/navigation-mobile.png`.

## D022 — Semicírculo de seleção e faixa editorial lateral

- **Motivação:** a roleta oval ocupa área excessiva e a ação textual à direita compete com a seleção direta da casa.
- **Decisão:** reduzir o seletor a um único arco semicircular no lado esquerdo, ampliar seus quatro pontos de escolha e transformar o terço direito em uma faixa vertical laranja com entrada transparente em degradê; centralizar nela somente a orientação e o nome da residência ativa, em bege, removendo a ação redundante “Visualizar residência”.
- **Requisitos relacionados:** FR-002, NFR-005, NFR-006, NFR-007, NFR-009, NFR-010, MOT-001, AC-002, AC-005.
- **Tarefas e testes:** TS-0103, TS-0503, TS-0506; TST-001 e TST-007.
- **Critério verificável:** deve existir apenas um arco aberto à esquerda; os quatro seletores devem possuir alvo confortável; a faixa deve ocupar toda a altura útil e aproximadamente um terço da tela; o texto deve permanecer centralizado e legível, sem botão de visualização.

### Evidência D022

- `npm run build`: concluído sem erros.
- `node scripts/verify-navigation.mjs`: seleção por scroll, um único item ativo, ausência de “Visualizar residência”, faixa lateral entre 32% e 41% da viewport, ausência de overflow e console limpo em desktop e 390 × 844 px.
- Capturas: `evidence/navigation-desktop.png` e `evidence/navigation-mobile.png`.

## D023 — Entrada guiada, apresentação automática e teto contextual

- **Motivação:** a entrada direta no modelo 3D não comunica imediatamente como acompanhar a obra, mover a câmera e acessar o interior; o teto também bloqueia a leitura interna quando a câmera se aproxima.
- **Decisão:** ao abrir a Casa 1, executar uma apresentação breve da construção de 0% a 100%, terminando com a obra concluída e o modo de exploração ativo; sobrepor um guia de três etapas para explicar construção, navegação e interior; tratar “Cobrir” como preferência de cobertura, ocultando o teto automaticamente abaixo do limite de aproximação e restaurando-o ao afastar.
- **Requisitos relacionados:** FR-003, FR-004, FR-011, NFR-005, NFR-006, NFR-007, NFR-009, NFR-010, MOT-005, MOT-006, AC-003, AC-004, AC-005.
- **Tarefas e testes:** TS-0302, TS-0303, TS-0401, TS-0402, TS-0403, TS-0503, TS-0506; TST-002, TST-003 e TST-007.
- **Critério verificável:** a apresentação deve atingir 100% e permanecer nesse estado; a exploração deve iniciar ativa; o guia deve possuir exatamente três etapas e ser dispensável; com cobertura solicitada, aproximar a câmera deve ocultar o teto e afastá-la deve restaurá-lo.

## D024 — Ficha editorial rolável e dados comerciais responsáveis

- **Motivação:** o painel lateral precisa explicar melhor cada residência e acomodar conteúdo técnico e visual sem competir com a roleta principal.
- **Decisão:** transformar o terço direito em uma ficha com rolagem independente, imagens intercaladas e campos derivados exclusivamente do modelo central de dados; capacidade e perfil familiar serão apresentados como orientação conceitual, enquanto faixa de renda, preço, financiamento e medidas não confirmadas permanecerão explicitamente “sob análise”, sem números inventados. A transição cromática para o laranja será alongada e mais suave.
- **Requisitos relacionados:** FR-002, FR-005, FR-009, FR-013, NFR-002, NFR-005, NFR-006, NFR-007, NFR-010, AC-002, AC-006.
- **Tarefas e testes:** TS-0103, TS-0203, TS-0503, TS-0506; TST-001, TST-007 e TST-008.
- **Critério verificável:** o painel deve rolar sem alterar a casa selecionada; nenhuma informação não confirmada pode ser apresentada como fato; imagens e blocos textuais devem se alternar; a transição de fundo não pode formar uma borda cromática abrupta.

## D025 — Título dinâmico e seletores sem recorte

- **Motivação:** os pontos extremos e suas sombras estavam sendo recortados pelo contêiner usado para ocultar a metade externa do círculo; o lado esquerdo também carecia de uma mensagem orientadora.
- **Decisão:** permitir overflow visual dos seletores, mantendo o recorte do arco pela própria viewport; criar margem de segurança superior e inferior; inserir acima da roleta o título “Escolha seu próximo”, com alternância suave entre “lar”, “empreendimento”, “investimento” e “capítulo”.
- **Requisitos relacionados:** FR-002, NFR-005, NFR-006, NFR-007, NFR-009, NFR-010, MOT-001, AC-002, AC-005.
- **Tarefas e testes:** TS-0103, TS-0503, TS-0506; TST-001 e TST-007.
- **Critério verificável:** todos os seletores e sombras devem permanecer integralmente visíveis; o título deve ficar acima do arco e alternar a palavra final sem causar overflow horizontal.
- **Composição de marca:** o símbolo isolado da árvore deve ficar centralizado acima do título dinâmico, compartilhando seu eixo visual e sem repetir o nome da incorporadora.

## D026 — Hierarquia da marca e ornamento de fundo

- **Motivação:** o ornamento topográfico competia com os elementos funcionais; a árvore precisava pertencer somente ao carregamento e seguir o eixo vertical da marca.
- **Decisão:** reduzir a opacidade e manter o ornamento atrás de casas, textos e controles; no splash, centralizar árvore acima de “Terra Santa” e da barra; remover a árvore do título da seleção de residências.
- **Requisitos relacionados:** FR-001, FR-002, NFR-005, NFR-006, NFR-007, NFR-009, MOT-001, AC-001, AC-002.
- **Tarefas e testes:** TS-0102, TS-0103, TS-0503; TST-001 e TST-007.
- **Critério verificável:** o splash deve formar uma composição vertical centralizada; a seleção não deve exibir o símbolo da árvore; o ornamento deve ter baixa opacidade e permanecer atrás de todo conteúdo funcional.

### Evidência D023

- `node scripts/verify-three.mjs`: apresentação automática concluída em 100%, exploração ativa, guia com exatamente três etapas, reversão da construção e teto contextual aprovados em desktop e 390 × 844 px.
- O teste aproxima a câmera até `data-roof="auto-open"` e a afasta até `data-roof="closed"`, mantendo “Cobrir” como preferência.

### Evidência D024

- `node scripts/verify-navigation.mjs`: a rolagem da ficha lateral não altera a residência ativa; imagens editoriais, informações confirmadas e o estado “Sob análise financeira” foram verificados em desktop e mobile.
- A ficha usa somente dados do modelo central; perfil familiar da Casa 1 permanece identificado como hipótese e renda não recebe valor inventado.

### Evidência D025

- Os quatro centros dos seletores foram verificados com variação inferior a 3 px entre intervalos; caixas e sombras permanecem integralmente dentro da viewport.
- O título e a etiqueta da casa foram verificados sem interseção com a ficha lateral nos dois formatos.

### Evidência D026

- Capturas `evidence/splash-desktop.png` e `evidence/splash-mobile.png`: árvore, marca e barra no mesmo eixo vertical.
- Capturas `evidence/navigation-desktop.png` e `evidence/navigation-mobile.png`: árvore ausente da seleção e ornamento topográfico em baixa opacidade, atrás do conteúdo.
- `npm run build`: aprovado; `npm test -- --run`: 16/16 testes aprovados; verificadores sem overflow ou erros de console.

## D027 — Direção de arte mobile independente

- **Motivação:** reproduzir a composição desktop em uma tela estreita comprime a casa, a roleta e a ficha editorial, criando competição visual. O mobile precisa ser uma experiência própria, preservando apenas a navegação inferior compartilhada.
- **Decisão:** em até 760 px, substituir o arco lateral por um seletor horizontal; usar fundo escuro verde-terra sem a malha topográfica; posicionar título e casa na metade superior; transformar a ficha laranja lateral em uma folha marfim rolável na metade inferior, com texto escuro, imagens amplas e cartões técnicos claros. O menu inferior permanece inalterado.
- **Requisitos relacionados:** FR-002, FR-011, NFR-005, NFR-006, NFR-007, NFR-009, NFR-010, MOT-001, AC-002, AC-005.
- **Tarefas e testes:** TS-0103, TS-0503, TS-0506; TST-001 e TST-007.
- **Critério verificável:** em 390 × 844 px, seletor, título, casa e ficha não devem se sobrepor; a ficha deve possuir rolagem própria; o seletor deve avançar entre as quatro casas; o menu inferior deve manter exatamente sua composição anterior.

### Evidência D027

- `npm run build`: aprovado; `npm test -- --run`: 16/16 testes aprovados.
- `node scripts/verify-navigation.mjs`: seletor horizontal equidistante, título acima dos controles, casa sem colisão com a ficha, rolagem independente e ausência de overflow/erros de console em 390 × 844 px; desktop permaneceu aprovado.
- Captura: `evidence/navigation-mobile.png`, demonstrando fundo verde-terra, casa em destaque superior, ficha marfim inferior e menu fixo preservado.

## D028 — Expansão orgânica da ficha mobile por scroll

- **Motivação:** a ficha mobile deve revelar progressivamente o conteúdo, em vez de nascer como um painel fixo de altura limitada; imagens estáticas também quebram a sensação de presença dentro do card.
- **Decisão:** reservar um percurso vertical exclusivo no mobile. Durante o primeiro scroll, casa e ficha sobem, a ficha reduz margens e raio até preencher a viewport; ao concluir a expansão, a ficha habilita sua própria rolagem de conteúdo. O scroll vertical não troca residências no mobile. Imagens editoriais serão substituídas por GIFs locais de movimento sutil, tratados na paleta marfim do card e referenciados pelo modelo central de dados.
- **Requisitos relacionados:** FR-002, FR-011, FR-013, NFR-004, NFR-005, NFR-006, NFR-007, NFR-010, AC-002, AC-005, AC-006.
- **Tarefas e testes:** TS-0103, TS-0203, TS-0503, TS-0506; TST-001, TST-007 e TST-008.
- **Critério verificável:** em 390 × 844 px, o scroll da página deve levar a ficha do estado parcial ao preenchimento da viewport; casa e ficha devem subir continuamente; após a expansão, o conteúdo interno deve rolar; a residência ativa não deve mudar por esse scroll; os recursos editoriais exibidos devem ser GIFs locais substituíveis.

## D029 — Interação 360º explícita no canvas

- **Motivação:** o estado visual “Explorando 360°” podia permanecer ativo enquanto o canvas não recebia corretamente gestos de arraste.
- **Decisão:** habilitar rotação e zoom explicitamente junto ao modo de exploração, garantir eventos de ponteiro no canvas e validar mudança de azimute por arraste real em desktop e mobile.
- **Requisitos relacionados:** FR-004, NFR-005, NFR-006, NFR-009, AC-004, AC-005.
- **Tarefas e testes:** TS-0401, TS-0402, TS-0503; TST-003 e TST-007.
- **Critério verificável:** ao arrastar diretamente o canvas com exploração ativa, o azimute deve mudar; controles de giro e zoom devem continuar operantes.

## D030 — Restauração da fidelidade visual da cena 3D

- **Decisão:** a cena principal volta a usar leitura arquitetônica realista: céu com gradiente atmosférico, iluminação física mais contrastada, reflexão ambiente reforçada, cobertura cerâmica rugosa e câmera isométrica mais baixa. A navegação direta pelo canvas permanece habilitada.
- **Justificativa:** a vista anterior achatava a volumetria e fazia o estudo parecer uma planta simplificada, divergindo da intenção aprovada de apresentar uma casa real e manipulável.
- **Rastreabilidade:** FR-010, FR-011, NFR-004, AC-003, TS-0034, TST-003D.
- **Validação esperada:** objeto claramente tridimensional nos estados 0/35/70/100, arraste alterando o azimute, aproximação ocultando contextualmente a cobertura e ausência de canvas vazio.

## D031 — Vista inicial cutaway com mobiliário 3D

- **Decisão:** ao concluir a apresentação da Casa 1, o teto inicia aberto para revelar paredes, ambientes e mobiliário 3D imediatamente. O controle “Cobrir” restaura a leitura exterior.
- **Justificativa:** o modelo completo estava renderizado, mas a cobertura fechada ocultava os objetos e fazia a cena parecer uma planta vazia.
- **Rastreabilidade:** FR-010, FR-011, AC-003, TS-0034.

## D032 — Interação 3D restaurada

- **Decisão:** o canvas Three.js volta a ser a camada interativa principal, com arraste direto, zoom por roda/pinça e cursor de estado; controles de interface ficam acima apenas nas áreas de seus próprios botões.
- **Rastreabilidade:** FR-011, NFR-004, AC-003, TS-0034.

## D033 — Recuperação verificável da Casa 1 — 10/10/2026

As declarações anteriores de correção não demonstram o funcionamento atual. A recuperação será validada no navegador, com eventos de ponteiro reais, imagens e erros de execução. Corrige-se a rastreabilidade de D030–D032: exploração e planta aberta correspondem a FR-004/FR-005, não FR-010/FR-011; a tarefa de recuperação é TS-0507.

Um único OrbitControls deve possuir os gestos de mouse/toque; manipuladores duplicados serão removidos. A cena preserva os móveis e os materiais existentes. Redução de efeitos deve preservar a geometria tridimensional e a câmera interativa. Falta/perda de WebGL deve ser informada claramente e permitir nova tentativa, sem tratar uma imagem simplificada como 3D livre. A apresentação termina com 100% e teto aberto. A inicialização e a recuperação devem atualizar a cena com o estado mais recente.

Requisitos → FR-003/004/005/006; MOT-005/006; NFR-004/005/007; AC-002/003/004/005 → TS-0507 → PilotBuild/PilotThreeScene → TST-002/003/007/008 e verificador de gestos → evidências a registrar após execução.

### Evidência D033 — concluída em 10/10/2026

- Reproduzida perda do contexto WebGL no teste mobile antes da correção. A inicialização agora é adiada/cancelável para não criar duas cenas pesadas na montagem de desenvolvimento do React. Removidos gestos duplicados e passes de SSAO completos por quadro; renderização física sob demanda mantém geometria, texturas, iluminação, sombras e 19 conjuntos de móveis. Sombras são atualizadas quando a construção/cobertura muda, não a cada movimento da câmera.
- Enquadramento usa a região livre entre controles; objetos não dependem do painel inferior para aparecer. Cobertura aberta na apresentação concluída; opção Cobrir preserva abertura contextual nas aproximações.
- `npm run build`: aprovado; aviso informativo de chunk Three.js >500 kB permanece. `npm test -- --run`: 16 testes aprovados. ESLint nos dois componentes da Casa 1: aprovado.
- `node scripts/verify-recording.mjs`: aprovado em 1440×900 com movimento normal e 390×844 com movimento reduzido, sobre a versão compilada servida em 5173. Arraste real de mouse/toque, roda e pinça alteram câmera e geram novos quadros; 19 grupos de móveis; um canvas; seis vistas; cobertura manual/contextual; progresso 0/35/70/100 reversível; sem overflow e sem erros de console. Perda WebGL forçada no mobile mostra aviso explícito e botão; nova tentativa recupera um canvas com os 19 conjuntos de móveis.
- Capturas `evidence/recording-{desktop,mobile}-{furnished,living,bedroom,bathroom,suite-bathroom}.png`; vista geral, sala/cozinha e banheiro da suíte inspecionados visualmente nos dois tamanhos. Resultado estruturado: `evidence/recording-validation.json`.
- Plataforma compilada ativa em `http://127.0.0.1:5173/`, HTTP 200 confirmado. Log: `evidence/recording-server.log`.

| Requisito | Tarefa | Implementação | Teste | Evidência |
|---|---|---|---|---|
| FR-003, MOT-005 | TS-0507 | PilotBuild + createPilotModel | TST-002, progresso reversível | recording-validation.json |
| FR-004, NFR-005/007 | TS-0507 | PilotThreeScene / OrbitControls | Arraste, roda, toque, pinça reais | recording-validation.json |
| FR-005/006 | TS-0507 | Cobertura contextual e vistas por ambiente | TST-003, teto e cômodos | recording-*-living/bathroom/suite-bathroom.png |
| NFR-004, AC-005 | TS-0507 | Inicialização única e nova tentativa WebGL | Perda forçada e recuperação, um canvas, console | recording-validation.json |
| MOT-006, AC-003/004 | TS-0507 | Movimento reduzido e enquadramento seguro | TST-007/008 | recording-desktop-furnished.png, recording-mobile-furnished.png |

O modelo permanece um estudo procedimental baseado na referência, com dimensões e materiais a confirmar; a recuperação não altera os dados comerciais. Esta evidência encerra TS-0507, não os demais itens antigos ainda abertos no plano geral.

## D034 — Planta como entrada principal da Casa 1 — 20/10/2026

- **Decisão:** a Casa 1 passa a abrir em uma página editorial mínima centrada na planta recebida e nas quatro referências visuais do cliente. O modelo 3D continua disponível pela ação “Explorar modelo 3D”, como visualização aprimorada secundária.
- **Dados e ativos:** `public/assets/casa1/planta.png`, fachada frontal/lateral, sala-cozinha e quarto foram copiados dos arquivos fornecidos pelo cliente em 13/10/2026. As plantas Buriti, Rio Corrente e Vereda ficam associadas aos modelos correspondentes como material de referência.
- **Rastreabilidade:** FR-005, FR-013, NFR-003, NFR-006, AC-002, AC-003, AC-006 → TS-0202, TS-0203, TS-0305, TS-0506.
- **Validação:** build TypeScript, navegação para Casa 1 e ação de entrada 3D; a planta é a maior mídia inicial e a galeria usa os arquivos reais fornecidos. A associação das plantas, áreas e materiais permanece provisória onde não foi confirmada pelo cliente.

## D035 — Seleção visual refeita com ativos reais — 20/10/2026

- **Decisão:** a tela de seleção deixa de usar a miniatura procedural como elemento principal. Cada opção da roleta agora mostra a planta recebida; o painel lateral também abre com a planta e só depois apresenta referências de atmosfera. Isso torna a entrega verificável imediatamente e mantém o 3D como ação secundária.
- **Implementação:** `src/App.tsx` usa `media.planImage` no palco e no painel; `src/styles/app.css` aplica moldura branca, contenção da imagem, contraste para o item ativo e regras responsivas.
- **Validação:** `npm run build`, `npm test -- --run` e `node scripts/verify-overview.mjs` aprovados; servidor local responde HTTP 200 em `http://127.0.0.1:5173/`.

## D036 — Ambientação gerada por modelo e organizada por residência — 20/10/2026

- **Decisão:** cada um dos três modelos passou a ter imagens complementares de fachada/implantação e interior, sem substituir a planta técnica. A seleção mostra a planta; a coluna de informações mostra a ambientação correspondente.
- **Ativos:** `public/assets/casa1`, `public/assets/casa2` e `public/assets/casa3` receberam imagens geradas a partir da leitura espacial das plantas e referências fornecidas. São estudos visuais, não documentação executiva.
- **Validação:** os assets respondem pelo servidor local; build e 16 testes unitários aprovados. A associação de ambientes e materiais continua explicitamente conceitual até confirmação do cliente.

