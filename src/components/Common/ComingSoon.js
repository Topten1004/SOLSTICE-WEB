import React from "react";

import {
    Box, Button
} from '@mui/material';

import {makeStyles} from '@mui/styles' ;

const useStyles = makeStyles((theme) => ({
    root : {
        width : '100%' , height : '100vh',
        display : 'flex', alignItems : 'center', justifyContent : 'center',
        color: theme.palette.green.G200,
        overflow : 'hidden',
    },
    soonPanelDiv : {
        display : 'flex', flexDirection : 'column', alignItems : 'center', justifyContent : 'center',
        border : '2px solid ' + theme.palette.blue.B100,
        maxHeight : 600,

        background : theme.palette.blue.B200,
        width : 500,
        overflow : 'hidden',
        ['@media (max-width : 820px)'] : {
            width : 450
        },
        ['@media (max-width : 730px)'] : {
            width : 400
        },
        ['@media (max-width : 675px)'] : {
            width : 350
        },
        ['@media (max-width : 630px)'] : {
            width : 300
        },
        ['@media (max-width : 540px)'] : {
            width : 400
        },
        ['@media (max-width : 425px)'] : {
            width : 350
        },
        ['@media (max-width : 425px)'] : {
            margin : 5
        },
        padding : 20,
        borderRadius : 20,
        boxShadow : '0 0 20px #eee !important',

        animation: `$soon-panel-animation 1000ms ease-in-out running` ,
    },
    soonDiv : {
        fontSize : 40,
        fontWeight : 600,
        marginBottom : 10,
        maxHeight : 550,
        ['@media (max-width : 820px)'] : {
            fontSize : 30
        },
        ['@media (max-width : 730px)'] : {
            fontSize : 25
        },
        ['@media (max-width : 540px)'] : {
            fontSize : 30
        },
        ['@media (max-width : 425px)'] : {
            fontSize : 25
        },
    },
    updateDiv : {
        padding : 10,
        marginTop : 10,
        fontSize : 20,
        ['@media (max-width : 820px)'] : {
            fontSize : 17
        },
        ['@media (max-width : 730px)'] : {
            fontSize : 15
        },
        ['@media (max-width : 540px)'] : {
            fontSize : 20
        },
        ['@media (max-width : 425px)'] : {
            fontSize : 17
        },
    },
    "@keyframes soon-panel-animation" : {
        "0%" : {
            marginLeft : '100%',
            minWidth : 500
        },
        "50%" : {
            marginLeft : '-20%',
        },
        "100%" : {
            
        }
    },
}))

const ComingSoon = () => {
    const classes = useStyles();

    const onSubmit = () => {
       
    }

    return(
        <Box className={classes.root}>
            <Box className={classes.soonPanelDiv}>
                <Box className={classes.soonDiv}>Coming Soon</Box>
                <Box className={classes.updateDiv}>
                    Welcome to our Original Solstice Profile page and thank you for being an evangelist.<br/><br/>
                    As we build, follow us on Twitter @solscloud and join our Solstice Discord here to get live updates.<br/><br/>
                    Please feel free to shop around and provide any feedback in our Discord community or private chat.<br/>
                </Box>
            </Box>
        </Box>
    );
}

export default ComingSoon;