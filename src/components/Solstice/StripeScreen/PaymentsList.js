import * as React from 'react' ;

import Loading from 'react-loading-components' ;

import { connect } from 'react-redux' ;
import PropTypes from 'prop-types' ;
import { UserAccountInfo } from '../../../redux/actions/profile';

import { AutoCheckPayments } from '../../../firebase/payment_collection';

import { getCookie, getUnit } from '../../../utils/Helper';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import {
    Box,
    TableContainer, 
    Table, 
    TableBody, 
    TableHead, 
    TableRow, 
    TableCell,
    TableFooter,
    TablePagination,
    Tooltip,
} from '@mui/material' ;

import { useStyles } from './StylesDiv/PaymentsList.styles';
import { useTheme } from '@mui/styles';

let timer ;

const PaymentsList = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;

    const {
        searchStr,
        allPaymentsList,

        UserAccountInfo
    } = props ;

    const headFields = [
        "Puchaser",
        "Email",
        "Product Name",
        "Type",
        "Price",
        "Permission",
        "Status",
        "Total after fees",
        "SOLS fee",
        "Stripe fee",
        "Available On"
    ]

    const [filterList, setFilterList] = React.useState(null) ;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    
    const resetTimer = async (paymentsList) => {
        clearInterval(timer) ;
        timer = setInterval(async () => {
            let res = await AutoCheckPayments(paymentsList) ;
            if(res === 'incoming_success') {
                await UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;
            }
        }, 5000) ;
    }

    React.useEffect(() => {
        return () => {
            clearInterval(timer) ;
        }
    }, []) ;

    React.useEffect(() => {
        if(allPaymentsList) {
            let temp = Object.entries(allPaymentsList).filter(([id, item]) => 
                (
                    item.buyer_email.toLowerCase().search(searchStr.toLowerCase() || '') >= 0 ||
                    item.buyer_full_name.toLowerCase().search(searchStr.toLowerCase()) >= 0
                )
                && item.creator_id === getCookie('_SOLSTICE_AUTHUSER')
                // true
                // item.fullname.toLowerCase().search(searchStr.toLowerCase()) >= 0
            ) ;

            resetTimer(temp) ;

            setFilterList(temp) ;

            // resetTimer(allPaymentsList);

            // setFilterList(Object.entries(allPaymentsList)) ;
        } 
    }, [searchStr, allPaymentsList]) ;

    return (
       <>
            <Box className={classes.root}>
                <TableContainer sx={{paddingRight:"5px",}}>
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
                                filterList ? (
                                    filterList.length ? 
                                        filterList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(([id, payment_intent]) => {
                                            return(
                                                <TableRow key={id} >
                                                    <TableCell>
                                                       <Box sx={{display : 'flex', flexDirection : 'column', justifyContent : 'center'}}>
                                                            <Box>
                                                                {payment_intent.buyer_full_name}
                                                            </Box>
                                                       </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            {payment_intent.buyer_email}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{payment_intent.product_name}</TableCell>
                                                    <TableCell sx={{textTransform : 'capitalize'}}>{payment_intent.price_type}</TableCell>
                                                    <TableCell>
                                                        {payment_intent.product_price}&nbsp;{ getUnit(payment_intent.price_unit) }
                                                    </TableCell>
                                                    <TableCell sx={{textTransform : 'capitalize'}}>{payment_intent.buyer_permission}</TableCell>
                                                    <TableCell>{payment_intent.status}</TableCell>
                                                    <TableCell>
                                                        { payment_intent?.total_after_fees ? payment_intent?.total_after_fees + " USD" : ' ??? '}
                                                    </TableCell>
                                                    <TableCell>
                                                        { payment_intent?.sols_fee ? Number(payment_intent?.sols_fee) + " USD" : '???'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {payment_intent?.fee ? payment_intent?.fee + " USD" : ' ??? '}
                                                    </TableCell>
                                                    <TableCell>
                                                        { 
                                                            payment_intent?.available_on 
                                                            ? (
                                                                payment_intent?.available_on === 'available' ? 'Available'
                                                                : new Date(payment_intent.available_on).toLocaleDateString()
                                                            ) 
                                                            : '???'
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    : <TableRow  >
                                        <TableCell colSpan={11}  sx={{textAlign : 'center'}}>
                                            <Box sx={{color : theme.palette.green.G100}}>
                                                <SearchOffIcon />
                                                <Box>There aren't any transactions.</Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : 
                                <TableRow  >
                                    <TableCell colSpan={11} sx={{textAlign : 'center'}}>
                                        <Loading type='three_dots' width={50} height={50} fill='#43D9AD' />
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 15]}
                                    labelRowsPerPage={"Payments per page"}
                                    count={
                                        filterList 
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
            </Box>
       </>
    )
}
PaymentsList.propTypes = {
    UserAccountInfo : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    allPaymentsList : state.payment.allPaymentsList
})
const mapDispatchToProps = {
    UserAccountInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsList) ;