/**
 *  @web.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */

ig.module(
    'bootstrap.platforms.web'
)

    .requires(

    )

    .defines(function ()
    {

        if (ig.ua.mobile)
        {
            // Disable sound for all mobile devices
            ig.Sound.enabled = false;
        }
        else
        {
            // Remove touch controls when they are not needed
            var controls = document.getElementById("controls");
            if (controls)
                document.getElementById('game-container').removeChild(controls);
        }



        var sizes = {
                        iPhone:{width:240, height:160, scale:2},
                        android:{width:240, height:160, scale:2},
                        iPad:{width:240, height:160, scale:4},
                        default:{width:240, height:160, scale:4}
                    };

        ig.gameSize = sizes.default;

        if (ig.ua.iPhone)
        {
            ig.gameSize = sizes.iPhone;
        } else if (ig.ua.android)
        {
            ig.gameSize = sizes.android;
        } else if (ig.ua.iPad)
        {
            ig.gameSize = sizes.iPad
        }

    });
