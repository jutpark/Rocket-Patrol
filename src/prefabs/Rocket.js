// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      // add object to existing scene
      scene.add.existing(this);
      this.isFiring=false;
      this.moveSpeed=2;
      this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
      
    }
    create(){
        mouse=this.input.mousePointer;
    }
    update(){
        //if(!this.isFiring){
            if(mouse.isDown&& this.isFiring==false){
                this.isFiring=true;
                this.sfxRocket.play();  // play sfx
             }

    this.x=game.input.mousePointer.x;

if(this.isFiring&&this.y>=borderUISize*3+borderPadding){
    this.y-=this.moveSpeed;
}
if(this.y<=borderUISize*3+borderPadding){
    this.reset();
}
        

    }
    reset(){
        this.isFiring=false;
        this.y=game.config.height-borderUISize-borderPadding;
    }
    
  }