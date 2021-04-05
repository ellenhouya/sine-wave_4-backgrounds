const gui = new dat.GUI();
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const pInfo = document.getElementById("para").getBoundingClientRect();

const {
  bottom: pBottom,
  height: pHeight,
  left: pLeft,
  right: pRight,
  top: pTop,
  width: pWidth,
  x,
  y,
} = pInfo;

const wave = {
  x: canvas.width / 2,
  y: canvas.height / 2 + 470,
  length: 0.006,
  amplitude: 100,
  frequency: 0.01,
  waveHeightRate: 0.95,
};

const strokeColor = {
  h: 200,
  s: 50,
  l: 50,
};

const backgroundColor = {
  r: 0,
  g: 0,
  b: 0,
  a: 0.01,
};

gui.hide();

const waveFolder = gui.addFolder("wave");

waveFolder.add(wave, "y", 0, canvas.height + 500);
waveFolder.add(wave, "length", -0.01, 0.01);
waveFolder.add(wave, "amplitude", -300, 300);
waveFolder.add(wave, "frequency", -0.01, 1);
waveFolder.add(wave, "waveHeightRate", 0.5, 2.5);
waveFolder.open();

const strokeFolder = gui.addFolder("stroke");
strokeFolder.add(strokeColor, "h", 0, 255);
strokeFolder.add(strokeColor, "s", 0, 100);
strokeFolder.add(strokeColor, "l", 0, 100);

const backgroundFolder = gui.addFolder("background");
backgroundFolder.add(backgroundColor, "r", 0, 255);
backgroundFolder.add(backgroundColor, "g", 0, 255);
backgroundFolder.add(backgroundColor, "b", 0, 255);
backgroundFolder.add(backgroundColor, "a", 0, 1);

let increment = wave.frequency;

let colorR = 255;
let colorG = 255;
let colorB = 255;

let particleArray;

let radians = 0;
let alpha = 1;
let mouseDown = false;
let gradient = c.createLinearGradient(
  0,
  canvas.height / 3,
  canvas.width,
  canvas.height
);

const textCon = document.querySelector(".textCon");
const textCon2 = document.querySelector(".textCon2");

let redReduction = 0.8;
let greenReduction = 0.4;
let blueReduction = 0.8;

let bkgIndex = 0;
let fillStyleColor = `rgb(${colorR}, ${colorG}, ${colorB})`;

const bkgImages = ["leaves", "ocean", "cherry", "winter"];
let bkgFrames = 0;
let bkgName = bkgImages[bkgIndex];
let isBkgChanged = false;

function getRandomNum_floor(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function drawStars() {
  starBufferCtx.clearRect(0, 0, canvas.width, canvas.height);
  starBufferCtx.fillStyle = `rgba(10, 10, 10, ${alpha})`;
  starBufferCtx.fillRect(0, 0, starBuffer.width, starBuffer.height);
  starBufferCtx.save();
  starBufferCtx.translate(canvas.width / 2, canvas.height / 2);
  starBufferCtx.rotate(radians);
  particleArray.forEach((particle) => {
    particle.draw();
  });
  starBufferCtx.restore();

  radians += 0.0008;

  c.drawImage(starBuffer, 0, 0, starBuffer.width, starBuffer.height);
}

function handleMixBlend(mixBlendValue) {
  document.querySelector(".text-moving-bkg").style.mixBlendMode = mixBlendValue;
}

let backgroundName;
let frameRate = 60;
let frames = 60 * 3;

let leavesR = (255 - 149) / frames;
let leavesG = (255 - 202) / frames;
let leavesB = (255 - 149) / frames;

let cherryR = (255 - 253) / frames;
let cherryG = (255 - 158) / frames;
let cherryB = (255 - 187) / frames;

let oceanR = (255 - 244) / frames;
let oceanG = (255 - 172) / frames;
let oceanB = (255 - 122) / frames;

let winterR = (255 - 161) / frames;
let winterG = (255 - 0) / frames;
let winterB = (255 - 242) / frames;

let moveLeft = innerWidth;
let clickCount = 0;

function makeWaveWhite(bkgR, bkgG, bkgB) {
  if (colorG < 255) {
    colorR += bkgR * 3;
    colorG += bkgG * 3;
    colorB += bkgB * 3;
  }
}

function handleDarkBkg() {
  setTimeout(() => {
    handleMixBlend("difference");
  }, 500);

  if (backgroundName === "leaves") {
    makeWaveWhite(leavesR, leavesG, leavesB);
  } else if (backgroundName === "cherry") {
    makeWaveWhite(cherryR, cherryG, cherryB);
  } else if (backgroundName === "ocean") {
    makeWaveWhite(oceanR, oceanG, oceanB);
  } else if (backgroundName === "winter") {
    makeWaveWhite(winterR, winterG, winterB);
  }
}

function reduceColorValue(redValue, greenValue, blueValue) {
  redReduction = redValue;
  greenReduction = greenValue;
  blueReduction = blueValue;
}

function handleWaveBackgroundColor(name, stopValue, r, g, b) {
  backgroundName = name;

  colorR -= redReduction;
  colorG -= greenReduction;
  colorB -= blueReduction;

  if (colorB <= stopValue) {
    colorR = r;
    colorG = g;
    colorB = b;
  }
}

function colorReduction(sceneR, sceneG, sceneB) {
  redReduction = sceneR;
  greenReduction = sceneG;
  blueReduction = sceneB;
}

function handleWaveBackground(bkgName) {
  if (bkgName === "leaves") {
    handleWaveBackgroundColor(bkgName, 149, 149, 202, 149);
  } else if (bkgName === "cherry") {
    // 253, 158, 187;

    colorReduction(cherryR, cherryG, cherryB);
    handleWaveBackgroundColor(bkgName, 187, 253, 158, 187);
  } else if (bkgName === "ocean") {
    //244, 172, 122
    colorReduction(oceanR, oceanG, oceanB);
    handleWaveBackgroundColor(bkgName, 122, 244, 172, 122);
  } else if (bkgName === "winter") {
    //208, 153, 218
    colorReduction(winterR, winterG, winterB);
    handleWaveBackgroundColor(bkgName, 242, 161, 0, 242);
  }
}

function handleBkgImages(name) {
  canvas.style.background = ` url("./${name}.jpg") center/cover no-repeat`;

  if (alpha > 0.99) {
    bkgName = bkgImages[bkgIndex];
  }

  if (bkgIndex > bkgImages.length - 1) {
    bkgIndex = 0;
  }
}

function drawWave() {
  c.beginPath();

  c.moveTo(0, canvas.height / 2);

  for (let i = 0; i < canvas.width; i++) {
    c.fillStyle = fillStyleColor;

    let movingBkgY =
      wave.y -
      i * 0.5 +
      Math.sin(i * wave.length + increment) *
        wave.amplitude *
        Math.sin(increment);

    c.fillRect(i, movingBkgY, 1, canvas.height / wave.waveHeightRate);
  }
}

function adjustWaveY() {
  if (canvas.width > 1800) {
    wave.y = 1300;
  } else {
    wave.y = canvas.height / 2 + 500;
  }
}
