import React,{ useEffect, useState } from 'react' ;

// Core viewer
import { Viewer, Worker } from '@react-pdf-viewer/core';
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';

import {
    Box,
    Avatar,
    IconButton
} from '@mui/material' ;

import CloseIcon from '@mui/icons-material/Close';

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root : {
        display : props => props.open ? 'flex' : 'none',
        position : 'fixed',
        zIndex : 5555,

        width : '100vw',
        height : '100vh',

        left : 0 , top : 0,

        backdropFilter : 'blur(7px)',

        "& .MuiSvgIcon-root" : {
            marginRight : 10
        },

        alignItems : 'center',
        justifyContent : 'center',

        "& img" : {
            maxWidth : '90vw',
            maxHeight : '90vh'
        }
    },
    closeButtonDiv : {
        position: 'fixed !important',
        zIndex : 100,
        left : 20,
        top : 20,

        height : 50,
        width : 50,

        display : 'flex !important', alignItems : 'center', justifyContent: 'center !important',
        background : '#286e452b !important',

        "& svg" : {
            color : theme.palette.green.G200,
            margin : '0px !important',
            fontSize : 40
        }
    }
})) ;

const ImageFullScreen = (props) => {

    // npm install pdfjs-dist@2.6.347
    // npm install react-pdf-viewer@3.1.2
    const {
        open,
        handleClose,
        previewUrl
    } = props ;

    const classes = useStyles(props) ;

    return (
        <Box className={classes.root}>
            <IconButton className={classes.closeButtonDiv} onClick={() => handleClose(false)} color={'success'} >
                <CloseIcon />
            </IconButton>
            {
                previewUrl && <img src={previewUrl} />
            }
            
        </Box>
    )
}

export default ImageFullScreen ;