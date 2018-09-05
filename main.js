
//var roleWarrior = require('role.warrior');

var workerFactory = require('workerFactory');
var workerBehavior = require('workerBehavior');

var soldierFactory = require('soldier.factory');
var soldierBehavior = require('soldier.behavior');
var claimerFactory = require('claimer.factory');
var claimerBehavior = require('claimer.behavior');

var spawnWorker = require('spawn.worker');
var workerMiner = require('worker.miner');
var workerHauler = require('worker.hauler');
var workerUpgradeBuilder = require('worker.upgradeBuilder');

var towerBehavior = require('towerBehavior');



module.exports.loop = function () {
    
    var makeArmy = false;
    var makeClaimers = false;
    var makeEmergencySoldiers = false;
    var claimerTarget = "E31N14";
    var spawn1 = Game.spawns["Andromeda"]
    var spawn2 = Game.spawns["Pegasus"];
    var maxWorkers = 7;

    // Game.creeps["Worker25739640"].moveTo(new RoomPosition( 35,40, "E62S63"), {visualizePathStyle: {stroke: "ff0000"}});
    // Game.creeps["Worker25739723"].memory.class = "worker";
    // Game.creeps["Worker25739723"].memory.role = "builder";
    //Start pegasus spawn
    //If we are under attack
    if(spawn2){
        // try{
        //     soldierFactory.run(spawn2, "emergencyWarrior");
        // }catch(e){
        //     console.log(spawn2)
        //     console.log(e)
        // }

        // var spawnWorker = require('spawn.worker');
        // var workerMiner = require('worker.miner');
        // var workerHauler = require('worker.hauler');
        // var workerUpgradeBuilder = require('worker.upgradeBuilder');
        // console.log("doin it")
        // spawnWorker.run(spawn2);
        maxWorkers = 7;
        var enemiesInBase = spawn2.room.find(FIND_HOSTILE_CREEPS).length;
        if(enemiesInBase){
            makeEmergencySoldiers = true;
            // console.log("enemies in base, making emergency soldiers");
            maxWorkers = 4;
            if(spawn2.hits < spawn2.hitsMax){
                spawn2.room.controller.activateSafeMode();
            }
        }
        if(makeEmergencySoldiers){
                try{
                    soldierFactory.run(spawn2, "emergencyWarrior");
                }catch(e){
                    console.log(spawn2)
                    console.log(e)
                }
        }

        var enemiesInBase = spawn2.room.find(FIND_HOSTILE_CREEPS).length;

        
        var currentWorkers = spawn2.room.find(FIND_MY_CREEPS, 
            {filter: (creep) => {  return (creep.memory.class == "worker"); }}).length;
            // console.log("currentWorkers" + currentWorkers);

        //If we have less workers than we want, make more workers
        if(currentWorkers < maxWorkers){
            workerFactory.run(spawn2, spawn2.room.find(FIND_MY_CREEPS).length, maxWorkers);
        }
        //If war flag is red, spawn soldiers

        //Tower actions
        var towers = spawn2.room.find(FIND_STRUCTURES, 
                {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
            });
        if(towers){
            towerBehavior.run(towers);
        }
            
    }//End spawn2 - Pegasus


    if(spawn1){
        maxWorkers = 5;

        var enemiesInBase = spawn1.room.find(FIND_HOSTILE_CREEPS).length;
        if(enemiesInBase){
            makeEmergencySoldiers = true;
            // console.log("enemies in base, making emergency soldiers");
            maxWorkers = 2;
            if(spawn1.hits < spawn1.hitsMax){
                spawn1.room.controller.activateSafeMode();
            }
        }
        if(makeEmergencySoldiers){
                try{
                    soldierFactory.run(spawn1, "emergencyWarrior");
                }catch(e){
                    console.log(spawn1)
                    console.log(e)
                }
        }

        var enemiesInBase = spawn1.room.find(FIND_HOSTILE_CREEPS).length;

        
        var currentWorkers = spawn1.room.find(FIND_MY_CREEPS, 
            {filter: (creep) => {  return (creep.memory.class == "worker"); }}).length;
            // console.log("currentWorkers" + currentWorkers);

        //If we have less workers than we want, make more workers
        if(currentWorkers < maxWorkers){
            workerFactory.run(spawn1, spawn1.room.find(FIND_MY_CREEPS).length, maxWorkers);
        }
        //If war flag is red, spawn soldiers

        //Tower actions
        var towers = spawn1.room.find(FIND_STRUCTURES, 
                {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
            });
        if(towers){
            towerBehavior.run(towers);
        }
    }//End spawn1 - Andromeda


    //Creeps actions
    for(var name in Game.creeps) {
        // var s = creep.room
        var creep = Game.creeps[name];
        if(creep.memory.class=="worker"){
            workerBehavior.run(creep, countWorkersRole(spawn1, "harvester"), countWorkersRole(spawn1, "builder"), countWorkersRole(spawn1, "repairer") );
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
    
