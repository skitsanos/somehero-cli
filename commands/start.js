const path = require('path');
const VorpalCommand = require(path.join(process.cwd(), 'njsf/vorpal/command'));
const chalk = require('chalk');

class Command extends VorpalCommand
{
    constructor(instance)
    {
        super(instance, 'start', 'Restarts the game and recreates characters');
    }

    action(args, callback)
    {
        this.getRandomNumber = (min, max) =>
        {
            const mi = min = Math.ceil(min);
            const ma = Math.floor(max);
            return Math.floor(Math.random() * (ma - mi)) + mi;
        };

        global.players = {
            hero: new global.hero({
                stats: {
                    health: this.getRandomNumber(70, 100),
                    strength: this.getRandomNumber(70, 80),
                    defence: this.getRandomNumber(45, 55),
                    speed: this.getRandomNumber(40, 50),
                    luck: this.getRandomNumber(10, 30)
                }
            }),
            villain: new global.villain({
                stats: {
                    health: this.getRandomNumber(60, 90),
                    strength: this.getRandomNumber(60, 90),
                    defence: this.getRandomNumber(40, 60),
                    speed: this.getRandomNumber(40, 60),
                    luck: this.getRandomNumber(25, 40)
                }
            })
        };

        this.commandObject.vorpal.execSync('stats');

        /*
        The first attack is done by the player with the higher speed. If both players have the same
        speed, then the attack is carried on by the player with the highest luck. After an attack, the
        players switch roles: the attacker now defends and the defender now attacks.
         */
        if (global.players.hero.stats.speed > global.players.villain.stats.speed)
        {
            global.attacker = 'hero';
        }
        else if (global.players.hero.stats.speed < global.players.villain.stats.speed)
        {
            global.attacker = 'villain';
        }
        else if (global.players.hero.stats.speed === global.players.villain.stats.speed)
        {
            if (global.players.hero.stats.luck > global.players.villain.stats.luck)
            {
                global.attacker = 'hero';
            }
            else
            {
                global.attacker = 'villain';
            }
        }

        //check who hits first
        if (global.attacker === 'hero')
        {
            this.log('\nHero strikes first...\n');
        }
        else
        {
            this.log('\nVillain strikes first...\n');
        }

        this.log(`Type ${chalk.cyan('strike')} to attack`);

        //strike

        callback();
    }
}

module.exports = Command;