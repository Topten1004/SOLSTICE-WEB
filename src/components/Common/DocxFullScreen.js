import * as React from 'react' ;

import FileViewer from '@nuzz78/react-file-viewer' ;
import { CustomErrorComponent } from 'custom-error';

import CloseIcon from '@mui/icons-material/Close';

import { v4 as uuidv4 } from 'uuid';

import {
    Box ,
    IconButton
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root : {
        display : props => props.open ? 'flex' : 'none',
        justifyContent : 'center', alignItems : 'center',
        background : 'white',
        position : 'fixed',
        zIndex : 5555,

        width : '100vw',
        height : '100vh',

        // width : props => props.width ,
        // height : props => props.height ,
        left : 0 , top : 0,

        fontFamily : 'Montserrat !important',
        fontSize : '15px !important',

        // "& div" : {
        //     fontSize : '15px !important',
        //     margin : '5px !important',
        //     padding : '0px !important'
        // },
        // "& ol" : {
        //     fontSize : '15px !important',
        //     margin : '0px !important',
        //     marginLeft : '5px !important',
        //     padding : '0px !important',
        //     paddingLeft : '10px !important'
        // },
        // "& li" : {
        //     fontSize : '15px !important',
        //     margin : '5px !important',
        //     padding : '0px !important'
        // },
        // "& ul" : {
        //     fontSize : '15px !important',
        //     margin : '0px !important',
        //     marginLeft : '5px !important',
        //     padding : '0px !important',
        //     paddingLeft : '10px !important'
        // },
        // "& p" : {
        //     fontSize : '15px !important',
        //     margin : '5px  !important',
        //     padding : '0px !important'
        // },
        // "& h1" : {
        //     fontSize : '15px !important',
        //     margin : '5px  !important',
        //     padding : '0px !important'
        // },
        // "& h2" : {
        //     fontSize : '15px !important',
        //     margin : '5px  !important',
        //     padding : '0px !important'
        // },
        // "& h3" : {
        //     fontSize : '15px !important',
        //     margin : '5px  !important',
        //     padding : '0px !important'
        // },
        // "& h4" : {
        //     fontSize : '15px !important',
        //     margin : '5px  !important',
        //     padding : '0px !important'
        // },
        // "& h5" : {
        //     fontSize : '15px !important',
        //     margin : '5px  !important',
        //     padding : '0px !important'
        // },
        // "& h6" : {
        //     fontSize : '15px !important',
        //     margin : '5px  !important',
        //     padding : '0px !important'
        // },
        // "& span" : {
        //     fontSize : '15px !important',
        //     margin : '5px  !important',
        //     padding : '0px !important'
        // },
        // "& img" : {
        //     width : 30,
        //     height : 30
        // },
        // overflowX : 'hidden',
        // color : 'black',
        
        // "& #docx" : {
        //     margin : '0px !important'
        // },
        "& .document-container" : {
            color : 'black !important'
        },
        // "& .pg-viewer-wrapper" : {
        //     margin : '0px !important',
        //     padding : '0px !important',
        //     maxWidth : props => props.width + 'px !important',
        //     maxHeight : props => props.height + 'px !important',
        //     overflow : 'hidden'
        // },
        // "& .pg-viewer" : {
        //     margin : '0px !important',
        //     padding : '0px !important',
        //     maxWidth : props => props.width + 'px !important',
        //     maxHeight : props => props.height + 'px !important',
        //     overflow : 'hidden'
        // },
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
}))
const DocxFullScreen = (props) => {

    const {
        previewUrl,
        handleClose,
        open
    } = props ;

    const classes = useStyles(props) ;
    const thisRef = React.useRef() ;

    const onError = (e) => {
        console.log(e) ;
    }

    return (
        <Box className={classes.root} key={uuidv4()} ref={thisRef}>
            <IconButton className={classes.closeButtonDiv} onClick={() => handleClose(false)} color={'success'} >
                <CloseIcon />
            </IconButton>
        {
            previewUrl && open && <FileViewer
                fileType={'docx'}
                filePath={previewUrl}
                errorComponent={CustomErrorComponent}
                onError={onError}
                key={uuidv4()}
            /> 
        }
        </Box>
  );
} 

export default DocxFullScreen ;