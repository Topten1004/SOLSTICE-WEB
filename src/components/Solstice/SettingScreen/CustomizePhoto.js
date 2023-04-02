import * as React from 'react' ;

import { connect } from 'react-redux' ;
import { UserAccountInfo } from '../../../redux/actions/profile';
import PropTypes from 'prop-types' ;

import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import EditImage from '../../../assets/setting/Edit.svg' ;

import ImageEditorModal from '../../Common/ImageEditorModal';

import { v4 as uuidv4 } from 'uuid' ;
import { getCookie } from '../../../utils/Helper';

import { UpdateUserCoverPic, UpdateUserProfilePic } from '../../../firebase/user_collection';

import {
    Box ,
    Grid,
    InputLabel,
    Button
} from '@mui/material' ;

import { useStyles } from './StylesDiv/CustomizePhoto.styles';

const CustomizePhoto = (props) => {

    const classes = useStyles() ;

    const {
        profilePictureUrl,
        coverPhotoUrl,
        profilePicName,
        coverPicName,

        UserAccountInfo
    } = props ;

    const [profilePicture, setProfilePicture] = React.useState({raw : "", preview : "", name:""}) ;
    const [coverPicture, setCoverPicture] = React.useState({raw : "", preview: "", name : ""}) ;

    const [openProfileImageEditorModal, setOpenProfileImageEditorModal] = React.useState(false) ;
    const [openCoverPhotoEditorModal, setOpenCoverPhotoEditorModal]  = React.useState(false) ;

    const handleOpenProfileImageEditorModal  = () => {
        setOpenProfileImageEditorModal(true) ;
    }

    const handleCloseProfileImageEditorModal = () => {
        setOpenProfileImageEditorModal(false) ;
    }
    
    const handleOpenCoverPhotoEditorModal = () => {
        setOpenCoverPhotoEditorModal(true) ;
    }

    const handleCloseCovoerPhotoEditorModal = () => {
        setOpenCoverPhotoEditorModal(false) ;
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

    const CropProfilePicture = async (blob) => {
        await UpdateUserProfilePic(profilePicName, getCookie('_SOLSTICE_AUTHUSER'), blob) ;

        await UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;
    }

    const CropCoverPhoto = async (blob) => {
        await UpdateUserCoverPic(coverPicName, getCookie('_SOLSTICE_AUTHUSER'), blob) ;

        await UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;
    }

    React.useEffect(() => {
        setProfilePicture({
            raw : "",
            name : "",
            preview : profilePictureUrl
        })
    }, [profilePictureUrl]) ;

    React.useEffect(() => {
        setCoverPicture({
            raw : "",
            name : "",
            preview : coverPhotoUrl
        })
    }, [coverPhotoUrl]) ;

    return (
        <Grid container className={classes.root}>
            <Grid item xs={12} sx ={{mb : '5px'}}>
                Profile Photo
            </Grid>
            <Grid item xs={12}>
                <Box className={classes.uploadDiv}>
                    <InputLabel htmlFor="upload-profile-picture" className={classes.upload}>
                    {
                        profilePicture.preview ? (
                            <>
                                <img src={profilePicture.preview} width ={100} height={100} id={'cip-eilforp-ym'} crossOrigin='anonymous'
                                    style={{borderRadius : '50%'}}
                                />
                            </>
                        ) : (
                            <>
                                <CloudUploadOutlinedIcon sx={{width:'73px',height:'45px'}}/>
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
                    <Box className={classes.buttonGroup}>
                        <Button variant={'contained'} className={classes.buttonCss} onClick={handleOpenProfileImageEditorModal}
                            startIcon={<img src={EditImage}/>}
                        >
                            Edit Profile Photo
                        </Button>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} sx={{mt : '15px'}}>
                Cover Photo
            </Grid>
            <Grid item xs={12}  sx={{mt : '5px'}}
            >
                <Box className={classes.uploadDiv}>
                    <InputLabel htmlFor="upload-cover-picture" className={classes.upload}>
                    {
                        coverPicture.preview ? (
                            <>
                                <img src={coverPicture.preview} width ={240} height={60} id={'cip-eilforp-ym'} crossOrigin='anonymous'
                                />
                            </>
                        ) : (
                            <>
                                <CloudUploadOutlinedIcon sx={{width:'73px',height:'45px'}}/>
                            </> 
                        )
                    }
                    </InputLabel>
                    <input
                        type="file"
                        id="upload-cover-picture"
                        style={{ display: "none" }}
                        accept={'image/*'}
                        onChange={handleChangeCoverPicture}
                    />
                    <Box className={classes.buttonGroup}>
                        <Button variant={'contained'} className={classes.buttonCss} onClick={handleOpenCoverPhotoEditorModal}
                            startIcon={<img src={EditImage}/>}
                        >
                            Edit Cover Photo
                        </Button>
                    </Box>
                </Box>
            </Grid>

            <ImageEditorModal
                open={openProfileImageEditorModal}
                handleClose={handleCloseProfileImageEditorModal}

                path={profilePicture.preview}
                id={uuidv4()}
                scale={1}

                handleEndPoint={CropProfilePicture}
            />

            <ImageEditorModal
                open={openCoverPhotoEditorModal}
                handleClose={handleCloseCovoerPhotoEditorModal}

                path={coverPicture.preview}
                id={uuidv4()}
                scale={4}

                handleEndPoint={CropCoverPhoto}
            />
        </Grid>
    )
}

const mapStateToProps = state => ({
    profilePictureUrl : state.profile.profilePictureUrl,
    coverPhotoUrl : state.profile.coverPictureUrl,
    profilePicName : state.profile.profilePictureName,
    coverPicName : state.profile.coverPictureName
})
const mapDispatchToProps = {
    UserAccountInfo
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomizePhoto) ;