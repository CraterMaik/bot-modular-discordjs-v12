const fs = require('fs');
const util = require('./util.js');
const config = require('./config.js')
//const 

class Command {
 constructor(commandInfo) {
  this.name = commandInfo.name;
  this.args = commandInfo.args;
  this.category = commandInfo.category;
  this.aliases = commandInfo.aliases;
  this.permLvl = commandInfo.permLvl;
  this.priority = commandInfo.priority;
 }
 checkArgs(msg, msgArgs) {
  var valid = true
  if (this.args != undefined) {
   if (msgArgs.length == 0 && this.args.find(x => !x.optional) != undefined) {
    util.getSend(msg, 'Requiere un argumento');
    return false;
   }
   let argsPos = 0
   for (let cmdArg of this.args) {

    if (cmdArg[argsPos] != undefined) {
     if (!cmdArg.optional) {
      util.getSend(msg, cmdArg.missingError);
      break;
     }
    } else {
     //Verificar si es válido
     if (!cmdArg.checkArg(msg, msgArgs[argsPos])) {
      if (!cmdArg.optional || cmdArg.failOnInvalid) {
       //enviar un mensaje de error
       util.getSend(msg, cmdArg.invalidError);

       valid = false;
       break;
      }
     } else {
      if (cmdArg.breakOnValid) {
       break;
      }
      //Incremento para nuevo argumento de mensaje
      argsPos++;
     }
    }
   }
  }
  return valid;
 }
}

class Argument {
 constructor(argInfo) {
  this.optional = argInfo.optional;
  this.type = argInfo.type;
  this.interactiveMsg = argInfo.interactiveMsg;
  this.possibleValues = argInfo.possibleValues;
  //util.getSend(msg, ':x: Ese argumento no es valido.');
  //util.getSend(msg, ':x: ¡Error!, falta un argumento.')
  //util.getSend(msg, "No tienes suficientes permisos para eso.")
  //cuando el comando requiere argumento:
  this.missingError = argInfo.missingError;
  //el argumento no es valido:
  this.invalidError = argInfo.invalidError;
 }
 checkArg(msg, msgArg) {
  var valid = true;

  switch (this.type) {
   case 'mention':
    //<@8181518181818181>
    let mention = msgArg.match(/<@!?(.*?[0-9])>/);
    if (mention == null || !msg.guild.members.cache.has(mention[1])) {
     valid = false;
    }
    break;
   case 'int':
    if (!Number(msgArg)) {
     valid = false;
    }
    break;
   case 'channel':
    //<#1586128918181818>
    let channel = msgArg.match(/<#(.*?)>/);
    if (channel == null || !msg.guild.channels.cache.has(channel[1])) {
     valid = false;
    }
    break;
  }

  return valid;
 }
}

class Category {
 constructor(categoryInfo) {
  this.name = categoryInfo.name
  this.priority = categoryInfo.priority;
  this.commands = new Map();

 }
 addCommand(command) {
  this.commands.set(command.name, command)
 }
}

module.exports = {
 Command: Command,
 Argument: Argument,
 Category: Category,
 namesAliases: [],
 categories: new Map(),
 commands: new Map(),
 registerCategories: function (categories) {
  for (category of categories) {
   var category = new Category(category)
   this.categories.set(category.name, category)
  }
 },
 loadFile: function (path) {
  return require(path)
 },
 registerCommands: function () {
  var cmds = fs.readdirSync(`./commands/`);
  for (var module of cmds) {
   var files = fs.readdirSync(`./commands/${module}`);
   for (var file of files) {
    if (fs.statSync(`./commands/${module}/${file}`).isFile()) {
     var keys = this.loadFile(`./commands/${module}/${file}`)
     if (typeof keys != 'object') {
      keys = {
       keys
      }
     }
     for (var key in keys) {
      if (keys[key].prototype instanceof Command) {
       var command = new keys[key]();

       if (!this.categories.has(module)) {
        this.registerCategories([module])
       }

       this.commands.set(command.name, command)
       this.namesAliases.push(command.name, ...command.aliases)

       this.categories.get(module).addCommand(command)

      }
     }
    }
   }
  }
 },
 checkPerms: function (msg, permLvl) {
  //Comprobar si el autor del mensaje tiene permisos de
  //usar un comando, devuele verdadero, falso.

  for (var i = 0; i < config.superusers.length; i++) {
   if (msg.author.id === config.superusers[i]) {
    return true;
   }
  }

  let perms = msg.member.permissions;
  if (perms.has('ADMINISTRATOR')) {
   return true;
  }

  let userPermsLvl = 1;
  if (userPermsLvl >= permLvl) {
   return true;
  }

  util.getSend(msg, 'No tienes permisos suficientes para usar este comando.');
  return false;
 },
 getCmd: function (arg) {
  var command = this.commands.get(arg);

  if (!command) {
   this.commands.forEach(function (aCmd) {
    if (aCmd.aliases.includes(arg)) {
     command = aCmd;
     return;
    }
   })
  }
  return command;

 },
 checkValidCmd: async function (msg, args, prefix) {
  var command = this.getCmd(args[0]);

  if (msg.content.startsWith(prefix) && command != null) {
   let result = this.checkPerms(msg, command.permLvl)
   if (result) {
    return true;
   }
  }

  return false;

 },
 executeCmd: async function (msg, args, discord, client) {
  let cmd = this.getCmd(args[0])
  if (cmd.checkArgs(msg, args.slice(1))) {
   await cmd.execute(msg, args.slice(1), discord, client)
  }
 }
}