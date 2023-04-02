import * as React from 'react' ;

import { useLocation } from 'react-use' ;
import { useNavigate } from 'react-router-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { LoadingSellerProductsList, SellerAllProducts } from '../../redux/actions/link' ;
import  { ConnectLinkToAccount } from '../../redux/actions/auth' ;

import DetailListItem from '../../components/ProfileLink/DetailListItem';
import ProfileInfoBox from '../../components/ProfileLink/ProfileInfoBox';
import BuyProduct from '../../components/ProfileLink/BuyProduct';

import VideoToCanvas from '../../components/Common/VideoToCanvas';
import ImageToCanvas from '../../components/Common/ImageToCanvas';
import PdfPreview from '../../components/Common/PdfPreview';
import DocxPreview from '../../components/Common/DocxPreview';

import MessageModal from '../../components/Modals/MessageModal';

import EmptyTrashImage from '../../assets/profile/EmptyTrash.png';
import EmptyCartImage from '../../assets/profile/EmptyCart.png';
import DocumentImage from '../../assets/common/Document.svg' ;

import { convertObjToString, getCookie, getPriceType, getProductId, getUuid , eraseCookie} from '../../utils/Helper';

import { v4 as uuidv4 } from 'uuid' ;

import Loading from 'react-loading-components' ;

import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { EffectCoverflow, Pagination } from "swiper";

import 'swiper/swiper.min.css';
import 'swiper/modules/free-mode/free-mode.min.css';
import 'swiper/modules/thumbs/thumbs.min.css';

import {
    Box,
    Grid,
    Button,
    useMediaQuery
} from '@mui/material';

import { useTheme } from '@mui/styles';
import { useStyles } from './StylesDiv/ProfileLink.styles';

