// Reference: https://medium.com/@danilog1905/how-to-use-web-workers-with-react-create-app-and-not-ejecting-in-the-attempt-3718d2a1166b
module.exports = function override(config, env) {
    config.module.rules.push({
        test: /\.worker\.js$/,
        use: {loader: 'worker-loader'}
    })
    return config;
}
