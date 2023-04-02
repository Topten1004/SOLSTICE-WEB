import * as React from 'react' ;

import Analysis from './Analysis';
import SolsList from './SolsList';

import {
    Box,
    Grid,
    useMediaQuery,
} from '@mui/material' ;

import { useTheme } from '@mui/styles';
import { useStyles } from './StylesDiv/Total.styles';

const ProductTotalInfo = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;
    
    const match1195 = useMediaQuery('(min-width : 1195px)') ;

    const {
        productInfo
    } = props ;

    React.useEffect(() => {
    }, []) ;

    return (
        <Box className={classes.root}>
            <Box className={classes.blueBlur} />
            <Box className={classes.greenBlur} />
            <Box className={classes.productInfoDiv}>
                <Grid container>
                    <Grid item xs={12}  >
                        <Analysis 
                            productInfo={productInfo}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <SolsList 
                            sols={productInfo?.sols}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default ProductTotalInfo ;