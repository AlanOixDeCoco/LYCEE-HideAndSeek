//    VARIABLES    ===========================

var music;
var clickingButtonDown;
var clickingButtonUp;
var deadSound;

var textStyle = { fontFamily: 'Calibri', fontSize: 44, align: 'center', color: '#000000' };
var textStyle2 = { fontFamily: 'Calibri', fontSize: 30, align: 'center', color: '#000000' };

var cursors = [4];

var actualScene = '';
var nbreJoueurs = 2;
var players = [nbreJoueurs];

var image = [nbreJoueurs];

var tempsCache = 15;
var tempsPartie = 90;

var nbreTypesObjets = 8;
var rect = [4];

var clockValFloat = 0.0;
var clockVal = 0;
var clockTaunt = 0;

var camera0;
var camera1;

var objects = [nbreTypesObjets];

var taunt = [8];

var delayChange = [0,0,0,0];

var playersLife = [100, 50, 50, 50];

var playerAlive = [nbreJoueurs];

var tempsTaunt = tempsCache + 5;



var generatedVolume = [0.00, 0.00, 0.00, 0.00];

//=====================================================


class LoadingScene extends Phaser.Scene {     //    Scène de chargement du jeu + page de 'bienvenue'

    constructor (){
        super({key: 'LoadingScene', active: true});     //    Construction de la scène
    }

    preload(){
      var loadingText = this.add.text(640, 400, '');     //    Texte indiquant le chargement du jeu
      loadingText.originX = 0.5;
      loadingText.originY = 0.5;                         //    ====================================
      
      this.load.image('LoadingBackground', 'assets/game/images/interface/backgrounds/backgrounds-Loading.png')    //    Chargement de l'image de fond

      this.load.audio('theme', 'assets/game/audio/musics/audio-MenuTheme.mp3');    //    Chargement de la musique de fond
      this.load.audio('clickingButtonDown', 'assets/game/audio/sounds/interface/button-clicking-down.wav');
      this.load.audio('clickingButtonUp', 'assets/game/audio/sounds/interface/button-clicking-up.wav');
      this.load.audio('deadSound', 'assets/game/audio/sounds/game/sound-dead.wav');

      for(var i=0; i<8; i++){
        this.load.audio('taunt'+i.toString(), 'assets/game/audio/sounds/game/sound-taunt'+i.toString()+'.wav');
      }

      this.load.spritesheet('PressToPlayButton', 'assets/game/images/interface/buttons/buttons-PressToPlay-SpriteSheet.png', { frameWidth: 162, frameHeight: 25 });     //    Chargement du spritesheet du bouton

      this.load.on('progress', function (value) {       //    Affichage de l'élément en cour de chargement
        console.log(value);
      });
            
      this.load.on('fileprogress', function (file) {
        console.log(file.src);
        loadingText.setText('Loading : ' + file.src);
      });
 
      this.load.on('complete', function () {
        console.log('complete');
        loadingText.setText('done');        
      });                                               //    ============================================

    }

    create(){
      var background = this.add.image(0,0,'LoadingBackground');     //    création du fond
      background.displayWidth = 1280;
      background.displayHeight = 720;
      background.displayOriginX = 0;
      background.displayOriginY = 0;                                //    ================

      music = this.sound.add('theme');      //    Lancement de la musique de fond
      music.loop = true;
      music.setVolume(0.2);
      music.play();                         //    ===============================

      deadSound = this.sound.add('deadSound');    // son d'élim.

      for(var i=0; i<8; i++){
        taunt[i] = this.sound.add('taunt'+i.toString());    // sons de 'reperage'
      }

      clickingButtonDown = this.sound.add('clickingButtonDown');
      clickingButtonUp = this.sound.add('clickingButtonUp');


      game.scene.stop('PauseScene');                //    Arrêt de toutes les autres scènes pendant le chargement

      game.scene.stop('MainMenuScene');             //

      //game.scene.stop('MouseAndCatSettingsScene');  //
      game.scene.stop('HideAndSeekSettingsScene');  //
      //game.scene.stop('ColorPartySettingsScene');   //

      //game.scene.stop('MouseAndCatScene');         //
      game.scene.stop('HideAndSeekScene');          //
      //game.scene.stop('ColorPartyScene');           //    =======================================================

      //====================
      var PressToPlayButton = this.physics.add.sprite(640, 450, 'PressToPlayButton');       //    Creation du bouton Press To Play puis de ses animations
      PressToPlayButton.displayWidth = 486;
      PressToPlayButton.displayHeight = 75;

      this.anims.create({
        key: 'PressToPlayButton-Out',
        frames: this.anims.generateFrameNumbers('PressToPlayButton', { start: 4, end: 7 }),
        frameRate: 30,
        repeat: 0
      });

      this.anims.create({
        key: 'PressToPlayButton-Over',
        frames: this.anims.generateFrameNumbers('PressToPlayButton', { start: 0, end: 3 }),
        frameRate: 30,
        repeat: 0
      });

      PressToPlayButton.setInteractive();                                                   //    =======================================================

      //====================

      PressToPlayButton.on('pointerout', function(){ PressToPlayButton.anims.play('PressToPlayButton-Out', true); });     //    Events
      PressToPlayButton.on('pointerover', function(){ PressToPlayButton.anims.play('PressToPlayButton-Over', true); });
      PressToPlayButton.on('pointerdown', function(){ game.scene.stop('LoadingScene');
                                                      game.scene.start('HideAndSeekSettingsScene');  
                                                      game.scene.bringToTop('HideAndSeekSettingsScene');
                                                    });                                                                   //    ======

    }

}

