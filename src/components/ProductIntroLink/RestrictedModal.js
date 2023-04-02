import * as React from 'react' ;

import { useLocation } from 'react-use' ;

import { connect } from 'react-redux';

import { CheckAccessibleCustomer } from '../../firebase/user_collection';

import PhoneInput, { isValidPhoneNumber , parsePhoneNumber} from 'react-phone-number-input' ;

import CloseIcon from '@mui/icons-material/Close';
import Loading from 'react-loading-components' ;

import { errorEmailHelper } from '../../utils/Error';
import validator from 'validator';

import swal from 'sweetalert';

import EmailImage from '../../assets/platform/Email.svg';
import SMSImage from '../../assets/platform/SMS.svg' ;
import FacebookImage from '../../assets/platform/Facebook.svg' ;
import TikTokImage from '../../assets/platform/TikTok.svg' ;
import InstagramImage from '../../assets/platform/Instagram.svg';
import LinkedInImage from '../../assets/platform/LinkedIn.svg';

import OtpInput from "react-otp-input";

import { SendVerificationCodeByEmail } from '../../email';
import { SendVerificationCodeByPhone } from '../../twilio' ;

import  {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Box,
    Button,
    Grid,
    TextField,
} from '@mui/material' ;

import { useStyles } from './StylesDiv/Restricted.styles';
import { useTheme } from '@mui/styles';

