const faker = require('faker');
const createCSVWriter = require('csv-writer').createObjectCsvWriter;

const USERS_CSV_HEADERS = ['email', 'username', 'password', 'firstName', 'lastName', 'deptCode'].map(ele => ({ id : ele, title : ele}));
const TICKETS_CSV_HEADERS = ['createdBy', 'assignedTo', 'createdAt', 'importanceLevel', 'closedAt', 'isResolved', 'subject', 'requestDetail'].map(ele => ( { id : ele, title : ele }));
const NOTES_CSV_HEADERS = ['ticketID', 'createdBy',  'createdAt', 'message'].map(ele => ( { id : ele, title : ele } ));

const DEPT_CODES = ['F_END', 'B_END', 'F_STACK'];

const NUM_USERS = 15;
const NUM_TICKETS = 100;
const NUM_NOTES = 200;


const usersCSVWriter = createCSVWriter({
  path : 'users.csv',
  header : USERS_CSV_HEADERS
});

const ticketsCSVWriter = createCSVWriter({
  path :  'tickets.csv',
  header : TICKETS_CSV_HEADERS
});

const notesCSVWriter = createCSVWriter({
  path : 'notes.csv',
  header : NOTES_CSV_HEADERS
});

const randomUserData = getFakeUserData(NUM_USERS);
usersCSVWriter.writeRecords(randomUserData).then(() => {
  console.log('Wrote fake user data to csv.')
});

const randomTicketData = getFakedTicketData(NUM_TICKETS);
ticketsCSVWriter.writeRecords(randomTicketData).then(() => {
  console.log('Wrote fake ticket data to csv.')
});

const randomNotesData = getFakeNotesData(NUM_NOTES);
notesCSVWriter.writeRecords(randomNotesData).then(() => {
  console.log('wrote fake ntoes data to csv.')
})

function getRandomDeptCode() {
  const randIdx = Math.floor(Math.random() * DEPT_CODES.length);
  return DEPT_CODES[randIdx]
};

function getFakeUserData(NUM_USERS) {
  const res = []
  const nonDupEmails = ['abc@gmail.com', 'something@gmail.com', 'wow@yahoo.com', 'testing1@gmail.com', 'j4@yahoo.com', 'jp.c@gmail.com', 'bob@gmail.com', 'abra@gmail.com', 'somi5495@gmail.com', 'kZPH@gmail.com', 'PAPHI@gmail.com', 'carolYoo@gmail.com', 'msm@gmail.com', 'wow@gmail.com', 'blehh@gmail.com']  
  for(let i = 0; i < NUM_USERS; i++) {
    res.push({
      email : nonDupEmails[i],
      username : faker.internet.userName(),
      password : '$2b$10$4AdvSm0CFJ6M0Orgw7fc9e5DemkHgfWlbRI4YeO0xnkD5dFQRjzs6', // bcrypt.hash('password', 10)
      firstName : faker.name.firstName(),
      lastName : faker.name.lastName(),
      deptCode : getRandomDeptCode()
    })
  };
  return res;
};

function getFakedTicketData(NUM_TICKETS) {
  const res = [];
  const fakeUsernames = randomUserData.map(obj => obj.username);
  
  for(let i = 0; i < NUM_TICKETS; i++) {
    res.push({
      createdBy : fakeUsernames[Math.floor(Math.random() * fakeUsernames.length)],
      assignedTo : fakeUsernames[Math.floor(Math.random() * fakeUsernames.length)],
      createdAt : faker.date.past(),
      importanceLevel : Math.floor(Math.random() * 5),
      closedAt : faker.date.future(),
      isResolved : Math.floor(Math.random() * 10) > 5,
      subject : faker.lorem.words(),
      requestDetail : faker.lorem.paragraph()
    })
  };
  return res;
};

function getFakeNotesData(NUM_NOTES) {
  const res = [];
  const randomUser = randomUserData.map(obj => obj.username)[Math.floor(Math.random() * randomUserData.length)];
  for(let i = 0; i < NUM_NOTES; i++) {
    res.push({
      ticketID : Math.floor(Math.random() * 100),
      createdBy : randomUser,
      createdAt : faker.date.past(),
      message : faker.lorem.paragraph(),
    });
  };
  return res;
};