//=========================================================================================

class PauseScene extends Phaser.Scene {     //    Scène de pause = met en pause une scène et applique un masque translucide + des options de retour menu, ...

  constructor (){
    super({ key: 'PauseScene', active: false});     //    Construction de la scène
  }

  preload(){
    this.load.image('PauseBackground', 'assets/game/images/interface/backgrounds/backgrounds-Pause.png');     //    Chargement de l'image de fond
  }

  create(){
    var background = this.add.image(0,0, 'PauseBackground');    //    Création de l'image de fond
    background.displayWidth = 1280;
    background.displayHeight = 720;
    background.displayOriginX = 0;
    background.displayOriginY = 0;                              //    ===========================

    this.input.keyboard.on("keydown_ESC", function(){ game.scene.stop('PauseScene');    //    Events
                                                      game.scene.resume(actualScene);
                                                    });                                 //    ======
  }
}



class InfoScene extends Phaser.Scene {

  constructor() {
    super({ key: 'InfoScene', active: false});
  }

  preload() {
    this.load.image('InfoSceneBackground', 'assets/game/images/interface/backgrounds/backgrounds-InfoScene.png');   //    Chargement de l'image de fond
  }

  create(){
    var background = this.add.image(0,0, 'InfoSceneBackground');    //    Création de l'image de font
    background.displayOriginX = 0;
    background.displayOriginY = 0;

    this.input.keyboard.on('keydown_ESC', function(){ game.scene.stop('InfoScene');         // event touche echap
                                                      game.scene.resume(actualScene);  
                                                      game.scene.bringToTop(actualScene);
                                                    });
  }
}

class HideAndSeekSettingsScene extends Phaser.Scene {   //    Scène de paramètrage de partie du mode Hide And Seek

  constructor (){
    super({ key: 'HideAndSeekSettingsScene', active: false});   //    Construction de la scène
  }

  preload(){
    this.load.image('backgrounds-Menu', 'assets/game/images/interface/backgrounds/backgrounds-Menu.png');   //    Chargement de l'image de fond

    this.load.spritesheet('BottomBanner', 'assets/game/images/interface/banners/banners-MenusBottom-Spritesheet.png', { frameWidth: 320, frameHeight: 30 });      //    Chargement des spritesheets
    this.load.spritesheet('TopBannerEscape', 'assets/game/images/interface/banners/banners-MenusTopEscape-Spritesheet.png', { frameWidth: 40, frameHeight: 30 });
    this.load.spritesheet('TopBannerInfos', 'assets/game/images/interface/banners/banners-MenusTopInfos-Spritesheet.png', { frameWidth: 40, frameHeight: 30 });   
    this.load.spritesheet('twoPlayers', 'assets/game/images/interface/buttons/buttons-2Players-Spritesheet.png', { frameWidth: 32, frameHeight: 21 }); 
    this.load.spritesheet('threePlayers', 'assets/game/images/interface/buttons/buttons-3Players-Spritesheet.png', { frameWidth: 32, frameHeight: 21 }); 
    this.load.spritesheet('fourPlayers', 'assets/game/images/interface/buttons/buttons-4Players-Spritesheet.png', { frameWidth: 32, frameHeight: 21 }); 
    this.load.spritesheet('oneMin', 'assets/game/images/interface/buttons/buttons-90s-Spritesheet.png', { frameWidth: 32, frameHeight: 21 });
    this.load.spritesheet('twoMin', 'assets/game/images/interface/buttons/buttons-150s-Spritesheet.png', { frameWidth: 32, frameHeight: 21 });
    this.load.spritesheet('threeMin', 'assets/game/images/interface/buttons/buttons-210s-Spritesheet.png', { frameWidth: 32, frameHeight: 21 });
    this.load.spritesheet('HiddingTime15', 'assets/game/images/interface/buttons/buttons-15s-Spritesheet.png', { frameWidth: 32, frameHeight: 21 });
    this.load.spritesheet('HiddingTime30', 'assets/game/images/interface/buttons/buttons-30s-Spritesheet.png', { frameWidth: 32, frameHeight: 21 });
    this.load.spritesheet('HiddingTime45', 'assets/game/images/interface/buttons/buttons-45s-Spritesheet.png', { frameWidth: 32, frameHeight: 21 });
  }

