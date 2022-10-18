<template>

    <teleport to='body'>
        <div 
            :class="['dropdown', isShowDropDown? '': 'd-none']"
            :style="{
                width: configDropDown?.width + 'px',
                height: configDropDown?.height + 'px',
                top: displayY,
                left: displayX,
            }"
        >
            <div :class="['arrow-droprown ','arrow-' + configDropDown?.directArrow]"></div>
            <slot></slot>
        </div>
    </teleport>
</template>

<script>
export default {
    name: "DropDown",
    emits: ["hideDropDown"],
    created(){},
    mounted(){
        let me = this;

        //init hide click outside dropdown
        document.addEventListener('click', (event)=>{
            if((!me.$el.contains(event.target) && !me.elementUseDropDown?.contains(event.target)) && me.isShowDropDown == true)
            {
                me.$emit('hideDropDown');
            }
        });
    },
    props: {
        configDropDown: {
            type: Object,
            default: function(rawProps)
            {
                
                return rawProps.configDropDown != null && rawProps.configDropDown != undefined ? rawProps.configDropDown: 
                {
                    width: 200,
                    height: 200,
                    positionXShow: 50,
                    positionYShow: 50,
                    directArrow: 'top',
                };
            }
        },
        isShowDropDown: 
        {
            type: Boolean,
            default: false
        },
        elementUseDropDown:
        {
            type: Object,
            default: function(rawProps)
            {
                return rawProps.elementUseDropDown;
            }
        },
        isHaveArrow:
        {
            type: Boolean,
            default: true
        }
    },
    watch:{
    },
    computed: {
        displayX()
        {
            let me = this;
            let result = 0;
            if(!me.configDropDown)
                return result;

            if(me.configDropDown.directArrow.includes('top'))
            {
                result = me.configDropDown.positionXShow - me.configDropDown.width/2;
            }
            else if(me.configDropDown.directArrow.includes('bottom'))
            {
                result = me.configDropDown.positionXShow - me.configDropDown.width/2;
            }
            else if(me.configDropDown.directArrow.includes('left'))
            {
                result = me.configDropDown.positionXShow + 40;
            }
            //right
            else
            {
                result = me.configDropDown.positionXShow - me.configDropDown.width - 36;
            }
            return result + 'px';
        },
        displayY()
        {
            let me = this;
            let result = 0;
            if(!me.configDropDown)
                return result;
            if(me.configDropDown.directArrow.includes('top'))
            {
                result = me.configDropDown.positionYShow + 28;
            }
            else if(me.configDropDown.directArrow.includes('bottom'))
            {
                result = me.configDropDown.positionYShow - me.configDropDown.height - 28;
            }
            else if(me.configDropDown.directArrow.includes('left'))
            {
                result = me.configDropDown.positionYShow - me.configDropDown.height/2;
            }
            //right
            else
            {
                result = me.configDropDown.positionYShow - me.configDropDown.height/2;
            }
            return result + 'px';
        }
    },
    methods:
    {
        
    }
}
</script>

<style scoped>
@import url('../../assets/css/componentCommon/DropDown.css');
</style>