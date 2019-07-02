import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const routes = [
    {
        path: '/',
        redirect: '/list'
    },

    {
        path: '/list',
        name: 'feedbackList',
        component: () => import(/* webpackChunkName: "list" */ '../components/FeedbackList')
    },
    
    {
        path: '/detail',
        name: 'feedbackDetail',
        component: () => import(/* webpackChunkName: "detail" */ '../components/FeedbackDetail')
    }
];

export default new Router({
    routes: routes,
    scrollBehavior() {
        return { x: 0, y: 0 }
    }
});
