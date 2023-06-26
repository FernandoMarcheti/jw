let config = {};

// dev
config.expressStatic = './public';
config.nodeModules = './node_modules';
config.schedule = './schedule';
config.configExpress = './config/express';

// prod
// config.expressStatic = 'C:\\sistema\\SCE\\frontend\\public';
// config.nodeModules = 'C:\\sistema\\SCE\\frontend\\node_modules';
// config.schedule = 'C:\\sistema\\SCE\\frontend\\schedule';
// config.configExpress = 'C:\\sistema\\SCE\\frontend\\config\\express';

module.exports = config;