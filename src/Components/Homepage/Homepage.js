import React from "react";
import "./Homepage.css";
import { Segment, Message, Grid, Button, Modal } from "semantic-ui-react";
import Menubar from "../../Containers/Menubar/Menubar";
import { getUser } from "./homepageservice";
import NewPost from "../NewPost/NewPost";

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem("user")),
      confirmNewPostOpen: false,
    };

    this.handleNewPostClose = this.handleNewPostClose.bind(this);
  }

  handleNewPostClose() {
    this.setState({ confirmNewPostOpen: false });
  }

  componentWillMount() {
    if (this.state.user === null) {
      this.props.history.push("/signuplogin");
    }
    getUser(this.state.user).then((res) => {
      this.setState({ user: res.data });
      console.log(this.state.user);
    });
  }

  render() {
    const segmentStyle = { width: "95%", marginLeft: "2.5%" };
    return (
      <>
        <Menubar text='Homepage' toggleSideBar={this.props.toggleSideBar} />

        <div style={{ minHeight: "90vh" }}>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column computer={4} tablet={0} style={{ paddingRight: 0 }}>
                <div className='left-segment'>
                  <Segment inverted attached='top'>
                    <h1>Users</h1>
                  </Segment>
                  <Segment inverted attached>
                    <div className='top-segment'>
                      <p>User 1</p>
                      <p>User 1</p>
                      <p>User 1</p>
                      <p>User 1</p>
                      <p>User 1</p>
                      <p>User 1</p>
                      <p>User 1</p>
                    </div>
                  </Segment>
                </div>
              </Grid.Column>
              <Grid.Column computer={12} tablet={16}>
                <div className='right-segment'>
                  <Segment inverted attached='top' style={segmentStyle}>
                    <h1>Feed</h1>
                  </Segment>
                  <Segment inverted attached style={segmentStyle}>
                    <Button
                      color='teal'
                      className='new-post-button'
                      onClick={() => {
                        this.setState({ confirmNewPostOpen: true });
                      }}
                    >
                      New Post +
                    </Button>
                  </Segment>
                  <NewPost
                    confirmOpen={this.state.confirmNewPostOpen}
                    onClose={this.handleNewPostClose}
                  />

                  <Segment attached inverted style={segmentStyle}>
                    <Message color='black'>
                      <Message.Header>Was this what you wanted?</Message.Header>
                      <p>Did you know it's been a while?</p>
                    </Message>
                  </Segment>
                  <Segment attached inverted style={segmentStyle}>
                    <Message color='black'>
                      <Message.Header>Was this what you wanted?</Message.Header>
                      <p>Did you know it's been a while?</p>
                    </Message>
                  </Segment>
                  <Segment attached inverted style={segmentStyle}>
                    <Message color='black'>
                      <Message.Header>Was this what you wanted?</Message.Header>
                      <p>Did you know it's been a while?</p>
                    </Message>
                  </Segment>
                  <Segment attached inverted style={segmentStyle}>
                    <Message color='black'>
                      <Message.Header>Was this what you wanted?</Message.Header>
                      <p>Did you know it's been a while?</p>
                    </Message>
                  </Segment>
                  <Segment attached inverted style={segmentStyle}>
                    <Message color='black'>
                      <Message.Header>Was this what you wanted?</Message.Header>
                      <p>Did you know it's been a while?</p>
                    </Message>
                  </Segment>
                  <Segment attached inverted style={segmentStyle}>
                    <Message color='black'>
                      <Message.Header>Was this what you wanted?</Message.Header>
                      <p>Did you know it's been a while?</p>
                    </Message>
                  </Segment>
                  <Segment inverted attached='bottom' style={segmentStyle}>
                    <p>The end is nigh!</p>
                  </Segment>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </>
    );
  }
}

export default Homepage;
