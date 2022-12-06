//INITIAL FRAMEWORK
// followed tutorial https://www.youtube.com/watch?v=uk96O7N1Yo0&t=901s

var song
var img
var fft
var particles = []
var firstTime = true

function preload(){
  img = loadImage('album-bg.jpeg')
  song = loadSound(trackList[trackIndex].path)
  song.setVolume(0.6)
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight)
  canvas.position(0,0)
  canvas.style('z-index', '-1')
  angleMode(DEGREES)
  imageMode(CENTER)
  rectMode(CENTER)

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
  var alpha = map(amp, 0, 255, 180, 150)
  fill(0, alpha)
  noStroke()
  rect(0, 0, width, height)

  stroke(225)
  strokeWeight(5)
  noFill()

  // actual waveform from fft (fast fourier transform)
  var wave = fft.waveform()

 push()
 translate(0, -120)
// creates two semicircles
 for (var t = -1; t <= 1; t += 2) {
   beginShape()
   for (var i = 0; i <= 180; i += 0.5) {
     var index = floor(map(i, 0, 180, 0, wave.length - 1))
     var avgRadius = 180
     var sharpness = 25
     // 20 was originally 150 (large circle in center)
     var radius = map(wave[index], -1, 1, avgRadius - sharpness, avgRadius + sharpness)
     var x = radius * sin(i) * t
     var y = radius * cos(i)
     vertex(x, y)
  }
   endShape()
  
}

for (var t = -1; t <= 1; t += 2) {
  beginShape()
  for (var i = 0; i <= 180; i += 0.5) {
    var index = floor(map(i, 0, 180, 0, wave.length - 1))
    var avgRadius = 50
    var sharpness = 5
    // 20 was originally 150 (large circle in center)
    var radius = map(wave[index], -1, 1, avgRadius - sharpness, avgRadius + sharpness)
    var x = radius * sin(i) * t
    var y = radius * cos(i)
    vertex(x, y)
 }
  endShape()
 
}

// particles & reacting to the beat
var p = new Particle()
particles.push(p)

// decides which particles to show depending on position
for (var i = particles.length - 1; i >= 0; i--) {
  if (!particles[i].edges()) {
    particles[i].update(amp > 230)
    particles[i].show()
  } else {
    particles.splice(i, 1)
  }
}
pop()

}

function songReload() {
  song = loadSound(trackList[trackIndex].path)
  song.setVolume(0.6)
}

// audio plays/stops on mouseclick as browsers don't support autoplay
function mouseClicked() {
  if (song.isPlaying()) {
    song.pause()
    noLoop()
  } else {
    song.play()
    loop()
  }
}

// particle class + position, velocity, acceleration
class Particle {
  constructor() {
    // orig multi by 250 for large circle in center
    // positions particles randomly on radius of circle
    this.pos = p5.Vector.random2D().mult(180)
    // particle movement
    this.vel = createVector(0, 0)
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001))

    this.width = random(3, 5)

    this.color = [random (200, 255), random(200, 255), random(200, 255),]
  }
  // beat detection; if cond is true particles move faster
  update(cond) {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    if (cond) {
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }
  edges() {
    if (this.pos.x < -width / 2 || this.pos.x > width / 2 ||
      this.pos.y < - height / 2 || this.pos.y > height / 2) {
        return true
      } else {
        return false
      }
  }
  show() {
    noStroke()
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, this.width)
  }
}

