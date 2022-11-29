import { createApp } from 'vue'
import DialogNotification from '../../components/commonComponent/DialogNotification.vue';
import {EnumTimeFilter} from '../js/Enum.js';

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
    },
    getDataTimeFilter()
    {
        return [
            {
                valueTime: EnumTimeFilter.CurrentWeek,
                titleTime: "Tuần này"
            },
            {
                valueTime: EnumTimeFilter.CurrentMonth,
                titleTime: "Tháng này"
            },
            {
                valueTime: EnumTimeFilter.Today,
                titleTime: "Hôm nay" 
            },
            {
                valueTime: EnumTimeFilter.BeforeMonth,
                titleTime: "Tháng trước" 
            },
            {
                valueTime: EnumTimeFilter.BeforeWeek,
                titleTime: "Tuần trước" 
            },
            {
                valueTime: EnumTimeFilter.NextWeek,
                titleTime: "Tuần sau" 
            },
            {
                valueTime: EnumTimeFilter.NextMonth,
                titleTime: "Tháng sau" 
            },
        ];
    },
    getDistanceTimeFilter(valueTime)
    {
        let dataReturn = {
            startTime: null,
            endTime: null
        };

        switch(valueTime)
        {
            case EnumTimeFilter.CurrentWeek:
                var curr = new Date(); // get current date
                var firstDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1)); // First day is the day of the month - the day of the week
                var lastDay = new Date(curr.setDate(firstDay.getDate() + 6)); // last day is the first day + 6

                firstDay.setHours(0, 0, 0);
                lastDay.setHours(23, 59, 59);
                dataReturn.startTime = firstDay;
                dataReturn.endTime = lastDay;
                break;
            case EnumTimeFilter.CurrentMonth:
                var date = new Date();
                var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

                firstDay.setHours(0, 0, 0);
                lastDay.setHours(23, 59, 59);
                dataReturn.startTime = firstDay;
                dataReturn.endTime = lastDay;
                break;
            case EnumTimeFilter.Today:
                var curr = new Date(); // get current date
                var firstDay = new Date(curr); // First day is the day of the month - the day of the week
                var lastDay = new Date(curr); // last day is the first day + 6

                firstDay.setHours(0, 0, 0);
                lastDay.setHours(23, 59, 59);
                dataReturn.startTime = firstDay;
                dataReturn.endTime = lastDay;
                break;
            case EnumTimeFilter.BeforeMonth:
                var date = new Date();
                var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
                var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

                firstDay.setHours(0, 0, 0);
                lastDay.setHours(23, 59, 59);
                dataReturn.startTime = firstDay;
                dataReturn.endTime = lastDay;
                break;
            case EnumTimeFilter.BeforeWeek:
                var curr = new Date(); // get current date
                var firstDay = new Date(curr.setDate(curr.getDate() - curr.getDay() - 6)); // First day is the day of the month - the day of the week
                var lastDay = new Date(curr.setDate(firstDay.getDate() + 6)); // last day is the first day + 6

                firstDay.setHours(0, 0, 0);
                lastDay.setHours(23, 59, 59);
                dataReturn.startTime = firstDay;
                dataReturn.endTime = lastDay;
                break;
            case EnumTimeFilter.NextWeek:
                var curr = new Date(); // get current date
                var firstDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + 8)); // First day is the day of the month - the day of the week
                var lastDay = new Date(curr.setDate(firstDay.getDate() + 6)); // last day is the first day + 6

                firstDay.setHours(0, 0, 0);
                lastDay.setHours(23, 59, 59);
                dataReturn.startTime = firstDay;
                dataReturn.endTime = lastDay;
                break;
            case EnumTimeFilter.NextMonth:
                var date = new Date();
                var firstDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
                var lastDay = new Date(date.getFullYear(), date.getMonth() + 2, 0);

                firstDay.setHours(0, 0, 0);
                lastDay.setHours(23, 59, 59);
                dataReturn.startTime = firstDay;
                dataReturn.endTime = lastDay;
                break;
            default: 
                break;
        }

        return dataReturn;
    }
};

export var commonFunction;