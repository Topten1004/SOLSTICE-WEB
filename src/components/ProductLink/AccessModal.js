import * as React from 'react' ;

import { useLocation } from 'react-use' ;
import { useSearchParams } from 'react-router-dom' ;

import { connect } from 'react-redux';

import { CheckAccessibleCustomer } from '../../firebase/user_collection';

import PhoneInput, { isValidPhoneNumber , parsePhoneNumber} from 'react-phone-number-input' ;

import CloseIcon from '@mui/icons-material/Close';
import Loading from 'react-loading-components' ;

import { errorEmailHelper } from '../../utils/Error';
import validator from 'validator';

import swal from 'sweetalert';

import { SendVerificationCodeByEmail } from '../../email';

import OtpInput from "react-otp-input";

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

import { useStyles } from './StylesDiv/AccessModal.styles';
import { useTheme } from '@mui/styles';

const AccessModal = (props) => {

    const classes = useStyles() ;
    const theme = useTheme() ;
    const location = useLocation() ;

    const {
        open,
        handleClose,

        productInfo
    } = props ;

    const [urlParams, setUrlParams] = useSearchParams() ;

    const [email, setEmail] = React.useState('') ;
    const [loading, setLoading] = React.useState(false) ;

    const [verifyTime, setVerifyTime] = React.useState(5 * 60) ;
    const [step, setStep] = React.useState('input_email') ;
    const [verify_code, setVerifyCode] = React.useState(null) ;
    const [inputed_verify_code, setInputedVerifyCode] = React.useState(null) ;

    const SendVerifyCode = async () => {
        let verify_code = await SendVerificationCodeByEmail(email) ;

        if( verify_code ) {

            setStep('confirm_code') ;

            setVerifyCode(verify_code) ;
            setVerifyTime(verifyTime - 1) ;
        }
    }

    const handleAccessProduct = async () => {
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
        
        if(!Object.keys(productInfo.buyers).includes(email)) {
            setVerifyTime(5 * 60) ;
            setVerifyCode(null) ;

            setStep('input_email') ;

            return swal({
                title : 'Error',
                text : "You can not access with this email",
                icon : 'error',
                buttons : false,
                timer: 4000
            }) ;
        }

        if(productInfo.buyers[email].access_key !== urlParams.get('access_key')) {

            setVerifyTime(5 * 60) ;
            setVerifyCode(null) ;

            setStep('input_email') ;
            
            return swal({
                title : 'Error',
                text : "You can not access with this access key",
                icon : 'error',
                buttons : false,
                timer: 4000
            }) ;
        }

        handleClose() ;
    }

    React.useEffect(() => {
        if(verifyTime !== 5 * 60 && verifyTime)
            setTimeout(() => setVerifyTime(verifyTime - 1), 1000);
        else {
            setVerifyTime(5 * 60) ;
        }
    }, [verifyTime]);

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
                        Access
                    </Box>
                </DialogTitle>
                <Box className={classes.dividerDiv} />
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12} >
                            {
                                step === 'input_email' && <>
                                    <Box className={classes.labelDiv}>Email</Box>
                                    <TextField
                                        fullWidth
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        helperText={errorEmailHelper(email)}
                                    />
                                </>
                            }
                        </Grid>
                        {
                            step === 'confirm_code' && <Grid item xs={12} sx={{mt : '10px', position : 'relative', zIndex : '1500'}}>
                                <Box className={classes.labelDiv} sx={{mb : '30px'}}>Please, confirm verification code within {verifyTime}s</Box>
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
                            disabled={ !validator.isEmail(email || '') }
                            onClick={SendVerifyCode}
                        >
                            Send Verification Code
                        </Button>
                    }
                    {
                        step === 'confirm_code' && <Button variant={'contained'} 
                            startIcon={ loading && <Loading type='tail_spin' width={30} height={30} fill='#e83e8c' />}
                            className={classes.buttonCss}
                            disabled={ !validator.isEmail(email || '') }
                            onClick={handleAccessProduct}
                        >
                            Ok
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
export default connect(mapStateToProps, mapDispatchToProps)(AccessModal) ;