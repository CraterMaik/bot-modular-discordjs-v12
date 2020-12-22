const {
 Command
} = require('../../commands')
const config = require('../../config')

const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(config.ytKey)

module.exports = class playCommand extends Command {
 constructor() {
  super({
   name: 'play',
   aliases: [],
   category: 'music',
   priority: 7,
   permLvl: 0
  })
 }
 async execute(msg, args, discord, client) {
  const queue = client.queue;
  let guild = msg.guild;

  const map = client.skipvote;
  
  const voiceChannel = msg.member.voice.channel;

  if(!voiceChannel) return msg.channel.send('Debes estar conectado a un canal de voz.');
  
  async function play(guild, song) {
   const serverQueue = await queue.get(guild.id);

   if(!song) {
    await serverQueue.voiceChannel.leave();
    await queue.delete(guild.id);
    return;
   }

   const stream = ytdl(song.url, {
    filter: 'audioonly',
    highWaterMark: 1 << 25,
    quality: "highestaudio"
   })
   
   const dispatcher = await serverQueue.connection.play(stream)
    .on('finish', async () => {
     serverQueue.songs.shift();
     
     await map.delete(guild.id);
     await play(guild, serverQueue.songs[0])

    })
    .on('error', (error) => console.log(error));

    dispatcher.setVolume(serverQueue.volume)

    let durationSeconds = song.duration.seconds < 9 ? '0' + song.duration.seconds : song.duration.seconds;
    let durationMinutes = song.duration.minutes < 9 ? '0' + song.duration.minutes : song.duration.minutes;
    let durationHours = song.duration.hours < 9 ? '0' + song.duration.hours : song.duration.hours;
    // 02:05:22
    const embedSong = new discord.MessageEmbed()
     .setTitle(song.title)
     .setColor("RANDOM")
     .setThumbnail(song.thumbnail)
     .setDescription(`Duración: **${durationHours}:${durationMinutes}:${durationSeconds}**`)
     .setURL(song.url)
     .setFooter(song.publish);

    return msg.channel.send(`Reproduciendo ahora:`, {embed: embedSong})

  }
  async function handleVideo(video, playlist) {
   const serverQueue = await queue.get(guild.id);
   const song = {
    title: video.title,
    id: video.id,
    duration: video.duration,
    publish: video.publishedAt,
    thumbnail: video.thumbnails.default.url,
    url: `https://www.youtube.com/watch?v=${video.id}`

   }

   if (serverQueue) {
    // Que ya existe dispatcher Reproduciendo
    await serverQueue.songs.push(song)
    if(playlist) return;

    let durationSeconds = song.duration.seconds < 9 ? '0' + song.duration.seconds : song.duration.seconds;
    let durationMinutes = song.duration.minutes < 9 ? '0'+song.duration.minutes : song.duration.minutes;
    let durationHours = song.duration.hours < 9 ? '0' + song.duration.hours : song.duration.hours;
     // 02:05:22
    const embedQueue = new discord.MessageEmbed()
     .setTitle(song.title)
     .setColor("RANDOM")
     .setThumbnail(song.thumbnail)
     .setDescription(`Duración: **${durationHours}:${durationMinutes}:${durationSeconds}**`)
     .setURL(song.url)
     .setFooter(song.publish);

    // console.log(song.duration);

    return msg.channel.send('Canción agrega a la cola de espera: ', { embed: embedQueue });
    

   } else {
    // No existe
    const queueConstruct = {
     textChannel: msg.channel,
     voiceChannel,
     connection: null,
     songs:[],
     playing: true,
     volume: 0.5
    }

    try {
     await queue.set(guild.id, queueConstruct)
     await queueConstruct.songs.push(song)

     const connection = await voiceChannel.join()
     queueConstruct.connection = connection;

     await play(guild, queueConstruct.songs[0])
    } catch (error) {
     msg.channel.send('Hubo un error de reproducción.')
    }
    

   }

  }

  if(!args[0]) return msg.channel.send('Debes agregar un enlace de youtube.')
  let video;

  
  if (ytdl.validateURL(args[0])) {
   video = await youtube.getVideo(args[0])
   
  } else {
   let song = args.join(' ');
   //[0]risitas [1]altas
   // risitas altas
   try {
    let videos = await youtube.searchVideos(song, 10)

    if (!videos.length) return msg.channel.send('No se encontraron resultados de busqueda, pruebe enviando el enlace de Youtube')
    let index = 0
    const embed = new discord.MessageEmbed()
     .setDescription(`${videos.map((video) => `**${++index}** - ${video.title}`).join('\n')}`)
     .setColor('RANDOM')

    msg.channel.send(embed)
    let optionSearch;

    try {
     optionSearch = await msg.channel.awaitMessages((msg2) => msg2.content > 0 && msg2.content < 11 && msg.author.id === msg2.author.id, {
      max: 1,
      time: 30000,
      errors: ['time']
     });
    } catch (error) {
     return msg.channel.send('La opción de busqueda se ha cancelado.')

    }

    const videoIndex = parseInt(optionSearch.first().content, 10)

    video = await youtube.getVideoByID(videos[videoIndex - 1].id)
    
   } catch (error) {
    return msg.channel.send('Hubo un error en la busqueda de resultados.')

   }
   
   
  }


  
  handleVideo(video, false);
 }
}
