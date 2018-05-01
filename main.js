 
//var roleWarrior = require('role.warrior');

var workerFactory = require('workerFactory');
var workerBehavior = require('workerBehavior');

var towerBehavior = require('towerBehavior');



module.exports.loop = function () {
    
    var spawn = Game.spawns["Chester"]
    
    workerFactory.run(spawn, spawn.room.find(FIND_MY_CREEPS).length);


    //Tower actions
    var towers = spawn.room.find(FIND_STRUCTURES, 
            {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
        });
    towerBehavior.run(towers);

    //Worker actions
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.class=="worker"){
            workerBehavior.run(creep, countWorkersRole(spawn, "harvester"), countWorkersRole(spawn, "builder"), countWorkersRole(spawn, "repairer") );
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