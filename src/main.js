/*
Justin Park
new ship type + 15
move while firing +5
add time when hit newship +15
increase chip speed after 30 seconds +5
added visible timer +10
added godawful explosion sounds +10
added rainbow explosion particles +15
https://www.youtube.com/watch?v=LEDPCfot_GY&ab_channel=MitchellHudson
https://labs.phaser.io/index.html?dir=game%20objects/particle%20emitter/&q=
citing for particles
added game music +5
https://blog.ourcade.co/posts/2020/phaser-3-web-audio-best-practices-games/

*/
let config={
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu,Play]
    }
let game= new Phaser.Game(config);

let borderUISize=game.config.height/15;
let borderPadding=borderUISize/3;
let mouse,keyF,keyR,keyLEFT,keyRIGHT;
