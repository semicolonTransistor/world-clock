const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin");
const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default;
const TerserPlugin = require('terser-webpack-plugin');
const LicensePlugin = require('webpack-license-plugin');

module.exports = {
    mode: "production",
    entry: {
        index: './src/index.js',
        settings: './src/settings.js',
        acknlowgements: './src/acknlowgements.js',
    },
    plugins: [

        new HtmlWebpackPlugin({
            title: 'World Clock',
            chunks: ['index'],
            filename: 'index.html',
            template: './src/index.html'
        }),
        new HtmlWebpackPlugin({
            title: 'Settings',
            chunks: ['settings'],
            filename: 'settings.html'
        }),
        new HtmlWebpackPlugin({
            title: 'Acknlowgements',
            chunks: ['acknlowgements'],
            filename: 'acknlowgements.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: "static", to: "." },
            ],
        }),
        new LicensePlugin(),
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
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            [require('babel-plugin-transform-imports'), {
                                'lodash': {
                                    "transform": "lodash/${member}",
                                    preventFullImport: true
                                }
                            }]
                        ]
                    }

                }
            },
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
        splitChunks: {
            chunks: 'all',
        },
    },
}