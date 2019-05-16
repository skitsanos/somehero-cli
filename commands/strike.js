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

        this.getRandomNumber = (min, max) =>
        {
            const mi = min = Math.ceil(min);
            const ma = Math.floor(max);
            return Math.floor(Math.random() * (ma - mi)) + mi;
        };

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
            //if lucky, there is no damage
            if (global.players[global.defender].stats.luck === 100)
            {
                return 0;
            }
            else
            {
                const rawDamage = this.getAttackerStrength() - this.getDefenderDefence();
                const chancesForResilience = this.getRandomNumber(0, 100);

                /*
                 Resilience: Takes only half of the usual damage when an enemy attacks; there’s a 20%
                 chance he’ll use this skill when he defends but this skill cannot be used two turns in a row.
                */
                if (chancesForResilience <= 20)
                {
                    if (global.players[global.attacker].skills.resilience)
                    {
                        return Math.ceil(rawDamage / 2);
                    }
                }

                return rawDamage;
            }
        };

        this.cleanup = () =>
        {
            global.players = undefined;
            global.attacker = undefined;
            global.defender = undefined;
        };

        this.announceWinner = () =>
        {
            this.log('\n\nGAME over');
            this.log(`${chalk.magenta(global.attacker.toUpperCase())} won with ${global.strikeCounter[global.attacker]} strikes!\n\n`);
        };

        if (global.attacker === undefined)
        {
            this.log(`Game is not started yet, please type ${chalk.cyan('start')} to begin`);
        }
        else
        {
            global.strikeCounter[global.attacker]++;

            this.log(`${chalk.magenta(global.attacker.toUpperCase())} attacks ${chalk.magenta(global.defender.toUpperCase())}`);

            /*
            The damage is subtracted from the defender’s health. An attacker can miss their hit and do no
            damage if the defender gets lucky that turn.
             */
            const strikeDamage = this.getDamage();
            this.log(`Damage occurred: ${strikeDamage}`);
            global.players[global.defender].stats.health -= strikeDamage;

            /*
            The game ends when one of the players remain without health or the number of turns reaches 20.
             */
            if (global.players[global.defender].stats.health < 0)
            {
                this.announceWinner();
                this.cleanup();
            }
            else
            {
                if ((global.strikeCounter.hero >= 20) || (global.strikeCounter.villain >= 20))
                {
                    this.announceWinner();
                    this.cleanup();
                }
                else
                {
                    const chancesForCriticalStrike = this.getRandomNumber(0, 100);
                    global.attacker = global.defender;
                    global.defender = global.attacker;
                }
            }
        }
        callback();
    }
}

module.exports = Command;