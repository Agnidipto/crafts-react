import React, { useState } from "react";
import { Menu, Confirm, Button, Segment } from "semantic-ui-react";
import "./LoginSignup.css";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import Menubar from "../../Containers/Menubar/Menubar";

function LoginSignup(props) {
  const [activeItem, setActiveItem] = useState("Login");

  const menustyles = {
    width: "50%",
    textAlign: "center",
    justifyContent: "center",
    borderRadius: "0.28571429rem 0.28571429rem 0.28571429rem 0.28571429rem ",
  };

  const firstmenustyle = {
    ...menustyles,
    borderRadius: "0.28571429rem 0 0 0 ",
  };

  const lastmenustyle = {
    ...menustyles,
    borderRadius: "0 0.28571429rem 0 0 ",
  };

  const segmentstyle = {
    borderRadius: "0.28571429rem 0.28571429rem 0.28571429rem 0.28571429rem ",
    padding: 0,
  };
  function handleItemClick(event, { name }) {
    setActiveItem(name);
  }

  return (
    <>
      <Menubar text='Login/Signup' toggleSideBar={props.toggleSideBar} />

      <div className='login-signup'>
        <Segment style={segmentstyle} inverted>
          <Menu inverted>
            <Menu.Item
              name='Login'
              style={firstmenustyle}
              color='teal'
              active={activeItem === "Login"}
              onClick={handleItemClick}
            />
            <Menu.Item
              name='SignUp'
              color='blue'
              style={lastmenustyle}
              active={activeItem === "SignUp"}
              onClick={handleItemClick}
            />
          </Menu>

          <Segment className='login-form-segment' inverted>
            {activeItem === "Login" ? <Login /> : <Signup />}
          </Segment>
        </Segment>
      </div>
    </>
  );
}

export default LoginSignup;
