import * as React from 'react' ;

import {
    Box,
} from '@mui/material' ;

import { useStyles } from './StylesDiv/CreatorInfo.styles';

const CreatorInfo  = (props) => {
    const classes = useStyles() ;
    
    const {
        productInfo
    } = props ;

    return (
        <Box className={classes.creatorInfoDiv}>
            <Box >
                <Box className={classes.avatarDiv}>
                    <img src={ productInfo?.creator?.profile_picture_url} className={classes.avatarCss} />
                </Box>
                <Box className={classes.accountNameDiv}>
                    { productInfo?.creator?.account_name }
                </Box>
                <Box className={classes.emailDiv}>
                    { productInfo?.creator?.email }
                </Box>
            </Box>
            <Box sx={{display :'flex',gap : '10px', alignItems : 'center', justifyContent : 'center', flexWrap : 'wrap', mt : '10px'}}>
                <Box className={classes.cardDiv}>
                    <Box className={classes.labelDiv}>
                        Total Products
                    </Box>
                    <Box className={classes.valueDiv}>
                        { productInfo?.creator?.product_count }
                    </Box>
                </Box>
            </Box>
        </Box>
    )
} ;

export default CreatorInfo ;