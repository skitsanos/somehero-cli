![](https://repository-images.githubusercontent.com/186971401/cb2ed080-7815-11e9-81bd-140e7205abe2)

As the hero walks the whimsical forests of The Terminal Valley, he encounters nefarious villains... After battling all kinds of monsters for more than a hundred years, the hero has some stats and skills... 

### Supported commands
```
help [command...]  Provides help for a given command.
exit               Exits application.
start              Restarts the game and recreates characters
stats              Prints stats on game characters
strike             Performs attack
cls                Clears console
```

### Possible ways to extend

In real life application Character _Skills_ could be loaded dynamically as randomized block or as predefined block from server side.

Skills used during strike could be set as dynamically affecting strikes by some rules defined, let's say, in some admin area.

Multiplayer mode and messaging between players can be easily implemented with pub/subscribe over [nats.io](nats.io)