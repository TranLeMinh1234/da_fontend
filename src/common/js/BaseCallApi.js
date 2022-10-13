import axios from "axios";

class BaseCallApi{
    constructor()
    {
        this.doMain = 'https://localhost:44304';
    }

    Get(routeApi, data, option)
    {
        let buildQueryData = "?";
        for(var property in data)
        {
            buildQueryData+=`${property}=${data[property]}&`;
        }
        buildQueryData = buildQueryData.splice(buildQueryData.length-1,1);
        return axios.get(this.doMain + '/' + routeApi + buildQueryData, option);
    }

    Post(routeApi, data, option)
    {
        return axios.post(this.doMain + '/' + routeApi, data, option);
    }

    Put(routeApi, data, option)
    {
        return axios.put(this.doMain + '/' + routeApi, data, option);
    }

    Delete(routeApi, data, option)
    {
        let buildQueryData = "?";
        for(var property in data)
        {
            buildQueryData+=`${property}=${data[property]}&`;
        }
        buildQueryData = buildQueryData.splice(buildQueryData.length-1,1);
        return axios.delete(this.doMain + '/' + routeApi + buildQueryData,option);
    }
}

var baseCallApi = new BaseCallApi();

export var baseCallApi;
