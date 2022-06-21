module.exports = (users) => {
  users.map((user) => {
    console.log(''.padStart(40, '_'));
    console.log('login: ' + user.username);
    console.log('location: ' + user.location);
    console.log(''.padStart(40, '_'));
  });
};
