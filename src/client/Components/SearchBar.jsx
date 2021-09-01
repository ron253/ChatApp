import React, {useEffect, useState} from 'react';
import {Form, Button, Nav, Container, Row, Col} from "react-bootstrap"
import {CountryDropdown, RegionDropdown} from 'react-country-region-selector'
import {AiOutlineSearch} from 'react-icons/ai'
import { useCookies } from 'react-cookie';
import NavBar from "./NavBar"
import {useHistory} from "react-router-dom"



function SearchBar() {
 
 

    
    const history = useHistory();

    const [country, setCountry] = useState("");
    const [region, setRegion] = useState("");
    let [text, setText] = useState("");
    const txt = "I Want To Chat With People In..";
    let index = 0;

    const [cookieCountry, setCookieCountry] = useCookies(['cookieCountry']);
    const [cookieRegion, setCookieRegion] = useCookies(['cookieRegion']);

  
    
   
  

    function displayTxt() {
        setTimeout(()=> {
            if(index <= txt.length) {
                setText(text + txt.substr(0,index));
                displayTxt();
                index+=1;
            }  
        }, 50)
    
    }

    const submit = ()=> {
        
        
        
        setCookieCountry('cookieCountry', country, {path: '/' })
        setCookieRegion('cookieRegion', region, {path: '/' })
        history.push("/loading");

    }

    




    useEffect(()=> {
      
      

        displayTxt()
        
    
    }, [])


    return (
      
            <div className = "choices_inner" align ="center">
                <h1>{text}</h1>
                <CountryDropdown 
                value={country}
                id="my-country-field-id"
                name="my-country-field"
                classes="my-custom-class second-class"
                onChange={setCountry} />
                <RegionDropdown 
                className = "choices-icon"
                country={country}
                value={region}
                name="my-region-field-name"
                id="my-region-field-id"
                classes="another-custom-class"
                onChange={setRegion} />
                <Button onClick= {submit} className  = "btn-search" type = "submit" ><AiOutlineSearch className = "choices-icon" /></Button>
            </div>

   
        
   
    )
    
   
}

export default SearchBar;

