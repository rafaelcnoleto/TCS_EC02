# EC02 - Gestão de Funcionários

Sistema de CRUD de funcionários em JavaScript puro (HTML + JS), com dados em memória e relatórios.

## Estrutura

| Arquivo | Descrição |
|---|---|
| `index.html` | Formulário, tabela e botões de relatórios |
| `funcionario.js` | Classe `Funcionario` (construtor, get/set, `atualizar()`, `toString()`) |
| `app.js` | CRUD, eventos `onclick`, funções anônimas, arrow functions e relatórios |
| `Dockerfile` | Imagem Nginx servindo os arquivos estáticos |
| `docker-compose.yml` | Ambiente de desenvolvimento com volumes |

## Como executar com Docker

```bash
docker compose up --build
```

Acesse: http://localhost:8080

Para parar: `docker compose down`

## Funcionalidades

- Cadastrar, listar, editar (dados carregados no formulário) e excluir funcionários
- Busca por ID e por nome com arrow functions (`find`, `filter`, `findIndex`)
- Relatórios: salário > R$ 5.000 (`filter`), média salarial (`reduce`),
  cargos únicos (`Set`) e nomes em maiúsculo (`map`)
- Comentário em `app.js` mostrando a troca de função anônima tradicional por arrow function

## Versionamento (GitHub)

```bash
git init
git add .
git commit -m "EC02: gestão de funcionários em JavaScript"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/estudo-caso-funcionarios.git
git push -u origin main
```
