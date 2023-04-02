import React,{ useEffect, useState, useRef} from 'react' ;

import { useNavigate } from 'react-router-dom';
import { useWalletInfo } from '../../../contexts/WalletContext';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { UploadLegens, UploadRares, UploadRecurrings, UploadFrees, UploadLoading, MintMyNFT } from '../../../redux/actions/upload';
import  { UserAccountInfo, LoadingProductsList, UserAllProducts } from '../../../redux/actions/profile' ;

import { getYoutubeId, isYoutubeUrl, fileNameFormat, getUnit, getCookie, getUuid, getFileExtension, convertObjToString } from '../../../utils/Helper';

import YouTube from 'react-youtube';
import { ProgressBar } from "react-progressbar-fancy";
import StepperControl from '../../../components/Solstice/UploadScreen/StepperControl';
import PdfPreview from '../../../components/Common/PdfPreview';
import DocxPreview from '../../../components/Common/DocxPreview' ;
import PdfFullScreen from '../../../components/Common/PdfFullScreen';
import DocxFullScreen from '../../../components/Common/DocxFullScreen';
import ImageFullScreen from '../../../components/Common/ImageFullScreen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import DocPreview from '../../../components/Common/DocPreview';
import VideoToCanvas from '../../../components/Common/VideoToCanvas';

import { v4 as uuidv4 } from 'uuid' ;
import  md5  from 'md5' ;

import {  toast } from 'react-toastify/dist/react-toastify';

import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { EffectCube, Pagination } from "swiper";

import 'swiper/swiper.min.css';
import 'swiper/modules/effect-cube/effect-cube.min.css' ;

import Web3 from 'web3';

import { ref, listAll, deleteObject } from 'firebase/storage' ;
import { storage } from '../../../firebase/config';
// const web3 = new Web3('https://ropsten.infura.io/v3/f957dcc0cb6c430f9d32c2c085762bdf') ;
// const web3 = new Web3('https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161') ;

import {
    Box,
    Grid,
    Tooltip,
    useMediaQuery,
} from '@mui/material';

import { useStyles } from './StylesDiv/UploadCheckOut.styles' ;
import { useTheme } from '@mui/material';

const web3 = new Web3('https://kovan.infura.io/v3/f957dcc0cb6c430f9d32c2c085762bdf') ;

let timer ;

