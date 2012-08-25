ig.module(
    'game.resident-raver.entities.level-select'
)
    .requires(
    'bootstrap.plugins.impact.caption',
    'game.resident-raver.entities.door',
    'game.resident-raver.plugins.local-storage'
)
    .defines(function(){

        EntityLevelSelect = EntityDoor.extend({
            storage: null,
            levelName: "",
            hiScore: 0,
            init:function(x, y, settings)
            {
                this.parent(x, y, settings);

                //TODO depends on local storage

                // Setup Local Storage
                //ig.game.storage = ig.game.storage = new ig.Storage();

                if (this.level) {
                    this.levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function(m, l, a, b) {
                        return a.toUpperCase() + b;
                    });

                    var levelScoreID = this.levelName+"Score";
                    if(ig.game.storage)
                        this.hiScore = ig.game.storage.getInt(levelScoreID) ? ig.game.storage.getInt(levelScoreID) : 0;
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
                    ig.game.displayCaption(this.level.capitalize()+" Hi-Score "+this.hiScore.toString().pad(6, "0"),.2);

            }
        });
    });
