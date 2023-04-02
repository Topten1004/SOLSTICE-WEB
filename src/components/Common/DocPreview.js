import * as React from 'react' ;

import {
    Box
} from '@mui/material';

import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
    root : {
        background : 'linear-gradient(135deg, #e52d65 0%, #629df6 53.09%, #3c1d9d 100%) !important',
        borderRadius : 5,

        width : props => props.width,
        height : props => props.height,

        display : 'flex',
        alignItems : 'center',
        justifyContent : 'center',

        border : '2px solid ' + theme.palette.green.G200
    }
}))
const DocPreview = (props) => {
    const classes = useStyles(props) ;

    const {
        previewUrl,
        width,
        height
    } = props ;

    React.useEffect(async () => {
        if(previewUrl) {
           
        }
    }, [previewUrl]) ;
    
    return (
        <Box className={classes.root}>
            {
                previewUrl ? <iframe 
                    src={`https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(previewUrl)}`} 
                    // src={`https://view.officeapps.live.com/op/embed.aspx?src=${previewUrl}`}
                    width={width - 14}
                    height={height - 14}
                    frameBorder={0}
                /> : <>asdfsdf</>
            }
        </Box>
    )
}

export default DocPreview ;