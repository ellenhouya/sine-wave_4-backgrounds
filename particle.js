const starBuffer = document.createElement("canvas");
const starBufferCtx = starBuffer.getContext("2d");
starBuffer.width = innerWidth;
starBuffer.height = innerHeight;

class Particle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.opacity = 1;
    this.color = `rgba(${getRandomNum_floor(0, 255)}, ${getRandomNum_floor(
      0,
      255
    )},${getRandomNum_floor(0, 255)}, ${this.opacity})`;
  }

  draw() {
    starBufferCtx.beginPath();
    starBufferCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    starBufferCtx.fillStyle = this.color;
    starBufferCtx.fill();
    starBufferCtx.closePath();
  }

  update() {
    this.draw();
  }
}
