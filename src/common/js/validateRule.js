import { UNREF } from "@vue/compiler-core";

var validateRule = {
    validate: function(infoValidateComponent)
    {
        let lstRule = infoValidateComponent.rule?.split(';');
        if(lstRule?.length > 0)
        {
            for(let i = 0; i < lstRule.length; i++)
            {
                infoValidateComponent = this.executeValidate(lstRule[i],infoValidateComponent);
            }
        }
        return infoValidateComponent;
    },
    executeValidate: function(rule, infoValidateComponent)
    {
        switch(rule)
        {
            case 'required':
                infoValidateComponent.isValid = this.validateRequired(infoValidateComponent.valueValidate);
                if(!infoValidateComponent.isValid)
                {
                    infoValidateComponent.errorCode.push('errorRequired');
                    infoValidateComponent.messNotiError = infoValidateComponent.nameField + ' không được để trống!'
                }
                break;
            default:
                break;
        }
        return infoValidateComponent;
    },
    validateRequired: function required(valueValidate){
        return valueValidate !== null && valueValidate !== undefined && valueValidate !== "";
    }
};

export var validateRule;