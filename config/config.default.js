/* eslint valid-jsdoc: "off" */
'use strict';
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const path = require('path');

module.exports = appInfo => {
    const config = exports = {};
    config.keys = appInfo.name + '_1557044217080_5912';

    config.middleware = [];

    // 允许跨域地址
    config.security = {
        csrf: false,
        domainWhiteList: [
            'http://localhost:808*'
        ]
    };

    config.cors = {
        origin: () => '*'
    }

    // 静态资源路径
    exports.static = {
        prefix: '/',
        dir: path.join(appInfo.baseDir, 'app/public'),
    };

    config.bodyParser = {
        jsonLimit: '20mb',
        formLimit: '6mb'
    }
    
    const userConfig = {
        myAppName: 'feedbackTool',
        table_name: 'feedbacks'
    };

    return {
        ...config,
        ...userConfig,
    };
};

