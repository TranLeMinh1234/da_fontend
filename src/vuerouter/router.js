import Home from '../components/ViewComponent/Home.vue';
import Test from '../components/ViewComponent/Test.vue';
import Login from '../components/ViewComponent/Login.vue';
import DailyTask from '../components/ViewComponent/DailyTask.vue';
import Template from '../components/ViewComponent/Template.vue'
import DetailGroupTask from '../components/ViewComponent/DetailGroupTask.vue'
import { createRouter,createWebHistory} from 'vue-router';

var routes = [
    { 
        path: '/',
        component: Home,
        children: [
            {
                name: 'DailyTask',
                path: '/DailyTask',
                component: DailyTask
            },
            {
                name: 'Template',
                path: '/Template',
                component: Template
            },
            {
                name: 'DetailGroupTask',
                path: '/DetailGroupTask/:grouptaskid/:templateReferenceId/:typegrouptask/:taskdetailid',
                component: DetailGroupTask
            }
        ]
    },
    { path: '/Test', component: Test },
    { 
        name: 'Login',
        path: '/Login', 
        component: Login 
    },
];
  
// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
var router = createRouter(
    {
        // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
        history: createWebHistory(),
        routes, // short for `routes: routes`
    }
)

export var router;