let buttonStyle = new Style({font: '22px', color: 'white'});
let textStyle = new Style({font: 'bold 50px', color: 'white'});

let whiteSkin = new Skin({fill: 'white'});
let blueSkin = new Skin({fill: 'blue'});
let backgroundSkin = new Skin({fill: ["#202020", "#7DBF2E"]});


var Pins = require("pins");

class AppBehavior extends Behavior{
	onLaunch(application){
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
				require: "Digital",
				pins: {
					digital: {pin: 51, direction: "output"},
					ground: {pin: 52, type: "Ground"},
				}
			}
		}, success => {
			if (success){
				trace("Configured pins.\n");
				Pins.share("ws", {
					zeroconf: true,
					name: "pins-share-led"
				});
			}
			else trace("Failed to configure pins.\n");
		});
	}
}
application.behavior = new AppBehavior();

let MainContainer = Container.template($ => ({
	top: 0, bottom: 0, left: 0, right: 0,
	active: true, skin: backgroundSkin, state: 0,
	contents: [
		Label($, {name: "statusString", 
			top: 0, bottom: 0, left: 0, right: 0,
			style: textStyle, string: "OFF"}),
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
		}
	}
}));
var main = new MainContainer({string: "Ready!", backgroundColor: "#7DBF2E"});
application.add(main);
