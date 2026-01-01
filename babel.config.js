module.exports = function (api) {
    api.cache(true);
    const plugins = [];

    return {
        presets: [
            [
                'babel-preset-expo',
                {
                    jsxImportSource: 'nativewind',
                    unstable_transformImportMeta: true, // fix for the Zustand import.meta error
                },
            ],
            'nativewind/babel',
        ],
        plugins,
    };
};
