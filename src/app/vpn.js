var request = require('request');

(function(App) {
	'use strict';

    function VPNClient() {
    	if (!(this instanceof VPNClient)) {
    		return new VPNClient();
    	}
    	this.connected = false;
    }

	// open the client
    VPNClient.prototype.launch = function() {
    	var vpnClient = gui.Window.open('https://client.vpn.ht/', {
        	position: 'center',
        	//frame: false,
        	focus: true,
        	toolbar: false,
        	resizable: false,
          	width: 500,
          	height: 500
        });
        vpnClient.on('loaded', function(){
            vpnClient.window.imReady(window);
        });
    };
	// look if vpn is connected on start
	// without having to check with the remote client
	VPNClient.prototype.isRunning = function() {
		var self = this;
		// we check if we have at least vpn user and pass
		// if we have it we can check if we are connected
		if (App.settings.vpnUsername && App.settings.vpnPassword) {
			this.getStatus(function(connected) {
				self.setVPNStatus(connected);
			})
		}
	}
	// used to hide in the titlebar
	VPNClient.prototype.isDisabled = function() {
		var disabled = App.settings.vpnDisabledPerm;
		if (disabled) {
			return true;
		} else {
			return false;
		}
	}

	VPNClient.prototype.getStatus = function(callback) {
		request({
	  		url: 'https://vpn.ht/status?json'
	  	}, function(error, response, body) {
			if (error) {
				callback(false);
			} else if (response.statusCode === 200) {
		      	body = JSON.parse(body);
		      	return callback(body.connected);
		    } else {
		      	return callback(false);
		    }
		});
	};

	// function exposed to the client as well
	VPNClient.prototype.setVPNClient = function(Client){
		window.App.VPN = Client;
	}
	VPNClient.prototype.setVPNStatus = function(connected) {
		this.connected = connected
		App.vent.trigger('movies:list');
	}

	// initialize VPN instance globally
	App.VPNClient = new VPNClient();

})(window.App);
