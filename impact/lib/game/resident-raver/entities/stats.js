/*
This entity does nothing but just sits there. It can be used as a target
for other entities, such as movers.
*/

ig.module(
	'game.resident-raver.entities.stats'
)
.requires(
	'impact.entity'/*,
    'game.plugins.impact-storage'*/
)
.defines(function(){
	
EntityStats = ig.Entity.extend({
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(128, 28, 230, 0.7)',
    _wmScalable: true,
	size: {x: 8, y: 8},
    text: [],
    storage:null,
    statText: new ig.Font( 'media/bootstrap/images/04b03.font.png' ),
	init: function(x, y, settings)
    {
        this.parent(x,y,settings);
        if(typeof wm == "undefined")
        {
            this.storage = new ig.Storage();
            ig.game.cameraOffsetY = -16;
        }

        //TODO this entire class's display needs to be cashed since it doens't update
    },
    update: function(){
        this.parent();
        if(typeof wm == "undefined")
        {
            this.updateText();
        }

    },
    updateText: function(){
        if(this.storage)
        {
            var level = this.storage.getInt("level");
            var nextLevel = level + 1;
            var totalScore = this.storage.getInt("totalScore");
            var rewardsTotal = (nextLevel * (nextLevel + 1)) * 1000;
            var totalKills = this.storage.get("totalKills");
            var totalDoors = this.storage.get("totalDoors");
            this.text.length = 0;
            this.text.push("Total -> Score: "+totalScore.toString().pad(7, "0"));
            this.text.push("Kills: "+totalKills.toString().pad(6, "0"));
            this.text.push("Doors: "+totalDoors.toString().pad(6, "0"));
        }
    },
	draw: function(){
        this.parent();
        if(typeof wm == "undefined")
        {
            ig.system.context.fillStyle = 'rgba(0,0,0,0.9)';
            ig.system.context.fillRect(0 * ig.system.scale, 0 * ig.system.scale, ig.system.width * ig.system.scale, 16 * ig.system.scale);

            var nextX = 5;
            var padding = 7;
            var i = 0;
            var nextText;
            var total = this.text.length;

            for(i = 0; i < total; i++)
            {
                nextText = this.text[i];
                this.statText.draw(nextText, nextX, 5);
                nextX += this.statText.widthForString(nextText) + padding;
            }
        }

    }
});

});