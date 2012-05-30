/**
 *  @menu.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  The menu plugin allows you to display in game menus on top in game graphics.
 *  This is useful for pause screens or game over screens where you don't
 *  want to load a new game instance.
 *
 *  The menu plugin injects logic into the ig.game class to showMenu() and
 *  hideMenu() along with state management for attaching, rendering and
 *  removing a Menu class that is not part of the Entity render system.
 *
 *  You can display a menu at any time by doing the following:
 *
 *  ig.game.showMenu(new PauseMenu("Pause"));
 *
 *  By default the Menu class simply draws a semi-transparent black overlay
 *  on top of the screen and displays text. You can extend the Menu class
 *  and override the draw method in order to customize the look of the menu.
 *
 */

ig.module(
    'bootstrap.plugins.impact.menu'
)
    .requires(
    'impact.game',
    'impact.font'
)
    .defines(function ()
    {

        ig.Game.inject({
            activeMenu:null,

            draw:function ()
            {
                this.parent();
                if (this.activeMenu)
                    this.activeMenu.draw();
            },
            showMenu:function (view)
            {
                if (view.draw)
                    this.activeMenu = view;
            },
            hideMenu:function ()
            {
                this.activeMenu = null;
                //TODO need to make sure we don't have to destroy any menu
            },
            loadLevel:function (data)
            {
                //TODO this really should be tied into game over but it's safer to remove any menus when a level loads
                this.hideMenu();
                this.parent(data);
            }
        });

        Menu = ig.Class.extend({
            menuFont:new ig.Font('media/bootstrap/images/04b03.font.png'),
            title:null,
            init:function (title)
            {
                this.title = title ? title : " Menu Title";
            },
            draw:function ()
            {
                ig.system.context.fillStyle = 'rgba(0,0,0,0.8)';
                ig.system.context.fillRect(0, 0, ig.system.width * ig.system.scale, ig.system.height * ig.system.scale);
                var x = ig.system.width * .5;
                var y = ig.system.height * .5;
                this.menuFont.draw(this.title, x, y, ig.Font.ALIGN.CENTER);
            }
        })


    })