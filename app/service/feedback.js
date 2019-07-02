const Service = require('@ali/egg').Service;
const dayjs = require('dayjs');
const Enum = require('../../enums.js');
const { value2LabelMap } = require('../utils.js'); 

class FeedbackService extends Service {
    async find (params) {
        const table_name = this.config.table_name;
        const queries = ['id', 'sys_name', 'type', 'type_name', 'media', 'media_name', 'status', 'status_name', 'word', 'submitter_name', 'create_time', 'url'];
        let { pageNo, pageSize } = params;
        delete params.pageNo;
        delete params.pageSize;
        let entries = Object.entries(params),
            whereSql = entries.length ? (` WHERE ` + entries.map(item => { return `${item[0]}=${typeof item[1] === 'string' ? "'" + item[1] + "'"   : item[1]}` }).join(' AND ')) : '',
            sql = `SELECT ${queries.join(', ')} FROM ${table_name}` + whereSql;
        sql += ` ORDER BY id DESC`;
        if (pageNo && pageNo) {
            sql += ` LIMIT ${(pageNo - 1) * pageSize},${pageSize}`;
        }
        let countSql = `SELECT COUNT(*) AS total FROM ${table_name}` + whereSql;
        let list = await this.app.mysql.query(sql);
        let count = await this.app.mysql.query(countSql);
        return {
            list,
            total: count[0].total
        };
    }

    async view (params) {
        const table_name = this.config.table_name;
        let result = await this.app.mysql.query(`SELECT data FROM ${table_name} WHERE id = ${params.id}`);
        return result[0];
    }

    async detail (params) {
        const table_name = this.config.table_name;
        let result = await this.app.mysql.get(table_name, { id: params.id});
        return result;
    }

    async insertOne (params) {
        const table_name = this.config.table_name;
        params.create_time = dayjs(new Date()).format('YYYY-MM-DD HH:mm');
        params.type_name = value2LabelMap(Enum.TYPE_NAME, params.type) || '';
        params.media_name = value2LabelMap(Enum.MEDIA_NAME, params.media) || '';
        params.status = 0;
        params.status_name = value2LabelMap(Enum.RESOLVE_STATUS_NAME, 0) || '';
        let result = await this.app.mysql.insert(table_name, params);
        return result;
    }

    async deleteOne (params) {
        const table_name = this.config.table_name;
        let result = await this.app.mysql.delete(table_name, {
            id: params.id
        });
        return result;
    }

    async resolve (params) {
        const table_name = this.config.table_name;
        let status_name = value2LabelMap(Enum.RESOLVE_STATUS_NAME, params.status) || '';
        let result = await this.app.mysql.update(table_name, {
            id: params.id,
            status: params.status,
            status_name
        });
        return result;
    }
}

module.exports = FeedbackService