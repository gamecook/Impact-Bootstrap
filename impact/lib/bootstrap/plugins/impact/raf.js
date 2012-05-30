/**
 *  @raf.js
 *  @version: 1.00
 *  @author: Dominic Szablewski & Modified by Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  This plugin adds support for using requestAnimationFrame in browsers
 *  that support it or falls back to using setTimeout on older browsers.
 *  This plugin is critical for building Win 8 games where there is
 *  significant performance improvements in IE 10 by using
 *  requestAnimationFrame
 *
 */

ig.module(
    'bootstrap.plugins.impact.raf'
)
    .requires(
    'impact.system'
)
    .defines(function ()
    {

        (function ()
        {
            var lastTime = 0;
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x)
            {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame =
                    window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
            }
            console.log("window.requestAnimationFrame", window.requestAnimationFrame);
            if (!window.requestAnimationFrame)
                window.requestAnimationFrame = function (callback, element)
                {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var id = window.setTimeout(function ()
                        {
                            callback(currTime + timeToCall);
                        },
                        timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };

            if (!window.cancelAnimationFrame)
                window.cancelAnimationFrame = function (id)
                {
                    clearTimeout(id);
                };
        }());

        ig.System.inject({
            nextFrameRequested:false,

            stopRunLoop:function ()
            {
                //~ clearInterval( this.intervalId );
                this.running = false;
            },


            startRunLoop:function ()
            {
                //~ this.stopRunLoop();
                //~ this.intervalId = setInterval( this.run.bind(this), 1000 / this.fps );
                if (!this.nextFrameRequested)
                {
                    this.runBound = this.run.bind(this);
                    this.nextFrameRequested = true;
                    window.requestAnimationFrame(this.runBound);
                }
                this.running = true;
            },

            run:function ()
            {
                if (this.running)
                {
                    this.nextFrameRequested = true;
                    window.requestAnimationFrame(this.runBound);
                }
                else
                {
                    this.nextFrameRequested = false;
                    return;
                }

                ig.Timer.step();
                this.tick = this.clock.tick();

                this.delegate.run();
                ig.input.clearPressed();

                if (this.newGameClass)
                {
                    this.setGameNow(this.newGameClass);
                    this.newGameClass = null;
                }
            }
        });

    });