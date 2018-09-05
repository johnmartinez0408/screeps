/*
    spawn.worker
    Controls when to spawn workers and what kinds of workers to spawn
    
    Positions for all mining containers for energy sources are required to be in memory:
      i.e. spawn.memory.mines = [{pos: {x:11, y:7, room: "E31N13"}},{pos: {x:13, y:28, room: "E31N13"}}]

    Minimum number of each role must also be in the memory of the spawn:
      i.e. spawn.memory.minWorkers = {miners: 2, haulers: 2, upgradeBuilders: 1}
 */

var spawnWorker = {

  run: function(spawn){
    var minEnergyNeeded = 550; //Current minimum energy required to make a worker

    var spawnMiner = function (spawn, mine, container){
        var minerColor = "#00ff00";
        var name = "miner" + Game.time;
        var attributes = [MOVE, WORK, WORK, WORK, WORK, WORK]

        console.log(spawn.name+ ": spawning " + name);
        console.log(attributes); 
        console.log("had: " + spawn.room.energyAvailable + " energy");

        spawn.spawnCreep(attributes, name,  
          {memory: {class: 'worker2', role : "miner",  level: 55,  mine: mine, container: container, 
          home: spawn, color: minerColor, buildTime: (attributes.length*3) }
          }
        );
        console.log("spawning new miner");
    }
    
    var spawnHauler = function (spawn, container){
        if(spawn.room.energyAvailable >= 750){
            var haulerColor = "#0000ff";
            var name = "hauler" + Game.time;
            var attributes = [MOVE,MOVE, MOVE, MOVE, MOVE, 
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY] //Costs 750 energy
          
            console.log(spawn.name+ ": spawning hauler: " + name);
            console.log(attributes); 
            console.log("had: " + spawn.room.energyAvailable + " energy");

            spawn.spawnCreep(attributes, name,  
            {memory: {class: 'worker2', role : "hauler",  level: 75, 
              container: container, home: spawn, color: haulerColor, buildTime: (attributes.length*3)  }
            }
          );
        }//End if
        else{
            console.log("not enough energy: " + spawn.room.energyAvailable);
        }
    }
    
    var spawnUpgradeBuilder = function (spawn){
      if(spawn.room.energyAvailable >= 700){
        
        var upgradeBuilderColor = "#00ffff";
        var name = "upgradeBuilder" + Game.time;
        var attributes = [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, 
        WORK, CARRY, WORK, MOVE] //Costs 700    

        console.log(spawn.name+ ": spawning " + name);
        console.log(attributes); 
        console.log("had: " + spawn.room.energyAvailable + " energy");

        spawn.spawnCreep(attributes, name, {memory: {class: 'worker2', role : "upgradeBuilder",  level: 70, 
            home: spawn, color: upgradeBuilderColor, buildTime: (attributes.length*3)  }
        });
      }//End if
    }


    //Start spawning logic
      if(!spawn.spawning && spawn.room.energyAvailable >= minEnergyNeeded){ //If we have enough energy to make the cheapest worker
        
        //Get miners in spawner's room
        var miners = spawn.room.find(FIND_MY_CREEPS, 
            {filter: (creep) => {  return (creep.memory.role == "miner");}
        });
         //Get haulers in spawner's room
        var haulers = spawn.room.find(FIND_MY_CREEPS,
          {filter: (creep) => {  return (creep.memory.role == "hauler"); }
        });
        //Get upgradeBuilders in spawner's room
        var upgradeBuilders = spawn.room.find(FIND_MY_CREEPS, 
          {filter: (creep) => {  return (creep.memory.role == "upgradeBuilder"); }
        });
        // if(false){
        if(!upgradeBuilders  || upgradeBuilders.length <= spawn.memory.minWorkers.upgradeBuilders){ //If we don't have enough upgradeBuilders, spawn one
            console.log(spawn.name + ": insufficient upgradeBuilders");
            spawnUpgradeBuilder(spawn);
        }else if(!miners || miners.length < spawn.memory.minWorkers.miners){//If we don't have enough miners, spawn one
              console.log(spawn.name + ": insufficient miners");
              var sources = spawn.room.find(FIND_SOURCES);
              var unusedSource;
              for(var i=0; i<sources.length; i++){ //Loop through sources to find the first one that is not being mined
                var minersWithSource = spawn.room.find(FIND_MY_CREEPS,
                   {filter: (creep) => {  return (creep.memory.role == "miner") && (creep.memory.mine == sources[i].id);}
                });
                if(!minersWithSource || minersWithSource.length == 0){ //If we don't have a miner at this location
                    unusedSource = sources[i].id;
                    continue;
                }
                
              }
              if(unusedSource){
                    spawnMiner(spawn, unusedSource);
              }else{
                console.log("no free sources")
              }
        }else if(!haulers || haulers.length < spawn.memory.minWorkers.haulers){//If we don't have enough haulers, spawn one
            console.log(spawn.name + ": insufficient haulers");
            var containers = spawn.room.find(FIND_STRUCTURES, {filter: (structure) =>{
                return structure.structureType == STRUCTURE_CONTAINER;}
            });
            var unusedContainer;
            for(var i=0; i<containers.length; i++){ //Loop through sources to find the first one that is not being mined
                var haulersWithContainer = spawn.room.find(FIND_MY_CREEPS,
                    {filter: (creep) => {  return creep.memory.container == containers[i].id;}
                });
                if(!haulersWithContainer || haulersWithContainer.length == 0){ //If we don't have a miner at this location
                  unusedContainer = containers[i].id;
                  continue;
                }
              }
              if(unusedContainer){
                spawnMiner(spawn, containers[i].id);
              }else{
                console.log("no free containers")
              }
        }else{
          var creepsToReplace = spawn.room.find(FIND_MY_CREEPS, {filter: (c) => { //Get array of creeps that will die soon and need to be replaced
              return c.ticksToLive <= c.memory.buildTime + 20 ;}
          });
             
          if(creepsToReplace){ //If we have a creep that needs to be replaced spawn another creep with the same role and container/mine
            console.log(spawn+ "replacing: " + creep.name + ", has " + creep.ticksToLive + " ticks left");
            var role = creepsToReplace[0].memory.role;
            var container = creepsToReplace[0].memory.container;
            if(role == "miner"){
                spawnMiner(spawn, creep.memory.mine, creep.memory.container);
            }else if(role == "hauler"){
                spawnHauler(spawn, creep.memory.container);
            }else if(role == "upgradeBuilder"){
                spawnUpgradeBuilder(spawn);
            }else{
                console.log(spawn + ": incorrect worker role detected: " + role);
            }
          } //End if(creepsToReplace) 
        }// End else

      }

    }
    
    
}

module.exports = spawnWorker;