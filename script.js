// Clean 10 Quotes reflecting reels and distance
const monolithData = [
  { text: "Main samajhta hoon. Nidhu? Main tumhare sar pe baitha munja nahi banna chahta. Jao, live your life. Khush raho. I'll be fine.", tag: "Reel 01 Dialogue" },
  { text: "Why it's always 'We're bff's' and never: Shayad wapas aane par sab badal jayega... lekin ek cheez waise ki waise rahegi: Hamari Dosti.", tag: "Reel 02 Dialogue" },
  { text: "Sometimes letting your loved one go is better for both of you.", tag: "Video Caption" },
  { text: "Chennai will feel noticeably quieter, but Bangalore has gained its sharpest mind.", tag: "Bangalore Move" },
  { text: "Distance doesn't unravel two people who have shared authentic laughter, struggles, and late-night calls.", tag: "The Connection" },
  { text: "From 2 months down to 1 month and 20 days: the calendar ran fast, but what we share stays grounded.", tag: "Countdown" },
  { text: "Weekend trains, endless evening video calls, and a friendship that never checks the clock.", tag: "The Promise" },
  { text: "Watching you spread your wings and win is worth every quiet afternoon here.", tag: "Her Growth" },
  { text: "Real friends don't tether you down; they wish you fair winds and keep the porch light burning.", tag: "True Friendship" },
  { text: "No matter how big the new city gets, your primary corner in Chennai is permanent.", tag: "Always Home" }
];

// Populate 10 Quotes
const quotesContainer = document.getElementById("quotesMonolith");
monolithData.forEach((item) => {
  const node = document.createElement("div");
  node.className = "monolith-card glass-surface";
  node.innerHTML = `
    <p class="monolith-text">"${item.text}"</p>
    <p class="monolith-tag">✦ ${item.tag}</p>
  `;
  quotesContainer.appendChild(node);
});

// Background Song Management
const bgSong = document.getElementById("bgSong");
const musicToggleBtn = document.getElementById("musicToggleBtn");
const musicLabel = document.getElementById("musicLabel");

let userManuallyMuted = false;
let hasAutoPlayed = false;

// Attempt auto-play immediately or on first user click/scroll
function startBgSong() {
  if (hasAutoPlayed || userManuallyMuted) return;
  bgSong.volume = 0.45;
  bgSong.play().then(() => {
    hasAutoPlayed = true;
    updateMusicUI(true);
  }).catch(() => {
    // Browser requires a gesture: will trigger on document click
  });
}

document.addEventListener("click", () => {
  if (!hasAutoPlayed && !userManuallyMuted) {
    startBgSong();
  }
}, { once: true });

window.addEventListener("load", () => {
  startBgSong();
});

// Toggle Background Music manually
function toggleBackgroundMusic() {
  if (bgSong.paused) {
    userManuallyMuted = false;
    bgSong.play();
    updateMusicUI(true);
  } else {
    userManuallyMuted = true;
    bgSong.pause();
    updateMusicUI(false);
  }
}

function updateMusicUI(isPlaying) {
  if (isPlaying) {
    musicToggleBtn.classList.remove("stopped");
    musicLabel.textContent = "Music: Playing";
  } else {
    musicToggleBtn.classList.add("stopped");
    musicLabel.textContent = "Music: Paused";
  }
}

// Video Playback Controls with Smart Music Sync
function togglePlayback(videoId, overlayId) {
  const vid = document.getElementById(videoId);
  const otherVidId = videoId === 'vid1' ? 'vid2' : 'vid1';
  const otherOverlayId = videoId === 'vid1' ? 'overlay2' : 'overlay1';
  const otherVid = document.getElementById(otherVidId);
  const overlay = document.getElementById(overlayId);

  // Pause the other video if running
  if (!otherVid.paused) {
    otherVid.pause();
    document.getElementById(otherOverlayId).classList.remove("hidden");
  }

  if (vid.paused) {
    vid.play();
    overlay.classList.add("hidden");
    // Pause background song while video is playing
    if (!bgSong.paused) {
      bgSong.pause();
      updateMusicUI(false);
    }
  } else {
    vid.pause();
    overlay.classList.remove("hidden");
    // Resume background song when video pauses (if user didn't explicitly mute it)
    if (!userManuallyMuted) {
      bgSong.play();
      updateMusicUI(true);
    }
  }
}

