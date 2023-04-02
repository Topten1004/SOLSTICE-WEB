import * as React from 'react' ;

import { useLocation } from 'react-use';

import { connect } from 'react-redux';

import {
    Button
} from '@mui/material' ;

import { getUnit } from '../../utils/Helper';

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    buttonCss : {
        backgroundColor : '#338BEF !important',
        textTransform : 'none !important',
        marginRight : '10px !important', marginLeft : '10px !important',
        fontWeight : 'bold !important',
    },
})) ;

const BuyProduct = (props) => {
    const classes = useStyles() ;
    const location = useLocation() ;

    const {
        productInfo,
    } = props ;
 
    const [disableButton, setDisableButton] = React.useState(true) ;

    const handleClickBuy = () => {
        window.open(location.origin + '/product-intro?linkId=' + productInfo.intro_link_anyone, '_blank') ;
    }

    React.useEffect(() => {
        if(typeof productInfo === 'undefined') {
            setDisableButton(true) ;
            return ;
        }

        if(productInfo?.price_type === 'free') {
            if( new Date(productInfo?.release_date).getTime() - new Date().getTime() > 0 ) {
                setDisableButton(true) ;
                return ;
            }
        }
        if(productInfo?.price_type === 'recurring') {
            if( new Date(productInfo?.release_date).getTime() - new Date().getTime() > 0 ) {
                setDisableButton(true) ;
                return ;
            }
        }
        setDisableButton(false) ;
    }, [productInfo]) ;
    return (
        <>
            {
                typeof productInfo !== "undefined" && <Button variant={'contained'} className={classes.buttonCss} sx={{mb : '10px', width : 'auto'}} onClick={handleClickBuy} disabled={disableButton}>
                    {
                        productInfo?.price_type === 'rare' && `Buy for ${productInfo?.minimum_bidding} ${getUnit(productInfo?.bid_unit)}`
                    }
                    {
                        productInfo?.price_type === 'legendary' && `Buy for ${productInfo?.product_price} ${getUnit(productInfo?.product_unit)}`
                    }
                    {
                        productInfo?.price_type === 'free' && `Free Offer`
                    }
                    {
                        productInfo?.price_type === 'recurring' && `Buy for ${productInfo?.recurring_price} ${getUnit(productInfo?.recurring_unit)}`
                    }
                </Button>
            }
        </>
    )
}

const mapStateToProps = state => ({
})
const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(BuyProduct) ; 