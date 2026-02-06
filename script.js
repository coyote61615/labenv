document.addEventListener('DOMContentLoaded', () => {
    let bancoDados = [];
    const statusDiv = document.getElementById('status');
    const inputBusca = document.getElementById('inputBusca');
    const containerResultados = document.getElementById('resultados');

    const normalizarTexto = (texto) => {
        return texto.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    // ATENÇÃO: Se o arquivo está na raiz, o nome deve ser apenas este:
    const urlDatabase = 'exames.json';

    console.log("Tentando carregar dados de:", urlDatabase);

    fetch(urlDatabase)
        .then(response => {
            console.log("Resposta do servidor:", response.status);
            if (!response.ok) throw new Error("Erro ao carregar o arquivo exames.json");
            return response.json();
        })
        .then(data => {
            bancoDados = data;
            console.log("Dados carregados com sucesso! Total de itens:", bancoDados.length);
            statusDiv.innerHTML = '<span style="color: #28a745;">Sistema Pronto ✅</span>';
        })
        .catch(err => {
            statusDiv.innerHTML = '<span style="color: #dc3545;">Erro ao carregar banco de dados.</span>';
            console.error("Erro detalhado:", err);
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
            containerResultados.innerHTML = '<div class="alert alert-light">Nenhum exame encontrado.</div>';
            return;
        }

        filtrados.forEach(item => {
            const div = document.createElement('div');
            div.className = 'card card-body card-exame text-start shadow-sm';
            div.innerHTML = `
                <div class="d-flex justify-content-between">
                    <h5 class="mb-1">${item.exame}</h5>
                    <span class="badge bg-primary rounded-pill">R$ ${item.valor}</span>
                </div>
                <small class="text-muted">Código: ${item.codigo}</small>
                <p class="mt-2 mb-0 small text-secondary">Preparo: ${item.preparo}</p>
            `;
            containerResultados.appendChild(div);
        });
    });
});
