// require our application.js policy so we can extend it
const ApplicationPolicy = require("./application");

module.exports = class TopicPolicy extends ApplicationPolicy {

  //only want admins to create new topics, so define new new()
 new() {
   return this._isAdmin();
 }

// delegates to new()
 create() {
   return this.new();
 }

 // only admins can edit, checks that user is an admin
 edit() {
   return this._isAdmin();
 }

 update() {
   return this.edit();
 }

 destroy() {
   return this.update();
 }
}
