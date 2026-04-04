// Mostrar conteúdo do Range do tamanho do inimigo
let rangeEnemy = document.getElementById("escalaInimigo")
let pScaleEnemy = document.getElementById("pScaleInimigo")

rangeEnemy.addEventListener('input', function atualizarRangeInimigo() { //addEventListener registra uma função (manipulador) para ser executada quando um evento específico ocorre em um elemento HTML.
  pScaleEnemy.innerHTML = `Tamanho: <strong>${rangeEnemy.value}</strong>`;
});

// Mostrar conteúdo do Range do tamanho do player
 let rangePlayer = document.getElementById("escalaPlayer")
 let pScalePlayer = document.getElementById("pScalePlayer")

 rangePlayer.addEventListener('input', function atualizarRangePlayer() {
  pScalePlayer.innerHTML=`Tamanho: <strong>${rangePlayer.value}</strong>`;
 })

// Mostrar conteúdo do Range do tamanho da GF
 let rangeGF = document.getElementById("escalaGF")
 let pScaleGF = document.getElementById("pScaleGF")

 rangeGF.addEventListener('input', function atualizarRangeGF() {
  pScaleGF.innerHTML=`Tamanho: <strong>${rangeGF.value}</strong>`;
 })

function parseArray(text) {
  return text.split(",")
    .map(n => parseInt(n.trim()))
    .filter(n => !isNaN(n))
}

function getAsset(selectId) {
  let select = document.getElementById(selectId).value
  return "storymenu/props/" + select
}

function baixar() {

  let songs = document.getElementById("musicasWeek").value
    .split(",")
    .map(s => s.trim())
    .filter(s => s.length > 0)

  let enemy = {
    assetPath: getAsset("inimigoProp"),
    scale: parseFloat(document.getElementById("escalaInimigo").value) || 1,
    offsets: [
      parseFloat(document.getElementById("inimigoXOffset").value) || 0,
      parseFloat(document.getElementById("inimigoYOffset").value) || 0
    ],
    animations: [
      {
        name: document.getElementById("paradoInimigo").value,
        prefix: document.getElementById("paradoInimigoPrefixo").value,
        frameRate: parseInt(document.getElementById("fpsInimigo").value) || 24
      }
    ]
  }

  let player = {
    assetPath: getAsset("playerProp"),
    scale: parseFloat(document.getElementById("escalaPlayer").value) || 1,
    offsets: [
      parseFloat(document.getElementById("playerXOffset").value) || 0,
      parseFloat(document.getElementById("playerYOffset").value) || 0
    ],
    animations: [
      {
        name: document.getElementById("paradoPlayer").value,
        prefix: document.getElementById("paradoPlayerPrefixo").value,
        frameRate: parseInt(document.getElementById("fpsBF").value) || 24
      },
      {
        name: document.getElementById("selecionadoPlayer").value,
        prefix: document.getElementById("selecionadoPlayerPrefixo").value,
        frameRate: parseInt(document.getElementById("fpsBF").value) || 24
      }
    ]
  }

  let gf = {
    assetPath: getAsset("gfProp"),
    scale: parseFloat(document.getElementById("escalaGf").value) || 1,
    offsets: [
      parseFloat(document.getElementById("gfXOffset").value) || 0,
      parseFloat(document.getElementById("gfYOffset").value) || 0
    ],
    animations: [
      {
        name: document.getElementById("animacaoEsquerdaGF").value,
        prefix: document.getElementById("animacaoEsquerdaGFPrefixo").value,
        frameIndices: parseArray(document.getElementById("frameIndiceLeft").value)
      },
      {
        name: document.getElementById("animacaoDireitaGF").value,
        prefix: document.getElementById("animacaoDireitaGFPrefixo").value,
        frameIndices: parseArray(document.getElementById("frameIndiceRight").value)
      }
    ]
  }

  let week = {
    version: document.getElementById("versao").value,
    name: document.getElementById("descricaoWeek").value,
    titleAsset: document.getElementById("titleAsset").value,
    props: [enemy, player, gf],
    background: document.getElementById("corFundo").value,
    songs: songs
  }

  let json = JSON.stringify(week, null, 2)

  let blob = new Blob([json], { type: "application/json" })

  let link = document.createElement("a")
  link.href = URL.createObjectURL(blob)

  let fileName = document.getElementById("nomeArquivo").value || "week"
  link.download = fileName + ".json"

  link.click()
}
document.addEventListener("click", function() {
    const som = document.getElementById("clickSound")
    som.currentTime = 0 // reinicia o som se clicar várias vezes
    som.play()
})