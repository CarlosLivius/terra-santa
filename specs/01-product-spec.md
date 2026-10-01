# 01 — Especificação de Produto

## 1. Objetivo

Criar um protótipo mobile-first de alto impacto para a incorporadora Terra Santa, capaz de apresentar quatro modelos residenciais por meio de exploração, construção visual e descoberta progressiva.

O protótipo deverá demonstrar como o produto final ajudará uma pessoa a:

- compreender os modelos;
- explorar exterior, planta e ambientes;
- comparar alternativas;
- reconhecer preferências pessoais;
- chegar naturalmente ao modelo mais compatível;
- manifestar interesse comercial.

## 2. Resultado esperado

Ao final da experiência, o visitante deve sentir que conheceu as residências, não apenas que viu suas fichas técnicas.

O protótipo será considerado bem-sucedido quando:

1. puder ser demonstrado integralmente em um celular;
2. apresentar uma jornada contínua e compreensível sem tutorial longo;
3. permitir explorar pelo menos uma casa-piloto em profundidade;
4. representar os quatro modelos em uma estrutura substituível;
5. registrar preferências e gerar uma recomendação explicável;
6. funcionar sem modelos 3D arquitetônicos definitivos.

## 3. Público

### Público primário

Potenciais compradores que precisam entender diferenças práticas entre modelos residenciais antes de conversar com um consultor.

### Contextos de uso

- exploração autônoma no celular;
- apresentação presencial por um corretor;
- demonstração em tablet ou notebook;
- envio de link por WhatsApp.

## 4. Posicionamento

### Deve transmitir

- permanência;
- acolhimento;
- natureza;
- construção cuidadosa;
- arquitetura acessível;
- sofisticação silenciosa.

### Não deve transmitir

- catálogo genérico;
- tecnologia pela tecnologia;
- luxo ostensivo;
- jogo infantil;
- formulário comercial agressivo;
- template imobiliário.

## 5. Vocabulário

### Expressões permitidas

- residências;
- modelos;
- descubra seu lugar;
- conheça a residência;
- explore os ambientes;
- seu modo de viver;
- tenho interesse.

### Expressão proibida

- “showroom digital”.

## 6. Escopo funcional

### FR-001 — Abertura de marca

O sistema deve apresentar uma abertura curta em que linhas orgânicas inspiradas na árvore da marca dão origem ao terreno ou à planta da residência.

**Aceite:** a abertura pode ser pulada e não impede a navegação após no máximo 4 segundos.

### FR-002 — Território dos quatro modelos

O sistema deve representar quatro residências em uma composição espacial ou narrativa, sem usar uma grade convencional como primeira forma de seleção.

**Aceite:** o visitante consegue identificar e abrir qualquer um dos quatro modelos.

### FR-003 — Construção progressiva

Ao entrar em um modelo, o sistema deve representar sua evolução entre terreno, planta, estrutura e residência concluída.

**Aceite:** o visitante influencia o progresso por scroll, arrasto ou gesto equivalente; a animação pode ser revertida.

### FR-004 — Exploração externa

O visitante deve conseguir observar a residência por diferentes ângulos.

**Aceite:** quando não houver modelo 3D real, deve existir uma simulação convincente por camadas, imagens sequenciais ou modelo procedimental.

### FR-005 — Planta aberta

O sistema deve oferecer uma visualização superior ou “sem teto”.

**Aceite:** a planta humanizada fornecida é utilizada como referência no modelo compatível, sem declarar hipóteses como dados confirmados.

### FR-006 — Ambientes interativos

O visitante deve conseguir selecionar ambientes ou hotspots e visualizar conteúdo contextual.

**Aceite:** a casa-piloto possui pelo menos quatro hotspots funcionais.

### FR-007 — Variação de atmosfera

O visitante deve conseguir alternar ao menos entre dia e entardecer/noite.

**Aceite:** a mudança afeta visualmente a residência ou a cena, não apenas o rótulo do botão.

### FR-008 — Favoritos

O visitante deve poder favoritar e desfavoritar modelos.

**Aceite:** o estado permanece durante a sessão e influencia a recomendação.

### FR-009 — Comparação

O visitante deve comparar dois modelos sem receber uma tabela excessivamente densa.

**Aceite:** somente características confirmadas são tratadas como fatos; dados ausentes aparecem como “a confirmar”.

### FR-010 — Preferências implícitas

O sistema deve registrar sinais da exploração, incluindo favoritos, tempo/abertura de ambientes e diferenciais selecionados.

**Aceite:** o registro ocorre localmente e pode ser reiniciado.

### FR-011 — Recomendação

O sistema deve recomendar uma residência a partir das interações.

**Aceite:** a recomendação informa de forma simples quais sinais contribuíram para o resultado e não afirma usar inteligência artificial.

### FR-012 — Interesse comercial

O protótipo deve concluir com uma ação “Tenho interesse” ou “Falar com um consultor”.

**Aceite:** em modo protótipo, a ação pode abrir uma confirmação simulada. Não deve enviar dados ou mensagens reais sem configuração explícita posterior.

### FR-013 — Conteúdo substituível

Todas as informações de residências devem vir de um arquivo central de dados.

**Aceite:** nome, imagens, características, hotspots e textos podem ser alterados sem modificar componentes da interface.

### FR-014 — Reinício da experiência

O visitante deve conseguir reiniciar preferências e retornar ao território inicial.

**Aceite:** a ação limpa favoritos, sinais e recomendação da sessão.

## 7. Dados iniciais

### Modelo `casa-1`

- Nome visível provisório: Casa 1;
- Quartos: 2;
- Banheiros: 1;
- Sala: sim;
- Cozinha: sim;
- Demais características: a confirmar.

### Modelo `casa-2`

- Nome visível provisório: Casa 2;
- Quartos: 3;
- Suítes: 1;
- Demais características: a confirmar;
- Possível associação com a planta fornecida: não confirmada.

### Modelos `casa-3` e `casa-4`

- Conteúdo estrutural provisório;
- Sem especificações apresentadas como fatos;
- Devem demonstrar a experiência e permitir substituição futura.

## 8. Fora do escopo inicial

- orçamento real;
- financiamento;
- disponibilidade de unidades;
- login;
- CRM;
- envio real de leads;
- renderização arquitetônica certificada;
- realidade aumentada;
- passeio VR completo;
- backend de conteúdo.

## 9. Critérios globais de aceite

### AC-001

Nenhuma tela utiliza a expressão proibida.

### AC-002

Todos os controles visíveis executam uma ação observável.

### AC-003

O fluxo completo funciona em viewport de aproximadamente 390 × 844 px.

### AC-004

O protótipo também é apresentável em desktop, sem áreas quebradas ou conteúdo ilegível.

### AC-005

Ausência de erros não tratados no console durante o fluxo principal.

### AC-006

Todas as hipóteses arquitetônicas estão isoladas no modelo de dados ou documentação, não apresentadas como confirmação comercial.

### AC-007

O usuário consegue chegar do início à recomendação e ao interesse sem ficar preso.
