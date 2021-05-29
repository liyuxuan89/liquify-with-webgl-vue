module.exports = {
    devServer: {
        port: 8080
    },
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.glsl$/,
                    use: 'raw-loader'
                }
            ]
        }
    }
}
