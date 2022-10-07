import Home from '../components/ViewComponent/Home.vue';
import Test from '../components/ViewComponent/Test.vue';
import { createRouter,createWebHistory} from 'vue-router';

var routes = [
    { path: '/', component: Home },
    { path: '/Test', component: Test }
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