import React,{useEffect} from 'react' ;

import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux' ;

import Home from '../../components/Landing/Home';
import SolsCloud from '../../components/Landing/SolsCloud';
import Panel from '../../components/Landing/Panel';
import Tracking from '../../components/Landing/Tracking';
import SpaceShip from '../../components/Landing/SpaceShip';
import Footer from '../../components/Layouts/Footer';
import BACKGROUND_IMAGE from '../../assets/background3.png';


import {
    Box,
    Grid,
} from '@mui/material' ;

import { makeStyles } from '@mui/styles' ;

const useStyles = makeStyles((theme) => ({
    root : {
        color : 'white',
    },
    background : {
        position : 'fixed',
        backgroundImage : `url(${BACKGROUND_IMAGE})`,
        backgroundSize : '100% 100%',
        zIndex : '-10000',
        height : '100vh',
        width : '100%'
    }
})) ;

const Landing = (props) => {

    const classes = useStyles();
    const navigate = useNavigate() ;
    
    const {
        isLogin
    } = props ;


    useEffect(() => {
        // console.log(isLogin) ;
        if(isLogin) {
            // navigate('/solstice/profile-screen') ;
        }
    }, [isLogin]);

    return (
        <Box className={classes.root}>
            <Box className={classes.background}/>
            <Home/>
            <SolsCloud/>
            <Panel/>
            <Tracking/>
            <SpaceShip/>
            <Footer />
        </Box>
    )
}


const mapStateToProps = state => ({
    isLogin : state.auth.isLogin
})
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Landing) ;

