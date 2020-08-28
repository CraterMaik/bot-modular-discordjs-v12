const sqlite3 = require('sqlite3').verbose();
const config = require('../config.js');
const sql = new sqlite3.Database(config.dirBase)

module.exports = {

 runQuery: async function (query, args) {
  try {
   await sql.run(query, args)
  } catch (e) {
   console.error(e)
  }
 },
 getQuery: async function (query, args) {
  try {
   var result =
    new Promise((resolve, reject) => {
     sql.get(query, args, function (err, row) {
      if (err) reject(err);
      resolve(row)
     })
    })


  } catch (e) {
   console.error(e)
  }
  return result;
 },
 allQuery: async function (query, args) {
  try {
   var result =
    new Promise((resolve, reject) => {
     sql.all(query, args, function (err, row) {
      if (err) reject(err);
      resolve(row)
     })
    })


  } catch (e) {
   console.error(e)
  }
  return result;
 }

}