  create(){

    delayChange = [0,0,0,0];

    playersLife = [100, 50, 50, 50];

    playerAlive = [nbreJoueurs];

    tempsTaunt = tempsCache + 5;

    actualScene  = 'HideAndSeekSettingsScene';    //    Utile pour scène de pause

    var background = this.add.image(0,0, 'backgrounds-Menu');    //    Création de l'image de font
    background.displayOriginX = 0;
    background.displayOriginY = 0;                                            //    ===========================


    //============================
    var BottomBanner = this.physics.add.sprite(640, 660, 'BottomBanner');             //    Création de la bannière bas = infos sur le mode de jeu, et animations  
    BottomBanner.displayWidth = 1280;
    BottomBanner.displayHeight = 120;

    this.anims.create({
      key: 'BottomBanner-Out',
      frames: this.anims.generateFrameNumbers('BottomBanner', { start: 15, end: 29 }),
      frameRate: 90,
      repeat: 0
    });

    this.anims.create({
      key: 'BottomBanner-Over',
      frames: this.anims.generateFrameNumbers('BottomBanner', { start: 0, end: 14 }),
      frameRate: 90,
      repeat: 0
    });

    BottomBanner.setInteractive();                                                    //    =======================================================================================
    //============================

    //============================
    var TopBannerEscape = this.physics.add.sprite(80, 60, 'TopBannerEscape');             //    Création de la bannière déroulante retour = retour d'une scène en arrière, et animations
    TopBannerEscape.displayWidth = 160;
    TopBannerEscape.displayHeight = 120;

    this.anims.create({
      key: 'TopBannerEscape-Out',
      frames: this.anims.generateFrameNumbers('TopBannerEscape', { start: 15, end: 29 }),
      frameRate: 120,
      repeat: 0
    });

    this.anims.create({
      key: 'TopBannerEscape-Over',
      frames: this.anims.generateFrameNumbers('TopBannerEscape', { start: 0, end: 14 }),
      frameRate: 120,
      repeat: 0
    });

    TopBannerEscape.setInteractive();                                                     //    =======================================================================================
    //============================

    //============================
    var TopBannerInfos = this.physics.add.sprite(1200, 60, 'TopBannerInfos');           //    Création de la bannière déroulante infos = scène qui affiche les touche, ..., et animations
    TopBannerInfos.displayWidth = 160;
    TopBannerInfos.displayHeight = 120;

    this.anims.create({
      key: 'TopBannerInfos-Out',
      frames: this.anims.generateFrameNumbers('TopBannerInfos', { start: 15, end: 29 }),
      frameRate: 120,
      repeat: 0
    });

    this.anims.create({
      key: 'TopBannerInfos-Over',
      frames: this.anims.generateFrameNumbers('TopBannerInfos', { start: 0, end: 14 }),
      frameRate: 120,
      repeat: 0
    });

    TopBannerInfos.setInteractive();                                                   //   ============================================================================================
    //============================

    //====================                                                             //   Création des boutons de choix du nombre de personnage: 2, 3 et 4
    var twoPlayers = this.physics.add.sprite(526, 250, 'twoPlayers');                  //   2 Joueurs     

    twoPlayers.displayWidth = 64;
    twoPlayers.displayHeight = 42;

    this.anims.create({
      key: 'twoPlayers-Out',
      frames: this.anims.generateFrameNumbers('twoPlayers', { start: 3, end: 5 }),
      frameRate: 30,
      repeat: 0
    });

    this.anims.create({
      key: 'twoPlayers-Over',
      frames: this.anims.generateFrameNumbers('twoPlayers', { start: 0, end: 2 }),
      frameRate: 30,
      repeat: 0
    });

    twoPlayers.setInteractive();                                      
    //==================================



    var threePlayers = this.physics.add.sprite(640, 250, 'threePlayers');                  //   3 Joueurs     

    threePlayers.displayWidth = 64;
    threePlayers.displayHeight = 42;

    this.anims.create({
      key: 'threePlayers-Out',
      frames: this.anims.generateFrameNumbers('threePlayers', { start: 3, end: 5 }),
      frameRate: 30,
      repeat: 0
    });

    this.anims.create({
      key: 'threePlayers-Over',
      frames: this.anims.generateFrameNumbers('threePlayers', { start: 0, end: 2 }),
      frameRate: 30,
      repeat: 0
    });

    threePlayers.setInteractive();                                      
    //==================================
    var fourPlayers = this.physics.add.sprite(754, 250, 'fourPlayers');                  //   4 Joueurs     

    fourPlayers.displayWidth = 64;
    fourPlayers.displayHeight = 42;

    this.anims.create({
      key: 'fourPlayers-Out',
      frames: this.anims.generateFrameNumbers('fourPlayers', { start: 3, end: 5 }),
      frameRate: 30,
      repeat: 0
    });

    this.anims.create({
      key: 'fourPlayers-Over',
      frames: this.anims.generateFrameNumbers('fourPlayers', { start: 0, end: 2 }),
      frameRate: 30,
      repeat: 0
    });

    fourPlayers.setInteractive();                                      
    //==================================

    //===================                                                              //   Création des bouttons pour choisir la durée d'une partie: 1'30, 2'30 et 3'30
    var oneMin = this.physics.add.sprite(131, 250, 'oneMin');              //   1'30 ==================================
    oneMin.displayWidth = 64;
    oneMin.displayHeight = 42;

    this.anims.create({
      key: 'oneMin-out',
      frames: this.anims.generateFrameNumbers('oneMin', { start: 3, end: 5 }),
      frameRate: 30,
      repeat:0
    });

    this.anims.create({
      key: 'oneMin-over',
      frames: this.anims.generateFrameNumbers('oneMin', { start: 0, end: 2}),
      frameRate: 30,
      repeat: 0
    });
    oneMin.setInteractive();
    //========================
    var twoMin = this.physics.add.sprite(246, 250, 'twoMin');                 //   2'30 ========================
    twoMin.displayWidth = 64;
    twoMin.displayHeight = 42;

    this.anims.create({
      key: 'twoMin-out',
      frames: this.anims.generateFrameNumbers('twoMin', { start: 3, end: 5 }),
      frameRate: 30,
      repeat:0
    });

    this.anims.create({
      key: 'twoMin-over',
      frames: this.anims.generateFrameNumbers('twoMin', { start: 0, end: 2}),
      frameRate: 30,
      repeat: 0
    });
    twoMin.setInteractive();
    //===================
    var threeMin = this.physics.add.sprite(360, 250, 'threeMin');                // 3'30 ======================
    threeMin.displayWidth = 64;
    threeMin.displayHeight = 42;

    this.anims.create({
      key: 'threeMin-out',
      frames: this.anims.generateFrameNumbers('threeMin', { start: 3, end: 5 }),
      frameRate: 30,
      repeat:0
    });

    this.anims.create({
      key: 'threeMin-over',
      frames: this.anims.generateFrameNumbers('threeMin', { start: 0, end: 2}),
      frameRate: 30,
      repeat: 0
    });
    threeMin.setInteractive();
    //======================

    //===================                                                              //   Création des bouttons pour choisir la durée pour se cacher
    var HiddingTime15 = this.physics.add.sprite(919, 250, 'HiddingTime15');                // 15 Secondes======================
    HiddingTime15.displayWidth = 64;
    HiddingTime15.displayHeight = 42;

    this.anims.create({
      key: 'HiddingTime15-out',
      frames: this.anims.generateFrameNumbers('HiddingTime15', { start: 3, end: 5 }),
      frameRate: 30,
      repeat:0
    });

    this.anims.create({
      key: 'HiddingTime15-over',
      frames: this.anims.generateFrameNumbers('HiddingTime15', { start: 0, end: 2}),
      frameRate: 30,
      repeat: 0
    });
    HiddingTime15.setInteractive();
    //==========================
    var HiddingTime30 = this.physics.add.sprite(1033, 250, 'HiddingTime30');                // 30 Secondes======================
    HiddingTime30.displayWidth = 64;
    HiddingTime30.displayHeight = 42;

    this.anims.create({
      key: 'HiddingTime30-out',
      frames: this.anims.generateFrameNumbers('HiddingTime30', { start: 3, end: 5 }),
      frameRate: 30,
      repeat:0
    });

    this.anims.create({
      key: 'HiddingTime30-over',
      frames: this.anims.generateFrameNumbers('HiddingTime30',  { start: 0, end: 2}),
      frameRate: 30,
      repeat: 0
    });
    HiddingTime30.setInteractive();
    //=====================================
    var HiddingTime45 = this.physics.add.sprite(1148, 250, 'HiddingTime45');                // 45 Secondes======================
    HiddingTime45.displayWidth = 64;
    HiddingTime45.displayHeight = 42;

    this.anims.create({
      key: 'HiddingTime45-out',
      frames: this.anims.generateFrameNumbers('HiddingTime45', { start: 3, end: 5 }),
      frameRate: 30,
      repeat:0
    });

    this.anims.create({
      key: 'HiddingTime45-over',
      frames: this.anims.generateFrameNumbers('HiddingTime45', { start: 0, end: 2}),
      frameRate: 30,
      repeat: 0
    });
    HiddingTime45.setInteractive();

    //===================

    //==================
      var PressToPlayButtonHideAndSeek = this.physics.add.sprite(640, 475, 'PressToPlayButton');       //    Creation du bouton Press To Play puis de ses animations
      PressToPlayButtonHideAndSeek.displayWidth = 486;
      PressToPlayButtonHideAndSeek.displayHeight = 75;

      PressToPlayButtonHideAndSeek.setInteractive();                                                   //    =======================================================

      //====================
                                                                                                                    //    Events
    TopBannerEscape.on('pointerout', function(){ TopBannerEscape.anims.play('TopBannerEscape-Out', true); });       //  Bouton retour
    TopBannerEscape.on('pointerover', function(){ TopBannerEscape.anims.play('TopBannerEscape-Over', true); });
    TopBannerEscape.on('pointerdown', function(){ music.stop();
                                                  game.scene.stop(actualScene);
                                                  game.scene.start('LoadingScene');  
                                                  game.scene.bringToTop('LoadingScene'); 
                                                });

    TopBannerInfos.on('pointerout', function(){ TopBannerInfos.anims.play('TopBannerInfos-Out', true); });          //  Bouton Info
    TopBannerInfos.on('pointerover', function(){ TopBannerInfos.anims.play('TopBannerInfos-Over', true); });
    TopBannerInfos.on('pointerdown', function(){ game.scene.pause(actualScene);
                                                  game.scene.start('InfoScene');  
                                                  game.scene.bringToTop('InfoScene'); 
                                                });

    BottomBanner.on('pointerout', function(){ BottomBanner.anims.play('BottomBanner-Out', true); });                //  Bannière du bas
    BottomBanner.on('pointerover', function(){ BottomBanner.anims.play('BottomBanner-Over', true); });

    //======================================================
    twoPlayers.on('pointerout', function(){ twoPlayers.anims.play('twoPlayers-Out', true); });          //  Bouton deux joueurs
    twoPlayers.on('pointerover', function(){ twoPlayers.anims.play('twoPlayers-Over', true); });
    twoPlayers.on('pointerdown', function(){ nbreJoueurs = 2;  console.log(nbreJoueurs); });

    threePlayers.on('pointerout', function(){ threePlayers.anims.play('threePlayers-Out', true); });          //  Bouton trois joueurs
    threePlayers.on('pointerover', function(){ threePlayers.anims.play('threePlayers-Over', true); });
    threePlayers.on('pointerdown', function(){ nbreJoueurs = 3;  console.log(nbreJoueurs); });

    fourPlayers.on('pointerout', function(){ fourPlayers.anims.play('fourPlayers-Out', true); });          //  Bouton quatre joueurs
    fourPlayers.on('pointerover', function(){ fourPlayers.anims.play('fourPlayers-Over', true); });
    fourPlayers.on('pointerdown', function(){ nbreJoueurs = 4;  console.log(nbreJoueurs); });

    //======================================================
    oneMin.on('pointerout', function(){ oneMin.anims.play('oneMin-out', true); });          //  Bouton 1.30 minutes
    oneMin.on('pointerover', function(){ oneMin.anims.play('oneMin-over', true); });
    oneMin.on('pointerdown', function(){ tempsPartie = 90; console.log(tempsPartie);
                                                        });
    twoMin.on('pointerout', function(){ twoMin.anims.play('twoMin-out', true); });          //  Bouton 2.30 minutes
    twoMin.on('pointerover', function(){ twoMin.anims.play('twoMin-over', true); });
    twoMin.on('pointerdown', function(){ tempsPartie = 150; console.log(tempsPartie);
                                                        });
    threeMin.on('pointerout', function(){ threeMin.anims.play('threeMin-out', true); });          //  Bouton 3.30 minutes
    threeMin.on('pointerover', function(){ threeMin.anims.play('threeMin-over', true); });
    threeMin.on('pointerdown', function(){ tempsPartie = 210; console.log(tempsPartie);
                                                        });
    //======================================================

    HiddingTime15.on('pointerout', function(){ HiddingTime15.anims.play('HiddingTime15-out', true); });          //  Bouton 15 secondes
    HiddingTime15.on('pointerover', function(){ HiddingTime15.anims.play('HiddingTime15-over', true); });
    HiddingTime15.on('pointerdown', function(){tempsCache = 15; console.log(tempsCache);
                                                    });
    HiddingTime30.on('pointerout', function(){ HiddingTime30.anims.play('HiddingTime30-out', true); });          //  Bouton 30 secondes
    HiddingTime30.on('pointerover', function(){ HiddingTime30.anims.play('HiddingTime30-over', true); });
    HiddingTime30.on('pointerdown', function(){tempsCache = 30; console.log(tempsCache);
                                                      });
    HiddingTime45.on('pointerout', function(){ HiddingTime45.anims.play('HiddingTime45-out', true); });          //  Bouton 45 secondes
    HiddingTime45.on('pointerover', function(){ HiddingTime45.anims.play('HiddingTime45-over', true); });
    HiddingTime45.on('pointerdown', function(){tempsCache = 45; console.log(tempsCache);
                                                      });
    //===============================================================

    PressToPlayButtonHideAndSeek.on('pointerout', function(){ PressToPlayButtonHideAndSeek.anims.play('PressToPlayButton-Out', true);          //  Bouton Play
                                                   });     //    Events
    PressToPlayButtonHideAndSeek.on('pointerover', function(){ PressToPlayButtonHideAndSeek.anims.play('PressToPlayButton-Over', true);
                                                    });
    PressToPlayButtonHideAndSeek.on('pointerdown', function(){ music.stop(); 
                                                      game.scene.stop('HideAndSeekSettingsScene');
                                                      game.scene.start('HideAndSeekScene');  
                                                      game.scene.start('HideAndSeekHUDScene');  
                                                      game.scene.bringToTop('HideAndSeekScene');
                                                      game.scene.bringToTop('HideAndSeekHUDScene');
                                                      
                                                    });

    this.input.keyboard.on('keydown_ESC', function(){ game.scene.start('PauseScene');  
                                                      game.scene.bringToTop('PauseScene');  
                                                      game.scene.pause(actualScene);
                                                    });                                                         //    ======

    this.seekerClockText = this.add.text(130, 166, '', textStyle2);
    this.playersText = this.add.text(510, 166, '', textStyle2);
    this.hiddenClockText = this.add.text(920, 166, '', textStyle2);
  }

