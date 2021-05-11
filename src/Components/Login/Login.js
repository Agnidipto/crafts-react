import React, { useState } from "react";
import bcrypt from "bcryptjs";
import { withRouter } from "react-router-dom";
import "./Login.css";
import { Confirm, Form, Button, Modal, Segment } from "semantic-ui-react";
import { getUser, getUserInfo } from "./loginservice";

function Login(props) {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);

  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const handleKeypress = (e) => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  function checkErrors() {
    let flag = 0;
    if (user.email === "" || user.email === null) {
      setEmailError("Please enter a valid email");
      flag = 1;
    } else {
      setEmailError(null);
    }
    if (user.password === "" || user.password === null) {
      setPasswordError("Please enter a valid password");
      flag = 1;
    } else {
      setPasswordError(null);
    }
    return flag;
  }

  function onChange(event) {
    setUser({ ...user, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    var errorPresent = checkErrors();
    console.log(errorPresent);
    if (errorPresent === 0) {
      getUser(user).then((response) => {
        const receiveduser = response.data;
        if (receiveduser === "User not found for given email") {
          setConfirmOpen(true);
        }
        bcrypt.compare(
          user.password,
          receiveduser.password,
          function (err, res) {
            console.log(res);
            if (res === true) {
              getUserInfo(receiveduser.userId).then((res) => {
                const userinfo = res.data;
                localStorage.setItem("user", JSON.stringify(userinfo));
                props.history.push("/home");
              });
            } else if (res === false) {
              setPasswordNotMatch(true);
            }
          }
        );
      });
    }
  }

  function handleConfirmConfirm() {
    setConfirmOpen(false);
  }
  function handleConfirmCancel() {
    setConfirmOpen(false);
  }

  function handlePasswordNotMatchCancel() {
    setPasswordNotMatch(false);
    props.history.push("/home");
  }

  function handlePasswordNotMatchConfirm() {
    setPasswordNotMatch(false);
  }

  let emailInput = emailError ? (
    <Form.Input
      error={emailError}
      label='Email'
      placeholder='Email'
      name='email'
      onChange={onChange}
      onKeyPress={handleKeypress}
    />
  ) : (
    <Form.Input
      label='Email'
      placeholder='Email'
      name='email'
      onChange={onChange}
      onKeyPress={handleKeypress}
    />
  );

  let passwordInput = passwordError ? (
    <Form.Input
      error={passwordError}
      label='Password'
      placeholder='Password'
      name='password'
      type='password'
      onChange={onChange}
      onKeyPress={handleKeypress}
    />
  ) : (
    <Form.Input
      label='Password'
      placeholder='Password'
      name='password'
      type='password'
      onChange={onChange}
      onKeyPress={handleKeypress}
    />
  );

  return (
    <>
      <h1 className='login-title'>Welcome Back!</h1>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
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
          User Not Found!
        </Modal.Header>
        <Modal.Content
          style={{
            backgroundColor: "rgb(36, 35, 35)",
            color: "white",
          }}
        >
          User Not Found for the given Email ID
        </Modal.Content>
        <Modal.Actions
          style={{
            backgroundColor: "rgb(36, 35, 35)",
            color: "white",
          }}
        >
          <Button negative onClick={handleConfirmCancel}>
            Cancel
          </Button>
          <Button color='teal' onClick={handleConfirmConfirm}>
            Try Again
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal
        open={passwordNotMatch}
        onClose={() => setPasswordNotMatch(false)}
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
          Wrong Password!
        </Modal.Header>
        <Modal.Content
          style={{
            backgroundColor: "rgb(36, 35, 35)",
            color: "white",
          }}
        >
          Password does not match! Try Again.
        </Modal.Content>
        <Modal.Actions
          style={{
            backgroundColor: "rgb(36, 35, 35)",
            color: "white",
          }}
        >
          <Button negative onClick={handlePasswordNotMatchCancel}>
            Cancel
          </Button>
          <Button color='teal' onClick={handlePasswordNotMatchConfirm}>
            Try Again
          </Button>
        </Modal.Actions>
      </Modal>
      <Form inverted className='login-form'>
        {emailInput}
        {passwordInput}
        <div class='login-button'>
          <Button color='teal' onClick={handleSubmit} type='submit'>
            Login
          </Button>
        </div>
      </Form>
    </>
  );
}

export default withRouter(Login);
