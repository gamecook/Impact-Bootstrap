/**
 *  @string-utils.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  A collection of commonly used utilities and prototypes to help with
 *  game dev.
 */

ig.module(
    'game.bootstrap.plugins.impact.utils'
)
    .requires(
    'impact.game'
)
    .defines(function ()
    {

        String.prototype.padString = function (length)
        {
            var str = this;
            while (str.length < length)
            {
                str = '0' + str;
            }
            return str;
        }

        ig.Game.inject({
            currentLevelName: null,
            /*
             * This method allows you to load a level by it's file name. The extension is automatically removed.
             */
            loadLevelByFileName:function (value, deferred)
            {
                this.currentLevelName = value.replace(/^(Level)?(\w)(\w*)/,
                    function (m, l, a, b)
                    {
                        return a.toUpperCase() + b;
                    }).replace(".js", "");

                var levelData = ig.global['Level' + this.currentLevelName];

                this[deferred ? "loadLevelDeferred" : "loadLevel"](levelData);
            }
        })

    }
)