  update(){
    this.seekerClockText.setText("Seeker's clock : " + tempsPartie);
    this.playersText.setText("Number of players : " + nbreJoueurs);
    this.hiddenClockText.setText("Hiddens' clock : " + tempsCache);
  }
}

class HideAndSeekScene extends Phaser.Scene {

    constructor (){
        super({key: 'HideAndSeekScene', active: false});
    }

    preload(){
      this.load.spritesheet('PressToPlayButton', 'assets/game/images/interface/buttons/buttons-PressToPlay-SpriteSheet.png', { frameWidth: 162, frameHeight: 25 }); 

      this.load.image('tiles', 'assets/game/maps/maps-Tilesets/tilesets-1.png');
      this.load.tilemapTiledJSON('map', 'assets/game/maps/maps-Tilemaps/tilemaps/level-HideAndSeek-0.json');

      for(var i=0; i<nbreJoueurs; i++){
        this.load.image('player'+i.toString(), 'assets/game/images/game/characters/player'+i.toString()+'.png');
      }
      for(var i=0; i<nbreTypesObjets; i++){
        this.load.image('typeObjet'+i.toString(), 'assets/game/images/game/objects/typeObjet-'+i.toString()+'.png');
      }

      
    }

    create(){
      actualScene = 'HideAndSeekScene';

      game.scene.start('HideAndSeekHUDScene');
      
      this.cameras.main.setVisible(false);                        // CAMERA

      camera0 = this.cameras.add(0, 0, 1280, 720);
      camera1 = this.cameras.add(0, 0, 1280, 720);
      
      camera0.setBounds(0, 0, 1280, 720);
      camera1.setBounds(0, 0, 1280, 720);

      camera1.setZoom(2);
      camera1.setVisible(false);


      cursors[0] = this.input.keyboard.addKeys({up: 'Z', left: 'Q', down: 'S', right: 'D'});                                      //  CONTROLE
      cursors[1] = this.input.keyboard.addKeys({up: 'T', left: 'F', down: 'G', right: 'H', changeImage: 'Y'});
      cursors[2] = this.input.keyboard.addKeys({up: 'O', left: 'K', down: 'L', right: 'M', changeImage: 'P'});
      cursors[3] = this.input.keyboard.addKeys({up: 'UP', left: 'LEFT', down: 'DOWN', right: 'RIGHT', changeImage: 'SHIFT'});

      const map = this.make.tilemap({ key: "map" });                                //  CARTE
      const tileset = map.addTilesetImage("Tileset", "tiles");

      const underLayer = map.createStaticLayer("underLayer", tileset, 0, 0);
      const playerLayer = map.createStaticLayer("playerLayer", tileset, 0, 0);

      this.physics.world.setBounds( 0, 0, 1920, 1280, 32);

      playerLayer.setCollisionBetween(0,255);

                                                                                    
                                  
      for(var i=0; i < nbreTypesObjets; i++){     //  OBJETS
        objects[i] = this.physics.add.group({ key: 'typeObjet'+i.toString(), frameQuantity: 10});

        rect[0] = new Phaser.Geom.Rectangle(48, 48, 480, 304);
        rect[1] = new Phaser.Geom.Rectangle(592, 48, 640, 304);
        rect[2] = new Phaser.Geom.Rectangle(774, 416, 464, 264);
        rect[3] = new Phaser.Geom.Rectangle(48, 416, 662, 264);
      }

      for(var i=0; i<2; i++){
        Phaser.Actions.RandomRectangle(objects[i].getChildren(), rect[0]);
      }
      for(var i=2; i<4; i++){
        Phaser.Actions.RandomRectangle(objects[i].getChildren(), rect[1]);
      }
      for(var i=4; i<6; i++){
        Phaser.Actions.RandomRectangle(objects[i].getChildren(), rect[2]);
      }
      for(var i=6; i<8; i++){
        Phaser.Actions.RandomRectangle(objects[i].getChildren(), rect[3]);
      }
      

      players[0] = this.physics.add.sprite(38,38,'player0');
      for(var i=1; i < nbreJoueurs; i++){
        players[i] = this.physics.add.sprite(240 + i*22,200,'player'+i.toString());
      }

      camera1.startFollow(players[0]);

      for(var i=0; i < nbreJoueurs; i++){
        players[i].setBounce(0.2);
        players[i].setCollideWorldBounds(true);
        this.physics.add.collider(players[i], playerLayer);
        
        for(var j=0; j<nbreTypesObjets; j++){
          this.physics.add.collider(players[i], objects[j].getChildren());
          this.physics.add.collider(playerLayer, objects[j].getChildren());
        }
      }

      
     /*const debugGraphics = this.add.graphics().setAlpha(0.75);
      playerLayer.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
      });*/

      players[0].setVisible(false);                                                       //  Chache le joueur qui cherche au début

      this.physics.add.overlap(players[0], players[1], function(){ playersLife[1] -= 1; });
      this.physics.add.overlap(players[0], players[2], function(){ playersLife[2] -= 1; });
      this.physics.add.overlap(players[0], players[3], function(){ playersLife[3] -= 1; });

      this.input.keyboard.on('keydown_ESC', function(){ game.scene.start('PauseScene');  
                                                      game.scene.bringToTop('PauseScene');  
                                                      game.scene.pause(actualScene);
                                                    });
      
    }

