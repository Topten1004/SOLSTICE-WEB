import React, {useEffect, useState} from 'react' ;

import { useLocation, useNavigate } from 'react-router-dom';
import { useWalletInfo } from '../../../contexts/WalletContext';

import { connect } from 'react-redux';

import MobileSideMenu from './MobileSideMenu';
import NotificationsList from '../../../pages/Solstice/NotificationsList';

import { eraseCookie, getCookie, getPlatform, getUuid, walletAddressFormat } from '../../../utils/Helper';

import {
    Box,
    List,
    ListItemText,
    ListItemIcon,
    ListItemButton,
    ListItem,
    Divider,
    Tooltip,
    useMediaQuery
} from '@mui/material' ;

import MuiDrawer from '@mui/material/Drawer' ;

import User3Image from '../../../assets/menu/3-User.svg' ;
import CartImage from '../../../assets/menu/Cart.svg' ;
import CloudImage from '../../../assets/menu/Cloud.svg' ;
import BagImage from '../../../assets/menu/Bag.svg' ;
import UploadImage from '../../../assets/menu/Upload.svg' ;
import CategoryImage from '../../../assets/menu/Category.svg' ;
import ChatImage from '../../../assets/menu/Chat.svg' ;
import DocumentImage from '../../../assets/menu/Document.svg' ;
import EditSquareImage from '../../../assets/menu/Edit-Square.svg' ;
import FilterImage from '../../../assets/menu/Filter.svg' ;
import HomeImage from '../../../assets/menu/Home.svg' ;
import PaymentImage from '../../../assets/menu/Payment.svg' ;
import ImageImage from '../../../assets/menu/Image.svg' ;
import SettingImage from '../../../assets/menu/Setting.svg' ;
import UnionImage from '../../../assets/menu/Logo.png' ;
import LogOutImage from '../../../assets/menu/Logout.svg' ;
import ProductImage from '../../../assets/menu/Product.svg' ;
import WalletImage from '../../../assets/menu/Wallet.png' ;
import NotificationImage from '../../../assets/common/Notification.png' ;
import GoogleLogOutButton from '../../Auth/GoogleLogOutButton';

import { makeStyles, useTheme } from '@mui/styles';

import { styled } from '@mui/material/styles' ;

