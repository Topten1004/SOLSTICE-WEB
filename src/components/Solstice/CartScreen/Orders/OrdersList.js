import * as React from 'react' ;

import { useWalletInfo } from '../../../../contexts/WalletContext' ;
import { useStripeInfo } from '../../../../contexts/StripeContext';

import Loading from 'react-loading-components' ;

import { connect } from 'react-redux' ;
import PropTypes from 'prop-types' ;
import { UserOrdersInfoList, SendRareAccessUrl } from '../../../../redux/actions/cart' ;
import { createPaymentIntent } from '../../../../stripe/payment_api';

// Firebase Pkg
import { UpdateRareOwners } from '../../../../firebase/product_collection';
import { SellerStripeInfo } from '../../../../firebase/user_collection';
import { CreatePayment } from '../../../../firebase/payment_collection';
import { IncompleteBid, CompleteBid, CancelBid } from '../../../../firebase/bid_collection';

import { getCookie, walletAddressFormat } from '../../../../utils/Helper';

import ActionPopOver from './ActionPopOver';
import { Payment, SellNFT } from '../../../../web3/market';
import { NFTBalance } from '../../../../web3/fetch';

import SearchOffIcon from '@mui/icons-material/SearchOff';

import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';

import md5 from 'md5';
import { toast } from 'react-toastify/dist/react-toastify';

import {
    Box,
    Grid,
    TableContainer, 
    Table, 
    TableBody, 
    TableHead, 
    TableRow, 
    TableCell,
    TableFooter,
    TablePagination,
    Tooltip,
    Button
} from '@mui/material' ;

import { makeStyles, useTheme } from '@mui/styles' ;

const useStyles = makeStyles((theme) => ({
    root : {
        border : '1px solid '+theme.palette.blue.B100+' !important', borderRadius : '15px !important',
        backgroundColor : theme.palette.blue.B200,
        padding : '10px !important',
        
        "& .MuiTableContainer-root" : {
            "&::-webkit-scrollbar-thumb" : {
                backgroundColor : "#538f815c" ,
                borderRadius : "5px"
            } ,
            "&::-webkit-scrollbar-track" : {
                backgroundColor : "#538f815c" ,
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
            },
            "&::-webkit-scrollbar":{
                width : "10px",
                height : '10px',
                cursor : 'pointer !important'
            } ,
            maxHeight : '900px !important',
        },
        "& .MuiTable-root" : {
            minWidth : 1400,
            borderCollapse: 'separate !important',
            borderSpacing: '0 10px',
            "& .MuiTableCell-root" : {
                color : 'white',
                padding : '10px !important',
            }
        },
        "& .MuiTableHead-root" : {
            "& .MuiTableCell-root" : {
                fontSize : '13px',
            }
        },
        "& .MuiTableBody-root" : {
            "& .MuiTableRow-root" : {
                cursor : 'pointer',
                transition : '0.2s',
                "&:hover" : {
                    background : theme.palette.blue.B300 + ' !important'
                },
            },
            "& .MuiTableCell-root" : {
                background : '#538f815c',
                border : 'none !important',
                marginBottom : '10px !important',
                fontSize : '13px',
                "&:first-child": {
                    borderBottomLeftRadius : '10px !important', borderTopLeftRadius : '10px !important',
                },
                "&:last-child": {
                    borderBottomRightRadius : '10px !important', borderTopRightRadius : '10px !important',
                },
            }
        },
        "& .MuiTableFooter-root" : {
            "& .MuiTablePagination-root" : {
                color : theme.palette.green.G200 + " !important",
                "& svg" : {
                    color : theme.palette.green.G200
                }
            },
            "& .MuiTablePagination-spacer" : {
                "-webkit-flex" : 'none !important',
                flex : 'none !important'
            },
            "& .MuiInputBase-input" : {
                color : theme.palette.green.G200 + " !important",
            }
        }
    },
    paper : {
        backgroundColor : theme.palette.blue.main + ' !important',
        "& .MuiList-root" : {
            padding : '0px !important',
        },
        "& .MuiMenuItem-root" : {
            borderBottom : '1px solid '+theme.palette.green.G400+' !important',
            "&:last-child" : {
                borderBottom : 'none !important',
            },
            background : theme.palette.blue.B300 + " !important",
            color : theme.palette.green.G200 + " !important",
        },
    },
    acceptDiv : {
        color : '#495616 !important', fontWeight : 'bold',fontSize : 12,
        height : 35, width : 100,
        background : '#57ddeb',
        display : 'flex !important' , alignItems : 'center', justifyContent : 'center',
    },
    requestDiv : {
        color : '#495616 !important', fontWeight : 'bold',fontSize : 12,
        height : 35, width : 100,
        background : '#d7db6b',
        display : 'flex !important' , alignItems : 'center', justifyContent : 'center',
    },
    denyDiv : {
        color : '#495616 !important', fontWeight : 'bold',fontSize : 12,
        height : 35, width : 100,
        background : '#EB5757',
        display : 'flex !important' , alignItems : 'center', justifyContent : 'center',
    },
    completeDiv : {
        color : '#495616 !important', fontWeight : 'bold',fontSize : 12,
        height : 35, width : 100,
        background : '#83fb08',
        display : 'flex !important' , alignItems : 'center', justifyContent : 'center',
    },
    payWalletDiv : {
        backgroundImage: 'linear-gradient(to right, #4CB8C4 0%, #3CD3AD  51%, #4CB8C4  100%)',
        textAlign: 'center',
        textTransform: 'capitalize !important',
        transition: '0.5s !important',
        backgroundSize: '200% auto !important',
        color: 'white',          
        borderRadius: '30px !important',
        height : '30px !important',
        width : '130px !important',
        fontSize : '12px !important', fontWeight : 'bold !important',
        color : '#3c0606 !important',
 
        "&:hover" : {
            backgroundPosition: 'right center',
            color: '#fff',
            textDecoration: 'none',
        }
    },
    payStripeDiv : {
        backgroundImage: 'linear-gradient(to right, #FDFC47 0%, #24FE41  51%, #FDFC47  100%)',
        textAlign: 'center',
        textTransform: 'capitalize !important',
        transition: '0.5s !important',
        backgroundSize: '200% auto !important',
        color: 'white',          
        borderRadius: '30px !important',
        height : '30px !important',
        width : '130px !important',
        fontSize : '12px !important', fontWeight : 'bold !important',
        color : '#3c0606 !important',
 
        "&:hover" : {
            backgroundPosition: 'right center',
            color: '#fff',
            textDecoration: 'none',
        }
    },
    linkDiv : {
        "&:hover" : {
            color : theme.palette.green.G200
        }
    }
})) ;

