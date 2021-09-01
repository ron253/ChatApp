
import React, {useState, useRef, useEffect} from 'react';
import {Form, Button} from "react-bootstrap"
import {useHistory, useLocation} from "react-router-dom"
import { useCookies } from 'react-cookie';
import jwt_decode from "jwt-decode";
function Login() {
  
  const history = useHistory();
  const [credentialError, setCredentialError] = useState();

  const [accessCookies, setAccessCookie] = useCookies(['access_token']);
  const [isAuthenticated, setAuthentication] =  useCookies(['authentication']);
  const [currentUser, setCurrentUser] = useCookies(['currentUser'])
  const [isRegistered, setRegistered] = useCookies(['registered'])
  

  
  const redirectToSignUp = ()=> {
    history.push("/signup");

  }

  const location = useLocation();

  

  const form = useRef(null);

  const handleForm = (e)=> {
    e.preventDefault();
    const data = new FormData(form.current);
    fetch("http://127.0.0.1:5000/login", {
      method: 'POST',
      mode:'cors',
      body: data
      }).then(response=> response.json()).
      then(res=> {
        if(!res.errorMessage) {
          const decoded_user = jwt_decode(res.access_token)['sub']
          setCurrentUser('currentUser',decoded_user, {path:'/'} )
          setAccessCookie('access_token', res.access_token, {path: '/' });
          setAuthentication('authentication', true, {path: '/' });
          history.push("/search");
     

            
        }

        else  {
          setCredentialError("Invalid Login Credentials");
          
        }
      })

  }

  

 

  return (
    <div>
      <div id = "title" align= "center">
        <h1>Welcome To ChatU Where You Can Chat With People Near You!</h1>
      </div>
      <div className = "main">
      <p className = "sign" align = "center">Sign In</p>

      {isRegistered.registered?
        (<div align="center" >
      <p id="login-error-msg">Account successfully created!<span id="error-msg-second-line">Please login.</span></p>
      </div>
      
      ) : <div> </div>
      }
      <div>
      <Form ref = {form} onSubmit = {handleForm} className = "form1">
          
        <Form.Text className = "form-text" align= "center" id="credentialError" muted>
          <span className = "errorCode">{credentialError}</span>
        </Form.Text>

        
        <Form.Group controlId="formGroupEmail" >
       
          <Form.Control className = "un" align= "center" type="text" placeholder="Enter Username" name = "userName" required/>
        </Form.Group>

        <Form.Group controlId="formGroupPassword" >
      
          <Form.Control className = "un" align= "center" type="password" placeholder="Enter password" name = "password" required/>
        </Form.Group>
          <Button id="submitSignIn" align="center" type="submit">Sign in </Button>
      </Form>
      <p class="forgot" align="center">Don't already have an account? <a onClick ={redirectToSignUp}> <span className = "auth-page">Sign Up</span></a></p>
      </div>
      
      
      

      </div>
    </div>
  
      
  )
   
}

export default Login;

