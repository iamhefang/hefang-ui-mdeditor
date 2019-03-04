import {Configuration} from "webpack";
import HtmlWebpackPlugin = require("html-webpack-plugin");
import * as path from "path";

const config: Configuration = {
    entry: {
        index: './index.tsx',
        example: './example.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js?v=[hash]',
        libraryTarget: "umd",
        umdNamedDefine: false
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /.*?\.tsx?$/i,
                use: 'ts-loader'
            },
            {
                test: /.*?\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    externals: {
        // 'react': {
        //     commonjs: 'react',
        //     commonjs2: 'react',
        //     amd: 'react',
        //     root: 'React'
        // },
        // 'react-dom': {
        //     commonjs: 'react-dom',
        //     commonjs2: 'react-dom',
        //     amd: 'react-dom',
        //     root: 'ReactDOM'
        // },
        // 'hefang-js': {
        //     commonjs: 'hefang-js',
        //     commonjs2: 'hefang-js',
        //     amd: 'hefang-js',
        //     root: 'H'
        // },
        // 'hefang-ui-react': {
        //     commonjs: 'hefang-ui-react',
        //     commonjs2: 'hefang-ui-react',
        //     amd: 'hefang-ui-react',
        //     root: 'HuiReact'
        // },
        // 'ace-builds': {
        //     commonjs: 'ace-builds',
        //     commonjs2: 'ace-builds',
        //     amd: 'ace-builds',
        //     root: 'ace'
        // }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: ['example'],
            inject: "body",
            minify: {
                collapseBooleanAttributes: true,
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                html5: true,
                minifyCSS: true,
                minifyJS: true
            },
            template: './index.html'
        })
    ]
};


function page(name: string, tsx: string = null, template: string = "./index.html") {
    config.entry[name] = tsx.indexOf("/") > -1 ? tsx : `./src/pages/${name}/${tsx}`;
    config.plugins.push(new HtmlWebpackPlugin({
        filename: `${name}.html`,
        chunks: [name],
        inject: "body",
        minify: {
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
            html5: true,
            minifyCSS: true,
            minifyJS: true
        },
        template
    }))
}

export default config;