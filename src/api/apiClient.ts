const axios = require('axios');
const R = require('ramda');

const mapUsersArray = require('../utils/users.ts');
const getUniqueValues = require('../utils/uniqueValues.ts');
const dbClient = require('./dbQueries.ts');

const setLangsArray = (repos) => {
  return repos.data.map((element) => element.language);
};

module.exports = {
  fetchUser: async (login) => {
    const getUserPromise = (login) =>
      axios.get(`https://api.github.com/users/${login}`);
    const getReposPromise = (login) =>
      axios.get(`https://api.github.com/users/${login}/repos`);
    const composed = R.pipe(getUserPromise, R.andThen(dbClient.setUserToDb));
    const langArray = R.pipe(
      getReposPromise,
      R.andThen(setLangsArray),
      R.andThen(getUniqueValues),
      R.andThen(dbClient.insertLangsToDb)
    );
    const userId = await composed(login);
    const languageId = await langArray(login);
    dbClient.insertUserWithLangToDB(userId, languageId);
  },

  getUsers: () => {
    dbClient.getUsers().then((users) => {
      console.log(users);
    });
  },

  getUsersByLocation: (location) => {
    if (location !== 'null') {
      dbClient
        .getUsersByLocation(location)
        .then((users) => mapUsersArray(users));
    } else {
      dbClient.getUsersWithNullLocation().then((users) => mapUsersArray(users));
    }
  },

  getUsersByLangs: (language) => {
    dbClient.getUsersByLangs(language).then((users) => console.log(users));
  },
};
