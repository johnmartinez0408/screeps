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
      if(!spawn.spawning && spawn.room.energyAvailable >= minEnergyNeded){ //If we have enough energy to make the cheapest worker
        
        var miners = spawn.room.find(FIND_MY_CREEPS, //Get miners in spawner's room
          {filter: (creep) => {  return (creep.memory.role == "miner"); }
        });
        var haulers = spawn.room.find(FIND_MY_CREEPS, //Get haulers in spawner's room
          {filter: (creep) => {  return (creep.memory.role == "hauler"); }
        });
        var upgradeBuilders = spawn.room.find(FIND_MY_CREEPS, //Get upgradeBuilders in spawner's room
          {filter: (creep) => {  return (creep.memory.role == "upgradeBuilder"); }
        });

        if(upgradeBuilders <= spawn.memory.minWorkers.upgradeBuilders){ //If we don't have enough upgradeBuilders, spawn one
          console.log("insufficient upgradeBuilders");
          spawnWorker.spawnUpgradeBuilder(spawn);
        }else if(miners <= spawn.memory.minWorkers.miners){//If we don't have enough miners, spawn one
              console.log("insufficient miners");
              var sources = spawn.room.find(FIND_SOURCES);
              var unusedSource;
              for(var i=0; i<sources.length; i++){ //Loop through sources to find the first one that is not being mined
                var minersWithSource = spawn.room.find(FIND_MY_CREEPS,
                   {filter: (creep) => {  return (creep.memory.mine.x == sources[i].pos.x 
                    && creep.memory.mine.y == sources[i].pos.y); }
                });
                if(minersWithSource.length == 0){ //If we don't have a miner at this location
                 unusedSource = sources[i];
                  continue;
                }
              }
              if(unusedSource){
                spawnWorker.spawnMiner(spawn, unusedSource);
              }else{
                console.log("no free sources")
              }
        }else if(haulers <= spawn.memory.minWorkers.haulers){//If we don't have enough haulers, spawn one
            console.log("insufficient haulers");
              var containers = spawn.room.find(FIND_STRUCTURES, {filter: (structure) =>{
                return structure.structureType == STRUCTURE_CONTAINER;}
              });
              var unusedContainer;
              for(var i=0; i<sources.length; i++){ //Loop through sources to find the first one that is not being mined
                var haulersWithContainer = spawn.room.find(FIND_MY_CREEPS,
                   {filter: (creep) => {  return (creep.memory.container.x == containers[i].pos.x 
                    && creep.memory.container.y == containers[i].pos.y); }
                });
                if(haulersWithContainer.length == 0){ //If we don't have a miner at this location
                  unusedContainer = containers[i];
                  continue;
                }
              }
              if(unusedContainer){
                spawnWorker.spawnMiner(spawn, unusedSource);
              }else{
                console.log("no free containers")
              }
        }else{
          var creepsToReplace = spawn.room.find(FIND_MY_CREEPS, {filter: (c) => { //Get array of creeps that will die soon and need to be replaced
              return c.ticksToLive <= c..memory.buildTime + 20 ;}
          });
             
          if(creepsToReplace){ //If we have a creep that needs to be replaced spawn another creep with the same role and container/mine
            var role = creepsToReplace[0].memory.role;
            var container = creepsToReplace[0].memory.container;
            switch (role){
              case "miner"
                spawnWorker.spawnMiner(spawn, container);
                break;
              case "hauler"
                spawnWorker.spawnHauler(spawn, container);
                break;
              case "upgradeBuilder"
                spawnWorker.spawnUpgradeBuilder(spawn);
                break;
              default:
                console.log("incorrect worker role detected: " + role);
            }
          } //End if(creepsToReplace) 
        }// End else



        
           
      }
       
    },
    
    spawnMiner: function(spawn, mine){
        var minerColor = "#00ff00";
        var name = "hauler" + Game.time;
        var attributes = ["MOVE", "WORK", "WORK", "WORK", "WORK", "WORK"]
        spawn.spawnCreep(attributes, name,  
          {memory: {class: 'worker', role : "miner",  level: 55,  mine: mine, home: spawn, color: minerColor, 
            buildTime: (attributes.length*3) }
          }
        );
        console.log("spawning new miner");
    },
    
    spawnHauler: function(spawn, container){
        if(spawn.room.energyAvailable >= 750){
          var haulerColor = "#0000ff";
          var name = "hauler" + Game.time;
          var attributes = ["MOVE", "MOVE", "MOVE", "MOVE", "MOVE", 
          "CARRY", "CARRY", "CARRY", "CARRY", "CARRY", "CARRY", "CARRY", "CARRY", "CARRY", "CARRY"] //Costs 750 energy
          
          spawn.spawnCreep(attributes, name,  
            {memory: {class: 'worker', role : "hauler",  level: 75, 
              container: container, home: spawn, color: haulerColor, buildTime: (attributes.length*3)  }
            }
          );
        }//End if
    },
    
    spawnUpgradeBuilder: function(spawn){
      if(spawn.room.energyAvailable >= 700){
        var upgradeBuilderColor = "#00ffff";
        var name = "upgradeBuilder" + Game.time;
        var attributes = ["MOVE", "MOVE", "MOVE", "CARRY", "CARRY", "CARRY", "CARRY", "CARRY", 
        "WORK", "CARRY", "WORK", "MOVE"] //Costs 700
        spawn.spawnCreep(attributes, name,  
          {memory: {class: 'worker', role : "upgradeBuilder",  level: 70, 
            home: spawn, color: haulerColor, buildTime: (attributes.length*3)  }
          }
        );
      }//End if
    }
}

module.exports = spawnWorker;