const expect = require('expect');

const { Users } = require('./users');


describe('Users', () => {

  // users seed data //
  var users;
  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Example Room'
    },
    {
      id: '2',
      name: 'Sarah',
      room: 'Example Room 2'
    },
    {
      id: '3',
      name: 'Jeff',
      room: 'Example Room'
    }];
  });

  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'Jack',
      room: 'Example Room'
    }
    var resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    var userId = '1';
    var user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    var userId = '99';
    var user = users.removeUser(userId);

    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should find a user', () => {
    var userId = '1';
    var user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it('should not find a user', () => {
    var userId = '99';
    var user = users.getUser(userId);

    expect(user).toNotExist();
  });

  it('should return names for example room', () => {
    var userList = users.getUserList('Example Room');

    expect(userList).toEqual(['Mike', 'Jeff']);
  });

  it('should return names for example room 2', () => {
    var userList = users.getUserList('Example Room 2');

    expect(userList).toEqual(['Sarah']);
  });

});
