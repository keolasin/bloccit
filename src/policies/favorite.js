const ApplicationPolicy = require("./application");

module.exports = class FavoritePolicy extends ApplicationPolicy {
  // to delete, user should be the owner
  destroy(){
    return this._isOwner();
  }
}