const OrdersList = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;

    const {
        searchStr,
        startDate,
        endDate,

        UserOrdersInfoList,
        ordersInfoList
    } = props ;

    const {
        isWalletConnected,
        web3Provider,
        walletAddress
    } = useWalletInfo() ;

    const {
        isStripeConnected
    } = useStripeInfo() ;

    const headFields = [
        "",
        "Creator",
        "Creator Wallet",
        "Price",
        "Amount",
        "Date",
        "Status",
        "Payable",
        "Product Name",
        "Product Type",
        "Product Link",
    ]

    const [filterList, setFilterList] = React.useState([]) ;
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [bidId, setBidId] = React.useState(null) ;

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleClickAction = async (event, bid_id, buyer_id, buyer_wallet) => {
        setAnchorEl(event.currentTarget);
        setBidId(bid_id) ;
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    
    const handlePayWithStripe = async (
        creator_id, creator_wallet, 
        bidder_id, bidder_full_name, bidder_email,bidder_profile_picture_url, bidder_wallet, 
        product_id, product_name, 
        bid_id, bid_price, bid_unit, bid_amount, nft_id, destination
    ) => {
        if(!isStripeConnected) {
            swal({
                title : 'Please, connect your stripe account',
                text : 'In order to pay with stripe, you should connect your stripe account',
                icon : 'info',
                buttons : false,
                timer : 5000
            }) ;
            return ;
        }
        
        let sellerStripeInfo = await SellerStripeInfo(creator_id) ;

        let sols_fee = Number(bid_price) * 0.01 ;
        let stripe_fee = calcPaymentFee(Number(bid_price)) ;
        let transferred_amount = Number(bid_price) - sols_fee - stripe_fee ;

        let data = {
            "amount" : Number(amount * 100).toFixed(),
            "currency"  : 'usd',
            "automatic_payment_methods[enabled]" : 'true' ,
            "customer" : sellerStripeInfo.stripe_customer_id ,
            "transfer_data[destination]" : sellerStripeInfo.stripe_account_id ,
            "transfer_data[amount]" : Number(transferred_amount * 100).toFixed() ,
            // "application_fee_amount" : sols_fee.toFixed(0) ,
            "metadata[created_at]" : new Date().getTime() ,
            "metadata[creator_stripe_account_id]" : sellerStripeInfo.stripe_account_id ,
            "metadata[creator_id]" :  creator_id ,
            "metadata[product_id]" : product_id
        } ;
        
        let res = await createPaymentIntent(data) ;
        
        if(res) {
            await CreatePayment(
                res.id,
                res.client_secret,

                creator_id,
                creator_wallet,
                sellerStripeInfo.full_name,
                sellerStripeInfo.account_name,
                sellerStripeInfo.profile_picture_url,
                sellerStripeInfo.profile_link,
                sellerStripeInfo.email,
                sellerStripeInfo.stripe_account_id,

                bidder_id,
                bidder_full_name,
                bidder_email,
                bidder_profile_picture_url,
                bidder_wallet,
                'special',

                product_id,
                product_name,
                `rare`,
                bid_price,
                bid_unit,

                bid_amount,
                bid_id,
                nft_id,
                
                res.status,

                destination
            ) ;

            window.open(location.origin + "/payment?payment_intent=" + res.id + "&payment_intent_client_secret=" + res.client_secret, '_self') ;
            
            return ;
        }

        return swal({
            title : 'Failed',
            text : 'Your payment is failed',
            buttons: {
                confirm : {text:'Got it'},
            },
            icon : 'error',
            timer : 3000
        }) ;
    }

    const handlePayWithWallet = async (bid_id, creator_wallet, bidder_id, bidder_wallet, bid_price, bid_amount, bid_unit, nft_id, product_id) => {
        if(!isWalletConnected) {
            swal({
                title : 'Please, connect your wallet',
                text : 'In order to pay with you wallet, you should connect your wallet',
                icon : 'info',
                buttons : false,
                timer : 5000
            }) ;
            return ;
        }

        const id = toast.loading("[Payment Product] Tx is pending...");

        let balanceOf_creator = await NFTBalance(nft_id, creator_wallet) ;

        console.log(balanceOf_creator) ;
        if(balanceOf_creator - 1 < Number(bid_amount)) {
            toast.update(id, { render: 'Creator NFT balance inffucient' , type: "error", autoClose: 5000, isLoading: false });

            IncompleteBid(bid_id) ;

            return ;
        }

        let txPayment = await Payment(web3Provider, creator_wallet, bid_price, bid_unit) ;

        if(txPayment === 200 ) {
            let txSellNFT = await SellNFT(walletAddress, md5(getCookie('_SOLSTICE_AUTHUSER')), nft_id, bid_amount) ;

            if(txSellNFT === 200) {
                await CompleteBid(bid_id) ;

                await UpdateRareOwners(product_id, bidder_id, bidder_wallet) ;
                await SendRareAccessUrl(product_id, bid_id) ;

                toast.update(id, { render: "[Payment Product] Tx is successful", type: "success", autoClose: 5000, isLoading: false });

                UserOrdersInfoList() ;

            } else toast.update(id, { render: '[Payment Product] Tx is failed' , type: "error", autoClose: 5000, isLoading: false });
        } else {
            toast.update(id, { render: '[Payment Product] Tx is failed' , type: "error", autoClose: 5000, isLoading: false });
        }
    }

    const handleGotoProfile = (link) => {
        window.open(link, '_blank') ;
    }

    React.useEffect(() => {
        UserOrdersInfoList() ;
    }, []) ;

    React.useEffect(() => {
        if(ordersInfoList?.length) {
            
            let temp = [...ordersInfoList.filter(orderInfo => 
                orderInfo.creator_full_name.toLowerCase().search(searchStr.toLowerCase()) >= 0 &&
                new Date(orderInfo.created_at).getTime() >= startDate &&
                new Date(orderInfo.created_at).getTime() <= (endDate + 86400000)
            )] ;

            setFilterList(temp) ;
        }
    }, [endDate, startDate, searchStr, ordersInfoList]) ;

    return (
        <>
            <Grid item xs={12} className={classes.root}>
                <TableContainer sx={{paddingRight:"5px"}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {
                                    headFields.map((field, index) => {
                                        return (
                                            <TableCell key={index}>{ field }</TableCell>
                                        )
                                    })
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                ordersInfoList ? (
                                    ordersInfoList.length ? 
                                        filterList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((orderInfo, index) => {
                                            return(
                                                <TableRow key={index} >
                                                    <TableCell>
                                                        <Box sx={{display : 'flex', alignItems : 'center'}}>
                                                            <img src={orderInfo.creator_profile_picture_url} width={50} height={50} />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box >
                                                            {orderInfo.creator_account_name}
                                                        </Box>
                                                        <Box >
                                                            {orderInfo.creator_email}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell >
                                                        <Tooltip title={orderInfo.creator_wallet}>
                                                            <Box sx={{textAlign : 'left'}}>
                                                                {walletAddressFormat(orderInfo.creator_wallet)}
                                                            </Box>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell>{orderInfo.bid_price}</TableCell>
                                                    <TableCell>{orderInfo.bid_amount}</TableCell>
                                                    <TableCell >{new Date(orderInfo.created_at).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        {
                                                            orderInfo.status === 'requested' && <Box sx={{display : 'flex'}}>
                                                                <Box className={classes.requestDiv}>
                                                                    <Box>Requesting...</Box>&nbsp;
                                                                </Box>
                                                            </Box>
                                                        }
                                                        {
                                                            orderInfo.status === 'accepted' && <Box sx={{display : 'flex'}}>
                                                                <Box className={classes.acceptDiv}>
                                                                    <Box>Accepted</Box>&nbsp;
                                                                </Box>
                                                            </Box>
                                                        }
                                                        {
                                                            orderInfo.status === 'denied' && <Box sx={{display : 'flex'}}>
                                                                <Box className={classes.denyDiv}>
                                                                    <Box>Denied</Box>&nbsp;
                                                                </Box>
                                                            </Box>
                                                        }
                                                        {
                                                            orderInfo.status === 'completed' && <Box sx={{display : 'flex'}}>
                                                                <Box className={classes.completeDiv}>
                                                                    <Box>Completed</Box>&nbsp;
                                                                </Box>
                                                            </Box>
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            orderInfo.status === 'accepted' ? <Box sx={{display : 'flex', flexDirection : 'column', gap : '10px'}}>
                                                               {
                                                                    <Button variant={'contained'} disabled={orderInfo.status !== 'accepted'} 
                                                                        onClick={() => handlePayWithWallet(
                                                                            orderInfo.id,
                                                                            orderInfo.creator_wallet,
                                                                            orderInfo.bidder_id,
                                                                            orderInfo.bidder_wallet,
                                                                            orderInfo.bid_price,
                                                                            orderInfo.bid_amount,
                                                                            orderInfo.bid_unit,
                                                                            orderInfo.nft_id,
                                                                            orderInfo.product_id
                                                                        )}
                                                                        className={classes.payWalletDiv}
                                                                    >
                                                                        Pay With Wallet
                                                                    </Button>
                                                               }
                                                               {
                                                                    <Button variant={'contained'} disabled={orderInfo.status !== 'accepted'}
                                                                        onClick={() => handlePayWithStripe(
                                                                            orderInfo.creator_id,
                                                                            orderInfo.creator_wallet,
                                                                            orderInfo.bidder_id,
                                                                            orderInfo.bidder_full_name,
                                                                            orderInfo.bidder_email,
                                                                            orderInfo.bidder_profile_picture_url,
                                                                            orderInfo.bidder_wallet,
                                                                            orderInfo.product_id,
                                                                            orderInfo.product_name,
                                                                            orderInfo.id,
                                                                            orderInfo.bid_price,
                                                                            orderInfo.bid_unit,
                                                                            orderInfo.bid_amount,
                                                                            orderInfo.nft_id,

                                                                            orderInfo.destination
                                                                        )}
                                                                        className={classes.payStripeDiv}
                                                                    >
                                                                        Pay With Stripe
                                                                    </Button>
                                                               }
                                                            </Box> : ( 
                                                                orderInfo.status === 'requested' ?
                                                                <Box>
                                                                    <RemoveDoneIcon htmlColor='#EB5757'/>
                                                                </Box> : <Box>
                                                                    <DoneOutlineIcon htmlColor='#7AC131'/>
                                                                </Box>
                                                            )
                                                        }
                                                    </TableCell>
                                                    <TableCell >{orderInfo.product_name}</TableCell>
                                                    <TableCell >{orderInfo.product_type}</TableCell>
                                                    <TableCell >
                                                        <Tooltip title={orderInfo.creator_profile_link}>
                                                            <Box className={classes.linkDiv} onClick={() => handleGotoProfile(orderInfo.creator_profile_link)}>
                                                                {
                                                                    orderInfo.creator_profile_link.slice(0 , 15)
                                                                }...
                                                            </Box>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    : <TableRow  >
                                        <TableCell colSpan={11} sx={{textAlign : 'center !important'}}>
                                            <Box sx={{color : theme.palette.green.G100}}>
                                                <SearchOffIcon />
                                                <Box>There aren't any orders.</Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : 
                                <TableRow  >
                                    <TableCell colSpan={11} sx={{textAlign : 'center !important'}} >
                                        <Loading type='three_dots' width={50} height={50} fill='#43D9AD' />
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 15]}
                                    labelRowsPerPage={"Orders per page"}
                                    count={
                                        ordersInfoList 
                                        ? filterList.length
                                        : 0
                                    }
                                    SelectProps={{
                                        MenuProps : {
                                            classes : {
                                                paper :  classes.paper
                                            }
                                        }
                                    }}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />    
                            </TableRow>
                        
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Grid>
            <ActionPopOver
                id={id}
                open={open}
                anchorEl={anchorEl}
                bidId={bidId}
                handleClose={handleClose}
            />
        </>
    )
}
OrdersList.propTypes = {
    UserOrdersInfoList : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    ordersInfoList : state.cart.ordersInfoList
})

const mapDispatchToProps = {
    UserOrdersInfoList
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersList) ;