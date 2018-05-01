/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.warrior');
 * mod.thing == 'a thing'; // true
 */

var roleWarrior = {

    

    /** @param {Creep} creep **/
    run: function(creep) {
        var warriorLookout = [25,25]
        if(creep) {
            var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                if(creep.attack(closestHostile) ==  ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestHostile, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }else{
                creep.moveTo(warriorLookout[0], warriorLookout[1], {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
    }
};

module.exports = roleWarrior;