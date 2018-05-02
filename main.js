 
//var roleWarrior = require('role.warrior');

var workerFactory = require('workerFactory');
var workerBehavior = require('workerBehavior');

var soldierFactory = require('soldier.factory');
var soldierBehavior = require('soldier.behavior');
var claimerFactory = require('claimer.factory');
var claimerBehavior = require('claimer.behavior');


var towerBehavior = require('towerBehavior');



module.exports.loop = function () {
    
    // Game.creeps["Soldier5752591"].moveTo(new RoomPosition(10, 1, "E31N13"))
    // Game.creeps["Soldier5752591"].attack(Game.getObjectById("5ae8bdae692254390601d145"))
    // if(Game.creeps["Soldier5752796"].attack(Game.getObjectById("5ae8bdae692254390601d145")) == ERR_NOT_IN_RANGE){
    //     Game.creeps["Soldier5752796"].moveTo(Game.getObjectById("5ae8bdae692254390601d145"));
    // }
    var makeClaimers = false;
    var makeEmergencySoldiers = false;
    var claimerTarget = "E31N14";
    var spawn = Game.spawns["Chester"]
    var maxWorkers = 13;

    //If we are under attack
    var enemiesInBase = spawn.room.find(FIND_HOSTILE_CREEPS).length;
    if(enemiesInBase){
        Game.flags["AttackFlag"].setColor(1);
        maxWorkers = 6;
        myCreepsCount = spawn.room.find(FIND_MY_CREEPS).length;
        if(myCreepsCount == 0){
            spawn.room.controller.activateSafeMode();
        }
    }
    
    var currentWorkers = spawn.room.find(FIND_MY_CREEPS, 
        {filter: (creep) => {  return (creep.memory.class == "worker"); }}).length;
    
    //If we have less workers than we want, make more workers
    if(currentWorkers < maxWorkers){
        workerFactory.run(spawn, spawn.room.find(FIND_MY_CREEPS).length, maxWorkers);
    }
    //If war flag is red, spawn soldiers
    else if(Game.flags["WarFlag"].color==1){
        var tanksCount =  spawn.room.find(FIND_CREEPS, 
            {filter: (creep) => {  return (creep.memory.role == "tank"); }}).length;
        // if(tanksCount <1){
        //     soldierFactory.run(spawn, "tank");
        // }else{
            soldierFactory.run(spawn, "warrior");
        // }
    }else if(makeClaimers){
        claimerFactory.run(spawn, claimerTarget);
    }
    


    //Tower actions
    var towers = spawn.room.find(FIND_STRUCTURES, 
            {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
        });
    towerBehavior.run(towers);

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
    return Game.spawns["Chester"].room.find(FIND_MY_CREEPS, 
        {filter: (creep) => {  return (creep.memory.class == "worker"); }}).length;
}

var countWorkersRole = function(spawn, role){
    return Game.spawns["Chester"].room.find(FIND_MY_CREEPS, 
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
    
