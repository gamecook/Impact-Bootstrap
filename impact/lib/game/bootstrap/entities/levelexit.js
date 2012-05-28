/**
 *  @levelexit.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */

//TODO need to change class and file name to level-exit and LevelExit
ig.module(
    'game.bootstrap.entities.levelexit'
)
    .requires(
    'impact.entity',
    'game.bootstrap.entities.door'
)
    .defines(function ()
    {

        EntityLevelexit = EntityDoor.extend({
            storage:null,
            levelName:"",
            hiScore:0,
            init:function (x, y, settings)
            {

                //TODO Need to add option to have player activate when entering or by triggering it like a door

                this.parent(x, y, settings);

                // Setup Local Storage
                this.storage = this.storage = new ig.Storage();

                if (this.level)
                {
                    this.levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function (m, l, a, b)
                    {
                        return a.toUpperCase() + b;
                    });

                    var levelScoreID = this.levelName + "Score"
                    this.hiScore = this.storage.getInt(levelScoreID) ? this.storage.getInt(levelScoreID) : 0;
                }


            },
            onOpen:function ()
            {
                if (this.levelName)
                {
                    ig.game.currentLevelName = this.levelName;
                    ig.game.loadLevelDeferred(ig.global['Level' + this.levelName]);
                }
            },
            entityCanOpenDoor:function (other)
            {
                this.parent(other);

                //console.log("score", this.storage.getInt(levelScoreID), levelScoreID);

                ig.game.displayCaption(this.level.capitaliseFirstLetter() + " Hi-Score " + this.hiScore.toString().padString(6), .2);

            }
        });
    });
