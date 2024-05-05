module.exports = {
    presets: [
        [
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-flow',
            { targets: { node: 'current' } }],
        '@babel/preset-typescript',
    ],
    plugins: [
        'babel-plugin-styled-components',
        '@babel/plugin-proposal-class-properties',
    ]
};