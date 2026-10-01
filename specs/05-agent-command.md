# 05 — Comando para o agente implementador

Você deverá conduzir este projeto obrigatoriamente com a metodologia **Spec-Driven Development (Spec-Driven / SpecDrive)**.

Implemente o protótipo Terra Santa descrito neste pacote SpecDrive. A especificação deve orientar as decisões, a implementação, os testes e a validação. Não programe funcionalidades que não estejam cobertas pela especificação sem primeiro registrar a mudança no documento correspondente.

Leia integralmente, nesta ordem:

1. `README.md`
2. `01-product-spec.md`
3. `02-experience-spec.md`
4. `03-technical-spec.md`
5. `04-implementation-tasks.md`

Trate esses arquivos como a fonte de verdade do projeto. Antes de editar, inspecione o workspace, as instruções do repositório e os dois arquivos visuais indicados no README.

## Protocolo SpecDrive obrigatório

Para cada funcionalidade:

1. identifique os requisitos `FR`, `NFR`, `MOT` e `AC` relacionados;
2. confirme que a tarefa `TS` correspondente possui definição de pronto;
3. implemente somente depois dessa verificação;
4. crie ou atualize os testes `TST` relacionados;
5. execute os testes e verifique visualmente o resultado;
6. registre a evidência de conclusão;
7. marque a tarefa como concluída somente quando todos os critérios forem satisfeitos.

Se surgir uma decisão, mudança ou funcionalidade não prevista, atualize primeiro a especificação, registre a justificativa e só depois altere o código. Não permita divergência silenciosa entre especificação e implementação.

Regras de execução:

- Não entregue apenas um plano: implemente, execute, teste e apresente o protótipo.
- Siga Spec-Driven Development durante todo o trabalho; a especificação é um artefato vivo e versionado.
- Trabalhe pelas tarefas `TS` na ordem das fases.
- Preserve alterações existentes e não sobrescreva trabalho do usuário.
- Use os requisitos `FR`, `NFR`, `MOT`, `AC` e `TST` como critérios verificáveis.
- Não use a expressão proibida na interface.
- Não invente medidas, preços ou características arquitetônicas como fatos.
- Mantenha conteúdo e ativos substituíveis por meio do modelo de dados central.
- Se não houver modelo 3D real, implemente a melhor simulação possível e continue.
- Priorize o fluxo mobile de aproximadamente 390 × 844 px sem prejudicar a apresentação em desktop.
- Faça a casa-piloto funcionar completamente antes de replicar o sistema.
- Utilize geração de imagens apenas quando ela ajudar a criar ativos conceituais coerentes e substituíveis.
- Verifique visualmente cada estado importante.
- Corrija erros de console, build, testes, responsividade e acessibilidade antes da entrega.

Ao concluir, reporte:

1. tarefas `TS` concluídas;
2. requisitos demonstrados;
3. testes executados e resultados;
4. dados e ativos ainda provisórios;
5. localização ou URL do protótipo;
6. instruções de execução;
7. informações que ainda precisam ser solicitadas ao cliente.

Inclua também uma matriz final de rastreabilidade no formato:

`Requisito → Tarefa → Implementação → Teste → Evidência`

Comece agora pela tarefa `TS-0001` e prossiga autonomamente até o gate final.
