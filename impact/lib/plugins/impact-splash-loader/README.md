Impact Splash Loader Plugin
==========

#### Splash Loading Screen Plugin for the Impact Game Engine ####

This plugin for the [Impact Game Engine](http://impactjs.com/) shows an animated Impact logo on the loading screen. The size of the logo automatically adjusts to the size of the canvas.


### Demo ###

[Z-Type](http://www.phoboslab.org/ztype/)

[Biolab Disaster](http://playbiolab.com/)



### Usage ###

Put the `impact-splash-loader.js` into your `lib/plugins/` directory and require it with `plugins.impact-splash-loader`. 
Call your `ig.main()` with the `ig.ImpactSplashLoader` class as the last argument. E.g.:

	// Start the Game with 60fps, a resolution of 320x240, scaled
	// up by a factor of 2
	// Use the ig.ImpactSplashLoader class as the preloader
	ig.main( '#canvas', MyGame, 60, 320, 240, 2, ig.ImpactSplashLoader );