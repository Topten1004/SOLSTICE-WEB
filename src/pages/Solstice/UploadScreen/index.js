import React,{ useEffect, useState } from 'react' ;

import { useNavigate } from 'react-router-dom';

import { useWalletInfo } from '../../../contexts/WalletContext';

import { connect } from 'react-redux' ;
import { InitUploadReducer } from '../../../redux/actions/upload';
import PropTypes from 'prop-types';

import UploadCheckOut from './UploadCheckOut';
import UploadSolsVideo from './UploadSolsVideo';
import PriceConfig from './PriceConfig';
import LegendaryPrice from './LegendaryPrice';
import RarePrice from './RarePrice';
import RecurringPrice from './RecurringPrice' ;
import FreePrice from './FreePrice';

const UploadScreen = (props) => {
    const navigate = useNavigate() 

    const {
        web3Provider
    } = useWalletInfo() ;

    const {
        InitUploadReducer
    } = props ;

    const [ uploadStep, setUploadStep ] = useState('sols-video') ;

    const handleChangeUploadStep = (step) => {
        setUploadStep(step) ;
    }

    useEffect(() => {
        return () => {
            InitUploadReducer() ;
        }
    }, []) ;

    return (
        <>
            {
                uploadStep === 'sols-video' && <UploadSolsVideo 
                    handleChangeUploadStep={handleChangeUploadStep}
                />
            }
            {
                uploadStep === 'price-config' && <PriceConfig 
                    handleChangeUploadStep={handleChangeUploadStep}
                />
            }
            {
                uploadStep === 'legendary-price' && <LegendaryPrice 
                    handleChangeUploadStep={handleChangeUploadStep}
                />
            }
            {
                uploadStep === 'rare-price' && <RarePrice 
                    handleChangeUploadStep={handleChangeUploadStep}
                />
            }
            {
                uploadStep === 'recurring-price' && <RecurringPrice
                    handleChangeUploadStep={handleChangeUploadStep}
                />
            }
            {
                uploadStep === 'free-price' && <FreePrice
                    handleChangeUploadStep={handleChangeUploadStep}
                />
            }
            {/* {
                uploadStep === 'integration-detail' && <IntegrationDetail 
                    handleChangeUploadStep={handleChangeUploadStep}
                />
            }
            {
                uploadStep === 'integration-content' && <IntegrationContent
                    handleChangeUploadStep={handleChangeUploadStep}
                />
            } */}
            {
                uploadStep === 'product-checkout' && <UploadCheckOut
                    handleChangeUploadStep={handleChangeUploadStep}
                />
            }
        </>
    )
}
UploadScreen.propTypes = {
    InitUploadReducer : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
})
const mapDispatchToProps = {
    InitUploadReducer
}
export default connect(mapStateToProps, mapDispatchToProps)(UploadScreen) ;

