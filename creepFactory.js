/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('factory.creeps');
 * mod.thing == 'a thing'; // true
 */

var creepFactory = {
    
    run: function(){
        
        var numberOfHarvesters = 0;
        var numberOfUpgraders = 0;
        var numberOfBuilders = 0;
        var numberOfWarriors = 0;
        
        if(!Game.spawns['Spawn1'].spawning && Game.spawns['Spawn1'].energy == Game.spawns['Spawn1'].energyCapacity){
            //Handle harvester spawning
            var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
            if(harvesters.length < numberOfHarvesters) {
                var newName = 'Harvester' + Game.time;
                console.log('Spawning new harvester: ' + newName);
                Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
                {memory: {role: 'harvester'}});
            }
            
            //Handle upgrader spawning
            var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
            if(upgraders.length < numberOfUpgraders) {
                var newName = 'Upgrader' + Game.time;
                console.log('Spawning new Upgrader: ' + newName);
                Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
                {memory: {role: 'upgrader'}});
            }
            
            //Handle builder spawning
            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
            if(builders.length < numberOfBuilders) {
                var newName = 'Builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
                {memory: {role: 'builder'}});
            }

            //Handle warrior spawning
            var warriors = _.filter(Game.creeps, (creep) => creep.memory.role == 'warrior');
            if(warriors.length < numberOfWarriors) {
                var newName = 'Warrior' + Game.time;
                console.log('Spawning new warrior: ' + newName);
                Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,MOVE], newName,
                {memory: {role: 'warrior'}});
            }
         }
        
    }
    

  
}

var spawnCreep = function(name, type, level){
    
}


module.exports = creepFactory;