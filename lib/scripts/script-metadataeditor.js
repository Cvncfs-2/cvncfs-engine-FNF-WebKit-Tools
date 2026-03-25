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

function baixar() {
  let version = document.getElementById("version").value
  let songName = document.getElementById("songName").value
  let artist = document.getElementById("artist").value
  let charter = document.getElementById("charter").value

  let variation = document.getElementById("songVariations").value
  let difficultiesValue = document.getElementById("difficulties").value
  let difficulties = pegarDificuldades(difficultiesValue)

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
      ratings: pegarRatings(difficulties)
    },
    generatedBy: "Cvncfs Engine",
    timeChanges: [
      {
        t: tempo,
        b: beat,
        bpm: bpm,
        bt: pegarBt()
      }
    ]
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

  let nomeBase = songName.toLowerCase().replaceAll(" ", "-")
  let fileName = nomeBase + "-metadata" + (variation ? "-" + variation : "") + ".json"

  let blob = new Blob([JSON.stringify(metadata, null, 2)], { type: "application/json" })
  let link = document.createElement("a")

  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()
}
document.addEventListener("click", function() {
    const som = document.getElementById("clickSound")
    som.currentTime = 0 // reinicia o som se clicar várias vezes
    som.play()
})