'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.feedback.home);
    // 用于兼容egg的心跳检查
    router.get('/check.node', controller.feedback.checkNode);
    router.get('/list', controller.feedback.list);
    router.get('/view', controller.feedback.view);
    router.get('/detail', controller.feedback.detail);
    router.get('/list/download', controller.feedback.download);
    
    router.post('/add', controller.feedback.add);
    router.post('/delete', controller.feedback.delete);
    router.post('/resolve', controller.feedback.resolve);
};
