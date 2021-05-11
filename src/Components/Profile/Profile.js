import React, { useState, useEffect } from "react";
import salt from "../../Utility/Salt";
import bcrypt from "bcryptjs";
import "./Profile.css";
import _ from "lodash";
import {
  Segment,
  Divider,
  Grid,
  Image,
  Modal,
  Button,
  Form,
} from "semantic-ui-react";
import { withRouter } from "react-router-dom";

import { validatePassword } from "../../Utility/Validation";
import updateProfile, { getUserInfo, getUser } from "./profileservice";

import Menubar from "../../Containers/Menubar/Menubar";

function Profile(props) {
  if (localStorage.getItem("user") === null) {
    props.history.push("/loginsignup");
  }
  const [user, setUser] = useState("");
  const tempuser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    console.log("effect");
    getUser(tempuser).then((res) => {
      setUser(res.data);
    });
  });

  var profileImage =
    "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png";
  if (tempuser.profileImage !== null)
    profileImage = "data:image/png;base64," + tempuser.profileImage.file;

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [editField, setEditField] = useState({ key: null, content: null });
  const [passwordError, setPasswordError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const [password, setPassword] = useState({
    password: "",
    confirmPassword: "",
  });

  const segmentstyle = {
    width: "90%",
    marginLeft: "5%",
    marginBottom: "50px",
    marginTop: "85px",
    zIndex: "-1",
  };
  const changestyle = { color: "#79ced1", cursor: "pointer" };

  function handleEdit(e, name = e.target.name) {
    setEdit(name);
    setEditField({ key: name, content: user[name] ? user[name] : "" });
    setOpen(true);
  }

  function handleEditField(e, { value }) {
    setEditField({
      key: edit,
      content: value,
    });
  }

  function handlePasswordErrors() {
    var flag = 0;
    if (password.password === "" || password.password === null) {
      setPasswordError("Please enter a password");
      flag = 1;
    } else {
      setPasswordError(null);
      if (!validatePassword(password.password)) {
        flag = 1;
        setPasswordError(
          "Should be of atleast length 8, requires one lowercase, one uppercase alphabet, and a number "
        );
      }
    }

    if (password.confirmPassword === "" || password.confirmPassword === null) {
      setConfirmPasswordError("Confirm your password");
      flag = 1;
    } else {
      setConfirmPasswordError(null);
      if (password.confirmPassword !== password.password) {
        flag = 1;
        setConfirmPasswordError("Passwords do not match");
      }
    }

    return flag;
  }

  function handleEditSubmit(e) {
    setLoading(true);
    let editeduser = null;
    if (editField.key === "password") {
      var error = handlePasswordErrors();
      if (error === 0) {
        bcrypt.genSalt(salt, function (err, salt) {
          bcrypt.hash(password.password, salt, function (err, hash) {
            editeduser = { ...user, password: hash };
            console.log(editeduser);
            updateProfile(editeduser).then((res) => {
              getUserInfo(res.data.userId).then((res) => {
                localStorage.setItem("user", JSON.stringify(res.data));
                setUser(JSON.parse(localStorage.getItem("user")));
              });
            });
            setLoading(false);
            setOpen(false);
          });
        });
      } else setLoading(false);
    } else {
      editeduser = { ...user, [editField.key]: editField.content };

      console.log(editeduser);
      updateProfile(editeduser).then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(JSON.parse(localStorage.getItem("user")));
      });
      setLoading(false);
      setOpen(false);
    }
  }

  function onPasswordChange(event, { name, value }) {
    setPassword({ ...password, [name]: value });
  }

  const passwordInput =
    passwordError === null ? (
      <Form.Input
        placeholder='Password'
        name='password'
        type='password'
        onChange={onPasswordChange}
      />
    ) : (
      <Form.Input
        error={passwordError}
        placeholder='Password'
        name='password'
        type='password'
        onChange={onPasswordChange}
      />
    );

  const confirmPasswordInput =
    confirmPasswordError === null ? (
      <Form.Input
        placeholder='Confirm Password'
        name='confirmPassword'
        type='password'
        onChange={onPasswordChange}
      />
    ) : (
      <Form.Input
        error={confirmPasswordError}
        placeholder='Confirm Password'
        name='confirmPassword'
        type='password'
        onChange={onPasswordChange}
      />
    );

  return (
    <>
      <Menubar text='Profile' toggleSideBar={props.toggleSideBar} />

      {user ? (
        <>
          <Segment inverted style={segmentstyle} className='profilesegment'>
            <h3>{user.name}'s Profile</h3>
            <Divider inverted />
            <Grid divided>
              <Grid.Row verticalAlign='middle' style={{ marginTop: "20px" }}>
                <Grid.Column computer={8} mobile={16}>
                  <Image
                    src={profileImage}
                    size='small'
                    style={{ cursor: "pointer" }}
                    circular
                    centered
                    onClick={(e) => props.history.push("/profileimage")}
                  />
                </Grid.Column>
                <Grid.Column computer={8} mobile={16}>
                  <h1 style={{ color: "#adefff", marginTop: "20px" }}>
                    {user.name}
                  </h1>
                  <a name='name' style={changestyle} onClick={handleEdit}>
                    Edit <i name='name' class='fas fa-edit fa-fw'></i>
                  </a>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column computer={8} mobile={16}>
                  <Segment inverted>
                    <Divider inverted />
                    <h4>Email</h4>
                    <h3> {user.email} </h3>
                    <a name='email' style={changestyle} onClick={handleEdit}>
                      Change
                    </a>
                  </Segment>
                </Grid.Column>
                <Grid.Column computer={8} mobile={16}>
                  <Segment inverted>
                    <Divider inverted />
                    <h4>Password</h4>
                    <h3>******</h3>
                    <a name='password' style={changestyle} onClick={handleEdit}>
                      Change
                    </a>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <Divider inverted />
            <h4>About</h4>
            <p>{user.about}</p>
            {user.about ? (
              <a name='about' style={changestyle} onClick={handleEdit}>
                Change
              </a>
            ) : (
              <a name='about' style={changestyle} onClick={handleEdit}>
                Add an About
              </a>
            )}

            <Modal
              open={open}
              onClose={() => {
                setOpen(false);
                setEditField({ key: null, content: null });
              }}
              size='tiny'
              dimmer={true}
            >
              <Modal.Header
                style={{
                  backgroundColor: "rgb(36, 35, 35)",
                  color: "white",
                  borderColor: "#4d4c4c",
                }}
              >
                Edit {_.startCase(edit)}
              </Modal.Header>
              <Modal.Content
                style={{
                  backgroundColor: "rgb(36, 35, 35)",
                  color: "white",
                }}
              >
                {edit !== "password" ? (
                  <Form>
                    {edit !== "about" ? (
                      <Form.Input
                        value={editField.content}
                        placeholder={_.startCase(edit)}
                        onChange={handleEditField}
                      />
                    ) : (
                      <Form.TextArea
                        value={editField.content}
                        placeholder={_.startCase(edit)}
                        onChange={handleEditField}
                        rows='6'
                      />
                    )}
                  </Form>
                ) : loading ? (
                  <Form loading inverted>
                    {passwordInput}
                    {confirmPasswordInput}
                  </Form>
                ) : (
                  <Form>
                    {passwordInput}
                    {confirmPasswordInput}
                  </Form>
                )}
              </Modal.Content>
              <Modal.Actions
                style={{
                  backgroundColor: "rgb(36, 35, 35)",
                  color: "white",
                }}
              >
                <Button negative onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button color='teal' onClick={handleEditSubmit}>
                  Save
                </Button>
              </Modal.Actions>
            </Modal>

            <Divider />
            <Segment inverted style={{ display: "inline-block", width: "30%" }}>
              <h4>Posts</h4>
              <h1>{user.posts.length}</h1>
            </Segment>
            <Segment inverted style={{ display: "inline-block", width: "30%" }}>
              <h4>Likes</h4>
              <h1>{user.receivedLikes.length}</h1>
            </Segment>
            <Segment inverted style={{ display: "inline-block", width: "30%" }}>
              <h4>Comments</h4>
              <h1>{user.receivedComments.length}</h1>
            </Segment>
          </Segment>
        </>
      ) : (
        <div style={{ height: "100vh" }}></div>
      )}
    </>
  );
}

export default withRouter(Profile);
