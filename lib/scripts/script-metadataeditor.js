document.addEventListener("DOMContentLoaded", function() {

  let modoSelect = document.getElementById("modo")
  let variationContainer = document.getElementById("variationContainer")

  let songVarContainer = document.getElementById("songVariations").parentElement
  let difficultiesContainer = document.getElementById("difficulties").parentElement
  let altInstContainer = document.getElementById("altInstContainer")
  let erectRatingsContainer = document.getElementById("erectRatingsContainer")

  let variationSelect = document.getElementById("variation")

  function atualizarUI() {
    let modo = modoSelect.value
    let variation = variationSelect.value

    // reset padrão (tudo visível)
    songVarContainer.style.display = "block"
    difficultiesContainer.style.display = "block"
    altInstContainer.style.display = "block"
    erectRatingsContainer.style.display = "none"

    if (modo === "variation") {
      variationContainer.style.display = "block"

      if (variation === "erect") {
        // esconde coisas que não fazem sentido
        songVarContainer.style.display = "none"
        difficultiesContainer.style.display = "none"
        altInstContainer.style.display = "none"

        // mostra ratings próprios
        erectRatingsContainer.style.display = "block"
      }

      else if (variation === "pico") {
        songVarContainer.style.display = "none"
        altInstContainer.style.display = "none"

        // difficulties continua visível (easy)
      }

      else if (variation === "bf") {
        songVarContainer.style.display = "none"
        altInstContainer.style.display = "none"
      }

    } else {
      variationContainer.style.display = "none"
    }
  }

  modoSelect.addEventListener("change", atualizarUI)
  variationSelect.addEventListener("change", atualizarUI)

  atualizarUI()
})

function pegarDificuldades(valor) {
  if (valor === "easy") return ["easy"]
  if (valor === "normal") return ["normal"]
  if (valor === "hard") return ["hard"]
  if (valor === "easyNnormal") return ["easy", "normal"]
  if (valor === "normalNhard") return ["normal", "hard"]
  if (valor === "easyNnormalNhard") return ["easy", "normal", "hard"]
  return []
}

function pegarRatings(dificuldades) {
  let ratings = {}

  let easy = document.getElementById("easyRating").value
  let normal = document.getElementById("normalRating").value
  let hard = document.getElementById("hardRating").value

  if (dificuldades.includes("easy") && easy !== "") ratings.easy = Number(easy)
  if (dificuldades.includes("normal") && normal !== "") ratings.normal = Number(normal)
  if (dificuldades.includes("hard") && hard !== "") ratings.hard = Number(hard)

  return ratings
}

function pegarBt() {
  return document.getElementById("bt").value
    .split(",")
    .map(x => Number(x.trim()))
}

function pegarSongVariations(valor) {
  if (!valor) return []
  return valor.split("N")
}

function normalizarPersonagem(valor) {
  if (valor === "bfPlay") return "bf"
  if (valor === "dadPlay") return "dad"
  if (valor === "darnellPlay") return "darnell"
  if (valor === "momPlay") return "mom"
  if (valor === "parents-xmasPlay") return "parents-xmas"
  if (valor === "senpaiPlay") return "senpai"
  if (valor === "spookyPlay") return "spooky"
  if (valor === "tankmanPlay") return "tankman"
  if (valor === "picoNotPlay") return "pico"
  return valor
}

function slug(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

function baixar() {

  let modo = document.getElementById("modo").value

  let version = document.getElementById("version").value
  let songName = document.getElementById("songName").value
  let artist = document.getElementById("artist").value
  let charter = document.getElementById("charter").value

  let variationBase = document.getElementById("songVariations").value

  let player = normalizarPersonagem(document.getElementById("player").value)
  let girlfriend = document.getElementById("girlfriend").value
  let opponent = document.getElementById("opponent").value

  let altInst = document.getElementById("altInstrumentals").value
  let opponentVocals = document.getElementById("opponentVocals").value
  let playerVocals = document.getElementById("playerVocals").value

  let stage = document.getElementById("stage").value
  let noteStyle = document.getElementById("noteStyle").value
  let album = document.getElementById("album").value

  let bpm = Number(document.getElementById("bpm").value)
  let tempo = Number(document.getElementById("tempo").value)
  let beat = Number(document.getElementById("beat").value)

  let difficulties
  let ratings

  if (modo === "variation") {

    let variation = document.getElementById("variation").value

    if (variation === "erect") {
      difficulties = ["erect", "nightmare"]

      let erect = document.getElementById("erectRating").value
      let nightmare = document.getElementById("nightmareRating").value

      ratings = {}

      if (erect !== "") ratings.erect = Number(erect)
      if (nightmare !== "") ratings.nightmare = Number(nightmare)
    }

    else if (variation === "pico") {
      difficulties = ["easy"]

      let easy = document.getElementById("easyRating").value
      ratings = {}

      if (easy !== "") ratings.easy = Number(easy)
    }

    else if (variation === "bf") {
      difficulties = ["easy", "normal", "hard"]
      ratings = pegarRatings(difficulties)
    }

  } else {

    let difficultiesValue = document.getElementById("difficulties").value
    difficulties = pegarDificuldades(difficultiesValue)
    ratings = pegarRatings(difficulties)

  }

  let metadata = {
    version: version,
    songName: songName,
    artist: artist,
    charter: charter,
    offsets: {},
    playData: {
      difficulties: difficulties,
      characters: {
        player: player,
        girlfriend: girlfriend,
        opponent: opponent
      },
      stage: stage,
      noteStyle: noteStyle,
      ratings: ratings
    },
    generatedBy: "Cvncfs Engine / FNF WebKit Tools",
    timeChanges: [
      {
        t: tempo,
        b: beat,
        bpm: bpm,
        bt: pegarBt()
      }
    ]
  }

  // songVariations só no modo base
  if (modo === "base") {
    let variations = pegarSongVariations(variationBase)
    if (variations.length > 0) {
      metadata.playData.songVariations = variations
    }
  }

  if (altInst !== "noneAltInst") {
    metadata.playData.characters.instrumental = altInst.replace("AltInst", "")
  }

  if (opponentVocals !== "") {
    metadata.playData.characters.opponentVocals = [opponentVocals]
  }

  if (playerVocals !== "") {
    metadata.playData.characters.playerVocals = [playerVocals]
  }

  if (album !== "") {
    metadata.playData.album = album
  }

  let nomeBase = slug(songName)

  let fileName

  if (modo === "base") {
    fileName = nomeBase + "-metadata.json"
  } else {
    let variation = document.getElementById("variation").value
    fileName = nomeBase + "-metadata-" + variation + ".json"
  }

  let blob = new Blob([JSON.stringify(metadata, null, 2)], { type: "application/json" })
  let link = document.createElement("a")

  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()
}

document.addEventListener("click", function() {
  const som = document.getElementById("clickSound")
  if (!som) return
  som.currentTime = 0
  som.play()
})