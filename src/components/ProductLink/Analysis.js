import * as React from 'react' ;

import { useMeasure } from 'react-use' ;

import { connect } from 'react-redux';
import PropTypes from 'prop-types' ;

import ProductInfo from './ProductInfo';
import CreatorInfo from './CreatorInfo' ;

import {
    Box,
    Grid,
    useMediaQuery
} from '@mui/material' ;

import { useStyles } from './StylesDiv/Analysis.styles';

const Analysis = (props) => {

    const classes = useStyles() ;
    const match1300 = useMediaQuery('(min-width : 1300px)') ;

    const {
        productInfo
    } = props ;

    const itemListCtrl = React.useRef() ;

    const [ setItemListCtrl, {width, height} ] = useMeasure() ;

    React.useEffect(() => {
        setItemListCtrl(itemListCtrl.current) ;
    }, []) ;

    React.useEffect(() => {
    }, []) ;

    return (
        <Box className={classes.root}>
            <Box className={classes.welcomeDiv}>
                Welcome to {productInfo.creator.account_name}'s Product
            </Box> 
            <Grid container spacing={2}>
                <Grid item xs={match1300 ? 6 : 12} sx={{display : 'flex', justifyContent : 'center'}}>
                    <CreatorInfo
                        productInfo={productInfo}
                    />
                </Grid>
                <Grid item xs={match1300 ? 6 : 12} sx={{display : 'flex', justifyContent : 'center'}}>
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