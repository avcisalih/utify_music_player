const prevButton = document.getElementById("prev")

const nextButton = document.getElementById("next")
const repeatButton = document.getElementById("repeat")
const shuffleButton = document.getElementById("shuffle")
const audio = document.getElementById("audio")
const songImage = document.getElementById("song-image")
const songName = document.getElementById("song-name")
const songArtist = document.getElementById("song-artist")
const pauseButton = document.getElementById("pause")
const playButton = document.getElementById("play")
const playListButton = document.getElementById("playlist")
const maxDuration = document.getElementById("max-duration")
const currentTimeRef = document.getElementById("current-time")
const progressBar = document.getElementById("progress-bar")
const playListContainer = document.getElementById("playlist-container")
const closeButton = document.getElementById("close-button")
const playListSongs = document.getElementById("playlist-songs")
const currentProgress = document.getElementById("current-progress")

//index şarkılar için
let index 

//dongü
let loop = true

//Karıştırı açık mı ?
let isShuffleActive = false

//Şarkı Listesi

const songsList = [
    {
        name: "Gelo Ew Ki Bu",
        link: "assets/gelo-ew-ki-bu.mp3",
        artist: "Aram Tigran",
        image: "assets/aram.png"
    },
    {
        name: "Gitme Kal",
        link: "assets/yara-bere-icindeyim.mp3",
        artist: "Hira-i Zerdust",
        image: "assets/zerdus.png"
    },
    {
        name: "Ax Eman",
        link: "assets/ax-eman.mp3",
        artist: "Rewsan Celiker",
        image: "assets/rewsan.png"
    },
    {
        name: "Dinle",
        link: "assets/dinle.mp3",
        artist: "Mahsun Kırmızıgul",
        image: "assets/mahsun.png"
    },
    {
        name: "Gozlerinin Yesilini",
        link: "assets/goz.mp3",
        artist: "Tripkolik",
        image: "assets/tripkolik.png"

    }
]

//Zaman Formatı Ayarlama
const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput / 60)
    minute = minute < 10 ? "0" + minute : minute
    let second = Math.floor(timeInput % 60)
    second = second < 10 ? "0" + second : second
    return `${minute}:${second}`
}

//Şarkıyı Çalma
const playAudio = () => {
    console.log("playAudio")
    audio.play()
    pauseButton.classList.remove("hide")
    playButton.classList.add("hide")
}

// Şarkıyı atama
const setSong = (arrayIndex) => {
    if (loop == true && isShuffleActive == true) {
        arrayIndex= Math.floor(Math.random()*100)%5
    }
    console.log(arrayIndex + isShuffleActive)

    let { name, link, artist, image} = songsList[arrayIndex]
    audio.src = link
    songName.innerHTML = name
    songArtist.innerHTML = artist
    songImage.src = image

    audio.onloadedmetadata = () =>{
        maxDuration.innerText = timeFormatter(audio.duration)
    }

    playListContainer.classList.add("hide")
    playAudio()
}

// Sıradakini çalma
const nextSong = () => {
    if(loop) {
        if ( index == (songsList.length - 1)){
            index = 0
        }else {
            index += 1
        }
        setSong(index)
    }else{
        let randIndex = Math.floor(Math.random() * songsList.length)
        setSong(randIndex)
    }
}

playListButton.addEventListener('click', () => {
    playListContainer.classList.remove('hide')
} )

closeButton.addEventListener('click', () => {
    playListContainer.classList.add('hide')
})

const pauseAudio = () => {
    audio.pause()
    pauseButton.classList.add('hide')
    playButton.classList.remove('hide')
}

setInterval (() => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%"
    //
}, 1000);

progressBar.addEventListener("click", (event) => {
    let coordStart = progressBar.getBoundingClientRect().left

    let coordEnd = event.clientX
    let progress = (coordEnd - coordStart) / progressBar.offsetWidth

    currentProgress.style.width = progressBar * 100 + "%"

    audio.currentTime = progress * audio.duration
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
})

const previousSong = () => {
    console.log(index)
    if (index > 0) {
        index -= 1 
    } else {
        index = songsList.length - 1 //4
    }

    setSong(index)
}

repeatButton.addEventListener('click', () => {
    if(repeatButton.classList.contains('active')) {
        repeatButton.classList.remove('active')
        audio.loop = false
        console.log('tekrar kapatıldı')
    } else {
        repeatButton.classList.add('active')
        audio.loop = true
        console.log('tekrar açıldı')
    }
})

shuffleButton.addEventListener('click', () => {
    if (shuffleButton.classList.contains('active')){
        isShuffleActive = false
        shuffleButton.classList.remove('active')
        audio.loop = true
        console.log('karıştırıcı kapatıldı')
    } else{
        isShuffleActive = true
        shuffleButton.classList.add('active')
        audio.loop = false
        console.log('karıştırıcı açıldı')
    }
})

const initializePlaylist = () => {
    for ( let i in songsList) {
        playListSongs.innerHTML += `<li class="playlistSong" onclick="setSong(${i})">
        <div class="playlist-image-container">
          <img src="${songsList[i].image}">
        </div>
        <div class="playlist-song-details">
          <span id="playlist-song-name">
            ${songsList[i].name}
          </span>
          <span id="playlist-song-artist-album">
            ${songsList[i].artist}
          </span>
        </div>
        </li>`
    }
}

// Tıklama Yakalama 
nextButton.addEventListener('click', nextSong)
pauseButton.addEventListener('click', pauseAudio)
playButton.addEventListener('click', playAudio)
prevButton.addEventListener('click', previousSong)

// Şarkı bitişini yakala
audio.onended = () => {
    nextSong()
}

audio.addEventListener('timeupdate', () => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
})

//Ekran yüklenildiğinde

window.onload = () => {
    index = 0
    setSong(index)
    //durdur ve sarki listesi oluştur.
    pauseAudio()
    initializePlaylist()
}

