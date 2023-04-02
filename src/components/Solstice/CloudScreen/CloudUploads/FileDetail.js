import * as React from 'react' ;

import {
    Box
} from '@mui/material' ;

import {makeStyles} from '@mui/styles' ;

const useStyles = makeStyles((theme) => ({
    root : {

    },
    infoDiv : {
        display : 'flex', flexDirection : 'column', gap : '10px'
    }
}))
 const FileDetail = (props) => {
    const classes = useStyles() ;

    const {
        fileDetailInfo
    } = props ; 

    return (
        <Box className={classes.root}>
            {
               fileDetailInfo?.price_type === 'legendary' && <Box className={classes.infoDiv}>
                    <Box>
                        Price per product: {fileDetailInfo?.product_price}usd
                    </Box>
                    <Box>
                        Price per ticket : {fileDetailInfo?.ticket_price}
                    </Box>
                    <Box>
                        # of tickets available: {fileDetailInfo?.ticket_count}
                    </Box>
                    <Box>
                        Royalty: {fileDetailInfo?.royalty}%
                    </Box>
                </Box>
            }
            {
               fileDetailInfo?.price_type === 'rare' && <Box className={classes.infoDiv}>
                    <Box>
                        Minimum Bidding: {fileDetailInfo?.minimum_bidding}usd
                    </Box>
                    <Box>
                        Royalty: {fileDetailInfo?.royalty}%
                    </Box>
                    <Box>
                        Avaliable Items: {fileDetailInfo?.available_items}
                    </Box>
                    <Box>
                        Listing Time Frame : 
                        &nbsp;{fileDetailInfo?.listing_time.from.year}.
                        {fileDetailInfo?.listing_time.from.month}.
                        {fileDetailInfo?.listing_time.from.day}&nbsp;-&nbsp; 
                        {fileDetailInfo?.listing_time.to.year}.{fileDetailInfo?.listing_time.to.month}.{fileDetailInfo?.listing_time.to.day} 
                    </Box>
                </Box>
            }
            {
               fileDetailInfo?.price_type === 'recurring' && <Box className={classes.infoDiv}>
                    <Box>
                        Price per subscription: {fileDetailInfo?.recurring_price}usd
                    </Box>
                    <Box>
                        Payment: {fileDetailInfo?.payment_method}
                    </Box>
                    <Box>
                        Release Date : {new Date(fileDetailInfo?.release_date).toLocaleDateString()} 
                    </Box>
                    <Box>
                        Distribution Schedule: {fileDetailInfo?.distribution_schedule}
                    </Box>
                </Box>
            }
            {
               fileDetailInfo?.price_type === 'free' && <Box className={classes.infoDiv}>
                    <Box>
                        Release Date : {new Date(fileDetailInfo?.release_date).toLocaleDateString()} 
                    </Box>
                    <Box>
                        Distribution Schedule: {fileDetailInfo?.distribution_schedule}
                    </Box>
                </Box>
            }
        </Box>
    )
}

export default FileDetail ;