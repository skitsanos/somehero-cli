const path = require('path');
const VorpalCommand = require(path.join(process.cwd(), 'njsf/vorpal/command'));

class Command extends VorpalCommand
{
    constructor(instance)
    {
        super(instance, 'strike', 'Performs attack');
        this.addOption('-m, --message <message>', 'Adds a message');
    }

    action(args, callback)
    {
        this.log('This is a test message;');
        console.log(args.options);
        callback();
    }
}

module.exports = Command;