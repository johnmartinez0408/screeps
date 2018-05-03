
var claimerFactory = {
    
    run: function(spawn, targetRoom){

    	var workCost = 100;
        var moveCost = 50;
        var carryCost = 50;
        var claimCost = 600;

        var energyInRoom = spawn.room.energyAvailable;

    	var attributes =[MOVE, CLAIM]
    	var prices = [moveCost, claimCost]
    	var totalPrice = 0;
    	for(var i=0; i<prices.length; i++){totalPrice += prices[i];}

    	 if(!spawn.spawning && energyInRoom >= totalPrice){
    	 	var newName = "claimer" + Game.time;
    	 	console.log('Spawning new claimer: ' + newName + " -- level: " + totalPrice/10)
            attributes.sort();
            console.log('attributes: ' + attributes)
    	 	var claimerCount = spawn.room.find(FIND_CREEPS, 
				{filter: (creep) => {  return (creep.memory.class == "claimer"); }}).length;
    	 	spawn.spawnCreep(attributes, newName,
            {memory: {class: 'claimer', level: totalPrice/10, targetRoom: targetRoom}});
            console.log("previous claimer count: " + (claimerCount));
            console.log("==============|");
    	 }
    }

}

module.exports = claimerFactory;
