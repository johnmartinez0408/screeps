/*
	worker.hauler

	This worker is meant for carrying energy from container where they were harvested to the 

	Parts: MOVE*5, CARRY*10 -- Still TBD

	Memory
	class: "worker"
	role: "hauler"
	level: buildCost /10
	container: the RoomPosition for the source container to pickup resources from
	home: the spawner where they were born
	buildTime: amount of time needed to spawn a replacement (3* number of body parts)
	hasResources: boolean flag used to toggle between getting resources and delivering resources
	deliverTarget: current target to deliver energy to. Used to avoid multiple haulers going to same targets
	color: stroke color for creep when moving

*/

var workerHauler = {

    run: function(creep, underAttack){

    	if(creep.memory.hasResources){
    		//Get closest tower
    		var tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;}
				});
    		//Get closest structure that needs energy
    		var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => {
				return (structure.structureType == STRUCTURE_EXTENSION 
					||structure.structureType == STRUCTURE_SPAWN 
					|| structure.structureType == STRUCTURE_TOWER
					) && structure.energy < structure.energyCapacity;}
				});
    		//Give resources to towers first if we are under attack
    		if(underAttack && tower){ 
    			if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(tower, {visualizePathStyle: {stroke: creep.memory.color}});
				}
    		}else if(target){ //Else we are not under attack, if we have a target
    			//Count creeps that are already taking resources to our target
 				var haulerWithTarget = creep.room.find(FIND_CREEPS, 
 					{filter: (creep) => {  return (creep.memory.role == "hauler") && (creep.memory.deliverTarget == target); }}).length;
    			if(haulerWithTarget){ // If our target is already taken
    				target = creep.room.storage;
					if(target){ //Transfer energy to storage if available
						if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { //Deposit energy into storage
							creep.moveTo(target, {visualizePathStyle: {stroke: creep.memory.color}});
						}
					}
    			}else{
    				creep.memory.deliverTarget = target;
    				//Transfer energy to target
    				if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: {stroke: creep.memory.color}});
					}
    			}
    			
    		}else{ // Else we are not under attack and we don't have a target
    			target = creep.room.storage;
				if(target){ //Transfer energy to storage if available
					if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { //Deposit energy into storage
						creep.moveTo(target, {visualizePathStyle: {stroke: creep.memory.color}});
					}
				}
                creep.memory.deliverTarget = null;
    		}
    		if(creep.carry.energy == 0){ //If we ran out of resources, update hasResources flag
    			creep.memory.hasResources = false;
                creep.memory.deliverTarget = null;
    		}

    	}else{ //Else, we don't have energy yet
    		//Withdraw as much energy as possible from container
            var containerObj = Game.getObjectById(creep.memory.container);
    		var spaceToCarry = creep.carryCapacity - creep.carry.energy;
			if(creep.withdraw(containerObj, RESOURCE_ENERGY, spaceToCarry) == ERR_NOT_IN_RANGE) {
				creep.moveTo(containerObj, {visualizePathStyle: {stroke: creep.memory.color}});
			}

    		if(creep.carry.energy == creep.carryCapacity){ //If have as many resources as we can carry
    			creep.memory.hasResources = true; //Update hasResources flag
    		}
    	}
    }
}

module.exports = workerHauler;