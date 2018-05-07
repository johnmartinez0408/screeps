
var claimerFactory = {
    
    run: function(spawn, targetRoom){

        if(!spawn.spawning){
            var claimersInTarget = false;
            try{
                claimersInTarget = Game.rooms[targetRoom].find(FIND_MY_CREEPS, 
                {filter: (creep) => {  return (creep.memory.role == "claimer" && creep.ticksToLive <= 80); }});
            }catch(e){}

            var claimersAtHome = spawn.room.find(FIND_MY_CREEPS, 
                {filter: (creep) => {  return (creep.memory.role == "claimer"); }});
            // console.log("claimers in target: " +claimersInTarget);
            // console.log("claimers at home: " +claimersAtHome);
            // console.log(!claimersAtHome);
            // console.log(!claimersInTarget);
            if(!claimersInTarget && !claimersAtHome.length>0 ){
                console.log("no claimers")
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
        
    	
    }

}

module.exports = claimerFactory;
