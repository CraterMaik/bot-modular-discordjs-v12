const {
 Command
} = require('../../commands')

module.exports = class queueCommand extends Command {
 constructor() {
  super({
   name: 'queue',
   aliases: ['list'],
   category: 'music',
   priority: 7,
   permLvl: 0
  })
 }
 async execute(msg, args, discord, client) {
  const queue = client.queue;
  const serverQueue = queue.get(msg.guild.id);

  if (!serverQueue) return msg.channel.send('No hay canciones reproduciendo.');
  if(serverQueue.songs.length === 0) return msg.channel.send('No hay canciones en lista de espera.');

  const queueSongs = serverQueue.songs;

  let listSongs = queueSongs.slice(1, 10).map(song => {
   let durationSeconds = song.duration.seconds < 9 ? '0' + song.duration.seconds : song.duration.seconds;
   let durationMinutes = song.duration.minutes < 9 ? '0' + song.duration.minutes : song.duration.minutes;
   let durationHours = song.duration.hours < 9 ? '0' + song.duration.hours : song.duration.hours;

   return `**=>** ${song.title} - **__${durationHours}:${durationMinutes}:${durationSeconds}__**`;
  })

  const queueEmbed = new discord.MessageEmbed()
   .setColor('RANDOM')
   .setThumbnail(queueSongs[0].thumbnail)
   .setDescription(`Reproduciendo ahora:\n**${queueSongs[0].title}**\n\n========================\n${listSongs.join('\n')}`)

  return msg.channel.send('Lista de canciones del servidor **__'+ msg.guild.name + '__**', {embed: queueEmbed})

 }
}