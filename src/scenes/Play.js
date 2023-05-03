class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }
    preload(){
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship','./assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.image('newship', './assets/newrocket.png');
        this.load.atlas('flares', './assets/flares.png', './assets/flares.json');
        this.load.audio('music', './assets/Fixed song.wav');
        
      }

    create(){
        // green UI background
        mouse=this.input.mousePointer;
this.starfield=this.add.tileSprite(0,0,640,480,'starfield').setOrigin(0,0);
this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
// white borders
this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
this.p1Rocket=new Rocket(this,game.config.width/2,game.config.height-borderUISize-borderPadding,'rocket').setOrigin(0.5,0);
this.newship=new Newship(this, game.config.width + borderUISize*3, borderUISize*3, 'newship', 0,60).setOrigin(0,0);
this.newship.scale=0.5;
this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
this.anims.create({
    key: 'explode',
    frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
    frameRate: 30
});
this.p1Score = 0;
this.rng=0;
this.music=this.sound.add('music',{
  volume:0.2,
  loop:true
})
if (!this.sound.locked)
	{
		// already unlocked so play
		this.music.play()
	}
	else
	{
		// wait for 'unlocked' to fire and then play
		this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
			this.music.play()
		})
	}

  // display score
  let scoreConfig = {
    fontFamily: 'Courier',
    fontSize: '28px',
    backgroundColor: '#F3B141',
    color: '#843605',
    align: 'right',
    padding: {
      top: 5,
      bottom: 5,
    },
    fixedWidth: 100
  }
  this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
  this.timeRight = this.add.text(borderUISize + borderPadding*30, borderUISize + borderPadding*2, this.time.now%1000, scoreConfig);
  // GAME OVER flag
this.gameOver = false;

// 60-second play clock
scoreConfig.fixedWidth = 0;
this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
    this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
    this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart', scoreConfig).setOrigin(0.5);
    this.gameOver = true;
}, null, this);

this.clock = this.time.delayedCall(30000, () => {
  game.settings.spaceshipSpeed+=2;
  game.settings.NewshipSpeed+=5;
}, null, this);
}
update(){
      // check key input for restart
  if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
    this.scene.restart();
}

this.starfield.tilePositionX-=4;
this.p1Rocket.update();
this.ship01.update();
this.ship02.update();
this.ship03.update();
this.newship.update();
this.timeRight.text = (game.settings.gameTimer/1000)-Math.trunc(this.time.now/1000);
console.log(this.time.now);
// check collisions
if(this.checkCollision(this.p1Rocket, this.ship03)) {
    this.p1Rocket.reset();
    this.shipExplode(this.ship03);   
  }
  if (this.checkCollision(this.p1Rocket, this.ship02)) {
    this.p1Rocket.reset();
    this.shipExplode(this.ship02);
  }
  if (this.checkCollision(this.p1Rocket, this.ship01)) {
    this.p1Rocket.reset();
    this.shipExplode(this.ship01);
  }
  if(this.checkCollision(this.p1Rocket, this.newship)){
    this.p1Rocket.reset();
    this.shipExplode(this.newship);
    this.time.removeEvent(this.clock);
    game.settings.gameTimer+=10000;
    this.timeRight.text = (game.settings.gameTimer/1000)-Math.trunc(this.time.now/1000);
    let scoreConfig = {
      fontFamily: 'Courier',
      fontSize: '28px',
      backgroundColor: '#F3B141',
      color: '#843605',
      align: 'right',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 100
    }
    this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
    scoreConfig.fixedWidth = 0;
    
    this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
      this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart', scoreConfig).setOrigin(0.5);
      this.gameOver = true;
  }, null, this);
  }
  if (!this.gameOver) {               
    this.p1Rocket.update();         // update rocket sprite
    this.ship01.update();           // update spaceships (x3)
    this.ship02.update();
    this.ship03.update();
} 
}
checkCollision(rocket, ship) {
    // simple AABB checking
    if (rocket.x < ship.x + ship.width && 
      rocket.x + rocket.width > ship.x && 
      rocket.y < ship.y + ship.height &&
      rocket.height + rocket.y > ship. y) {
      return true;
    } else {
      return false;
    }
  }
  shipExplode(ship) {
    // temporarily hide ship
    ship.alpha = 0;                         
    // create explosion sprite at ship's position
    let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
    boom.anims.play('explode');             // play explode animation
    boom.on('animationcomplete', () => {    // callback after ani completes
      ship.reset();                       // reset ship position
      ship.alpha = 1;                     // make ship visible again
      boom.destroy();                     // remove explosion sprite
    });
    // score add and repaint
    const emitter = this.add.particles(ship.x, ship.y, 'flares', {
      frame: [ 'red', 'yellow', 'green' ],
      lifespan: 500,
      speed: { min: 150, max: 250 },
      scale: { start: 0.8, end: 0 },
      gravityY: 150,
      blendMode: 'ADD',
      emitting: false
    });
    emitter.explode(5);
    this.p1Score += ship.points;
    this.scoreLeft.text = this.p1Score;
    this.rng=Math.floor(Math.random() * 5);
    if(this.rng==1){
      this.sound.play('sfx_explosion'); 
    }else if(this.rng==2){
      this.sound.play('ahhhh');
    }else if(this.rng==3){
      this.sound.play('boom');
    }else if(this.rng==4){
      this.sound.play('children');
    }
    else if(this.rng==5){
      this.sound.play('pew');
    }
    //this.sound.play('sfx_explosion');       
  }
  


}