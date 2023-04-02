import * as React from 'react' ;

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { UserAllProducts } from '../../../redux/actions/profile';

import CloseIcon from '@mui/icons-material/Close';
import validator from 'validator';
import Loading from 'react-loading-components' ;

import swal from 'sweetalert';

import { UpdateLegendaryProduct, MoveProductToTrash, UpdateRecurringProduct } from '../../../firebase/product_collection';

import  {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Box,
    Button,
    Grid,
    TextField,
} from '@mui/material' ;

import { useStyles } from './StylesDiv/EditProduct.styles';
import { useTheme } from '@mui/styles';

const EditProductModal = (props) => {

    const classes = useStyles() ;
    const theme = useTheme() ;

    const {
        open,
        handleClose,

        productInfo,
        UserAllProducts
    } = props ;

    const [loading, setLoading] = React.useState(null) ;
    const [productName, setProductName] = React.useState(null) ;
    const [priceType, setPriceType] = React.useState(null) ;
    const [description, setDescription] = React.useState(null) ;
    const [productType, setProductType] = React.useState(null) ;
    const [productPrice, setProductPrice] = React.useState(null) ;
    const [ticketPrice, setTicketPrice] = React.useState(null) ;

    const handleUpdateProductInfo = async () => {
        setLoading(true) ;
        
        if(productInfo.price_type === 'legendary') {
            await UpdateLegendaryProduct(productInfo.id, productName, description, productPrice) ;
        }

        if(productInfo.price_type === 'recurring') {
            await UpdateRecurringProduct(productInfo.id, productName, description, productPrice) ; 
        }

        await UserAllProducts() ;

        setLoading(false) ;
        handleClose() ;
    }

    const handleDeleteProduct = async () => {
        if(await swal({
            title : 'Delete Product',
            text : 'Are you sure that you want to delete this product?',
            icon : 'info',
            buttons : { confirm : {text : 'Got it'} }
        })) {
            setLoading(true) ;

            await MoveProductToTrash(productInfo.product_id) ;
    
            await UserAllProducts() ;
    
            setLoading(false) ;
            handleClose() ; 
        }
    }
    
    React.useEffect(() => {
        if(productInfo) {
            setProductName(productInfo.product_name) ;
            setPriceType(productInfo.price_type) ;
            setDescription(productInfo.product_description) ;
            setProductType(productInfo.product_type) ;

            if(productInfo.price_type === 'legendary') {
                setProductPrice(productInfo.product_price) ;
            }
            if(productInfo.price_type === 'recurring') {
                setProductPrice(productInfo.recurring_price) ;
            }
        }
    }, [productInfo]) ;

    return (
        <Box className={classes.root}>
            <Dialog
                open={open}
                fullWidth
                classes ={{
                    paper : classes.paper
                }}
                hideBackdrop={true}
            >
                <Box className={classes.greenBlur} />
                <Box className={classes.blueBlur} />
                <DialogTitle>
                    <Box>
                        Product : { productInfo?.product_name }
                    </Box>
                    <CloseIcon onClick={handleClose} sx={{cursor : 'pointer'}} className={classes.closeButtonCss} />
                </DialogTitle>
                <Box className={classes.dividerDiv} />
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    Product Type
                                </Grid>
                                <Grid item xs={12}>
                                    { productType }
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6} >
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    Price Type
                                </Grid>
                                
                                <Grid item xs={12} sx={{textTransform : 'capitalize'}}>
                                    { priceType }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                   <Grid container sx={{mt : '15px'}}>
                        <Grid item xs={6}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    Product Name
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        value={productName || ''}
                                        onChange={(e) => setProductName(e.target.value)}
                                        size='small'
                                    />
                                </Grid>
                               
                                <Grid item xs={12}>
                                    Description
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        value={description || ''}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        multiline
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            {
                                productInfo?.price_type === 'legendary' && <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        Product Price
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            type={'number'}
                                            value={productPrice}
                                            onChange={(e) => setProductPrice(e.target.value)}
                                            size='small'
                                        />
                                    </Grid>
                                    {
                                        productInfo.resellable && <>
                                            <Grid item xs={12}>
                                                Ticket Price
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    type={'number'}
                                                    value={ticketPrice}
                                                    onChange={(e) => setTicketPrice(e.target.value)}
                                                    size='small'
                                                />
                                            </Grid>
                                        </>
                                    }
                                </Grid>
                            }
                            {
                                productInfo?.price_type === 'rare' && <Grid container>
                                    <Grid item xs={12}>
                                        Product Price
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            type={'number'}
                                            value={productPrice}
                                            onChange={(e) => setProductPrice(e.target.value)}
                                            size='small'
                                        />
                                    </Grid>
                                </Grid>
                            }
                            {
                                productInfo?.price_type === 'recurring' && <Grid container>
                                    <Grid item xs={12}>
                                        Product Price
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            type={'number'}
                                            value={productPrice}
                                            onChange={(e) => setProductPrice(e.target.value)}
                                            size='small'
                                        />
                                    </Grid>
                                </Grid>
                            }
                            {
                                productInfo?.price_type === 'free' && <Grid item xs={12}>

                                </Grid>
                            }
                        </Grid>
                    </Grid>
                </DialogContent>
                <Box className={classes.dividerDiv} />
                <DialogActions>
                    <Button variant={'contained'} 
                        onClick={
                            handleDeleteProduct
                        } 
                        // disabled={!productInfo || loading || (stripeStatus !== 'active' && productInfo?.price_type !== 'free')}
                        startIcon={ loading && <Loading type='tail_spin' width={20} height={20} fill='#e83e8c' />}
                        className={classes.deleteButtonCss}
                    >
                        Delete
                    </Button>
                    <Button variant={'contained'} 
                        onClick={
                            handleUpdateProductInfo
                        } 
                        // disabled={!productInfo || loading || (stripeStatus !== 'active' && productInfo?.price_type !== 'free')}
                        startIcon={ loading && <Loading type='tail_spin' width={20} height={20} fill='#e83e8c' />}
                        className={classes.editButtonCss}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
EditProductModal.propTypes = {
    UserAllProducts : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    creator_email : state.profile.email,
    creator_name : state.profile.accountName,
    customersList : state.profile.customers
})
const mapDispatchToProps = {
    UserAllProducts
}
export default connect(mapStateToProps, mapDispatchToProps)(EditProductModal) ;