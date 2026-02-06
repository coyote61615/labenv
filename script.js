document.addEventListener('DOMContentLoaded', () => {
    let bancoDados = [];
    let selecionados = [];

    const statusDiv = document.getElementById('status');
    const inputBusca = document.getElementById('inputBusca');
    const containerResultados = document.getElementById('resultados');
    const resumoContainer = document.getElementById('resumoContainer');
    const totalPrecoSpan = document.getElementById('totalPreco');
    const countSpan = document.getElementById('count');
    const btnLimpar = document.getElementById('btnLimpar');

    const normalizarTexto = (texto) => {
        return texto ? texto.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
    };

    // 1. Carregar Banco de Dados
    fetch('exames.json')
        .then(res => res.json())
        .then(data => {
            bancoDados = data;
            statusDiv.innerHTML = 'Pronto para pesquisar ✅';
        })
        .catch(() => statusDiv.innerHTML = 'Erro ao carregar dados ❌');

    // 2. Lógica de Busca
    inputBusca.addEventListener('input', (e) => {
        const termo = normalizarTexto(e.target.value);
        containerResultados.innerHTML = "";

        if (termo.length < 2) return;

        const filtrados = bancoDados.filter(item => {
            return Object.values(item).some(val => normalizarTexto(val).includes(termo));
        });

        filtrados.forEach(item => {
            const isSelected = selecionados.some(s => s.apelido === (item.codigo || item.apelido));
            const div = document.createElement('div');
            div.className = `card card-body card-exame shadow-sm ${isSelected ? 'selected' : ''}`;
            
            // Usamos item.codigo como "apelido" se não existir a chave apelido no JSON
            const apelido = item.apelido || item.codigo || 'S/A';

            div.innerHTML = `
                <div class="d-flex justify-content-between">
                    <h6 class="fw-bold mb-1">${item.exame}</h6>
                    <span class="text-primary fw-bold">R$ ${item.valor}</span>
                </div>
                <div class="small text-muted mb-1 text-uppercase">Apelido: ${apelido}</div>
                <div class="small text-secondary" style="font-size: 0.75rem;">${item.preparo}</div>
            `;

            div.onclick = () => alternarSelecao(item, div);
            containerResultados.appendChild(div);
        });
    });

    // 3. Lógica de Seleção e Soma
    function alternarSelecao(item, elemento) {
        const index = selecionados.findIndex(s => s.exame === item.exame);
        
        if (index > -1) {
            selecionados.splice(index, 1);
            elemento.classList.remove('selected');
        } else {
            selecionados.push(item);
            elemento.classList.add('selected');
        }
        atualizarResumo();
    }

    function atualizarResumo() {
        if (selecionados.length > 0) {
            resumoContainer.classList.remove('d-none');
            const total = selecionados.reduce((acc, item) => {
                const valorLimpo = parseFloat(item.valor.toString().replace(',', '.'));
                return acc + valorLimpo;
            }, 0);
            
            totalPrecoSpan.innerText = total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
            countSpan.innerText = selecionados.length;
        } else {
            resumoContainer.classList.add('d-none');
        }
    }

    btnLimpar.onclick = (e) => {
        e.preventDefault();
        selecionados = [];
        atualizarResumo();
        document.querySelectorAll('.card-exame').forEach(c => c.classList.remove('selected'));
    };
});
