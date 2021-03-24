import { useSelector } from "react-redux";
import createCSVWriter from "csv-writer";

const WriteCSV = (props) => {
  const tickets = useSelector((store) => store.tickets);
  const users = useSelector((store) => store.users);
  const USERS_CSV_HEADERS = Object.keys(users[0]).map(ele => ( { id : ele, title : ele } ));
  const TICKETS_CSV_HEADERS = Object.keys(tickets[0]).map(ele => ( { id : ele, title : ele } ));

  const usersCSVWriter = createCSVWriter.createObjectWriter({
    path : 'users.csv',
    header : USERS_CSV_HEADERS
  });

  const ticketsCSVWriter = createCSVWriter.createObjectWriter({
    path : 'tickets.csv',
    header : TICKETS_CSV_HEADERS
  });

  const handleTicketsCSVDownload = () => {
    ticketsCSVWriter.writeRecords(tickets).then(() => {
      console.log('Wrote tickets data to csv');
    });
  };

  const handleUsersCSVDownload = () => {
    usersCSVWriter.writeRecords(users).then(() => {
      console.log('Wrote users data to csv');
    });
  };

};
