#About Impact Bootstrap

Impact Bootstrap is a simple collection of scripts, code and stock art/sounds that can help you create HTML5 games faster. The Bootstrap consists of three areas: 

* **scripts** for automation and deploying games to different platforms as well as scripting tasks in Photoshop.  
* **impact** that contains a collection of plugins, entities and sample code to extend the core impact framework and offer extra functionality in the map editor. Here is a list of important directories that make up the Bootstrap:
    * **impact/lib/bootstrap** is the  main directory where all the Bootstrap code lives in your impact project.
    * **impact/lib/bootstrap/entities** is where you can find all the entities for the Bootstrap.
    * **impact/lib/bootstrap/platforms** is a collection of modules that will modify your game based on the type of platform it will run on. *(Web is the only finished platform and more are coming soon.)*
    * **impact/lib/bootstrap/plugins** is where all the Bootstrap plugins live.
    * **impact/lib/bootstrap/bootstrap.js** is a module that will load all the Bootstrap plugins. Simply add `'bootstrap.bootstrap'` to the requires block of your `main.js` module.
    * **impact/lib/bootstrap/weltmeister-bootstrap.js** will load in all the Bootstrap plugins for Weltmeister (Impact's level editor). Simply add `'bootstrap.weltmeister-bootstrap'` to the requires block of the `impact/weltmeister/weltmeister.js` module.
* **resources** contains a collection of stock art and sounds to help you prototype out your ideas quickly.

Here is a brief overview of the Impact Bootstrap and how to use it:

##Scripts
There are two scripts folders: build and Photoshop. The **build** directory has an Ant build script along with templates for automating, building and deploying your Impact game. The **Photoshop** folder contains helpful scripts for automating artwork generation, such as sprite sheets in Photoshop. The following scripts are included in the Bootstrap:

* **build.xml** is located in the build directory and will help automate compiling the game and deploying it to multiple platforms.
* **LayersToSprite.js** is inside the Photoshop directory and will convert layers in a PSD to a sprite sheet.

###Running The Ant Build
You will need to have Ant installed on your computer before you can run the script. Once you 
have Ant installed, you will need to do the following:

1. Copy the `build.template.properties` file and rename it `build.properties`.
* Replace the contents of the `build.properties` file with your game's name, description and
additional meta data.
* Make sure you configure your build paths for each of the platforms you plan on deploying to.
* From the command line, cd into your project's build directory and call `$ ant`, which will
run the default build target. 
* You will know the build works if you don't see any errors and a deploy folder was created in your project's root with builds for each of the platforms the bootstrap build script supports.

Once you are comfortable running the build script, you can go in and modify the build targets by commenting out platforms you do not need. *(As of now, only Web and Chrome Market platforms are fully supported. Specific build scripts for each of the other platforms are coming soon.)*

###Running The Photoshop Scripts
In order to run any of the Photoshop scripts:

1. Open up a PSD to run the script on in Photoshop.
2. From the `File` menu, select `Scripts`. Then, in the drop down, select `Browse…` in order to find the script you want to run from the system finder.

##Impact
The Impact directory is set up exactly like any default Impact project. Inside, you will find the following directories and files, which you can copy over to your own project:

* **lib/game** contains the Bootstrap directory, some sample entities, a test level and a sample
game file (`main.js` && `config.js`) so you can test out the Bootstrap.
* **media/bootstrap** contains directories for all images, sounds and CSS required to run the Bootstrap.
* **index.html** is a new `index.html` file to replace Impact's default one. This file includes a reference to the new CSS, which is located in the `media/bootstrap` directory, as well as placeholder artwork for touch controls.

Most of the core code that makes up the Impact Bootstrap lives in the `lib/bootstrap' 
directory. Let's take a quick look at how the Bootstrap's plugins and entities work:

###Bootstrap Plugins
Each of the plugins that make up the Impact Bootstrap were designed to work together or 
independently allowing you to pick and choose which parts of the Bootstrap you want to include in your game. The plugins are broken down into two groups: **impact** and **weltmeister**.

To import the entire collection of plugins, simply add `'bootstrap.bootstrap'`
to your main game module's requires block.

* **camera.js** is a simple camera class that follows an entity and allows you to set a region around the player to trigger scrolling. It also handles basic lighting effects via a PNG overlay.
* **caption.js** is a plugin that patches the main game class and allows you to display a text message at the bottom of the screen that disappears after a set number of seconds. This is ideal for showing instructions at the beginning of a level or displaying status messages during the game.
* **menu.js** adds the ability to overlay a 'screen' on top of the game. This is useful for pause menus or displaying stats at the end of a level or a game-over screen. There is a default menu that lets you display text. Simply extend this and override the `draw()` method with your own graphics.
* **pause.js** adds support to pause all entities in the game on the screen by calling
`togglePause()` on the `ig.game` class. This will not update any entities when paused, but they will continue to draw.
* **tracking.js** is a wrapper for Google Analytics to do tracking in your game. This plugin 
automatically adds Google tracking code to your game. All you need to do is supply your tracking account number. You can also use the Ant build to automatically replace a `@tracking@` token in your game code if you don't want to hardcode it. Simply supply your account information in the `project.tracking` property of the `build.properties` file and pass the token, as a string, into the instance of the tracking class:

        this.tracking = new Tracking(@tracking@);

* **utils.js** adds some basic utilities to your game, such as padding strings with zeros for 
high scores and the ability to load a level by its file name via a newly injected `loadLevelByFileName()` method on the `ig.game` class.

---
More plugins are planned. Here are a few coming soon:

* **mini-map.js** will add a mini map to your game.
* **random-map.js** will allow you to generate random maps on the fly similar to the 
Weltmeister random map generation plugin.
* **utils.js** will have more utilities added to it, such as an experience/level calculator and more.

###Weltmeister Plugins
To import the entire collection of Weltmeister-specific plugins, simply add `'bootstrap.weltmeister-bootstrap'` to the `weltmeister/weltmeister.js` module's requires block. Here is a list of the plugins currently in the bootstrap.

* **random-map.js** adds the ability to generate random map generation via a new button in the level editor. *(A full panel to configure the random map generation settings is coming soon!)*

If you would like to use the bootstrap's entities, you will need to configure your `weltmeister/config.js`. Simply replace:

    'entityFiles': 'lib/game/entities/*.js',
    
with

    'entityFiles': ['lib/game/entities/*.js',
                    'lib/bootstrap/entities/*.js']
        
which tells the editor to load entities from the `lib/bootstrap/entities` directory. This is also a good technique to use if you want to keep your custom entities in another location. *(I am working on making this automated a little better for future releases of the bootstrap.)*

###Entities
The Impact Bootstrap comes with its own set of entities, which you can use out of the box or 
extend off of in order to help speed up game development. Entities are broken down into two 
groups: core and ready to use.

####Core Entities
Core entities are 'abstract classes' designed to allow you to extend them in your own game. They cannot be directly placed on the map without being extended and finalized with artwork and logic. The Impact Bootstrap comes with a set of examples showing how to use these core entities, which you can find inside the `impact/entities` directory. Let's take a look at the core entities:

* **base-actor** represents any entity in your game that will move, have death animation and  possibly need some kind of AI. The base-actor supplies some stub methods and logic, such as the  ability to become "invincible", spawn particles when it receives damage or is killed, can be crushed by moving platforms, fall to its death (happens when the entity falls for too long then hits a *fixed* entity or something in the collision map) and more. Take a look at the class to see what has been added. The base-player and base-monster extend off this class.
* **base-monster** is a template for a simple monster in your game. Right now, the monster knows how to walk back and forth on a platform without falling off. *(In the future, the base-monster will have additional AI, such as walking off platforms, follow the player and hooks to interact with other entities in the game world.)*
* **base-player** is a template to help build your player entity off of. The base-player has logic to handle being killed (which calls an `onPlayerKilled()` method on the `ig.game` class) and also has generic logic for handling input. The player monitors the `ig.input` class for actions and will automatically call methods on your player class that correspond to *'pressed'*, *'down'* and *'released'*. Here is an example of how to implement this into your own game:
    1. Extend the `base-player.js` class.
    * Make sure you have bound keys to input class:
    
            ig.input.bind('RIGHT_ARROW', 'right');
        
    * In your new player class, add the following methods, which will automatically be called based on the state of the binding:
    
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
* **base-item** is a template for items that an actor can pick up or equip in the game. It supports the notion of flagging the item as equipable which will hide the item entity on the game map but add it to an actor's inventory. From there you can handle each call to equip to do specific actions for each type of item. *(This item and it's full set of functionality is still being fleshed out.)
    
####Ready-To-Use Entities
The entities in the root of the Bootstrap entity directory can be used as is. These entities do have some dependencies on artwork in the media folder, but you can simply inject new properties into them if you need to resize or replace artwork. Here is a list of the ready-to-use entities:

* **base-door.js** is simple door that allows the player to hide inside without taking damage. The door can be extended to offer rewards to the player for going inside or when leaving.
* **base-elevator.js** is a complex moving platform comprised of two invisibly moving platforms that stay in sync and form the top and bottom of the elevator. This allows the player to stand on top and not fall through the bottom of the elevator while still walking through it. It also has the ability to crush other entities that extend the `base-actor` class.
* **levelexit.js** allows the player to exit a level. When the player enters this invisible entity it calls `exitLevel()` which is injected into the `ig.game` class allowing you to handle exiting to the next level. The is useful of showing an end of level screen or simply returning to beginning of the game or start/level picker screen.
* **outofbounds.js** is an invisible area that calls an `outofbounds()` handler on any entity that collides with it. This method is automatically added to any entity that extends the base-actor class. It is useful for holes in floors or areas that should instantly kill an entity.
*  **particle-emitter.js** handles spawning particles on an entity. Simply provide a target and the name of the particle entity you want to spawn and the emitter will handle managing pooling of each instance. There are several built in particles such as fire(`EntityFirerParticle`), snow(`EntitySnowParticle`) and water(`EntityWaterParticle`). *(I'll be adding in more particles and templates for the emitter to help simulate different effects)*
* **spawner.js** - will spawn other entities based on a set time and has a built-in object pool. When an entity is created via the spawner, they will get a reference to the spawner instance in the settings object passed into the `init()` constructor. This allows spawned entities to call back to the spawner when destroyed in order to return to the pool.
* **teleporter.js** is a simple entity that can move the player over to a target or random targets depending on how many are passed into the teleporter instance.
* **text.js** is a simple entity that can display text on maps. This is useful for anywhere you would need text on a map without having to generate tiles for it. Also, these entities can be set to *fixed* collision so other entities can stand on them. *(This entity still needs to be optimized and incurs in a `draw()` call for every letter being rendered. Future versions of this entity will cache its bitmap data to speed up rendering.)*
* **void.js** is an entity with no visuals or logic and is intended to be used as targets 
spawners, platforms and elevators.
* **weapons.js** - is a base set of weapons for players and enemies to use. This package includes the build to build automatic and non-automatic weapons and projectiles such as grenades.

If you are unfamiliar with how injection works in Impact, here is a quick example of how to 
change out the artwork, size and speed of the `base-elevator.js` entity:

       Example is coming soon!
       
Likewise, you could also extend the elevator class on your own and supply the same properties or create different versions of the elevator class like so:

       Example is coming soon!
       
Now that we have covered how plugins and entities work, let's look at the last directory that makes up the Impact Bootstrap:

##Resources
The resources directory includes artwork and sound effects you can use to help prototype out your game quickly without having to worry about creating new artwork. The resource directory is broken down into artwork and sound effects:

###Artwork
More stock artwork will be added as the Impact Bootstrap evolves.

###Sound Effects
Impact Bootstrap comes with a set of pre-generated sound effects, which you can use as placeholders or put them in your final game. In addition to the source wavs, you get a *bfxrlibrary* to see how the originals were created with [bfxr](http://www.bfxr.net). You will also find MP3 and Ogg versions in the `media/bootstrap/sounds` folder for use in Impact. *(.caf files for iOS are coming soon.)*

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

##Change Log

**v0.3.0-alpha**

* Updated `levelexit.js` to now inject and call a new `exitLevel()` method on the `ig.game` class.
* Added more features to the Jetroid demo such as a stats screen to show during pause or when exiting a level, a new demo level, and added a way to exit a level to show off the new `exitlevel.js` class and monsters.
* Added new `win8.js` plugin inside of the platform folder which adds support for deploying your game to Windows 8 as an HTML5 Metro app.
* Fixed css for the buttons on the `index.html` to float instead of being hardcoded to a specific size.
* Adding more artwork for Jetroid to the resources directory.
* Added prototype to Math class to support randomRange(min, max)
* Starting to move new utility classes into `ig.utils` namespace instead of prototyping main classes in JS. First one is `ig.utils.randomRange(min, max)` which allows you to get a random number between a set range. *(I will be converting other string utils to this format as well moving forward)*
* Cleaned up animation issue in base actor, player and monster that would throw an error if no animation was set in the constructor. 
* Fixed player to change alpha based on invincibility flag.
* Modified base-monster to now turn around when colliding with the player.
* Refactored `shakeScreen()` method injected into `ig.game` class to now accept duration and strength. Now the camera class's `shake()` method automatically defaults to duration of 1 and strength of 3 if none are supplied. 
* Created `particle-emitter.js` class in the bootstrap.

**v0.2.0-alpha**

* Refactored Bootstrap to sit inside of `impact/lib` instead of `impact/lib/game`
* Updated to support lasts versions of Impact (v1.2.0).
* Removed plugins that are no longer needed (raf.js, entities.js). 
* Added demo folder with new game Jetroid to help show off how the bootstrap works.
* Cleaned up `main.js` to now load Jetroid by default similar to how a plugin works, which will allow users to eventually easily swap out each demo game.
* Added `.capitalize()` method to string in the `util.js` plugin.
* Added Jetroid artwork to the resources directory for use with the demo game. *(PNGs require Fireworks to see animation frames properly)*
* Added base-item entity to the bootstrap which sets the foundation of equipment and power ups. Examples of how to use this class are part of the Jetroid demo.
* Moved "core entities" into main bootstrap entity folder now that Impact v1.2.0 add support for ignoring entities in weltmeister.

##Demos
Impact Bootstrap comes with some demo games in order to show off how you can build your own games off of the bootstrap. I'll be filling in more details here as I build out each of the demo games.

###Jetroid
More info coming soon on this game, how it works and how to run in. Right now it's set up by default in the bootstrap. Check out its source code in `lib/bootstrap/demos/jetroid`.



#Coming Soon
The Impact Bootstrap is still a work in progress. Here are some features I plan on adding:

###Better Demo Game
Right now I include a few example classes showing off how to set up a game using the Impact Bootstrap. I will eventually turn this into a full featured game. For now, check out the `main.js` module to see some techniques I use for configuring my games, customizing the main game class to handle auto-binding for touch and keyboard as well as a sample level showing off a few of the Bootstrap entities.

###Game Templates 
These demo games will show off how to prototype our your ideas faster. Here are some ideas of templates I would like to include in the Bootstrap:

* **Side Scroller** is the default template for Impact games.
* **Top Down** - for Zelda-like games.
* **Turn Based** - is useful for rogue-like games and builds off the top-down template.
* **Endless Runner** - auto-scrolls the map at a set speed and is based off a side 
scroller template.

###More Stock Artwork/Sounds
I will continue to add more artwork for each of the game templates as well as more sound effects such as background music.

###More Entities
I plan on porting over other entities from my games such as:

* **barricade.js** is a destructible object that can be placed to slow down monsters.
* **power-up-spawner.js** allows you to spawn monsters that grow increasingly stronger as they return back to the object pool.
* **spawn-boss.js** is a trigger to spawn a boss battle when the player enters a location on the map.

###Documentation On Platform Plugins
I plan on finishing up the platform-specific plugins and documenting how to use them.


###Demo Site
I'll be building a site to showcase each of the plugins along with example code on how to use them.
