/**
 *  @base-player.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */

ig.module(
    'bootstrap.entities.base-player'
)
    .requires(
    'bootstrap.entities.base-actor'
)
    .defines(function ()
    {
        EntityBasePlayer = EntityBaseActor.extend({
            _wmIgnore: true,
            name: "player",
            maxVel:{x:100, y:150},
            friction:{x:600, y:20},
            accelGround:400,
            accelAir:100,
            jump:200,
            type:ig.Entity.TYPE.A,
            checkAgainst:ig.Entity.TYPE.NONE,
            collides:ig.Entity.COLLIDES.ACTIVE,
            bloodColorOffset:0, // By default this is set to 0
            update:function ()
            {
                // move left or right
                if (this.visible)
                {
                    this.onVisibleUpdate();
                }

                // move!
                this.parent();
            },
            onVisibleUpdate: function()
            {
                //Reset acceleration X
                this.accel.x = 0;
                this.accel.y = 0;

                // Handle input
                if (!this.states)
                {
                    this.states = [
                        {state:"actions", method:"Down"},
                        {state:"presses", method:"Pressed"},
                        {state:"delayedKeyup", method:"Released"}
                    ];

                    this.totalStates = this.states.length;
                }

                // Loop through input states and call action handlers
                for (var action in ig.input.actions)
                {
                    for (var i = 0; i < this.totalStates; i++)
                    {
                        var state = this.states[i].state;
                        var stateValue = ig.input[state][action];

                        if (stateValue)
                        {
                            this.onInputAction(action, this.states[i].method);
                        }
                    }
                }

                this.currentAnim.flip.x = this.flip;
            },
            updateAnimation:function ()
            {
                //Replace with logic to set the correct animation
            },
            onInputAction:function (value, method)
            {
                var actionMethodName = value + method;
                if (actionMethodName in this)
                    this[actionMethodName]();
            },
            onKill:function ()
            {
                ig.game.onPlayerDeath();
            },
            receiveDamage:function (value, from)
            {
                this.parent(value, from);
                if(!this.invincible)
                    this.makeInvincible();
            }
        });

        ig.Game.inject({
            player:null,
            loadLevel: function(data)
            {
                this.parent(data);
                this.player = this.getEntityByName("player");
                this.player.makeInvincible();
            },
            onPlayerDeath: function()
            {
                // Override this in your game class to handle death of the player
            }

        })

    });
