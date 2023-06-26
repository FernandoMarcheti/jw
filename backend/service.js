var Service = require('node-windows').Service;
 
// Create a new service object
var svc = new Service({
  name:'backend',
  description: 'Backend service',
  script: 'C:\\sistema\\SCE\\backend\\server.js'
});
 
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
 
svc.install();