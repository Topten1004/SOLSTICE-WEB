import * as React from 'react';

import {useNavigate} from 'react-router-dom' ;

import { connect } from 'react-redux';
import PropTypes from 'prop-types' ;

import Loading from 'react-loading-components' ;

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import {
    Box, Tooltip
} from '@mui/material' ;

import { useStyles } from './StylesDiv/MiniTx.styles';
import { useTheme } from '@mui/styles';

const TopCreatorDiv = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;
    const navigate = useNavigate() ;

    const [filterList, setFilterList] = React.useState(null) ;

    const {
        allPaymentsList 
    } = props ;

    const handleViewAll = () => {
        navigate('/solstice/stripe-screen') ;
    }

    React.useEffect(() => {
        if(allPaymentsList) {
            let temp = Object.entries(allPaymentsList).slice(0 , 4) ;

            console.log(temp) ;

            setFilterList(temp) ;
        }
    }, [allPaymentsList]) ;

    return (
        <Box className={classes.root}>
            <Box className={classes.labelDiv}>
                <Box className={classes.titleDiv}>
                    Transactions
                </Box>
                <Box className={classes.viewAllDiv}>
                    <Box onClick={handleViewAll}>
                        View all
                    </Box>
                    <DoubleArrowIcon />
                </Box>
            </Box>
            <Box className={classes.listDiv}>
                {
                    filterList ? 
                        filterList.length ? 
                            filterList.map(([id, tx]) => {
                                return (
                                    <Box className={classes.txItemDiv} key={id}>
                                        <Box>
                                            <Tooltip title={tx.product_name}>
                                                <Box sx={{fontSize : '15px', cursor : 'pointer'}}>
                                                    { tx.product_name.slice(0, 15) }...
                                                </Box>
                                            </Tooltip>
                                            <Box sx={{fontSize : '13px'}}>
                                                { new Date(tx.created_at).toUTCString() }
                                            </Box>
                                        </Box>
                                        <Box className={classes.priceDiv}>
                                            { tx.product_price } USD
                                        </Box>
                                    </Box>
                                )
                        })
                        :<Box className={classes.emptyDiv}>
                            <SearchOffIcon />
                            <Box>There aren't any transactions.</Box>
                        </Box>
                    :  <Box className={classes.emptyDiv}>
                        <Loading type='oval' width={40} height={40} fill={'white'}/>
                    </Box>
                }
            </Box>
        </Box>
    )
}

TopCreatorDiv.propTypes = {

}
const mapStateToProps = state => ({
    allPaymentsList : state.payment.allPaymentsList
})
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(TopCreatorDiv) ;