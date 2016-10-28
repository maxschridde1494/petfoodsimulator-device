//DEVICE
let buttonStyle = new Style({font: '22px', color: 'white'});
let textStyle = new Style({font: 'bold 50px', color: 'white'});

let whiteSkin = new Skin({fill: 'white'});
let blueSkin = new Skin({fill: "#004489"});
let backgroundSkin = new Skin({fill: ["#202020", "#7DBF2E"]});


var Pins = require("pins");
var amountFoodEaten = 0;
var active = false;
let songTitle = "All Along the Watchtower";
let songArtist = "Jimi Hendrix";
var song;

Handler.bind("/respond", Behavior({
    onInvoke: function(handler, message){
        message.responseText = "You found me!";
        message.status = 200;    
    }
}));
Handler.bind("/updateUI", Behavior({
	onInvoke: function(handler, message){
		song = new Media({url: "assets/jimi.mp3",
		  width: 0, height: 0});
		application.add(song);
		song.start();
		application.main.maincol.statusString.string = "Feeding.";
		active = true;
		message.responseText = "Feeding";
		message.status = 200;
	}
}));
Handler.bind("/resetUI", Behavior({
	onInvoke: function(handler, message){
		song.stop();
		application.main.maincol.statusString.string = "OFF.";
		active = false;
		message.responseText = "OFF";
		message.status = 200;
	}
}));

class AppBehavior extends Behavior{
	onLaunch(application){
		application.shared = true;
		Pins.configure({
			button:{
				require: "Digital",
				pins: {
					digital: {pin: 53, direction: "input"},
					power: {pin: 54, voltage: 3.3, type: "Power"},
					ground: {pin: 55, type: "Ground"},
				}
			},
			led: {
				require: "ledBLL",
				pins: {
					led: {pin: 51, direction: "output"},
					ground: {pin: 52, type: "Ground"},
				}
			},
			analog: {
				require: "Analog",
				pins:{
					analog: {pin: 56, direction: "input"},
					power: {pin: 57, voltage: 3.3, type: "Power"},
					ground: {pin: 58, type: "Ground"},
				}
			}
		}, success => {
			if (success){
				trace("Configured pins.\n");
				Pins.share("ws", {
					zeroconf: true,
					name: "pins-share-led"
				});
				Pins.repeat("/analog/read", 10, function(result){
			   		if (amountFoodEaten != result && active == true){
			   			amountFoodEaten = result;
			   			application.main.maincol.amountEaten.string = String(Math.round(amountFoodEaten*100)) + "% Eaten";
			   		}
			   	});
			}
			else trace("Failed to configure pins.\n");
		});
	}
	onQuit(application){
		application.shared = false;
	}
}
application.behavior = new AppBehavior();

let MainContainer = Container.template($ => ({
	name: 'main', top: 0, bottom: 0, left: 0, right: 0,
	active: true, skin: blueSkin, state: 0,
	contents: [
		Column($, {
			name: 'maincol', top: 0, bottom: 0, left: 0, right: 0,
			contents: [
				Label($, {name: "statusString", 
					top: 0, bottom: 0, left: 0, right: 0,
					style: textStyle, string: "OFF"}),
				Label($, {
					name: "amountEaten",
					top: 0, bottom: 0, left: 0, right: 0,
					style: textStyle, string: String(amountFoodEaten) + "% Eaten"
				})
			]
		})
	],
	Behavior: class extends Behavior{
		onTouchBegan(container){
			container.state = 1;
			application.distribute("onToggleLight", 1);
		}
		onTouchEnded(container){
			container.state = 0;
			application.distribute("onToggleLight", 0);
		}
		onToggleLight(container, value){
			container.statusString.string = (value) ? "ON" : "OFF";
			Pins.invoke("/led/write", 1);
		}
	}
}));
var main = new MainContainer({string: "Ready!", backgroundColor: "#7DBF2E"});
application.add(main);