// Hook up video ended event to resume song
['vid1', 'vid2'].forEach(id => {
  const v = document.getElementById(id);
  v.addEventListener('ended', () => {
    const overlayId = id === 'vid1' ? 'overlay1' : 'overlay2';
    document.getElementById(overlayId).classList.remove("hidden");
    if (!userManuallyMuted) {
      bgSong.play();
      updateMusicUI(true);
    }
  });
});

function toggleMute(videoId, btn) {
  const vid = document.getElementById(videoId);
  vid.muted = !vid.muted;
  btn.textContent = vid.muted ? "Unmute" : "Mute";
}

function cycleSpeed(videoId, btn) {
  const vid = document.getElementById(videoId);
  const speedLadder = [1.0, 1.25, 0.75];
  let nextIdx = (speedLadder.indexOf(vid.playbackRate) + 1) % speedLadder.length;
  vid.playbackRate = speedLadder[nextIdx];
  btn.textContent = `${vid.playbackRate}x`;
}

function jumpSeconds(videoId, seconds) {
  const vid = document.getElementById(videoId);
  vid.currentTime = Math.min(vid.duration, vid.currentTime + seconds);
}

function toggleFullscreen(videoId) {
  const vid = document.getElementById(videoId);
  if (!document.fullscreenElement) {
    if (vid.requestFullscreen) vid.requestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}

async function togglePictureInPicture(videoId) {
  const vid = document.getElementById(videoId);
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await vid.requestPictureInPicture();
    }
  } catch (err) {
    console.error("PiP error:", err);
  }
}

// Scrubber Progress & Timestamps
function syncVideoProgress(vidId, fillId, timeId) {
  const vid = document.getElementById(vidId);
  const fill = document.getElementById(fillId);
  const time = document.getElementById(timeId);

  if (vid.duration) {
    const percent = (vid.currentTime / vid.duration) * 100;
    fill.style.width = percent + "%";

    const curM = Math.floor(vid.currentTime / 60);
    const curS = Math.floor(vid.currentTime % 60).toString().padStart(2, '0');
    const durM = Math.floor(vid.duration / 60);
    const durS = Math.floor(vid.duration % 60).toString().padStart(2, '0');
    time.textContent = `${curM}:${curS} / ${durM}:${durS}`;
  }
}

function seekVideo(vidId, e) {
  const track = e.currentTarget;
  const rect = track.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const vid = document.getElementById(vidId);

  if (vid.duration) {
    vid.currentTime = (clickX / rect.width) * vid.duration;
  }
}

// Signal Ping
function triggerDistSignal() {
  const toast = document.getElementById("cyberToast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

// Mouse Glow Follower
const glow = document.getElementById("mouseGlow");
window.addEventListener("mousemove", (e) => {
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

// Interactive 3D Tilt Effect
document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y * 0.035}deg) rotateY(${x * 0.035}deg) translateY(-8px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
  });
});

// Dynamic Starfield & Nebula Particle Background
const canvas = document.getElementById("ambient-canvas");
const ctx = canvas.getContext("2d");

let w, h;
function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class DeepStar {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.radius = Math.random() * 1.8 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = -Math.random() * 0.35 - 0.08;
    this.alpha = Math.random() * 0.6 + 0.15;
    this.pulse = Math.random() * 0.015 + 0.005;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha += this.pulse;

    if (this.alpha > 0.8 || this.alpha < 0.15) {
      this.pulse = -this.pulse;
    }
    if (this.y < 0) this.reset();
  }
  draw() {
    ctx.fillStyle = `rgba(232, 190, 119, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

const stars = Array.from({ length: 70 }, () => new DeepStar());

function renderAtmosphere() {
  ctx.clearRect(0, 0, w, h);
  stars.forEach((s) => {
    s.update();
    s.draw();
  });
  requestAnimationFrame(renderAtmosphere);
}
renderAtmosphere();

