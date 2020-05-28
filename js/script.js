// Estado da aplicação

let listarUsuarios = null;

let usuarios = [];
let qtUsuarios = 0;
let resultadoPesquisa = null;
let estatisticas = null;

let stringPesquisada = null;

let qtHomens = 0;
let qtMulheres = 0;
let somaIdades = 0;
let mediaIdades = 0;

window.addEventListener('load', () => {

    function evitarEnvioForm(event) {
        event.preventDefault();
    }

    listarUsuarios = document.querySelector('#lista-usuarios');
    qtUsuarios = document.querySelector('#info-usuarios');

    let form = document.querySelector('form');
    form.addEventListener('submit', evitarEnvioForm);

    fetchPessoas();

});

async function fetchPessoas() {

    const resposta = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
    const json = await resposta.json();

    usuarios = json.results.map(usuario => {

        const {name: {first, last}, picture: {thumbnail}, dob: {age}, gender} = usuario;

        return {
            nome: first+' '+last,
            foto: thumbnail,
            idade: age,
            genero: gender
        };

    });

    carregouPagina();

}


function carregouPagina() {

    campoBusca = document.querySelector('#campo-busca');
    carregou = document.querySelector('#carrega-pagina');

    setInterval(() => {
        if (usuarios !== '' ) {

            carregou.innerHTML = '';
            campoBusca.disabled = false;
            campoBusca.focus();

        }
    }, 1000);

    campoBusca.addEventListener('keyup', liberarBotao);

}

function liberarBotao(event) {

    btnBusca = document.querySelector('#btn-busca');

    let texto = !!event.target.value && event.target.value.trim() !== '';

    if(texto) {
        btnBusca.disabled = false;
    } else {
        btnBusca.disabled = true;
    }

    btnBusca.addEventListener('click', busca);

}

function busca() {

    let nomeFormatado = '';

    // Refatorar depois para não acessar o mesmo elemento duas vezes no DOM
    campoBusca = document.querySelector('#campo-busca');
    stringPesquisada = campoBusca.value.trim().toLowerCase();
    campoBusca.value = '';

    const resultadoPesquisa = usuarios.filter(usuario => {

        nomeFormatado = usuario.nome.toLowerCase();

        if (nomeFormatado.indexOf(stringPesquisada) !== -1) {
            return usuario;
        };

    });

    //Ordenando o resultado
    resultadoPesquisa.sort((a, b) => {
        return a.nome.localeCompare(b.nome);
    });

    //console.log(resultadoPesquisa);
    
    // Estatísticas /////////////////
    const mulheres = resultadoPesquisa.filter(usuario => {
        return usuario.genero === 'female';
    });

    qtMulheres = mulheres.length;
    qtHomens = resultadoPesquisa.length - qtMulheres;

    somaIdades = resultadoPesquisa.reduce((acc, curr) => {
        return acc + curr.idade;
    }, 0);


    mediaIdades = (somaIdades / resultadoPesquisa.length).toFixed(2);

    /*
    console.log(qtMulheres);
    console.log(qtHomens);
    console.log(somaIdades);
    console.log(mediaIdades);
    */

    /////////////////////////////////////

    renderizar(resultadoPesquisa, qtMulheres, qtHomens, somaIdades, mediaIdades);

}

function renderizar(usuarios, mulheres, homens, somaIdades, mediaIdades) {

    resultadoPesquisa = document.querySelector('#info-usuarios');
    estatisticas = document.querySelector('#info-estatisticas');
    homensHTML = document.querySelector('#qtHomens');
    mulheresHTML = document.querySelector('#qtMulheres');
    idadesHTML = document.querySelector('#somaIdades');
    mediaHTML = document.querySelector('#mediaIdades');


    if (usuarios.length >= 1) {
        resultadoPesquisa.textContent = `${usuarios.length} usuários(s) encontrado(s)`;
        estatisticas.textContent = 'Estatísticas';
    } else {
        resultadoPesquisa.textContent = `Nenhum resultado retornado.`;
        mediaIdades = 0;
    }

    let usuariosHTML = '<div>';

    usuarios.forEach(usuario => {

        const {foto, nome, idade} = usuario;

        const usuarioHTML =
            `
                <div class="usuario">
                    <div>
                        <img src="${foto}" alt="Foto do usuário">
                    </div>
                    <div>
                        <span>${nome+','}</span>
                    </div>
                    <div>
                        <span>${idade+' anos'}</span>
                    </div>
                </div>
            `;

        usuariosHTML += usuarioHTML;
    });

    usuariosHTML += '</div>';
    listarUsuarios.innerHTML = usuariosHTML;

    mulheresHTML.textContent = `Sexo feminino: ${mulheres}`;
    homensHTML.textContent = `Sexo masculino: ${homens}`;
    idadesHTML.textContent = `Soma das idades: ${somaIdades}`;
    mediaHTML.textContent = `Média das idades: ${mediaIdades}`;

}