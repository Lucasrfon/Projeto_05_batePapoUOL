//Declaração de variáveis
let nickName;
let requisicaoMsg;
let usuario = {}
let requisicaoLogin;
let msg = {}
let renderizar = document.querySelector(".container");
let listaParticipantes = document.querySelector(".menuParticipantes");
let tipo = "message";
let para = "Todos";

//Declaração de Funções
function definirNickname() {
    usuario.name = document.querySelector(".login").querySelector("input").value;
    requisicaoLogin = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);
    requisicaoLogin.then(entrando);
    requisicaoLogin.catch(usuarioInvalido);
}
function usuarioInvalido() {
    alert("Infelizmente já existe um usuário com esse nickname! Por gentileza, escolha outro.")
}
function atualizar() {
    let mensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    mensagens.then(renderizarMensagens);
}
function atualizarParticipantes() {
    let lista = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    lista.then(renderizarParticipantes);
}
function entrarBatePapo() {
    document.querySelector(".login").classList.add("desligado")
    atualizar();
    atualizarParticipantes();
    setInterval(manterConectado, 4000);
    setInterval(atualizar, 3000);
    setInterval(atualizarParticipantes, 10000);
}
function manterConectado() {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
}
function enviarMensagem(elemento) {
    let mensagem = elemento.parentNode.querySelector("input").value;
    if(mensagem == "") {
        return;
    }
    msg = {
        from: usuario.name,
        to: para,
        text: mensagem,
        type: tipo,
    }
    requisicaoMsg = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', msg);
    elemento.parentNode.querySelector("input").value = "";
    requisicaoMsg.then(atualizar);
    requisicaoMsg.catch(erro);
}
function renderizarMensagens(resposta) {
    renderizar.innerHTML = ""
    for(let i = 0; i < resposta.data.length; i ++) {
        switch(resposta.data[i].type) {
            case "status":
                renderizar.innerHTML += 
                `<div class="entradaSaida">
                    <span class="hora">(${resposta.data[i].time})</span>
                    <h1>${resposta.data[i].from}</h1>
                    <span>${resposta.data[i].text}</span>
                </div>`;
                break;
            case "message":
                renderizar.innerHTML +=
                `<div class="geral">
                    <span class="hora">(${resposta.data[i].time})</span>
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
                        <span class="hora">(${resposta.data[i].time})</span>
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
function renderizarParticipantes(resp) {
    listaParticipantes.innerHTML =
    `<div>
        <div onclick="selecionar(this)">
            <ion-icon class="todos" name="people"></ion-icon>
            <span>Todos</span>
        </div>
        <ion-icon class="check ligado" name="checkmark"></ion-icon>
    </div>`;
    for(let i = 0; i < resp.data.length; i ++) {
        listaParticipantes.innerHTML += 
        `<div>
            <div onclick="selecionar(this)">
                <ion-icon class="pessoa" name="person"></ion-icon>
                <span>${resp.data[i].name}</span>
            </div>
            <ion-icon class="check" name="checkmark"></ion-icon>
        </div>`
    }
}
function erro() {
    window.location.reload()
}
function abrirParticipantes() {
    document.querySelector(".containerParticipantes").classList.toggle("desligado")
}
function selecionar(esse) {
    document.querySelector(".ligado").classList.remove("ligado")
    console.log(esse)
    esse.parentNode.querySelector(".check").classList.add("ligado")
    para = esse.querySelector("span").innerHTML
    if(tipo === "message") {
        document.querySelector(".lembrete").innerHTML = `Enviando para ${para}`
    }
    if(tipo === "private_message") {
        document.querySelector(".lembrete").innerHTML = `Enviando para ${para} (reservadamente)`
    }
}
function selecionarVisibilidade(este) {
    document.querySelector(".visibilidade").querySelector(".ligado").classList.remove("ligado");
    este.parentNode.querySelector(".check").classList.add("ligado")
    if(este.querySelector("span").innerHTML === "Público") {
        tipo = "message"
        document.querySelector(".lembrete").innerHTML = `Enviando para ${para}`
    }
    if(este.querySelector("span").innerHTML === "Reservadamente") {
        tipo = "private_message"
        document.querySelector(".lembrete").innerHTML = `Enviando para ${para} (reservadamente)`
    }
}
function entrando() {
    document.querySelector(".login").querySelector("input").remove();
    document.querySelector("button").remove();
    document.querySelector(".login").innerHTML +=
    `<div class="fa fa-spinner fa-spin" style="font-size:80px"></div>
    <div class="espera">Entrando...</div>`
    setTimeout(entrarBatePapo, 3000)
}