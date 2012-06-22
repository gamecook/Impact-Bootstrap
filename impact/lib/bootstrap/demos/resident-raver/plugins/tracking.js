ig.module(
    'game.plugins.tracking'
)
    .requires(
)
    .defines(function(){

        Tracking = ig.Class.extend({
            debug: true,
            init:function (account) {
                if (_gaq)
                {
                    _gaq.push(['_trackPageview']);
                    if(account)
                        this.setAccount(account);
                }
                else
                {
                    this.analyticsNotFound();
                }
            },
            setAccount: function(account){
                if (_gaq)
                    _gaq.push(['_setAccount', account]);
                else
                    this.analyticsNotFound();
            },
            trackPage: function(url){
                if (_gaq)
                    _gaq.push(['_trackPageview', url]);
                else
                    this.analyticsNotFound();
            },
            trackEvent: function(category, action, label, value){
                if (_gaq)
                    _gaq.push(['_trackEvent', category, action, label, value]);
                else
                    this.analyticsNotFound();

            },
            analyticsNotFound: function(){
                if(this.debug) console.log("Tracking object not found.");
            }

        });
    });
