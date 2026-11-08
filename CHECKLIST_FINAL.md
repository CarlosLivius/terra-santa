# Checklist de entrega — Terra Santa

Use este documento como roteiro de aceite. Cada item só deve ser marcado quando for conferido no navegador, em uma sessão limpa.

## 1. Conteúdo e catálogo

- [x] O catálogo público contém somente três casas: Casa Buriti, Casa Rio Corrente e Casa Vereda.
- [x] Cada casa possui nome, tagline e texto de apresentação próprios.
- [x] Não há “Casa 4” acessível pela home, seleção, comparação ou navegação principal.
- [ ] Textos comerciais finais foram revisados e aprovados pela cliente.
- [ ] Nenhum dado de preço, rentabilidade, metragem ou condição foi publicado sem confirmação.

## 2. Organização dos ativos

- [x] Os ativos estão separados em `public/assets/casa1`, `casa2` e `casa3`.
- [x] Cada pasta contém apenas imagens destinadas à respectiva residência.
- [x] Buriti usa planta atualizada, fachadas frontal/lateral, sala, cozinha e quarto.
- [x] Rio Corrente usa planta atualizada, fachada aérea, sala e cozinha.
- [x] Vereda usa planta atualizada, fachada, vista panorâmica, sala e varanda.
- [ ] Conferir visualmente cada miniatura para garantir que nenhuma imagem está associada à casa errada.
- [ ] Substituir imagens conceituais por imagens aprovadas quando a cliente fornecer versões finais.
- [ ] Confirmar direitos de uso, resolução e compressão dos arquivos finais.

## 3. Home

- [x] A home permite selecionar as três residências.
- [x] A troca entre residências possui transição animada e painel sincronizado.
- [x] A imagem principal ocupa corretamente a área de apresentação.
- [ ] Testar a troca rápida 1 → 2 → 3 → 1 sem estado quebrado ou imagem atrasada.
- [ ] Testar teclado: Tab, Enter, setas e foco visível nos seletores.
- [ ] Testar toque no celular e orientação vertical/horizontal.
- [ ] Confirmar que não existe overflow horizontal em nenhuma largura.

## 4. Landing pages

- [x] Existem páginas independentes para as três casas.
- [x] Cada página possui pelo menos seis capítulos/seções comerciais.
- [x] A apresentação começa pela fachada correta da casa.
- [x] A planta aparece na seção planejada e abre em modal ampliável.
- [x] Galeria possui setas, miniaturas, toque, teclado e controle de progresso.
- [x] O carrossel de momentos usa o título “Momentos”.
- [ ] Confirmar manualmente que cada slide mantém alinhamento central do começo ao fim.
- [ ] Confirmar que a galeria não desloca para a direita após o último slide.
- [ ] Confirmar que nenhum slide genérico ou repetido aparece na Buriti.
- [ ] Conferir espaçamento de títulos, subtítulos e CTAs em 390px, 768px e desktop.

## 5. Navegação e ações

- [ ] Todos os botões possuem ação real ou estado desabilitado explícito.
- [ ] “Conhecer a residência” rola para a seção correta.
- [ ] “Explorar em 3D” abre a tela 3D da casa selecionada.
- [ ] “Comparar residências” leva à comparação sem perder a casa de origem.
- [ ] “Descobrir minha casa ideal” abre o fluxo de recomendação.
- [ ] Modais fecham por botão, Escape e clique fora quando aplicável.
- [ ] Nenhum link abre uma aba vazia ou aponta para rota inexistente.

## 6. Experiência 3D

- [x] Cada casa possui uma cena procedural distinta.
- [x] A cena permite giro, zoom, pan e retorno ao enquadramento inicial.
- [x] Há distinção entre vista externa e vista interna quando disponível.
- [x] A tela informa honestamente que o modelo é conceitual.
- [ ] Testar WebGL em Chrome e Edge.
- [ ] Testar interação com mouse, trackpad e toque.
- [ ] Confirmar que fechar o 3D retorna à landing sem perder o scroll.
- [ ] Substituir protótipos por modelos arquitetônicos aprovados caso sejam fornecidos.

## 7. Responsividade e acessibilidade

- [ ] Validar home em 390×844, 768×1024 e 1440×900.
- [ ] Validar as três landing pages nas mesmas larguras.
- [ ] Confirmar contraste mínimo de textos sobre imagens.
- [ ] Confirmar alt text descritivo nas imagens principais e plantas.
- [ ] Confirmar foco visível e ordem de Tab coerente.
- [x] Movimento reduzido desativa animações decorativas e rolagem forçada.
- [ ] Confirmar que o bottom menu não cobre CTAs ou controles em telas pequenas.

## 8. Qualidade técnica

- [x] `npm run build` passa.
- [x] `npm run test` passa (16 testes no estado atual).
- [x] ESLint dos arquivos alterados passa.
- [ ] Adicionar testes de navegação e associação de imagens por residência.
- [ ] Otimizar o chunk do Three.js com divisão de código, se o desempenho exigir.
- [ ] Verificar console do navegador sem erros durante home, modal, galeria e 3D.
- [ ] Verificar carregamento sem rede após os assets locais estarem consolidados.

## 9. Aceite final da cliente

- [ ] Cliente aprova nomes, textos e chamadas comerciais.
- [ ] Cliente aprova as imagens de fachada, interiores e plantas de cada casa.
- [ ] Cliente aprova a distinção visual entre Buriti, Rio Corrente e Vereda.
- [ ] Cliente aprova a experiência mobile.
- [ ] Cliente aprova o 3D conceitual ou fornece modelos finais.
- [ ] Cliente aprova a gravação demonstrativa.

## Comandos de verificação

```powershell
npm run build
npm run test
npx eslint src/ResidenceLanding.tsx src/data/residences.ts src/state/preferences.ts tests/preferences.test.ts
npm run dev
```

Servidor local esperado: `http://127.0.0.1:5173/`

## Critério de pronto

O app só deve ser considerado finalizado quando todos os itens marcados como pendentes forem conferidos, os itens de aceite da cliente estiverem aprovados e não houver erro no console ou overflow visual nas três casas.
