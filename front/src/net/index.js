import axios from 'axios';
import { Message} from 'element-ui';
import api from './api';
const config = require('./config');
const ERROR_MSG = '内部错误，请稍后再试';

axios.defaults.baseURL = config.server_url;

axios.interceptors.request.use(
    config => {
        // config.headers['x-csrf-token'] = cookieTool.get('csrfToken');
        return config;
    },
    error => {
        Message.error(error.message || ERROR_MSG);
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(response => {
    let data = response.data;
    if (data.status !== 0) {
        Message.error(data.message || ERROR_MSG);
    }
    return response;
}, error => {
    Message.error(error.message || ERROR_MSG);
    return Promise.reject(error);
});

export default {
    ...api
}