// DOM Elements
const musicPlayer = document.querySelector('.music-player');
const playlistBtn = document.querySelector('.playlist-btn');
const closePlaylistBtn = document.querySelector('.close-playlist');
const playlist = document.querySelector('.playlist');
const playPauseBtn = document.querySelector('.play-pause');
const prevBtn = document.querySelector('.fa-step-backward');
const nextBtn = document.querySelector('.fa-step-forward');
const randomBtn = document.querySelector('.fa-random');
const repeatBtn = document.querySelector('.fa-redo');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const currentTimeEl = document.querySelector('.current');
const durationEl = document.querySelector('.duration');
const volumeSlider = document.querySelector('.volume-slider');
const volumeProgress = document.querySelector('.volume-progress');
const volumeIcon = document.querySelector('.fa-volume-up');
const songsList = document.querySelectorAll('.song');

// Music Player State
let isPlaying = false;
let isRandom = false;
let isRepeat = false;
let currentVolume = 0.7;

// Playlist Toggle
playlistBtn.addEventListener('click', () => {
    playlist.classList.add('active');
});

closePlaylistBtn.addEventListener('click', () => {
    playlist.classList.remove('active');
});

// Play/Pause Toggle
playPauseBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    const icon = playPauseBtn.querySelector('i');
    icon.classList.toggle('fa-play');
    icon.classList.toggle('fa-pause');
    
    // Add a pulsing animation to the album art when playing
    const albumArt = document.querySelector('.album-art img');
    if (isPlaying) {
        albumArt.style.transform = 'scale(1.05)';
    } else {
        albumArt.style.transform = 'scale(1)';
    }
});

// Progress Bar Interaction
progressBar.addEventListener('click', (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const percentage = (clickX / width) * 100;
    progress.style.width = `${percentage}%`;
    
    // Update time display (just for demo)
    const duration = 220; // 3:40 in seconds
    const currentTime = Math.floor((percentage / 100) * duration);
    updateTimeDisplay(currentTime, duration);
});

// Volume Control
volumeSlider.addEventListener('click', (e) => {
    const width = volumeSlider.clientWidth;
    const clickX = e.offsetX;
    const percentage = (clickX / width) * 100;
    volumeProgress.style.width = `${percentage}%`;
    currentVolume = percentage / 100;
    
    // Update volume icon
    updateVolumeIcon(currentVolume);
});

// Volume Icon Click (Mute/Unmute)
volumeIcon.addEventListener('click', () => {
    if (currentVolume > 0) {
        // Store the previous volume and mute
        volumeIcon.dataset.prevVolume = currentVolume;
        currentVolume = 0;
        volumeProgress.style.width = '0%';
        volumeIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
    } else {
        // Restore the previous volume
        currentVolume = volumeIcon.dataset.prevVolume || 0.7;
        volumeProgress.style.width = `${currentVolume * 100}%`;
        volumeIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
    }
});

// Random and Repeat Toggles
randomBtn.addEventListener('click', () => {
    isRandom = !isRandom;
    randomBtn.style.color = isRandom ? '#1db954' : 'white';
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.style.color = isRepeat ? '#1db954' : 'white';
});

// Playlist Song Selection
songsList.forEach(song => {
    song.addEventListener('click', () => {
        // Remove active class from all songs
        songsList.forEach(s => s.classList.remove('active'));
        // Add active class to clicked song
        song.classList.add('active');
        
        // Update player info
        const title = song.querySelector('h4').textContent;
        const artist = song.querySelector('p').textContent;
        const duration = song.querySelector('.song-duration').textContent;
        
        document.querySelector('.track-title').textContent = title;
        document.querySelector('.track-artist').textContent = artist;
        document.querySelector('.duration').textContent = duration;
        
        // Reset progress
        progress.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        
        // Auto play when selecting new song
        if (!isPlaying) {
            playPauseBtn.click();
        }
    });
});

// Helper Functions
function updateTimeDisplay(current, duration) {
    currentTimeEl.textContent = formatTime(current);
    durationEl.textContent = formatTime(duration);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateVolumeIcon(volume) {
    volumeIcon.classList.remove('fa-volume-up', 'fa-volume-down', 'fa-volume-off', 'fa-volume-mute');
    
    if (volume > 0.5) {
        volumeIcon.classList.add('fa-volume-up');
    } else if (volume > 0.1) {
        volumeIcon.classList.add('fa-volume-down');
    } else if (volume > 0) {
        volumeIcon.classList.add('fa-volume-off');
    } else {
        volumeIcon.classList.add('fa-volume-mute');
    }
}
