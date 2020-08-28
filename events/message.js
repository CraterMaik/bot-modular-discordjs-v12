const config = require('../config')
const commands = require('../commands')

const Discord = require('discord.js')
const db = require('../database/database')


module.exports = async (client, message) => {
 if(message.author.bot) return;

 let existsPrefix = await db.admin.existsPrefix(message.guild.id)
 let prefix = config.prefix;

 if (existsPrefix) {
  let dataPrefix = await db.admin.getPrefix(message.guild.id)
  prefix = dataPrefix.prefix;
 }

 let cmd = message.content.slice(prefix.length)
 
 if(cmd != undefined) {
  cmd = cmd.split(' ')
  
 }

 let result = await commands.checkValidCmd(message, cmd, prefix);
 if(result) {
  commands.executeCmd(message, cmd, Discord, client)

 }

}