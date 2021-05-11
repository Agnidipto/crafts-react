import React, { useState } from "react";
import { Form, Button, Modal } from "semantic-ui-react";
import validateEmail from "../../Utility/ValidateEmail";
import { validatePassword } from "../../Utility/Validation";
import { withRouter } from "react-router-dom";
import salt from "../../Utility/Salt";
import bcrypt from "bcryptjs";
import signup, { checkIfEmailExists, getUserInfo } from "./signupservice";

function Signup(props) {
  /////states
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const [userExists, setUserExists] = useState(false);

  ///////handle Functions

  function onChange(event, { name, value }) {
    setUser({ ...user, [name]: value });
  }

  function handleConfirmPassword(event, { value }) {
    setConfirmPassword(value);
  }

  /////handle Errors
  function handleErrors() {
    console.log(user.name);
    if (user.name === "" || user.name === null) {
      setNameError("Please enter your name");
    } else {
      setNameError(null);
    }

    if (user.email === "" || user.email === null) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError(null);
      if (!validateEmail(user.email))
        setEmailError("Invalid email. Format should be <name>@<gmail>.<com>");
    }

    if (user.password === "" || user.password === null) {
      setPasswordError("Please enter a password");
    } else {
      setPasswordError(null);
      if (!validatePassword(user.password)) {
        setPasswordError(
          "Should be of atleast length 8, requires one lowercase, one uppercase alphabet, and a number "
        );
      }
    }

    if (confirmPassword === "" || confirmPassword === null) {
      setConfirmPasswordError("Confirm your password");
    } else {
      setConfirmPasswordError(null);
      if (confirmPassword !== user.password) {
        setConfirmPasswordError("Passwords do not match");
      }
    }
  }

  function handleSubmit(event) {
    handleErrors();
    if (
      nameError === null &&
      emailError === null &&
      passwordError === null &&
      confirmPasswordError === null
    ) {
      bcrypt.genSalt(salt, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
          const userToSend = { ...user, password: hash };
          console.log(userToSend);
          checkIfEmailExists(user).then((res) => {
            console.log(res.data);
            if (res.data.email !== user.email) {
              signup(userToSend).then((response) => {
                const receiveduser = response.data;
                getUserInfo(receiveduser.userId).then((res) => {
                  localStorage.setItem("user", JSON.stringify(res.data));
                  props.history.push("/home");
                });
              });
            } else setUserExists(true);
          });
        });
      });
    }
  }

  //////Inputs

  const nameInput =
    nameError === null ? (
      <Form.Input
        label='Name'
        placeholder='Name'
        name='name'
        onChange={onChange}
      />
    ) : (
      <Form.Input
        error={nameError}
        label='Name'
        placeholder='Name'
        name='name'
        onChange={onChange}
      />
    );

  const emailInput =
    emailError === null ? (
      <Form.Input
        label='Email'
        placeholder='Email'
        name='email'
        onChange={onChange}
      />
    ) : (
      <Form.Input
        error={emailError}
        label='Email'
        placeholder='Email'
        name='email'
        onChange={onChange}
      />
    );

  const passwordInput =
    passwordError === null ? (
      <Form.Input
        label='Password'
        placeholder='Password'
        name='password'
        type='password'
        onChange={onChange}
      />
    ) : (
      <Form.Input
        error={passwordError}
        label='Password'
        placeholder='Password'
        name='password'
        type='password'
        onChange={onChange}
      />
    );

  let confirmPasswordInput =
    confirmPasswordError === null ? (
      <Form.Input
        label='Confirm Password'
        placeholder='Confirm Password'
        name='confirmPassword'
        type='password'
        onChange={handleConfirmPassword}
      />
    ) : (
      <Form.Input
        error={confirmPasswordError}
        label='Confirm Password'
        placeholder='Confirm Password'
        name='confirmPassword'
        type='password'
        onChange={handleConfirmPassword}
      />
    );

  //////////modal

  function handleUserExistsConfirm() {
    setUserExists(false);
  }

  function handleUserExistsCancel() {
    setUserExists(false);
  }

  //////////return

  return (
    <>
      <h1 className='login-title'>SignUp</h1>

      <Modal
        open={userExists}
        onClose={() => setUserExists(false)}
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
          User Exists!
        </Modal.Header>
        <Modal.Content
          style={{
            backgroundColor: "rgb(36, 35, 35)",
            color: "white",
          }}
        >
          User already exists for the given Email. Try Again!
        </Modal.Content>
        <Modal.Actions
          style={{
            backgroundColor: "rgb(36, 35, 35)",
            color: "white",
          }}
        >
          <Button negative onClick={handleUserExistsCancel}>
            Cancel
          </Button>
          <Button primary onClick={handleUserExistsConfirm}>
            Try Again
          </Button>
        </Modal.Actions>
      </Modal>
      <Form inverted className='login-form'>
        {nameInput}
        {emailInput}

        <Form.Group widths='equal'>
          {passwordInput}
          {confirmPasswordInput}
        </Form.Group>

        <div class='login-button'>
          <Button color='blue' onClick={handleSubmit} type='submit'>
            SignUp
          </Button>
        </div>
      </Form>
    </>
  );
}

export default withRouter(Signup);
