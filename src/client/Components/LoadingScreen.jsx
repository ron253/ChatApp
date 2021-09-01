import React, {useEffect} from "react"
import {useHistory} from "react-router-dom"
import { useCookies } from 'react-cookie';

import jwt_decode from "jwt-decode";
import {SocketContext} from "../SocketContext"

function LoadingScreen() {
   
    const [accessCookies, setAccessCookie] = useCookies();
    const decoded_user = jwt_decode(accessCookies.access_token)['sub']
    const [accessRoom, setAccessRoom] = useCookies(['access_room']);
    const [otherUser, setUser] = useCookies(['other_user']);
    const history = useHistory();

    const [cookieCountry, setCookieCountry] = useCookies(['cookieCountry']);
    const [cookieRegion, setCookieRegion] = useCookies(['cookieRegion']);
    const [currentUser, setCurrentUser] = useCookies(['currentUser'])
    const [matchingUserRoom, setMatchingUserRoom] = useCookies(['matchingUserRoom'])
    const {socket} = React.useContext(SocketContext);

    useEffect(()=> {
      

        socket.on("join", data => {
            const unload_data  = JSON.parse(data);
          
            if(unload_data['users'][1]['currentUser'] == currentUser.currentUser) {
                setAccessRoom('access_room', unload_data['users'][1]['sid'], {path: '/' });
                setUser('other_user', unload_data['users'][0]['matchingUser'], {path: '/' })
                setMatchingUserRoom('matchingUserRoom', unload_data['users'][0]['sid'], {path: '/'})
            }

            else if(unload_data['users'][0]['matchingUser'] == currentUser.currentUser) {
                setUser('other_user', unload_data['users'][1]['currentUser'], {path: '/' })
                setAccessRoom('access_room', unload_data['users'][0]['sid'], {path: '/' });
                setMatchingUserRoom('matchingUserRoom', unload_data['users'][1]['sid'], {path: '/'})

            }

            
            
           
            history.push("/chat");

            
            console.log("In loading screen")
           
        })

        return ()=> {
            socket.removeAllListeners("join");
        }

    }, [socket])

    useEffect(()=> {
        socket.emit("matchUser", {"country": cookieCountry.cookieCountry, "region":cookieRegion.cookieRegion, "username":decoded_user});
        console.log("Printing loading screen")
       
    }, [])
   
    return (
       <div>
           
            <h5 className = "loadingText " align= "center">Please wait while we match you with another user</h5>
            <div className="loader" align = "center"></div>
       </div>
          
     
        
       
    )
}

export default LoadingScreen;
