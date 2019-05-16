const path = require('path');
const VorpalCommand = require(path.join(process.cwd(), 'njsf/vorpal/command'));

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
        callback();
    }
}

module.exports = Command;