    update(){
      movement(400);

      clock();

      if(clockVal >= tempsCache){
        camera0.setVisible(false);
        camera1.setVisible(true);

        players[0].setVisible(true);
      }

      changeImage();    //permet aux joueurs caché de prendre une apparence aléatoire

      zeroVelocityObjects();  //retire la vitesse des objets pour les empecher de partir en ligne droite à l'infini

      endLife();
      endTime();

      if(clockVal >= tempsTaunt){
        for(var i=1; i<nbreJoueurs; i++){
          taunting(i);
        }
        tempsTaunt = clockVal + 3;
      }

    }
}


class HideAndSeekHUDScene extends Phaser.Scene {

    constructor (){
      super({key: 'HideAndSeekHUDScene', active: false});
    }

    preload(){
      this.load.image('HideAndSeekHUDBackground', 'assets/game/images/interface/backgrounds/backgrounds-HUD.png');
    }

    create(){
      var background = this.add.image(0,0, 'HideAndSeekHUDBackground');    //    Création de l'image de font
      background.displayOriginX = 0;
      background.displayOriginY = 0;

      this.whoPlays = this.add.text(106, 4, '', textStyle);
      this.clockText = this.add.text(1198, 4, '', textStyle);
      this.clockText.originX = 1;

      this.lifeText0 = this.add.text(293, 671, '', textStyle);
      this.lifeText1 = this.add.text(525, 671, '', textStyle);
      this.lifeText2 = this.add.text(750, 671, '', textStyle);
      this.lifeText3 = this.add.text(970, 671, '', textStyle);
    }