import { useStyles } from './index.styles';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const SideMenu = (props) => {
    const {
      open,
      setOpen,
     
      notifysList
    } = props ;

    const {
      walletAddress,
      web3Provider,
      isWalletConnected
    } = useWalletInfo() ;

    const theme = useTheme() ;
    
    const menuList = [
        {
          label : "Dashboard",
          icon : HomeImage,
          link : "/solstice/dashboard-screen"
        },
        {
          label : <>My Products</>,
          icon : ProductImage,
          link : "/solstice/profile-screen"
        },
        {
          label : "Create",
          icon : UploadImage,
          link : "/solstice/upload-screen"
        },
        {
          label : "SOLSCloud",
          icon : CloudImage,
          link : "/solstice/cloud-screen/"
        },
        {
          label : "Cart",
          icon : CartImage,
          link : "/solstice/cart-screen/"
        },
        {
          label : "Customers",
          icon : User3Image,
          link : "/solstice/customers-screen"
        },
        {
          label : <>Transactions</>,
          icon : PaymentImage,
          link : '/solstice/stripe-screen'
        },
        {
          label : "Setting",
          icon : SettingImage,
          link : "/solstice/setting-screen"
        },
        // {
        //   label : "Track",
        //   icon : DocumentImage,
        //   link : "/solstice/track-screen"
        // },
        // {
        //   label : "Accelerate",
        //   icon : ChatImage,
        //   link : "/solstice/accelerate-screen"
        // },
        // {
        //   label : "Link Activation",
        //   icon : CategoryImage,
        //   link : "/solstice/link-screen"
        // },
        // {
        //   label : "Tools",
        //   icon : FilterImage,
        //   link : "/solstice/tools-screen"
        // }
    ]

    const classes = useStyles() ;
    const navigate = useNavigate() ;
    const location = useLocation() ;

    const match520 = useMediaQuery('(min-width : 545px)') ;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false) ;
    const [selectedTab, setSelectedTab] = useState(1) ;
    const [openNotify, setOpenNotify] = useState(false) ;
    const [filterList, setFilterList] = useState([]) ;

    
    const handleOpenMobileMenu = () => {
        setMobileMenuOpen(true);
    }
    
    const handleCloseMobileMenu = () => {
        setMobileMenuOpen(false);
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleGotoTab = (link, index) => {
        setSelectedTab(index) ;
        navigate(link) ;
    }

    const handleLogOut = () => {
      eraseCookie('_SOLSTICE_AUTHUSER') ;
      navigate('/auth') ;
    }

    const handleNotify = () => {
      setOpenNotify(!openNotify) ;
    }

    useEffect(() => {
    }, [web3Provider]) ;

    useEffect(async () => {
      menuList.map((menu, index) => {
        if(location.pathname.search(menu.link) >= 0) {
          setSelectedTab(index) ;
        }
      })
    }, [location]) ;

    useEffect(() => {
        if(notifysList) {
            let temp = Object.entries(notifysList).filter(([id, item]) => 
                item.seller === getCookie('_SOLSTICE_AUTHUSER') 
            ) ;

            setFilterList(temp) ;
        }
    }, [notifysList]) ;
    
    return (
        <>
        {
            match520 ? <Drawer variant="permanent" open={open} classes={{paper : classes.paper}}>
                <Box>
                  <List>
                      <ListItem
                          sx={{
                              minHeight: 48,
                              justifyContent: open ? 'initial' : 'center',
                              px: 2.5,
                          }}
                      >
                          <ListItemIcon
                              sx={{
                                  minWidth: 0,
                                  justifyContent: 'center',
                              }}
                          >
                              {open ? <Box className={classes.expandUnionDiv}>
                                          <Box className={classes.expandUnion}  onClick={handleDrawerClose}>
                                              <img src={UnionImage} width={60} height={60} style={{borderRadius : '50%'}}/> 
                                          </Box>
                                          <Box className={classes.logoDiv}>
                                            SOLSTICE
                                          </Box>
                                  </Box>
                              :<Box className={classes.lessUnionDiv}>
                                      <Box className={classes.lessUnion}  onClick={handleDrawerOpen}>
                                          <img src={UnionImage} width={60} height={60} style={{borderRadius : '50%'}}/>
                                      </Box>
                              </Box>}
                          </ListItemIcon>
                      </ListItem>
                  </List>
                  <Divider />
                  <List className={classes.menuListDiv}>
                    {
                        menuList.map((menu, index) => (
                            <ListItemButton
                                key={index}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                    background : selectedTab === index && "#667A8A"
                                }}
                                onClick={()=>handleGotoTab(menu.link, index)}
                                disabled={
                                  (getCookie('_USER_TYPE') === 'external' && menu.label === 'Cart') || 
                                  (getCookie('_USER_TYPE') === 'external' && menu.label === 'Upload') ||
                                  (getCookie('_USER_TYPE') === 'external' && menu.label === 'SOLS Cloud') ||
                                  (getCookie('_USER_TYPE') === 'external' && menu.label === 'Customers') ||
                                  (getCookie('_USER_TYPE') === 'external' && menu.label === 'Setting') 
                                }
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <img src={menu.icon} width={35} height={30} style={{color : 'white !important'}}/>
                                </ListItemIcon>
                                <ListItemText primary={menu.label} sx={{ opacity: open ? 1 : 0, color : '#EFF2F4', fontSize : '10px !important'}} />
                            </ListItemButton>
                        ))
                    }
                    
                  </List> 
                </Box>
                <List>
                  <ListItemButton
                      sx={{
                          minHeight: 48,
                          justifyContent: open ? 'initial' : 'center',
                          px: 2.5,
                      }}

                      onClick={handleLogOut}
                  >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                        }}
                    >
                        <img src={LogOutImage} width={26} height={26}/>
                    </ListItemIcon>
                    <ListItemText primary={'Logout'} sx={{ opacity: open ? 1 : 0, color : '#EFF2F4' }} />
                  </ListItemButton>
                </List>
            </Drawer>
            : 
            (
                !mobileMenuOpen ? <Box className={classes.popButtonCss} onClick={handleOpenMobileMenu}>
                    <img src={UnionImage}  width={60} height={60} style={{borderRadius : '50%'}}/>
                </Box>
                : <></>
            )
            
        }
        {
          filterList.length ? <Box className={classes.notificationDiv} onClick={handleNotify}>
            <img src={NotificationImage} width={40} height={40} />
            <Box className={classes.notifyCountDiv}>
              {
                filterList.length
              }
            </Box>
          </Box> : <></>
        }
        <MobileSideMenu 
            open={mobileMenuOpen}
            handleClose={handleCloseMobileMenu}
            menuList={menuList}
            handleLogOut={handleLogOut}
        />
        {
          filterList.length ? <NotificationsList 
            isOpen={openNotify}
            notifysList={filterList}
          /> : <></>
        }
        </>
    );
}

const mapStateToProps = state => ({
  notifysList : state.notify.notifysList
}) ;

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(SideMenu) ;