var selectedRow = null;
function submeterForm(e) {
    event.preventDefault();
    var formData = lerDados();
    if (!validarCampos(formData)) {
        alert("Por favor, preencha todos os campos antes de salvar.");
        return;
    }
    if (selectedRow === null) {
        inserirNovosDados(formData);
    } else {
        atualizarDados(formData)
    }
    salvarNoLocalStorage();
    limparFormulario();
}

// Ler os dados do formulario
function lerDados() {
    var formData = {};
    formData["nomeComp"] = document.getElementById("nomeComp").value;
    formData["idade"] = document.getElementById("idade").value;
    formData["salario"] = document.getElementById("salario").value;
    formData["cidade"] = document.getElementById("cidade").value;
    return formData;
}

// Validar que todos os campos foram preenchidos
function validarCampos(data) {
    return data.nomeComp.trim() !== "" &&
           data.idade.trim() !== "" &&
           data.salario.trim() !== "" &&
           data.cidade.trim() !== "";
}

//Controle de páginas - Paginação
const registrosPorPagina = 7;
let paginaAtual = 1;

function atualizarPaginacao() {
    const tabela = document.querySelector("#listaEmpregados tbody");
    const linhas = tabela.querySelectorAll("tr");
    const totalPaginas = Math.ceil(linhas.length / registrosPorPagina);

    // Esconde todas as linhas
    linhas.forEach((linha, index) => {
        linha.style.display = (index >= (paginaAtual - 1) * registrosPorPagina && index < paginaAtual * registrosPorPagina) ? "" : "none";
    });

    // Controles de página
    const container = document.getElementById("paginacao");
    container.innerHTML = "";

    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        btn.className = (i === paginaAtual) ? "ativo" : "";
        btn.onclick = () => {
            paginaAtual = i;
            atualizarPaginacao();
        };
        container.appendChild(btn);
    }
}
// Atualiza após adicionar/remover linha
function atualizarTabelaComPaginacao() {
    atualizarPaginacao();
    salvarNoLocalStorage(); 
}

// Cria a a tabela de dados inseridos
function inserirNovosDados(data) {
    var table = document.getElementById("listaEmpregados").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);

    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.nomeComp;

    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.idade;

    var cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.salario;

    var cell4 = newRow.insertCell(3);
    cell4.innerHTML = data.cidade;

    var cell5 = newRow.insertCell(4);
    cell5.innerHTML = `
        <button class="btn-editar" onclick="editadadosIns(this)">🖊️ Editar</button>
        <button class="btn-apagar" onclick="apagaDados(this)">🗑️ Apagar</button>
    `;
    atualizarTabelaComPaginacao();
}

// Apaga os dados inseridos
function limparFormulario() {
    if (confirm("Tem certeza que deseja SALVAR os dados no formulário?")) {
        document.getElementById('nomeComp').value = '';
        document.getElementById('idade').value = '';
        document.getElementById('salario').value = '';
        document.getElementById('cidade').value = '';
        selectedRow = null;
    }
}
function limparCampos(){
    document.getElementById('nomeComp').value = '';
    document.getElementById('idade').value = '';
    document.getElementById('salario').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('filtro').value = '';
    selectedRow = null;
    filtrarTabela();
}

// Edita e atualiza os dados inseridos
function editadadosIns(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById('nomeComp').value = selectedRow.cells[0].innerHTML;
    document.getElementById('idade').value = selectedRow.cells[1].innerHTML;
    document.getElementById('salario').value = selectedRow.cells[2].innerHTML;
    document.getElementById('cidade').value = selectedRow.cells[3].innerHTML;
}
function atualizarDados(formData) {
    selectedRow.cells[0].innerHTML = formData.nomeComp;
    selectedRow.cells[1].innerHTML = formData.idade;
    selectedRow.cells[2].innerHTML = formData.salario;
    selectedRow.cells[3].innerHTML = formData.cidade;
}

// Limpar os Dados Inseridos
function limparFormularioComConfirmacao() {
    if (confirm('Deseja realmente LIMPAR os dados do formulário?')) {
        limparCampos();
    }
}

// Apagar os Dados Inseridos
function apagaDados(td) {
    if (confirm("Tem certeza que deseja apagar os dados?")) {
        const row = td.parentElement.parentElement;
        row.remove();
        atualizarTabelaComPaginacao();
        limparCampos();
    }
}

//Filtra a tabela por nome
function filtrarTabela() {
    const filtro = document.getElementById("filtro").value.toLowerCase();
    const linhas = document.querySelectorAll("#listaEmpregados tbody tr");

    linhas.forEach(linha => {
        const nome = linha.cells[0].textContent.toLowerCase();
        const cidade = linha.cells[3].textContent.toLowerCase();
        linha.style.display = (nome.includes(filtro)) ? "" : "none";
    });
}

// Remove todas as linhas
function apagarTudo() {
    if (confirm("Tem certeza que deseja DELETAR todos os dados?")) {
        const tabela = document.getElementById("listaEmpregados").getElementsByTagName('tbody')[0];
        tabela.innerHTML = ''; 
        localStorage.removeItem("empregados"); 
        selectedRow = null;
        apagaDadosForm();
    }
}

// Exposta o arquivo em CSV
function exportarParaCSV() {
    const linhas = [["Nome Completo", "Idade", "Salário", "Cidade"]];
    const rows = document.querySelectorAll("#listaEmpregados tbody tr");

    rows.forEach(row => {
        const dados = Array.from(row.querySelectorAll("td"))
            .slice(0, 4)
            .map(td => td.textContent);
        linhas.push(dados);
    });

    const csv = linhas.map(linha => linha.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "lista_empregados.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

//Formata o campo salário
document.addEventListener("DOMContentLoaded", function () {
    const salarioInput = document.getElementById("salario");

    salarioInput.addEventListener("input", function (e) {
        let valor = e.target.value.replace(/[^\d]/g, "");
        valor = (parseInt(valor, 10) / 100).toFixed(2);
        e.target.value = "R$ " + valor.replace('.', ',');
    });
});

function ordenarPorNome() {
    const tbody = document.querySelector("#listaEmpregados tbody");
    const linhas = Array.from(tbody.querySelectorAll("tr"));

    linhas.sort((a, b) => {
        const nomeA = a.cells[0].textContent.trim().toLowerCase();
        const nomeB = b.cells[0].textContent.trim().toLowerCase();
        return nomeA.localeCompare(nomeB);
    });

    linhas.forEach(linha => tbody.appendChild(linha));

    salvarNoLocalStorage(); // Atualiza o localStorage com a nova ordem
}


//Armazena todos os dados no Local Storage
function carregarDoLocalStorage() {
    const dados = JSON.parse(localStorage.getItem("empregados")) || [];

    dados.forEach(emp => {
        inserirNovosDados(emp);
    });
}

function salvarNoLocalStorage() {
    const tabela = document.getElementById("listaEmpregados").getElementsByTagName('tbody')[0];
    const dados = [];

    for (let i = 0; i < tabela.rows.length; i++) {
        const row = tabela.rows[i].cells;
        dados.push({
            nomeComp: row[0].innerText,
            idade: row[1].innerText,
            salario: row[2].innerText,
            cidade: row[3].innerText
        });
    }

    localStorage.setItem("empregados", JSON.stringify(dados));
}
  
carregarDoLocalStorage();

atualizarTabelaComPaginacao();

