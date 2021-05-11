import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import Homepage from "./Components/Homepage/Homepage";
import Profile from "./Components/Profile/Profile";
import LoginSignup from "./Components/LoginSignup/LoginSignup";
import ProfileImage from "./Components/ProfileImage/ProfileImage";
import NewPost from "./Components/NewPost/NewPost";
import MyFeed from "./Components/MyFeed/MyFeed";

import AppSidebar from "./Containers/Sidebar/Sidebar";
import { Sidebar } from "semantic-ui-react";

function App() {
  const [visible, setVisible] = useState(false);

  function toggleSideBar() {
    setVisible(!visible);
  }
  return (
    <div className='App'>
      <Sidebar.Pushable style={{ transform: "none" }}>
        <AppSidebar visible={visible} onHide={() => setVisible(false)} />

        <Sidebar.Pusher>
          <Router>
            <Switch>
              <Route path='/home' exact>
                <Homepage toggleSideBar={toggleSideBar} />
              </Route>
              <Route path='/loginsignup' exact>
                <LoginSignup toggleSideBar={toggleSideBar} />
              </Route>

              <Route path='/profile' exact>
                <Profile toggleSideBar={toggleSideBar} />
              </Route>

              <Route path='/profileImage' exact>
                <ProfileImage toggleSideBar={toggleSideBar} />
              </Route>

              <Route path='/newPost' exact>
                <NewPost toggleSideBar={toggleSideBar} />
              </Route>

              <Route path='/myfeed' exact>
                <MyFeed toggleSideBar={toggleSideBar} />
              </Route>
            </Switch>
          </Router>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
}

export default App;
