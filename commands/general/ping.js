const { Command } = require('../../commands')

module.exports = class PingCommand extends Command {
 constructor() {
  super({
   name: 'ping',
   aliases: [],
   category: 'general',
   priority: 9,
   permLvl: 0
  })
 }
 execute(msg) {

  msg.channel.send('pong!')

 }
}
