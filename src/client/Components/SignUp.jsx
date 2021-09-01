import React, {useRef, useState} from 'react';
import {Form, Button} from "react-bootstrap"
import {useHistory} from "react-router-dom"
import { useCookies } from 'react-cookie';


function SignUp() {

    const history = useHistory();
    const [passwordError, setPasswordError] = useState();
    const [duplicateEmailError, setEmailError] = useState();
    const [duplicateUserNameError, setDuplicateUserName] = useState();
    const [fileError, setFileError] = useState();
    const [isRegistered, setRegistered] = useCookies(['registered'])

    const redirectToLogin = ()=> {
        history.push("/");

    }

    const form = useRef(null);

    const handleForm = (e) => {
        e.preventDefault();
        const data = new FormData(form.current);
        fetch("http://127.0.0.1:5000/register", {
            method: 'POST',
            mode:'cors',

            body: data
          }).then(response=>response.json()).
          then(res=> {
            if(res.success) {
                setRegistered("registered", true, {path:'/'});
                history.push("/");
                  
            }
  
            else if(res.passwordError) {
                setPasswordError(res.passwordError);
                setEmailError("");
                setDuplicateUserName("");
            }

            else if(res.duplicateUserNameEror) {
                setDuplicateUserName(res.userNameError);
                setPasswordError("");
                setEmailError("");
            }
            else if (res.fileError) {
                setFileError(res.fileError);
                setDuplicateUserName("");
                setPasswordError("");
                setEmailError("");
            }
  
            else  {
                setEmailError(res.duplicateEmailError);
                setPasswordError("");
                setDuplicateUserName("");
                setFileError("");
            }
        })
    }

    return (
     <div>
        
      <div className = "main">
      <p className = "sign" align = "center">Sign Up To Chat!</p>
      <Form ref = {form} onSubmit = {handleForm} className = "form1"  enctype="multipart/form-data" method="POST" action = "http://127.0.0.1:5000/register">
        
         <Form.Group controlId="formGroupEmail" >
     
          <Form.Control className = "un" align= "center" type="text" placeholder="Enter Username" name = "userName" />
         </Form.Group>


         <Form.Text className = "form-text" align= "center" id="userError" muted>
            <span className = "errorCode">{duplicateUserNameError}</span>
        </Form.Text>

     


         <Form.Group controlId="formGroupEmail">
           
            <Form.Control className = "un" align= "center" type="email" placeholder="Enter email" name = "Email" />

        </Form.Group>

        <Form.Text className = "form-text" align= "center" id="EmailError" muted>
            <span className = "errorCode">{duplicateEmailError}</span>
        </Form.Text>

        <Form.Text className = "form-text"  align = "center" id="passwordHelpBlock" muted>
            Your password must be 8-20 characters long.
        </Form.Text>


        <Form.Group controlId="formPassword">
                        
            <Form.Control className = "un" align= "center"  type="password" placeholder="Password" name = "password" minlength = "8" maxlength = "20" required/>
           
        </Form.Group>

       


        <Form.Group controlId="formPassword">
                        
            <Form.Control className = "un" align= "center"  type="password" placeholder="Confirm Password" name = "confirmPassword" minlength = "8" maxlength = "20" required/>
           
        </Form.Group>

        <Form.Text className = "form-text" align= "center" id="passwordError" muted>
            <span className = "errorCode"> {passwordError}</span>
           
        </Form.Text>

       

        <Form.Group>
            <Form.File className = "un" align = "center" label="Upload Your Profile Picture" name = "file" required/>
        </Form.Group>

        <Form.Text  align= "center" id="fileError" muted>
            <span className = "errorCode">  {fileError}</span>
          
        </Form.Text>


         <Button  id="submitSignUp" align="center" type="submit">Sign Up </Button>
      </Form>
      <p class="forgot" align="center"><a onClick = {redirectToLogin}>Already have an account? <span className = "auth-page">Sign-In</span></a></p>

      </div>
     </div>
     
        
    )
   
}

export default SignUp;
