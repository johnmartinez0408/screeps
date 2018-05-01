var workerRetrieverBehavior = {

	run: function(creep){

		//Deposit gathered resources
		var targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
		filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION ||
				structure.structureType == STRUCTURE_SPAWN) 
				&& structure.energy < structure.energyCapacity;}
		});
		if(targets) {
				if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets, {visualizePathStyle: {stroke: creep.memory.color}});
				}
		}else{
			creep.moveTo(idleArea[0],idleArea[1], {visualizePathStyle: {stroke: idleColor}});
		}
	}
}


module.exports = workerRetrieverBehavior;