import * as React from 'react' ;

import { useLocation } from 'react-use';

import Loading from 'react-loading-components' ;

import { connect } from 'react-redux' ;
import PropTypes from 'prop-types' ;

import SearchOffIcon from '@mui/icons-material/SearchOff';
import UserImage from '../../../assets/profile/User.svg' ;

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
    Tooltip
} from '@mui/material' ;

import { useStyles } from './StylesDiv/TransactionsList.styles';
import { useTheme } from '@mui/styles';

const TransactionsList = (props) => {
    const classes = useStyles() ;
    const location = useLocation() ;
    const theme = useTheme() ;

    const {
        allPaymentsList,
        searchStr,
        sortBy
    } = props ;

    const headFields = [
        "Product",
        "Name",
        "Type",
        "Destination",
        "Status",
        "End date",
        "Value(USD)"
    ]

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [filterList, setFilterList] = React.useState(null) ;
 
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    React.useEffect(() => {
        if(allPaymentsList) {

            let temp = Object.entries(allPaymentsList).filter(([id, item]) => 
                (
                    item.product_name.toLowerCase().search(searchStr.toLowerCase() || '') >= 0 ||
                    item.buyer_email.toLowerCase().search(searchStr.toLowerCase()|| '') >= 0
                ) &&
                // && item.creator_id === getCookie('_SOLSTICE_AUTHUSER')
                item?.available_on
            ) ;

            if(sortBy === 'price') temp.sort((a, b) => b[1].amount - a[1].amount);
            if(sortBy === 'end_date') temp.sort((a,b) => b[1].created_at - a[1].created_at) ;
            if(sortBy === 'name') temp.sort((a,b) => b[1].product_name.toLowerCase() - a[1].product_name.toLowerCase()) ;
            
            setFilterList(temp) ;
        }
    }, [allPaymentsList, searchStr, sortBy]) ;

    return (
        <Box className={classes.root}>
            <TableContainer >
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
                                    filterList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(([id, paymentInfo]) => {
                                        return(
                                            <TableRow key={id} >
                                                <TableCell>
                                                    {paymentInfo.product_name}
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{display : 'flex', alignItems : 'center', gap : '15px'}}>
                                                        <Box>
                                                            <img src={paymentInfo.buyer_profile_picture_url || UserImage} 
                                                                width={40}
                                                                height={40}
                                                                style={{borderRadius : '20px', background : 'white'}}
                                                            />
                                                        </Box>
                                                        <Box>
                                                            <Box>
                                                                { paymentInfo.buyer_full_name }
                                                            </Box>
                                                            <Box>
                                                                {  paymentInfo.buyer_email }
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{textTransform : 'capitalize'}}>
                                                    { paymentInfo.payment_method }
                                                </TableCell>
                                                <TableCell sx={{textTransform : 'capitalize'}}>
                                                    <Box>
                                                        {paymentInfo?.destination?.end_date && new Date(Number(paymentInfo?.destination?.end_date)).toDateString() }
                                                    </Box>
                                                    <Box>
                                                        {paymentInfo?.destination?.platform}
                                                    </Box>
                                                </TableCell>
                                                <TableCell  sx={{textTransform : 'capitalize'}}>
                                                    {
                                                        paymentInfo.available_on === 'available' ? <Box
                                                            sx={{display : 'flex', alignItems: 'center', gap : '10px'}}
                                                        >
                                                            <Box className={classes.successCircle} />
                                                            <Box className={classes.successDiv} >
                                                                Success
                                                            </Box>
                                                        </Box> : <Box
                                                            sx={{display : 'flex', alignItems: 'center', gap : '10px'}}
                                                        >
                                                            <Box className={classes.pendingCircle} />
                                                            <Box className={classes.pendingDiv} >
                                                                Pending
                                                            </Box>
                                                        </Box>
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    { new Date(paymentInfo.created_at).toDateString() }
                                                </TableCell>
                                                <TableCell>
                                                    $ { paymentInfo?.net ? paymentInfo?.net : ' ??? '}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                : <TableRow  >
                                    <TableCell colSpan={10}  sx={{textAlign : 'center'}}>
                                        <Box sx={{color : theme.palette.green.G100}}>
                                            <SearchOffIcon />
                                            <Box>There aren't any transactions.</Box>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : 
                            <TableRow  >
                                <TableCell colSpan={10} sx={{textAlign : 'center'}}>
                                    <Loading type='three_dots' width={50} height={50} fill='#43D9AD' />
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                    {/* <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 15]}
                                labelRowsPerPage={"Products per page"}
                                count={
                                    TransactionsList 
                                    ? TransactionsList.length
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
                    
                    </TableFooter> */}
                </Table>
            </TableContainer>
        </Box>
    )
}
TransactionsList.propTypes = {
}
const mapStateToProps = state => ({
    allPaymentsList : state.payment.allPaymentsList
})
const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsList) ;