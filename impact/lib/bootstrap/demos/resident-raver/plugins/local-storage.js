ig.module(
    'bootstrap.demos.resident-raver.plugins.local-storage'
)
    .requires(
    'plugins.impact-storage.impact-storage',
    'bootstrap.demos.demo-harness',
    'bootstrap.demos.resident-raver.config'
)
    .defines(function(){

        MyGame.inject({
            storage:null,
            init: function()
            {
                this.parent();
                // Setup Local Storage
                this.storage = new ig.Storage();

            },
            showDeathMessage: function()
            {
                //this.parent();

                var levelScoreID = this.currentLevelName+"Score";

                //console.log("levelScoreID", levelScoreID);

                var hiScore = this.storage.getInt(levelScoreID) ? this.storage.getInt(levelScoreID) : 0;
                if(this.stats.score >  hiScore)
                {
                    this.storage.set(levelScoreID, this.stats.score);
                    displayHiScore = true;
                }

                //console.log("hi-score", hiScore, this.stats.score, this.storage.getInt(levelScoreID));

                // Save Stats
                this.storage.set("totalScore", this.storage.getInt("totalScore") + this.stats.score);

                this.storage.set("totalKills", this.storage.getInt("totalKills") + this.stats.kills);

                //console.log("set totalKills", this.stats.kills, this.storage.getInt("totalKills"));

                this.storage.set("totalDoors", this.storage.getInt("totalDoors") + this.stats.doors);
            }
        })

        StartScreen.inject({
            storage:null,
            init:function()
            {
                this.parent();


                this.storage = new ig.Storage();
                //console.log("New storage", this.storage, this.storage.isSet("totalScore"), this.storage.get("totalScore"));
                //this.resetLocalStorage(); // <- Use this for testing
                // Setup default game values for first time install
                this.setupLocalStorage();
            },
            setupLocalStorage:function () {

                //console.log("Setup local storage", this.storage);

                if (!this.storage.isSet("level")) {
                    this.storage.set("level", 1);

                    // Tracking
                    //this.tracking.trackEvent("game", "new", "new-install-version:" + version, null);
                }
                //Total Kills
                if (!this.storage.isSet("totalKills"))
                    this.storage.set("totalKills", 0);

                //Total Doors
                if (!this.storage.isSet("totalDoors"))
                    this.storage.set("totalDoors", 0);

                //Total Score
                if (!this.storage.isSet("totalScore"))
                    this.storage.set("totalScore", 0);

                if (!this.storage.isSet("version")) {
                    this.storage.set("version", ig.config.version);
                }
                else {
                    var oldVer = this.storage.get("version");

                    // Tracking
                    /*if (oldVer != version)
                        this.tracking.trackEvent("game", "upgrade", oldVer + "->" + version, null);*/
                }

                //console.log("totalKills", this.storage.get("totalKills"),"totalDoors", this.storage.get("totalDoors") )
            },
            resetLocalStorage:function () {
                this.storage.clear();
            }
        })

    }
)