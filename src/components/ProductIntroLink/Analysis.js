import * as React from 'react' ;

import { useMeasure } from 'react-use' ;

import { connect } from 'react-redux';
import PropTypes from 'prop-types' ;

import ProductInfo from './ProductInfo';

import {
    Box,
    Grid,
    useMediaQuery
} from '@mui/material' ;

import { useStyles } from './StylesDiv/Analysis.styles';

const Analysis = (props) => {

    const classes = useStyles() ;

    const match1164 = useMediaQuery('(min-width : 1164px)') ;
    
    const {
        productInfo
    } = props ;

    React.useEffect(() => {
    }, []) ;

    return (
        <Box className={classes.root}>
           <Grid container spacing={2}>
                <Grid item xs={12} sx={{display : 'flex', justifyContent : 'center'}}>
                    <Box className={classes.creatorInfoDiv} >
                        <Grid container>
                            <Grid item xs={match1164 ? 7 : 12} sx={{display : 'flex', flexDirection : 'column', justifyContent : 'center'}}>
                                <Box className={classes.avatarDiv}>
                                    <img src={ productInfo?.creator?.profile_picture_url} className={classes.avatarCss} />
                                </Box>
                                <Box className={classes.accountNameDiv}>
                                    { productInfo?.creator?.account_name }
                                </Box>
                                <Box className={classes.emailDiv}>
                                    { productInfo?.creator?.email }
                                </Box>
                            </Grid>
                            <Grid  item xs={match1164 ? 5 : 12} className={classes.threeCardDiv}>
                                <Box className={classes.cardDiv}>
                                    <Box className={classes.labelDiv}>
                                        Total Products
                                    </Box>
                                    <Box className={classes.valueDiv}>
                                        { productInfo?.creator?.product_count }
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={12} sx={{display : 'flex', justifyContent : 'center'}}>
                    <ProductInfo 
                        productInfo={productInfo}
                    />
                </Grid>
           </Grid>
        </Box>
    )
}
Analysis.propTypes = {
}
const mapStateToProps = state => ({
 
})
export default Analysis ;