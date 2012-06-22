ig.module(
    'bootstrap.demos.resident-raver.entities.level-exit'
)
    .requires(
    'bootstrap.plugins.impact.caption',
    'bootstrap.demos.resident-raver.entities.door'
)
    .defines(function(){

        EntityLevelExit = EntityDoor.extend({
            storage: null,
            levelName: "",
            hiScore: 0,
            init:function(x, y, settings)
            {
                this.parent(x, y, settings);

                //TODO depends on local storage

                // Setup Local Storage
                //this.storage = this.storage = new ig.Storage();

                if (this.level) {
                    this.levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function(m, l, a, b) {
                        return a.toUpperCase() + b;
                    });

                    var levelScoreID = this.levelName+"Score"
                    this.hiScore = 0//this.storage.getInt(levelScoreID) ? this.storage.getInt(levelScoreID) : 0;
                }
            },
            onOpen: function(){
                if (this.levelName) {
                    ig.game.currentLevelName = this.levelName;
                    ig.game.loadLevelDeferred(ig.global['Level' + this.levelName]);
                }
            },
            entityCanOpenDoor: function(other)
            {
                this.parent(other);

                if(this.level)
                    ig.game.displayCaption(this.level+" Hi-Score "+this.hiScore.toString().padString(6),.2);

            }
        });
    });
