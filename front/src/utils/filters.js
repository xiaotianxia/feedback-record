import Vue from 'vue';

Vue.filter('cutStr', (val, length) => {
    if (val && val.length > length) {
        return val.substr(0, length) + '...';
    }
    return val;
});