//Creates creeps with various amounts of work and carry capacities
var workerFactory = {
    


    run: function(spawn, workerCount, maxWorkers){

    	var newName = "Worker" + Game.time;
    	var workerMaxLevel = Math.trunc(spawn.room.energyCapacityAvailable /10);
        var energyInRoom = Math.trunc(spawn.room.energyAvailable /10);
        var workCost = 10;
        var moveCost = 5;
        var carryCost = 5;

        //Ensure we aren't already spawning a creep and that we have a minimum of 300 energy
        if(!spawn.spawning){
            // console.log('need to spawn another')
            // console.log("workerCount: " + workerCount)
        	//If there is already at least 1 Worker
        	if(workerCount>0){
                //If we have enough energy to make the biggest possible worker
                // console.log(energyInRoom + "==" +  workerMaxLevel)
                // console.log("\t" + energyInRoom == workerMaxLevel);
        		if(energyInRoom == workerMaxLevel){
                    // console.log("have enough energy to spawn.")
                    var attributes =[MOVE, CARRY, WORK]
                    var prices = [moveCost, carryCost, workCost]
                    var totalPrice = 0;
                    for(var i=0; i<prices.length; i++){totalPrice += prices[i];}
                   
                    var enhancedAttributes = [WORK, MOVE, CARRY ]
                    var enhancedAttributesPrices = [workCost, moveCost, carryCost]
        			var canEnhance = true;
                    var i =0;
                    // console.log("\t\t" +"|==============");
                    // console.log("\t\t" +"total price: "+ totalPrice);
                    // console.log("\t\t" +"max level: " + workerMaxLevel);
                    while((totalPrice < workerMaxLevel) && canEnhance){
                        canEnhance = false;
                        //Check if we can add next attribute in list
                        if(totalPrice + enhancedAttributesPrices[i] <=workerMaxLevel){
                            // console.log("\t\t\t" +"can add: " + enhancedAttributes[i])
                            // console.log('adding enhancement: ' + i + enhancedAttributes[i]);
                            attributes.push(enhancedAttributes[i]);
                            totalPrice += enhancedAttributesPrices[i];
                            canEnhance = true;
                            // console.log("total price: "+ totalPrice);
                            // console.log("1enhance? : " + (totalPrice < workerMaxLevel && canEnhance));
                        }else{ //Else check if we can add any other attribute
                            // console.log("\t\t\t" +"too expensive to add enhancement, checking for cheaper ones")
                            // console.log("total price: "+ totalPrice);
                            // console.log("can enhance: "+ canEnhance);

                            // Iterate through possible attributes to add and add one if possible
                            for(var j=0; j< enhancedAttributes.length; j++){
                                 if(totalPrice + enhancedAttributesPrices[j] <=workerMaxLevel){
                                    attributes.push(enhancedAttributes[j]);
                                    totalPrice += enhancedAttributesPrices[j];
                                    canEnhance = true;
                                    break; 
                                 }
                            }
                        }

                        i++;
                        if(i>enhancedAttributes.length-1){i=0;}
                        // console.log('next enhancement: ' + enhancedAttributes[i] + ' - index : ' + i);
                        // console.log('final can enhance:'+ canEnhance);
                        // console.log(attributes);

                    }
                    console.log(spawn.name);
                    console.log('Spawning new worker: ' + newName + " -- level: " + totalPrice)
                    attributes.sort();
                    console.log('attributes: ' + attributes)
                    spawn.spawnCreep(attributes, newName,
                    {memory: {class: 'worker', role : null,  level: totalPrice, needResources : false, mineLocation: Math.floor(Math.random() * 2)}});
                    console.log("old worker count: " + workerCount);
                    console.log("==============|");
        		}
        	}else{ //Else make simple worker
                newName = "Simple"+newName;
        		// console.log('Spawning new simple worker: ' + newName + " -- level: 3 - Simple Worker");
          //       console.log(workerCount);
                spawn.spawnCreep([WORK, CARRY, MOVE],
                {memory: {class: 'worker', level: "3 - Simple Worker", color: '#800080', mineLocation:0}});
        	}
        }
    }
}

module.exports = workerFactory;