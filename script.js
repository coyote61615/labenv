document.addEventListener('DOMContentLoaded', () => {
    let bancoDados = [];
    const statusDiv = document.getElementById('status');
    const inputBusca = document.getElementById('inputBusca');
    const containerResultados = document.getElementById('resultados');

    // Função para remover acentos e caracteres especiais
    const normalizarTexto = (texto) => {
        return texto.toString().toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""); // Remove os acentos
    };

    const urlDatabase = './database/exames.json';

    fetch(urlDatabase)
        .then(response => {
            if (!response.ok) throw new Error("Erro ao carregar JSON");
            return response.json();
        })
        .then(data => {
            bancoDados = data;
            statusDiv.innerHTML = '<span style="color: #28a745;">Sistema Online ✅</span>';
        })
        .catch(err => {
            statusDiv.innerHTML = '<span style="color: #dc3545;">Erro: Verifique o arquivo exames.json</span>';
            console.error(err);
        });

    inputBusca.addEventListener('input', (e) => {
        const termoOriginal = e.target.value;
        const termoBusca = normalizarTexto(termoOriginal);
        
        containerResultados.innerHTML = "";

        if (termoBusca.length < 2) return;

        // Filtro Inteligente
        const filtrados = bancoDados.filter(item => {
            return Object.values(item).some(valor => {
                const valorNormalizado = normalizarTexto(valor);
                return valorNormalizado.includes(termoBusca);
            });
        });

        if (filtrados.length === 0) {
            containerResultados.innerHTML = `
                <div class="alert alert-light text-muted shadow-sm">
                    Nenhum resultado aproximado para "${termoOriginal}"
                </div>`;
            return;
        }

        filtrados.forEach(item => {
            const div = document.createElement('div');
            div.className = 'card card-body card-exame text-start shadow-sm';
            div.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <h5 class="mb-1 text-dark">${item.exame}</h5>
                    <span class="badge bg-primary rounded-pill">R$ ${item.valor}</span>
                </div>
                <div class="text-muted small">
                    <strong>Código:</strong> ${item.codigo}
                </div>
                <hr class="my-2" style="opacity: 0.1">
                <div class="text-secondary small">
                    <strong>Preparo:</strong> ${item.preparo}
                </div>
            `;
            containerResultados.appendChild(div);
        });
    });
});