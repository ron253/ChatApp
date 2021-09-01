import React, {useState, useEffect, useRef} from 'react'
import {Container, Row, Col} from "react-bootstrap"
import NavBar from "./NavBar"
import { useCookies } from 'react-cookie';

function UserAccount() {
    const [image, setImage] = useState();
    const [currentUser, setCurrentUser] = useCookies()
    const [errorMsg, setErrorMsg] = useState()
    const [error, setError] = useState(false)
    const [successMsg, setSuccessMsg] = useState()
    const [userName, setUsername] = useState()
    const form = useRef(null);
    const [passwordError, setPasswordError] = useState();
    const [duplicateUserNameError, setDuplicateUserName] = useState();
    const [fileError, setFileError] = useState();

    const userDetails = async ()=> {
        let image = fetch("http://127.0.0.1:5000/user/profile/accountImage", {
            method:'GET',
            mode:'cors',
            headers: {
                'sub':currentUser.currentUser
            }
        })

        let username =  fetch("http://127.0.0.1:5000/user/profile/username", {
            method:'GET',
            mode:'cors',
            headers: {
                'sub':currentUser.currentUser
            }
        })

        let responses = await Promise.all([image, username])

        let imageData = responses[0]
        let usernameData = responses[1]
        if(imageData.error ||  usernameData.error)
            throw new Error(imageData.errorMsg);
        
        return [await imageData.json(), await usernameData.json()];
    }
    useEffect(()=> {
        userDetails().then( (data) => { 
            setImage(data[0].imageFile);
            setUsername(data[1].userName);
        }).catch(err=> {

            setErrorMsg(err);
            setError(true);
        }); 

    }, [])

  

    const updateProfile = async ()=> {
   
        const data = new FormData(form.current);
        let response = await fetch("http://127.0.0.1:5000/user/info", {
            method: 'POST',
            mode:'cors',
            headers: {
                'sub':currentUser.currentUser
            },
            body:data
            
        })
      
        let responseData = (await response).json()
        return responseData;
          
    }

    const submission = (e)=> {
        e.preventDefault();
        updateProfile().then(response=> {
            if(response.error) {
                setError(true);
                setErrorMsg(response.errorMsg);
            }
            else {
                setError(false);
                setSuccessMsg(response.success)
            }
        })
    }


    
    
    return (
   
        <form ref = {form}  onSubmit = {submission} enctype="multipart/form-data" method="POST" action = "http://127.0.0.1:5000/user/info">

        <div className=" outline" align="center" >

            <div className = "card py-4">
                <h5 className = "font-weight-normal">User Account</h5>
                <div >
                    <div ><img src= {image} width="100" />
                        <div >
                            
                            <input className = "buttons" type="file"  name="file" required />
                         
                            <div>
                                <span className="image-size">Please confirm your password to update profile. </span>

                            </div>
                        </div>
                    </div>

                </div>   


                <div >

                    <div >
                        <div >
                            <div class="inputbox "> <input type="text" name="userName" class="form-control"  placeholder = {userName} disabled="disabled"/> <span className = "spacing" >Username</span> </div>
                        </div>
                        <div >
                            <div class="inputbox "> <input type="password" name="password" class="form-control"  minlength = "8" maxlength = "20"  required /> <span className = "spacing" >Password</span> </div>
                            
                        </div>
                    </div>
                    <div >
                        <div >
                            <div class="inputbox "> <input type="password" name="confirmPassword" class="form-control" minlength = "8" maxlength = "20" required /> <span className = "spacing"> Confirm Password </span> </div>
                        </div>
                    </div>
                </div>             
            </div>
            <button  className = "buttons">Update Profile</button>
        
        </div>
        {error ? <div align= "center"><span >{errorMsg}</span></div> : <div align="center"><span >{successMsg} </span> </div>} 
      
        </form>
       
        
      
    
    )

}

export default UserAccount;


