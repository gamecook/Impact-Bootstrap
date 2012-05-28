#About Impact Bootstrap

Impact Bootstrap is a simple collection of scripts, code and stock art/sounds which can help you create HTML5 games faster. The Bootstrap consists of 3 areas: 

* **scripts** for automation and deploying games to different platforms as well as scripting tasks in Photoshop.  
* **impact** which contains a collection of plugins, entities and sample code to extend the core impact framework and offer extra functionality in the map editor. Here is a list of important directories that make up the bootstrap:
    * **impact/lib/game/bootstrap** is the  main directory where all the bootstrap code lives in your impact project.
    * **impact/lib/game/bootstrap/entities** is where you can find all the entities for the bootstrap.
    * **impact/lib/game/bootstrap/platforms** is a collection of modules that will modify your game based on the type of platform it will run on. *(Web is the only finished platform, more are coming soon)*
    * **impact/lib/game/bootstrap/plugins** is where all the bootstrap plugins live.
    * **impact/lib/game/bootstrap/bootstrap.js** is a module that will load all of the bootstrap plugins. Simply add `'game.bootstrap.bootstrap'` to the requires block of your `main.js` module.
    * **impact/lib/game/bootstrap/weltmeister-bootstrap.js** will load in all the bootstrap plugins for Weltmeister (Impact's level editor). Simply add `'game.bootstrap.weltmeister-bootstrap'` to the requires block of the `impact/weltmeister/weltmeister.js` module.
* **resources** contains a collection of stock art and sounds to help you prototype out you ideas quickly.

Here is a brief overview of the Impact Bootstrap and how to use it.

##Scripts
There are two scripts folders, build and Photoshop. The **build** directory has an Ant build script along with templates for automating building and deploying your Impact game. The **photoshop** folder contains helpful scripts for automating artwork generation such as sprite sheets in Photoshop. The following scripts are included in the bootstrap:

* **build.xml** is located in the build directory and will help automate compiling the game and deploying it to multiple platforms.
* **LayersToSrpite.js** - This script is inside of the photoshop directory and will convert layers in a PSD into a sprite sheet.

###Running The Ant Build
You will need to have Ant installed on your computer before you can run the script. Once you 
have ant installed you will need to do the following:

1. Copy the `build.template.properties` file and rename it to `build.properties`
* Replace the contents of the `build.properties` file with your game's name, description and
additional meta data.
* Make sure you configure your build paths for each of the platforms you plan on deploying to.
* From the command line, cd into your project's build directory and call `$ ant` which will
run the default build target. 
* You will know the build works if you don't see any errors and a deploy folder was created in your project's root with builds for each of the platforms the bootstrap build script supports.

Once you are comfortable running the build script, you can go in and modify the build targets by commenting out platforms you do not need. *(As of now only web and chrome market platforms are fully support. Specific build scripts for each of the other platforms is coming soon.)*

###Running The Photoshop Scripts
In order to run any of the Photoshop scripts:

1. Open up a PSD you which to run the script on in Photoshop
2. From the `File` menu, select `Scripts` then in the drop down select `Browse…` in order to find the script you want to run from the system finder.

##Impact
The impact directory is set up exactly like any default Impact Project. Inside you will find the following directories and files which you can copy over to your own project:

* **lib/game** contains the bootstrap directory, some sample entities, a test level, and sample
game file (`main.js` && `config.js`) so you can test out the bootstrap.
* **media/bootstrap** contains directories for all images, sounds and CSS required to run the bootstrap.
* **index.html** a new `index.html` file to replace Impact's default one. This file includes a reference to the new css, which is located in the `media/bootstrap` directory, as well as placeholders artwork for touch controls.

Most of the core code that makes up the Impact Bootstrap lives in the `lib/game/bootstrap' 
directory. Let's take a quick look at how the bootstrap's plugins and entities work:

###Bootstrap Plugins
Each of the plugins that make up the Impact Bootstrap were designed to work together or 
independently allowing you to pick and choose which parts of the bootstrap you want to include in your game. The plugins are broken down into two groups, **impact** and **weltmeister**:

To import the entire collection of plugins, simply add `'game.bootstrap.bootstrap'`
to your main game module's requires block.

* **camera.js** is a simple camera class that follows an entity and allows you to set a region around the player to trigger scrolling. It also handles basic lighting effects via a png overlay.
* **caption.js** this plugin patches the main game class and allows you to display a text message at the bottom of the screen which disappears after a set number of seconds. This is ideal for showing instructions at the beginning of a level or displaying status message during the game.
* **menu.js** adds the ability to overlay a 'screen' on top of the game. This is useful for pause menus or displaying stats at the end of a level or a game over screen. There is a default menu that lets you display text. Simply extend this and override the `draw()` method with your own graphics.
* **pause.js** this adds support to pause all entities in the game on the screen by calling
`togglePause()` on the `ig.game` class. This will not update any entities when paused but they will continue to draw.
* **raf.js** patches Impact to use *RequestAnimationFrame* on browsers that support it. This can increase the performance of your game.
* **tracking.js** is a wrapper for google analytics to do tracking in your game. This plugin 
automatically adds google tracking code to your game, all you need to do is supply your tracking account number. You can also use the Ant build to automatically replace a `@tracking@` token in your game code if you don't want to hardcode it. Simply supply a your account information in the `project.tracking` property of the `build.properties` file and pass the token, as a string, into the instance of the tracking class.

        this.tracking = new Tracking(@tracking@);

* **utils.js** adds some basic utilities to your game such as padding strings with zeros for 
high scores and the ability to load a level by its file name via a newly injected `loadLevelByFileName()` method on the `ig.game` class.

---
More plugins are planned, here are a few coming soon:

* **mini-map.js** which will add a mini map to your game.
* **random-map.js** which will allow you generate random maps on the fly similar to the 
Weltmeister random map generation plugin.
* **utils.js** will have more utilities added to it such as a experience/level calculator and more.

###Weltmeister Plugins
To import the entire collection of weltmeister specific plugins, simply add `'game.bootstrap.weltmeister-bootstrap'` to the `weltmeister/weltmeister.js` module's requires block.

* **random-map.js** adds the ability to generate random map generation via a new button in the level editor. *(A full panel to configure the random map generation settings is coming soon!)*
* **entities.js** allows you to pull up bootstrap entities in the entity layer picker.

###Entities
The Impact Bootstrap comes with its own set of entities which you can use out of the box or 
extend off of in order to help speed up game development. Entities are broken down into two 
groups, core and ready to use.

####Core Entities
Core entities are 'abstract classes' designed to allow you to extend them in your own game. They can not be directly placed on the map without being extended and finalized with artwork and logic. The Impact Bootstrap comes with a set of examples showing how to use these core entities which you can find inside of the `impact/entities` directory. Let's take a look at the core entities:

* **base-actor** represents any entity in your game which will move, have death animation and  possibly need some kind of AI. The base-actor supplies some stub methods and logic such as the  ability to become "invincible", spawn particles when it receives damage or is killed, can be crushed by moving platforms, fall to its death (happens when the entity falls for too long then hits a *fixed* entity or something in the collision map) and more. Take a look at the class to see what has been added. The base-player and base-monster extend off of this class.
* **base-monster** is a template for a simple monster in your game. Right now, the monster knows  how to walk back and forth on a platform without falling off. *(In the future the base-monster will have additional AI such as walking off platforms, follow the player and hooks to interact with other entities in the game world.)*
* **base-player** is a template to help build your player entity off of. The base-player has logic to handle being killed (which calls a `onPlayerKilled()` method on the `ig.game` class) and also has generic logic for handling input. The player monitors the `ig.input` class for actions and will automatically call methods on your player class that correspond to *'pressed'*, *'down'* and *'released'*. Here is an example of how to implement this into your own game:
    1. Extend the `base-player.js` class.
    * Make sure you have bound keys to input class:
    
            ig.input.bind('RIGHT_ARROW', 'right');
        
    * In your new player class add the following methods which will automatically be called based on the state of the binding:
    
            rightPressed: function()
            {
                // Nothing to do when pressed for the first time
            },
            rightDown: function()
            {
                // Move the player to the right
            },
            rightReleased: function ()
            {
                // Perform any cleanup needed when the right button is released
            } 
    
####Ready To Use Entities
The entities in the root of the bootcamp entity directory can be used as is. These entities do have some dependencies on artwork in the media folder but you can simply inject new properties into them if you need to resize or replace artwork. Here is a list of the ready to use entities:

* **door.js** is simple door that allows the player hide inside without taking damage. The door can be extended to offer rewards to the player for going inside or when leaving.
* **elevator.js** is a complex moving platform comprised of two invisibly moving platforms that stay in sync and form the top and bottom of the elevator. This allows the player to stand on top and not fall through the bottom of the elevator while still walking through it. It also has the ability to crush other entities which extend the `base-actor` class.
* **levelexit.js** allows the player to exit a level and load a new one. You supply a new level name in Weltmeister when placing the entity on the map.
* **outofbounds.js** is an invisible area that calls an `outofbounds()` handler on any entity that collides with it. This method is automatically added to any entity which extends the base-actor class. It is useful for holes in floors or areas that should instantly kill an entity.
* **spawner.js** - this class will spawn other entities based on a set time and has a built in object pool. When an entity is created via the spawner they will get a reference to the spawner instance in the settings object passed into the `init()` constructor. This allows spawned entities to call back to the spawner when destroyed in order to return to the pool.
* **text.js** is a simple entity that can display text on maps. This is useful for any where you would need text on a map without having to generate tiles for it. Also these entities can be set to *fixed* collision so other entities can stand on them. *(This entity still needs to be optimized and incurs a `draw()` call for every letter being rendered. Future versions of this entity will cache it's bitmap data to speed up rendering.)*
* **void.js** is an entity with no visuals or logic and is intended to be used as targets 
spawners, platforms and elevators.
* **weapons.js** - a base set of weapons for players and enemies to use. This package includes the built to build automatic and non-automatic weapons and projectiles such as grenades.

If you are unfamiliar with how injection works in Impact, here is a quick example of how to 
change out the artwork, size and speed of the `elevator.js` entity.

       Example is coming soon!
       
Likewise you could also extend the elevator class on your own and supply the same properties or create different version of the elevator class like so:

       Example is coming soon!
       
Now that we have covered how plugins and entities work, let's look at the last directory that makes up the Impact Bootstrap.

##Resources
The resources directory includes artwork and sound effects you can use to help prototype out your game quickly without having to worry about creating new artwork. The resource directory is broken down into artwork and sound effects:

###Artwork
More stock artwork will be added as the Impact Bootstrap evolves.

###Sound Effects

Impact Bootstrap comes with a set of pre-generated sound effects which you can use as placeholders or put them in your final game. In addition to the source wavs you get a *bfxrlibrary* to see how the originals were created with [bfxr](http://www.bfxr.net). You will also find mp3 and ogg versions in the `media/bootstrap/sounds` folder for use in Impact. *(.caf files for iOS are coming soon.)*

* Death.wav
* ElevatorBeep.wav
* Empty.wav
* GrenadeBounce.wav
* GrenadeExplosion.wav
* GunFire.wav
* HitHard.wav
* HitSoft.wav
* Jump.wav
* MachineGunFire.wav
* MineBeep.wav
* MineExplosion.wav
* OpenDoor.wav
* PlayerMonsterFall.wav
* PowerUp.wav
* PowerUp2.wav
* ShotgunFire.wav
* StartGame.wav

#Coming Soon
The Impact Bootstrap is still a work in progress. Here are some features I plan on adding:

###Better Demo Game
Right now I include a few example classes showing off how to set up a game using the Impact Bootstrap. I will eventually turn this into a full featured game. For now, check out the `main.js` module to see some techniques I use for configuring my games, customizing the main game class to handle auto binding for touch and keyboard as well as a sample level showing off a few of the bootstrap entities.

###Game Templates 
These demo games will show off how to prototype our your ideas faster. Here are some ideas of templates I would like to include in the bootstrap:

* **Side Scroller** is the default template for Impact games.
* **Top Down** - For Zelda like games
* **Turn Based** - This is useful for roguelike games and builds off of the top down template
* **Endless Runner** - This auto scrolls the map at a set speed and is based off of side 
scroller template.

###More Stock Artwork/Sounds
I will continue to add more artwork for each of the game templates as well as more sound effects such as background music.

###More Entities
I plan on porting over other entities from my games such as:

* **barricade.js** is a destructible object which can be places to slow down monsters.* **fountain.js** which shows off how to summate water with the particle emitter class.* **power-up-spawner.js** allows you to spawn monsters that grow increasingly stronger as they return back to the object pool.* **snow-emitter.js** will show off how to do subtle particle effects such as snow and debris in the are via the particle emitter.* **spawn-boss.js** is a trigger to spawn a boss battle when the player enters a location on the map.
###Documentation On Platform Plugins
I plan on finishing up the platform specific plugins and documenting how to use them.
###Demo Site
I'll be building a site to showcase each of the plugins along with example code on how to use them.