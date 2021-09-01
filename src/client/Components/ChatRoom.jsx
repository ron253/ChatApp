import React, {useState, useEffect, useRef} from "react"
import {FaPaperPlane} from "react-icons/fa"
import {SocketContext} from "../SocketContext"

import { useCookies } from 'react-cookie';

import {Container, Row} from "react-bootstrap"
import NavBar from "./NavBar"
import { v4 as uuidv4 } from 'uuid';


function ChatRoom() {

    const [allMessages, setAllMessages] = useState([]);
    const welcomingMessage= ["Hello and Welcome To The Chatroom! Please keep the chat appropriate :) Happy chatting! "]
    const [join, setJoin] = useState([]);
    const [message, setMessage] = useState("");
    

   
    const [accessRoom, setAccessRoom] = useCookies();
    const [otherUser, setUser] = useCookies();


  
    const {socket} = React.useContext(SocketContext);
    
    const [accessCookies, setAccessCookie] = useCookies();
    const [currentUser, setCurrentUser] = useCookies()

  

    const outgoingMsgRef = useRef(null);
    const incomingMsgRef = useRef(null);
    const disconnectionRef = useRef(null);
   
    const [typing, setTyping] = useState(false)
    const [isNotTyping, setNotTyping] = useState()
    const [userTyping, setUserTyping] = useState("")
    const [matchingUserRoom, setMatchingUserRoom] = useCookies(['matchingUserRoom'])
    const [image, setImage] = useState();
    const [matchingUserImage, setMatchingUserImage] = useState()
    const date = new Date();
    let currentDate = date.toDateString();

    const scrollToBottom = () => {
        if(outgoingMsgRef.current != null) 
            outgoingMsgRef.current.scrollIntoView({ behavior: "smooth" })

        else if( incomingMsgRef.current != null)
            incomingMsgRef.current.scrollIntoView({ behavior: "smooth" })
        else if(disconnectionRef.current != null)
            disconnectionRef.current.scrollIntoView({ behavior: "smooth" })

            
    }

    useEffect(scrollToBottom, [allMessages]);

    
   

    const sendMessage = ()=>  {
        if(message != " ") {
            const _id = uuidv4();
            setAllMessages(prevMsg=> [...prevMsg, {"_id": _id, "outgoing_msg":message}])
           
           
            socket.emit("message", {"msg":message, "recipient":otherUser.other_user, "sender":currentUser.currentUser, "room":accessRoom.access_room,
            "matchingUserRoom":matchingUserRoom.matchingUserRoom
        } )
            
            
            setMessage("");
            
        }

        else {
            alert("Please send a message")
        }
     
    
        
    }
            
        

    const onChange = (e)=> {
        setMessage(e.target.value);
    }

    const sendIsTypingToUser = () => {
        if(!typing) {
            socket.emit("typing", {"isTyping":true, "recipient":otherUser.other_user, "sender":currentUser.currentUser, "room":accessRoom.access_room,
            "matchingUserRoom":matchingUserRoom.matchingUserRoom
        })
          
        }
    }

    const sendIsNotTyping = ()=> {
        setUserTyping("")
    }

    const keyPress = (e)=> {
        sendIsTypingToUser()
        
        
    }

    

    const retrieveImages = async ()=> {
   
   
        let response = await fetch("http://127.0.0.1:5000/user/profile/chatImage", {
            method: 'GET',
            mode:'cors',
            headers: {
                'sub':currentUser.currentUser,
                'matchingUser':otherUser.other_user
            }
        })
      
        let responseData = (await response).json()
        return responseData;
          
    }

  

    useEffect(()=> {

        socket.emit("joinRoom", {"room":accessRoom.access_room,  "recipient":otherUser.other_user, "sender":currentUser.currentUser, 
            "matchingUserRoom":matchingUserRoom.matchingUserRoom
        });

        retrieveImages().then(response=> {
            if(!response.error) {
                setImage(response.imageUrl)
                setMatchingUserImage(response.matchingUserImage)
            }
        })

        
        
    }, [])

    useEffect(()=> {
        socket.on("userJoins", msg=> {
            if(msg.recipient == currentUser.currentUser)
                setJoin(join.concat(msg.msg))
           
        })

        socket.on("msg", msg => {
            const _id = uuidv4();
           
            setAllMessages(prevMsg=> [...prevMsg, {"_id": _id, "incoming_msg":msg.msg}])
            
          
               
            
           
        })

        socket.on("isTyping", msg=> {
            if(msg.recipient == currentUser.currentUser) {
                if(msg.isTyping == true) {
                    setTyping(false);
                }
                else {
                    setTyping(msg.isTyping)
                }
               
                setUserTyping(userTyping.concat(`${otherUser.other_user} is typing...`))
                if(isNotTyping != undefined) clearTimeout(isNotTyping);
                setNotTyping(()=> setTimeout(sendIsNotTyping, 4000));
            }
            
        })

        socket.on("user-disconnected", msg=> {
            const _id = uuidv4();
           if(msg.requestSid == matchingUserRoom.matchingUserRoom) {
               setAllMessages(prevMsg => [...prevMsg, {"_id": _id, "user_disconnected": `${otherUser.other_user} has disconnected.`}])
           }
        })


   
       
    }, [])

    
   

   

   
    return (
        <div className = "messaging">
        <div className="inbox_msg">
            <div  className="msgs">

                {
                    welcomingMessage.map(msg=> {
                        return (
                        <div className = "welcomingMsg" >
                      
                            <div className = "joinRoom" align="center">
                                <p>{msg}</p>

                            </div>
                             

                                {
                                    join.map(msg=> {
                                        return (
                                            <div align="center">
                                                <span className = "joinRoom">{msg}</span>
                                            </div>
                                        )
                                    })

                                }
                                
                        </div>)})

                }

              


                {allMessages.length > 0 && 
                allMessages.map(msg=> {
                    return msg.outgoing_msg ? 
                        (
                        <div key = {msg._id} ref={outgoingMsgRef} className ="msg">
                        
                                <div className = "sent_msg">
                                    <div className="incoming_msg_img">

                                        
                                        <img  className = "profilePic" src = {image} /> 
                                        
                                        <div className = "cp">
                                            <h4 >{currentUser.currentUser}</h4>
                                        </div>
                                    </div>
                                    <p>{msg.outgoing_msg}</p>
                                    <span className = "time_date"> {currentDate}</span>
                                </div>
                        </div>
                        
                        ):
                        msg.incoming_msg ?
                        
                            (
                            <div key = {msg._id} ref={incomingMsgRef} className ="msg"> 
                                <div className = "recieved_msg">
                                    <div className="incoming_msg_img"> 
                                        
                                        <img src = {matchingUserImage} />
                                        

                                        <div className = "cp">
                                            <h4 >{otherUser.other_user}</h4>
                                        </div>
                                    
                                    
                                    </div>
                                    

                                    <p>{msg.incoming_msg}</p>
                                    <span className = "time_date"> {currentDate}</span>


                                </div>


                            </div>
                            ):
                            
                            <div key = {msg._id} ref = {disconnectionRef } align="center">
                                <span className = "disconnect-Room">{msg.user_disconnected}</span>
                            </div>  
                            
                          
                        
                            
                            
        
                        

                        
                      
                })}

                 
              
               
                
                <div align="center">
                    <span className = "userTyping">{userTyping}</span>
                </div> 
                <div className="type_msg">
                   
                    <div className="input_msg_write">
                        <input tabIndex = "1" value = {message} onKeyPress = {keyPress}  onChange = {(e)=> onChange(e)} type="text" className="write_msg" placeholder="Type a message"></input>
                        <button onClick = {sendMessage}className="msg_send_btn" type="button">
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>


            </div>
        </div>  
      </div>
       
      
       
    )

}

export default ChatRoom;














             