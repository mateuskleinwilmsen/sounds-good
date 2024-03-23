const audio = document.getElementById("audio");
const timerAgoraDisplay = document.getElementById("timer-agora");
const timerDuracaoDisplay = document.getElementById("timer-duracao");
const playAudio = document.getElementById("play-audio");
const sliderTempo = document.getElementById("slider-tempo");
const sliderVolume = document.getElementById("slider-volume");
const musicasDiv = document.querySelector(".musicas");
const nomeMusica = document.querySelector(".controles-musica-nome");
const nomeCantor = document.querySelector(".controles-musica-cantor");
const fotoMusica = document.querySelector(".controles-musica-img > img");

let tocando = 0;
let musicaEscolhida = 0;
let musicaEstado = "escolhida";
let musicas = [ ["audio/sad-soul-chasing-a-feeling.mp3","img/AlexGrohl.webp","Sad Soul","AlexGrohl"],
                ["audio/titanium.mp3","img/AlisiaBeats.webp","Titanium","AlisiaBeats"],
            ["audio/a-long-way.mp3","img/Serge Pavkin Music.jpg","A Long Way","Serge Pavi..."],
            ["audio/glossy.mp3", "img/comamedia.webp", "Glossy", "coma-media"],
            ["audio/good-night.mp3","img/fasssounds.webp","Good Night","Fass Sounds"]];
let mudandoTempo = 0;
let volume = 0.1;
audio.volume = volume;

////////////////////
//iniciando o site//
////////////////////

//primeira musica selecionada
audio.src = musicas[musicaEscolhida][0];
fotoMusica.src = musicas[musicaEscolhida][1];
nomeMusica.textContent = musicas[musicaEscolhida][2];
nomeCantor.textContent = musicas[musicaEscolhida][3];

//tempo da musica
//quando carregar a musica
audio.onloadedmetadata = function() {
    audio.currentTime=0;

    timerAgora = audio.currentTime;
    timerDuracao = audio.duration;
    const minutosAgora = Math.floor(timerAgora / 60);
    const segundosAgora = Math.floor(timerAgora % 60);
    const minutosDuracao = Math.floor(timerDuracao / 60);
    const segundosDuracao = Math.floor(timerDuracao % 60);
    
    timerDuracaoDisplay.textContent = `${minutosDuracao}:${segundosDuracao < 10 ? "0" : ""}${segundosDuracao}`;
    timerAgoraDisplay.textContent = `${minutosAgora}:${segundosAgora < 10 ? "0" : ""}${segundosAgora}`;
    sliderTempo.value = (audio.currentTime / audio.duration) * 1000;
}

//atualizando os dados
for(let c = 0; c < musicas.length ;c++){
    musicasDiv.innerHTML += `                <div class="musica ${musicaEscolhida == c ? musicaEstado : ""}" onclick="mudarMusica(${c})">
    <div class="musica-img">
        <img src="${musicas[c][1]}" height="75" width="75">
    </div>
    <div class="musica-dados">
        <span class="c11 fm2">${musicas[c][2]}</span>
        <span class="c9 fp2">${musicas[c][3]}</span>
    </div>
    </div>`;
}

function attInfoTempo(event, timerAgora = audio.currentTime,timerDuracao = audio.duration){

    //caso o audio ainda não carregou, ira retornar o valor de 0 para a duração dele
    if(String(timerDuracao)=="NaN"){timerDuracao=0;}

    const minutosAgora = Math.floor(timerAgora / 60);
    const segundosAgora = Math.floor(timerAgora % 60);
    const minutosDuracao = Math.floor(timerDuracao / 60);
    const segundosDuracao = Math.floor(timerDuracao % 60);

    timerDuracaoDisplay.textContent = `${minutosDuracao}:${segundosDuracao < 10 ? "0" : ""}${segundosDuracao}`;
    
    //vendo se o usuario esta mudificando ou nao o tempo do audio
    if(mudandoTempo==0){
        timerAgoraDisplay.textContent = `${minutosAgora}:${segundosAgora < 10 ? "0" : ""}${segundosAgora}`;
        sliderTempo.value = (audio.currentTime / audio.duration) * 1000;
    }

    //mudando o background do tempo que ja passou da musica
    sliderTempo.style.boxShadow = `inset ${(sliderTempo.offsetWidth/1000)*sliderTempo.value}px 0px 0px var(--cor-c11)`;
}

