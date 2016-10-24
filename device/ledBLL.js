//@module
/*
  Copyright 2011-2014 Marvell Semiconductor, Inc.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

var PinsSimulators = require("PinsSimulators");

exports.pins = {
    led: {type: "Digital", direction: "output"}
};

exports.configure = function() {
  this.pinsSimulator = shell.delegate("addSimulatorPart", {
    header : { 
      label : "Led", 
      name : "Digital Output", 
      iconVariant : PinsSimulators.SENSOR_LED
    },
    axes : [
      new PinsSimulators.DigitalOutputAxisDescription(
        {
          valueLabel : "Led",
          valueID : "ledValue",
          defaultControl: "BUTTON"
        }
      ),
    ]
  });
  this.state = -1;
}

exports.read = function() {
  this.state = this.pinsSimulator.delegate("getValue").ledValue;
  return this.state;        
}

exports.write = function(value){
    this.state = this.pinsSimulator.delegate("setValue", value);
}

// exports.loop = function(){
//   for (var i = 0; i < 5; i++){
//     this.led.write(1);
//     sensorUtils.mdelay( 500 ); //waits 500ms
//     this.led.write(0);
//     sensorUtils.mdelay( 500 ); //waits 500ms
//   }
// }

exports.close = function() {
	shell.delegate("removeSimulatorPart", this.pinsSimulator);
}