const ProfileLinkScreen = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;
    const location = useLocation() ;
    const navigate = useNavigate() ;

    const match1175 = useMediaQuery('(min-width : 1000px)') ;

    const {
        accountName,
        fullName,
        joinedDate,
        hostId,
        profileMessage,
        productsList,
        loadingProductsList,

        ConnectLinkToAccount,
        SellerAllProducts,
        LoadingSellerProductsList,
    } = props;

    const [swiperCtrl, setSwiperCtrl] = React.useState(null) ;

    const [currentProduct, setCurrentProduct] = React.useState(0);
    const [currentSol, setCurrentSol] = React.useState(0) ;
    const [currentProductType, setCurrentProductType] = React.useState(null) ;
    const [listType, setListType] = React.useState(1) ;
    const [filterListByType, setFilterListByType] = React.useState(null) ;
    
    const [openMessageModal, setOpenMessageModal] = React.useState(false) ;

    const handleOpenMessageModal = () => {
        setOpenMessageModal(true) ;
    }

    const handleCloseMessageModal = async () => {
        await ConnectLinkToAccount(location.pathname) ;
        setOpenMessageModal(false) ;
        navigate('/auth/') ;
    }

    const handleOpenProfilePhotoModal = () => {
        setOpenProfilePhotoModal(true) ;
    }
    const handleCloseProfilePhotoModal = () => {
        setOpenProfilePhotoModal(false) ;
    }

    const handleChangeListType = () => {
        if(listType === 1) setListType(2);
        else setListType(1);
    }

    React.useEffect(() => {
        swiperCtrl?.slideTo(currentSol) ;
    }, [currentSol]) ;

    React.useEffect(async () => {
        await LoadingSellerProductsList(true) ;
        await SellerAllProducts() ;
        await LoadingSellerProductsList(false) ;
    }, []) ;

    React.useEffect(async () => {
        let temp1 = [...productsList.filter(product => product.product_type === currentProductType)] ;
        setFilterListByType(temp1) ;
    }, [currentProductType, productsList]) ;


    React.useEffect(() => {
        if(!getCookie('_SOLSTICE_BUYER')) {
            // handleOpenMessageModal(true) ;
        }
    }, []) ;

    return (
        <Box className={classes.root}>
            <Grid container className={classes.container} >
                <Box className={classes.rectBackground} />
                <Grid container>
                    <Grid item xs={ match1175 ?  6 : 11.9 } sx={{position : 'relative', height : match1175 ? '100%' : 'auto',display : 'flex', flexDirection : 'column !important', justifyContent : 'space-between'}}>
                        <ProfileInfoBox 
                            listType={listType}
                            handleChangeListType={handleChangeListType}

                            currentProductType={currentProductType}
                            handleCurrentProductType={setCurrentProductType}

                            handleClickProfile={handleOpenProfilePhotoModal}
                        />
                        <Box className={classes.greenBlur} />
                    </Grid>
                    {
                        match1175 && <Grid item xs={ 6 } sx={{height : match1175 ? '100%' : 'auto',  display : 'flex', flexDirection : 'column !important', justifyContent : 'space-around', pt:'30px', pb : '20px'}}>
                            <Box className={classes.messageDiv} sx={{marginLeft : '35px', marginRight:'50px',}}>
                                <pre className={classes.preDiv}>{profileMessage || ""}</pre>
                            </Box>
                            <Box>
                                <Box className={classes.slashDiv}>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Box >// Host ID : <br/>{hostId}</Box>
                                        </Grid>
                                        <Grid item xs={6}>// Joined : <br/>{joinedDate}</Grid>
                                    </Grid>
                                </Box>
                                <Box className={classes.slashDiv}>
                                    <Grid container>
                                        <Grid item xs={6} >// {filterListByType?.[currentProduct]?.product_name || filterListByType?.[currentProduct]?.product_name ||"Unknown"} : <br/>{filterListByType?.[currentProduct]?.sols[currentSol]?.name || "Unknown"}</Grid>
                                        <Grid item xs={6}>// Release Date : <br/>
                                            {
                                                filterListByType?.[currentProduct]?.price_type === 'free' && <>
                                                    { new Date(filterListByType?.[currentProduct]?.release_date).toLocaleDateString() }
                                                </>
                                            }
                                            {
                                                filterListByType?.[currentProduct]?.price_type === 'recurring' && <>
                                                    { new Date(filterListByType?.[currentProduct]?.release_date).toLocaleDateString() }
                                                </>
                                            }
                                            {
                                                filterListByType?.[currentProduct]?.price_id === 2 && <>
                                                    {new Date(filterListByType?.[currentProduct]?.created_at).toLocaleDateString()}
                                                    new Date(filterListByType?.[currentProduct]?.created_at).
                                                </>
                                            }
                                            {
                                                filterListByType?.[currentProduct]?.price_id === 1 && <>
                                                    {new Date(filterListByType?.[currentProduct]?.created_at).toLocaleDateString()}
                                                </>
                                            }
                                        </Grid>
                                    </Grid>
                                </Box>        
                            </Box>
                        </Grid>
                    }
                </Grid>
                <Grid container>
                    <Grid item xs={match1175 ? 6 : 12} sx={{position :'relative',height : '500px', display : 'flex', alignItems : 'center', justifyContent : 'center', borderRight : ( loadingProductsList || !filterListByType?.length ) && '1px solid lightgray'}}>
                        {
                           ( loadingProductsList || !filterListByType )? 
                            (
                                listType === 1 ? <Loading type='grid' width={50} height={50} fill='#43D9AD' />
                                : <Loading type='three_dots' width={50} height={50} fill='#43D9AD' />
                            )
                            : (

                                filterListByType.length ? <Box className={listType === 1 ? classes.productThumbDiv : classes.productDetailsDiv} sx={{height : '470px',}}>
                                    {
                                        listType === 1 && filterListByType.map((product, index) => {
                                            return (
                                                <Box className={classes.productItem}  key={index} onClick={() => setCurrentProduct(index)}>
                                                    <Box className={classes.hoveringDiv}>
                                                        {
                                                            product.sols[0]?.category === 'video' ?  <VideoToCanvas
                                                                videoInfo = {{
                                                                    videoUrl : product.sols[0]?.path,
                                                                    videoId : product.sols[0]?.id+"first"
                                                                }}

                                                                width={170}
                                                                height={140}

                                                                selected={index === currentProduct}
                                                                normalColor={theme.palette.green.G200}
                                                                selectedColor={'rgb(173 86 161 / 89%)'}
                                                                /> 
                                                            : product.sols[0]?.category  === 'image' ? <ImageToCanvas
                                                                    imageInfo = {{
                                                                        imageUrl : product.sols[0]?.path,
                                                                        imageId : product.sols[0]?.id+"first"
                                                                    }}

                                                                    width={170}
                                                                    height={140}

                                                                    selected={index === currentProduct}
                                                                    normalColor={theme.palette.green.G200}
                                                                    selectedColor={'rgb(173 86 161 / 89%)'}
                                                            /> 
                                                            : new String("application/pdf,application/doc,application/docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document").search(product.sols[0]?.type) >= 0  ? 
                                                                <Box className={classes.itemDiv} sx={{border : index === currentProduct && '3px solid #ad56a1e3 !important'}}>
                                                                    <img src={DocumentImage} width={100} height={100} />
                                                                </Box>
                                                            : <></> 
                                                        }
                                                       
                                                    </Box>
                                                    <Box className={classes.productItemLabel}>
                                                        { product?.name || product?.product_name }
                                                    </Box>
                                                </Box>
                                            )
                                        })
                                    }
                                    {
                                        listType === 2 && filterListByType.map((product, index) => {
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
                                : <Box className={classes.emptyDiv}>
                                    <Box><img src={EmptyCartImage} width={60} /></Box>
                                    <Box>No Products</Box>
                                </Box>
                            )
                        }
                        <Box className={classes.blueBlur} />
                    </Grid>
                    {
                        !match1175 && <Grid item xs={ match1175 ? 6 : 12} sx={{height : match1175 ? '100%' : 'auto',  display : 'flex', flexDirection : 'column !important', justifyContent : 'space-around', pt:'30px', pb : '20px', borderTop : '1px solid lightgray', ml : '20px', mr : '20px'}}>
                            <Box>
                                <Box className={classes.slashDiv}>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Box >// Host ID: <br/>{hostId}</Box>
                                        </Grid>
                                        <Grid item xs={6}>// Joined: <br/> {joinedDate}</Grid>
                                    </Grid>
                                </Box>
                                <Box className={classes.slashDiv}>
                                    <Grid container>
                                        <Grid item xs={6} >// {filterListByType?.[currentProduct]?.name || filterListByType?.[currentProduct]?.product_name} : <br/>{filterListByType?.[currentProduct]?.sols[currentSol]?.name}</Grid>
                                        <Grid item xs={6}>// Release Date: <br/>
                                            {
                                                filterListByType?.[currentProduct]?.price_type === 'free' && <>
                                                    { new Date(filterListByType?.[currentProduct]?.release_date).toLocaleDateString() }
                                                </>
                                            }
                                            {
                                                filterListByType?.[currentProduct]?.price_type === 'recurring' && <>
                                                    { new Date(filterListByType?.[currentProduct]?.release_date).toLocaleDateString() }
                                                </>
                                            }
                                            {
                                                filterListByType?.[currentProduct]?.price_id === 1 && <>
                                                    {new Date(filterListByType?.[currentProduct]?.created_at).toLocaleDateString()}
                                                </>
                                            }
                                            {
                                                filterListByType?.[currentProduct]?.price_id === 2 && <>
                                                    {new Date(filterListByType?.[currentProduct]?.created_at).toLocaleDateString()}
                                                </>
                                            }
                                            {
                                                !filterListByType?.[currentProduct]?.price_id && "Unknown"
                                            }
                                        </Grid>
                                    </Grid>
                                </Box>        
                            </Box>
                        </Grid>
                    }
                    <Grid item xs={match1175 ? 6 : 12} sx={{overflowX : 'hidden', display : 'flex', flexDirection : 'column', justifyContent : 'space-between', }}>
                        <Box className={classes.productItemDescription}>
                            { loadingProductsList ? `. . . Loading [ ${ currentProductType } ] Sols` : filterListByType?.[currentProduct]?.name }
                        </Box>
                        <Box className={classes.swiperDiv}>
                            {
                                !loadingProductsList ? 
                                (
                                    filterListByType?.[currentProduct] ? <Box >
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
                                                filterListByType?.[currentProduct]?.sols.map((sol, index) => {
                                                    return (
                                                        <SwiperSlide key={index}>
                                                            {
                                                                sol?.category === 'video' ? <VideoToCanvas

                                                                    videoInfo={{
                                                                        videoUrl : sol.path ,
                                                                        videoId : sol.id
                                                                    }}

                                                                    width={245}
                                                                    height={290}

                                                                    selected={false}
                                                                    normalColor={theme.palette.green.G200}
                                                                /> 
                                                                : sol?.category === 'image' ? <ImageToCanvas

                                                                    imageInfo={{
                                                                        imageUrl : sol.path ,
                                                                        imageId : sol.id
                                                                    }}

                                                                    width={245}
                                                                    height={290}

                                                                    selected={false}
                                                                    normalColor={theme.palette.green.G200}
                                                                />
                                                                : sol?.category === 'pdf' ? <Box className={classes.slideDiv}>
                                                                        <PdfPreview
                                                                            previewUrl={sol.path}
                                                                            width={245}
                                                                            height={290}
                                                                        /> 
                                                                    </Box>
                                                                : new String("application/doc,application/docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document").search(sol.type) >=0 ?<Box className={classes.slideDiv} >
                                                                        <DocxPreview
                                                                            previewUrl={sol.path}
                                                                            width={241}
                                                                            height={286}
                                                                            key={uuidv4()}
                                                                            activeIndex={index}
                                                                            selfIndex={currentSol}
                                                                        />
                                                                    </Box>
                                                                : <></>
                                                            }
                                                        </SwiperSlide>
                                                    )
                                                })
                                            }
                                        </Swiper>
                                    </Box> : 
                                    <Box className={classes.emptyDiv}>
                                        <Box><img src={EmptyTrashImage} width={60} /></Box>
                                        <Box>No sols</Box>
                                    </Box>
                                )
                                : <Box sx={{width : '100%', height : '100%', display : 'flex', alignItems : 'center', justifyContent : 'center'}}>
                                      <Loading type='three_dots' width={50} height={50} fill='#43D9AD' />
                                </Box>
                            }
                        </Box>
                        <Box sx={{display : 'flex', justifyContent : 'center', marginTop : '20px'}}>
                            <Box className={classes.productFeatureDiv}>
                                Featuring&nbsp;
                                <Box className={classes.featureHighlight}>@{accountName || "Account name"}&nbsp;</Box>
                                <Box className={classes.featureHighlight} sx={{textTransform : 'capitalize', color : theme.palette.green.G200}}>
                                    @{getPriceType(filterListByType?.[currentProduct]?.price_id) || filterListByType?.[currentProduct]?.price_type || "Typedef" }&nbsp;
                                </Box>
                                <Box className={classes.featureHighlight}>@{fullName || 'Full name'}&nbsp;</Box>
                            </Box>
                        </Box>
                        <Box className={classes.buttonGroup}>
                            <BuyProduct 
                                productInfo={filterListByType?.[currentProduct]}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <MessageModal 
                title={'Please connect your SOLSTICE account'}
                type={'info'}
                message={'By connecting link to your SOLSTICE account, you can purchase NFTs.'}

                open={openMessageModal}
                handleClose={handleCloseMessageModal}
            />
        </Box>
    )
}
ProfileLinkScreen.propTypes = {
    LoadingSellerProductsList : PropTypes.func.isRequired,
    ConnectLinkToAccount: PropTypes.func.isRequired,
    SellerAllProducts : PropTypes.func.isRequired
}
const mapStateToProps  = state => ({
    fullName : state.link.fullName,
    accountName : state.link.accountName,
    joinedDate : state.link.joinedDate,
    profilePictureUrl : state.link.profilePictureUrl,
    hostId : state.link.hostId,
    profileMessage : state.link.profileMessage,
    loadingProductsList : state.link.loadingProductsList,

    productsList : state.link.productsList,
}) ;
const mapDispatchToProps = {
    LoadingSellerProductsList,
    SellerAllProducts,
    ConnectLinkToAccount
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileLinkScreen) ;