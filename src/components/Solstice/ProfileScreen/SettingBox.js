import React,{useRef, useEffect, useState} from 'react' ;

import { useMeasure } from 'react-use' ;

import { connect } from 'react-redux';
import PropTypes from 'prop-types' ;
import { UserAccountInfo, UserAllProducts, LoadingProductsList } from '../../../redux/actions/profile';

import { getCookie, getUuid } from '../../../utils/Helper';

import CoverImage from '../../../assets/profile/Cover.png' ;
import UserImage from '../../../assets/profile/User.svg' ;
import ProductThumbImage from '../../../assets/profile/product_thumb.svg' ;
import ProductDetailsImage from '../../../assets/profile/product_details.svg' ;
import ReloadImage from '../../../assets/common/Reload.png' ;
import TickProductTypeImage from '../../../assets/profile/TickProductType.svg' ;

import { productTypeList } from '../../../constants/static';

import Loading from 'react-loading-components' ;

import {
    Box,
    Tooltip
} from '@mui/material';

import { useTheme } from '@mui/styles';

import { useStyles } from './StylesDiv/Setting.styles';

const SettingBox = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;

    const {
        listType,
        handleChangeListType,
        currentProductType,
        handleCurrentProductType,

        UserAccountInfo,
        UserAllProducts,
        LoadingProductsList,

        loadingProductsList,

        coverPictureUrl,
        profilePictureUrl,
        accountName,
        platformCount,
        productCount,
        resellerCount,
    } = props ;

    const avatarCtrl = useRef() ;

    const [ setAvatarCtrl, {width, height} ] = useMeasure() ;
    
    const handleReload = async () => {
        await LoadingProductsList(true) ;
        await UserAllProducts() ;
        await LoadingProductsList(false) ;
    }

    useEffect(() => {
        setAvatarCtrl(avatarCtrl.current) ;
    }, []) ;

    useEffect(() => {
        UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;
    }, []) ;

    useEffect(() => {
        if(productTypeList.length) handleCurrentProductType(productTypeList[0]) ;
    }, [productTypeList]) ;

    return (
           <>
                <Box className={classes.avatarCtrlDiv} ref={avatarCtrl} >
                    {
                        coverPictureUrl ? <img src={coverPictureUrl} width={width} height={width / 4.12} alt='no image.' style={{borderRadius : '10px',border : '2px solid ' + theme.palette.green.G400}} />:
                        <Box sx={{width : width + "px", height : (width / 4.12) + "px"}} className={classes.coverPictureDiv}>
                            <img src={CoverImage} width={height / 2} height={height / 2} />
                            <Box sx={{fontSize : width > 350 ?'auto' : '13px'}}>Cover Photo</Box>
                        </Box>
                    }
                    <Box className={classes.avatarDiv} >
                        <Box className={classes.avatar}>
                            {
                                profilePictureUrl ? <img src={profilePictureUrl} width={width * 0.15} height={width * 0.15} alt='no image.' style={{borderRadius : '50%', border : '2px solid ' + theme.palette.green.G400, background : theme.palette.blue.main}} /> 
                                : <img src={UserImage} width={width * 0.15} height={width * 0.15} alt='no image.'  style={{background : theme.palette.blue.main, borderRadius : '50%'}}/> 
                            }
                            <Box className={classes.userNameDiv}>
                                {accountName ? `@ ${accountName}` : 'Username'}
                            </Box>
                        </Box>
                        <Box className={classes.userInfoDiv}>
                            <Box className={classes.userInfoNumber}>
                                {productCount || 0}
                            </Box>
                            <Box className={classes.userInfoLabel}>
                                Products
                            </Box>
                        </Box>
                        <Box className={classes.userInfoDiv}>
                            <Box className={classes.userInfoNumber}>
                                {platformCount || 0}
                            </Box>
                            <Box className={classes.userInfoLabel}>
                                Platforms
                            </Box>
                        </Box>
                        <Box className={classes.userInfoDiv}>
                            <Box className={classes.userInfoNumber}>
                                {resellerCount || 0}
                            </Box>
                            <Box className={classes.userInfoLabel}>
                                Resellers
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box className={classes.productTypeDiv} sx={{marginTop : (width * 0.15 + (width > 372 ? 10 : 70)) + "px"}}>
                    {
                        productTypeList.map((item, index) => {
                            return (
                                <Box className={currentProductType === item ? classes.activeProductType : classes.productType} key={index} onClick={() => handleCurrentProductType(item)}>
                                    { currentProductType === item && <img src={TickProductTypeImage} width={20} />} 
                                    { currentProductType === item ? item.replaceAll("#", '') : item}
                                </Box>
                            )
                        })
                    }
                </Box>
                <Box>
                    <Box className={classes.productListConfigDiv}>
                        <img src={listType === 1 ? ProductDetailsImage : ProductThumbImage} width={27} height={27} className={classes.productListType} onClick={handleChangeListType}/>
                        {
                            !loadingProductsList ? <Tooltip title={'Reload'}>
                                <img src={ReloadImage} width={27} height={27} onClick={handleReload}/>
                            </Tooltip>
                            : <Loading type='oval' width={27} height={27} fill='#2eb6ec' />
                        }
                    </Box>
                    <Box className={classes.dividerDiv} />
                </Box>
           </>
    )
}
SettingBox.propTypes = {
    LoadingProductsList : PropTypes.func.isRequired,
    UserAllProducts : PropTypes.func.isRequired,
    UserAccountInfo : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    coverPictureUrl : state.profile.coverPictureUrl,
    profilePictureUrl : state.profile.profilePictureUrl,
    accountName : state.profile.accountName,

    platformCount : state.profile.platformCount,
    productCount : state.profile.productCount,
    resellerCount : state.profile.resellerCount,
    loadingProductsList : state.profile.loadingProductsList,
})
const mapDispatchToProps = {
    UserAccountInfo,
    LoadingProductsList,
    UserAllProducts
}
export default connect(mapStateToProps, mapDispatchToProps)(SettingBox) ;