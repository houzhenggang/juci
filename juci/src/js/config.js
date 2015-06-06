//! Author: Martin K. Schröder <mkschreder.uk@gmail.com>

(function($juci){
	function JUCIConfig(){
		this.system = {}; 
		var defaults = {
			showlogin: true, 
			defaultuser: "admin", 
			wan_interface: "wan", 
			voice_interface: "wan", 
			iptv_interface: "wan"
		}; 
		Object.assign(this, defaults); 
	}
	JUCIConfig.prototype.$init = function(){
		var deferred = $.Deferred(); 
		var self = this; 
		console.log("Init CONFIG"); 
		
		UCI.sync(["juci", "boardpanel"]).done(function(){
			if(UCI.juci && UCI.juci.settings){
				console.log("Using settings from config/juci on router"); 
				Object.keys(UCI.juci.settings).map(function(k){
					var i = UCI.juci.settings[k]; 
					if(i.value !== undefined) self[k] = i.value; 
				}); 
				if(UCI.boardpanel && UCI.boardpanel.settings){
					var net = UCI.boardpanel.network; 
					if(net.internet.value) self["wan_interface"] = net.internet.value; 
					if(net.voice.value) self["voice_interface"] = net.voice.value; 
					if(net.iptv.value) self["iptv_interface"] = net.iptv.value; 
				}
				deferred.resolve(); 
			} else {
				loadJSON(); 
			}
		}).fail(function(){
			loadJSON(); 
		}); 
		function loadJSON(){
			$.get("/config.json", { format: "json" }).always(function(data){
				if(!data || data == undefined) throw new Error("Could not get config.json!"); 
				console.log("Using settings from config.json on router"); 
				Object.keys(data).map(function(k) { self[k] = data[k]; }); 
				deferred.resolve(); 
			}); 
		}
		
		return deferred.promise(); 
	}
	$juci.config = new JUCIConfig(); 
	
	JUCI.app.factory('$config', function(){
		return $juci.config; 
	}); 
})(JUCI); 
