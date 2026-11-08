// ===== Armazenamento em memória =====
const funcionarios = [];
let proximoId = 1;
let idEmEdicao = null; // null = modo cadastro; número = ID do funcionário em edição

// ===== Referências do DOM =====
const inputNome = document.getElementById("nome");
const inputIdade = document.getElementById("idade");
const inputCargo = document.getElementById("cargo");
const inputSalario = document.getElementById("salario");
const btnSalvar = document.getElementById("btn-salvar");
const btnCancelar = document.getElementById("btn-cancelar");
const tabela = document.getElementById("tabela-funcionarios");
const relatorio = document.getElementById("relatorio");

/*
 * ===== Função anônima tradicional x arrow function (Exercício 3) =====
 *
 * Versão tradicional (função anônima):
 *   const buscarPorIdAntigo = function (id) {
 *     return funcionarios.find(function (f) { return f.id === id; });
 *   };
 *
 * Versão com arrow function (lambda) - usada neste sistema:
 *   const buscarPorId = (id) => funcionarios.find((f) => f.id === id);
 */

// ===== Manipulação do array com arrow functions =====
const buscarPorId = (id) => funcionarios.find((f) => f.id === id);
const buscarPorNome = (nome) =>
  funcionarios.filter((f) => f.nome.toLowerCase().includes(nome.toLowerCase()));

const adicionarFuncionario = (nome, idade, cargo, salario) => {
  const funcionario = new Funcionario(proximoId++, nome, idade, cargo, salario);
  funcionarios.push(funcionario);
  return funcionario;
};

const removerFuncionario = (id) => {
  const indice = funcionarios.findIndex((f) => f.id === id);
  if (indice !== -1) funcionarios.splice(indice, 1);
};

const atualizarFuncionario = (id, nome, idade, cargo, salario) => {
  const funcionario = buscarPorId(id);
  if (funcionario) funcionario.atualizar(nome, idade, cargo, salario);
  return funcionario;
};

// ===== Funções do formulário =====
const formularioValido = () =>
  inputNome.value.trim() !== "" &&
  inputCargo.value.trim() !== "" &&
  inputIdade.value !== "" && Number(inputIdade.value) >= 0 &&
  inputSalario.value !== "" && Number(inputSalario.value) >= 0;

const limparFormulario = () => {
  inputNome.value = "";
  inputIdade.value = "";
  inputCargo.value = "";
  inputSalario.value = "";
  idEmEdicao = null;
  btnSalvar.textContent = "Cadastrar";
  btnCancelar.hidden = true;
};

// ===== Renderização da tabela =====
const criarCelula = (texto) => {
  const td = document.createElement("td");
  td.textContent = texto; // textContent evita injeção de HTML
  return td;
};

const renderizarTabela = () => {
  tabela.innerHTML = "";

  funcionarios.forEach((f) => {
    const tr = document.createElement("tr");
    tr.appendChild(criarCelula(f.id));
    tr.appendChild(criarCelula(f.nome));
    tr.appendChild(criarCelula(f.idade));
    tr.appendChild(criarCelula(f.cargo));
    tr.appendChild(criarCelula(Funcionario.formatarMoeda(f.salario)));

    const tdAcoes = document.createElement("td");

    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.textContent = "Editar";
    btnEditar.onclick = function () { // função anônima no evento onclick
      inputNome.value = f.nome;
      inputIdade.value = f.idade;
      inputCargo.value = f.cargo;
      inputSalario.value = f.salario;
      idEmEdicao = f.id;
      btnSalvar.textContent = "Salvar alterações";
      btnCancelar.hidden = false;
    };

    const btnExcluir = document.createElement("button");
    btnExcluir.type = "button";
    btnExcluir.textContent = "Excluir";
    btnExcluir.onclick = () => { // mesma ideia, agora como arrow function
      if (confirm(`Excluir o funcionário ${f.nome}?`)) {
        removerFuncionario(f.id);
        if (idEmEdicao === f.id) limparFormulario();
        renderizarTabela();
      }
    };

    tdAcoes.appendChild(btnEditar);
    tdAcoes.appendChild(btnExcluir);
    tr.appendChild(tdAcoes);
    tabela.appendChild(tr);
  });
};

// ===== Eventos do formulário =====
btnSalvar.onclick = function () { // função anônima tradicional
  if (!formularioValido()) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const nome = inputNome.value.trim();
  const idade = Number(inputIdade.value);
  const cargo = inputCargo.value.trim();
  const salario = Number(inputSalario.value);

  if (idEmEdicao === null) {
    const novo = adicionarFuncionario(nome, idade, cargo, salario);
    console.log(`Cadastrado: ${novo.toString()}`);
  } else {
    const editado = atualizarFuncionario(idEmEdicao, nome, idade, cargo, salario);
    console.log(`Atualizado: ${editado.toString()}`);
  }

  limparFormulario();
  renderizarTabela();
};

btnCancelar.onclick = () => limparFormulario(); // arrow function

// ===== Relatórios (map, filter, reduce, Set) =====
const mostrarRelatorio = (titulo, linhas) => {
  relatorio.innerHTML = "";

  const h3 = document.createElement("h3");
  h3.textContent = titulo;
  relatorio.appendChild(h3);

  const ul = document.createElement("ul");
  linhas.forEach((linha) => {
    const li = document.createElement("li");
    li.textContent = linha;
    ul.appendChild(li);
  });
  relatorio.appendChild(ul);
};

const semFuncionarios = () => {
  if (funcionarios.length === 0) {
    mostrarRelatorio("Relatório", ["Nenhum funcionário cadastrado."]);
    return true;
  }
  return false;
};

// filter + map
document.getElementById("btn-salario-alto").onclick = () => {
  if (semFuncionarios()) return;
  const altos = funcionarios
    .filter((f) => f.salario > 5000)
    .map((f) => f.toString());
  mostrarRelatorio(
    "Funcionários com salário maior que R$ 5.000,00",
    altos.length ? altos : ["Nenhum funcionário com salário acima de R$ 5.000,00."]
  );
};

// map + reduce
document.getElementById("btn-media").onclick = () => {
  if (semFuncionarios()) return;
  const media =
    funcionarios.map((f) => f.salario).reduce((soma, s) => soma + s, 0) /
    funcionarios.length;
  mostrarRelatorio("Média salarial", [Funcionario.formatarMoeda(media)]);
};

// map + Set
document.getElementById("btn-cargos").onclick = () => {
  if (semFuncionarios()) return;
  const cargosUnicos = [...new Set(funcionarios.map((f) => f.cargo))];
  mostrarRelatorio("Cargos únicos", cargosUnicos);
};

// map
document.getElementById("btn-maiusculo").onclick = () => {
  if (semFuncionarios()) return;
  const nomes = funcionarios.map((f) => f.nome.toUpperCase());
  mostrarRelatorio("Nomes em maiúsculo", nomes);
};

renderizarTabela();
