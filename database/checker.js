
const sqlite3 = require('sqlite3').verbose()
const config = require('../config.js');
const sql = new sqlite3.Database(config.dirBase)

async function tableVerific () {
 // TABLA: prefixes
 await sql.run('CREATE TABLE IF NOT EXISTS prefixes (idserver TEXT, prefix TEXT, status INTEGER DEFAULT 0)')

}

module.exports = {
 createTables: async function() {
  try {
   await tableVerific();
  } catch (error) {
   console.error(error)
  }
 }
}