# 02 — Especificação de Experiência e Movimento

## 1. Conceito

> Cada residência nasce da terra.

A interface deve transformar o ato de conhecer uma casa em uma sequência contínua de descoberta, construção e aproximação.

## 2. Fundamentos visuais

### Paleta inicial

- Marfim: `#F3E8D5`;
- Areia: `#D9C5A7`;
- Terracota: `#B64217`;
- Terracota escuro: `#7D2D13`;
- Grafite quente: `#292724`;
- Verde folha: `#4D5A3D`;
- Branco quente: `#FFF9EF`.

Os valores são tokens iniciais e devem ser calibrados visualmente a partir da logo.

### Tipografia

- Títulos: serifada editorial, elegante e de alto contraste;
- Interface e dados: sans-serif neutra e legível;
- Rótulos técnicos: caixa alta, espaçamento entre letras e tamanho reduzido.

Não depender de fontes pagas ou sem licença disponível.

### Elementos recorrentes

- linhas topográficas;
- raízes e galhos;
- máscaras terracota;
- molduras finas;
- recortes arquitetônicos;
- etiquetas técnicas discretas;
- transições entre marfim e grafite.

## 3. Ritmo

A experiência deve alternar:

1. impacto;
2. pausa;
3. manipulação;
4. descoberta;
5. informação;
6. contemplação.

Não manter todos os elementos em movimento ao mesmo tempo.

## 4. Jornada detalhada

### Cena S01 — Origem

- Fundo marfim;
- traço terracota surge como raiz;
- o traço sugere a árvore da marca;
- a árvore se transforma em linhas de terreno;
- texto curto: “Quatro formas de viver. Um lugar para chamar de seu.”;
- ação: “Explorar”.

### Cena S02 — Território

- Visão conceitual das quatro residências;
- seleção por movimento espacial, não por grade;
- cada modelo responde ao toque com profundidade, luz e nome;
- especificações aparecem apenas após foco deliberado.

### Cena S03 — Nascimento da residência

- A câmera aproxima o terreno;
- a planta é desenhada;
- volumes surgem em sequência;
- materiais e vegetação finalizam a composição;
- o progresso responde ao gesto do visitante.

### Cena S04 — Exterior livre

- Rotação ou simulação de rotação;
- zoom limitado para evitar perda de orientação;
- alternância de atmosfera;
- hotspots somente quando o visitante interrompe o movimento.

### Cena S05 — Abrir a casa

- O teto desliza ou dissolve;
- câmera assume perspectiva superior;
- ambientes recebem contornos ou luz suave;
- tocar em um ambiente aproxima o conteúdo correspondente.

### Cena S06 — Ambiente

- Uma fotografia ou render ocupa a maior parte da tela;
- texto limitado a um título e um diferencial;
- gesto lateral ou “voltar à planta” retorna sem carregar outra página aparente.

### Cena S07 — Galeria editorial

- Colagem assimétrica de fachada, interior, materiais e jardins;
- velocidades diferentes durante o scroll;
- nenhuma imagem pequena deve conter informação essencial.

### Cena S08 — Comparação

- Dois modelos em oposição visual;
- destaque das diferenças confirmadas;
- dados ausentes exibidos como “a confirmar”;
- ação de favoritar disponível.

### Cena S09 — Recomendação

- Fundo calmo;
- residência recomendada aparece isolada;
- texto explica dois ou três sinais relevantes;
- possibilidade de rever alternativas.

### Cena S10 — Interesse

- Retorno visual da árvore completa;
- frase: “Sua próxima história pode começar aqui.”;
- ação simulada de interesse;
- opção de reiniciar.

## 5. Motion design

### MOT-001 — Crescimento

Linhas devem ser reveladas progressivamente, como raízes ou desenho arquitetônico.

### MOT-002 — Máscaras

Blocos terracota ou areia podem cobrir e revelar imagens e títulos.

### MOT-003 — Profundidade

Parallax deve ser sutil e usar no máximo três níveis principais por cena.

### MOT-004 — Transições

Transições principais devem durar aproximadamente 450–900 ms. A abertura pode durar até 4 segundos e ser pulada.

### MOT-005 — Gesto e resposta

O movimento deve acompanhar o gesto sempre que representar construção, rotação ou aproximação. Evitar animações longas que ignorem a ação do usuário.

### MOT-006 — Redução de movimento

Com `prefers-reduced-motion`, substituir movimentos complexos por fades curtos e mudanças diretas de estado.

## 6. Navegação

- Não usar barra inferior convencional como elemento dominante;
- disponibilizar menu discreto em tela cheia;
- manter retorno claro ao território;
- oferecer indicação sutil de progresso contextual;
- evitar dependência de hover;
- áreas tocáveis mínimas de 44 × 44 px.

## 7. Conteúdo textual

### Tom

- humano;
- curto;
- seguro;
- contemplativo;
- sem superlativos não comprováveis.

### Exemplos

- “Abra a casa.”
- “Veja como os espaços se encontram.”
- “A luz muda. A casa também.”
- “Explore no seu ritmo.”
- “Este modelo parece combinar com você.”

## 8. Regras para ativos conceituais

- Manter consistência de fachada entre ângulos;
- não representar medidas inexistentes como precisas;
- evitar elementos que contradigam a planta conhecida;
- identificar ativos provisórios no nome do arquivo ou metadados;
- jamais exibir marca d’água de ferramentas de geração;
- não embutir texto dentro das imagens arquitetônicas.
