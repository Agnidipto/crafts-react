import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Image, Grid, Menu, Segment, Visibility } from "semantic-ui-react";
import Menubar from "../../Containers/Menubar/Menubar";
import "./MyFeed.css";

function MyFeed(props) {
  const [activeItem, setActiveItem] = useState("posts");
  const user = JSON.parse(localStorage.getItem("user"));
  const profileImage = "data:image/png;base64," + user.profileImage.file;

  function handleItemClick(event, { name }) {
    setActiveItem(name);
  }
  return (
    <>
      <Menubar text='My Feed' toggleSideBar={props.toggleSideBar} />
      <div className='myfeed'>
        <Grid>
          <Grid.Row style={{ backgroundColor: "#1b1c1d" }}>
            <Grid.Column computer={3} tablet={16} className='profileImage'>
              <Image
                circular
                src={profileImage}
                style={{ maxHeight: "220px" }}
              />
            </Grid.Column>
            <Grid.Column
              computer={13}
              tablet={16}
              style={{ textAlign: "center" }}
            >
              <h1>{user.name}</h1>
              <h1>About</h1>
              <p>{user.about}</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Segment inverted>
          <Menu inverted pointing secondary>
            <Menu.Item
              name='posts'
              active={activeItem === "posts"}
              onClick={handleItemClick}
            />
            <Menu.Item
              name='notifications'
              active={activeItem === "notifications"}
              onClick={handleItemClick}
            />
          </Menu>
        </Segment>

        <div class='post-notification'>
          <Segment inverted attached='top'>
            <h1>Hello</h1>
          </Segment>
          <Segment inverted attached>
            <h1>Hello</h1>
          </Segment>
          <Segment inverted attached>
            <h1>Hello</h1>
          </Segment>
          <Segment inverted attached>
            <h1>Hello</h1>
          </Segment>
          <Segment inverted attached>
            <h1>Hello</h1>
          </Segment>
          <Segment inverted attached>
            <h1>Hello</h1>
          </Segment>
          <Segment inverted attached>
            <h1>Hello</h1>
          </Segment>
          <Segment inverted attached='bottom'>
            <h1>Hello</h1>
          </Segment>
        </div>
      </div>
    </>
  );
}

export default withRouter(MyFeed);
