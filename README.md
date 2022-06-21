# test task

Command line application, whose goals are:
1. Fetch information about a given GitHub user (passed as a command-line argument) using the GitHub API, and store it on one or more database tables - the mandatory fields are Name and Location, but you will get bonus points for additional fields;
2. Using a different command-line option, it should be possible to fetch and display all users already on the database (showing them on the command line);
3. Improving on the previous requirement, it should also be possible to list users only from a given location (again, using a command-line option);
4. Finally, the application should also query the programming languages this user seems to know/have repositories with, and store them on the database as well - allowing to query a user per location and/or programming languages;

## usage

Run terminal from `src` folder

Run command `npm run start index.ts 1 username` to load user _username_ from GitHub API to local database and log to the console.

Run command `npm run start index.ts 2` to log to the console all the users from the local database.

Run command `npm run start index.ts 3 location` to log to the console all the users with given _location_ from the local database.

Run command `npm run start index.ts 4 language` to log to the console all the users with given _language_ from the local database.