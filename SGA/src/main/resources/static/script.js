const API_URL = '/ambientes';
let ambienteEditando = null;

async function carregarAmbientes() {
    const response = await fetch(API_URL);
    const ambientes = await response.json();
    const lista = document.getElementById('listaAmbientes');
    lista.innerHTML = '';

    ambientes.forEach(ambiente => {
        const card = document.createElement('div');
        card.className = 'card-punk';
        card.innerHTML = `
            <h2>${ambiente.nome}</h2>
            <p><strong>CAPACIDADE:</strong> ${ambiente.capacidade}</p>
            <p><strong>EQUIPAMENTOS:</strong> ${ambiente.equipamentos}</p>
            <p class="desc">${ambiente.descricao}</p>
            <div class="card-actions">
                <button class="btn-edit" onclick="prepararEdicao(${ambiente.id})">EDITAR</button>
            </div>
        `;
        lista.appendChild(card);
    });
}

function abrirModal() {
    document.getElementById('modalAmbiente').style.display = 'flex';
    document.getElementById('modalTitle').innerText = 'NOVO AMBIENTE';
    document.getElementById('formAmbiente').reset();
    ambienteEditando = null;
}

function fecharModal() {
    document.getElementById('modalAmbiente').style.display = 'none';
}

async function prepararEdicao(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const ambiente = await response.json();
    ambienteEditando = id;

    const form = document.getElementById('formAmbiente');
    document.getElementById('modalTitle').innerText = 'EDITAR AMBIENTE';

    document.getElementById('campoNome').value = ambiente.nome;
    document.getElementById('campoCapacidade').value = ambiente.capacidade;
    document.getElementById('campoEquipamentos').value = ambiente.equipamentos;
    document.getElementById('campoDescricao').value = ambiente.descricao;

    document.getElementById('modalAmbiente').style.display = 'flex';
}

document.getElementById('formAmbiente').addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        nome: document.getElementById('campoNome').value,
        capacidade: parseInt(document.getElementById('campoCapacidade').value),
        equipamentos: document.getElementById('campoEquipamentos').value,
        descricao: document.getElementById('campoDescricao').value
    };

    const metodo = ambienteEditando ? 'PUT' : 'POST';
    const url = ambienteEditando ? `${API_URL}/${ambienteEditando}` : API_URL;

    await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    fecharModal();
    carregarAmbientes();
});


window.onload = carregarAmbientes;