var zindexManage = {
    zindexComponent: [99],
    generateBiggestZindex: function()
    {
        var biggestNewZindex = this.zindexComponent[this.zindexComponent.length-1] + 1;
        this.zindexComponent.push(biggestNewZindex);
    },
    clearBiggestIndex()
    {
        this.zindexComponent.splice(this.zindexComponent.length-1,1);
    },
    getBiggestZindex: function()
    {
        return this.zindexComponent[this.zindexComponent.length-1];
    }
};

export var zindexManage;