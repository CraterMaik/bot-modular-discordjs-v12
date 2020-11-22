const {
 Command
} = require('../../commands')

module.exports = class stopCommand extends Command {
  constructor() {
   super({
    name: 'stop',
    aliases: [],
    category: 'music',
    priority: 7,
    permLvl: 0
   })
  }
  async execute(msg, args, discord, client) {
   const queue = client.queue;
   const serverQueue = queue.get(msg.guild.id);

   if(!msg.member.voice.channel) return msg.channel.send('No estas conectando en un canal de voz.')
   if(!serverQueue) return msg.channel.send('No hay canciones reproduciendo.')

   serverQueue.songs = [];
   
   await serverQueue.connection.dispatcher.end();
   return msg.channel.send('Canciones detenidas.')
   
  }
 }