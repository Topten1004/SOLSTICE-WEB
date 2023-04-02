import * as React from 'react' ;

import { NFTBalance } from '../../web3/fetch';

import {
    Box, 
    Grid,
    useMediaQuery
} from '@mui/material' ;

import { makeStyles, useTheme } from '@mui/styles' ;

const useStyles = makeStyles((theme) => ({
    root : {
        border : '1px solid ' + theme.palette.green.G300,
        borderRadius : 10,
        width : 'auto',
        maxWidth : 550,
        padding  : 20,
    },
    gridDiv : {
        ['@media (max-width : 465px)'] : {
            "& .MuiGrid-item:nth-child(odd)" : {
                paddingLeft : 30
            }
        }
    }
}))

const ProductInfo = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;

    const match465 = useMediaQuery('(min-width : 465px)') ;

    const {
        productInfo
    } = props ;

    const [balanceOf, setBalanceOf] = React.useState(0) ;

    React.useEffect(async () => {
        if(productInfo?.price_type === 'rare' || productInfo.price_type === 'legendary') {
            console.log(productInfo) ;
            if( !productInfo?.resellable && productInfo.price_type === 'legendary' ) return ;

            let balanceOf = await NFTBalance( productInfo.nft_id, productInfo.creator_wallet) ;
            setBalanceOf(balanceOf) ;
        }
    }, [productInfo]) ;

    return (
        <Box className={classes.root}>
            <Grid container spacing={1} className={classes.gridDiv}>
                <Grid item xs={12} sx={{fontSize: '18px !important', fontWeight : 'bold', borderBottom : '1px solid ' + theme.palette.green.G400, paddingLeft : '0px !important'}}>
                    Product Information
                </Grid>
                <Grid item xs={match465 ? 6 : 12} >
                    Product Name
                </Grid>
                <Grid item xs={match465 ? 6 : 12} >
                    { productInfo?.product_name }  
                </Grid>
                <Grid item xs={match465 ? 6 : 12}>
                    Price Type
                </Grid>
                <Grid item xs={match465 ? 6 : 12} sx={{textTransform : 'capitalize'}} >
                    {`${productInfo?.price_type}`}
                </Grid>
                {
                    productInfo?.price_type === 'legendary' &&
                    <>
                        <Grid item xs={match465 ? 6 : 12}>
                            Price Per Product
                        </Grid>
                        <Grid item xs={match465 ? 6 : 12} >
                            { productInfo?.product_price } USD
                        </Grid>
                        {
                            productInfo.resellable && <>
                                <Grid item xs={match465 ? 6 : 12}>
                                    Price Per Ticket
                                </Grid>
                                <Grid item xs={match465 ? 6 : 12} >
                                    { productInfo?.ticket_price } USD
                                </Grid>
                                <Grid item xs={match465 ? 6 : 12}>
                                    # of Ticket Available
                                </Grid>
                                <Grid item xs={match465 ? 6 : 12} >
                                    { productInfo?.ticket_count }
                                </Grid>
                                <Grid item xs={match465 ? 6 : 12}>
                                    Royalty
                                </Grid>
                                <Grid item xs={match465 ? 6 : 12} >
                                    { productInfo?.royalty } %
                                </Grid>
                                <Grid item xs={match465 ? 6 : 12}>
                                    NFT ID
                                </Grid>
                                <Grid item xs={match465 ? 6 : 12} >
                                    # { productInfo?.nft_id }
                                </Grid>
                                <Grid item xs={match465 ? 6 : 12}>
                                    Product or NFT
                                </Grid>
                                <Grid item xs={match465 ? 6 : 12} >
                                    { productInfo?.resellable ? 'NFT' : 'General' }
                                </Grid>
                                <Grid item xs={match465 ? 6 : 12}>
                                    # Creator NFT Balance
                                </Grid>
                                <Grid item xs={match465 ? 6 : 12} >
                                    { balanceOf }
                                </Grid>
                            </>
                        }
                    </>
                }
                {
                    productInfo?.price_type === 'rare' &&
                    <>
                        <Grid item xs={match465 ? 6 : 12}>
                            Minimum Bidding Price
                        </Grid>
                        <Grid item xs={match465 ? 6 : 12} >
                            { productInfo?.minimum_bidding } USD
                        </Grid>
                        <Grid item xs={match465 ? 6 : 12}>
                            # of Available Items
                        </Grid>
                        <Grid item xs={match465 ? 6 : 12} >
                            { productInfo?.available_items }
                        </Grid>
                        <Grid item xs={match465 ? 6 : 12}>
                            NFT ID
                        </Grid>
                        <Grid item xs={match465 ? 6 : 12} >
                            # { productInfo?.nft_id }
                        </Grid>
                        <Grid item xs={match465 ? 6 : 12}>
                            # Creator NFT Balance
                        </Grid>
                        <Grid item xs={match465 ? 6 : 12} >
                            { balanceOf }
                        </Grid>
                    </>
                }
                {
                    productInfo?.price_type === 'recurring' &&
                    <>
                        <Grid item xs={match465 ? 6 : 12}>
                            Price Per Subscription
                        </Grid>
                        <Grid item xs={match465 ? 6 : 12} >
                            { productInfo?.recurring_price } USD
                        </Grid>
                        <Grid item xs={match465 ? 6 : 12}>
                            Payment
                        </Grid>
                        <Grid item xs={match465 ? 6 : 12} >
                            Monthly
                        </Grid>
                        <Grid item xs={match465 ? 6 : 12}>
                            Release Date
                        </Grid>
                        <Grid item xs={match465 ? 6 : 12} >
                            { new Date(productInfo?.release_date).toLocaleDateString() }
                        </Grid>
                        <Grid item xs={match465 ? 6 : 12}>
                            Distribution Schedule
                        </Grid>
                        <Grid item xs={match465 ? 6 : 12} >
                            Weekly
                        </Grid>
                    </>
                }
                {
                    productInfo?.price_type === 'free' &&
                    <>
                        <Grid item xs={match465 ? 6 : 12}>
                            Release Date
                        </Grid>
                        <Grid item xs={match465 ? 6 : 12} >
                            { new Date(productInfo?.created_at).toLocaleDateString() }
                        </Grid>
                    </>
                }
            </Grid>
        </Box>
    )
}
export default ProductInfo ;