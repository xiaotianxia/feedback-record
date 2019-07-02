exports.mysql = {
    // 单数据库信息配置
    client: {
        // host: "tddl.daily.alibaba.net",
        host: "localhost",
        // user: "FEEDBACKS_APP",
        user: "root",
        password: "123456",
        // database: "FEEDBACKS_APP",
        database: "dz",
        port: 3306,
        charset: 'utf8mb4'
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
};