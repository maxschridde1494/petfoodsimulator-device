var PinsSimulators = require("PinsSimulators");

exports.pins = {
	analog: {type: "Analog", direction: "input"},
	power: {type: "Power"},
    ground: {type: "Ground"}
};

exports.configure = function(configuration, group)
{
    this.pinsSimulator = shell.delegate("addSimulatorPart", {
        header : { 
            label : group,
			// name : "Analog In. Pin " + this.analog.pin,
			name: "Analog Input",
            iconVariant : PinsSimulators.SENSOR_MODULE
        },
		axes : [
			new PinsSimulators.FloatAxisDescription(
				{
					ioType : "input",
					dataType : "float",
					valueLabel : "Percent",
					valueID : "value",
					minValue : 0,
					maxValue : 1,
					value : 0,
					speed : 1,
                    defaultControl: PinsSimulators.SLIDER
				}
			)
		]
    });
}

exports.close = function()
{
	shell.delegate("removeSimulatorPart", this.pinsSimulator);
}

exports.read = function()
{
	return this.pinsSimulator.delegate("getValue").value;
}

// exports.metadata = {
// 	sources: [
// 		{
// 			name: "read",
// 			result: { type: "Number", name: "value", defaultValue: 0, min: 0, max: 1, decimalPlaces: 3 },
// 		},
// 	]
// };
