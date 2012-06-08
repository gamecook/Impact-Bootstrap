/**
 *  @levelexit.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  The pause plugin allows you to pause all the entities in the game. It
 *  modifies the ig.game class's updateEntities loop to add a check to see
 *  if an entity should pause or continue to draw during a pause state. This
 *  allows you to still use entities for menus and overlays while instances
 *  like the player and monsters are all paused.
 *
 *  The ig.Game class get's a paused value and methods for toggling the
 *  pause such as togglePause(), onPause() and onResume(). By default the
 *  onPause and onResume will try to display/remove a Menu class if the menu.js
 *  plugin has been loaded. If not you can simply override these methods in
 *  your game class to do what ever you would like.
 *
 *  If you have the menu.js plugin loaded and want to use the standard Menu
 *  class. You can override the new ig.game class's onPause method and supply
 *  your own custom menu that extends the base Menu class and override's the
 *  draw call into it and display what you would like on.
 *
 *  Because this plugin modifies the ig.game class updateEntities loop it is
 *  important to load this as early as possible.
 */

ig.module(
    'bootstrap.plugins.impact.pause'
)
    .requires(
    'impact.game',
    'impact.timer'
)
    .defines(function ()
    {

        ig.Game.inject({
            paused:false,
            pauseDelayTimer: new ig.Timer(),
            pauseButtonDelay: .3,
            updateEntities:function ()
            {
                for (var i = 0; i < this.entities.length; i++)
                {
                    var ent = this.entities[i];
                    if (!ent._killed && !this.paused)
                    {
                        ent.update();
                    }
                    else if (ent.ignorePause)
                    {
                        ent.update();
                    }
                }
            },
            togglePause:function (override)
            {
                // This makes sure you can't call pause too quickly
                if (this.pauseDelayTimer.delta() > this.pauseButtonDelay)
                {
                    //TODO need to check this and make sure it works
                    this.paused = override != null ? override : !this.paused;

                    //TODO need to keep track of the time the pause was activated and call onResumePause when resumed
                    if (!this.paused)
                        this.onResume();
                    else
                        this.onPause();

                        this.pauseDelayTimer.reset();
                }

            },
            onResume:function ()
            {
                if(this.hideMenu)
                this.hideMenu();
            },
            onPause:function ()
            {
                if(this.showMenu)
                    this.onShowPauseMenu()
            },
            /**
             * Override this if you want to display a custom pause menu
             */
            onShowPauseMenu: function()
            {
                this.showMenu(new Menu("Pause"));
            }
        });

        ig.Entity.inject({
            ignorePause:false
        })

    })