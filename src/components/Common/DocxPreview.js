import * as React from 'react' ;

import FileViewer from '@nuzz78/react-file-viewer' ;
import { CustomErrorComponent } from 'custom-error';

import WordImage from '../../assets/common/Word.png' ;

import { v4 as uuidv4 } from 'uuid';

import {
    Box 
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root : {
        paddingLeft : '0px !important',
        marginTop : '0px !important', marginBottom : '0px !important',
        // whiteSpace: 'pre-wrap !important',
        fontFamily : 'Montserrat !important',
        fontSize : '15px !important',

        "& div" : {
            fontSize : '15px !important',
            margin : '5px !important',
            padding : '0px !important'
        },
        "& ol" : {
            fontSize : '15px !important',
            margin : '0px !important',
            marginLeft : '5px !important',
            padding : '0px !important',
            paddingLeft : '10px !important'
        },
        "& li" : {
            fontSize : '15px !important',
            margin : '5px !important',
            padding : '0px !important'
        },
        "& ul" : {
            fontSize : '15px !important',
            margin : '0px !important',
            marginLeft : '5px !important',
            padding : '0px !important',
            paddingLeft : '10px !important'
        },
        "& p" : {
            fontSize : '15px !important',
            margin : '5px  !important',
            padding : '0px !important'
        },
        "& h1" : {
            fontSize : '15px !important',
            margin : '5px  !important',
            padding : '0px !important'
        },
        "& h2" : {
            fontSize : '15px !important',
            margin : '5px  !important',
            padding : '0px !important'
        },
        "& h3" : {
            fontSize : '15px !important',
            margin : '5px  !important',
            padding : '0px !important'
        },
        "& h4" : {
            fontSize : '15px !important',
            margin : '5px  !important',
            padding : '0px !important'
        },
        "& h5" : {
            fontSize : '15px !important',
            margin : '5px  !important',
            padding : '0px !important'
        },
        "& h6" : {
            fontSize : '15px !important',
            margin : '5px  !important',
            padding : '0px !important'
        },
        "& span" : {
            fontSize : '15px !important',
            margin : '5px  !important',
            padding : '0px !important'
        },
        "& img" : {
            width : 30,
            height : 30
        },
        display : 'flex', alignItems : 'center', justifyContent : 'center',
        overflow : 'hidden',
        color : 'black',

        position: 'absolute',
        width: props => props.width + 'px !important',
        height : props => props.height + 'px !important',

        zIndex: 5554,
        background : 'linear-gradient(135deg, #e52d65 0%, #629df6 53.09%, #3c1d9d 100%) !important',
        borderRadius : 10,

        "& .document-container" : {
            width : props => (props.width )+ 'px !important',
            height : props => ( props.height) + 'px !important',
            overflowY : 'scroll',
            boxSizing : 'border-box !important',
            background : 'none !important',
            overflowX : 'hidden',
            boxSizing : 'border-box',
            margin : '0px !important',
            position : 'absolute !important',
            zIndex : 1000,
            padding : 10,
            left : 0,
            top : 0,

            "&::-webkit-scrollbar-track" : {
                marginTop : '10px',
                marginBottom : '10px'
            },
          
        },
        "& .pg-viewer-wrapper" : {
            overflow : 'hidden'
        },
        "& .pg-viewer" : {
            position : 'static !important'
        },
    }
}))
const DocxPreview = (props) => {

    const {
        previewUrl,
        selfIndex,
        activeIndex,
        width,
        height,
        forceHide
    } = props ;

    const classes = useStyles(props) ;
    const thisRef = React.useRef() ;

    const onError = (e) => {
        console.log(e) ;
    }

    return (
        <Box className={classes.root} key={uuidv4()} ref={thisRef} id={uuidv4()}>
        {
            previewUrl && (selfIndex === activeIndex) && !forceHide ? <FileViewer
                fileType={'docx'}
                filePath={previewUrl}
                errorComponent={CustomErrorComponent}
                onError={onError}
                key={uuidv4()}
            /> : <img src={WordImage} width={100} height={100}/>
        }
        </Box>
  );
} 

export default DocxPreview ;