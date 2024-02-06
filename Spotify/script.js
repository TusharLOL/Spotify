// console.log("Lets Write JS")
let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {
    // Calculate minutes and remaining seconds

    if(isNaN(seconds)||seconds<0){
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    // Convert minutes and remaining seconds to strings with leading zeros if necessary
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    
    // Return the formatted time as a string
    return formattedMinutes + ':' + formattedSeconds;
}


async function getsongs(folder){
    currFolder = folder
    // console.log(currFolder)
    let a = await fetch(`http://127.0.0.1:3000/Spotify/songs/${folder}/`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []
    for(let i = 0;i<as.length;i++){
        const element = as[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split( `/${folder}/`)[1])
        }
    }

    let songUL = document.querySelector(".songslist").getElementsByTagName("ul")[0];
    // console.log(songUL)
    songUL.innerHTML = ""
    for (const song of songs) {
        let x = song.replaceAll("%20"," ")
        let y = x.replaceAll("CeeNaija.com","")
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class = "invert" src="music.svg" alt="">
        <div class="info">
            <div>${y.replaceAll("()","")}</div>
            <div>Tushar</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="play.svg" alt="">
        </div>
        </li>`
    }

    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    // console.log(currFolder)
    // return songs
    // return currFolder
}

// console.log(currFolder)

const playMusic=(track,pause=false)=>{
    // let audio = new Audio("http://127.0.0.1:3000/Spotify/songs/"+track)
    // console.log(currFolder)
    currentSong.src = `http://127.0.0.1:3000/Spotify/songs/${currFolder}/` + track;
    // console.log(currentSong.src)
    if(!pause){
        currentSong.play()
        play.src = "pause.svg"
        // console.log(currentSong)

    }
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:3000/Spotify/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardConatiner")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        // console.log(e.href)
    if(e.href.includes("/songs")){
        let folder = e.href.split("/").slice(-2)[0]
        let a = await fetch(`http://127.0.0.1:3000/Spotify/songs/${folder}/info.json`)
        let response = await a.json();
        // console.log(response)
        cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}"class="card ">
        <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"
                fill="none"
                style="background-color: green; border-radius: 50%; display: flex; justify-content: center; align-items: center; padding: 10px; width:30px; height:30px">
                <path
                d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                stroke="#000000" stroke-width="1.5" stroke-linejoin="round" fill="black" />
                </svg>
                
                </div>
                <img src="/Spotify/songs/${folder}/cover.jpg" alt="">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
                </div>`
            }
            
        }
        Array.from(document.getElementsByClassName("card")).forEach(e=>{
            e.addEventListener("click",async item=>{
                songs = await getsongs(`${item.currentTarget.dataset.folder}`)
        
        
            })
        })
}
async function main(){
    await getsongs("Today's-Top-Hits");
    playMusic(songs[0],true)

    displayAlbums();
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1) >= 0){
                playMusic(songs[index-1])

        }
        else{
                playMusic(songs[(songs.length)-1])
        }
    })
    next.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1) < songs.length){
                playMusic(songs[index+1])
        }
        else{
                playMusic(songs[0])
        }

    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        currentSong.volume = parseInt(e.target.value)/100
    })

}

main()