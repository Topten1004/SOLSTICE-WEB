import * as React from 'react' ;

import Loading from 'react-loading-components' ;

import { connect } from 'react-redux' ;
import PropTypes from 'prop-types' ;
import { UserBidsInfoList } from '../../../../redux/actions/cart' ;
import { walletAddressFormat } from '../../../../utils/Helper';
import ActionPopOver from './ActionPopOver';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';

import SearchOffIcon from '@mui/icons-material/SearchOff';

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
    Tooltip
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
            minWidth : 1130,
            borderCollapse: 'separate !important',
            borderSpacing: '0 10px',
            "& .MuiTableCell-root" : {
                color : 'white', 
                padding : '10px !important',
                fontSize : '13px !important',
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
    linkDiv : {
        "&:hover" : {
            color : theme.palette.green.G200
        }
    }
})) ;

const BidsList = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;

    const {
        searchStr,
        startDate,
        endDate,

        web3Provider,
        UserBidsInfoList,
        bidsInfoList
    } = props ;

    const headFields = [
        "",
        "Bidder",
        "Bidder Wallet",
        "Product Name",
        "Price",
        "Amount",
        "Status",
        "Action",
        "Product Type",
        "Profile Link",
        "Date"
    ]

    const [filterList, setFilterList] = React.useState([]) ;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleGotoProfile = (link) => {
        window.open(link, '_blank') ;
    }

    React.useEffect(() => {
        UserBidsInfoList() ;
    }, []) ;

    React.useEffect(() => {
        if(bidsInfoList?.length) {
            
            let temp = [...bidsInfoList.filter(bidInfo => 
                bidInfo.bidder_full_name.toLowerCase().search(searchStr.toLowerCase()) >= 0 &&
                new Date(bidInfo.created_at).getTime() >= startDate &&
                new Date(bidInfo.created_at).getTime() <= (endDate + 86400000)
            )] ;

            setFilterList(temp) ;
        }
    }, [endDate, startDate, searchStr, bidsInfoList]) ;

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
                                bidsInfoList ? (
                                    bidsInfoList.length ? 
                                        filterList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((bidInfo, index) => {
                                            return(
                                                <TableRow key={index} >
                                                    <TableCell>
                                                        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                                            <img src={bidInfo.bidder_profile_picture_url} width={50} height={50} style={{borderRadius : '50%'}} />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box >
                                                            {bidInfo.bidder_account_name}
                                                        </Box>
                                                        <Box >
                                                            {bidInfo.bidder_email}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell >
                                                        <Tooltip title={bidInfo.bidder_wallet}>
                                                            <Box sx={{textAlign : 'left'}}>
                                                                {walletAddressFormat(bidInfo.bidder_wallet)}
                                                            </Box>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell >{bidInfo.product_name}</TableCell>
                                                    <TableCell>{bidInfo.bid_price}</TableCell>
                                                    <TableCell>{bidInfo.bid_amount}</TableCell>
                                                    <TableCell>
                                                        {
                                                            bidInfo.status === 'requested' && <Box sx={{display : 'flex'}}>
                                                                <Box className={classes.requestDiv}>
                                                                    <Box>Requested</Box>&nbsp;
                                                                </Box>
                                                            </Box>
                                                        }
                                                        {
                                                            bidInfo.status === 'accepted' && <Box sx={{display : 'flex'}}>
                                                                <Box className={classes.acceptDiv}>
                                                                    <Box>Accepted</Box>&nbsp;
                                                                </Box>
                                                            </Box>
                                                        }
                                                        {
                                                            bidInfo.status === 'denied' && <Box sx={{display : 'flex'}}>
                                                                <Box className={classes.denyDiv}>
                                                                    <Box>Denied</Box>&nbsp;
                                                                </Box>
                                                            </Box>
                                                        }
                                                        {
                                                            bidInfo.status === 'completed' && <Box sx={{display : 'flex'}}>
                                                                <Box className={classes.completeDiv}>
                                                                    <Box>Completed</Box>&nbsp;
                                                                </Box>
                                                            </Box>
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            bidInfo.status === "requested" ? <Box onClick={(e) => handleClickAction(e, bidInfo.id)} aria-describedby={id} sx={{display : 'flex', gap: '10px', justifyContent : 'center'}}>
                                                                <MoreVertIcon />
                                                                <ExpandMoreIcon />
                                                            </Box> : (
                                                               ( bidInfo.status === 'accepted' || bidInfo.status === 'completed')
                                                                ? <DoneOutlineIcon htmlColor='#7AC131'/>
                                                                : <RemoveDoneIcon htmlColor='#EB5757'/>
                                                            )
                                                        }
                                                    </TableCell>
                                                    
                                                    <TableCell >{bidInfo.product_type}</TableCell>
                                                    <TableCell >
                                                        <Tooltip title={bidInfo.bidder_profile_link}>
                                                            <Box className={classes.linkDiv} onClick={() => handleGotoProfile(bidInfo.bidder_profile_link)}>
                                                                {
                                                                    bidInfo.bidder_profile_link.slice(0 , 15)
                                                                }...
                                                            </Box>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell >{new Date(bidInfo.created_at).toLocaleDateString()}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    : <TableRow  >
                                        <TableCell colSpan={11} sx={{textAlign : 'center !important'}}>
                                            <Box sx={{color : theme.palette.green.G100}}>
                                                <SearchOffIcon />
                                                <Box>There aren't any bids.</Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : 
                                <TableRow  >
                                    <TableCell colSpan={11} sx={{textAlign : 'center !important'}}>
                                        <Loading type='three_dots' width={50} height={50} fill='#43D9AD' />
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 15]}
                                    labelRowsPerPage={"Bids per page"}
                                    count={
                                        bidsInfoList 
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
BidsList.propTypes = {
    UserBidsInfoList : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    web3Provider : state.wallet.web3Provider,
    bidsInfoList : state.cart.bidsInfoList
})

const mapDispatchToProps = {
    UserBidsInfoList
}

export default connect(mapStateToProps, mapDispatchToProps)(BidsList) ;