const RestrictedModal = (props) => {

    const classes = useStyles() ;
    const theme = useTheme() ;
    const location = useLocation() ;

    const {
        open,
        handleClose,

        productId
    } = props ;

    const platformList = [
        {
            img : EmailImage,
            name : "email",
            official_name : "Email"
        }, 
        {
            img : SMSImage,
            name : "sms",
            official_name : "Text Message"
        }, 
        {
            img : TikTokImage,
            name : "tiktok",
            official_name : "TikTok Direct Message"
        },  
        {
            img :LinkedInImage,
            name : 'linkedin',
            official_name : "LinkedIN Direct Message"
        }, 
        {
            img : FacebookImage,
            name : "facebook",
            official_name : "Facebook Messenger"
        }, 
        {
            img : InstagramImage,
            name : 'instagram',
            official_name : "Instagram Direct Message"
        }
    ] ;

    const [disabledBt, setDisabledBt]  = React.useState(true) ;

    const [email, setEmail] = React.useState('') ;
    const [loading, setLoading] = React.useState(false) ;
    const [selectedPlatform,  setSelectedPlatfrom] = React.useState(0) ;
    const [phoneNumber, setPhoneNumber] = React.useState('') ;
    
    const [verifyTime, setVerifyTime] = React.useState(5 * 60) ;
    const [step, setStep] = React.useState('input_email') ;
    const [verify_code, setVerifyCode] = React.useState(null) ;
    const [inputed_verify_code, setInputedVerifyCode] = React.useState(null) ;

    const handleSelectPlatform = (selectedPlatform) => {
        setSelectedPlatfrom(selectedPlatform) ;
    }
    
    const CheckAccessibleToRestricted = async () => {
        if(inputed_verify_code.toString() !== verify_code.toString()) {
            setVerifyTime(5 * 60) ;
            setVerifyCode(null) ;

            setStep('input_email') ;

            return swal({
                title : 'Error',
                text : "Your Email is invalid",
                icon : 'error',
                buttons : false,
                timer: 4000
            }) ;
        }

        let checkValue = null ;

        switch(selectedPlatform) {
            case 0 :
                checkValue = email.toLowerCase() ;
                break ;
            case 1 :
                checkValue = phoneNumber ;
                break ;
            default :
                return ;
        }

        if(await CheckAccessibleCustomer(checkValue, productId)) {
            swal({
                title : 'Success',
                text : 'You can access this link with this email',
                timer : 5000,
                buttons : false,
                icon : 'success'
            })

            handleClose() ;
            return ;

        } else return swal({
            title : 'Warning',
            text : 'You can not access this link with this email.',
            timer : 5000,
            buttons : false,
            icon : 'warning'
        })
    }

    const SendVerifyCode = async () => {
        let verify_code ;
        
        switch(platformList[selectedPlatform]?.name) {
            case 'email' :
                verify_code = await SendVerificationCodeByEmail(email) ;
                break ;
            case 'sms' :
                verify_code = await SendVerificationCodeByPhone(phoneNumber) ;
                break;
            default : 
                break;
        }

        if( verify_code ) {

            setStep('confirm_code') ;

            setVerifyCode(verify_code) ;
            setVerifyTime(verifyTime - 1) ;
        }
    }

    React.useEffect(() => {
        if(verifyTime !== 5 * 60 && verifyTime)
            setTimeout(() => setVerifyTime(verifyTime - 1), 1000);
        else {
            setVerifyTime(5 * 60) ;
        }
    }, [verifyTime]);

    React.useEffect(() => {
        switch(selectedPlatform) {
            case 0 :
                return setDisabledBt(!validator.isEmail(email || '')) ;
            case 1 :
                return setDisabledBt(!isValidPhoneNumber(phoneNumber || '')) ;
            default :
                return ;
        }
    }, [selectedPlatform, email, phoneNumber]) ; 

    return (
        <Box className={classes.root}>
            <Dialog
                open={open}
                fullWidth
                classes ={{
                    paper : classes.paper
                }}
                hideBackdrop={true}
            >
                <Box className={classes.greenBlur} />
                <Box className={classes.blueBlur} />
                <DialogTitle>
                    <Box>
                        This URL is restricted.
                    </Box>
                </DialogTitle>
                <Box className={classes.dividerDiv} />
                <DialogContent>
                    <Grid container>
                        {
                            step === 'input_email' && <>
                                <Grid item xs={12} sx={{mb : '20px'}}>
                                    <Box className={classes.labelDiv}>Received Platform : { platformList[selectedPlatform].official_name }</Box>
                                    <Box className={classes.platformDiv}>
                                        {
                                            platformList.map((item, index) => {
                                                return (
                                                    <Box className={classes.imgDiv} key={index} onClick={() => handleSelectPlatform(index)}
                                                    >
                                                        <img src={item.img}
                                                            className={classes.socialIconCss}
                                                        />
                                                    </Box>
                                                )
                                            })
                                        }
                                    </Box>
                                </Grid>
                                {
                                    platformList[selectedPlatform].name === 'email' && <Grid item xs={12} sx={{mt : '10px'}}>
                                        <Box className={classes.labelDiv}>Email</Box>
                                        <Box >
                                            <TextField
                                                size='small'
                                                fullWidth
                                                onChange={(e) => setEmail(e.target.value)}
                                                value={email}
                                                helperText={errorEmailHelper(email)}
                                            />
                                        </Box>
                                    </Grid>
                                }
                                {
                                    platformList[selectedPlatform].name === 'sms' && <Grid item xs={12} sx={{mt : '10px'}}>
                                        <Box className={classes.labelDiv}>Phone Number</Box>
                                        <Box className={classes.flagDiv}>
                                            <PhoneInput
                                                placeholder="Enter phone number"
                                                value={phoneNumber}
                                                onChange={setPhoneNumber}
                                            />
                                            <Box sx={{color : 'red', fontSize : 13}}>
                                                {
                                                    phoneNumber ? (isValidPhoneNumber(phoneNumber) ? undefined : 'Invalid phone number') : 'Phone number required'
                                                }
                                            </Box>
                                        </Box>
                                    </Grid>
                                }
                            </>
                        }
                        {
                            step === 'confirm_code' && <Grid item xs={12} sx={{mt : '10px'}}>
                                <Box className={classes.labelDiv} sx={{mb : '10px'}}>Please, confirm verification code within {verifyTime}s</Box>
                                <OtpInput
                                    containerStyle={{
                                        flexWrap : 'wrap',
                                        gap : '10px'
                                    }}
                                    inputStyle={{
                                        width: "3rem",
                                        height: "3rem",
                                        margin: "0 1rem",
                                        fontSize: "2rem",
                                        color : "#43D9AD",
                                        borderRadius: 4,
                                        backgroundColor : "#011627",
                                        border: "1px solid white"
                                    }}
                                    isInputNum
                                    numInputs={6}
                                    value={inputed_verify_code}
                                    onChange={setInputedVerifyCode}
                                />
                            </Grid>
                        }
                    </Grid>
                </DialogContent>
                <Box className={classes.dividerDiv} />
                <DialogActions>
                    {
                        step === 'input_email' && <Button variant={'contained'} 
                            startIcon={ loading && <Loading type='tail_spin' width={30} height={30} fill='#e83e8c' />}
                            className={classes.buttonCss}
                            disabled={ disabledBt }

                            onClick={ SendVerifyCode } 
                        >
                            Send Verification Code
                        </Button>
                    }
                    {
                        step === 'confirm_code' && <Button variant={'contained'} 
                            startIcon={ loading && <Loading type='tail_spin' width={30} height={30} fill='#e83e8c' />}
                            className={classes.buttonCss}
                            disabled={ disabledBt }

                            onClick={ CheckAccessibleToRestricted } 
                        >
                            Confirm
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        </Box>
    )
}

const mapStateToProps = state => ({

})
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(RestrictedModal) ;