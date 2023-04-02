import * as React from 'react' ;

import Loading from 'react-loading-components' ;

import { connect } from 'react-redux' ;
import { UserAccountInfo } from '../../../redux/actions/profile';
import PropTypes from 'prop-types' ;

import { getCookie, getUuid } from '../../../utils/Helper';

import ReloadImage from '../../../assets/common/Reload.png' ;
import SearchOffIcon from '@mui/icons-material/SearchOff';

import AddCustomerModal from './AddCustomerModal';

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
    ButtonGroup,
    Button
} from '@mui/material' ;

import { useStyles } from './StylesDiv/CustomersList.styles';
import { useTheme } from '@mui/styles';
import EditCustomerModal from './EditCustomerModal';
import { UpdateUserCustomer } from '../../../firebase/user_collection';

const CustomersList = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;

    const {
        searchStr,
        customersList,

        UserAccountInfo
    } = props ;

    const headFields = [
        "Full Name",
        "Email",
        "Phone Number",
        "Social Media Platform",
        "Social Media User Name",
        "Location",
        "Action"
    ]

    const [filterList, setFilterList] = React.useState(null) ;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [openAddCustomerModal, setOpenAddCustomerModal] = React.useState(false) ;
    const [openEditCustomerModal, setOpenEditCustomerModal] = React.useState(false) ;
    const [selectedCustomer, setSelectedCustomer] = React.useState(false) ;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleOpenAddCustomerModal = () => {
        setOpenAddCustomerModal(true) ;
    }

    const handleCloseAddCustomerModal = () => {
        setOpenAddCustomerModal(false) ;
    } 

    const handleOpenEditCustomerModal = () => {
        setOpenEditCustomerModal(true) ;
    }

    const handleCloseEditCustomerModal = () => {
        setOpenEditCustomerModal(false) ;
    }

    const handleReload = async () => {
        setFilterList(null) ;
        await UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;
    } ;

    const handleDeleteCustomer = async (email) => {
        if(await swal({
            title : 'Delete User',
            text : 'Are you sure you want to delete this customer?',
            icon : 'info',
            buttons : {
                confirm : {text : 'Got it'}
            }
        })) {
            setFilterList(null) ;

            await UpdateUserCustomer(getCookie('_SOLSTICE_AUTHUSER'), [
                ...customersList.filter(customer => customer.email !== email)
            ]) ;

            await UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;
        }
    }

    const handleEditCustomer = async (customerInfo) => {
        setSelectedCustomer(customerInfo) ;
        handleOpenEditCustomerModal() ;
    }

    React.useEffect(() => {
        UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;
    }, []) ;

    React.useEffect(() => {
        if(customersList) {
            let temp = customersList.filter((item) => 
                item.email.toLowerCase().search(searchStr.toLowerCase()) >= 0 ||
                item.fullname.toLowerCase().search(searchStr.toLowerCase()) >= 0
            ) ;

            setFilterList(temp) ;
        } 
    }, [customersList, searchStr]) ;

    return (
       <>
            <Grid container>
                <Grid item xs={12} sx={{paddingRight : '50px', paddingLeft : '50px', display : 'flex', justifyContent : 'flex-end', alignItems : 'center', gap : '10px'}}>
                    <Button className={classes.addDiv} onClick={handleOpenAddCustomerModal}>
                        + Add Customer
                    </Button>
                    <Button className={classes.loadButtonCss} onClick={handleReload} 
                        variant='contained'
                        startIcon={ !filterList && <Loading type='oval' width={20} height={20} fill='#2eb6ec' />}
                    >
                        { !filterList ? 'Reloading' : 'Refresh' }
                    </Button>
                </Grid>
            </Grid>
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
                                filterList ? 
                                    filterList.length ? 
                                        filterList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customerInfo, index) => {
                                            return(
                                                <TableRow key={index} >
                                                    <TableCell sx={{minWidth : '150px'}}>{customerInfo.full_name}</TableCell>
                                                    <TableCell>{customerInfo.email || ''}</TableCell>
                                                    <TableCell>{customerInfo.phone_number || ''}</TableCell>
                                                    <TableCell>{customerInfo.social_platform || ""}</TableCell>
                                                    <TableCell>{customerInfo.social_user_name || ""}</TableCell>
                                                    <TableCell>{customerInfo.location || ""}</TableCell>
                                                    <TableCell>
                                                        <ButtonGroup>
                                                            <Button className={classes.deleteButtonCss}
                                                                variant='contained'
                                                                size='small'
                                                                onClick={() => handleDeleteCustomer(customerInfo.email)}
                                                            >
                                                                Delete
                                                            </Button>
                                                            <Button className={classes.editButtonCss}
                                                                size='small'
                                                                variant='contained'
                                                                onClick={() => handleEditCustomer(customerInfo)}
                                                            >
                                                                Edit
                                                            </Button>
                                                        </ButtonGroup>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    : <TableRow  >
                                        <TableCell colSpan={7}  sx={{textAlign : 'center'}}>
                                            <Box sx={{color : theme.palette.green.G100}}>
                                                <SearchOffIcon />
                                                <Box>There aren't any customers.</Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                : <TableRow  >
                                    <TableCell colSpan={7} sx={{textAlign : 'center'}}>
                                        <Loading type='three_dots' width={50} height={50} fill='#43D9AD' />
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 15]}
                                    labelRowsPerPage={"Customers per page"}
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

            <AddCustomerModal
                open={openAddCustomerModal}
                handleClose={handleCloseAddCustomerModal}
            />
            <EditCustomerModal
                open={openEditCustomerModal}
                handleClose={handleCloseEditCustomerModal}
                selectedCustomer={selectedCustomer}
                customers={customersList}
            />
       </>
    )
}
CustomersList.propTypes = {
    UserAccountInfo : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    customersList : state.profile.customers
})
const mapDispatchToProps = {
    UserAccountInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomersList) ;