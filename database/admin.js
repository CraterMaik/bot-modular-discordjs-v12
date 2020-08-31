const queries = require('./queries');

module.exports = {
 existsPrefix: async function (idserver) {
  let query = "SELECT * FROM prefixes WHERE idserver = ?"
  let result = await queries.getQuery(query, idserver)

  if (result != undefined) {
   return true

  } else {
   return false

  }
 },
 addPrefix: async function (idserver, prefix) {
  let query = "INSERT INTO prefixes (idserver, prefix) VALUES(?, ?)"
  await queries.runQuery(query, [idserver, prefix])

 },
 getPrefix: async function (idserver) {
  let query = "SELECT * FROM prefixes WHERE idserver = ?"
  let result = await queries.getQuery(query, idserver)

  return result;

 },
 updatePrefix: async function (idserver, prefix) {
  let query = "UPDATE prefixes SET prefix = ? WHERE idserver = ?"
  await queries.runQuery(query, [prefix, idserver])

 },
 deletePrefix: async function (idserver) {
  let query = "DELETE FROM prefixes WHERE idserver = ?"
  await queries.runQuery(query, idserver)

 },

}