    update(){
      if (clockVal < tempsCache){
        this.whoPlays.setText('Hidden play !');
        this.clockText.setText(tempsCache-clockVal);
      } else{
        this.whoPlays.setText("Seeker's coming !");
        this.clockText.setText(tempsPartie-clockVal);
      }

      if(playersLife[0] <= 0){
        this.lifeText0.setText('0');
      } else {
        this.lifeText0.setText(playersLife[0]);
      }

      if(playersLife[1] <= 0){
        this.lifeText1.setText('0');
      } else {
        this.lifeText1.setText(playersLife[1]);
      }

      if(playersLife[2] <= 0){
        this.lifeText2.setText('0');
      } else {
        this.lifeText2.setText(playersLife[2]);
      }

      if(playersLife[3] <= 0){
        this.lifeText3.setText('0');
      } else {
        this.lifeText3.setText(playersLife[3]);
      }
    }
}

class EndGame extends Phaser.Scene {

    constructor (){
      super({key: 'EndGame', active: false});
    }

    preload(){
      this.load.image('EndGameBackground', 'assets/game/images/interface/backgrounds/backgrounds-EndGame.png');
      this.load.image('SeekerWins', 'assets/game/images/interface/winner/winner-Seeker.png');
      this.load.image('HiddenWins', 'assets/game/images/interface/winner/winner-Hidden.png');
    }

