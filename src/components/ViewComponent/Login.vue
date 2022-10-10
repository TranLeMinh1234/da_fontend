<template>
    <div id="login" v-if="mode == enumMode.login">
        <Modal :configModal="{
            width: '400px',
            height: '400px',
            borderTop: true
        }">
            <div class="header-login d-flex center-items">
                <div class="file-icon app-icon"></div>
                <div class="txt-white fz-22 pd-l-16 txt-black fw-600">Công việc</div>
            </div>
            <div class="body-login">
                <div class="w-80 mg-auto">
                    <MInput nameField="Email" rule="required" v-model="dataLogin.email" placeholder="Nhập email"/>      
                    <MInput nameField="Mật khẩu" type="password" rule="required" v-model="dataLogin.passWord" placeholder="Nhập mật khẩu"/>      
                    <button class="btn btn-login w-100">Đăng nhập</button>
                    <div class="txt-al-center pd-t-16">
                        Chưa có tài khoản? <span class="fw-600 txt-blue c-poiter" @click="goRegister()">Đăng ký</span>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
    <div id="register" v-if="mode == enumMode.register">
        <Modal :configModal="{
            width: '900px',
            height: '660px',
            borderTop: true
        }">
            <div class="p-absolute file-icon arrow-back-icon back-login" @click="backLogin"></div>
            <div class="header-login d-flex center-items">
                <div class="file-icon app-icon"></div>
                <div class="txt-white fz-22 pd-l-16 txt-black fw-600">Công việc</div>
            </div>
            <BaseForm ref="formRegiter">
                <div class="body-register d-flex">
                    <div class="pd-l-24">
                        <input type="file" class="d-none" id="inp-avatar" accept="image/*">
                        <img src="../../assets/defaultAvatar.png" alt="" id="avatar-register" class="avatar c-poiter" @click="setAvatar($event)">
                    </div>
                    <div class="w-70 h-auto pd-l-16">
                        <div class="d-flex j-spread-around">
                            <div class="w-48">
                                <div class="line-register txt-silver">
                                    <div>Họ:</div>
                                    <MInput v-model="dataRegister.firstName" ref="inp1" placeholder="Nhập họ"/>
                                </div>
                                <div class="line-register txt-silver">
                                    <div>Số điện thoại cá nhân:</div>
                                    <MInput v-model="dataRegister.phoneNumber" ref="inp2" placeholder="Nhập số điện thoại cá nhân"/>
                                </div>
                            </div>
                            <div class="w-48">
                                <div class="line-register txt-silver">
                                    <div>Tên*:</div>
                                    <MInput rule="required" v-model="dataRegister.lastName" ref="inp3" placeholder="Nhập tên đệm, tên"/>
                                </div>
                                <div class="line-register txt-silver">
                                    <div>Ngày sinh:</div>
                                    <MInput v-model="dataRegister.dateOfBirth" ref="inp4" type="date" placeholder="Nhập tên đệm, tên" />
                                </div>
                            </div>
                        </div>
                        <div class="w-100">
                            <div class="line-register txt-silver mg-auto w-98">
                                <div>Email:</div>
                                <MInput rule="required" v-model="dataRegister.email" ref="inp6" placeholder="Nhập email" nameField="Email"/>
                            </div>
                            <div class="line-register txt-silver mg-auto w-98">
                                <div>Mật khẩu*:</div>
                                <MInput rule="required" v-model="dataRegister.passWord" ref="inp7" nameField="Mật khẩu" placeholder="Nhập mật khẩu" type="password"/>
                            </div>
                            <div class="line-register txt-silver mg-auto w-98">
                                <div>Nhắc lại mật khẩu*:</div>
                                <MInput rule="required" v-model="dataRegister.passWordRepeated" nameField="Mật khẩu nhắc lại" ref="inp8" placeholder="Nhập lại mật khẩu" type="password"/>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseForm>
            <div class="footer-register d-flex j-end al-center">
                <div class="w-88-2 d-flex j-end mg-auto">
                    <button class="btn btn-login" @click="executeRegister()">Đăng ký</button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import BaseForm from '../commonComponent/BaseForm.vue';
import Modal from '../commonComponent/Modal.vue';
import MInput from '../commonComponent/MInput.vue';
export default {
    name: 'Login',
    created()
    {
        let me = this;
        me.enumMode = {
            register: 2,
            login: 1
        }
    },
    components: {
        BaseForm,
        Modal,
        MInput
    },
    methods: {
        backLogin()
        {
            let me = this;
            me.mode = me.enumMode.login;
        },
        goRegister()
        {
            let me = this;
            me.mode = me.enumMode.register;
        },
        setAvatar(event)
        {
            let me = this;
            let inpAvatar = document.getElementById('inp-avatar');
            inpAvatar.onchange = function(eventChange)
            {
                me.formData = new FormData();
                for(let i = 0; i < inpAvatar.files.length; i++)
                {
                    let file = inpAvatar.files[i];
                    me.formData.append('formFiles', file);
                    document.querySelector('#avatar-register').src = window.URL.createObjectURL(file);
                }
            };
            inpAvatar.click();
        },
        executeRegister()
        {
            let me = this;
            me.$refs.formRegiter.$refsSlot = me.$refs;
            let validateResult = me.$refs.formRegiter.validate();
            if(validateResult)
            {
                 me.axios.post('https://localhost:44304/api/login/register',me.dataRegister)
                .then(res => {
                    if(res.data)
                    {
                        if(me.formData && me.formData.has('formFiles'))
                        {
                            me.formData.append('typeAttachment',1);
                            me.formData.append('attachmentId',res.data.data);
                            me.axios.post('https://localhost:44304/file/upload',me.formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }).then(resUpload => {console.log(resUpload)});
                        }
                    }
                });
            }
        }
    },
    data()
    {
        return {
            mode: 2,
            dataLogin: {
                email: '',
                passWord: ''
            },
            dataRegister: {
                userId: null,
                email: '',
                passWord: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                dateOfBirth: null,
                passWordRepeated: ''
            }
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/ViewComponent/Login.css');
</style>