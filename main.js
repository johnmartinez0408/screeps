 
//var roleWarrior = require('role.warrior');

var workerFactory = require('workerFactory');
var workerBehavior = require('workerBehavior');

var soldierFactory = require('soldier.factory');
var soldierBehavior = require('soldier.behavior');
var claimerFactory = require('claimer.factory');
var claimerBehavior = require('claimer.behavior');


var towerBehavior = require('towerBehavior');



module.exports.loop = function () {
    
    var makeArmy = true;
    var makeClaimers = false;
    var makeEmergencySoldiers = false;
    var claimerTarget = "E31N14";
    var spawn = Game.spawns["Chester"]
    var spawn2 = Game.spawns["Pegasus"];
    var maxWorkers = 5;

    // Game.creeps["Worker5913049"].moveTo(new RoomPosition (27, 19, claimerTarget), {visualizePathStyle: {stroke: "#ff00ff"}})
    // Game.creeps["Worker5910985"].moveTo(new RoomPosition (27, 19, claimerTarget), {visualizePathStyle: {stroke: "#ff00ff"}})
    //Begin spawn 1, Chester
    if(spawn){
        //If we are under attack
        var enemiesInBase = spawn.room.find(FIND_HOSTILE_CREEPS).length;
        if(enemiesInBase){
            Game.flags["WarFlag"].setColor(1);
            // Game.flags["AttackFlag"].setColor(10);
            makeEmergencySoldiers = true;
            // console.log("enemies in base, making emergency soldiers");
            maxWorkers = 4;
            myCreepsCount = spawn.room.find(FIND_MY_CREEPS).length;
            if(myCreepsCount == 0 || spawn.hits < spawn.hitsMax){
                spawn.room.controller.activateSafeMode();
            }
        }else if(!makeArmy){
            Game.flags["WarFlag"].setColor(10); 
        }
        
        var currentWorkers = spawn.room.find(FIND_MY_CREEPS, 
            {filter: (creep) => {  return (creep.memory.class == "worker"); }}).length;
            // console.log("currentWorkers" + currentWorkers);

        //If we have less workers than we want, make more workers
        if(currentWorkers < maxWorkers){
            workerFactory.run(spawn, spawn.room.find(FIND_MY_CREEPS).length, maxWorkers);
        }
        //If war flag is red, spawn soldiers
        else if(Game.flags["WarFlag"].color==1){
       
                if(makeEmergencySoldiers){
                    soldierFactory.run(spawn, "emergencyWarrior");
                }else{
                    // var tanksCount =  spawn.room.find(FIND_CREEPS, 
                    //     {filter: (creep) => {  return (creep.memory.role == "tank"); }}).length;
                    // if(tanksCount <1){
                        // soldierFactory.run(spawn, "tank");
                    // }else{
                            soldierFactory.run(spawn, "warrior");
                            // soldierFactory.run(spawn, "bruiser");
                            // soldierFactory.run(spawn, "archer");
                    // }
                    // soldierFactory.run(spawn, "warrior");
                }
                

        }else if(makeClaimers){
            claimerFactory.run(spawn, claimerTarget);
        }
        


        //Tower actions
        var towers = spawn.room.find(FIND_STRUCTURES, 
                {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
            });
        if(towers){
           towerBehavior.run(towers); 
        }
        
    }
    



    //Start pegasus spawn
    //If we are under attack
    if(spawn2){
        maxWorkers = 10;
        var enemiesInBase = spawn2.room.find(FIND_HOSTILE_CREEPS).length;
        if(enemiesInBase){
            Game.flags["WarFlag"].setColor(1);
            // Game.flags["AttackFlag"].setColor(10);
            makeEmergencySoldiers = true;
            // console.log("enemies in base, making emergency soldiers");
            
            maxWorkers = 6;
            myCreepsCount = spawn2.room.find(FIND_MY_CREEPS).length;
            if(myCreepsCount == 0 || spawn2.hits < spawn2.hitsMax){
                spawn2.room.controller.activateSafeMode();
            }
        }else if(!makeArmy){
            Game.flags["WarFlag"].setColor(10); 
        }
        
        var currentWorkers = spawn2.room.find(FIND_MY_CREEPS, 
            {filter: (creep) => {  return (creep.memory.class == "worker"); }}).length;
            // console.log("currentWorkers" + currentWorkers);

        //If we have less workers than we want, make more workers
        if(currentWorkers < maxWorkers){
            workerFactory.run(spawn2, spawn2.room.find(FIND_MY_CREEPS).length, maxWorkers);
        }
        //If war flag is red, spawn soldiers
        else if(Game.flags["WarFlag"].color==1){
       
                if(makeEmergencySoldiers){
                    soldierFactory.run(spawn2, "emergencyWarrior");
                }else{
                    // var tanksCount =  spawn.room.find(FIND_CREEPS, 
                    //     {filter: (creep) => {  return (creep.memory.role == "tank"); }}).length;
                    // if(tanksCount <1){
                        // soldierFactory.run(spawn, "tank");
                    // }else{
                            soldierFactory.run(spawn2, "warrior");
                            // soldierFactory.run(spawn, "bruiser");
                            // soldierFactory.run(spawn, "archer");
                    // }
                    // soldierFactory.run(spawn, "warrior");
                }
                

        }else if(makeClaimers){
            claimerFactory.run(spawn2, claimerTarget);
        }
        


        //Tower actions
        var towers = spawn2.room.find(FIND_STRUCTURES, 
                {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
            });
        if(towers){
            towerBehavior.run(towers);
        }
            
    }//End spawn2 - Pegasus
    
    //Creeps actions
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.class=="worker"){
            workerBehavior.run(spawn, creep, countWorkersRole(spawn, "harvester"), countWorkersRole(spawn, "builder"), countWorkersRole(spawn, "repairer") );
        }else if(creep.memory.class=="soldier"){
            soldierBehavior.run(creep, Game.flags["AttackFlag"], Game.flags["AttackStructures"], Game.flags["DefendFlag"])
        }else if(creep.memory.class=="claimer"){
            claimerBehavior.run(creep);
        }

    }
        
    //Clear dead creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Burying:', name);
        }
    }
}


var countWorkers = function(spawn){
    return spawn.room.find(FIND_MY_CREEPS, 
        {filter: (creep) => {  return (creep.memory.class == "worker"); }}).length;
}

var countWorkersRole = function(spawn, role){
    return spawn.room.find(FIND_MY_CREEPS, 
        {filter: (creep) => {  return (creep.memory.class == "worker") && creep.memory.role == role; }}).length;
}



    

    // var testCreep = Game.creeps["Test"];
    // if(testCreep){
    //     if(testCreep.room.name == "E31N13"){
    //         testCreep.say("to E30N13")
    //         testCreep.moveTo(new RoomPosition(44,28, "E30N13"), {visualizePathStyle: {stroke: "#ff00ff"}});
    //     }else{
    //         testCreep.say("I did it!");
    //         testCreep.moveTo(44,28, {visualizePathStyle: {stroke: "#ff00ff"}});
    //     }
    // }
    
