module.exports = {
	productionSourceMap: false,
	css: {
		extract: true,
		sourceMap: true,
	},
	pluginOptions: {
		moment: {
			locales: ['zh-cn'],
		},
	},
	devServer: {
		host: '0.0.0.0',
		port: 8090,
	},
};
