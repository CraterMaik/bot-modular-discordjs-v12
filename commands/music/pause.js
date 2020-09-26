const {
 Command
} = require('../../commands')

module.exports = class pauseCommand extends Command {
 constructor() {
  super({
   name: 'pause',
   aliases: [],
   category: 'music',
   priority: 7,
   permLvl: 0
  })
 }
 async execute(msg, args, discord, client) {
  const queue = client.queue;
  const serverQueue = queue.get(msg.guild.id);

  if (!msg.member.voice.channel) return msg.channel.send('No estas conectando en un canal de voz.')
  if (!serverQueue) return msg.channel.send('No hay canciones reproduciendo.')

  if(serverQueue && serverQueue.playing) {
   serverQueue.playing = false;
   console.log('En pausa');
   serverQueue.connection.dispatcher.pause(true);

   return msg.channel.send('Canción pausada');
  }

 }
}