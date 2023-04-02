import validator from "validator";
import { validateInputValue } from "./Helper";

export const errorPasswordHelper = (password) => {
    if(password === null) return null ;

    if(password === '') return "Enter you password";
    if(password.length < 8) return "Password is too short (minimum is 8 characters)" ;
    
    return null ;
}

export const errorEmailHelper = (email) => {
    if(email === null) return null ;
    
    if(email === '') return 'Please, Enter your email' ;
    if(!validator.isEmail(email)) return "Invalid Email" ;

    return null ;
}

export const errorMandatoryHelper = (full_name) => {
    if(full_name === null) return null ;

    if(full_name === '') return 'Please, Fill this field.'

    return null ;
}