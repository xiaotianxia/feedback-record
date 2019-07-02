'use strict';
const fs = require('fs');
const util = require('util');
const path = require('path');
const readFilePromise = util.promisify(fs.readFile);
const { array2CsvString } = require('../utils.js')

const Controller = require('@ali/egg').Controller;
const RES_ERROR = {
    status: 1,
    message: '抱歉出错了，请稍后再试-_-||'
}

class FeedbackController extends Controller {
    async home () {
        const { ctx } = this;
        ctx.response.type = 'html';
        let page = await readFilePromise(path.resolve(__dirname, '../public/index.html'));
        ctx.body = page;
    }

    async list () {
        const { ctx } = this;
        let query = ctx.query;
        for (let key in query) {
            if (query[key] === '') {
                delete query[key];
            } else if (!Number.isNaN(parseInt(query[key]))) {
                query[key] = parseInt(query[key]);
            }
        }
        
        const result = await ctx.service.feedback.find(query);
        if (Array.isArray(result.list)) {
            ctx.body = {
                data: result,
                status: 0,
                message: 'success'
            };
        } else {
            ctx.body = RES_ERROR;
        }
    }

    async checkNode () {
        const { ctx } = this;
        ctx.body =  'success';
    }

    async view () {
        const { ctx } = this;
        let query = {
            id: parseInt(ctx.query.id)
        };
        const result = await ctx.service.feedback.view(query);
        console.log(query);
        if (result) {
            ctx.body = {
                data: result,
                status: 0,
                message: 'success'
            };
        } else {
            ctx.body = RES_ERROR;
        }
    }

    async detail () {
        const { ctx } = this;
        let query = {
            id: parseInt(ctx.query.id)
        };
        const result = await ctx.service.feedback.detail(query);
        if (result.id) {
            ctx.body = {
                data: result,
                status: 0,
                message: 'success'
            };
        } else {
            ctx.body = RES_ERROR;
        }
    }

    async download () {
        const { ctx } = this;
        const query = ctx.request.body;
        const result = await ctx.service.feedback.find(query);
        
        if (Array.isArray(result.list)) {
            let list = result.list.map(item => {
                    return {
                        id: item.id,
                        type_name: item.type_name,
                        media_name: item.media_name,
                        word: item.word.replace(/[\r\n]/g, '↵'),
                        status_name: item.status_name,
                        submitter_name: item.submitter_name,
                        create_time: item.create_time,
                        sys_name: item.sys_name,
                        url: item.url
                    }
                }),
                columns = ['ID', '类型', '媒体类型', '描述', '状态', '提交者', '提交时间', '提交系统', '页面URL'];
            
            let csv = array2CsvString({
                data: list,
                columns: columns
            });

            const buffer = Buffer.from(csv, 'utf8');
            ctx.status = 200;
            ctx.body = buffer;
            ctx.set('Content-Type', 'text/csv;charset=utf-8');
            ctx.attachment(`export_${ new Date().getTime() }.csv`);
        } else {

        }
    }

    async add () {
        const { ctx } = this;
        const query = ctx.request.body;
        const result = await ctx.service.feedback.insertOne(query);
        if (result.affectedRows === 1) {
            ctx.body = {
                status: 0,
                message: 'success'
            };
        } else {
            ctx.body = RES_ERROR;
        }
    }

    async delete () {
        const { ctx } = this;
        const query = ctx.request.body;
        const result = await ctx.service.feedback.deleteOne(query);
        console.log(result);
        if (result.affectedRows === 1) {
            ctx.body = {
                status: 0,
                message: 'success'
            };
        } else {
            ctx.body = RES_ERROR;
        }
    }

    async resolve () {
        const { ctx } = this;
        let query = ctx.request.body;
        const result = await ctx.service.feedback.resolve(query);
        console.log(result);
        if (result.affectedRows === 1) {
            ctx.body = {
                status: 0,
                message: 'success'
            };
        } else {
            ctx.body = RES_ERROR;
        }
    }
}

module.exports = FeedbackController;
