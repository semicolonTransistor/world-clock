const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin");
const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default;
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: "production",
    entry: {
        index: './src/index.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
          title: 'Output Management',
        }),
        new CopyPlugin({
            patterns: [
                { from: "static", to: "." },
            ],
        }),
        new StatoscopeWebpackPlugin(),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            { 
                test: /\.handlebars$/, 
                loader: "handlebars-loader" 
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
            }),
            new JsonMinimizerPlugin(),
        ],
    },
}