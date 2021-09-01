
import React from 'react';
import {useHistory} from "react-router-dom"
import {CgProfile} from "react-icons/cg"
import { useCookies } from "react-cookie";
import {SocketContext} from "../SocketContext"



function NavBar(props) {

  const [accessCookies, setAccessCookie, removeAccessCookie] = useCookies(['access_token']);
  const [isAuthenticated, setAuthentication, removeAuthentication] =  useCookies(['authentication']);
  const [accessRoom, setAccessRoom, removeAccessRoom] = useCookies(['access_room']);
  const [cookieCountry, setCookieCountry, removeCountry] = useCookies(['cookieCountry']);
  const [cookieRegion, setCookieRegion, removeRegion] = useCookies(['cookieRegion']);
  const [otherUser, setUser, removeUser] = useCookies(['other_user']);
  const [currentUser, setCurrentUser, removeCurrentUser] = useCookies(['currentUser'])
  const [matchingUserRoom, setMatchingUserRoom, removeMatchingUserRoom] = useCookies(['matchingUserRoom'])
  const [isRegistered, setRegistered, removeRegistered] = useCookies(['registered'])
  const history = useHistory();
  const {socket} = React.useContext(SocketContext);

 

  


  const logOut = ()=> {
    
    removeAccessCookie("access_token");
    removeAuthentication("authentication");
    removeAccessRoom("access_room");
    removeCountry("cookieCountry");
    removeRegion("cookieRegion");
    removeUser("other_user");
    removeCurrentUser("currentUser");
    removeMatchingUserRoom("matchingUserRoom");
    removeRegistered("registered");

    socket.disconnect();

    history.push("/");

      
    
  

  
    }
    
    
   
  

  const toUserAccount = () => {
    history.push("/userAccount")
  }
 

  
  return (
    <div >
        
        <div id ="nav-container">
          <div className="dropdown">
            <button > <CgProfile className = "user-icon" />
            <i className="fa fa-caret-down"></i>
            </button>
            
            <div className="dropdown-content">
                <a onClick = {toUserAccount}>Upload User Profile</a>
                <a onClick = {logOut}>LogOut</a>
            
            </div>
          </div>
      </div>
    </div>
  )
}

export default NavBar;