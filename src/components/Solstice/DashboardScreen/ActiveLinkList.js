import * as React from 'react' ;

import { useLocation } from 'react-use';

import Loading from 'react-loading-components' ;

import { connect } from 'react-redux' ;
import { ActiveProductsList } from '../../../redux/actions/dashboard';
import PropTypes from 'prop-types' ;

import SearchOffIcon from '@mui/icons-material/SearchOff';

import bcryptJs from 'bcryptjs' ;

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

import { useStyles } from './StylesDiv/ActiveLinksList.styles';
import { useTheme } from '@mui/styles';

const ActiveLinksList = (props) => {
    const classes = useStyles() ;
    const location = useLocation() ;
    const theme = useTheme() ;

    const {
        ActiveProductsList,
        activeProductsList
    } = props ;

    const headFields = [
        "Name",
        "Link ID",
        "# of Receipts"
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
    
    const handleProductPage = async (creator_id, id) => {
        bcryptJs.genSalt(10, (err, salt) => {
            bcryptJs.hash(creator_id, salt, function(err, hash) {
                if(err) console.log(err) ;
                else window.open(location.origin + "/product-link?owner="+ hash + "&id=" + id, '_blank') ;
            });
        });
    }

    React.useEffect(() => {
        ActiveProductsList() ;
    }, []) ;

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
                            activeProductsList ? (
                                activeProductsList.length ? 
                                    activeProductsList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((link, index) => {
                                        return(
                                            <TableRow key={index} >
                                                <TableCell>
                                                    {
                                                        link.product_name
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <Box onClick={async () => {
                                                        await handleProductPage(link.creator_id, link.id) ;
                                                    }}
                                                        className={classes.linkHref}
                                                    >
                                                        {`...${link.id}`}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    { link.receipts_count }
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                : <TableRow  >
                                    <TableCell colSpan={10}  sx={{textAlign : 'center'}}>
                                        <Box >
                                            <SearchOffIcon />
                                            <Box>There aren't any links.</Box>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : 
                            <TableRow  >
                                <TableCell colSpan={10} sx={{textAlign : 'center'}}>
                                    <Loading type='three_dots' width={50} height={50} fill='#000000' />
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
ActiveLinksList.propTypes = {
    ActiveProductsList : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    activeProductsList  : state.dashboard.activeProductsList
})
const mapDispatchToProps = {
    ActiveProductsList
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveLinksList) ;