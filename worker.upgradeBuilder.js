/*
	worker.upgradeBuilder

	This worker picks up energy from storage and uses it to upgrade the controller in a room

	Parts: MOVE*4, CARRY*6, WORK*2

	Memory
	class: "worker"
	role: "upgradeBuilder"
	level: buildCost /10
	home: the spawner where they were born
	buildTime: amount of time needed to spawn a replacement (3* number of body parts)
	color: stroke color for creep when moving
	hasResources: boolean flag used to toggle between getting resources and delivering resources

*/

var workerUpgradeBuilder = {
    
    run: function(creep){
        if(creep.memory.hasResources){ //If we have enough resources to continue working
            var constructionSite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
            if(constructionSite){ //If there are construction sites, go build the closest one
                if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
					creep.moveTo(constructionSite, {visualizePathStyle: {stroke: creep.memory.color}});
				}
            }else{ //Else, go upgrade controller
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) { //Upgrade controller
				    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: creep.memory.color}});
    			}
            }
            
        }else { //Else, we don't have resources, go get more energy
        	var spaceToCarry = creep.carryCapacity - creep.carry.energy;
        	var nearestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, 
				{filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER 
					&& structure.store.energy >= spaceToCarry);}
			});

        	if(creep.room.storage){ //If we have storage in this room
        		//Withdraw as much energy as possible from storage
	    		
				if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY, spaceToCarry) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.memory.container, {visualizePathStyle: {stroke: creep.memory.color}});
				}
        	}else if(creep.room.find(FIND_STRUCTURES)){ //Else if we have a container with enough energy
        		//Withdraw as much energy as possible from storage
				if(creep.withdraw(nearestContainer, RESOURCE_ENERGY, spaceToCarry) == ERR_NOT_IN_RANGE) {
		            creep.moveTo(nearestContainer, {visualizePathStyle: {stroke: creep.memory.color}});
		        }
        	}else{ //Else go mine
        		var source = var nearestContainer = creep.pos.findClosestByRange(FIND_SOURCES);
        		if(creep.harvest(source) == ERR_NOT_IN_RANGE){
        			creep.moveTo(source, {visualizePathStyle: {stroke: creep.memory.color}});
        		}
        	}

        }
    }
    
}


module.exports = workerUpgradeBuilder;