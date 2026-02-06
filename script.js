document.addEventListener('DOMContentLoaded', () => {
    let bancoDados = [];
    let listaOrcamento = [];

    const inputBusca = document.getElementById('inputBusca');
    const containerResultados = document.getElementById('resultados');
    const painelOrcamento = document.getElementById('painelOrcamento');
    const listaItensDiv = document.getElementById('listaItens');
    const valorTotalSpan = document.getElementById('valorTotal');
    const statusDiv = document.getElementById('status');

    // Função para normalizar texto
    const normalizar = (t) => t ? t.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

    // 1. Carrega o JSON
    fetch('exames.json')
        .then(res => res.json())
        .then(data => {
            bancoDados = data;
            statusDiv.innerText = "Sistema Pronto ✅";
        }).catch(() => statusDiv.innerText = "Erro ao carregar dados ❌");

    // 2. Busca
    inputBusca.addEventListener('input', (e) => {
        const termo = normalizar(e.target.value);
        containerResultados.innerHTML = "";
        if (termo.length < 2) return;

        const filtrados = bancoDados.filter(item => 
            normalizar(item.exame).includes(termo) || 
            normalizar(item.apelido || item.codigo).includes(termo)
        );

        filtrados.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card card-body card-exame shadow-sm';
            card.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold text-dark">${item.exame}</div>
                        <small class="text-muted">Apelido: ${item.apelido || item.codigo}</small>
                    </div>
                    <div class="text-primary fw-bold">R$ ${item.valor}</div>
                </div>
            `;
            card.onclick = () => adicionarAoOrcamento(item);
            containerResultados.appendChild(card);
        });
    });

    // 3. Adicionar e Somar
    function adicionarAoOrcamento(item) {
        listaOrcamento.push(item);
        atualizarInterface();
        
        // Feedback visual rápido
        inputBusca.value = ""; 
        containerResultados.innerHTML = "";
    }

    function atualizarInterface() {
        if (listaOrcamento.length > 0) {
            painelOrcamento.classList.remove('d-none');
        } else {
            painelOrcamento.classList.add('d-none');
        }

        // Limpa e reconstrói a lista de itens clicados
        listaItensDiv.innerHTML = "";
        let total = 0;

        listaOrcamento.forEach((item, index) => {
            const valorNumerico = parseFloat(item.valor.toString().replace(',', '.'));
            total += valorNumerico;

            const div = document.createElement('div');
            div.className = 'item-selecionado';
            div.innerHTML = `
                <span>${item.exame}</span>
                <span class="text-muted">R$ ${item.valor} 
                    <i class="bi bi-x-circle text-danger ms-2" onclick="removerItem(${index})"></i>
                </span>
            `;
            listaItensDiv.appendChild(div);
        });

        valorTotalSpan.innerText = total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    }

    // Função para remover um item específico da lista
    window.removerItem = (index) => {
        listaOrcamento.splice(index, 1);
        atualizarInterface();
    };

    document.getElementById('btnLimpar').onclick = () => {
        listaOrcamento = [];
        atualizarInterface();
    };
});
