// 1. Navigation Logic
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });

    // Show specific page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        // Small timeout to allow CSS fade transition
        setTimeout(() => {
            targetPage.classList.add('active');
        }, 10);
    }

    // Update Navbar Active State
    const navItems = document.querySelectorAll('.navbar li');
    navItems.forEach(item => item.classList.remove('active-nav'));

    // Find the nav item that was clicked (simple match)
    const activeBtn = Array.from(navItems).find(li => li.getAttribute('onclick').includes(pageId));
    if (activeBtn) activeBtn.classList.add('active-nav');
}

// 2. Shayari Randomizer Data
// TODO: Replace these with your own heartfelt shayaris!
const shayaris = [
    "Phoolon ne amrit ka jaam bheja hai, Suraj ne gagan se salaam bheja hai, Mubarak ho aapko naya janam din, Humne tahe-dil se ye paigham bheja hai.💖",
    "Tumse baat ho jaaye toh din thoda aur khoobsurat lagta hai, Jaise bina kisi wajah ke dil halka sa muskurane lagta hai.🥰",
    "Tumhari is ada ka kya jawaab doon, Apne pyare se dost ko kya uphaar doon? Koi achha sa phool hota to maali se mangvata, Jo khud gulaab hai, usko kya gulaab doon.🌷",
    "Khushi se beete tera har din, Har suhani raat ho, Jis taraf aapke kadam pade, Wahan phoolon ki barsaat ho.🌼",
    "I haven't met you, yet I know you. I haven't seen you, yet I see you.👀😊"
];

// 3. Shayari Logic
function nextShayari() {
    const display = document.getElementById('shayari-display');

    // Fade out
    display.style.opacity = '0';
    display.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        // Pick random
        const randomIndex = Math.floor(Math.random() * shayaris.length);
        display.innerText = shayaris[randomIndex];

        // Fade in
        display.style.opacity = '1';
    }, 500);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    loadTheme();

    // Load first shayari
    nextShayari();

    // Initialize carousel for infinite scrolling
    initCarousel();
});

// 4. Carousel Infinite Scroll Logic
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    // Clone all slides and append them to create seamless loop
    const slides = Array.from(track.children);
    slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        track.appendChild(clone);
    });
}

// 5. Theme Toggle Logic
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Load saved theme preference
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
}

// 6. Background Music Logic
let isMusicPlaying = false;

function toggleMusic() {
    const audio = document.getElementById('bg-music');
    const btn = document.getElementById('music-toggle');
    const icon = btn.querySelector('i');

    if (isMusicPlaying) {
        audio.pause();
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-music');
        btn.classList.remove('music-playing');
        isMusicPlaying = false;
    } else {
        audio.play().then(() => {
            icon.classList.remove('fa-music');
            icon.classList.add('fa-pause');
            btn.classList.add('music-playing');
            isMusicPlaying = true;
        }).catch(err => {
            console.log("Autoplay prevented:", err);
            alert("Tap anywhere to let the music play! 🎶");
        });
    }
}

// Attempt play on first interaction
function initMusic() {
    const audio = document.getElementById('bg-music');
    const btn = document.getElementById('music-toggle');
    const icon = btn.querySelector('i');

    const playAttempt = () => {
        audio.play().then(() => {
            isMusicPlaying = true;
            icon.classList.remove('fa-music');
            icon.classList.add('fa-pause');
            btn.classList.add('music-playing');
            // Remove listeners once played
            document.removeEventListener('click', playAttempt);
            document.removeEventListener('touchstart', playAttempt);
        }).catch(e => {
            console.log("Still waiting for interaction");
        });
    };

    document.addEventListener('click', playAttempt);
    document.addEventListener('touchstart', playAttempt);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    loadTheme();

    // Load first shayari
    nextShayari();

    // Initialize carousel for infinite scrolling
    initCarousel();

    // Initialize music
    initMusic();

    // Initialize New Media Player
    initMediaPlayer();
});

// 7. Media Player Logic
const songs = [
    {
        title: "Arz Kiya Hai 🌹",
        artist: "Anuv Jain",
        caption: "Aise tu lagay ki gulaab hai...",
        path: "assets/musics/Arz Kiya Hai  -  Anuv Jain   Aise tu lagay ki gulaab hai 🌹.mp3"
    },
    {
        title: "Chaudhary ✨",
        artist: "Mame Khan",
        caption: "Lukk Chipp Na Javo Ji...",
        path: "assets/musics/Lukk Chipp Na Javo Ji Manney Deed Karavo Ji - Chaudhary.mp3"
    },
    {
        title: "Zulfein 💫",
        artist: "Mehul Mahesh & DJ Aynik",
        caption: "Melodies for your soul...",
        path: "assets/musics/Mehul Mahesh  DJ Aynik - Zulfein.mp3"
    },
    {
        title: "Voh Dekhnay Mein 💖",
        artist: "Ali Zafar",
        caption: "Simply beautiful...",
        path: "assets/musics/Voh Dekhnay Mein Full Video.mp3"
    }
];

let currentSongIndex = 0;

function initMediaPlayer() {
    const audio = document.getElementById('main-audio');
    const bgMusic = document.getElementById('bg-music');

    // Load first song but don't play
    loadSong(currentSongIndex);
    renderPlaylist();

    // Auto-pause background music when player starts
    audio.addEventListener('play', () => {
        if (!bgMusic.paused) {
            toggleMusic(); // Use existing toggle to handle UI state
        }
        document.querySelector('.disk').classList.add('playing');
    });

    audio.addEventListener('pause', () => {
        document.querySelector('.disk').classList.remove('playing');
    });

    // Auto-play next song
    audio.addEventListener('ended', () => {
        nextSong();
    });
}

function loadSong(index) {
    const song = songs[index];
    const audio = document.getElementById('main-audio');

    document.getElementById('player-title').innerText = song.title;
    document.getElementById('player-artist').innerText = song.artist;
    document.getElementById('player-caption').innerText = `"${song.caption}"`;

    audio.src = song.path;

    // Update playlist active state
    updatePlaylistActiveState(index);
}

function renderPlaylist() {
    const list = document.getElementById('playlist-items');
    list.innerHTML = '';

    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = `playlist-item ${index === currentSongIndex ? 'active' : ''}`;
        li.onclick = () => playSongFromPlaylist(index);

        li.innerHTML = `
            <div class="thumb"><i class="fas fa-music"></i></div>
            <div class="info">
                <h5>${song.title}</h5>
                <span>${song.artist}</span>
            </div>
        `;
        list.appendChild(li);
    });
}

function updatePlaylistActiveState(index) {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, i) => {
        if (i === index) item.classList.add('active');
        else item.classList.remove('active');
    });
}

function playSongFromPlaylist(index) {
    currentSongIndex = index;
    loadSong(currentSongIndex);
    document.getElementById('main-audio').play();
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    document.getElementById('main-audio').play();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    document.getElementById('main-audio').play();
}