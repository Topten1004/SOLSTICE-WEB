import React,{ useState, useRef, useEffect } from 'react' ;

import { useNavigate } from 'react-router-dom';

import { connect } from 'react-redux' ;
import PropTypes from 'prop-types' ;

import { eraseCookie, getCookie, getUuid } from '../../../utils/Helper';

import LogoImg from '../../../assets/logo.png' ;

import Setting from './Setting';
import MobileNavbar from './MobileNavbar';

import {
    Box,
    TextField,
    InputAdornment,
    Avatar,
    IconButton,
    useMediaQuery
} from '@mui/material' ;

import SearchIcon from '@mui/icons-material/Search' ;
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root : {
        width : '100%',
        minHeight : theme.layout.headerHeight + "px !important",
        height : theme.layout.headerHeight + "px !important",
        
        background : 'white',
    
        color : theme.palette.primary.main,

        display : 'flex',
        ['@media (max-width : 540px)'] : {
            justifyContent : 'space-between'
        },

        border : '1px solid lightgrey',

        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderRadius : 30
            },
            '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
            }
        },

    },
    logo : {
        height : '100%',
        width : '25%',

        ['@media (max-width : 935px)'] : {
            width : 250
        },

        ['@media (max-width : 330px)'] : {
            paddingRight : 20
        },

        paddingLeft : 20,
        paddingRight : 50,

        display : 'flex',
        alignItems : 'center' ,
        justifyContent : 'center'
    },
    textCtrl : {
        height : '100%',
        width : 'calc(100% - 170px)',

        display : 'flex',
        alignItems : 'center' ,
    },
    avatar : {
        height : '100%',

        marginLeft : '20px',
        paddingRight : 20,
        
        display : 'flex',
        alignItems : 'center' ,
        justifyContent : 'flex-end',

        cursor : 'pointer',
    },
    avatarLabel : {
        paddingLeft : 10,

        display : 'flex',
    },
    username : {
        color : theme.palette.primary.main,
        fontSize : 15,
        fontWeight : 600
    },
    userid : {
        fontSize : 13
    },
    dropIcon : {
        display : 'flex',
        alignItems : 'center',
        paddingLeft : 15,

        "& .MuiSvgIcon-root" : {
            fontSize : 25
        }
    },
    menuIcon : {
        fontSize : '35px !important',
        width : '100%',
        marginRight : 20,
        display : 'flex',
        justifyContent : 'flex-end',
    }
}));

const Header = (props) => {

    const classes = useStyles () ;

    const match1 = useMediaQuery('(min-width: 1150px)') ;
    const match2 = useMediaQuery('(min-width: 725px)') ;

    const {
       
    } = props ;

    const navigate = useNavigate() ;
    const [ isOpenSetting , setIsOpenSetting ] = useState(false) ;
    const [ isDrawMobileNavbar, setIsDrawMobileNavbar ] = useState(false) ;
    const anchorRef = useRef(null) ;

    const [ routine, setRoutine ] = useState('') ;

    const handlePopOver = () => {
        setIsOpenSetting(!isOpenSetting) ;
    }

    const handleDrawMobileNavbar = () => {
        setIsDrawMobileNavbar(!isDrawMobileNavbar) ;
    }

    const handleSignOut = async () => {
        handlePopOver() ;
        await eraseCookie('_SOLSTICE_AUTHUSER') ;
        navigate('/');
        await eraseCookie('email');
    }

    useEffect(() => {
        if(match1) setIsDrawMobileNavbar(false);
    }, [match1]) ;

    useEffect(() => {
        if(isDrawMobileNavbar) {
          document.body.style.overflow = "hidden" ;
        } else {
          document.body.style.overflow = "visible" ;
        }
    } , [isDrawMobileNavbar]) ;
    
    return (
        <Box className={classes.root}>
            <Box className={classes.logo}>
                <Box component={'img'} src={LogoImg} /> 
            </Box>
            {   
                match2 &&
                <Box className={classes.textCtrl}>
                    <TextField 
                        fullWidth
                        size='small'
                        placeholder='Search Routines'
                        InputProps={{
                            endAdornment : <InputAdornment position={'end'}>
                                <SearchIcon />
                            </InputAdornment>
                        }}

                        value={routine}
                        onChange={e => handleChangeRoutine(e.target.value)}
                    />
                </Box>
            }
            {
                getCookie('_SOLSTICE_AUTHUSER') &&   (
                                            match2  ?  <Box className={classes.avatar} onClick={(e) => handlePopOver(e)} ref={anchorRef}>
                                                { 
                                                    getCookie('avatar_url') && 
                                                    <Avatar src={`${getCookie('avatar_url').split('avatars/')[0]}avatars%2F${getCookie('avatar_url').split('avatars/')[1]}`}  />
                                                }
                                                {
                                                    match1 && <Box className={classes.avatarLabel} >
                                                        <Box>
                                                            <Box className={classes.username} >
                                                                { getCookie('email') && getCookie('email').split("@")[0] }
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                }
                                                <Box className={classes.dropIcon}>
                                                    {
                                                        !isOpenSetting ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />
                                                    }
                                                </Box>
                                            </Box> : <Box className={classes.menuIcon}>
                                                <IconButton onClick={() => handleDrawMobileNavbar()}>
                                                    <MenuIcon />
                                                </IconButton>
                                            </Box>
                                        )
            }

            <Setting
                open={isOpenSetting}
                handlePopOver={handlePopOver}
                handleSignOut={handleSignOut}
                anchorEl={anchorRef ? anchorRef.current : null}
            />
            <MobileNavbar 
                isDrawMobileNavbar={isDrawMobileNavbar}
                handleDrawMobileNavbar={handleDrawMobileNavbar}
            />
        </Box>
    )
}

Header.propTypes = {

}

const mapStateToProps = state => ({
    
})
const mapDispatchToProps  = {

}
export default connect(mapStateToProps, mapDispatchToProps)(Header) ;