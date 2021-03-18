import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
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
  Dimmer,
  Loader
} from "semantic-ui-react";
import Api from "../../backendAPI";
import { useDispatch } from "react-redux";
import { deleteTicket } from "../../actions/ticketActions";
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

  const [showEditNote, setShowEditNote] = useState(null);
  const [editNote, setEditNote] = useState("");


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

  const handleDelete = async (ticketID) => {
    setLoading(true);
    dispatch(deleteTicket(ticketID));
    setLoading(false);
    history.goBack();
  };

  // SUBMITTING NOTES
  const handleNewNoteSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await Api.request(
      `http://localhost:5000/tickets/${ticketID}/notes`,
      { message: note, createdBy: currentUser.username },
      "POST"
    );
    console.log('Adding note', res.data);
    setTicket({ ...res.data.ticket})
    setNote("");
    setLoading(false);
  };

  // EDITING NOTES
  const handleNoteUpdateSubmission = async (e, ticketID, noteID, data) => {
    e.preventDefault();
    setLoading(true);
    const res = await Api.request(`http://localhost:5000/tickets/${ticketID}/notes/${noteID}`, { message : data }, 'PUT');
    setTicket({ ...res.data.ticket });
    setEditNote("")
    setShowEditNote(null);
    setLoading(false);
  };
  
  // DELETING NOTES
  const handleNoteDeletion = async (noteID) => {
    setLoading(true);
    const res = await Api.request(`http://localhost:5000/tickets/${ticketID}/notes/${noteID}`, {}, 'DELETE');
    console.log('Deleting note', res.data);
    setTicket(ticket => {
      return {
        ...ticket,
        notes : [...ticket.notes].filter(note => note.id !== noteID)
      }
    })
    setLoading(false);
  };

  if (loading) return <Dimmer><Loader /></Dimmer>;

  return (
    <Container
      style={{
        marginTop: "1rem",
        boxShadow: "2px 2px 7px 0 rgb(0 0 0 / 12%)",
        padding: "0.5rem",
      }}
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
            <b>Created At :</b>{" "}
            {ticket.createdat && ticket.createdat.substr(0, 10)}
          </Grid.Column>
          <Grid.Column width={6}>
            <b>Closed At :</b>{" "}
            {ticket.closedat && ticket.closedat.substr(0, 10)}
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
          <Comment.Group style={{ marginLeft: "1rem" }}>
            {notes.map((note) => (
              <div key={note.id}>
                <Comment >
                  <Comment.Avatar src="https://palmbayprep.org/wp-content/uploads/2015/09/user-icon-placeholder.png" />
                  <Comment.Content>
                    <Comment.Author>{note.createdby}</Comment.Author>
                    <Comment.Metadata>
                      <span>
                        {new Date(
                          note.createdat.substr(0, 10)
                        ).toLocaleString()}
                      </span>
                    </Comment.Metadata>
                    <Comment.Text>{note.message}</Comment.Text>
                    {currentUser.username === note.createdby && (
                      <>
                        <Comment.Actions>
                          <Comment.Action onClick={() => setShowEditNote(note.id)}> Edit</Comment.Action>
                          <Comment.Action onClick={() => handleNoteDeletion(note.id)}>Delete</Comment.Action>
                        </Comment.Actions>
                        {showEditNote === note.id && (
                          <Form reply onSubmit={(e) => handleNoteUpdateSubmission(e, ticket.id, note.id, editNote)}>
                            <Form.TextArea  
                              value={editNote}
                              onChange={(e) => setEditNote(e.target.value)}
                            />
                            <Button content="Edit notes" labelPosition="left" icon="edit" color="green" />
                          </Form>
                        )}
                      </>
                    )}
                  </Comment.Content>
                </Comment>
                <Divider horizontal />
              </div>
            ))}
          </Comment.Group>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Form reply onSubmit={handleNewNoteSubmission}>
              <Form.TextArea
                onChange={(e) => setNote(e.target.value)}
                value={note}
                placeholder="Add any notes here"
                rows={5}
              />
              <Button
                content="Add Note"
                labelPosition="left"
                icon="edit"
                primary
                floated="left"
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

        <Button.Group attached="bottom">
          <Button secondary size="small" onClick={() => history.goBack()}>
            <Icon name="arrow left" />
            Back
          </Button>
          <Button size="small" negative onClick={() => handleDelete(ticketID)}>
            Delete
          </Button>
        </Button.Group>
      </Grid>
    </Container>
  );
};
export default Ticket;
