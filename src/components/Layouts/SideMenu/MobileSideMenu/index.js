import React from 'react' ;
import { useNavigate } from 'react-router-dom';

import { useWalletInfo } from '../../../../contexts/WalletContext';

import LogOut_Icon from '../../../../assets/menu/Logout.svg' ;
import UnionImage from '../../../../assets/menu/Logo.png' ;

import {
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Divider,
    Box
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root : {

    },
    drawer : {
    },
    drawerPaper : {
        width : '100vw',
        backgroundColor : '#031C30 !important', 

        "& .MuiListItemButton-root" : {
            margin : 10,
            borderRadius : '10px !important',
            "&:hover" : {
                backgroundColor : '#667A8A'
            }
        }
    },
    logoDiv : {
        paddingLeft : 10,
        fontSize : 25,
        color : '#07db8a'
    },
    expandUnion : {
        borderRadius : '50%',
        width : 60,
        height : 60,
    
        display: 'flex',
        alignItems : 'center',
        justifyContent : 'center',
    
        cursor : 'pointer',
        "& img" : {
            border :'3px solid ' + theme.palette.green.G400
        }
    },
    expandUnionDiv : {
        marginTop : 30,
        marginBottom : 40,
        marginLeft : 20,
        
        display : 'flex',
        alignItems : 'center',
    },
}));

const MobileSideMenu = (props) => {

    const classes = useStyles() ;
    const navigate = useNavigate() ;
    const {
        open,
        handleClose,
        handleLogOut,
        menuList
    } = props ;

    const {
        isWalletConnected
    } = useWalletInfo() ;

    const handleGotoMenu = (link) => {
        handleClose() ;
        navigate(link) ;
    }
    return (
        <Drawer
            anchor="left"
            variant="persistent"
            onClose={handleClose}
            open={open}
            className={classes.drawer}
            classes={{
                paper: classes.drawerPaper
            }}
        >
           <Box className={classes.expandUnionDiv}>
                    <Box className={classes.expandUnion}  onClick={handleClose}>
                        <img src={UnionImage} width={60} height={60} style={{borderRadius : '50%'}}/> 
                    </Box>
                    <Box className={classes.logoDiv}>
                        SOLSTICE
                    </Box>
            </Box>
            <Divider />
            <List>
                {
                    menuList.map((menu, index) => (
                        <ListItemButton
                            key={index}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            onClick={() => handleGotoMenu(menu.link)}
                            disabled={
                                (menu.label === 'Cart' && !isWalletConnected) 
                            }
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <img src={menu.icon} width={35} height={30}/>
                            </ListItemIcon>
                            <ListItemText primary={menu.label} sx={{ opacity: open ? 1 : 0, color : '#EFF2F4' }} />
                        </ListItemButton>
                    ))
                }
                <ListItemButton
                    sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        marginTop : '70px !important'
                    }}

                    onClick={() => {
                        handleClose() ;
                        handleLogOut() ;
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                        }}
                    >
                        <img src={LogOut_Icon} width={26} height={26}/>
                    </ListItemIcon>
                    <ListItemText primary={'Logout'} sx={{ opacity: open ? 1 : 0, color : '#EFF2F4' }} />
                </ListItemButton>
            </List> 
        </Drawer>
    )
}

export default MobileSideMenu ; 
