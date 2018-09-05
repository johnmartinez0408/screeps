/*
	worker.miner

	This worker is meant for harvesting resources from an energy source and dropping the energy into a container.
	A hauler should then carry the resources from the container to where they are needed

	Parts: MOVE, WORK*5

	Memory
	class: "worker"
	role: "miner"
	level: buildCost /10
	mine: the ID of the source to mine from
    container: the ID of the container to drop resources into
	home: the spawner where they were born
	buildTime: amount of time needed to spawn a replacement (3* number of body parts)
	color: stroke color for creep when moving

*/

var workerMiner = {
    
    run: function(creep){
        // console.log("source: " + source);
        var mineObj = Game.getObjectById(creep.memory.mine);
        var containerObj = Game.getObjectById(creep.memory.container);
        if(containerObj){
            // console.log("have source");
            if(creep.harvest(creep.memory.mineObj) == ERR_NOT_IN_RANGE){
                creep.moveTo(creep.memory.containerObj);
            }
        }else{
            // console.log("no source");
            creep.moveTo(creep.memory.containerObj);
        }
		
	}

}

module.exports = workerMiner;