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
            <div 
                :class="['arrow-droprown ','arrow-' + configDropDown?.directArrow, 
                isHaveArrow == false? 'd-none':'']"
                :style="arrowPostion"
            ></div>
            <div class="content-dropdown" ref="rootDropDown">
                <slot></slot>
            </div>
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
            if((!me.$el?.contains(event.target) && 
                !me.elementUseDropDown?.contains(event.target)) && 
                !me.$refs.rootDropDown?.contains(event.target) &&
                me.isShowDropDown == true)
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
                    arrowPositionX: 0,
                    arrowPositionY: 0,
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
        arrowPostion(){
            let me = this;
            let result = {};
            if(!me.configDropDown)
                return result;
            if(me.configDropDown.directArrow?.includes('top'))
            {
                result = {
                    left: `calc(50% + ${me.configDropDown?.arrowPositionX}px)`,
                    top: `calc(-14px - ${me.configDropDown?.arrowPositionY}px)`
                }
            }
            else if(me.configDropDown.directArrow?.includes('bottom'))
            {
                result = {
                    left: `calc(50% + ${me.configDropDown?.arrowPositionX}px)`,
                    bottom: `calc(-48px + ${me.configDropDown?.arrowPositionY}px)`
                }
            }
            else if(me.configDropDown.directArrow?.includes('left'))
            {
                result = {
                    left: `calc(-14px + ${me.configDropDown?.arrowPositionX}px)`,
                    top: `calc(50% + ${me.configDropDown?.arrowPositionY}px)`
                }
            }
            //right
            else
            {
                result = {
                    left: `calc(-48px + ${me.configDropDown?.arrowPositionX}px)`,
                    top: `calc(50% + ${me.configDropDown?.arrowPositionY}px)`
                }
            }

            return result;
        },
        displayX()
        {
            let me = this;
            let result = 0;
            if(!me.configDropDown)
                return result;

            if(me.configDropDown.directArrow?.includes('top'))
            {
                result = me.configDropDown.positionXShow - me.configDropDown.width/2 - me.configDropDown.arrowPositionX;
            }
            else if(me.configDropDown.directArrow?.includes('bottom'))
            {
                result = me.configDropDown.positionXShow - me.configDropDown.width/2 - me.configDropDown.arrowPositionX;
            }
            else if(me.configDropDown.directArrow?.includes('left'))
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
            if(me.configDropDown.directArrow?.includes('top'))
            {
                result = me.configDropDown.positionYShow + 28;
            }
            else if(me.configDropDown.directArrow?.includes('bottom'))
            {
                result = me.configDropDown.positionYShow - me.configDropDown.height - 28;
            }
            else if(me.configDropDown.directArrow?.includes('left'))
            {
                result = me.configDropDown.positionYShow - me.configDropDown.height/2 - me.configDropDown.arrowPositionY;
            }
            //right
            else
            {
                result = me.configDropDown.positionYShow - me.configDropDown.height/2 - me.configDropDown.arrowPositionY;
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