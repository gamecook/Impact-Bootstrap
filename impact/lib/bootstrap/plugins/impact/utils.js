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
    'bootstrap.plugins.impact.utils'
)
    .requires(
    'impact.game'
)
    .defines(function ()
    {

        ig.utils = {};

        String.prototype.pad = function(l, s){
            return (l -= this.length) > 0
                ? (s = new Array(Math.ceil(l / s.length) + 1).join(s)).substr(0, s.length) + this + s.substr(0, l - s.length)
                : this;
        };

        String.prototype.capitalize = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }

        ig.utils.randomRange = function(from, to){
            return Math.floor(Math.random() * (to - from + 1) + from);
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
                console.log("levelData", levelData);
                this[deferred ? "loadLevelDeferred" : "loadLevel"](levelData);
            }
        })

    }
)