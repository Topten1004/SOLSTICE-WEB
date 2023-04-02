import React, { useState, useEffect} from 'react';

import { connect } from 'react-redux' ;
import PropTypes from 'prop-types' ;
import { UserAccountInfo } from '../../../redux/actions/profile';

import swal from 'sweetalert';
import Loading from 'react-loading-components' ;

import OtpInput from "react-otp-input";

import { auth } from '../../../firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

import PhoneInput, { isValidPhoneNumber , parsePhoneNumber} from 'react-phone-number-input' ;

import { UpdateUserMainInfo } from '../../../firebase/user_collection';
import { CheckAccountName } from '../../../firebase/user_collection';
import { getCookie } from '../../../utils/Helper';
import { errorMandatoryHelper } from '../../../utils/Error';

import {
    Box,
    Grid,
    TextField,
    Button,
    InputAdornment,
    useMediaQuery
} from '@mui/material' ;

import { useStyles } from './StylesDiv/PersonalForm.styles';
import { useTheme } from '@mui/styles';

const PersonalForm = (props) => {

    const {
        full_name,
        phone_number,
        account_name,

        UserAccountInfo
    } = props;

    const classes = useStyles();
    const theme = useTheme() ;

    const [fullName, setFullName] = React.useState(null) ;
    const [accountName, setAccountName] = React.useState(null) ;

    const [loading, setLoading] = React.useState(false) ;
    const [checkAcctName, setCheckAcctName] = React.useState(true) ;

    const [phoneNumber, setPhoneNumber] = React.useState('') ;
    const [verifyCode, setVerifyCode] = React.useState() ;
    const [confirmResult, setConfirmResult] = React.useState(null) ;

    const [phoneVerifyStep, setVerifyStep] = React.useState('verifyRobot') ;

    const handleCodeSent = async () => { 
        console.log(phoneNumber) ;
        console.log(fullName) ;

        setLoading(true) ;

        let verify = new RecaptchaVerifier('recaptcha-container', {
            'hl' : 'en-GB'
        }, auth);

        try {
            let confirmResult = await signInWithPhoneNumber(auth, phoneNumber , verify) ;

            setConfirmResult(confirmResult) ;

            setVerifyStep('confirm') ;
        } catch(err) {
            console.log(err) ;
        }

        setLoading(false) ;
    }

    const handleVerifyCode = async () => {
        setLoading(true) ;

        try {
            await confirmResult.confirm(verifyCode) ;
            setVerifyStep('success') ;
        } catch(err) {
            console.log(err) ;
        }

        setLoading(false) ;
    }

    const handleUpdate = async () => {

        setLoading(true) ;

        if(await UpdateUserMainInfo(fullName, phoneNumber, accountName, getCookie('_SOLSTICE_AUTHUSER'))) {
            await UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;

            swal({
                title : 'Update Successful',
                text : 'Your Update is successfully',
                icon : 'success',
                buttons : false,
                timer : 5000
            })
        } else {
            swal({
                title : 'Update Failed',
                text : 'Your Update is failed',
                icon : 'error',
                buttons : false,
                timer : 5000
            }) ;
        }

        setVerifyStep('verifyRobot') ;
        setVerifyCode('') ;
        setConfirmResult(null) ;

        setLoading(false) ;
    }

    const handleChangeVerifyCode = (code) => {
        setVerifyCode(code) ;
    }

    const handleCheckAccountName = async () => {
        if(account_name === accountName) {
            setCheckAcctName(true) ;
            return ;
        }
        setVerifyStep('checkAccountName') ;

        setLoading(true) ;

        if(await CheckAccountName(accountName)) {
            setCheckAcctName(true) ;
        } else {
            setCheckAcctName(false) ;
            swal({
                title : 'Warning',
                text : "Duplicate Account Name",
                buttons : false,
                timer : 3000,
                icon : 'warning'
            }) ;
        }

        setLoading(false) ;

        setVerifyStep('verifyRobot') ;
    }
    
    useEffect(() => {
        setPhoneNumber(phone_number) ;
        setFullName(full_name) ;
        setAccountName(account_name) ;
    }, [phone_number, full_name, account_name]) ;
    return (
        <Box className={classes.root}>
            <Grid container>
                <Grid item xs={12} sx={{display : 'flex', justifyContent : 'center'}}>
                    <Box className={classes.formDiv}>
                        <Grid container>
                            <Grid item xs={12}>
                                Full Name
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    placeholder="Enter Full Name"
                                    size='small'
                                    fullWidth
                                    value={fullName || ''}
                                    onChange={(e) => setFullName(e.target.value)}
                                    helperText={errorMandatoryHelper(fullName)}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{mt : '15px'}}>
                                Account Name
                            </Grid>
                            <Grid item xs={!2}>
                                <TextField
                                    placeholder="Enter Account Name"
                                    size='small'
                                    fullWidth
                                    value={accountName || ''}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    helperText={errorMandatoryHelper(accountName)}
                                    onBlur={handleCheckAccountName}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{mt : '15px'}}>
                                Phone Number
                            </Grid>
                            <Grid item xs={12} >
                                <Box className={classes.flagDiv}>
                                    <PhoneInput
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
                            <Grid item xs={12} sx={{mt : '15px'}}>
                                {
                                    phoneVerifyStep === 'verifyRobot' && <Box id="recaptcha-container" />
                                }
                                {
                                    phoneVerifyStep === 'confirm' && <OtpInput
                                        containerStyle={{
                                            flexWrap : 'wrap',
                                            gap : '10px'
                                        }}
                                        inputStyle={{
                                            width: "30px",
                                            height: "30px",
                                            margin: "0 1rem",
                                            fontSize: "15px",
                                            color : "#43D9AD",
                                            borderRadius: 4,
                                            backgroundColor : "#011627",
                                            border: "1px solid white"
                                        }}
                                        separator={true}
                                        isInputNum
                                        numInputs={6}
                                        value={verifyCode}
                                        onChange={handleChangeVerifyCode}
                                    />
                                }
                            </Grid>
                            <Grid item xs={12} sx={{mt : '20px', display : 'flex', justifyContent : 'right'}}>
                                {
                                    (phone_number !== phoneNumber && phoneVerifyStep === 'verifyRobot') && <Button variant='contained' className={classes.buttonCss} fullWidth onClick={handleCodeSent}
                                        startIcon={loading && <Loading type='oval' width={20} height={20} fill={theme.palette.green.G200} />}
                                        disabled={ !( isValidPhoneNumber(phoneNumber || '') ) || !fullName || loading || !checkAcctName}
                                    >
                                        { 'Verify Phone' }
                                    </Button>
                                }
                                {
                                    phoneVerifyStep === 'confirm' && <Button variant='contained' className={classes.buttonCss} fullWidth onClick={handleVerifyCode}
                                        disabled={loading || !checkAcctName}
                                        startIcon={loading && <Loading type='oval' width={20} height={20} fill={theme.palette.green.G200} />}
                                    >
                                        { 'Send Code' }
                                    </Button>
                                }
                                {
                                    (phone_number === phoneNumber || phoneVerifyStep === 'success') && <Button variant='contained' className={classes.buttonCss} fullWidth onClick={handleUpdate}
                                        startIcon={loading && <Loading type='oval' width={20} height={20} fill={theme.palette.green.G200} />}
                                        disabled={loading || !checkAcctName}
                                    >
                                        { 'Update' }
                                    </Button>
                                }

                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

PersonalForm.propTypes = {
    UserAccountInfo  : PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    full_name : state.profile.fullName,
    phone_number : state.profile.phoneNumber,
    account_name : state.profile.accountName
})

const mapDispatchToProps = {
    UserAccountInfo
}

export default connect(mapStateToProps, mapDispatchToProps) (PersonalForm);