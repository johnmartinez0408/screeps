/*
	worker.miner

	This worker is meant for harvesting resources from an energy source and dropping the energy into a container.
	A hauler should then carry the resources from the container to where they are needed

	Parts: MOVE, WORK*5

	Memory
	class: "worker"
	role: "miner"
	level: buildCost /10
	mine: the source to mine from
	home: the spawner where they were born
	buildTime: amount of time needed to spawn a replacement (3* number of body parts)
	color: stroke color for creep when moving

*/

var workerMiner = {
    
    run: function(creep){
    	
		if(creep.harvest(creep.memory.mine) == ERR_NOT_IN_RANGE){
			creep.moveTo(creep.memory.mine);
		}
	}

}

module.exports = workerFactory;