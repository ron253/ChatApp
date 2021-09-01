
import Login from "./Login"
import SignUp from "./SignUp"
import SearchBar from "./SearchBar"
import ChatRoom from "./ChatRoom"
import React, {useState} from 'react'
import {Switch,Route } from "react-router-dom";
import { useCookies } from 'react-cookie';
import LoadingScreen from "./LoadingScreen"
import UserAccount from "./UserAccount"
import {SocketContext, socket} from "../SocketContext"
import {Container, Row} from "react-bootstrap"
import NavBar from "./NavBar"


function App() {

  const [isAuthenticated, setAuthentication] = useCookies();

  

  return (
    <div className="App">
      {isAuthenticated.authentication ? 
      ( 
      <Switch >
   
        <Route path = "/loading">

          <SocketContext.Provider value = {{socket}}>
            <LoadingScreen />
          </SocketContext.Provider>
        
            
           
          
          
        </Route>

        <Route exact path = "/search">
          <SocketContext.Provider value = {{socket}}>
            <Container>
              <Row>
                <NavBar />
              </Row>

              <Row>
                <SearchBar />
              </Row>
            </Container>
            
          </SocketContext.Provider>
          
        </Route>

        <Route path = "/chat">
          <SocketContext.Provider value = {{socket}}>
            <Container>
              <Row>
                <NavBar/>
              </Row>

              <Row>
                <ChatRoom />
              </Row>
            </Container>
          
         
          </SocketContext.Provider>
        
       
        </Route>

        <Route path = "/userAccount">
        <SocketContext.Provider value = {{socket}}>
          <Container>
            <Row id = "userAccNav">
              <NavBar  />
            </Row>

            <Row>
              <UserAccount />
            </Row>
          </Container>
          </SocketContext.Provider>
        </Route>

      </Switch>
      ):
      <Switch>
      <Route exact path = "/">
        
          <Login />
        
          
      </Route>

      <Route path = "/signup">
        <SignUp />
      </Route>

    </Switch>
         
        
      }
     
    </div>
  );
}

export default App;
