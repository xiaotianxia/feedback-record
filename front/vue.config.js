module.exports = {
    publicPath: './',
    productionSourceMap: false,

    configureWebpack: {
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js'
            }
        }
    }
}