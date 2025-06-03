let bodyObj;
let fireObj;
let textureImg;
let fireOffset = 0;
let particles = []
const fireDelay = 16
const fireIncrement = 8
const shiny = Math.floor(Math.random() * 20) === 0;
let spheremap
let star

function preload() {

  bodyObj = loadModel('assets/CYNDAQUIL_body.obj', true);
  fireObj = loadModel('assets/CYNDAQUIL_fire.obj', true);
  if (shiny) textureImg = loadImage('assets/SHINY_CYNDAQUIL_texture.png');
  else textureImg = loadImage('assets/CYNDAQUIL_texture.png');
  spheremap = loadImage('assets/skybox.png')
  star = loadImage('assets/star.png')

}

function setup() {
  createCanvas(500, 500, WEBGL);
  noStroke();
}


function draw() {
  orbitControl();

  panorama(spheremap);

  perspective(0.4)
  scale(1, -1, 1); // Flipa a câmera verticalmente para exibir o modelo de pé
  rotateY(0.6)

  ambientLight(150, 100, 100);
  directionalLight(255, 255, 255, 1, 0, -1+fireOffset/1000);
  directionalLight(255, 255, 255, 0, 1, 1+fireOffset/100);
  directionalLight(255, 255, 255, 0, 2, 0);

  push(); // Desenha o cyndaquil
  texture(textureImg);
  model(bodyObj);
  pop();

  push(); // Desenha o fogo em suas costas
  translate(0, 30, -100);
  scale(0.7+fireOffset/1000);
  rotateX(fireOffset/300)

  ambientMaterial(0, 0, 0);
  emissiveMaterial(255, 80 + fireOffset, 0);
  model(fireObj);
  pop();

  const currDelay = frameCount%fireDelay 
  if (currDelay > fireDelay/2) {
    fireOffset -= fireIncrement
  } else if (currDelay > 0) {
    fireOffset += fireIncrement
  } else fireOffset = 0;

  // --- BRILHINHO DE SHINY ---
  if (shiny) {
    if (frameCount % 5 === 0) {
      particles.push(new Particle());
    }

    updateAndDrawParticles();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(-100, 100), random(-100, 100), random(-100, 50));
    this.vel = createVector(random(-1, 1), random(-1, 1), random(-1, 1)).normalize().mult(random(0.5, 1.5));
    this.life = 60;
    this.size = random(1, 3);
    this.rot = random(0, PI)
  }

  update() {
    this.pos.add(this.vel);
    this.life--;
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    imageMode(CENTER);
    tint(255, map(this.life, 0, 60, 0, 255));
    rotateX(this.rot+this.life/100)
    rotateY(this.rot+this.life/100)
    image(star, 0, 0, this.size*5, this.size*5);
    pop();

    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    imageMode(CENTER);
    tint(255, map(this.life, 0, 60, 0, 255));
    rotateX((this.rot+this.life/100)+HALF_PI)
    rotateY((this.rot+this.life/100)+HALF_PI)
    rotateZ(HALF_PI)
    image(star, 0, 0, this.size*5, this.size*5);
    pop();
  }
}

function updateAndDrawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.draw();
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}