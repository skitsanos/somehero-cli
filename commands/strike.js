const path = require('path');
const VorpalCommand = require(path.join(process.cwd(), 'njsf/vorpal/command'));
const chalk = require('chalk');

class Command extends VorpalCommand
{
    constructor(instance)
    {
        super(instance, 'strike', 'Performs attack');
        this.addOption('-m, --message <message>', 'Adds a message');
    }

    action(args, callback)
    {
        //console.log(args.options);
        this.getAttackerStrength = () =>
        {
            return global.players[global.attacker].stats.strength;
        };

        this.getDefenderDefence = () =>
        {
            return global.players[global.defender].stats.defence;
        };

        this.getDamage = () =>
        {
            //add chances
            return this.getAttackerStrength() - this.getDefenderDefence();
        };

        if (global.attacker === undefined)
        {
            this.log(`Game is not started yet, please type ${chalk.cyan('start')} to begin`);
        }
        else
        {
            this.log(`${chalk.magenta(global.attacker.toUpperCase())} attacks ${chalk.magenta(global.defender.toUpperCase())}`);

            const strikeDamage = this.getDamage();
            this.log(`Damage occurred: ${strikeDamage}`);
            global.players[global.defender].stats.health -= strikeDamage;
            if (global.players[global.defender].stats.health < 0)
            {
                this.log('\n\nGAME over');
                this.log(`${chalk.magenta(global.attacker.toUpperCase())} won!\n\n`);

                //cleanup
                global.players = undefined;
                global.attacker = undefined;
                global.defender = undefined;
            }
            else
            {
                global.attacker = global.defender;
                global.defender = global.attacker;
            }
        }
        callback();
    }
}

module.exports = Command;