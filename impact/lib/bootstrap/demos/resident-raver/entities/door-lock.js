/*
 This entity does nothing but just sits there. It can be used as a target
 for other entities, such as movers.
 */

ig.module(
    'bootstrap.demos.resident-raver.entities.door-lock'
)
    .requires(
    'impact.entity',
    'bootstrap.plugins.impact.caption'

)
    .defines(function(){

        EntityDoorLock = ig.Entity.extend({
            _wmDrawBox: true,
            _wmBoxColor: 'rgba(128, 28, 230, 0.7)',
            _wmScalable: true,
            size: {x: 8, y: 8},
            target:null,
            targets:[],
            init:function (x, y, settings) {
                this.parent(x, y, settings);
                this.targets = ig.ksort(this.target);
                this.mySort(this.targets);

                if(typeof wm == "undefined")
                {
                    var totalLevels = this.targets.length;

                    //TODO need some way of managing storage
                    /*var storage = ig.game.storage;

                    var level = storage.getInt("level");
                    var totalScore = storage.getInt("totalScore");*/

                    //For debug only

                    // Test level
                    level = 14;
                    totalScore = ((level-1) * ((level-1)+ 1)) * 1000;

                    // Test level up
                    //level = 15;
                    //totalScore = ((level+1) * ((level+1)+ 1)) * 1000;

                    var nextLevel = level + 1;
                    var rewardsTotal = (nextLevel * (nextLevel + 1)) * 1000;

                    if (totalScore >= rewardsTotal)
                    {
                        // Level up
                        level ++;
                        storage.set("level", level);

                        // Tracking
                        ig.game.tracking.trackEvent("game", "levelup", "level:"+level, null);

                        //console.log("Level up", level);

                        if (nextLevel > totalLevels)
                        {
                            level = nextLevel;
                            ig.game.displayCaption("All Doors Are Unlocked!");
                        }
                        else
                        {
                            ig.game.displayCaption("A New Door Was Just Unlocked");
                        }
                    }
                    else
                    {
                        ig.game.displayCaption("Next Door Unlocked At "+rewardsTotal+" Points.");
                    }

                    for (var i=0; i < totalLevels; i++)
                    {
                        ig.game.getEntityByName(this.targets[i]).activate((i < level) ? false : true);
                    }

                }
                //console.log("level", level, "nextLevel", nextLevel, "total", totalScore, "rewardsTotal", rewardsTotal);

            },
            mySort: function (arr)
            {
                var regex = /door([0-9]+)/;

                function map(str) {
                    return Number(regex.exec(str)[1]);
                }

                return arr
                    .sort(
                    function (a,b) {
                        var av = map(a), bv = map(b);
                        return av < bv ? -1 : av > bv ? 1 : 0;
                    })
            },
            update: function(){}
        });

    });