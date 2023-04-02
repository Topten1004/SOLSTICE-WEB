import React from 'react' ;

import { connect } from 'react-redux';
import PropTypes from 'prop-types' ;
import { UserBidsInfoList} from '../../../../redux/actions/cart' ;

import { AcceptBid, DenyBid } from '../../../../firebase/bid_collection';

import { toast } from 'react-toastify/dist/react-toastify';

import {
   Popover,
   List,
   ListItem,
   Divider,
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    popover : {
        zIndex : "1500 !important",
        "& .MuiList-root" : {
            padding : "0px",
            width : '120px',
            background : "#177a7abf !important"
        },
        "& .MuiListItem-root" : {
            padding : 10,
            display : 'flex', justifyContent : 'center',
            fontSize : "14px" , color : "white", fontWeight : 'bold'
        },
        "& a" : {
            textDecoration : "none"
        }
    }
}))

const ActionPopOver = (props) => {

    const classes = useStyles() ;

    const {
        open , anchorEl , id, handleClose,
        bidId,

        UserBidsInfoList,
    } = props ;

    const handleAccept = async () => {
        handleClose() ;
        if( await swal({
            title : 'Confirm',
            text : "Are you sure that you accept this bid?",
            buttons: [
                'No, I am not sure!',
                'Yes, I am sure!'
            ],
            icon : 'info'
        })) {
            const id = toast.loading("[Accept Bid] Tx is pending...");

            if(await AcceptBid(bidId)) {
                toast.update(id, { render: "[Accept Bid] Tx is successful", type: "success", autoClose: 5000, isLoading: false });
               
                await UserBidsInfoList() ;
            } else {
                toast.update(id, { render: txResult , type: "error", autoClose: 5000, isLoading: false });
            }
        }
    }

    const handleDeny = async () => {
        handleClose() ;
        if( await swal({
            title : 'Confirm',
            text : "Are you sure that you deny this bid?",
            buttons: [
                'No, I am not sure!',
                'Yes, I am sure!'
            ],
            icon : 'info'
        })) {
            const id = toast.loading("[Deny Bid] Tx is pending...");
            
            if(await DenyBid(bidId)) {
                toast.update(id, { render: "[Deny Bid] Tx is successful", type: "success", autoClose: 5000, isLoading: false });
                await UserBidsInfoList() ;
            } else {
                toast.update(id, { render: txResult , type: "error", autoClose: 5000, isLoading: false });
            }
        }
    }

    return (
        <Popover
            id={id}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            classes={{
                paper : classes.popover
            }}
        >
            <List>
                <ListItem button  onClick={handleAccept}>
                    Accept
                </ListItem>
                <Divider />
                <ListItem button  onClick={handleDeny}>
                    Deny
                </ListItem>
            </List>
        </Popover>
    )
}
ActionPopOver.propTypes = {
    UserBidsInfoList : PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
   
});
const mapDispatchToProps = {
    UserBidsInfoList,
}
export default connect(mapStateToProps, mapDispatchToProps)(ActionPopOver) ;