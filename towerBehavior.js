/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('towerBehavior');
 * mod.thing == 'a thing'; // true
 */
    
var towerBehavior = {
    run: function(towers){
        for(var i=0; i<towers.length; i++){
            var tower = towers[i];

            //Attack enemies
            var closestHostile =  tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }else{
                 //Repair structures
                var closestDamagedBarrier = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.hits < structure.hitsMax)
                     && ((structure.structureType == STRUCTURE_WALL) || 
                        (structure.structureType == STRUCTURE_RAMPART)) 
                     && (structure.hits<25000);}
                });
                if(closestDamagedBarrier && (tower.energy > tower.energyCapacity/2)) {
                    tower.repair(closestDamagedBarrier);
                }else{
                    // var closestDamagedStructure =  tower.pos.findClosestByRange(FIND_STRUCTURES, 
                    //     {filter: (structure) => {return (structure.hits < structure.hitsMax)}});
                    // if(closestDamagedStructure && (tower.energy > tower.energyCapacity/2)) {
                    //     tower.repair(closestDamagedStructure);
                    // }
                }
            }

           

        }//End for loop
    }
}

module.exports = towerBehavior;

    