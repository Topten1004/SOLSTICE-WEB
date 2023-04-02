import * as React from 'react' ;

import { useNavigate } from 'react-router-dom' ;
import { useLocation } from 'react-use' ;

import { useWalletInfo } from '../../../contexts/WalletContext' ;
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SaveNewMessage, LoadingProductsList, UserAllProducts } from '../../../redux/actions/profile';

import { getPriceType,getProductId, getUuid, getCookie } from '../../../utils/Helper';

import DetailListItem from '../../../components/Solstice/ProfileScreen/DetailListItem';

import Loading from 'react-loading-components' ;

import EmptyTrashImage from '../../../assets/profile/EmptyTrash.png';
import EmptyCartImage from '../../../assets/profile/EmptyCart.png';
import LockImage from '../../../assets/profile/Lock.png';
import DocumentImage from '../../../assets/common/Document.svg' ;
import DownloadImage from '../../../assets/common/Download.png' ;


import SaveIcon from '@mui/icons-material/Save';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

import SettingBox from '../../../components/Solstice/ProfileScreen/SettingBox';
import SendLinkModal from '../../../components/Solstice/ProfileScreen/SendLinkModal';

import VideoToCanvas from '../../../components/Common/VideoToCanvas';
import ImageToCanvas from '../../../components/Common/ImageToCanvas';
import PdfPreview from '../../../components/Common/PdfPreview';
import DocxPreview from '../../../components/Common/DocxPreview';
import PdfFullScreen from '../../../components/Common/PdfFullScreen';
import DocxFullScreen from '../../../components/Common/DocxFullScreen';
import ImageFullScreen from '../../../components/Common/ImageFullScreen';
import VideoForm from '../../../components/Common/VideoForm';
import EditProductModal from '../../../components/Solstice/ProfileScreen/EditProductModal';

import { v4 as uuidv4 } from 'uuid';
import bcryptJs from 'bcryptjs' ;
import FileSaver from 'file-saver';

import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { EffectCoverflow, Pagination } from "swiper";

import 'swiper/swiper.min.css';
import 'swiper/modules/free-mode/free-mode.min.css';
import 'swiper/modules/thumbs/thumbs.min.css';

import {
    Box,
    Grid,
    Button,
    TextField,
    Tooltip,
    useMediaQuery
} from '@mui/material';

import { useTheme } from '@mui/styles';
import { useStyles } from './StylesDiv/index.styles' ;
import DocPreview from '../../../components/Common/DocPreview';

