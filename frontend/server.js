let config = require('./config/config-properties');
var http = require('http')
    ,app = require(config.configExpress);	

http.createServer(app).listen(3001, function() {
    console.log('Servidor estutando na porta: ' + this.address().port);
});
