/**
 *  @tracking.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  This class is a wrapper for Google Analytics. Simply supply your tracking
 *  account id and call trackPage or trackEvent as needed. This plugin will
 *  also add the google tracking code to your HTML page for you automatically.
 */

ig.module(
    'bootstrap.plugins.impact.tracking'
)
    .requires(
)
    .defines(function ()
    {
        //TODO need to make this into a singleton
        Tracking = ig.Class.extend({
            debug:true,
            init:function (account)
            {
                if (_gaq)
                {
                    _gaq.push(['_trackPageview']);
                    if (account)
                        this.setAccount(account);
                }
                else
                {
                    this.analyticsNotFound();
                }
            },
            setAccount:function (account)
            {
                if (_gaq)
                    _gaq.push(['_setAccount', account]);
                else
                    this.analyticsNotFound();
            },
            trackPage:function (url)
            {
                if (_gaq)
                    _gaq.push(['_trackPageview', url]);
                else
                    this.analyticsNotFound();
            },
            trackEvent:function (category, action, label, value)
            {
                if (_gaq)
                    _gaq.push(['_trackEvent', category, action, label, value]);
                else
                    this.analyticsNotFound();

            },
            analyticsNotFound:function ()
            {
                if (this.debug) console.log("Tracking object not found.");
            }

        });

        // This sets up the Google Analytics code
        var _gaq = _gaq || [];

        (function ()
        {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();

    });
