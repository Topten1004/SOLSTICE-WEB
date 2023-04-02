import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { connect } from 'react-redux' ;
import PropTypes from 'prop-types' ;
import { UserAccountInfo } from '../../../redux/actions/profile' ;

import { getCookie } from '../../../utils/Helper';

import MiniTxsDiv from '../../../components/Solstice/DashboardScreen/MiniTxsDiv';
import TopCreatorDiv from '../../../components/Solstice/DashboardScreen/TopCreatorDiv';
import TransactionsList from '../../../components/Solstice/DashboardScreen/TransactionsList';
import ActiveLinkList from '../../../components/Solstice/DashboardScreen/ActiveLinkList';
import EarningGraph from '../../../components/Solstice/DashboardScreen/EarningGraph';
import StatisticsGraph from '../../../components/Solstice/DashboardScreen/StatisticsGraph';

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

import {
    Box,
    Button,
    Grid,
    useMediaQuery,
    InputAdornment,
    TextField,
    FormControl,
    Select,
    MenuItem,
    FormControlLabel,
    FormGroup
} from '@mui/material' ;

import { AdminUser } from '../../../firebase/user_collection';
import { AdminPayment } from '../../../firebase/payment_collection';

import { useStyles } from './StylesDiv/index.styles';
import { useTheme } from '@mui/styles' ;

const DashboardScreen = (props) => {

    const classes = useStyles() ;
    const theme = useTheme() ;
    const navigate = useNavigate() ;

    const match1430 = useMediaQuery('(min-width : 1430px)') ;

    const [searchStr, setSearchStr] = React.useState('') ;
    const [sort_by, setSortBy] = React.useState('end_date') ;
  
    const {
        UserAccountInfo,

        allPaymentsList,

        stripeAvailableBalance,
    } = props ;

    const [growth, setGrowth] = React.useState(0) ;

    const handleStartSale = async () => {
        navigate('/solstice/profile-screen') ;
    }

    const handleSeeMore = async () => {
        navigate('/solstice/stripe-screen') ;
    }

    React.useEffect(() => {
        UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;
    }, []) ;
    

    React.useEffect(() => {
        if(allPaymentsList) {
            let total = Object.entries(allPaymentsList).filter(([id, item]) => 
                item.status === 'succeeded' &&
                item.created_at < new Date().getTime() - 7 * 60 * 60 * 24 * 100 &&
                item.creator_id === getCookie('_SOLSTICE_AUTHUSER')
            ).length  ;

            let week_ago = Object.entries(allPaymentsList).filter(([id, item]) => 
                item.status === 'succeeded' &&
                item.created_at < new Date().getTime() &&
                item.creator_id === getCookie('_SOLSTICE_AUTHUSER')
            ).length;


            if(total) setGrowth((total - week_ago) / total * 100) ;
        }
    }, [allPaymentsList]) ;

    return (
        <Box className={classes.root}>
            <Box className={classes.greenBlur} />
            <Box className={classes.blueBlur} />
            <Grid container>
                <Grid item xs={match1430 ? 8 : 12}>
                    {/* <Button onClick={async () => await AdminPayment()}>dsfsfsdf</Button> */}
                    <Box className={classes.cardGroupDiv}>
                        <Box className={classes.cardDiv} sx={{background : '#05508d' }}>
                            <Box className={classes.cardLabelDiv}>
                                Total Revenue
                            </Box>
                            <Box className={classes.numberDiv}>
                                $ { Number(stripeAvailableBalance).toFixed(2) }
                            </Box>
                        </Box>
                        
                        <Box className={classes.cardDiv} sx={{background : '#4f9d00'}}>
                            <Box className={classes.cardLabelDiv}>
                                Growth 
                            </Box>
                            <Box className={classes.numberDiv}>
                                {   
                                    Number(growth).toFixed(2)
                                } %
                            </Box>
                        </Box>

                        <Box className={classes.cardDiv} sx={{background : '#605e5e'}}>
                            <Box className={classes.cardLabelDiv}>
                                Transactions 
                            </Box>
                            <Box className={classes.numberDiv}>
                                {   
                                    allPaymentsList &&  Object.entries(allPaymentsList).filter(([id, item]) => 
                                        item.status === 'succeeded' 
                                        && item.creator_id === getCookie('_SOLSTICE_AUTHUSER')
                                        // item?.available_on
                                        // item.fullname.toLowerCase().search(searchStr.toLowerCase()) >= 0
                                    ).length
                                }
                            </Box>
                        </Box>
                    </Box>
                    
                </Grid>
                <Grid item xs={match1430 ? 4 : 12} sx={{p : '20px'}}>
                    <Box className={classes.activeLinkDiv}>
                        <Box sx={{color : 'black', fontSize : '25px', fontWeight: 'bold'}}>
                            Active Links &amp; Contracts
                        </Box>

                        <Box>
                            <ActiveLinkList />
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    {/* <StatisticsGraph /> */}
                    <Box className={classes.listTitleDiv}>
                        <Box className={classes.titleDiv}>
                            Transactions
                        </Box>
                        <Box className={classes.seeMoreDiv} sx={{"&:hover" : {color : 'white'}, cursor : 'pointer'}}
                            onClick={handleSeeMore}
                        >
                            <Box >
                                See More
                            </Box>
                            <DoubleArrowIcon />
                        </Box>

                    </Box>
                    <Box className={classes.formDiv}>
                        <TextField
                            placeholder='Search transaction by product name'
                            size='small'
                            onChange={(e) => setSearchStr(e.target.value)}
                            value={searchStr}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    <ManageSearchIcon/>
                                </InputAdornment>,
                            }}
                        />
                        <FormGroup row >
                            <FormControlLabel
                                control={
                                    <Select
                                        size='small'
                                        value={sort_by}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        MenuProps={{
                                            className : classes.selectDiv
                                        }}
                                    >
                                        <MenuItem value={'end_date'} >End Date</MenuItem>
                                        <MenuItem value={'price'} >Price</MenuItem>
                                        <MenuItem value={'name'} >Name</MenuItem>
                                    </Select> 
                                }
                                label={<>Sort By&nbsp;&nbsp;&nbsp;&nbsp;</>}
                                labelPlacement='start'
                            />
                        </FormGroup>
                    </Box>
                    <TransactionsList 
                        searchStr={searchStr}
                        sortBy={sort_by}
                    />
                    {/* <MiniTxsDiv /> */}
                    {/* <EarningGraph /> */}
                    {/* <TopCreatorDiv /> */}
                </Grid>
            </Grid>
            {/* <Button variant={'contained'} onClick={handleUpdate}> traning  </Button> */}
        </Box>
    );
}

DashboardScreen.propTypes = {
    UserAccountInfo : PropTypes.func.isRequired
}
const mapStateToProps  = state => ({
    allPaymentsList : state.payment.allPaymentsList,
    profilePictureUrl : state.profile.profilePictureUrl,
    productCount : state.profile.productCount,
    platformCount : state.profile.platformCount,
    totalSoldCount : state.profile.totalSoldCount,
    stripeIncomingBalance : state.profile.stripe_balance_incoming,
    stripeAvailableBalance : state.profile.stripe_balance_available 
})
const mapDispatchToProps = {
    UserAccountInfo
}
export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen) ;