import { createApp } from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue';
import App from './App.vue'
import { storeState } from './vuex/store.js'
import { commonFunction } from './common/js/commFunction.js';
import { zindexManage } from './common/js/zindexManage.js';
import { router } from './vuerouter/router.js';

//ckeditor

//axios
import axios from 'axios';
import VueAxios from 'vue-axios';

import {Toast,useToast} from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

const app = createApp(App);

// config libabry
// toast("Default toast");
// toast.info("Info toast");
// toast.success("Success toast");
// toast.error("Error toast");
// toast.warning("Warning toast");
// cần dùng thì inject["toast"]
const optionsToast = {
    position: "bottom-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
  };

var toast = useToast(optionsToast);

//loading config
// cach dung
// me.loader = me.$loading.show();
// setTimeout(()=>{me.loader.hide();},5000);
const optionsLoading = {
    canCancel: true, // default false
    color: 'white',
    loader: 'spinner',
    width: 64,
    height: 64,
    backgroundColor: '#5e5e5e',
    opacity: 0.5,
    zIndex: 999,

  };

app.use(CKEditor);

// config biến toàn cục
app.provide("toast",toast);

app.use(VueLoading,optionsLoading);

app.use(storeState);

app.use(router);

app.config.globalProperties.$commonFunction = commonFunction;
app.config.globalProperties.$zindexManage = zindexManage;

app.use(VueAxios, axios);

app.mount("#app");
