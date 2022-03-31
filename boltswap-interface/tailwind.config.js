module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.{html,ts}', './src/app/*.{html,ts}'],
    content: ['./src/**/*.{html,ts}', './node_modules/flowbite/**/*.js'],
    theme: {
        extend: {}
    },
    plugins: [require('flowbite/plugin')]
};
