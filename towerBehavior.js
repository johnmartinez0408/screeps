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
            }

            //Repair structures
            var closestDamagedWall = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {return (structure.hits < structure.hitsMax) && (structure.structureType == STRUCTURE_WALL) && (structure.hits<30000);}
            });
            if(closestDamagedWall && (tower.energy > tower.energyCapacity/2)) {
                tower.repair(closestDamagedWall);
            }

        }//End for loop
    }
}

module.exports = towerBehavior;

    