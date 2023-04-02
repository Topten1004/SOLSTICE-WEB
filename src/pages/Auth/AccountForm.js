import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux' ;
import PropTypes from 'prop-types' ;
import { InputAccountInfo, CheckMyApp } from '../../redux/actions/auth';

import { validateInputValue } from '../../utils/Helper';

import TickImage from '../../assets/common/tick.png';
import CloseImage from '../../assets/Close.png';

import AccountNameModal from '../../components/Auth/AccountNameModal';

import swal from 'sweetalert';

import {
    Box,
    Grid,
    TextField,
    Button,
    InputAdornment,
    Autocomplete,
    useMediaQuery
} from '@mui/material' ;

import { useStyles } from './StylesDiv/Account.styles';

const schema = {
    email: {
        presence: { allowEmpty: false, message: 'is required' },
        email: true,
        length: {
            maximum: 300,
        },
    },
    phone : {
        presence : { allowEmpty : false, message : 'is required'},
        length : {
            maximum : 10,
            minimum : 10,
        }
    },
    password : {
        presence: { allowEmpty: false, message: 'is required' },
        length : {
            minimum : 8,
        }
    }
};

const AccountForm = (props) => {    

    const {
        fullName,
        hostId,

        InputAccountInfo,
        CheckMyApp,
        handleChangeAuthStep,

        duxAccountName,
        duxDetailAccountTypeList,
        duxGeneralAccountTypeList,
        duxAppName
    } = props;

    const classes = useStyles();

    const match900 = useMediaQuery('(min-width : 900px)') ;

    
    const allAccountTypeList = [
        "Business",
        "Developer"
    ]

    const [nameModalOpen, setNameModalOpen] = useState(false) ;
    const [updatedName, setUpdatedName] = useState(false);

    const [generalAccountTypeList, setGeneralAccountTypeList] = useState(['Business']) ;

    const [accountName, setAccountName] = useState('');
    const [detailAccountTypeList, setDetailAccountTypeList] = useState(['Creator']) ;

    const [appName, setAppName] = useState('') ;

    const handleGotoSignIn = () => {
        handleChangeAuthStep('signin') ;
    }

    const handleChangeGeneralAccountTypeList = (value) => {
        setGeneralAccountTypeList(value) ;
    }

    const handleChangeAccountName = (e) => {
        setAccountName(e.target.value) ;
    }
    
    const handleChangeAppName = (e) => {
        setAppName(e.target.value) ;
    }

    const handleChangeDetailAccountTypeList = (value) => {
        setDetailAccountTypeList(value) ;
    }

    const handleNameModalOpen = () => {
        setNameModalOpen(true);
    }

    const handleNameModalClose = () =>{
        setNameModalOpen(false) ;
    }

    const handleNext = async () => {
        if(await CheckMyApp(`https://solsapp.com/${fullName?.replaceAll(' ', '')?.toLowerCase()}.solsapp.${appName}`)) {
            swal({
                title : 'Warning',
                text : "Duplicate Your App URL",
                buttons : false,
                timer : 3000,
                icon : 'warning'
            }) ;
        } else {
            await InputAccountInfo(appName, generalAccountTypeList) ;

            handleChangeAuthStep('imageset') ;
        }
        
    }

    const handleBack = () => {
        handleChangeAuthStep('signup') ;
    }

    useEffect(() => {
        if(duxAccountName && duxDetailAccountTypeList && duxGeneralAccountTypeList && duxAppName) {
            setGeneralAccountTypeList(duxGeneralAccountTypeList) ;
            setDetailAccountTypeList(duxDetailAccountTypeList);
            setAccountName(duxAccountName) ;
            setAppName(duxAppName) ;
            setUpdatedName(true) ;
        }
    }, [duxAccountName, duxDetailAccountTypeList, duxGeneralAccountTypeList, duxAppName]) ;

    return (
        <Box className={classes.root}>
            <Grid container>
                <Grid item xs={match900 ? 6 : 12}>
                    <Box className={classes.descriptionDiv}>
                        <Box className={classes.lineDiv}>

                        </Box>
                        <Box className={classes.helloDiv}>
                            HOST ID: {hostId}
                        </Box>
                        <Box className={classes.welcomeDiv}>
                            {fullName && fullName.split(' ')[0]}
                            <br/>{fullName && fullName.split(' ')[1]}
                        </Box>
                        <Box className={classes.tickDiv}>
                            &gt; Create a SOLS account username, you can change it anytime.
                        </Box>
                        <Box className={classes.slashDiv}>
                            // Create Account = HOST
                        </Box>
                        <Box className={classes.greenBlur} />
                        <Box className={classes.blueBlur} />
                    </Box>
                </Grid>
                <Grid item xs={match900 ? 6 : 12}>
                    <Box className={classes.formDiv}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} className={classes.signUpDiv}>
                                Sign Up
                            </Grid>   
                            <Grid item xs={12}>
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    id="tags-standard"
                                    options={allAccountTypeList}
                                    getOptionLabel={(option) => option}
                                    value={generalAccountTypeList}
                                    onChange={(e, value) => handleChangeGeneralAccountTypeList(value)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Account Type"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label='Name'
                                    placeholder='Account Name'
                                    focused
                                    size='medium'
                                    fullWidth
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">
                                            <Box component={'img'} src={accountName !== '' ? TickImage : CloseImage} sx={{width : '16px', height : '12px'}}/>
                                        </InputAdornment>,
                                    }}

                                    helperText={(accountName !== null && accountName !== '' && !validateInputValue(accountName)) ? "Please, Dont't input any symbol." : null}
                                    value={accountName}
                                    onClick={handleNameModalOpen}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    placeholder='My App'
                                    focused
                                    size='medium'
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">
                                            URL |
                                        </InputAdornment>,
                                        endAdornment: <InputAdornment position="end">
                                            <Box component={'img'} src={appName !== '' ? TickImage : CloseImage} sx={{width : '16px', height : '12px'}}/>
                                        </InputAdornment>,
                                    }}

                                    helperText={(appName !== "" && !validateInputValue(appName)) ? "Please, Dont't input any symbol." : null}
                                    error={!validateInputValue(appName) && appName !== ''}
                                    value={appName}
                                    onChange={handleChangeAppName}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{mt : '20px'}}>
                                <Button variant='contained' className={classes.buttonCss} fullWidth onClick={handleNext}
                                    disabled={(!generalAccountTypeList.length || !updatedName || appName === '') ? true : false}
                                >Next</Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant='contained' className={classes.buttonCss} fullWidth onClick={handleBack}>
                                    Back
                                </Button>
                            </Grid>
                            <Grid item xs={12} className={classes.contentDiv}>
                                <Box>
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

            <AccountNameModal 
                open={nameModalOpen}
                handleClose={handleNameModalClose}
                
                handleChangeAccountName={handleChangeAccountName}
                accountName={accountName}
                handleDetailAccountTypeList={handleChangeDetailAccountTypeList}
                detailAccountTypeList={detailAccountTypeList}

                handleUpdatedName={setUpdatedName}
            />
        </Box>
    );
}

AccountForm.propTypes = {
    InputAccountInfo : PropTypes.func.isRequired,
    CheckMyApp : PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    duxGeneralAccountTypeList : state.auth.generalAccountTypeList,
    duxDetailAccountTypeList : state.auth.detailAccountTypeList,
    duxAccountName : state.auth.accountName,
    duxAppName : state.auth.appName,
    fullName :state.auth.fullName,
    hostId : state.auth.hostId
})

const mapDispatchToProps = {
    InputAccountInfo,
    CheckMyApp
}

export default connect(mapStateToProps, mapDispatchToProps) (AccountForm);