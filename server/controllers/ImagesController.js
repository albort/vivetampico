var os = require('os');
var flow = require('../../flow-node.js')(os.tmpdir() + '/uploads');;
var fs = require('fs');

var uploadFlowDir = os.tmpdir();

var ACCESS_CONTROLL_ALLOW_ORIGIN = false;

module.exports.postImage = function(req, res){
	flow.post(req, function(status, filename, original_filename, identifier) {
	    console.log('POST', status, original_filename, identifier);
	    console.log(status);
	    if (status == 'done') {
	      	// Assemble Chunks
	      	var stream = fs.createWriteStream(uploadFlowDir + '/' + filename);
	      	flow.write(identifier, stream,{
	          	onDone: console.log('File reassembled')
	        });
			// Clean chunks after the file is assembled 
			// TO DO: put in callbacks because it deletes files before assembling
			//flow.clean(identifier);
	    }
	 
	    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
	      	res.header("Access-Control-Allow-Origin", "*");
	    }
	    res.status(200).send();
  	});
};

module.exports.options = function(req, res){
  	console.log('OPTIONS');
  	if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
    	res.header("Access-Control-Allow-Origin", "*");
  	}
  	res.status(200).send();
};

module.exports.getImage = function(req, res) {
  	flow.get(req, function(status, filename, original_filename, identifier) {
    	console.log('GET', status);
    	if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      		res.header("Access-Control-Allow-Origin", "*");
    	}

    	if (status == 'found') {
      		status = 200;
    	} else {
      		status = 204;
    	}

    	res.status(status).send();
  	});
};

module.exports.downloadImage = function(req, res) {
	flow.write(req.params.identifier, res);
};