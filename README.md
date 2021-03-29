# ticket
- You can find the proposal for this project [here](https://docs.google.com/document/d/1opImiNlqlwboVWsqHiHm0qbHQ9htLa7FeMZpJPCkCKA/edit?usp=sharing)
- Only designated site admins may create/update accounts as this was meant to be used for internal purposes.
- Engineers or technicians can search through tickets, sorting by various fields such as 'assigned to me', 'group by department', 'search by client', and etc.
- Engineers or technicians can also perform CRUD on tickets, and notes for those tickets.

# Requirements
- All the required packages are listed under `package.json`.
- You need to have postgresql installed for this to work.
- After installing postgresql, create a database named `ticket_system` and run the sql file `psql < data.sql` to populate the database.

# DB Schema
- You can see the database schema [here](https://i.imgur.com/vLStnsZ.png)


# How to start the app
1. start the backend server first, under `/backend` you'll find `server.js`, start the app by `node server.js` or if you have nodemon installed, `nodemon server.js`
2. Start the react app. Navigate to `/frontend` and type `npm start` to start the React app.
3. If you look at the `/backend/data.sql` file you'll find that there is one user that has been inserted upon seeding the db. That user has admin rights, and the credentials are username : admin, password : admin. Supply those credentials to the initial login page. 

# How to Run Tests
* You may see three test files located under `backend/__tests__`.
* Simply run `jest <name_of_test_file>` to run the tests.

# Technologies Utilized 
* Postgresql
* JS
* Node
* Express
* ReactJS
* Semantic UI 




