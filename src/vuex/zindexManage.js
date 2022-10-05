var zindexManage = {
    state: {
        zindexComponent: [99]
    },
    mutations:{
        generateBiggestZindex(state)
        {
            var biggestNewZindex = state.zindexComponent[state.zindexComponent.length-1] + 1;
            state.zindexComponent.push(biggestNewZindex);
        },
        clearBiggestIndex(state)
        {
            state.zindexComponent.stopPropagation();
            state.zindexComponent.splice(state.zindexComponent.length-1,1);
        }
    },
    getters: {
        getBiggestZindex(state)
        {
            return state.zindexComponent[state.zindexComponent.length-1];
        }
    },
    actions: {
    }
};

export var zindexManage;