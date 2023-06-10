const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { HotModuleReplacementPlugin } = require("webpack");

module.exports = {
    entry: {
        index: path.resolve(__dirname, "src", "index.ts")
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public", "index.html")
        }),
        new HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(t|j)s?$/,
                include: [path.resolve('./src')],
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader'
                }]
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [{ loader: "url-loader" }]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
};