    create(){
      var background = this.add.image(0,0, 'EndGameBackground');    //    Création de l'image de font
      background.displayOriginX = 0;
      background.displayOriginY = 0;

      if(whoWins == 'seeker'){
        var winner = this.add.image(0,0, 'SeekerWins');
        winner.displayOriginX = 0;
        winner.displayOriginY = 0;
      } else if(whoWins == 'hidden'){
        var winner = this.add.image(0,0, 'HiddenWins');
        winner.displayOriginX = 0;
        winner.displayOriginY = 0;
      }
    }
}


//===============================================================//
let config = {                                                   //
  type: Phaser.AUTO,                                             //
  width: 1280,                                                   //
  height: 720,                                                   //
  antialias: false,                                              //
  backgroundColor: '#505050',                                    //
  parent: 'game',                                                //
  physics: { default: 'arcade', arcade: { gravity: { y: 0 } } }, //
  scene: [                                                       //
           LoadingScene,                                         //
           PauseScene,                                           //
           InfoScene,                                            //
           HideAndSeekSettingsScene,                             //
           HideAndSeekScene,                                     //
           HideAndSeekHUDScene,                                  //
           EndGame                                               //
         ]                                                       //
};                                                               //
                                                                 //
var game = new Phaser.Game(config);                              //
//===============================================================//










//=========================================

