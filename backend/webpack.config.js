const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
    entry: './src/index.ts',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: ['node_modules']
    },
    plugins: [
        new Dotenv()
    ],
    module: {
        rules: [
            {
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    }
}