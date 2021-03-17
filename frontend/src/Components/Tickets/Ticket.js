import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import Spinner from "../UI/Spinner";
import {
  Container,
  Header,
  Grid,
  Divider,
  Icon,
  Table,
  Comment,
  Form,
  Button,
} from "semantic-ui-react";
import Api from "../../backendAPI";
import { useDispatch } from "react-redux";
import { deleteTicket, } from "../../actions/ticketActions";
import AuthContext from "../../context/AuthContext";

const Ticket = (props) => {
  const { ticketID } = useParams();
  const [ticket, setTicket] = useState({});
  const notes = ticket.notes || [];
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const ticketResults = await Api.request(
          `http://localhost:5000/tickets/${ticketID}`
        );
        const ticket = ticketResults.data.ticket;
        setTicket({ ...ticket });
      } catch (e) {
        setTicket(null);
      }
      setLoading(false);
    };
    fetchTicket();
  }, [ticketID]);

  const handleDelete = async ticketID => {
    setLoading(true);
    dispatch(deleteTicket(ticketID));
    setLoading(false);
    history.goBack();
  };

  const handleNewNoteSubmission = async e => {
    setLoading(true);
    const res = await Api.request(`http://localhost:5000/tickets/${ticketID}/notes`, { message: note, createdBy: currentUser.username }, 'POST');
    const updatedTicket = res.data.ticket;
    setTicket({ ...updatedTicket });
    setLoading(false);
  }
  console.log("ticket", ticket);

  if (loading) return <Spinner />;

  return (
    <Container
      style={{ marginTop: "1rem", boxShadow: "2px 2px 7px 0 rgb(0 0 0 / 12%)", padding: "0.5rem" }}
    >
      <Header as="h3" block>
        Ticket #{ticket.id}
      </Header>

      <Grid>
        <Divider horizontal>
          <Header as="h4">
            <Icon name="calendar" />
            Dates
          </Header>
        </Divider>

        <Grid.Row>
          <Grid.Column width={6}>
            <b>Created At :</b> {ticket.createdat && ticket.createdat.substr(0, 10)}
          </Grid.Column>
          <Grid.Column width={6}>
            <b>Closed At :</b> {ticket.closedat && ticket.closedat.substr(0, 10)}
          </Grid.Column>
        </Grid.Row>

        <Divider horizontal>
          <Icon name="user" /> Client Information
        </Divider>

        <Grid.Row>
          <Grid.Column>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={2}>Created By</Table.Cell>
                  <Table.Cell>{ticket.createdby}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Assigned To</Table.Cell>
                  <Table.Cell>{ticket.assignedto}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Assigned Group</Table.Cell>
                  <Table.Cell>{ticket.assignedgroup}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>

        <Divider horizontal>Details</Divider>
        <Grid.Row>
          <Grid.Column>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={2}>Subject</Table.Cell>
                  <Table.Cell>{ticket.subject}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Request Details</Table.Cell>
                  <Table.Cell>{ticket.requestdetail}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>

        <Divider horizontal>
          <Icon name="file alternate" />
          Notes
        </Divider>
        <Grid.Row>
          <Grid.Column>
            {notes.map((note) => (
              <Comment>
                <Comment.Content>
                  <Comment.Author>{note.createdby}</Comment.Author>
                  <Comment.Metadata>
                    <div>{note.createdat}</div>
                  </Comment.Metadata>
                  <Comment.Text>{note.message}</Comment.Text>
                </Comment.Content>
              </Comment>
            ))}
            <Form reply>
              <Form.TextArea 
                onChange={(e) => setNote(e.target.value)} 
                value={note} 
                placeholder="Add any notes here"
                rows={6} 
              />
              <Button
                content="Add Note"
                labelPosition="left"
                icon="edit"
                primary
                onClick={handleNewNoteSubmission}
                floated="right"
              />
            </Form>
          </Grid.Column>
        </Grid.Row>

        <Divider horizontal>
          <Icon name="check circle outline" />
          Status
        </Divider>
        <Grid.Row>
          <Grid.Column>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={2}>Importance Level</Table.Cell>
                  <Table.Cell>{ticket.importancelevel}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Ticket Status</Table.Cell>
                  <Table.Cell>
                    {!ticket.isresolved ? "Open" : "Closed"}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Header block>
              <Button onClick={() => history.goBack()}>
                <Icon name="arrow left" />
                Back
              </Button>
              <Button onClick={() => handleDelete(ticket.id)}>Delete</Button>
            </Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};
export default Ticket;
