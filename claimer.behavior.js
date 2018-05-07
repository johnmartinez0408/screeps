var claimerBehavior = {
    
    run: function(creep){
    	if(creep.fatigue > 0){
    		creep.say("tired"+creep.fatigue);
    	}
    	if(Game.rooms[creep.memory.targetRoom] && creep.pos.x < 49 && creep.pos.y <49){
	    	var controller = Game.rooms[creep.memory.targetRoom].controller;
	    	// console.log(controller.pos);
	    	// console.log(controller==null);
		    if(controller){
		    	// console.log("test");
		    	// console.log(creep.attackController(controller));
		    	// if(creep.attackController(controller) == ERR_NOT_IN_RANGE){
		    	// if(creep.reserveController(controller) == ERR_NOT_IN_RANGE){
                if(creep.claimController(controller) == ERR_NOT_IN_RANGE){
		   			creep.moveTo(controller,  {visualizePathStyle: {stroke: "0000ff"}});
		    	}
			}else{
				creep.say("no controller");
			}
    	}else{
    		// console.log("nope")
    		creep.moveTo(new RoomPosition(8,42, creep.memory.targetRoom));
    	}
    	
    	
    }
}

module.exports = claimerBehavior;