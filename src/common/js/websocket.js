import { baseCallApi } from './BaseCallApi.js';

var webSocketManage = {
    webSocketConnector: null,
    startConnect: function(tokenAuthen){
        this.webSocketConnector = new WebSocket(`wss://localhost:44304?token=${tokenAuthen}`);
        this.initEventSocket();
    },
    initEventSocket: function()
    {
        let me = this;
        this.webSocketConnector.onopen = function (event) {
            me.eventOnOpen(event);
        };
        this.webSocketConnector.onclose = function (event) {
            me.eventOnClose(event);
        };
        this.webSocketConnector.onmessage = function (event) {
            me.eventOnMessage(event);
        };
    },
    eventOnMessage: function(event){
        
    },
    eventOnOpen: function(event){

    },
    eventOnClose: function(event){

    }   
}

export var webSocketManage;