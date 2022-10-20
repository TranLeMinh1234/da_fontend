import { createApp } from 'vue'
import DialogNotification from '../../components/commonComponent/DialogNotification.vue';

var commonFunction = {
    isNumeric: (str) => {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
                !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    },
    showNotification(contentObject, typeNotification)
    {
        let mountEl = document.querySelector('#modal');
        if(!mountEl)
        {
            mountEl = document.createElement('div');
            document.body.appendChild(mountEl);    
        }
        var newDialog = createApp(DialogNotification,
            {
                propsData: {
                    content: contentObject,
                    typeNotification: typeNotification
                }
            }
        );
        newDialog.mount(mountEl);
    },
    parseStringServerToDate(time)
    {
        if(!time)
            return null;
        return new Date(Date.parse(time));
    },
    parseDateToStringDateServer(date)
    {
        if(!date)
            return null;
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}T${date.getHours() < 10? '0'+date.getHours(): date.getHours()}:${date.getMinutes() < 10? '0'+date.getMinutes(): date.getMinutes()}:${date.getSeconds() < 10? '0'+date.getSeconds(): date.getSeconds()}`
    }
};

export var commonFunction;