module.exports = {
 getSend: function (msg, text) {
  msg.channel.send(text);
 },
 getLanguage: function (idserver) {
  let lang = require("./languages/ES-es.json");
  return lang;

 }
}