//configurando o volume
sliderVolume.value = volume*1000;
sliderVolume.style.boxShadow = `inset ${sliderVolume.offsetWidth*volume}px 0px 0px var(--cor-c11)`;

//funcao para começar o aduio ou pausar ele
playAudio.addEventListener("click", () => {
    if (tocando) {
        audio.pause();
        playAudio.textContent = "play_circle";
    } else {
        audio.play();
        playAudio.textContent = "pause_circle";
    }
    tocando = !tocando;
});

//função que inicia toda vez que o audio estiver sendo tocado
audio.addEventListener("timeupdate", () => {

    timerAgora = audio.currentTime;
    timerDuracao = audio.duration;
    
    //caso a musica esteja tocando e acabe ela vai ficar em loop e vai tocar de novo
    if(timerAgora>=timerDuracao && tocando){
        audio.currentTime=0;
        timerAgora=0;
        audio.play();
    }

    attInfoTempo();
})

//funcao para  dizer que o usuario esta modificando o tempo do audio
sliderTempo.addEventListener("mousedown", () => {
    mudandoTempo = 1;
});

//funcao que mostra o tempo que o usuario esta modificando ao vivo
sliderTempo.addEventListener("input", () => {
    timerAgora = (sliderTempo.value * audio.duration) / 1000;
    const minutosAgora = Math.floor(timerAgora / 60);
    const segundosAgora = Math.floor(timerAgora % 60);
    timerAgoraDisplay.textContent = `${minutosAgora}:${segundosAgora < 10 ? '0' : ''}${segundosAgora}`;

    //mudando o background do tempo que ja passou da musica
    sliderTempo.style.boxShadow = `inset ${(sliderTempo.offsetWidth/1000)*sliderTempo.value}px 0px 0px var(--cor-c11)`;
})

//função que diz que o usuario nao esta mais modificando o tempo do audio
sliderTempo.addEventListener("mouseup", () => {
    mudandoTempo = 0;
    audio.currentTime = (audio.duration / 1000) * sliderTempo.value;
});

// sliderTempo.addEventListener("click", () => {
//     audio.currentTime = (audio.duration / 100) * sliderTempo.value;
// });

//controle de volume da musica
sliderVolume.addEventListener("input", () => {
    audio.volume = (sliderVolume.value/1000);
    volume=audio.volume;
    sliderVolume.style.boxShadow = `inset ${sliderVolume.offsetWidth*volume}px 0px 0px var(--cor-c11)`;
})

//trocando de musica
function mudarMusica(m=0){
    musicaEscolhida = m;

    audio.src = musicas[musicaEscolhida][0];
    fotoMusica.src = musicas[musicaEscolhida][1];
    nomeMusica.textContent = musicas[musicaEscolhida][2];
    nomeCantor.textContent = musicas[musicaEscolhida][3];

    audio.currentTime=0;
    audio.play();
    tocando=1;
    playAudio.textContent = "pause_circle";

    //atualizando os dados
    musicasDiv.innerHTML = "";
    for(let c = 0; c < musicas.length ;c++){
        musicasDiv.innerHTML += `                <div class="musica ${musicaEscolhida == c ? musicaEstado : ""}" onclick="mudarMusica(${c})">
        <div class="musica-img">
            <img src="${musicas[c][1]}" height="75" width="75">
            <span class="material-symbols-outlined c11" id="play-audio">play_circle</span>
        </div>
        <div class="musica-dados">
            <span class="c11 fm2">${musicas[c][2]}</span>
            <span class="c9 fp2">${musicas[c][3]}</span>
        </div>
        </div>`;
    }

    attInfoTempo()
}

//evento que chama a função quando a tela muda de tamanho
window.addEventListener("resize", attInfoTempo);