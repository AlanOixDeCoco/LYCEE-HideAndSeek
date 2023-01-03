const nbreImages = 5;
var image = 0;
var slider;

var clockVal = 0;
var clockValFloat = 0.0;
var clockValDelay = 0;

class SliderScene extends Phaser.Scene {

    constructor (){
        super({key: 'SliderScene', active: true});
    }

    preload(){
      for(var i=0; i < 5; i++){
          this.load.image('slider-'+i.toString(), 'assets/website/images/slider-'+i.toString()+'.png');
      }
    }

    create(){
      console.log(screen.width);

      slider = this.add.image(0,0, 'slider-0');    //    Création de l'image de font
      slider.displayOriginX = 0;
      slider.displayOriginY = 0;
      slider.displayWidth = (screen.width-15)*0.80;  
      slider.displayHeight = screen.height*0.4;
    }

    update(){
      clock();

      if(clockValDelay <= clockVal){
        if(image < nbreImages - 1){
          image = image+1;
        } else{
          image = 0;
        }
        slider.setTexture('slider-'+image.toString());
        console.log(image);
        clockValDelay = clockVal + 2;
      }  
    }

}
//=================================================================


//===============================================================//
let config = {                                                   //
  type: Phaser.AUTO,                                             //
  width: (screen.width-15)*0.80,                                      //
  height: screen.height*0.4,                                     //
  antialias: false,                                              //
  backgroundColor: '#E2BB8A',                                    //
  parent: 'slider',                                              //
  physics: { default: 'arcade', arcade: { gravity: { y: 0 } } }, //
  scene: [                                                       //
           SliderScene                                           //
         ]                                                       //
};                                                               //
                                                                 //
let game = new Phaser.Game(config);                              //
//===============================================================//


function clock(){                  //    FONCTION DE TEMPS
  clockValFloat += 0.0167;
  clockVal = Math.round(clockValFloat);
  //console.log(clockValFloat);
  //console.log(clockVal);
  
}