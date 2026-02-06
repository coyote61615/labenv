document.addEventListener('DOMContentLoaded', () => {
    let bancoDados = [];
    const statusDiv = document.getElementById('status');
    const inputBusca = document.getElementById('inputBusca');
    const containerResultados = document.getElementById('resultados');

    const normalizarTexto = (texto) => {
        return texto ? texto.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
    };

    // Nome exato do arquivo na raiz do seu GitHub
    const urlDatabase = 'exames.json';

    fetch(urlDatabase)
        .then(response => {
            if (!response.ok) throw new Error("Erro ao carregar exames.json");
            return response.json();
        })
        .then(data => {
            bancoDados = data;
            statusDiv.innerHTML = '<span style="color: #28a745;">Sistema Pronto ✅</span>';
        })
        .catch(err => {
            statusDiv.innerHTML = '<span style="color: #dc3545;">Erro ao carregar dados.</span>';
            console.error(err);
        });

    inputBusca.addEventListener('input', (e) => {
        const termo = normalizarTexto(e.target.value);
        containerResultados.innerHTML = "";

        if (termo.length < 2) return;

        const filtrados = bancoDados.filter(item => {
            return Object.values(item).some(valor => 
                normalizarTexto(valor).includes(termo)
            );
        });

        if (filtrados.length === 0) {
            containerResultados.innerHTML = '<div class="alert alert-light shadow-sm">Nenhum exame encontrado.</div>';
            return;
        }

        filtrados.forEach(item => {
            const div = document.createElement('div');
            div.className = 'card card-body card-exame text-start shadow-sm mb-3';
            div.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <h5 class="mb-1">${item.exame}</h5>
                    <span class="badge bg-primary rounded-pill">R$ ${item.valor}</span>
                </div>
                <div class="text-muted small"><strong>Código:</strong> ${item.codigo}</div>
                <hr class="my-2" style="opacity: 0.1">
                <div class="text-secondary small"><strong>Preparo:</strong> ${item.preparo}</div>
            `;
            containerResultados.appendChild(div);
        });
    });
});
