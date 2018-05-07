var soldierBehavior = {

	run: function(creep, attackFlag, attackStructuresFlag, defendFlag){
		
		var soldierMoveColor = "#f0ff00"; //purple if moving
        var soldierAttackMoveColor = "ff0000"; //red if attack moving

		var attackMove = function(creep, target){
			if(creep.attack(target) ==  ERR_NOT_IN_RANGE) {
			    creep.moveTo(target, {visualizePathStyle: {stroke: soldierAttackMoveColor}});
			}
		}

		var rangedAttackMove = function(creep, target){
			if(creep.rangedAttack(target) ==  ERR_NOT_IN_RANGE) {
			    creep.moveTo(target, {visualizePathStyle: {stroke: soldierAttackMoveColor}});
			}
		}

        var regroup = function(creep){
        	// if(creep.room.name == originRoom){
        		creep.moveTo(groupLocation[0], groupLocation[1], {visualizePathStyle: {stroke: soldierMoveColor}});
        	// }	
        }

        
        var attackOverride = "5adeea0fbaf8e72a189f0895"; //id of entity to attack first
		var groupLocation= [35, 16];
		var groupOverride = null; //[20,20]
		var targetRoom = "E31N14"; //Room number to attack
		var invadeEntrancePoint = new RoomPosition(28, 20, targetRoom);
        var originRoom = "E31N13"; //Room to retreat to

        if(defendFlag.color == 1){//If defend flag is red, go defend
        	if(creep.room.name == originRoom){
        		// console.log("back home")
                var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            	if(closestHostile) {
	                if(creep.attack(closestHostile) ==  ERR_NOT_IN_RANGE) {
	                    creep.moveTo(closestHostile, {visualizePathStyle: {stroke: soldierMoveColor}});
	                }
	            }else{
	            	regroup(creep);
	            }
            }else{ //If we are not in our origin room
                creep.moveTo(new RoomPosition(groupLocation[0], groupLocation[1], originRoom), {visualizePathStyle: {stroke: soldierMoveColor}}); //Move to origin room
            }
        }else{ //We are not defending
        	//If it's white flag, not attacking
        	// console.log("attackFlag: "+attackFlag.color + " - "(attackFlag.color == 1));
        	var closestHostileTower = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
							{filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
				            });

			if(attackFlag.color == 10){ 
				var closestHostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
				if(closestHostileCreep){
					attackMove(creep, closestHostileCreep);
				}else{
					regroup(creep);
				}
			}else if(attackFlag.color == 1){ //If it's red flag, attacking
				if(creep.room.name == targetRoom){ //if we in our target room
					if(creep.memory.role == "archer"){
						var closestHostileTower = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
							{filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
				            });
						var closestHostileSpawn = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
							{filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
				            });
						var closestHostileStructure =  creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
						var closestHostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
						if(Game.getObjectById(attackOverride)){
							rangedAttackMove(creep, Game.getObjectById(attackOverride));
						}else{
							if(closestHostileCreep){
								rangedAttackMove(creep, closestHostileCreep)
							}
							else if(closestHostileTower){
								rangedAttackMove(creep, closestHostileTower)
							}else if(closestHostileSpawn){
								rangedAttackMove(creep, closestHostileSpawn)
							}else if(closestHostileStructure){
								rangedAttackMove(creep, closestHostileStructure)
							}
							else{
								regroup(creep);
							}
						}
					}
					if(Game.getObjectById(attackOverride)){
						attackMove(creep, Game.getObjectById(attackOverride));
					}
					else{ //Else we don't have an attack override
						// console.log("in enemy room");
						//Find hostiles of different types nearby
						var closestHostileTower = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
							{filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
				            });
						var closestHostileSpawn = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
							{filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
				            });
						var closestHostileStructure =  creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
						var closestHostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
						
						if(attackStructuresFlag.color == 1){ //If attack structures is red
							//Set attack priority for towers > spawns > structures > creeps
							if(closestHostileTower){
								attackMove(creep, closestHostileTower)
							}else if(closestHostileSpawn){
								attackMove(creep, closestHostileSpawn)
							}else if(closestHostileStructure){
								attackMove(creep, closestHostileStructure)
							}else if(closestHostileCreep){
								attackMove(creep, closestHostileCreep)
							}
							else{
								regroup(creep);
							}
						}else{
							// console.log("in my room");
							//Set attack priority for creeps > towers > spawns > structures
							if(closestHostileCreep){
								attackMove(creep, closestHostileCreep)
							}
							else if(closestHostileTower){
								attackMove(creep, closestHostileTower)
							}else if(closestHostileSpawn){
								attackMove(creep, closestHostileSpawn)
							}else if(closestHostileStructure){
								attackMove(creep, closestHostileStructure)
							}
							else{
								regroup(creep);
							}
						}
					}
				}else{ //We are not in our target room
					// console.log("moving to room");
					creep.moveTo(invadeEntrancePoint, {visualizePathStyle: {stroke: soldierMoveColor}});
				}
			}
			else{
				creep.say("flag color error");
				regroup(creep);
			}
        }

	}
}

module.exports =soldierBehavior;