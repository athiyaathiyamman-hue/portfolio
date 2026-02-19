const frame = document.getElementById("frame");

const totalFrames = 240;
const framePath = (index) =>
  `frames/ezgif-frame-${String(index).padStart(3, "0")}.jpg`;

function preloadImages() {
  for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    img.src = framePath(i);
  }
}

preloadImages();

function updateFrame() {
  const scrollTop = window.scrollY;
  const scrollHeight =
    document.body.scrollHeight - window.innerHeight;

  const scrollFraction = scrollTop / scrollHeight;
  const frameIndex = Math.min(
    totalFrames,
    Math.max(1, Math.ceil(scrollFraction * totalFrames))
  );

  frame.src = framePath(frameIndex);
}

window.addEventListener("scroll", updateFrame);