const UploadCheckOut = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;
    
    const match1140 = useMediaQuery('(min-width : 1140px)') ;
    const match765 = useMediaQuery('(min-width : 765px)') ;

    const {
        handleChangeUploadStep,
        UserAccountInfo,

        UploadLegens,
        UploadRares,
        UploadRecurrings,
        UploadFrees,
        UploadLoading,

        LoadingProductsList,
        UserAllProducts,

        hostId,
        joinedDate,
        profileLink,
        
        productName,
        solsForUpload,
        externalsForUpload,
        solsPriceType,
        solsProductType,
        solsProductDescription,
    
        legenResell,
        legenProductPrice,
        legenTicketPrice,
        legenPriceUnit,
        legenTicketUnit,
        legenTicketCount,
        legenRoyalty,
        legenStripeCard,
    
        rareBiddingPrice,
        rareBiddingUnit,
        rareAvailableItems,
        rareRoyalty ,
        rareStripeCard ,
        rareListingTime,
        rareUnlimited,

        recurringSubscriptionPrice,
        recurringPriceUnit,
        recurringReleaseDate,
    
        freeSubscriptionPrice,
        freePriceUnit,
        freeReleaseDate,

        uploadedProduct,
        uploadedCount,
        totalProgress,

        uploadLoading,
    } = props;

    const {
        isWalletConnected,
        web3Provider,
        walletAddress
    } = useWalletInfo() ;

    const navigate = useNavigate() ;

    const [openPdf, setOpenPdf] = useState(false) ;
    const [openPdfPath, setOpenPdfPath] = useState(null) ;

    const [openDocx, setOpenDocx] = useState(false) ;
    const [openDocxPath, setOpenDocxPath] = useState(null) ;

    const [openImage, setOpenImage] = useState(false);
    const [openImagePath, setOpenImagePath] = useState(false) ;

    const [curSolsIndex, setCurSolsIndex] = useState(0);
    const [activeStep, setActiveStep] = useState(3) ;
    const [gasPrice, setGasPrice] = useState(null);
    const [gasLimit, setGasLimit] = useState(null) ;
    const [gasFee, setGasFee] = useState(null) ;
    const [nonce, setNonce] = useState(null) ;
 
    const handleBack = () => {
        if(solsPriceType === "legendary") handleChangeUploadStep('legendary-price') ;
        if(solsPriceType === "rare") handleChangeUploadStep('rare-price') ;
        if(solsPriceType === "recurring") handleChangeUploadStep('recurring-price') ;
        if(solsPriceType === "free") handleChangeUploadStep('free-price') ;
    }
    
    const handleContinue = async () => {
        setActiveStep(4) ;

        UploadLoading(true) ;

        let storageRef = ref(storage, '_doc_temp/') ;

        let res = await listAll(storageRef) ;
        for(let itemRef of res.items) {
            await deleteObject(itemRef) ;
        }

        if(solsPriceType === "legendary") {
            let id = toast.loading("Uploading Legendary To IPFS...") ;

            let resell = legenResell === 'YES' ? true : false ;

            let product_id = await UploadLegens(
                walletAddress,
                productName ,
                resell ,

                solsForUpload ,
                externalsForUpload ,
                solsPriceType ,
                solsProductType ,
                solsProductDescription,

                legenProductPrice ,
                legenPriceUnit ,

                legenTicketPrice,
                legenTicketUnit,
                legenTicketCount,
                
                legenRoyalty,
                legenStripeCard
            ) ;

            if(!product_id) {
                toast.update(id, { render: "Upload To IPFS is failed", type: "error", autoClose: 5000, isLoading: false });

                await finishUploading() ;
            
                return ;
            } 
            
            toast.update(id, { render: "Upload To IPFS is successful", type: "success", autoClose: 5000, isLoading: false });

            await finishUploading() ;

           if(isWalletConnected && resell) {
                id = toast.loading("Mint Legendary Tx is pending...") ;

                let txResult = await MintMyNFT( 
                    getCookie('_SOLSTICE_AUTHUSER'),
                    walletAddress, md5(getCookie('_SOLSTICE_AUTHUSER')),  
                    1,
                    Number(legenProductPrice),
                    Number(legenTicketPrice), 
                    resell ? Number(legenTicketCount) + 1 : 1 , 
                    legenRoyalty, 
                    resell,
                    product_id, 
                    legenTicketUnit 
                ) ;
            
                if( txResult ) {
                    toast.update(id, { render: "Mint Legendary Tx is successful", type: "success", autoClose: 5000, isLoading: false });
                } else {
                    toast.update(id, { render: "Mint Legendary Tx is failed", type: "error", autoClose: 5000, isLoading: false });
                }
           }
        }
        if(solsPriceType === 'rare') {

            let id = toast.loading("Uploading Rare To IPFS...") ;

            let product_id = await UploadRares(
                walletAddress,
                productName ,

                solsForUpload ,
                externalsForUpload ,
                solsPriceType ,
                solsProductType ,
                solsProductDescription,

                rareBiddingPrice ,
                rareBiddingUnit,
                rareAvailableItems ,

                rareRoyalty ,
                rareStripeCard ,
                rareListingTime ,
                rareUnlimited ,
            ) ;

            if(!product_id) {
                toast.update(id, { render: "Upload To IPFS is failed", type: "error", autoClose: 5000, isLoading: false });

                await finishUploading() ;

                return ;
            }
            
            toast.update(id, { render: "Upload To IPFS is successful", type: "success", autoClose: 5000, isLoading: false });

            await finishUploading() ;

            id = toast.loading("Mint Rare Tx is pending...") ;

            let txResult = await MintMyNFT( 
                getCookie('_SOLSTICE_AUTHUSER'),
                walletAddress, md5(getCookie('_SOLSTICE_AUTHUSER')),  
                2,
                Number(rareBiddingPrice),
                0, 
                Number(rareAvailableItems) + 1 , 
                rareRoyalty, 
                false,
                product_id, 
                rareBiddingUnit
            ) ;
        
            if( txResult ) {
                toast.update(id, { render: "Mint Rare Tx is successful", type: "success", autoClose: 5000, isLoading: false });
            } else {
                toast.update(id, { render: "Mint Rare Tx is failed", type: "error", autoClose: 5000, isLoading: false });
            }
        }
        if(solsPriceType === 'recurring') {
            let id = toast.loading("Uploading Recurring To IPFS...") ;

            let product_id = await UploadRecurrings(
                walletAddress,
                productName ,

                solsForUpload ,
                externalsForUpload ,
                solsPriceType ,
                solsProductType ,
                solsProductDescription,

                recurringSubscriptionPrice ,
                recurringPriceUnit,
                recurringReleaseDate,
            ) ;

            if(!product_id) {
                toast.update(id, { render: "Upload To IPFS is failed", type: "error", autoClose: 5000, isLoading: false });
            } else  toast.update(id, { render: "Upload To IPFS is successful", type: "success", autoClose: 5000, isLoading: false });

            await finishUploading() ;
        }

        if(solsPriceType === 'free') {
            let id = toast.loading("Uploading Free To IPFS...") ;

            let product_id = await UploadFrees(
                productName ,

                solsForUpload ,
                externalsForUpload ,
                solsPriceType ,
                solsProductType ,
                solsProductDescription,

                freeSubscriptionPrice ,
                freePriceUnit,
                freeReleaseDate,
            ) ;

            if(!product_id) {
                toast.update(id, { render: "Upload To IPFS is failed", type: "error", autoClose: 5000, isLoading: false });

                return ;
            } else toast.update(id, { render: "Upload To IPFS is successful", type: "success", autoClose: 5000, isLoading: false });

            await finishUploading() ;
        }
        
        await LoadingProductsList(true) ;
        await UserAllProducts(true) ;
        await LoadingProductsList(false) ;
    }

    const finishUploading = async () => {
        await UploadLoading(false) ;
        navigate('/solstice/profile-screen') ;
    }

    const calculateGasFee = async () => {
        if(web3Provider) {
            const signer = web3Provider.getSigner() ;

            let nonce = await signer.getTransactionCount() ;
            let latestBlock = await web3.eth.getBlock('latest');
            let gasPrice = await web3.eth.getGasPrice() ;

            setGasPrice(gasPrice.toString()) ;

            let gasLimit = latestBlock.gasLimit ;
            let txCount = latestBlock.transactions.length ;

            setGasLimit((gasLimit / txCount).toFixed(0)) ;

            gasPrice = web3.utils.fromWei(gasPrice.toString() , 'ether') ;
            gasLimit = web3.utils.fromWei(gasLimit.toString(), 'ether') ;
            txCount = web3.utils.fromWei(txCount.toString(), 'ether') ;

            let gasFee = Number(gasLimit) * Number(gasPrice) ;
        
            let gasFeePerTx = gasFee / Number(txCount) ;

            gasFee = gasFeePerTx.toFixed(10) ;
            
            setGasFee(Number(gasFee)) ;
            setNonce( ( nonce + 1 ).toString() ) ;
        }
    }

    useEffect(() => {
        UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;
    }, []) ;

    useEffect(() => {
        timer = setInterval(calculateGasFee, 5000) ;
        
        return () => {
            console.log("kill timer") ;
            clearInterval(timer) ;
        }
    }, []) ;

    return (
        <Box className={classes.root}>
            <Box className={classes.greenBlur} />
            <Box className={classes.blueBlur} />
            {
                uploadLoading && <Box className={classes.loadingDiv} />
            }
            <Box className={classes.pageTitleDiv}>
                Minting Press
            </Box>
            <Grid container sx={{mb : '30px'}}>
                <Grid item xs={6}>
                    <Box className={classes.productCountDiv}>
                        Total Products {`(${solsForUpload.length + externalsForUpload.length})`}
                    </Box>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={match1140 ? 7 : 12}>
                    <Box className={classes.checkOutDiv}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} className={classes.tabDiv}>
                                Product Information
                            </Grid>
                            <Grid item xs={match765 ? 6 : 12} >
                                Product Name
                            </Grid>
                            <Grid item xs={match765 ? 6 : 12} className={classes.valDiv}>
                                { productName }  
                            </Grid>
                            <Grid item xs={match765 ? 6 : 12}>
                                Price Type :
                            </Grid>
                            <Grid item xs={match765 ? 6 : 12} sx={{textTransform : 'capitalize'}} className={classes.valDiv}>
                                {`${solsPriceType}`}
                            </Grid>
                            {
                                solsPriceType === 'legendary' &&
                                <>
                                    <Grid item xs={match765 ? 6 : 12}>
                                        Price Per Product
                                    </Grid>
                                    <Grid item xs={match765 ? 6 : 12} className={classes.valDiv}>
                                        { legenProductPrice } USD
                                    </Grid>
                                    {
                                        legenResell === 'YES' && <>
                                            <Grid item xs={match765 ? 6 : 12}>
                                                Price Per Ticket
                                            </Grid>
                                            <Grid item xs={match765 ? 6 : 12} className={classes.valDiv}>
                                                { legenTicketPrice } USD
                                            </Grid>
                                            <Grid item xs={match765 ? 6 : 12}>
                                                # of Ticket Available
                                            </Grid>
                                            <Grid item xs={match765 ? 6 : 12} className={classes.valDiv}>
                                                { legenTicketCount }
                                            </Grid>
                                        </>
                                    }
                                </>
                            }
                            {
                                solsPriceType === 'rare' &&
                                <>
                                    <Grid item xs={match765 ? 6 : 12}>
                                        Minimum Bidding Price
                                    </Grid>
                                    <Grid item xs={match765 ? 6 : 12} className={classes.valDiv}>
                                        {rareBiddingPrice} USD
                                    </Grid>
                                    <Grid item xs={match765 ? 6 : 12}>
                                        # of Available Items
                                    </Grid>
                                    <Grid item xs={match765 ? 6 : 12} className={classes.valDiv}>
                                        {rareAvailableItems}
                                    </Grid>
                                </>
                            }
                            {
                                solsPriceType === 'recurring' &&
                                <>
                                    <Grid item xs={match765 ? 6 : 12}>
                                        Price Per Subscription
                                    </Grid>
                                    <Grid item xs={match765 ? 6 : 12} className={classes.valDiv}>
                                        { recurringSubscriptionPrice } USD
                                    </Grid>
                                    <Grid item xs={match765 ? 6 : 12}>
                                        Payment
                                    </Grid>
                                    <Grid item xs={match765 ? 6 : 12} className={classes.valDiv}>
                                        Monthly
                                    </Grid>
                                    <Grid item xs={match765 ? 6 : 12}>
                                        Release Date
                                    </Grid>
                                    <Grid item xs={match765 ? 6 : 12} className={classes.valDiv}>
                                        { convertObjToString(recurringReleaseDate) }
                                    </Grid>
                                    <Grid item xs={match765 ? 6 : 12}>
                                        Distribution Schedule
                                    </Grid>
                                    <Grid item xs={match765 ? 6 : 12} className={classes.valDiv}>
                                        Weekly
                                    </Grid>
                                </>
                            }
                            {
                                solsPriceType === 'free' &&
                                <>
                                    <Grid item xs={match765 ? 6 : 12}>
                                        Release Date
                                    </Grid>
                                    <Grid item xs={match765 ? 6 : 12} className={classes.valDiv}>
                                        { convertObjToString(freeReleaseDate) }
                                    </Grid>
                                </>
                            }
                        </Grid>
                        <Grid container spacing={1} sx={{mt : '20px'}}>
                            <Grid item xs={12} className={classes.tabDiv}>
                                Online Distribution
                            </Grid>
                            <Grid item xs={match765 ? 6 : 12}>
                                Profile Link
                            </Grid>
                            <Grid item xs={match765 ? 6 : 12} className={classes.valDiv}>
                                <Tooltip title={profileLink || "..."}>
                                    <Box>
                                        <a href={profileLink}>{new String(profileLink).slice(0, 15)}...</a>
                                    </Box>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={match765 ? 6 : 12}>
                                Contact SOLSTICE
                            </Grid>
                            <Grid item xs={match765 ? 6 : 12} className={classes.valDiv}>
                                admin@solsapp.com
                            </Grid>
                            {/* <Grid item xs={12}>
                                Transaction Fee
                            </Grid>
                            <Grid item xs={match765 ? 6 : 12} sx={{fontSize : 16}} className={classes.valDiv}>
                                • Gas Limit(Units)
                            </Grid>
                            <Grid item xs={match765 ? 6 : 12} sx={{fontSize : 16}} className={classes.valDiv}>
                                {  
                                    gasLimit && gasLimit !== 'Infinity' ? <>{gasLimit}</> : <>
                                        <Loading type='oval' width={16} height={16} fill='#43D9AD' /> 
                                    </> 
                                }
                            </Grid>
                            <Grid item xs={match765 ? 6 : 12} sx={{fontSize : 16}} className={classes.valDiv}>
                                • Estimated Gas Fee
                            </Grid>
                            <Grid item xs={match765 ? 6 : 12} sx={{fontSize : 16}} className={classes.valDiv}>
                                {  
                                    gasFee && Number.isFinite(gasFee) ? <>{gasFee} ETH</> : <>
                                        <Loading type='oval' width={16} height={16} fill='#43D9AD' /> 
                                    </> 
                                }
                            </Grid>
                            <Grid item xs={match765 ? 6 : 12} sx={{fontSize : 16}} className={classes.valDiv}>
                                • Nonce
                            </Grid>
                            <Grid item xs={match765 ? 6 : 12} sx={{fontSize : 16}} className={classes.valDiv}>
                                {
                                    nonce  ? <># {nonce}</> : <>
                                        <Loading type='oval' width={16} height={16} fill='#43D9AD' /> 
                                    </> 
                                }
                            </Grid> */}
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={match1140 ? 5 : 12} sx={{display : 'flex', flexDirection : 'column', justifyContent : 'center', alignItems : 'center'}}>
                    <Swiper
                        effect={"cube"}
                        grabCursor={true}
                        cubeEffect={{
                        slideShadows: true,
                        }}
                        pagination={true}
                        modules={[EffectCube, Pagination]}
                        className="mySwiper"
                        onSlideChange={(e) => setCurSolsIndex(e.activeIndex)}
                    >
                        {
                            externalsForUpload.map((item, index) => {
                                return  <SwiperSlide key={index}>
                                    <Box sx={{position : 'relative'}}>
                                        <Box sx={{zIndex : -100}}>
                                            {
                                                isYoutubeUrl(item.url) ? <YouTube videoId={getYoutubeId(item.url)} opts={{
                                                    height: 150,
                                                    width: 200,
                                                    playerVars: {
                                                        // https://developers.google.com/youtube/player_parameters
                                                        autoplay: 1,
                                                    }
                                                }}/> :
                                                <video src={item.url} width={150} height={200} style={{zIndex : -120}} controls/>
                                            }
                                        </Box>
                                    </Box>
                                </SwiperSlide>
                            })
                        }
                        {
                            solsForUpload.map((item, index) => {
                                return <SwiperSlide key={index}>
                                    {
                                        (
                                            item.category === 'image' || 
                                            item.category === 'pdf' ||
                                            item.category === 'docx'
                                        ) &&
                                        <Box className={classes.fullIconDiv} onClick={() => {
                                            switch(item.category) {
                                                case 'docx' :
                                                    setOpenDocxPath(item.preview) ;
                                                    setOpenDocx(true);
                                                    return ;
                                                case 'pdf' : 
                                                    setOpenPdfPath(item.preview) ;
                                                    setOpenPdf(true);
                                                    return ;
                                                case 'image' :
                                                    setOpenImagePath(item.preview) ;
                                                    setOpenImage(true) ;
                                                default :
                                                    return;
                                            }
                                        }}>
                                            <FullscreenIcon/>
                                        </Box>
                                    }
                                    {
                                        item.category === 'video' &&  
                                        <video src={item.preview} width={270} height={400} controls/>
                                    }
                                    {
                                        item.category === 'image' && <Box sx={{display : 'flex', alignItems : 'center', justifyContent : 'center', 
                                        width : '270px', height : '400px'}}>
                                            <img src={item.preview} 
                                                width={268}
                                                height={398}
                                                style={{borderRadius : '10px'}}
                                            />

                                            {/* <VideoToCanvas
                                                videoInfo = {{
                                                    videoUrl : item?.preview,
                                                    videoId : uuidv4()
                                                }}

                                                width={268}
                                                height={398}

                                                selected={false}
                                                normalColor={'#ffffff00'}
                                                selectedColor={theme.palette.green.G200}
                                                backgroundColor={'linear-gradient(135deg, #e52d65 0%, #629df6 53.09%, #3c1d9d 100%) !important'}
                                            /> */}
                                        </Box>
                                    }
                                    {
                                        item.category === 'pdf' && <PdfPreview
                                            previewUrl={item.preview}
                                            width={270}
                                            height={400}
                                        />
                                    }
                                    {
                                        item.category === 'docx' && <DocxPreview
                                            previewUrl={item.preview}
                                            width={270}
                                            height={400}
                                            key={uuidv4()+index+uuidv4()}
                                            activeIndex={curSolsIndex}
                                            selfIndex={index}
                                            forceHide={openDocx}
                                        />
                                    }
                                    {
                                        item.category === 'doc' && <DocPreview
                                            previewUrl={item.preview}
                                            width={270}
                                            height={400}
                                        />
                                    }
                                </SwiperSlide>
                            })
                        }
                    </Swiper>
                    <Grid container sx={{fontSize : '16px', mt : '20px'}}>
                        <Grid item xs={12} sx={{textAlign : 'center'}}>
                            <Box >
                                { 
                                    curSolsIndex < externalsForUpload.length ? externalsForUpload[curSolsIndex]?.name : solsForUpload[curSolsIndex - externalsForUpload.length]?.name 
                                }.
                                {
                                    curSolsIndex < externalsForUpload.length ? externalsForUpload[curSolsIndex]?.category : solsForUpload[curSolsIndex - externalsForUpload.length]?.category
                                }
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container sx={{mt : '30px'}}>
                <Grid item xs={12} sx={{display : 'flex', justifyContent : 'center'}}>
                    <Box sx={{width : '90%'}}>
                        <ProgressBar
                            className="space"
                            label={`${uploadedCount} / ${solsForUpload.length + externalsForUpload.length}`}
                            progressColor={"green"}
                            darkTheme
                            score={totalProgress}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} sx={{paddingLeft : '20px', paddingRight: '20px', paddingBottom : '20px'}}>
                    <StepperControl 
                        activeStep={activeStep}
                        handleBack={handleBack}
                        handleContinue={handleContinue}

                        disableContinue={false}
                        finalStep={true}
                    />
                </Grid>
            </Grid>

            <PdfFullScreen 
                open={openPdf}
                previewUrl={openPdfPath}
                handleClose={setOpenPdf}
            />
            <DocxFullScreen 
                open={openDocx}
                previewUrl={openDocxPath}
                handleClose={setOpenDocx}
            />
            <ImageFullScreen
                open={openImage}
                previewUrl={openImagePath}
                handleClose={setOpenImage}
            />
        </Box>
    )
}
UploadCheckOut.propTypes = {
    UserAccountInfo : PropTypes.func.isRequired,
    UploadLegens : PropTypes.func.isRequired,
    UploadRares : PropTypes.func.isRequired,
    UploadRecurrings : PropTypes.func.isRequired,
    UploadFrees : PropTypes.func.isRequired,
    UploadLoading : PropTypes.func.isRequired,

    LoadingProductsList : PropTypes.func.isRequired,
    UserAllProducts : PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    hostId : state.profile.hostId,
    joinedDate : state.profile.joinedDate,
    profileLink : state.profile.profileLink,

    productName : state.upload.productName,
    legenResell : state.upload.legenResell,

    solsForUpload : state.upload.solsForUpload,
    externalsForUpload : state.upload.externalsForUpload,
    solsPriceType : state.upload.solsPriceType,
    solsProductType : state.upload.solsProductType,
    solsProductDescription : state.upload.solsProductDescription,

    legenProductPrice : state.upload.legenProductPrice,
    legenTicketPrice : state.upload.legenTicketPrice,
    legenPriceUnit : state.upload.legenPriceUnit,
    legenTicketUnit : state.upload.legenTicketUnit,
    legenTicketCount : state.upload.legenTicketCount,
    legenRoyalty : state.upload.legenRoyalty,
    legenStripeCard : state.upload.legenStripeCard,

    rareBiddingPrice : state.upload.rareBiddingPrice,
    rareBiddingUnit : state.upload.rareBiddingUnit,
    rareAvailableItems : state.upload.rareAvailableItems,
    rareRoyalty : state.upload.rareRoyalty,
    rareStripeCard : state.upload.rareStripeCard,
    rareListingTime : state.upload.rareListingTime,
    rareUnlimited : state.upload.rareUnlimited,

    recurringSubscriptionPrice: state.upload.recurringSubscriptionPrice,
    recurringPriceUnit : state.upload.recurringPriceUnit,
    recurringReleaseDate : state.upload.recurringReleaseDate,

    freeSubscriptionPrice : state.upload.freeSubscriptionPrice,
    freePriceUnit : state.upload.freePriceUnit,
    freeReleaseDate : state.upload.freeReleaseDate,

    uploadedProduct : state.upload.uploadedProduct,
    uploadedCount : state.upload.uploadedCount,
    totalProgress: state.upload.totalProgress,
    uploadLoading : state.upload.uploadLoading,
})
const mapDispatchToProps = {
    UserAccountInfo,
    UploadLegens,
    UploadRares,
    UploadRecurrings,
    UploadFrees,
    UploadLoading,

    LoadingProductsList,
    UserAllProducts
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadCheckOut) ;     