//Declaração de variáveis
let nickName;
let mensagem;
let requisicaoMsg;
const mensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
const renderizar = document.querySelector(".container");

//Declaração de objetos
const usuario = {
    name: "samuraiX"
}
const msg = {
    from: "samuraiX",
	to: "Todos",
	text: "mensagem digitada",
	type: "message"
}

//Declaração de Funções
function usuarioInvalido(erro) {
    console.log(erro.response.status);
}
function entrarBatePapo() {
    mensagens.then(renderizarMensagens);
    setInterval(manterConectado, 3000);
}
function manterConectado() {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
    renderizarMensagens();
    console.log("oi")
}
function enviarMensagem(elemento) {
    mensagem = elemento.parentNode.querySelector("input").value;
    requisicaoMsg = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', msg);
    elemento.parentNode.querySelector("input").value = "";
    renderizarMensagens();
}
function renderizarMensagens(resposta) {
    for(let i = 0; i < resposta.data.length; i ++) {
        switch(resposta.data[i].type) {
            case "status":
                renderizar.innerHTML += 
                `<div class="entradaSaida">
                    <span class="hora">${resposta.data[i].time}</span>
                    <h1>${resposta.data[i].from}</h1>
                    <span>${resposta.data[i].text}</span>
                </div>`;
                break;
            case "message":
                renderizar.innerHTML +=
                `<div class="geral">
                    <span class="hora">${resposta.data[i].time}</span>
                    <h1>${resposta.data[i].from}</h1>
                    <span>para</span>
                    <h1>${resposta.data[i].to}:</h1>
                    <span>${resposta.data[i].text}</span>
                </div>`;
                break;
            case "private_message":
                renderizar.innerHTML +=
                `<div class="reservadamente">
                    <span class="hora">${resposta.data[i].time}</span>
                    <h1>${resposta.data[i].from}</h1>
                    <span>reservadamente para</span>
                    <h1>${resposta.data[i].to}:</h1>
                    <span>${resposta.data[i].text}</span>
                </div>`;
                break;
            default:
                "Error";
        }
    }
}

//Axios
const requisicaoLogin = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);

//Lógica
requisicaoLogin.catch(usuarioInvalido)
requisicaoLogin.then(entrarBatePapo)


