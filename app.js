const vorpal = require('vorpal')();
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

process.title = 'somehero-cli';
const pkg = require('./package');

global.appId = pkg.name;
global.getVorpal = () =>
{
    return vorpal;
};

class GameCharacter
{
    constructor(config)
    {
        this.isAlive = true;
        this.stats = {
            health: 0,
            strength: 0,
            defence: 0,
            speed: 0,
            luck: 0
        };
        this.skills = {
            criticalStrike: Math.random() >= 0.5,
            resilience: Math.random() >= 0.5
        };

        if (config !== undefined)
        {
            if (config.hasOwnProperty('stats'))
            {
                Object.entries(config.stats).forEach(([key, value]) =>
                {
                    if (this.stats.hasOwnProperty(key))
                    {
                        this.stats[key] = value;
                    }
                });
            }
            if (config.hasOwnProperty('skills'))
            {
                Object.entries(config.skills).forEach(([key, value]) =>
                {
                    if (this.stats.hasOwnProperty(key))
                    {
                        this.stats[key] = value;
                    }
                });
            }
        }
    }
}

class Hero extends GameCharacter
{
    constructor(config)
    {
        super(config);

        this.type = 'hero';
    }
}

class Villain extends GameCharacter
{
    constructor(config)
    {
        super(config);

        this.type = 'villain';
    }
}

class Application
{
    constructor(args)
    {
        this.loadCommands();

        //game play
        global.hero = Hero;
        global.villain = Villain;

        vorpal.localStorage(pkg.name);
        //vorpal.localStorage.setItem('players', ...);
    }

    log()
    {
        vorpal.log.apply(vorpal, arguments);
        return vorpal.log;
    }

    getRandomNumber(min, max)
    {
        const mi = min = Math.ceil(min);
        const ma = Math.floor(max);
        return Math.floor(Math.random() * (ma - mi)) + mi;
    }

    loadCommands()
    {
        const p = path.join(__dirname, '/commands');
        if (fs.existsSync(p))
        {
            for (const f of fs.readdirSync(p, {withFileTypes: true}))
            {
                if (f.isFile())
                {
                    //load command
                    const Command = require(path.join(p, f.name));
                    const cmd = new Command(vorpal);
                    cmd.build();
                }
            }
        }
    }

    registerCommand(name, description, action)
    {
        return vorpal
            .command(name, description)
            .action(action);
    }

    run()
    {
        console.clear();
        vorpal
            .delimiter('somehero$>')
            .show();
    }
}

const app = new Application();

let cmdClear = app.registerCommand('cls', 'Clears console', (args, callback) =>
{
    console.clear();
    callback();
});
cmdClear.alias('clear');

let cmdVersion = app.registerCommand('version', 'Shows ncli version', (args, callback) =>
{
    app.log(pkg.version);
    callback();
});
cmdVersion.hidden();

app.run();
app.log(chalk.yellow('Once upon a time there was a great hero, with some\n' +
    'strengths and weaknesses, as all heroes have....'));
vorpal.execSync('help');

//console.log(new Hero({stats: {luck: 100}}));