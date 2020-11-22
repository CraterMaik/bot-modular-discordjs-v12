const {
  Command
} = require('../../commands')

module.exports = class skipCommand extends Command {
  constructor() {
    super({
      name: 'skip',
      aliases: ['saltar'],
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

    if(msg.member.voice.channel.members.size === 2) {

      msg.channel.send('La canción en reproducción fue omitida.')
      await serverQueue.connection.dispatcher.end();
      return;
    }

    const map = client.skipvote;
    const mapload = map.get(msg.guild.id);
    
    if (mapload) {

      if (mapload.users.includes(msg.author.id)) return msg.reply('Ya has votado.');
      await mapload.users.push(msg.author.id)
      
      if (mapload.users.length > 1) {
        let skipNumber = 1 + parseInt(msg.member.voice.channel.members.size / 2);
        msg.channel.send(`${msg.author.username} ha votado para saltar la canción actual. **${mapload.users.length}/${skipNumber}**`)
      }

      const number = parseInt(msg.member.voice.channel.members.size / 2);
   
      if (mapload.users.length < number) return;

      msg.channel.send('La canción actual fue omitida por votación.');
      
      await serverQueue.connection.dispatcher.end();

    } else {
      const listUser = {
        users: []
      }
      await map.set(msg.guild.id, listUser)
      await listUser.users.push(msg.author.id);

      let skipNumber = parseInt(msg.member.voice.channel.members.size / 2);

      return msg.channel.send(`**${msg.author.username}** inició una nueva votación para saltar la canción actual. Se necesita(n) **${skipNumber}** voto(s) para saltar la canción.`)

    }
    

  }
}