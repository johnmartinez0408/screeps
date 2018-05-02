var soldierBehavior = {

	run: function(creep, attackFlag, attackStructuresFlag, defendFlag){
		
		var attackMove = function(creep, target){
			if(creep.attack(target) ==  ERR_NOT_IN_RANGE) {
			    creep.moveTo(target);
			}
		}

        var regroup = function(creep){
        	if(creep.room.name == originRoom){
        		creep.moveTo(groupLocation[0], groupLocation[1]);
        	}	
        }

		var groupLocation= [17,12];
		var targetRoom = "E31N14"; //Room number to attack
		var invadeEntrancePoint = new RoomPosition(34, 34, targetRoom);
        var originRoom = "E31N13"; //Room to retreat to

        if(defendFlag.color == 1){//If defend flag is red, go defend
        	if(creep.room.name == originRoom){
        		// console.log("back home")
                var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            	if(closestHostile) {
	                if(creep.attack(closestHostile) ==  ERR_NOT_IN_RANGE) {
	                    creep.moveTo(closestHostile);
	                }
	            }else{
	            	regroup(creep);
	            }
            }else{ //If we are not in our origin room
                creep.moveTo(new RoomPosition(groupLocation[0], groupLocation[1], originRoom)); //Move to origin room
            }
        }else{ //We are not defending
        	//If it's white flag, not attacking
        	// console.log("attackFlag: "+attackFlag.color + " - "(attackFlag.color == 1));
			if(attackFlag.color == 10){ 
				regroup(creep);
			}else if(attackFlag.color == 1){ //If it's red flag, attacking
				if(creep.room.name == targetRoom){ //if we in our target room
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

				}else{ //We are not in our target room
					// console.log("moving to room");
					creep.moveTo(invadeEntrancePoint);
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