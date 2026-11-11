# RNG-Roguelike--LPW

Iremos fazer um jogo baseado em cliques, sorte, estratégia e sistema de raridades

## Página de ranking

Arquivos: `ranking.html`, `ranking.css` e `ranking.js`.

O ranking fica no `localStorage`, na chave `ranking`, como uma lista em JSON:

```json
[{ "nome": "Maria", "pontos": 1520, "data": "2026-11-10T14:03:00.000Z" }]
```

- Cada jogador aparece uma vez, com a melhor pontuação dele.
- A página lê os pontos atuais da chave `dinheiro` (a mesma usada por `scriptIndex.js`).
- Outras páginas podem registrar pontos chamando `registrarPontuacao(nome, pontos)`
  (basta carregar `ranking.js` antes) ou gravando direto na chave `ranking` no formato acima.
- O tema escuro fica salvo na chave `tema` (`"escuro"` ou `"claro"`).