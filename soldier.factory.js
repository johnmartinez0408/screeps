var soldierFactory = {

	run: function(spawn, soldierClass){
		
		var newName = "Soldier" + Game.time;
    	var soldierMaxLevel = Math.trunc(spawn.room.energyCapacityAvailable /10);
        var energyInRoom = Math.trunc(spawn.room.energyAvailable /10);


    	if(energyInRoom == soldierMaxLevel){
	    	var attackCost = 8;
	        var moveCost = 5;
	        var carryCost = 5;
	        var healCost =	25;
	    	var toughCost = 1;
	    	var rangedAttackCost = 15;

	    	var attributes =[MOVE];
	    	var totalCost = moveCost;

	    	var enhancedAttributes;
	    	var enhancedAttributesCosts;

	    	//Set attributes for picked class
			if(soldierClass=="warrior"){
				enhancedAttributes = [ATTACK, TOUGH, TOUGH, MOVE];
           		enhancedAttributesCosts = [attackCost, toughCost, toughCost, moveCost];
			}else if(soldierClass=="tank"){
				attributes.push(ATTACK);
				enhancedAttributes = [TOUGH, TOUGH, TOUGH, MOVE, TOUGH]
           		enhancedAttributesCosts = [toughCost, toughCost, toughCost, moveCost, toughCost]
			}

            var canEnhance = true;
            var i =0;

            while((totalCost < soldierMaxLevel) && canEnhance){
                        console.log("spawning soldier...");
                        canEnhance = false;

                        //Check if we can add next attribute in list
                        if(totalCost + enhancedAttributesCosts[i] <=soldierMaxLevel){
                            console.log("\t\t" +"can add: " + enhancedAttributes[i])
                            // console.log('adding enhancement: ' + i + enhancedAttributes[i]);
                            attributes.push(enhancedAttributes[i]);
                            totalCost += enhancedAttributesCosts[i];
                            canEnhance = true;
                            // console.log("total Cost: "+ totalCost);
                            // console.log("1enhance? : " + (totalCost < soldierMaxLevel && canEnhance));
                        }else{ //Else check if we can add any other attribute
                            console.log("\t\t\t" +"too expensive to add enhancement, checking for cheaper ones")
                            // console.log("total Cost: "+ totalCost);
                            // console.log("can enhance: "+ canEnhance);

                            // Iterate through possible attributes to add and add one if possible
                            for(var j=0; j< enhancedAttributes.length; j++){
                                 if(totalCost + enhancedAttributesCosts[j] <=soldierMaxLevel){
                                    attributes.push(enhancedAttributes[j]);
                                    totalCost += enhancedAttributesCosts[j];
                                    canEnhance = true;
                                    break; 
                                 }
                            }
                        }

                        i++;
                        if(i>enhancedAttributes.length-1){i=0;}
                        // console.log('next enhancement: ' + enhancedAttributes[i] + ' - index : ' + i);
                        // console.log('final can enhance:'+ canEnhance);
                        // console.log(attributes);

                    }
                    console.log('Spawning new Soldier: ' + newName + " -- level: " + totalCost)
                    attributes.sort();
                    console.log('attributes: ' + attributes)
                    spawn.spawnCreep(attributes, newName,
                    {memory: {class: 'soldier', level: totalCost});
                    var soldierCount = spawn.room.find(FIND_MY_CREEPS, 
 						{filter: (creep) => {  return (creep.memory.class == "soldier"); }}).length;
                    console.log("new soldier count: " + (soldierCount));
                    console.log("==============|");
        		}


    	}
	}
}

module.exports =soldierFactory;