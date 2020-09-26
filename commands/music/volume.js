const {
 Command
} = require('../../commands')

module.exports = class volumeCommand extends Command {
 constructor() {
  super({
   name: 'volume',
   aliases: ['vol'],
   category: 'music',
   priority: 7,
   permLvl: 0
  })
 }
 async execute(msg, args, discord, client) {
  const queue = client.queue;
  const serverQueue = queue.get(msg.guild.id);
  let volume = args[0];
  volume = Number(volume);

  if (!msg.member.voice.channel) return msg.channel.send('No estas conectando en un canal de voz.')
  if (!serverQueue) return msg.channel.send('No hay canciones reproduciendo.')

  if(!volume) return msg.channel.send('Debes agregar un valor para el volumen.');
  if(volume > 2) return msg.channel.send('La cantidad para el valor del volumen debe ser menor a 2');

  serverQueue.volume = volume;
  serverQueue.connection.dispatcher.setVolume(volume)

  return msg.channel.send(`Ahora el volumen para las canciones es de : **${volume}**`)

 }
}