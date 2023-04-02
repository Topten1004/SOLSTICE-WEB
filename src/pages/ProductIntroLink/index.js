import * as React from 'react' ;
import { useLocation, useSearchParams } from 'react-router-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types' ;

import NotFound from '../../components/Common/NotFound';
import ProductAdvertise from '../../components/ProductIntroLink/ProductAdvertise';
import RestrictedModal from '../../components/ProductIntroLink/RestrictedModal';

import Loading from 'react-loading-components' ;
import { ProductInfoByIntroLink } from '../../firebase/product_collection' ;
import { uuidValidateV4 } from '../../utils/Helper';

import {
    Box
} from '@mui/material' ;

import  {makeStyles, useTheme} from '@mui/styles' ;

const useStyles = makeStyles((theme) => ({
    root : {

    },
    loadingDiv : {
        width : '100%' , minHeight : '100vh',
        display : 'flex', justifyContent : 'center', alignItems : 'center', flexDirection : 'column', gap : '10px',
        background : theme.palette.blue.main
    }
})) ;

const ProductIntroLink = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;

    const {
    } = props ;
    
    const [urlParams, setUrlParams] = useSearchParams() ;
    const [isPassed, setPassed] = React.useState(false) ;
    const [productInfo, setProductInfo] = React.useState(null) ;
    const [loading, setLoading] = React.useState(true) ;

    const [openRestrictedModal, setOpenRestrictedModal] = React.useState(false) ;

    const handleOpenRestrictedModal = () => {
        setOpenRestrictedModal(true) ;
    }

    const handleCloseRestrictedModal = () => {
        successLoading() ;
        setOpenRestrictedModal(false) ;
    }

    const failLoading = async () => {
        setPassed(false) ;
        setLoading(false) ;
    }

    const successLoading = async () => {
        setPassed(true);
        setLoading(false) ;
    }
    
    React.useEffect(async () => {
        if(urlParams) {

            if(!urlParams.get('linkId')) {
                failLoading() ;
                return ;
            }

            let isValid  = await uuidValidateV4(urlParams.get('linkId')) ;

            if(!isValid) {
                failLoading() ;
                return ;
            }

            let productInfo = await ProductInfoByIntroLink(urlParams.get('linkId')) ;

            if(!productInfo) {
                failLoading();
                return ;
            }

            setProductInfo(productInfo) 

            if(productInfo.link_type === 'anyone') {
                successLoading() ;
            } else {
                handleOpenRestrictedModal() ; 
            }
          
        }
    }, [urlParams]) ;

    React.useEffect(() => {
        return () => {

        }
    }, []) ;

    return (
        <>
            {
                loading ? <Box className={classes.loadingDiv}>
                    <Loading type='puff' width={100} height={100} fill='#43D9AD' />
                    <Box sx={{color : theme.palette.green.G200, fontSize : '30px', letterSpacing : '5px'}}>...Checking URL</Box>
                </Box> :
                (
                    !isPassed  ? <NotFound /> : <ProductAdvertise 
                        productInfo={{
                            ...productInfo,
                            end_date : urlParams.get('end'),
                            platform : urlParams.get('platform')
                        }}
                    />
                )
            }
            <RestrictedModal 
                open={openRestrictedModal}
                handleClose={handleCloseRestrictedModal}
                productId={productInfo?.id}
            />
        </>
    )
}

ProductIntroLink.propTypes = {
}
const mapStateToProps = state => ({
}) ;
const mapDispatchToProps = {
} ;
export default connect(mapStateToProps, mapDispatchToProps)(ProductIntroLink) ;