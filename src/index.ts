#!/usr/bin/env node

const apiClient = require('./api/apiClient.ts');
const banner = require('./utils/banner.ts');
const db = require('./api/dbQueries.ts');

const main = () => {
  console.clear();
  const dataFromConsole = process.argv.slice(2, 4);
  const index = parseInt(dataFromConsole[0], 10);
  const secondParam = dataFromConsole[1];

  // db.drop()
  // try {
  //     db.setUpDatabase()
  // }catch(e){
  //     console.log('error');
  // }

  banner();
  if (index === 1) {
    apiClient.fetchUser(secondParam);
  } else if (index === 2) {
    apiClient.getUsers();
  } else if (index === 3) {
    apiClient.getUsersByLocation(secondParam);
  } else if (index === 4) {
    apiClient.getUsersByLangs(secondParam);
  }
};

main();
