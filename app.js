const expandIcon = document.getElementById("expand-icon")
const collapseExpand = document.getElementById("collapse-expand")
const songsListContainer = document.getElementById("songs-list-container")
const songsList = document.getElementById("songs-list")
const musicPlayerContainer = document.getElementById("music-player-container")
const playBtn = document.getElementById("play-btn")
const prevBtn = document.getElementById("prev-btn")
const nextBtn = document.getElementById("next-btn")
const playIcon = document.getElementById("play-icon")
const songTitle = document.getElementById("song-title")
const image = document.getElementById("image")
const inputRange = document.getElementById("input-range")
const volumeRange = document.getElementById("volume-range")

const defaultImage = image.src
let currentSongIndex = -1
let currentAudio = null
let isSeeking = false
let currentVolume = Number(volumeRange?.value ?? 1)

collapseExpand.addEventListener("click", () => {
    if(expandIcon.classList.contains("fa-arrow-right")) {
        expandIcon.classList.remove("fa-arrow-right")
        expandIcon.classList.add("fa-arrow-left")
        songsListContainer.style.display = "none"
        musicPlayerContainer.style.width = "100vw"
    } else {
        expandIcon.classList.remove("fa-arrow-left")
        expandIcon.classList.add("fa-arrow-right")
        musicPlayerContainer.style.width = "80vw"
        songsListContainer.style.display = "block"
    }
})

const songsInfo = [
    {
        name : "Boyfriend",
        img : "https://i.ytimg.com/vi/5GCfYLguTIs/maxresdefault.jpg",
        trackName : "Boyfriend.mp3"
    },
    {
        name : "For a reason",
        img : "https://i.ytimg.com/vi/-YlmnPh-6rE/hq720.jpg",
        trackName : "For a reason.mp3"
    },
    {
        name : "Nafrat",
        img : "https://i.ytimg.com/vi/25qkuX8qzQo/maxresdefault.jpg",
        trackName : "Nafrat.mp3"
    },
    {
        name : "Gehra Hua",
        img : "https://i.ytimg.com/vi/2kvtJL8Keog/hq720.jpg",
        trackName : "Gehra Hua.mp3"
    }
]

function setPlayIcon(isPlaying) {
    if(isPlaying) {
        playIcon.classList.remove("fa-play")
        playIcon.classList.add("fa-pause")
    } else {
        playIcon.classList.remove("fa-pause")
        playIcon.classList.add("fa-play")
    }
}

function resetPlayerUI() {
    songTitle.innerText = "Song selected"
    image.src = defaultImage
    inputRange.value = 0
    inputRange.max = 100
    setPlayIcon(false)
}

function setSongUI(index) {
    const selectedSong = songsInfo[index]
    if(!selectedSong) return
    songTitle.innerText = selectedSong.name
    image.src = selectedSong.img
}

function playSong(index) {
    const selectedSong = songsInfo[index]
    if(!selectedSong) return

    if(currentAudio) {
        currentAudio.pause()
    }

    currentSongIndex = index
    setSongUI(currentSongIndex)

    currentAudio = new Audio(`./media/${selectedSong.trackName}`)
    currentAudio.volume = currentVolume
    currentAudio.addEventListener("loadedmetadata", () => {
        inputRange.max = currentAudio.duration || 100
    })

    currentAudio.addEventListener("timeupdate", () => {
        if(!isSeeking) {
            inputRange.value = currentAudio.currentTime
        }
    })

    currentAudio.addEventListener("ended", () => {
        if(songsInfo.length <= 1) {
            inputRange.value = 0
            setPlayIcon(false)
            return
        }
        playNextSong()
    })

    currentAudio.play()
    setPlayIcon(true)
}

function playNextSong() {
    if(songsInfo.length === 0) return
    if(currentSongIndex === -1) return

    const nextSongIndex = (currentSongIndex + 1) % songsInfo.length
    playSong(nextSongIndex)
}

function playPrevSong() {
    if(songsInfo.length === 0) return
    if(currentSongIndex === -1) return

    const prevSongIndex = (currentSongIndex - 1 + songsInfo.length) % songsInfo.length
    playSong(prevSongIndex)
}

resetPlayerUI()

for(let [index, item] of songsInfo.entries()) {
    const songItem = document.createElement("p")
    songItem.innerText = item.name
    songItem.setAttribute("class", "songItem")
    songItem.setAttribute("data-index", index)
    songsList.append(songItem)
}

const allSongs = document.querySelectorAll(".songItem")

for(let item of allSongs) {
    item.addEventListener("click", (e) => {
        const clickedSongIndex = Number(e.target.dataset.index)
        if(Number.isNaN(clickedSongIndex)) return
        playSong(clickedSongIndex)
    })
}

playBtn.addEventListener("click", () => {
    if(!currentAudio || currentSongIndex === -1) {
        if(songsInfo.length > 0) {
            playSong(0)
        }
        return
    }

    if(currentAudio.paused) {
        currentAudio.play()
        setPlayIcon(true)
    } else {
        currentAudio.pause()
        setPlayIcon(false)
    }
})

prevBtn.addEventListener("click", playPrevSong)
nextBtn.addEventListener("click", playNextSong)

inputRange.addEventListener("input", () => {
    if(!currentAudio) return
    isSeeking = true
    currentAudio.currentTime = Number(inputRange.value)
})

inputRange.addEventListener("change", () => {
    isSeeking = false
})

volumeRange.addEventListener("input", () => {
    currentVolume = Number(volumeRange.value)
    if(currentAudio) {
        currentAudio.volume = currentVolume
    }
})
