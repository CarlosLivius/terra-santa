# 04 — Plano de Implementação Executável

Cada tarefa só pode ser marcada como concluída depois de satisfazer sua definição de pronto.

## Fase 0 — Descoberta

- [x] **TS-0001 — Auditar workspace**
  - Mapear stack, arquivos existentes e instruções do repositório.
  - **Pronto quando:** relatório curto registrado e nenhuma alteração existente foi sobrescrita.

- [x] **TS-0002 — Inspecionar referências**
  - Examinar visualmente logo, planta e site de referência.
  - **Pronto quando:** tokens visuais e comportamentos relevantes estiverem registrados.

- [x] **TS-0003 — Classificar dados**
  - Separar fatos confirmados, inferências e placeholders.
  - **Pronto quando:** arquivo central representa os quatro modelos com níveis de confiança.

## Fase 1 — Fundação

- [ ] **TS-0101 — Criar aplicação e qualidade básica**
  - Configurar TypeScript, lint, build e testes.
  - **Pronto quando:** instalação, desenvolvimento, teste e build funcionam.

- [ ] **TS-0102 — Criar design tokens**
  - Paleta, tipografia, espaçamento, bordas, sombras e tempos de movimento.
  - **Pronto quando:** nenhuma cor estrutural precisa estar repetida diretamente nos componentes.

- [ ] **TS-0103 — Criar shell responsivo**
  - Estrutura base, menu, controle de somente sessão e fallback.
  - **Pronto quando:** viewport mobile e desktop não apresentam overflow acidental.

## Fase 2 — Conteúdo e ativos

- [ ] **TS-0201 — Preparar logo**
  - Criar versões de uso sem destruir o original.
  - **Pronto quando:** abertura e cabeçalho usam ativos nítidos e responsivos.

- [x] **TS-0202 — Preparar planta de referência**
  - Otimizar, recortar e associar apenas como material provisório do modelo correto.
  - **Pronto quando:** planta carrega sem distorção e possui alternativa textual.

- [x] **TS-0203 — Produzir conjunto visual da casa-piloto**
  - Hero, exterior, topo aberto, etapas e quatro ambientes.
  - **Pronto quando:** os ativos mantêm coerência suficiente para uma demonstração contínua.

- [ ] **TS-0204 — Produzir placeholders coerentes para os demais modelos**
  - Diferenciar silhuetas e estilos sem inventar especificações.
  - **Pronto quando:** os quatro modelos são selecionáveis e visualmente distintos.

## Fase 3 — Experiência principal

- [ ] **TS-0301 — Implementar abertura**
  - Atender FR-001 e MOT-001.

- [ ] **TS-0302 — Implementar território**
  - Atender FR-002 sem grade convencional dominante.

- [ ] **TS-0303 — Implementar construção controlada**
  - Atender FR-003 e permitir reversão.

- [ ] **TS-0304 — Implementar exploração externa**
  - Atender FR-004 com Nível A, B ou C da camada 3D.

- [ ] **TS-0305 — Implementar planta aberta e hotspots**
  - Atender FR-005 e FR-006.

- [ ] **TS-0306 — Implementar atmosferas**
  - Atender FR-007.

- [ ] **TS-0307 — Implementar galeria editorial**
  - Atender parallax, máscaras e ritmo descritos na experiência.

## Fase 4 — Decisão

- [ ] **TS-0401 — Implementar favoritos**
  - Atender FR-008.

- [ ] **TS-0402 — Implementar comparação**
  - Atender FR-009 e respeitar confiança dos dados.

- [ ] **TS-0403 — Implementar sinais locais**
  - Atender FR-010 sem tracker externo.

- [ ] **TS-0404 — Implementar recomendação explicável**
  - Atender FR-011 e regras de empate.

- [ ] **TS-0405 — Implementar interesse simulado**
  - Atender FR-012 sem transmissão real.

- [ ] **TS-0406 — Implementar reinício**
  - Atender FR-014.

## Fase 5 — Robustez

- [ ] **TS-0501 — Redução de movimento**
  - Atender MOT-006 e TST-008.

- [ ] **TS-0502 — Fallback sem WebGL**
  - Fluxo completo continua utilizável.

- [ ] **TS-0503 — Acessibilidade**
  - Atender NFR-006 a NFR-010.

- [ ] **TS-0504 — Otimização**
  - Lazy loading, formatos modernos e apenas uma cena pesada ativa.

- [ ] **TS-0505 — Testes**
  - Executar TST-001 a TST-008 e registrar resultados.

- [ ] **TS-0506 — QA visual**
  - Capturar principais estados em mobile e desktop.
  - **Pronto quando:** recortes, textos, sobreposições e áreas vazias acidentais estiverem corrigidos.

## Fase 6 — Entrega

- [ ] **TS-0601 — Documentar execução**
  - Comandos, requisitos e estrutura de conteúdo.

- [ ] **TS-0602 — Documentar provisórios**
  - Informar ativos e dados que dependem do cliente.

- [ ] **TS-0603 — Disponibilizar protótipo**
  - Abrir preview funcional ou entregar URL/localização utilizável.

## Gate final

- [x] **TS-0507 — Recuperar a demonstração interativa da Casa 1 (10/10/2026)**
  - FR-003, FR-004, FR-005, FR-006; MOT-005; NFR-004, NFR-005, NFR-007; AC-002 a AC-005.
  - **Pronto quando:** servidor responder HTTP 200; Casa 1 renderizar um único canvas WebGL com 19 conjuntos de móveis no estágio 100; arraste, roda, toque e pinça alterarem a câmera; cobertura manual e contextual funcionarem; construção puder ser revertida; capturas desktop/mobile inspecionadas e testes sem erros de console.
  - Testes: TST-002, TST-003, TST-007, TST-008, verificador de interação da Casa 1.

O projeto só está concluído quando AC-001 a AC-007 forem demonstrados e todos os testes críticos estiverem aprovados.
