const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMuteClick = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = value;

  muteBtn.innerText = Number(volumeValue) !== 0 ? "Mute" : "Unmute";
};

const formatTime = (seconds) => {
  const startIdx = seconds >= 3600 ? 11 : 14;
  return new Date(seconds * 1000).toISOString().substring(startIdx, 19);
};

const handelTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreen = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    document.exitFullscreen();
    fullScreenBtn.innerText = "Enter Full Screen";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtn.innerText = "Exit Full Screen";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    // 여러번 실행되는 것을 방지
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }

  if (controlsMovementTimeout) {
    // 마우스가 움직이고 있다면 실행되는 것을 방지
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }

  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

const testKeyboard = (event) => {
  console.log(event.code);
};

const handleKeyboard = (event) => {
  // 스페이스바를 누르면 재생 / 일시정지
  if (event.keyCode === 32) {
    handlePlayClick();
  }
  // m 키를 누르면 음소거 / 소리재생
  if (event.keyCode === 77) {
    handleMuteClick();
  }
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch("/api/videos/" + id + "/view", {
    method: "POST",
  });
};

videoContainer.addEventListener("click", handlePlayClick);
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("timeupdate", handelTimeUpdate);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
window.addEventListener("keydown", handleKeyboard);
