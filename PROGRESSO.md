# Progresso — Terra Santa

Atualização final da rotina: 23/10/2026.

## Entregue

- Três landing pages separadas para Buriti, Rio Corrente e Vereda.
- Seções comerciais de pertencimento, galeria, planta, exploração 3D, planejamento e escolha.
- Galeria com imagens reais/referenciais do pacote de cada residência.
- Planta ampliável em cada landing page.
- Tela 3D conceitual com rotação, zoom e retorno.
- Faixa horizontal `MotionBand` integrada com pausa/retomada.
- Cartões de pertencimento convertidos em carrossel horizontal com imagens, setas, toque e scroll snap.
- Parallax leve no hero, entrada progressiva das seções e transição animada da galeria integrados.
- Fundos das seções alternados em três atmosferas contrastantes, com halos, anéis orgânicos, divisórias inclinadas e animações decorativas.
- Acessibilidade preservada: as animações decorativas são desligadas quando o usuário solicita movimento reduzido.
- Preferência por movimento reduzido respeitada no código de animação.

## Validação

- `npm run build`: aprovado em 23/10/2026.
- `npm test -- --run`: 16 testes aprovados.
- O build gera um aviso de tamanho do chunk do Three.js; é otimização futura, não erro de compilação.

## Pendências

- A home ainda precisa de uma validação visual completa da transição entre as três residências.
- O servidor está acessível em `http://127.0.0.1:5173/`.
- Os modelos 3D são protótipos volumétricos conceituais, não modelos arquitetônicos confirmados.

## Atualização de implementação — 28/10/2026

- A galeria das landing pages ganhou trilho lateral com snap por miniatura, interação de toque/arraste, conversão da roda vertical para deslocamento horizontal e slider de navegação acessível por teclado.
- As seções internas agora funcionam como capítulos com rolagem `snap` por proximidade, revelação progressiva, realce animado nos trechos destacados e suporte a movimento reduzido sem forçar a rolagem.
- A tela 3D foi refeita como três estudos procedimentais diferentes: Buriti compacta com cobertura de duas águas, Rio Corrente linear com cobertura plana e Vereda em pátio/U com cobertura mono-inclinada. Os estudos incluem ambientes internos mobiliados, vãos, portas, esquadrias, caminho, vegetação e iluminação.
- Foram adicionados alternância entre cobertura e vista interna, controles Orbit (giro, zoom e pan) e recenter. O menu fixo é ocultado enquanto a experiência 3D está aberta para não cobrir a legenda.
- Aviso visível preserva o limite factual: os modelos são conceituais; implantação, layout, materiais e proporções precisam de confirmação e não equivalem a projeto executivo.
- Verificação visual no Chrome: os três modelos abriram no canvas WebGL e apresentaram as massas distintas (compacta, linear e pátio/U); a alternância da Buriti removeu a cobertura e expôs divisórias e mobiliário.
- `npm run build`: aprovado; permanece o aviso de chunk Three.js acima de 500 kB. `npm run test`: 16/16 testes aprovados. Uma tentativa inicial com `--runInBand` falhou por ser opção exclusiva do Jest, então a suíte foi repetida com o comando Vitest normal.
- Pendência de verificação: conferir o layout em viewport mobile; não há afirmação de que esse check visual foi concluído.

## Atualização de implementação — 28/10/2026 (continuação)

- Home consolidada com catálogo público de exatamente três residências, transição crossfade entre fachadas e painel de informações sincronizado; a leitura mobile recebeu seletores compactos e contraste reforçado.
- Landing pages receberam capítulos visuais guiados por scroll: sequência de imagens em tela cheia, parallax leve, barra de progresso, carrossel de momentos com setas/teclado/toque, galeria horizontal e modais para momentos e planta.
- A navegação da landing ficou sticky durante a apresentação e a primeira dobra mantém título, mensagem comercial e imagem sem exigir rolagem; o comportamento responsivo foi validado em desktop e viewport móvel de 390px.
- O botão de planta agora abre modal acessível, sem abrir aba vazia; o CTA de cada momento leva à galeria ou à experiência 3D.
- Validação final: `npm run build` aprovado, `npm run test` aprovado (16/16) e ESLint dos arquivos alterados aprovado. O build ainda sinaliza o chunk do Three.js acima de 500 kB.
- Higgsfield foi consultado para vídeos de fundo, mas a geração foi bloqueada pelo plano Starter (`Requires plus plan or higher`); nenhuma cota foi consumida. O produto permanece funcional com imagens reais/referenciais e movimento CSS/scroll.
- Pendências honestas: os modelos 3D continuam protótipos conceituais, e vídeos gerados exigem upgrade de plano; a otimização do chunk Three.js pode ser feita posteriormente.

## Atualização de implementação — 28/10/2026 (variações visuais)

- Gerei no Higgsfield três imagens editoriais distintas em 2K/16:9: cozinha com casal, sala integrada ao jardim e vista aérea da residência. Cada imagem recebeu um job concluído e foi associada a uma residência diferente, evitando repetição entre as casas.
- Os cartões de “Encontros”, “Seu ritmo” e “Seu futuro” agora escolhem imagens diferentes por residência; a primeira imagem editorial é exclusiva de Buriti, Rio Corrente ou Vereda e as demais usam cenas distintas da galeria disponível.
- Custo estimado e geração: 2,75 créditos por imagem; três jobs concluídos sem falhas. O saldo permanece suficiente para o projeto.
- Validação após a troca: build aprovado, 16 testes aprovados e ESLint dos arquivos alterados aprovado. O aviso conhecido do chunk Three.js permanece.
- Ajuste de posicionamento: a imagem editorial arquitetônica gerada agora ocupa a hero da residência correspondente; o card “Encontros” voltou a usar a cena de família/ambiente, evitando que a fachada apareça no contexto errado.
- Removido o menu fixo do topo das landing pages, deixando a apresentação mais imersiva e sem a faixa superior mostrada na referência.
- Revisadas as referências por casa: Buriti mantém fachada frontal/lateral e interiores próprios; Rio Corrente mantém fachada aérea e cozinha; Vereda ganhou também a vista panorâmica transparente, além de fachada, sala, varanda e planta. As imagens são mantidas separadas por pasta e não compartilhadas entre as três casas.
- Build, testes e ESLint continuam aprovados após a revisão.
- As plantas atualizadas enviadas pela cliente foram aplicadas diretamente aos três modelos: Buriti `(3)`, Rio Corrente `(2)` e Vereda `(3)`, preservando a associação correta de cada casa e evitando referência antiga ou cruzada.
- Galeria da Casa Buriti corrigida: o slide genérico inicial foi removido, a sequência inferior passou a começar pelas duas fachadas próprias (frontal e lateral) e o conjunto ficou limitado às referências da própria casa. Isso elimina o desvio visual que aparecia nos últimos slides.
- Criado `CHECKLIST_FINAL.md` com critérios de aceite, revisão de ativos por casa, navegação, galeria, 3D, mobile, acessibilidade, testes, desempenho e aprovação da cliente.