const ProfileScreen = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;
    const location = useLocation() ;
    const navigate = useNavigate() ;
    
    const match1175 = useMediaQuery('(min-width : 1175px)') ;
    const match1445 = useMediaQuery('(min-width : 1445px)') ;

    const {
        accountName,
        fullName,
        profilePictureUrl,
        joinedDate,
        hostId,
        stripe_account_id,
        
        profileMessage,
        loadingProductsList,
        productsList,

        SaveNewMessage,
        LoadingProductsList,
        UserAllProducts
    } = props;

    const [swiperCtrl, setSwiperCtrl] = React.useState(null) ;
    const [currentProduct, setCurrentProduct] = React.useState(0);
    const [currentSol, setCurrentSol] = React.useState(0) ;
    const [currentProductType, setCurrentProductType] = React.useState(null) ;
    const [newMessage, setNewMessage] = React.useState('') ;
    const [listType, setListType] = React.useState(1) ;
    const [filterList, setFilterList] = React.useState(null) ;

    const [openSendLinkModal, setOpenSendLinkModal] = React.useState(false) ;
    const [openEditProductModal, setOpenEditProductModal] = React.useState(false) ;

    const [openPdf, setOpenPdf] = React.useState(false) ;
    const [openPdfPath, setOpenPdfPath] = React.useState(null) ;

    const [openDocx, setOpenDocx] = React.useState(false) ;
    const [openDocxPath, setOpenDocxPath] = React.useState(null) ;
    
    const [openImage, setOpenImage] = React.useState(false) ;
    const [openImagePath, setOpenImagePath] = React.useState(false) ;

    const handleOpenEditProductModal = () => {
        setOpenEditProductModal(true) ;
    }

    const handleCloseEditProductModal = () => {
        setOpenEditProductModal(false) ;
    }

    const handleOpenSendLinkModal = () => {
        setOpenSendLinkModal(true) ;
    }

    const handleCloseSendLinkModal = () => {
        setOpenSendLinkModal(false) ;
    }

    const handleChangeListType = () => {
        if(listType === 1) setListType(2);
        else setListType(1);
    }

    const handleDownloadSol = (url, name) => {
        try {
            console.log(url, name) ;
            FileSaver.saveAs(url, name) ;
        } catch(err) {
            console.log(err) ;
            return false ;
        }
    }

    const handleProductPage = async () => {
        bcryptJs.genSalt(10, (err, salt) => {
            bcryptJs.hash(filterList[currentProduct]?.creator_id, salt, function(err, hash) {
                if(err) console.log(err) ;
                else window.open(location.origin + "/product-link?owner="+ hash + "&id=" + filterList[currentProduct]?.id, '_blank') ;
            });
        });
    }
    
    React.useEffect(() => {
    }, [location]) ;

    React.useEffect(() => {
        setNewMessage(profileMessage) ;
    }, [profileMessage]);

    React.useEffect(() => {
        swiperCtrl?.slideTo(currentSol) ;
    }, [currentSol]) ;

    React.useEffect(async () => {
        await LoadingProductsList(true) ;
        await UserAllProducts() ;
        await LoadingProductsList(false) ;
    },[]) ;

    React.useEffect(async () => {
        let temp1 = [...productsList.filter(product => product.product_type === currentProductType)] ;
        
        setFilterList(temp1) ;
    }, [currentProductType, productsList]) ;

    return (
        <Box className={classes.root}>
            <Grid container className={classes.container} >
                <Grid container>
                    {
                        !match1175 && <Grid item xs={ match1175 ? 6 : 12} sx={{height : match1175 ? '100%' : 'auto',  display : 'flex', flexDirection : 'column !important', justifyContent : 'space-around', pt:'30px', pb : '20px'}}>
                            <Box className={classes.messageDiv} sx={{marginLeft : '10px', marginRight:'10px', marginBottom : '10px'}}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={7}
                                    placeholder="Hello, there.
                                    . 
                                    . 
                                    .  
                                    ...... You can leave message here."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                    <Tooltip title={!newMessage === profileMessage ? 'Save New Message' : 'Profile Message'}>
                                        <Box className={classes.messageIconCss} onClick={() => SaveNewMessage(newMessage)}>
                                            {
                                                newMessage === profileMessage ? <DoneAllIcon sx={{color : 'lightgreen', fontSize : '25px', cursor : 'pointer'}}/>
                                                :<SaveIcon sx={{color : "lightgreen", fontSize : '30px', cursor : 'pointer'}}/>
                                            }
                                        </Box>
                                    </Tooltip>

                            </Box>
                        </Grid>
                    }
                    <Grid item xs={ match1175 ?  6 : 11.9 } sx={{position : 'relative', height : match1175 ? '100%' : 'auto',display : 'flex', flexDirection : 'column !important', justifyContent : 'space-between'}}>
                        <SettingBox 
                            listType={listType}
                            handleChangeListType={handleChangeListType}

                            currentProductType={currentProductType}
                            handleCurrentProductType={setCurrentProductType}
                        />
                        <Box className={classes.greenBlur} />
                    </Grid>
                    {
                        match1175 && <Grid item xs={ 6 } sx={{height : match1175 ? '100%' : 'auto',  display : 'flex', flexDirection : 'column !important', justifyContent : 'space-around', pt:'30px', pb : '20px'}}>
                            <Box className={classes.messageDiv} sx={{marginLeft : '35px', marginRight:'50px',}}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={7}
                                    placeholder="Hello, there.
                                    . 
                                    . 
                                    .  
                                    ...... You can leave message here."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <Tooltip title={!newMessage === profileMessage ? 'Save New Message' : 'Profile Message'}>
                                    <Box className={classes.messageIconCss} onClick={() => SaveNewMessage(newMessage)}>
                                        {
                                            newMessage === profileMessage ? <DoneAllIcon sx={{color : 'lightgreen', fontSize : '25px', cursor : 'pointer'}}/>
                                            :<SaveIcon sx={{color : "lightgreen", fontSize : '30px', cursor : 'pointer'}}/>
                                        }
                                    </Box>
                                </Tooltip>

                            </Box>
                            <Box className={classes.slashDiv} sx={{marginLeft : '35px',}}>
                                <Grid container spacing={0.5}>
                                    <Grid item xs={match1445 ? 6 : 12}>
                                        <Box >// Host ID : {hostId} </Box>
                                    </Grid>
                                    <Grid item xs={match1445 ? 6 : 12}>
                                        <Box>// Joined : {joinedDate}</Box>
                                    </Grid>
                                    <Grid item xs={match1445 ? 6 : 12}>
                                        <Box>// Released : 
                                            {
                                                filterList?.[currentProduct] ? new Date(filterList?.[currentProduct]?.created_at).toLocaleDateString()
                                                : ' ???? '
                                            }
                                        </Box>
                                    </Grid>
                                    <Grid item xs={match1445 ? 6 : 12} >
                                        <Box>
                                            // {filterList?.[currentProduct]?.name || filterList?.[currentProduct]?.product_name || " ???? "} : 
                                            {filterList?.[currentProduct]?.sols[currentSol]?.name || " ????"}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    }
                </Grid>
                <Grid container>
                    <Grid item xs={match1175 ? 6 : 12} sx={{position :'relative',height : '500px', display : 'flex', alignItems : 'center', justifyContent : 'center', borderRight : (loadingProductsList || !filterList?.length) && '1px solid lightgray'}}>
                        {
                            (loadingProductsList || !filterList) ? 
                            (
                                listType === 1 ? <Loading type='grid' width={50} height={50} fill='#43D9AD' />
                                : <Loading type='ball_triangle' width={50} height={50} fill='#43D9AD' />
                            )
                            : (

                                filterList.length ? <Box className={listType === 1 ? classes.productThumbDiv : classes.productDetailsDiv} sx={{height : '470px',}}>
                                    {
                                        listType === 1 && filterList.map((product, index) => {
                                            return (
                                                <Box className={classes.productItem} key={index} >
                                                    <Box className={classes.hoveringDiv} onClick={() => setCurrentProduct(index)}>
                                                        {
                                                            <>
                                                                {
                                                                    product.sols[0]?.category === 'video' &&
                                                                    <video src={product.sols[0]?.path} className={index === currentProduct ? classes.productThumbActive : classes.productThumb} />
                                                                }
                                                                {
                                                                    product.sols[0]?.category === 'image' && <Box className={index === currentProduct ? classes.productThumbActive : classes.productThumb}>
                                                                        <img src={product.sols[0]?.path} 
                                                                            width={162}
                                                                            height={122}
                                                                        />
                                                                    </Box>
                                                                }
                                                                {
                                                                    ( product.sols[0]?.category === 'docx' || product.sols[0]?.category === 'pdf'  || product.sols[0]?.category === 'doc' )  
                                                                    && <Box className={index === currentProduct ? classes.productThumbActive : classes.productThumb}>
                                                                        <img src={DocumentImage} width={64} height={64} />
                                                                    </Box>
                                                                }
                                                            </>
                                                        }
                                                    </Box>
                                                    <Box className={classes.productItemLabel}>
                                                        { product.name || product.product_name}
                                                    </Box>
                                                </Box>
                                            )
                                        })
                                    }
                                    {
                                        listType === 2 && filterList.map((product, index) => {
                                            return (
                                                <DetailListItem
                                                    key={index}
                                                    productName = {product?.name || product?.product_name}
                                                    productSelected={currentProduct === index}
                                                    productIndex={index}
                                                    solIndex={currentSol}
                                                    sols={product.sols}
                                                    handleCurrentProduct={setCurrentProduct}
                                                    handleCurrentSol={setCurrentSol}
                                                />
                                            )
                                        })
                                    }
                                </Box>
                                :  <Box className={classes.emptyDiv}>
                                    <Box><img src={EmptyCartImage} width={60} /></Box>
                                    <Box>No Products</Box>
                                </Box>
                            )
                        }
                        <Box className={classes.blueBlur} />
                    </Grid>
                    {
                        !match1175 && <Grid item xs={ match1175 ? 6 : 12} sx={{height : match1175 ? '100%' : 'auto',  display : 'flex', flexDirection : 'column !important', justifyContent : 'space-around', pt:'30px', pb : '20px', borderTop : '1px solid lightgray'}}>
                            <Box className={classes.slashDiv}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Box >// Host ID : {hostId} </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box>// Joined : {joinedDate}</Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box>// Released : 
                                        {new Date(filterList?.[currentProduct]?.created_at).toLocaleDateString()}</Box>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Box>
                                            // {filterList?.[currentProduct]?.name || filterList?.[currentProduct]?.product_name || "Name "} : 
                                            {filterList?.[currentProduct]?.sols[currentSol]?.name || "Unknown"}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    }
                    <Grid item xs={match1175 ? 6 : 12} sx={{overflowX : 'hidden', display : 'flex', flexDirection : 'column', justifyContent : 'space-between', height : '500px', }}>
                        <Box className={classes.productItemDescription}>
                            { ( loadingProductsList && filterList?.length ) ? `. . . Loading < ${ currentProductType } > Sols` : filterList?.[currentProduct]?.product_name }
                        </Box>
                        <Box className={classes.swiperDiv} >
                            {
                                !loadingProductsList ? 
                                (
                                    filterList?.[currentProduct] ? <Box sx={{position : 'absolute'}}>
                                        <Swiper
                                            effect={"coverflow"}
                                            grabCursor={true}
                                            centeredSlides={true}
                                            slidesPerView={"auto"}
                                            coverflowEffect={{
                                                rotate: 50,
                                                stretch: 0,
                                                modifier: 1,
                                            }}
                                            modules={[EffectCoverflow, Pagination]}
                                            className="mySwiper"
                                            onSlideChange={(e) => setCurrentSol(e.activeIndex)}
                                            onSwiper={setSwiperCtrl}
                                            
                                        >
                                            {
                                                filterList?.[currentProduct]?.sols.map((sol, index) => {
                                                    return (
                                                        <SwiperSlide key={index}>
                                                            <>
                                                                {
                                                                    sol?.category === 'video' ? (
                                                                        <video src={sol.path} 
                                                                            controls
                                                                        />
                                                                    )
                                                                    : sol?.category === 'image' ? <Box className={classes.slideDiv}>
                                                                        <img src={sol.path} width={'100%'} height={'100%'} />
                                                                    </Box>
                                                                    : sol?.category === 'pdf' ? <Box className={classes.slideDiv}>
                                                                        <PdfPreview
                                                                            previewUrl={sol.path}
                                                                            width={246}
                                                                            height={296}
                                                                        /> 
                                                                        <Tooltip title={"Download " + sol.name}>
                                                                            <Box className={classes.downloadDiv} onClick={() => handleDownloadSol(sol.path, sol.name+".pdf")}>
                                                                                <img src={DownloadImage} width={30} height={30} />
                                                                            </Box>
                                                                        </Tooltip>
                                                                    </Box>
                                                                    : sol?.category ==='docx' ?<Box className={classes.slideDiv} >
                                                                        <DocxPreview
                                                                            previewUrl={sol.path}
                                                                            width={246}
                                                                            height={296}
                                                                            key={uuidv4()}
                                                                            activeIndex={index}
                                                                            selfIndex={currentSol}
                                                                            forceHide={openDocx}
                                                                        />
                                                                        <Tooltip title={"Download " + sol.name}>
                                                                            <Box className={classes.downloadDiv} onClick={() => handleDownloadSol(sol.path, sol.name+".docx")}>
                                                                                <img src={DownloadImage} width={30} height={30} />
                                                                            </Box>
                                                                        </Tooltip>
                                                                    </Box>
                                                                    : sol.category === 'doc' ? <DocPreview 
                                                                        previewUrl={sol.path}
                                                                        width={246}
                                                                        height={296}
                                                                    />
                                                                    : <></>
                                                                }
                                                                {
                                                                    (
                                                                        sol?.category === 'image' || 
                                                                        sol?.category === 'pdf' ||
                                                                        sol?.category === 'docx'
                                                                    ) &&
                                                                    <Box className={classes.fullIconDiv} onClick={() => {
                                                                        switch(sol?.category) {
                                                                            case 'docx' :
                                                                                setOpenDocx(true);
                                                                                setOpenDocxPath(sol.path) ;
                                                                                return ;
                                                                            case 'pdf' : 
                                                                                setOpenPdf(true);
                                                                                setOpenPdfPath(sol.path) ;
                                                                                return ;
                                                                            case 'image' :
                                                                                setOpenImage(true) ;
                                                                                setOpenImagePath(sol.path) ;
                                                                                return ;
                                                                            default :
                                                                                return;
                                                                        }
                                                                    }}>
                                                                        <FullscreenIcon/>
                                                                    </Box>
                                                                }
                                                            </>
                                                        </SwiperSlide>
                                                    )
                                                })
                                            }
                                        </Swiper>
                                    </Box> : 
                                    <Box className={classes.emptyDiv}>
                                        <Box><img src={EmptyTrashImage} width={40} /></Box>
                                        <Box>No Sols</Box>
                                    </Box>
                                )
                                : <Box>
                                      <Loading type='three_dots' width={50} height={50} fill='#43D9AD' />
                                </Box>
                            }
                        </Box>
                        <Box sx={{display : 'flex', justifyContent : 'center', marginTop : '20px'}}>
                            <Box className={classes.productFeatureDiv}>
                                Featuring&nbsp;
                                <Box className={classes.featureHighlight}>@{accountName || "Account name"}&nbsp;</Box>
                                <Box className={classes.featureHighlight} sx={{textTransform : 'capitalize'}}>
                                    @{getPriceType(filterList?.[currentProduct]?.price_id) || filterList?.[currentProduct]?.price_type ||  "Typedef"}&nbsp;
                                </Box>
                                <Box className={classes.featureHighlight}>
                                    @{fullName || 'Full name'}&nbsp;
                                </Box>
                            </Box>
                        </Box>
                        <Box className={classes.buttonGroup}>
                            {
                                filterList?.[currentProduct] && <Button variant={'contained'} className={classes.sendButtonCss} onClick={handleOpenSendLinkModal}>Send</Button>
                            }
                            {
                                filterList?.[currentProduct] && <Button variant={'contained'} className={classes.editButtonCss} onClick={handleOpenEditProductModal}>Edit</Button>
                            }
                            {   
                                filterList?.[currentProduct] && <Button variant={'contained'} className={classes.productButtonCss} sx={{mb : '10px'}} onClick={handleProductPage}>Product Page</Button>
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <SendLinkModal 
                open={openSendLinkModal}
                handleClose={handleCloseSendLinkModal}

                productInfo={filterList?.[currentProduct] || null}
                stripe_account_id={stripe_account_id}
            />
            <EditProductModal 
                open={openEditProductModal}
                handleClose={handleCloseEditProductModal}

                productInfo={filterList?.[currentProduct] || null}
            />
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
ProfileScreen.propTypes = {
    SaveNewMessage : PropTypes.func.isRequired,
    LoadingProductsList : PropTypes.func.isRequired,
    UserAllProducts : PropTypes.func.isRequired
}

const mapStateToProps  = state => ({
    fullName : state.profile.fullName,
    accountName : state.profile.accountName,
    joinedDate : state.profile.joinedDate,
    profilePictureUrl : state.profile.profilePictureUrl,
    hostId : state.profile.hostId,
    profileMessage : state.profile.profileMessage,
    stripe_account_id : state.profile.stripe_account_id,
    loadingProductsList : state.profile.loadingProductsList,
    productsList : state.profile.productsList
}) ;

const mapDispatchToProps = {
    SaveNewMessage,
    LoadingProductsList,
    UserAllProducts
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen) ;