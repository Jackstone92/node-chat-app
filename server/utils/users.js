
// Users Data Structure //

class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    var user = { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    var user = this.getUser(id);

    if(user) {
      // creates new array with item removed //
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }

  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  }

  getUserList(room) {
    var users = this.users.filter((user) => {
      // return users in same room //
      return user.room === room;
    });

    var namesArray = users.map((user) => {
      // return usernames //
      return user.name;
    });

    return namesArray;
  }

}


module.exports = { Users };
