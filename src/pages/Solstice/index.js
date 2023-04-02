import React,{ useEffect, useRef, useState } from 'react' ;
import { Route, Routes } from 'react-router-dom';

import { useMeasure } from 'react-use';

import { connect } from 'react-redux' ;
import { UserAccountInfo } from '../../redux/actions/profile';

import { getCookie, getUuid } from '../../utils/Helper';

import ProfileScreen from './ProfileScreen';
import UploadScreen from './UploadScreen';
import CloudScreen from './CloudScreen';
import CartScreen from './CartScreen';
import SettingScreen from './SettingScreen';
import DashboardScreen from './DashboardScreen' ;
import TrackScreen from './TrackScreen';
import AccelerateScreen from './AccelerateScreen';
import LinkScreen from './LinkScreen';
import CustomersScreen from './CustomersScreen';
import StripeScreen from './StripeScreen';
import ToolScreen from './ToolScreen';
import NotFound from '../../components/Common/NotFound';
import SideMenu from '../../components/Layouts/SideMenu';

import {
    Box
} from '@mui/material' ;

import { makeStyles } from '@mui/styles' ;
import ProductTotalInfo from '../../components/ProductLink/ProductTotalInfo';

const useStyles = makeStyles((theme) => ({
   solsticeDiv : {
       display : 'flex !important',
       height : '100vh',
   }
})) ;

const Solstice = (props) => {

    const classes = useStyles();

    const {
        UserAccountInfo,

        web3Provider
    } = props ;

    const [open, setOpen] = useState(false);
    const sideMenuCtrl = useRef() ;

    const [ setSideMenuCtrl, {width, height} ] = useMeasure() ;

    useEffect(async () => {
        if(!web3Provider) {
            // handleOpenConnectModal();
            UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;
        }
    }, [web3Provider]) ;

    useEffect(() => {
        setSideMenuCtrl(sideMenuCtrl.current) ;
    }, []) ;

    return (
        <Box className={classes.solsticeDiv}>
            <Box ref={sideMenuCtrl}>
                <SideMenu 
                    open={open}
                    setOpen={setOpen}
                />
            </Box>
            <Box sx={{flexGrow : 1, width : `calc(100vw - ${width + 5}px)`, position : 'relative'}}>
                <Routes>
                    <Route path="/profile-screen" element={<ProfileScreen />} />
                    <Route path="/upload-screen/*" element={<UploadScreen />} />
                    <Route path="/cloud-screen/" element={<CloudScreen />} />
                    <Route path="/cart-screen/" element={<CartScreen />} />
                    <Route path="/setting-screen" element={<SettingScreen />} />
                    <Route path="/dashboard-screen" element={<DashboardScreen />} />
                    <Route path="/track-screen" element={<TrackScreen />} />
                    <Route path="/accelerate-screen" element={<AccelerateScreen />} />
                    <Route path="/link-screen" element={<LinkScreen />} />
                    <Route path="/customers-screen" element={<CustomersScreen />} />
                    <Route path="/tools-screen" element={<ToolScreen />} />
                    <Route path="/stripe-screen" element={<StripeScreen />} />
                    <Route path="/*" element={<NotFound />}/>
                </Routes> 
            </Box>
        </Box>
    )
}

const mapStateToProps = state => ({
    web3Provider : state.wallet.web3Provider
})  
const mapDispatchToProps = {
    UserAccountInfo
}
export default connect(mapStateToProps, mapDispatchToProps)(Solstice) ;