function movement(speed){                  //    FONCTION DE MOUVEMENT

  for(var i=0; i<nbreJoueurs; i++){
    players[i].body.setVelocity(0);
  }
  
  for(var i=0 ; i<nbreJoueurs; i++){

      if (cursors[i].left.isDown){
        players[i].body.setVelocityX(-1);
      }else if (cursors[i].right.isDown){
        players[i].body.setVelocityX(1);
      }
      if (cursors[i].up.isDown){
        players[i].body.setVelocityY(-1);
      } else if (cursors[i].down.isDown){
        players[i].body.setVelocityY(1);
      }
      
      for(var j=1; j<nbreJoueurs; j++){   //détermine la vitesse du joueur, et stabilise la vitesse en diagonale
        players[j].body.velocity.normalize().scale(speed-50);
      } 
      players[0].body.velocity.normalize().scale(speed+50);
  }
  if((cursors[0].right.isDown) && !(cursors[0].up.isDown) && !(cursors[0].down.isDown)){
        players[0].setRotation(0);
      }
      if((cursors[0].left.isDown) && !(cursors[0].up.isDown) && !(cursors[0].down.isDown)){
        players[0].setRotation(Math.PI);
      }
      if((cursors[0].up.isDown) && !(cursors[0].left.isDown) && !(cursors[0].right.isDown)){
        players[0].setRotation((3*(Math.PI))/2);
      }
      if((cursors[0].down.isDown) && !(cursors[0].left.isDown) && !(cursors[0].right.isDown)){
        players[0].setRotation((Math.PI)/2);
      }
      if((cursors[0].right.isDown) && (cursors[0].up.isDown)){
        players[0].setRotation((7*(Math.PI))/4);
      }
      if((cursors[0].right.isDown) && (cursors[0].down.isDown)){
        players[0].setRotation((Math.PI)/4);
      }
      if((cursors[0].left.isDown) && (cursors[0].up.isDown)){
        players[0].setRotation((5*(Math.PI))/4);
      }
      if((cursors[0].left.isDown) && (cursors[0].down.isDown)){
        players[0].setRotation((3*(Math.PI))/4);
      }
}                                          //    ========================
                                   

function clock(){                  //    FONCTION DE TEMPS
  clockValFloat += 0.0167;
  clockVal = Math.round(clockValFloat);
  //console.log(clockValFloat);
  //console.log(clockVal);
  
}                                  //    =================


function changeImage(){
  for(var i=1; i < nbreJoueurs; i++){
    if(cursors[i].changeImage.isDown && delayChange[i] < clockVal){
      players[i].setTexture('typeObjet'+(Math.floor(Math.random() * nbreTypesObjets)).toString());
      delayChange[i] = clockVal+0.5;
    }
  }
}


function zeroVelocityObjects(){
  for(var i=0; i<nbreTypesObjets; i++){
    objects[i].setVelocity(0,0);
  }
}

function endLife(){
  for(var i=0; i<nbreJoueurs; i++){
    if (playersLife[i] <= 0){
      players[i].setVisible(false);
      console.log(playerAlive[i] + ' ' + i);
      if(playerAlive[i]){
        deadSound.play();
        playerAlive[i] = false;
      }
    } else{
      playerAlive[i] = true;
    }
  }
  
  if(playersLife[0] <= 0){
    whoWins = 'hidden';
    console.log('hidden win.s !');
    game.scene.stop('HideAndSeekHUDScene');
    game.scene.stop('HideAndSeekScene');
    game.scene.start('EndGame');
    game.scene.bringToTop('EndGame');
  }

  if(nbreJoueurs == 2){
    if(playersLife[1] <= 0){
      whoWins = 'seeker';
      console.log('seeker wins !');
      game.scene.stop('HideAndSeekHUDScene');
      game.scene.stop('HideAndSeekScene');
      game.scene.start('EndGame');
      game.scene.bringToTop('EndGame');
    }
  }

  if(nbreJoueurs == 3){
    if(playersLife[1] <= 0 && playersLife[2] <= 0){
      console.log('seeker wins !');
      whoWins = 'seeker';
      game.scene.stop('HideAndSeekHUDScene');
      game.scene.stop('HideAndSeekScene');
      game.scene.start('EndGame');
      game.scene.bringToTop('EndGame');
    }
  }

  if(nbreJoueurs == 4){
    if(playersLife[1] <= 0 && playersLife[2] <= 0 && playersLife[3] <= 0){
      console.log('seeker wins !');
      whoWins = 'seeker';
      game.scene.stop('HideAndSeekHUDScene');
      game.scene.stop('HideAndSeekScene');
      game.scene.start('EndGame');
      game.scene.bringToTop('EndGame');
    }
  }
}

function endTime(){
  if(clockVal >= tempsPartie){
    whoWins = 'hidden';
    console.log('hidden win.s !');
    game.scene.stop('HideAndSeekHUDScene');
    game.scene.stop('HideAndSeekScene');
    game.scene.start('EndGame');
    game.scene.bringToTop('EndGame');
  }
}

function taunting(player){
  var which = Math.floor(Math.random() * 8);
  generateVolume(player);
  taunt[which].setVolume(generatedVolume[player]);
  if(generatedVolume[player] > 0.00){
            taunt[which].play();
  }
}

function generateVolume(player){
  var distanceBetween = Math.sqrt(Math.pow((players[0].x - players[player].x), 2) + Math.pow((players[0].y - players[player].y), 2));

  generatedVolume[player] = 1 - (distanceBetween/300);
}