import React, { useState, useEffect} from 'react';

import { connect } from 'react-redux' ;
import PropTypes from 'prop-types' ;

import validator from 'validator';
import swal from 'sweetalert';
import Loading from 'react-loading-components' ;

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import PhoneVerifyModal from '../../components/Auth/PhoneVerifyModal';
import PhoneInput, { isValidPhoneNumber , parsePhoneNumber} from 'react-phone-number-input' ;
import { CheckEmail } from '../../firebase/user_collection';
import { errorPasswordHelper, errorMandatoryHelper, errorEmailHelper } from '../../utils/Error';

import {
    Box,
    Grid,
    TextField,
    Button,
    InputAdornment,
    useMediaQuery
} from '@mui/material' ;

import { useStyles } from './StylesDiv/SignUp.styles';
import { useTheme } from '@mui/styles';

const SignUpForm = (props) => {

    const {
        handleChangeAuthStep,

        full_name,
        user_email,
        phone_number
    } = props;

    const classes = useStyles();
    const theme = useTheme() ;

    const match800 = useMediaQuery('(min-width : 800px)') ;

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [phoneModalOpen, setPhoneModalOpen] = useState(false);
    const [loading, setLoading] = useState(false) ;
    const [fullName, setFullName] = useState(null) ;
    const [phoneNumber, setPhoneNumber] = useState(null) ;
    const [email, setEmail] = useState(null) ;
    const [password, setPassword] = useState(null) ;


    const handleGotoSignIn = () => {
        handleChangeAuthStep('signin') ;
    }

    const handlePhoneModalOpen = () => {
        setPhoneModalOpen(true) ;
    }
    
    const handlePhoneModalClose = () => {
        setPhoneModalOpen(false) ;
    }

    const handleNext = async () => { 
        setLoading(true) ;

        if( await  CheckEmail (email) ) {
            setLoading(false) ;
            handlePhoneModalOpen(true) ;
        } else {
            swal({
                title : 'Duplicate Email',
                text : 'This email is already used!',
                buttons : false,
                timer : 5000,
                icon : 'error'
            }) ;
            setLoading(false) ;
        }
    }
    
    const handleBack = () => {
        handleChangeAuthStep('signin') ;
    }

    useEffect(() => {
        if(full_name && user_email && phone_number) {
            setFullName(full_name) ;
            setEmail(user_email) ;
            setPhoneNumber(phone_number || '') ;
        }
    }, [full_name, user_email, phone_number]) ;

    return (
        <Box className={classes.root}>
            <Grid container>
                <Grid item xs={match800 ? 6 : 12}>
                    <Box className={classes.descriptionDiv}>
                        <Box className={classes.lineDiv}>

                        </Box>
                        <Box className={classes.helloDiv}>
                            Hello there,
                        </Box>
                        <Box className={classes.welcomeDiv}>
                            Welcome
                            <br/>to SOLS
                        </Box>
                        <Box className={classes.tickDiv}>
                            &gt; Let's Get Started
                        </Box>
                        <Box className={classes.slashDiv}>
                            // Create Account = HOST
                        </Box>
                        <Box className={classes.tickDiv}>
                            &gt;
                        </Box>
                        <Box className={classes.greenBlur} />
                        <Box className={classes.blueBlur} />
                    </Box>
                </Grid>
                <Grid item xs={match800 ? 6 : 12}>
                    <Box className={classes.formDiv}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} className={classes.signUpDiv}>
                                Sign Up
                            </Grid>   
                            <Grid item xs={12}>
                                <TextField
                                    label='Full Name'
                                    focused
                                    placeholder='Enter full name'
                                    name={'fullName'}
                                    value={fullName || ''}
                                    onChange={(e) => setFullName(e.target.value)}
                                    fullWidth
                                    helperText={errorMandatoryHelper(fullName)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    placeholder='Enter email'
                                    focused
                                    label='Email'
                                    name={'email'}
                                    value={email || ''}
                                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                    helperText={ errorEmailHelper(email) }
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sx={{display : 'flex', alignItems : 'center', justifyContent : 'flex-start !important', gap : '10px', flexWrap : 'wrap'}}>
                                <Box sx={{color : 'white' }}>Phone Number</Box>
                                <Box className={classes.flagDiv}>
                                    <PhoneInput
                                        name='phone'
                                        placeholder="Enter phone number"
                                        value={phoneNumber}
                                        onChange={setPhoneNumber}
                                    />
                                    <Box sx={{color : 'red', fontSize : 13}}>
                                        {
                                            phoneNumber ? (isValidPhoneNumber(phoneNumber) ? undefined : 'Invalid phone number') : ''
                                        }
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    focused
                                    placeholder='Enter password'
                                    label='Password'
                                    type={!passwordVisible ? 'password' : 'text'}
                                    fullWidth
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end" sx={{cursor : 'pointer'}} onClick={() => setPasswordVisible(!passwordVisible)}>
                                            {
                                                !passwordVisible ? <VisibilityIcon/> : <VisibilityOffIcon/>
                                            }
                                        </InputAdornment>,
                                    }}

                                    helperText={
                                        errorPasswordHelper(password)
                                    }
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password || ''}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{mt : '20px'}}>
                                <Button variant='contained' className={classes.buttonCss} fullWidth onClick={handleNext} 
                                    startIcon={loading && <Loading type='oval' width={30} height={30} fill={theme.palette.green.G200} />}
                                    disabled={  !validator.isEmail(email || '') 
                                                || !password || password?.length < 8
                                                || !fullName 
                                                || !isValidPhoneNumber(phoneNumber || '') 
                                                || !phoneNumber
                                    }
                                >
                                    { loading ? '...Checking Email' : 'Next' }
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant='contained' className={classes.buttonCss} fullWidth onClick={handleBack} >
                                    Back
                                </Button>
                            </Grid>
                            <Grid item xs={12} className={classes.contentDiv}>
                                <Box sx={{textAlign : 'center'}}>
                                    By creating an account, you agree to the
                                </Box>
                                <Box sx={{textAlign : 'center'}}>
                                    Company's <span className={classes.contentHighlight}>Terms of Service</span> and <span className={classes.contentHighlight}>Privacy Policy</span>
                                </Box>
                            </Grid>
                            <Grid item xs={12} className={classes.questionDiv}>
                                Already have and account? &nbsp; <span className={classes.contentHighlight} onClick={handleGotoSignIn}>Sign In</span>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>

            <PhoneVerifyModal 
                open = {phoneModalOpen}
                handleClose={handlePhoneModalClose}
                handleChangeAuthStep={handleChangeAuthStep}
                userInfo={{
                    fullname : fullName,
                    email : email,
                    password : password,
                    phone : phoneNumber
                }}
            />
        </Box>
    );
}

SignUpForm.propTypes = {

}

const mapStateToProps = state => ({
    full_name : state.auth.fullName,
    user_email : state.auth.email,
    phone_number : state.auth.phoneNumber,
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps) (SignUpForm);