import Vue from 'vue';
import App from './App.vue';
import router from './router';
import {
    Pagination,
    Dialog,
    Input,
    Radio,
    RadioGroup,
    Select,
    Option,
    Button,
    Table,
    TableColumn,
    Tooltip,
    Form,
    FormItem,
    Loading,
    MessageBox,
    Message,
    Notification
} from 'element-ui';
import net from './net';
import './utils/filters';

// rrweb-player style
import 'rrweb-player/dist/style.css';
// custom style
import './style/index.less';

Vue.use(Button);
Vue.use(Dialog);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tooltip);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Pagination);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Loading.directive);

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$notify = Notification;

Vue.config.productionTip = false;
Vue.prototype.$net = net;

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
