const playBtn = document.getElementById("playBtn");
const resetBtn = document.getElementById("resetBtn");
const song = document.getElementById("song");
const lyricsDiv = document.getElementById("lyrics");

const lyrics = [
    [0, "🎵 Song starts..."],
    [9, "Tu pass ha mere pass ha aisy"],
    [15, "Mera koi ehsas ha jesy"],
    [21, "Tu pass ha mere pass ha aisy"],
    [26, "Mera koi ehsas ha jesy"],
    [32, "Heye ma mar hi jaon"],
    [35, "Jo tujh ko nah paon"],
    [38, "Baton my teri ma raatein betaonoo"],
    [44, "Hontho py lamha lamha ha naam tera heyee"],
    [49, "Tujh ko hi gaaon ma"],
    [53, "Tujh ko phukaronooooo....."],
    [66, "Saiyaara toh tu badla nahi ha"],
    [72, "Mosam zara sa rotha howa ha"],
    [78, "Saiyaara toh tu badla nahi ha"],
    [84, "Mosam zara sa rotha howa ha"],
    [89, "Song beats 🎶"],
    [97, "Abhi bhi kuch pal baki hein mery pass"],
    [100, "Song beats 🎶"],
    [104, "Betay lamhon sy duniya basa lon"],
    [110, "Ma tu tery ansoonon ka bana hon"],
    [115, "Meri hasi my teri sadaein.."],
    [122, "Teri kahani khud ko sunao.."],
    [128, "Yaadon k tarayyyyyyyy.........."],
    [139, "Yaadon k taray totty gy kesy"],
    [145, "Mery hein jo wo rothy gy kesy"],
    [151, "Betay dinon ki kholi kitabein.."],
    [156, "Guzray palon ko kesy bhula dein"],
    [162, "Heye ma mar hi jaon"],
    [166, "Jo tujh ko nah paon"],
    [169, "Baton my teri ma raatein betaonoo"],
    [174, "Hontho py lamha lamha ha naam tera heyee"],
    [180, "Tujh ko hi gaaon ma"],
    [184, "Tujh ko phukaronooooo....."],
    [197, "Saiyaara toh tu badla nahi ha"],
    [203, "Mosam zara sa rotha howa ha"],
    [208, "Saiyaara toh tu badla nahi ha"],
    [215, "Mosam zara sa rotha howa ha"],
    [217, "Song beats 🎶"],
    [245, "Song ends 🎶"]
];

let currentLine = -1;

async function detectBPM() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const response = await fetch(song.src);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    const channelData = audioBuffer.getChannelData(0); 
    const sampleRate = ctx.sampleRate;

    const samples = [];
    const step = Math.floor(sampleRate / 22050);
    for (let i = 0; i < channelData.length; i += step) {
        samples.push(channelData[i]);
    }

    const mt = new MusicTempo(samples);
    const bpm = mt.tempo;
    console.log("Detected BPM:", bpm);

    const beatDuration = 60 / bpm;
    document.body.style.animationDuration = `${beatDuration * 8}s`;
}

detectBPM();

playBtn.addEventListener("click", () => {
    if (song.paused) {
        song.play();
        playBtn.textContent = "Pause";
    } else {
        song.pause();
        playBtn.textContent = "Play";
    }
});

resetBtn.addEventListener("click", () => {
    song.pause();
    song.currentTime = 0;
    lyricsDiv.innerHTML = "";
    currentLine = -1;
    playBtn.textContent = "Play";
});

song.addEventListener("timeupdate", () => {
    const currentTime = song.currentTime;

    for (let i = 0; i < lyrics.length; i++) {
        const [time, text] = lyrics[i];
        const nextTime = lyrics[i + 1]?.[0] || Infinity;

        if (currentTime >= time && currentTime < nextTime && currentLine !== i) {
            currentLine = i;

            const p = document.createElement("p");
            p.textContent = text;
            p.id = "line-" + i;
            lyricsDiv.appendChild(p);

            document.querySelectorAll("#lyrics p").forEach(el => el.classList.remove("active"));
            p.classList.add("active");

            p.scrollIntoView({ behavior: "smooth", block: "end" });

            break;
        }
    }
});

song.addEventListener("ended", () => {
    playBtn.textContent = "Play";
});