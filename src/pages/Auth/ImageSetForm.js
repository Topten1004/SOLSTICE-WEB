import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { connect } from 'react-redux' ;
import PropTypes from 'prop-types' ;
import { UploadProfilePicture, UploadCoverPhoto,SignUpFinalUserInfo, LoadingSignUp, InputImagesForUser, InitAuthReducer } from '../../redux/actions/auth';

import Loading from 'react-loading-components' ;
import MessageModal from '../../components/Modals/MessageModal';
import swal from 'sweetalert';

import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

import { v4 as uuidv4 } from 'uuid' ;

import {
    Box,
    Grid,
    InputLabel,
    Input,
    Button,
    useMediaQuery
} from '@mui/material' ;

import { useStyles } from './StylesDiv/ImageSet.styles';

const ImageSetForm = (props) => {

    const classes = useStyles();
    
    const {
        InitAuthReducer,
        InputImagesForUser,
        UploadProfilePicture,
        UploadCoverPhoto,
        SignUpFinalUserInfo,
        handleChangeAuthStep,

        profilePictureObj,
        coverPhotoObj,

        fullName,
        email ,
        password,
        phoneNumber,
        hostId,
        accountName,
        detailAccountTypeList,
        generalAccountTypeList,
        appName,
        LoadingSignUp,
        loadingSignUp,
    } = props;

    const match768 = useMediaQuery('(min-width : 768px)') ;

    const navigate = useNavigate() ;

    const [profilePicture, setProfilePicture] = useState({raw : "", preview : "", name:""}) ;
    const [coverPicture, setCoverPicture] = useState({raw : "", preview: "", name : ""}) ;
    const [openMessageModal, setOpenMessageModal] = useState(false) ;
    const [isSuccessful, setIsSuccessful] = useState(false) ;

    const handleOpenMessageModal = () => {
        setOpenMessageModal(true) ;
    }
    
    const handleCloseMessageModal = () => {
        if(isSuccessful) handleChangeAuthStep('signin') ;
        else handleChangeAuthStep('signup') ;

        setOpenMessageModal(false) ;
    }

    const handleGotoSignIn = () => {
        handleChangeAuthStep('signin') ;
    }

    const handleChangeProfilePicture = (e) => {
        if(e.target.files.length) {
            setProfilePicture({
                preview : URL.createObjectURL(e.target.files[0]),
                name : e.target.files[0].name,
                raw : e.target.files[0]
            }) ;
        }
    }

    const handleChangeCoverPicture = (e) => {
        if(e.target.files.length) {
            setCoverPicture({
                preview : URL.createObjectURL(e.target.files[0]),
                name : e.target.files[0].name,
                raw : e.target.files[0]
            }) ;
        }
    }

    const handleFinalSignUp = async () => {
        LoadingSignUp(true) ;
        
        let result = await SignUpFinalUserInfo(
            fullName,
            email,
            password,
            phoneNumber,
            hostId,
            accountName,
            detailAccountTypeList,
            generalAccountTypeList,
            `https://solsapp.com/${fullName?.replaceAll(' ', '')?.toLowerCase()}.solsapp.${appName}`
        ) ;

        if(result === 'duplicate user') {
            LoadingSignUp(false) ;

            return swal({
                title : "Duplicate User",
                text : 'User who have this email is exist',
                icon : 'error',
                buttons : false,
                timer : 5000
            }) ;
        }
        if(result === 'missing param') {
            LoadingSignUp(false) ;

            return swal({
                title : "Missing Parameter",
                text : 'Please, Input all parameters',
                icon : 'warning',
                buttons : false,
                timer : 5000
            }) ;
        }
 
        if(profilePicture.name)   await UploadProfilePicture(uuidv4(), profilePicture.raw, result) ;
        if(coverPicture.name) await UploadCoverPhoto(uuidv4(), coverPicture.raw, result);

        LoadingSignUp(false) ;

        await swal({
            title : 'Thank you for successfully signing up',
            text : "Please check your mailbox for a confirmation email from admin@solsapp.com\n"
                    + "if you don’t receive email within 2min please check your spam folder",
            icon : 'success',
            buttons : {
                confirm : {text:'Got it'}
            },
        }) ;

        handleChangeAuthStep('signin') ;
        // handleOpenMessageModal() ;
    }

    const handleBack = async () => {
        await InputImagesForUser(profilePicture, coverPicture) ;
        handleChangeAuthStep('account') ;
    }

    useEffect(() => {
        if(profilePictureObj && profilePicture.raw === '') {
            setProfilePicture(profilePictureObj) ;
        }
        if(coverPhotoObj && coverPicture.raw === '') {
            setCoverPicture(coverPhotoObj) ;
        }
    }, [profilePictureObj, coverPhotoObj]) ;

    useEffect(() => {
        return () => {
            setIsSuccessful(false) ;
        }
    }, []) ;

    return ( 
        <Box className={classes.root}>
            <Grid container>
                <Grid item xs={match768 ? 6 : 12}>
                    <Box className={classes.descriptionDiv}>
                        <Box className={classes.lineDiv}>

                        </Box>
                        <Box className={classes.helloDiv}>
                            Update your profile,
                        </Box>
                        <Box className={classes.welcomeDiv}>
                            Buy, Sell, and
                            <br/>Resell Digital
                            <br />Products
                        </Box>
                        <Box className={classes.tickDiv}>
                            &gt; with confidence.
                        </Box>
                        <Box className={classes.slashDiv}>
                            // Create Account = HOST
                        </Box>
                        <Box className={classes.greenBlur} />
                        <Box className={classes.blueBlur} />
                    </Box>
                </Grid>
                <Grid item xs={match768 ? 6 : 12}>
                    <Box className={classes.formDiv}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} className={classes.signUpDiv}>
                                Profile Set Up
                            </Grid>   
                            <Grid item xs={12}>
                                <Box className={classes.uploadDiv}>
                                    <InputLabel htmlFor="upload-profile-picture" className={classes.upload}>
                                    {
                                        profilePicture.preview ? (
                                            <>
                                                <img src={profilePicture.preview} width ={100} height={100} />
                                            </>
                                        ) : (
                                            <>
                                                <CloudUploadOutlinedIcon sx={{width:'73px',height:'45px'}}/>
                                                <Box>
                                                    Profile Picture
                                                </Box>
                                            </> 
                                        )
                                    }
                                    </InputLabel>
                                    <input
                                        type="file"
                                        id="upload-profile-picture"
                                        name="profile-picture"
                                        style={{ display: "none" }}
                                        accept={'image/*'}
                                        onChange={handleChangeProfilePicture}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box className={classes.uploadDiv}>
                                    <InputLabel htmlFor="upload-cover-photo" className={classes.upload}>
                                    {
                                        coverPicture.preview ? (
                                            <>
                                                <img src={coverPicture.preview} width ={280} height={130}  />
                                            </>
                                        ) : (
                                            <>
                                                <CloudUploadOutlinedIcon sx={{width:'73px',height:'45px'}}/>
                                                <Box>
                                                    Cover Photo
                                                </Box>
                                            </> 
                                        )
                                    }
                                    </InputLabel>
                                    <input
                                        type="file"
                                        id="upload-cover-photo"
                                        name="cover-photo"
                                        accept={'image/*'}
                                        style={{ display: "none" }}
                                        onChange={handleChangeCoverPicture}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant='contained' className={classes.buttonCss} fullWidth onClick={handleFinalSignUp} disabled={ loadingSignUp ? true : false }
                                    startIcon={loadingSignUp && <Loading type='tail_spin' width={30} height={30} fill='#e83e8c' />}
                                >
                                    {
                                        loadingSignUp ? "Signing Up..." : "Sign Up"
                                    }
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant={'contained'} className={classes.buttonCss} fullWidth onClick={handleBack} >
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
            <MessageModal 
                title={isSuccessful ? 'Thank you for successfully signing up' : "Please Make sure you enter correct credentials"}
                type={isSuccessful ? 'success' : 'error'}
                message={isSuccessful ? 'An email will be sent shortly from admin@solsapp.com' : 'Account is existed with the email you entered'}

                open={openMessageModal}
                handleClose={handleCloseMessageModal}
            />
        </Box>
    );
}

ImageSetForm.propTypes = {
    UploadCoverPhoto : PropTypes.func.isRequired,
    UploadProfilePicture : PropTypes.func.isRequired,
    SignUpFinalUserInfo : PropTypes.func.isRequired,
    LoadingSignUp : PropTypes.func.isRequired,
    InputImagesForUser : PropTypes.func.isRequired,
    InitAuthReducer : PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    fullName : state.auth.fullName,
    email : state.auth.email,
    password: state.auth.password,
    phoneNumber : state.auth.phoneNumber,
    hostId : state.auth.hostId,
    accountName : state.auth.accountName,
    detailAccountTypeList : state.auth.detailAccountTypeList,
    generalAccountTypeList : state.auth.generalAccountTypeList,
    appName : state.auth.appName,
    loadingSignUp : state.auth.loadingSignUp,

    profilePictureObj : state.auth.profilePictureObj,
    coverPhotoObj : state.auth.coverPhotoObj
}) ;

const mapDispatchToProps = {
    UploadProfilePicture,
    UploadCoverPhoto,
    SignUpFinalUserInfo,
    LoadingSignUp,
    InputImagesForUser,
    InitAuthReducer
}

export default connect(mapStateToProps, mapDispatchToProps) (ImageSetForm);