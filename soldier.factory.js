var soldierFactory = {

	run: function(spawn, soldierClass){
		
		var newName = "Soldier" + Game.time;
    	var soldierMaxLevel = Math.trunc(spawn.room.energyCapacityAvailable);
        var energyInRoom = Math.trunc(spawn.room.energyAvailable);

        if(!spawn.spawning){
            //If enough energy or making emergency soldier
        	if(energyInRoom == soldierMaxLevel || (soldierClass=="emergencyWarrior" && energyInRoom>=300)){
    	    	var attackCost = 80;
    	        var moveCost = 50;
    	        var carryCost = 50;
    	        var healCost =	250;
    	    	var toughCost = 20;
    	    	var rangedAttackCost = 150;

    	    	var attributes =[MOVE];
    	    	var totalCost = moveCost;

    	    	var enhancedAttributes;
    	    	var enhancedAttributesCosts;

                if(soldierClass=="emergencyWarrior"){
                    enhancedAttributes = [ATTACK, ATTACK, MOVE];
                    enhancedAttributesCosts = [attackCost, attackCost, moveCost];
                }
                else if(soldierClass=="warrior"){
                    enhancedAttributes = [ATTACK, MOVE];
                    enhancedAttributesCosts = [attackCost, moveCost];
                }else if(soldierClass=="tank"){
                    attributes.push(ATTACK);
                    totalCost += attackCost;

                    enhancedAttributes = [TOUGH, MOVE,TOUGH,MOVE, MOVE]
                    enhancedAttributesCosts = [toughCost, moveCost]
                }
                console.log(totalCost)

                var canEnhance = true;
                var i =0;
                // console.log("cost: " + totalCost + " - Maxlvl: " + soldierMaxLevel)
                while((totalCost < energyInRoom) && canEnhance){
                	// console.log("cost: " + totalCost + " - Maxlvl: " + soldierMaxLevel)
                		    	//Set attributes for picked class
                    canEnhance = false;
                    //Check if we can add next attribute in list
                    if(totalCost + enhancedAttributesCosts[i] <=energyInRoom){
    	                attributes.push(enhancedAttributes[i]);
    	                totalCost += enhancedAttributesCosts[i];
    	                canEnhance = true;                           
                    }else{ //Else check if we can add any other attribute
    					// Iterate through possible attributes to add and add one if possible
                        for(var j=0; j< enhancedAttributes.length; j++){
                            if(totalCost + enhancedAttributesCosts[j] <=energyInRoom){
                            	attributes.push(enhancedAttributes[j]);
                                totalCost += enhancedAttributesCosts[j];
                                canEnhance = true;
                                break; 
                            }
                        }
                    }

                    i++;
                    if(i>enhancedAttributes.length-1){i=0;}

                } //End while loop
                console.log('Spawning new Soldier: ' + newName + " -- level: " + totalCost)
                attributes.sort();
                console.log('attributes: ' + attributes)
                try{
                	 spawn.spawnCreep(attributes, newName,
                        {memory: {class: 'soldier',level: totalCost, class: "soldier", role: soldierClass}});
                        var soldierCount = spawn.room.find(FIND_MY_CREEPS, 
     						{filter: (creep) => {  return (creep.memory.class == "soldier"); }}).length;
                        console.log("old soldier count: " + (soldierCount));
                        console.log("==============|");
                }
                catch(e){
                	console.log("error Spawning soldier: "+e);
                }
               

        	} //End if enough energy
        }
	} //End run
}

module.exports =soldierFactory;