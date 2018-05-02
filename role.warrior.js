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
    run: function(creep, attackFlag, defendFlag) {
        var targetRoom = "E31N14"; //Room number to attack
        var originRoom = "E31N13"; //Room to retreat to
        var warriorLookout = [25,25]
        if(defendFlag.color==1) {
            if(creep.room.name == originRoom){
                var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                if(creep.attack(closestHostile) ==  ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestHostile, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }else{
                creep.moveTo(warriorLookout[0], warriorLookout[1], {visualizePathStyle: {stroke: '#ff0000'}});
            }
            }
        }else{
             if()
            var closestHostileTower = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
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