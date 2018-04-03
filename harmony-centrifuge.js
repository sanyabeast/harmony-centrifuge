"use strict";
define(["harmony", "file!centrifuge/centrifuge.js"], function(harmony, centrifugeSource){

    var Subscription = function(centrifuge, eventName, callback){
        this.centrifuge = centrifuge;
        this.eventName = eventName;
        this.callback = callback;
        this.subscriptionUID = this.centrifuge.harmony.util.genUID("sub-");
    };

    Subscription.prototype = {
        subscribe : function(){
            var harmony = this.centrifuge.harmony;
            var eventName = this.eventName;
            var callback = this.callback;

            harmony.run("harmony-centrifuge", function(data){
                if (self[data.subscriptionUID]){
                    self[data.subscriptionUID].subscribe();
                } else {
                    self[data.subscriptionUID] = self.connection.subscribe(data.eventName, data.callback);
                }
            }, {
                subscriptionUID : this.subscriptionUID,
                eventName : eventName,
                callback : harmony.callback(callback)
            });
        },
        unsubscribe : function(data){
            harmony.run("harmony-centrifuge", function(data){
                self[data.subscriptionUID].unsubscribe();
            }, {
                subscriptionUID : this.subscriptionUID
            })
        }
    };

    var Centrifuge = function(options){
        this.harmony = harmony;

        this.callbacks = {};

        harmony.eval("harmony-centrifuge", centrifugeSource);
        harmony.run("harmony-centrifuge", function(options){
            self.onEvent = function(data){
                post(data);
                // console.log(data);
            };

            var connection = self.connection = new self.Centrifuge(options);
            connection.on("disconnect", self.onEvent);
            connection.on("error", self.onEvent);
            connection.on("message", self.onEvent);
            connection.on("connect", self.onEvent);


        }, options);

        harmony.on("harmony-centrifuge", this.__onMessage.bind(this));
    };

    Centrifuge.prototype = {
        __onMessage : function(data){
            // console.log(data);
        },
        on : function(eventName, callback){
            harmony.run("harmony-centrifuge", function(data){
                self.connection.on(data.eventName, data.callback);
            }, {
                eventName : eventName,
                callback : this.harmony.callback(callback)
            });
        },
        subscribe : function(eventName, callback){
            var sub = new Subscription(this, eventName, callback);
            sub.subscribe();
            return sub;
        },
        connect : function(){
            harmony.run("harmony-centrifuge", function(){
                self.connection.connect();
            });
        },
        unsubscribe : function(){

        }
    };

    return Centrifuge;

});