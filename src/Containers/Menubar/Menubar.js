import React from "react";
import { Dropdown, Icon } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import "./Menubar.css";

const Menubar = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const trigger = <Icon name='user circle' color='teal' size='big' />;

  function handleLogout(event) {
    localStorage.setItem("user", null);
    props.history.push("/loginsignup");
  }

  const renderMenuItems =
    user !== null ? (
      <Dropdown.Menu style={{ opacity: "1", zIndex: "1" }}>
        <Dropdown.Item disabled> Logged In as {user.name}</Dropdown.Item>
        <Dropdown.Item onClick={handleLogout}>LogOut</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>Spam (1009)</Dropdown.Item>
      </Dropdown.Menu>
    ) : (
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => {
            props.history.push("/loginsignup");
          }}
        >
          Login
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>Spam (1009)</Dropdown.Item>
      </Dropdown.Menu>
    );

  return (
    <div className='Menubar'>
      <i class='fas fa-bars fa-2x' onClick={props.toggleSideBar}></i>
      <p onClick={() => props.history.push("/home")}>{props.text}</p>

      <div className='ButtonAndUser'>
        <Dropdown
          style={{ marginRight: "10px" }}
          text={trigger}
          pointing='top right'
          className='link item drop'
        >
          {renderMenuItems}
        </Dropdown>
      </div>
    </div>
  );
};

export default withRouter(Menubar);
