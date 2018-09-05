var workerBehavior = {

	run: function(creep, harvestersCount, buildersCount, repairersCount){
		var harvesters = 5;
		var builders = 2;
		var repairers = 0;
		 
        var spawn = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN)
                }
            });

        var getMineLocation = function(spawn){
            var locationZeroCount = spawn.room.find(FIND_MY_CREEPS, 
                {filter: (creep) => {  return (creep.memory.mineLocation == 0); }
            }).length;
            var locationOneCount = spawn.room.find(FIND_MY_CREEPS, 
                {filter: (creep) => {  return (creep.memory.mineLocation == 1); }
            }).length;
            console.log(spawn.name);
            console.log("mineLoc 0 count: "+locationZeroCount +  " -- mineLoc 1 count: "+locationOneCount);
            if(locationZeroCount <= locationOneCount){
                return 0;
            }else{
                return 1;
            }
            console.log("new mineLoc 0 count: "+locationZeroCount +  " -- new mineLoc 1 count: "+locationOneCount);
        }
        
        if(spawn){
            spawn = spawn[0];
        }

		var idleArea = [10,14]

		var harvesterColor = "#ff0000"
		var builderColor = "#0000ff"
		var upgraderColor = "#00ff00"
		var repairerColor = "#29ffec"
		var idleColor = "#BF5FFF";

		var needResources;

		if(creep.fatigue > 0){
			creep.say("tired: " + creep.fatigue);
		}
		//Update needResources
		if(creep.memory.needResources && creep.carry.energy == creep.carryCapacity) {
			creep.memory.needResources = false; 
			if(creep.memory.role == "harvester"){
				creep.say('🐾 Deli');
			}else if(creep.memory.role == "builder"){
				creep.say('🚧 Buil');
			}else if(creep.memory.role == "upgrader"){
				creep.say('⚡ Upgr');
			}else if(creep.memory.role == "repairer"){
				creep.memory.spaceGiven = 0;
				if(creep.memory.mineLocation && creep.memory.mineLocation==0){
					creep.memory.mineLocation = 1;
				}else{
					creep.memory.mineLocation = 0;
				}
				creep.say("🔧 repa");
			}else {
				creep.say('👍 work');
			}
		}
		else if(!creep.memory.needResource && creep.carry.energy ==0){
			creep.memory.needResources = true; 
			// creep.say('🔄 H');
		}

		//If creep isn't at capacity in resources, go get more
		if(creep.memory.needResources){

			// var droppedEnergy =creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES , (d) => {return (d.resourceType == RESOURCE_ENERGY)})
			// if(droppedEnergy && creep.pos.getRangeTo(droppedEnergy)<=3){
			// 	creep.say("pickup...")
			// 	if(creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
	  //               creep.moveTo(droppedEnergy, {visualizePathStyle: {stroke: creep.memory.color}});
	  //           }
			// }else{
                creep.memory.spaceGiven = 0;
				var spaceToCarry = creep.carryCapacity - creep.carry.energy;
				var nearestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, 
					{filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER 
						&& structure.store.energy >= spaceToCarry);}
				});
				if(nearestContainer && false){
					if(creep.withdraw(nearestContainer, RESOURCE_ENERGY, spaceToCarry) == ERR_NOT_IN_RANGE) {
		                creep.moveTo(nearestContainer, {visualizePathStyle: {stroke: creep.memory.color}});
		            }
				}else{
					var sources = creep.room.find(FIND_SOURCES);
		            var sourceToMine = 0;
		            if(sources.length > 1 ){ //If there's more than 1 source to mine
						if(creep.memory.mineLocation == 1){ //mine first or second source depending on creep's ID
							sourceToMine = 1;
				        }else if(creep.memory.mineLocation != 0){
				        	console.log(spawn.name);
				        	console.log("No Mine Location for: " + creep);
				        }
		     	    }
					if(sources[sourceToMine].energy ==0){ //If your mine is empty, get energy from reserves
						// console.log("no resources")
						// console.log(creep.withdraw(creep.room.storage))
						var spaceToCarry = creep.carryCapacity - creep.carry.energy;
						if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY, spaceToCarry) == ERR_NOT_IN_RANGE) {
			                creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: creep.memory.color}});
			            }
					}else{
						if(creep.harvest(sources[sourceToMine]) == ERR_NOT_IN_RANGE) {
		                	creep.moveTo(sources[sourceToMine], {visualizePathStyle: {stroke: creep.memory.color}});
		            	}
					}
				}

				
			// }
			
		}



		else{ //Else go work, already have resources
			//If this worker has a role
			if(creep.memory.role){
				if(creep.memory.role == "harvester"){ //If this worker is a harvester
					//Deposit gathered resources
					var targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
						filter: (structure) => {
							return (structure.structureType == STRUCTURE_EXTENSION ||
								structure.structureType == STRUCTURE_SPAWN 
								|| structure.structureType == STRUCTURE_TOWER
								) 
								&& structure.energy < structure.energyCapacity;
							}
						});
					if(targets) {
						if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets, {visualizePathStyle: {stroke: creep.memory.color}});
						}
					}else{

						if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
							creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: creep.memory.color}});
						}
						
						//If no normal targets available, make storage the new target
						// targets = creep.room.storage;
						// if(targets){
						// 	if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { //Deposit energy into storage
						// 		creep.moveTo(targets, {visualizePathStyle: {stroke: creep.memory.color}});
						// 	}
						// }else{//If no available storage, move to idle area
						// 	creep.moveTo(idleArea[0],idleArea[1], {visualizePathStyle: {stroke: idleColor}});
						// }
					}
				}
				else if(creep.memory.role == "builder"){//If this worker is a builder
					if(harvestersCount == 0){
						console.log(spawn.name);
						console.log('harvesters: '+  harvestersCount);
						creep.memory.role = "harvester";
						creep.memory.color = harvesterColor;
						creep.memory.mineLocation = 1;
						creep.say("🐾 harvester")
					}else{
                        if(creep.memory.spaceGiven && creep.memory.spaceGiven >= 1){
    						var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    						if(targets) {
    							if(creep.build(targets) == ERR_NOT_IN_RANGE) {
    								creep.moveTo(targets, {visualizePathStyle: {stroke: creep.memory.color}});
    							}
    						}else{
    							// creep.moveTo(2,25);
    							creep.say('🍾 idle builder')
    							//Turn idle builder into upgrader
    							creep.memory.role = "upgrader";
    							creep.memory.color = upgraderColor;
    							creep.say("⚡ upgrader")
    						}
                        }else{
                            creep.moveTo(Game.spawns[creep.memory.spawn]);
                            if(creep.memory.spaceGiven){
                                creep.memory.spaceGiven = creep.memory.spaceGiven+1;
                            }else{
                                creep.memory.spaceGiven = 1;
                            }
                            
                        }
					}
					
				}else if(creep.memory.role == "repairer"){
					if(harvestersCount == 0){
						console.log(spawn.name);
						console.log('harvesters: '+  harvestersCount);
						creep.memory.role = "harvester";
						creep.memory.color = harvesterColor;
						creep.memory.mineLocation = 1;
						creep.say("🐾 harvester")
					}else{
						var towers = creep.room.find(FIND_STRUCTURES, {
							filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;}
						});
						if(towers && towers.length > 0) {
							if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
								creep.moveTo(towers[0], {visualizePathStyle: {stroke: creep.memory.color}});
							}
						}else{
							var closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
					            filter: (structure) => {return (structure.hits < structure.hitsMax) && (structure.hits<25000);}
					        });
					        if(closestDamagedStructure){
						        if(creep.memory.spaceGiven >= 1){
						        	if(creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE) {
							            creep.moveTo(closestDamagedStructure, {visualizePathStyle: {stroke: creep.memory.color}});
							        }
						        }else{
						        	creep.moveTo(spawn.pos);
						        	if(creep.memory.spaceGiven){
						        		creep.memory.spaceGiven++;
						        	}else{
						        		creep.memory.spaceGiven = 1;
						        	}
						        }
							}else{
								console.log(spawn.name);
                                console.log('previous builders: '+ buildersCount);
                                creep.memory.role = "builder";
                                creep.memory.color = builderColor;
                                creep.say("🚧 builder");
                                var location = getMineLocation(spawn);
                                creep.memory.mineLocation = location;
							}
						}	
					}
				}
				else{ //Else, must be upgrader
					if(harvestersCount == 0){
						console.log(spawn.name);
						console.log('harvesters: '+  harvestersCount);
						creep.memory.role = "harvester";
						creep.memory.color = harvesterColor;
						creep.memory.mineLocation = 1;
						creep.say("🐾 harvester")
					}else{
						if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
							creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: creep.memory.color}});
						}
					}
				}
			}else{ //Else, this worker must not have a role
				
				if(harvestersCount < harvesters){ //Check if harvesters are needed
					console.log(spawn.name);
					console.log('previous harvesters: '+  harvestersCount);
					creep.memory.role = "harvester";
					creep.memory.color = harvesterColor;
					var location = getMineLocation(spawn);
					creep.memory.mineLocation = location;
					creep.say("🐾 harvester");
				}else if(buildersCount < builders){ //Check if builders are needed
					console.log(spawn.name);
					console.log('previous builders: '+ buildersCount);
					creep.memory.role = "builder";
					creep.memory.color = builderColor;
					creep.say("🚧 builder");
					var location = getMineLocation(spawn);
					creep.memory.mineLocation = location;
				}else if(repairersCount < repairers){
					console.log(spawn.name);
					console.log('previous repairersCount: '+ repairersCount);
					creep.memory.role = "repairer";
					creep.memory.color = repairerColor;
					creep.say("🔧 repairer");
					var location = getMineLocation(spawn);
					creep.memory.mineLocation = location;
				}else{
					creep.memory.role = "upgrader";
					creep.memory.color = upgraderColor;
					creep.say("⚡ upgrader")
					var location = getMineLocation(spawn);
					creep.memory.mineLocation = location;
				}
			}
		}

		
		
	}


}

module.exports = workerBehavior;