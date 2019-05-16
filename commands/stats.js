const path = require('path');
const VorpalCommand = require(path.join(process.cwd(), 'njsf/vorpal/command'));
const chalk = require('chalk');
const ProgressBar = require('ascii-progress');

class Command extends VorpalCommand
{
    constructor(instance)
    {
        super(instance, 'stats', 'Prints stats on game characters');
    }

    action(args, callback)
    {
        this.barLabel = (label, width) =>
        {
            return label + ' '.repeat(width - label.length);
        };
        this.renderProgress = () =>
        {
            Object.entries(global.players).forEach(([key, value]) =>
            {
                this.log(`${chalk.magenta(key.toUpperCase())} stats:`);

                const sortedKeys = Object.keys(value.stats).sort((a, b) => b.length - a.length || a.localeCompare(b));

                Object.keys(value.stats).forEach(stats_key =>
                {
                    const bar = new ProgressBar({
                        schema: this.barLabel(stats_key, sortedKeys[0].length) + ' :bar :current/:total',
                        total: 100,
                        current: value.stats[stats_key]
                    });
                    bar.tick(0);
                });

            });
        };

        if (global.players === undefined)
        {
            this.log(`Game is not started yet, please type ${chalk.cyan('start')} to begin`);
        }
        else
        {
            this.renderProgress();
        }

        if (callback)
        {
            callback();
        }
    }
}

module.exports = Command;