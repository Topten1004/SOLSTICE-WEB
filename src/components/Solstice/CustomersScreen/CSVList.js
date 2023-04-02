import * as React from 'react' ;

import Loading from 'react-loading-components' ;

import { connect } from 'react-redux' ;

import { getCookie, getUuid } from '../../../utils/Helper';

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

import { useStyles } from './StylesDiv/CSVList.styles';
import { useTheme } from '@mui/styles';

const CSVList = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;

    const {
        csvList
    } = props ;

    const headFields = [
        "Full Name",
        "Email",
        "Phone Number",
        "Social media platform",
        "Location"
    ]

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

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
                                csvList ? (
                                    csvList.length ? 
                                        csvList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customerInfo, index) => {
                                            return(
                                                <TableRow key={index} >
                                                    <TableCell>{customerInfo.full_name}</TableCell>
                                                    <TableCell>{customerInfo.email}</TableCell>
                                                    <TableCell>{customerInfo.phone_number}</TableCell>
                                                    <TableCell>{customerInfo.social_platform}</TableCell>
                                                    <TableCell>{customerInfo.location}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    : <TableRow  >
                                        <TableCell colSpan={5}  sx={{textAlign : 'center'}}>
                                            <Box sx={{color : theme.palette.green.G100}}>
                                                <SearchOffIcon />
                                                <Box>There aren't any customers.</Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : 
                                <TableRow  >
                                    <TableCell colSpan={5} sx={{textAlign : 'center'}}>
                                        <Loading type='three_dots' width={50} height={50} fill='#43D9AD' />
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5]}
                                    labelRowsPerPage={"Customers per page"}
                                    count={
                                        csvList 
                                        ? csvList.length
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
CSVList.propTypes = {
}
const mapStateToProps = state => ({
})
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(CSVList) ;