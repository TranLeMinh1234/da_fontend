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
    parseDateJsToString(time)
    {
        if(!time)
            return null;
        
        if(typeof time == 'string')
        {
            time = this.parseStringServerToDate(time);
        }

        return `${time.getDate() < 10? '0' + time.getDate() : time.getDate()}/${time.getMonth()+1 < 10? '0' + time.getMonth()+1 : time.getMonth()+1}/${time.getFullYear()}`;
    },
    parseDateTimeJsToString(time)
    {
        if(!time)
            return null;
        
        if(typeof time == 'string')
        {
            time = this.parseStringServerToDate(time);
        }

        return `${time.getDate() < 10? '0' + time.getDate() : time.getDate()}/${time.getMonth()+1 < 10? '0' + time.getMonth()+1 : time.getMonth()+1}/${time.getFullYear()} ${time.getHours() < 10 ? '0' + time.getHours() : time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}`;
    },
    parseDateTimeJsToTimeString(time)
    {
        if(!time)
            return null;
        
        if(typeof time == 'string')
        {
            time = this.parseStringServerToDate(time);
        }

        return `${time.getHours() < 10 ? '0' + time.getHours() : time.getHours()}:${time.getMinutes() < 10? '0' + time.getMinutes() : time.getMinutes()}`;
    },
    parseDateToStringDateServer(date)
    {
        if(!date)
            return null;
        if(typeof date == 'string')
        {
            date = this.parseStringServerToDate(date);
        }
        return `${date.getFullYear()}-${date.getMonth()+1 < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1}-${date.getDate() < 10 ? '0'+date.getDate():date.getDate()}T${date.getHours() < 10? '0'+date.getHours(): date.getHours()}:${date.getMinutes() < 10? '0'+date.getMinutes(): date.getMinutes()}:${date.getSeconds() < 10? '0'+date.getSeconds(): date.getSeconds()}`
    },
    capitalizeFirstLetter(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    }
};

export var commonFunction;