// followed tutorial/foundation of https://www.youtube.com/watch?v=uk96O7N1Yo0&t=901s

let song;
let img;
let fft;
let particles = [];
let firstTime = true;

function preload() {
  img = loadImage('album-bg.jpeg');
  song = loadSound(trackList[trackIndex].path);
  song.setVolume(0.5)
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  // layer order
  canvas.style('z-index', '-1');
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER);

  // fft variable is 0.8 by default, the higher it is the smoother it is from one value to another
  //by lowering it to 0.3 the image movement is more prominent
  fft = new p5.FFT(0.3)

  img.filter(BLUR, 12)

  noLoop()
}

function draw() {
  background(0)

  // center everything
  translate(width / 2, height / 2)

  // analyze audio
  // getEnergy accepts a range of frequencies and will return from 0-255 (NOT Hz)
  fft.analyze()
  amp = fft.getEnergy(20, 200)

  // push and pop so it only affects image
  // once it reaches a certain threshold the image will rotate a bit
  // "beat detection"
  push()
  if (amp > 220) {
    rotate(random(-0.5, 0.5))
  }

  image(img, 0, 0, width + 100, height + 100)
  pop()

  // black rectangle overlay
  let alpha = map(amp, 0, 255, 180, 150)
  fill(0, alpha)
  noStroke()
  rect(0, 0, width, height)

  stroke(225)
  strokeWeight(5)
  noFill()

  // actual waveform from fft (fast fourier transform)
  let wave = fft.waveform()

  push();
  translate(0, -120);
  if (lineVisualizer) {
    for (let i = 0; i <= 80; i += 1) {
      let index = floor(map(i, 0, 80, 0, wave.length - 1));
      let sharpness = map(volumeSlider.value, 0, 100, 0, height / 6);
      let x = map(i, 0, 80, -width / 2, width / 2);
      let y = map(wave[index], -1, 1, -sharpness * 3, sharpness * 3);
      line(x, -y, x, y);

    }
  } else {
    //  }
    // creates two semicircles
    for (let t = -1; t <= 1; t += 2) {
      console.log(volumeSlider.value);
      beginShape();
      for (let i = 0; i <= 180; i += 0.5) {
        let index = floor(map(i, 0, 180, 0, wave.length - 1))
        let avgRadius = 180;
        let sharpness = map(volumeSlider.value, 0, 100, 0, height / 10);
        // 20 was originally 150 (large circle in center)
        let radius = map(wave[index], -1, 1, avgRadius - sharpness, avgRadius + sharpness);
        let x = radius * sin(i) * t;
        let y = radius * cos(i);
        vertex(x, y);
      }
      endShape();

    }

    for (let t = -1; t <= 1; t += 2) {
      beginShape();
      for (let i = 0; i <= 180; i += 0.5) {
        let index = floor(map(i, 0, 180, 0, wave.length - 1));
        let avgRadius = 50;
        let sharpness = map(volumeSlider.value, 0, 100, 0, height / 50);
        // 20 was originally 150 (large circle in center)
        let radius = map(wave[index], -1, 1, avgRadius - sharpness, avgRadius + sharpness);
        let x = radius * sin(i) * t;
        let y = radius * cos(i);
        vertex(x, y)
      }
      endShape()

    }
  }

  // particles & reacting to the beat

  // only have active particles with circle visualizer
  if (lineVisualizer == false) {
    let p = new Particle();
    particles.push(p);

    // decides which particles to show depending on position
    for (let i = particles.length - 1; i >= 0; i--) {
      if (!particles[i].edges()) {
        particles[i].update(amp > 230)
        particles[i].show()
      } else {
        particles.splice(i, 1)
      }
    }
  }
  pop();

  //line visualizer switch (bottom right corner)
  fill(150);
  noStroke();
  rect(width / 2 - 30, height / 2 - 30, 30, 15, 15);
  fill(60);
  if (lineVisualizer) {
    circle((width / 2 - 30) + 15 / 2, (height / 2 - 30), 15);
    //rect(0,0,100);
  }
  else {
    circle((width / 2 - 30) - 15 / 2, (height / 2 - 30), 15);
  }
  noFill();
  fill(200);
}

// reset
let lineVisualizer = false;

// audio plays/stops on mouseclick as browsers don't support autoplay
function mouseClicked() {
  if (dist(0 + width / 2, height / 3.4 + height / 2, mouseX, mouseY) < 65 && loading == false) {
    if (song.isPlaying()) {
      song.pause();
      pauseTrack();
      noLoop()
    } else {
      playTrack();
      song.play();
      loop()
    }
  }

  // since translate doesn't affect mouseX and mouseY
  let x = width - 30;
  let y = height - 30;
  // console.log(dist(mouseX,mouseY,x,y));
  // detect if user pressed on shape change button
  if (dist(mouseX, mouseY, x, y) < 30) {
    lineVisualizer = !lineVisualizer;
  }
}

// particle class + position, velocity, acceleration
class Particle {
  constructor() {
    // orig multi by 250 for large circle in center
    // positions particles randomly on radius of circle
    this.pos = p5.Vector.random2D().mult(180);
    // particle movement
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001));

    this.width = random(3, 5);

    this.color = [random(200, 255), random(200, 255), random(200, 255),];
  }
  // beat detection; if cond is true particles move faster
  update(cond) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if (cond) {
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
  }

  // limits where particles go (canvas boundaries)
  edges() {
    if (this.pos.x < -width / 2 || this.pos.x > width / 2 ||
      this.pos.y < - height / 2 || this.pos.y > height / 2) {
      return true;
    } else {
      return false;
    }
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.width);
  }
}

