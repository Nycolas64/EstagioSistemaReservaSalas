const API_URL = 'http://localhost:8081/ambientes';
let ambienteEditando = null;

async function carregarAmbientes() {
    try {
        const response = await fetch(API_URL);
        const ambientes = await response.json();
        const lista = document.getElementById('listaAmbientes');
        lista.innerHTML = '';

        ambientes.forEach(ambiente => {
            const row = document.createElement('div');
            row.className = 'row-ambiente';
            row.innerHTML = `
                <span>${ambiente.nome}</span>
                <span>Capacidade ${ambiente.capacidade}, ${ambiente.equipamentos}.</span>
                <div class="card-actions">
                    <button class="btn-delete-row" onclick="deletarAmbiente(${ambiente.id})">Excluir</button>
                    <button class="btn-edit" onclick="prepararEdicao(${ambiente.id})">Editar</button>
                </div>
            `;
            lista.appendChild(row);
        });
    } catch (error) {
        console.error(error);
    }
}

function abrirModal() {
    ambienteEditando = null;
    document.getElementById('modalAmbiente').style.display = 'flex';
    document.getElementById('modalTitle').innerText = 'ADICIONANDO NOVA SALA';
    document.getElementById('formAmbiente').reset();
    document.getElementById('btnExcluirModal').style.display = 'none';
}

function fecharModal() {
    document.getElementById('modalAmbiente').style.display = 'none';
}

async function prepararEdicao(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const ambiente = await response.json();
        ambienteEditando = id;

        document.getElementById('modalTitle').innerText = `EDITANDO: ${ambiente.nome}`;
        document.getElementById('campoNome').value = ambiente.nome;
        document.getElementById('campoCapacidade').value = ambiente.capacidade;
        document.getElementById('campoEquipamentos').value = ambiente.equipamentos;
        document.getElementById('campoDescricao').value = ambiente.descricao || '';

        document.getElementById('btnExcluirModal').style.display = 'block';
        document.getElementById('modalAmbiente').style.display = 'flex';
    } catch (error) {
        console.error(error);
    }
}

async function deletarAmbiente(id) {
    if (confirm('Deseja realmente excluir este ambiente?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            carregarAmbientes();
        } catch (error) {
            console.error(error);
        }
    }
}

async function deletarNoModal() {
    if (ambienteEditando) {
        await deletarAmbiente(ambienteEditando);
        fecharModal();
    }
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

    try {
        await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        fecharModal();
        carregarAmbientes();
    } catch (error) {
        console.error(error);
    }
});

window.onload = carregarAmbientes;