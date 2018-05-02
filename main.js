 
//var roleWarrior = require('role.warrior');

var workerFactory = require('workerFactory');
var workerBehavior = require('workerBehavior');

var soldierFactory = require('soldier.factory');
var soldierBehavior = require('soldier.behavior');

var towerBehavior = require('towerBehavior');


module.exports.loop = function () {
    
    // Game.creeps["Soldier5752591"].moveTo(new RoomPosition(10, 1, "E31N13"))
    // Game.creeps["Soldier5752591"].attack(Game.getObjectById("5ae8bdae692254390601d145"))
    // if(Game.creeps["Soldier5752796"].attack(Game.getObjectById("5ae8bdae692254390601d145")) == ERR_NOT_IN_RANGE){
    //     Game.creeps["Soldier5752796"].moveTo(Game.getObjectById("5ae8bdae692254390601d145"));
    // }
    
    var spawn = Game.spawns["Chester"]
    var maxWorkers = 12;

    //If we are under attack
    var enemiesInBase = spawn.room.find(FIND_HOSTILE_CREEPS, 
        {filter: (creep) => {  return (creep.memory.class == "worker"); }}).length;
    if(enemiesInBase){
        Game.flags["AttackFlag"]=1;
        maxWorkers = 7;
        var creeps = spawn.room.find(FIND_MY_CREEPS);
        for(var name in creeps){ //Turn all creeps in room into harvesters
            var creep = Game.creeps[name];
            console.log('previous harvesters: '+  harvestersCount);
            creep.memory.role = "harvester";
            creep.memory.color = harvesterColor;
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
        var tanksCount =  Game.spawns["Chester"].room.find(FIND_CREEPS, 
            {filter: (creep) => {  return (creep.memory.role == "tank"); }}).length;
        // if(tanksCount <1){
        //     soldierFactory.run(spawn, "tank");
        // }else{
            soldierFactory.run(spawn, "warrior");
        // }
    }else{
        console.log("nothing to spawn... " + Game.time);
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
            workerBehavior.run(creep, countWorkersRole(spawn, "harvester"), countWorkersRole(spawn, "builder"), countWorkersRole(spawn, "repairer") );
        }else if(creep.memory.class=="soldier"){
            soldierBehavior.run(creep, Game.flags["AttackFlag"], Game.flags["AttackStructures"], Game.flags["DefendFlag"])
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
    
