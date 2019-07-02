import axios from 'axios';

export default {
    add (params) {
        return axios.post('/add', params);
    },

    delete (params) {
        return axios.post('/delete', params);
    },

    resolve (params) {
        return axios.post('/resolve', params);
    },

    getList (params) {
        return axios.get('/list', {params});
    },

    view (params) {
        return axios.get('/view', { params });
    },

    getDetail (params) {
        return axios.get('/detail', { params });
    }
}