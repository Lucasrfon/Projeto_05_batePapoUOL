//Declaração de variáveis
let nickName;
let mensagem;
let requisicaoMsg;
let usuario = {
    name: "samuraiZ"
}
let requisicaoLogin = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);
let msg = {
    from: "SamuraiX",
	to: "Todos",
	text: "mensagem digitada",
	type: "message"
}
let renderizar = document.querySelector(".container");

//Declaração de Funções
function definirNickname() {
    nickName = prompt("Escolha seu nickname:");
}
function usuarioInvalido() {
    alert("Infelizmente já existe um usuário com esse nickname! Por gentileza, escolha outro.")
    definirNickname();
}
function entrarBatePapo() {
    let mensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    mensagens.then(renderizarMensagens);
    setInterval(manterConectado, 4000);
    setInterval(atualizar, 3000)
}
function manterConectado() {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
    console.log("oi")
}
function enviarMensagem(elemento) {
    mensagem = elemento.parentNode.querySelector("input").value;
    requisicaoMsg = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', msg);
    elemento.parentNode.querySelector("input").value = "";
    requisicaoMsg.then(atualizar);
}
function renderizarMensagens(resposta) {
    renderizar.innerHTML = ""
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
                if(resposta.data[i].from === usuario.name || resposta.data[i].to === usuario.name || resposta.data[i].from === "Todos") {
                    renderizar.innerHTML +=
                    `<div class="reservadamente">
                        <span class="hora">${resposta.data[i].time}</span>
                        <h1>${resposta.data[i].from}</h1>
                        <span>reservadamente para</span>
                        <h1>${resposta.data[i].to}:</h1>
                        <span>${resposta.data[i].text}</span>
                    </div>`;
                }
                break;
            default:
                "Error";
        }
    }
    document.querySelector(".container").lastChild.scrollIntoView()
}
function atualizar() {
    let mensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    mensagens.then(renderizarMensagens);
}

//Lógica
definirNickname();
requisicaoLogin.then(entrarBatePapo);
requisicaoLogin.catch(usuarioInvalido)