import React from "react";

import {
    Box,
    Grid,
    useMediaQuery
} from '@mui/material' ;

import { makeStyles } from '@mui/styles' ;

const useStyles = makeStyles((theme) => ({
    root : {
        display : "flex" , alignItems : 'center', justifyContent : 'center', flexDirection : 'column',
        background : theme.palette.blue.main,
        width : '100%', height : '100vh',
        "& .MuiGrid-item" : {
            textAlign : 'center',
            fontSize : '20px'
        }
    },
    site : {
        fontSize : 40,
        ['@media (max-width : 400px)'] : {
            fontSize : 30
        },
        paddingBottom : '15px',
        color : theme.palette.green.G200,
        letterSpacing : 10
    },
    panel : {
        backgroundColor : theme.palette.blue.B200,
        width : 370,
        padding : 20,
        ['@media (max-width : 390px)'] : {
            width : 'auto',
            margin : 5,
            padding : 10,
            fontSize : '12px !important'
        },
        borderRadius : 5,
        display : 'flex', alignItems:'center', justifyContent : 'center', flexDirection : 'column',
        color : theme.palette.green.G200
    },
    error : {
        fontSize : '25px !important',
        fontWeight : 'bold',
        color : '#cd2424'
    },
    contactDiv : {
        color :theme.palette.green.G200,
        fontSize : 20,
        marginTop : 20,
        "& a" : {
            color : theme.palette.blue.B100,
            "&:hover" : {
                color :'white'
            }
        }
    }
}))
const NotFound = () => {
    const classes = useStyles() ;
    const match350 = useMediaQuery('(min-width : 350px)') ;

    return (
        <Box className={classes.root}>
            <Box className={classes.site}>
                SOLSTICE
            </Box>
            <Box className={classes.panel}>
                <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.error}>
                        Page Not Found
                    </Grid>
                    <Grid item xs={12}>
                        Sorry, we couldn't find the page.
                    </Grid>
                    <Grid item xs={12}>
                        Please check the URL and try again.
                    </Grid>
                    <Grid item xs={12}>
                        (Error code 404)
                    </Grid>
                </Grid>
            </Box>
            <Box className={classes.contactDiv}>
                © Solstice 2022 {match350 && '|'} {!match350 && <br/> } <a href='#'>Contact Support</a>
            </Box>
        </Box>
    );
}

NotFound.propTypes = {

};

export default NotFound;
