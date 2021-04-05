function init() {
  particleArray = [];

  for (i = 0; i < Math.floor(innerWidth / 4); i++) {
    const canvasWidth = canvas.width + 300;
    const canvasHeight = canvas.height + 300;
    const x = Math.random() * canvasWidth - canvasWidth / 2;
    const y = Math.random() * canvasHeight - canvasHeight / 2;
    const radius = Math.random() * 2.5;

    particleArray.push(new Particle(x, y, radius));
  }
  handleBkgImages(bkgName);

  adjustWaveY();
}

function animate() {
  requestAnimationFrame(animate);

  bkgFrames++;
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = `rgba(10, 10, 10, ${alpha})`;
  c.clearRect(0, 0, canvas.width, canvas.height);

  drawStars();

  alpha = Math.abs(Math.cos(radians * 6));

  fillStyleColor = `rgb(${colorR}, ${colorG}, ${colorB})`;

  // if dark background
  if (alpha >= 0.8 && alpha <= 1) {
    handleDarkBkg();
  } else {
    handleMixBlend("normal");
    handleWaveBackground(bkgName);
  }
  drawWave();
  increment += wave.frequency;
}

init();
animate();

addEventListener("resize", (e) => {
  init();
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  starBuffer.width = innerWidth;
  starBuffer.height = innerHeight;
  adjustWaveY();
});

document.querySelector(".change").addEventListener("click", (e) => {
  ++bkgIndex;
  ++clickCount;

  if (
    clickCount > 0 &&
    clickCount % document.querySelectorAll(".textWrapper").length === 0
  ) {
    location.reload();
  } else {
    document.querySelector(
      ".text-moving-bkg"
    ).style.transform = `translateX(${-moveLeft}px)`;
    moveLeft += innerWidth;
  }

  bkgName = bkgImages[bkgIndex];
  handleBkgImages(bkgName);
});
