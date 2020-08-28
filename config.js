module.exports = {
 dirBase : './database/base_1.db',
 superusers: [], //Puedes añadir ID
 token: 'TOKEN-HERE',
 prefix: '?',
 statusBOT: 'Estoy listo!',
 categories: [
  {name: "general", priority: 5},
  {name: "admin", priority: 8}
 ],
 groups: [
  {name: "User", permlvl: 0},
  {name: "Member", permlvl: 1},
  {name: "Mod", permlvl: 2},
  {name: "Admin", permlvl: 3}
 ]
 

}