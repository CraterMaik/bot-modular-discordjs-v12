const {
  Command
} = require('../../commands')

module.exports = class nowPlayingCommand extends Command {
  constructor() {
    super({
      name: 'nowplaying',
      aliases: ['np', 'nowp'],
      category: 'music',
      priority: 7,
      permLvl: 0
    })
  }
  async execute(msg, args, discord, client) {
    const queue = client.queue;
    const serverQueue = queue.get(msg.guild.id);

    if (!serverQueue) return msg.channel.send('No hay canciones reproduciendo.');
    if (serverQueue.songs.length === 0) return msg.channel.send('No hay canciones en lista de espera.');

    const queueSongs = serverQueue.songs;

    function statsDuration(song) {
      let durationSeconds = song.duration.seconds < 9 ? '0' + song.duration.seconds : song.duration.seconds;
      let durationMinutes = song.duration.minutes < 9 ? '0' + song.duration.minutes : song.duration.minutes;
      let durationHours = song.duration.hours < 9 ? '0' + song.duration.hours : song.duration.hours;

      return `**__${durationHours}:${durationMinutes}:${durationSeconds}__**`;
    }

    const queueEmbed = new discord.MessageEmbed()
      .setColor('RANDOM')
      .setThumbnail(queueSongs[0].thumbnail)
      .setDescription(`Reproduciendo ahora:\n**${queueSongs[0].title}**\nDuración: ${statsDuration(queueSongs[0])}`)

    return msg.channel.send(queueEmbed)

  }
}