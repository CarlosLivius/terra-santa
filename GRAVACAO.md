# Terra Santa — demonstração da Casa 1

Endereço local: http://127.0.0.1:5173/

Abra a Casa 1 e aguarde a apresentação finalizar. O modelo termina mobiliado, com teto aberto e exploração ativa.

- Arraste com o botão esquerdo para girar; use a roda para aproximar.
- Botão direito arrastado desloca o enquadramento.
- No celular, um dedo gira; dois dedos aproximam e deslocam.
- Os botões de ambientes aproximam os cômodos. “Restaurar vista” reenquadra a casa inteira.
- “Cobrir” alterna o teto; ao aproximar, ele abre automaticamente.
- A barra de construção permite voltar à planta e reconstruir até 100%.

## Reiniciar depois de fechar o computador

No PowerShell, na pasta do projeto:

```powershell
Set-Location 'C:\Users\raque\Documents\Codex\2026-10-01\05-comando-para-o-agente-implementador'
npm run build
npm run preview -- --configLoader runner --port 5173 --strictPort
```

Mantenha esse terminal aberto. Para desenvolvimento, use `npm run dev -- --port 5173 --strictPort`.

Verificação registrada em `evidence/recording-validation.json`, imagens em `evidence/recording-*.png` e rastreabilidade em `specs/06-decisions-and-evidence.md`, D033.
