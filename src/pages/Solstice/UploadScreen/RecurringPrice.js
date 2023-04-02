import React,{ useEffect, useState} from 'react' ;

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { InputRecurringPriceConfig } from '../../../redux/actions/upload';

import { isYoutubeUrl, getYoutubeId} from '../../../utils/Helper';
import {v4 as uuidv4} from 'uuid' ;

// import ETHIMAGE from '../../../assets/tokens/ETH.png' ;
// import SOLIMAGE from '../../../assets/tokens/SOL.png' ;
// import USDCIMAGE from '../../../assets/tokens/USDC.png' ;

import {
    Box,
    Grid,
    TextField,
    InputAdornment,
    useMediaQuery,
} from '@mui/material';

import CalendarModal from '../../../components/Modals/CalendarModal';
import StepperControl from '../../../components/Solstice/UploadScreen/StepperControl';
import PdfPreview from '../../../components/Common/PdfPreview';
import DocxPreview from '../../../components/Common/DocxPreview';
import PdfFullScreen from '../../../components/Common/PdfFullScreen';
import DocxFullScreen from '../../../components/Common/DocxFullScreen';
import ImageFullScreen from '../../../components/Common/ImageFullScreen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import DocPreview from '../../../components/Common/DocPreview';

import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { EffectCube, Pagination} from "swiper";

import 'swiper/swiper.min.css';
import 'swiper/modules/effect-cube/effect-cube.min.css' ;
  
import { useTheme } from '@mui/styles';
import { useStyles } from './StylesDiv/RecurringPrice.styles' ;

const RecurringPrice = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;

    const match1205 = useMediaQuery('(min-width : 1205px)') ;
    const match875 = useMediaQuery('(min-width : 875px)') ;
    
    const {
        handleChangeUploadStep,
        InputRecurringPriceConfig,

        solsForUpload,
        externalsForUpload,

        recurringSubscriptionPrice,
        recurringPriceUnit,
        recurringReleaseDate
    } = props;

    const [subscriptionPrice, setSubscriptionPrice] = useState('');
    const [recurringUnit, setRecurringUnit] = useState(0) ;
    const [curSolsIndex, setCurSolsIndex] = useState(0);
    const [selectedDay, setSelectedDay] = useState({year : new Date().getFullYear(), month : new Date().getMonth() + 1 , day : new Date().getDate()});
    const [openCalendarModal, setOpenCalendarModal] = useState(false) ;

    const [disableContinue, setDisableContinue] = useState(false) ;

    const [openPdf, setOpenPdf] = useState(false) ;
    const [openPdfPath, setOpenPdfPath] = useState(null) ;

    const [openDocx, setOpenDocx] = useState(false) ;
    const [openDocxPath, setOpenDocxPath] = useState(null) ;

    const [openImage, setOpenImage] = useState(false) ;
    const [openImagePath, setOpenImagePath] = useState(false) ;
 
    const handleChangeRecurringUnit = (recurringUnit) => {
        setRecurringUnit(recurringUnit) ;
    }
    
    const handleChangeSubscriptionPrice = (subscriptionPrice) => {
        setSubscriptionPrice(subscriptionPrice);
    }
    const handleChangeSelectedDay = (e) => {
        setSelectedDay(e);
    }
    const handleChangeSolsIndex = (solsIndex) => {
        setCurSolsIndex(solsIndex) ;
    }
    const handleChangeSwiper = (e) => {
        handleChangeSolsIndex(e.activeIndex);
    }

    const handleOpenCalendarModal = () => {
        setOpenCalendarModal(true) ;
    }
    const handleCloseCalendarModal =() => {
        setOpenCalendarModal(false) ;
    }

    const handleBack = () => {
        handleChangeUploadStep('price-config') ;
    }
    const handleContinue = () => {
        InputRecurringPriceConfig(subscriptionPrice, selectedDay, recurringUnit) ;
        handleChangeUploadStep('product-checkout') ;
    }

    useEffect(() => {
        handleChangeSubscriptionPrice(recurringSubscriptionPrice);
        handleChangeSelectedDay(recurringReleaseDate) ;
        handleChangeRecurringUnit(recurringPriceUnit) ;
    }, []);

    useEffect(() => {
        if(subscriptionPrice !== '' && subscriptionPrice !== '0' && selectedDay) setDisableContinue(false) ;
        else setDisableContinue(true) ;
    }, [subscriptionPrice, selectedDay]) ;

    return (
        <Box className={classes.root}>
            <Box className={classes.greenBlur} />
            <Box className={classes.blueBlur} />
            <Box className={classes.pageTitleDiv}>
                Pricing and Tool
            </Box>
            <Grid container>
                <Grid item xs={match1205 ? 6 : 12}>
                    <Box className={classes.typeDiv}>
                        <Box sx={{color :"#E0EF33" }}>Recurring: &nbsp;</Box>
                        <Box sx={{color : '#43D9AD'}}>Subscription based content packages</Box>
                    </Box>
                </Grid>
                <Grid item xs={match1205 ? 6 : 12}>
                    <Box className={classes.typeDiv}>
                        <Box sx={{color :"#338BEF" }}>Ticket: &nbsp;</Box>
                        <Box sx={{color : '#2196F3'}}>Ticketless content</Box>
                    </Box>
                </Grid>
            </Grid>
            <Grid container sx={{mt : '30px', mb : '20px'}}>
                <Grid item xs={match875 ? 6 : 12}>
                    <Box sx={{width : !match875 && '100%'}}>
                        <Box className={classes.priceCardTitle}>
                            Price per subscription
                        </Box>
                        <Box className={classes.priceCard}>
                            <Box>
                                <TextField
                                    placeholder='10.99'
                                    value={subscriptionPrice}
                                    type={'number'}
                                    onChange={(e) => handleChangeSubscriptionPrice(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {/* <FormControl variant="standard" className={classes.symbolDiv}>
                                                    <Select
                                                        disableUnderline
                                                        value={priceUnit}
                                                        onChange={(e) => handleChangePriceUnit(e.target.value)}
                                                        MenuProps={{
                                                            className : classes.selectDiv
                                                        }}
                                                    >
                                                        <MenuItem value={0}>
                                                            <img src={SOLIMAGE} width={30} height={30} style={{borderRadius : '50%'}}/>&nbsp;SOLT
                                                        </MenuItem>
                                                    </Select>
                                                </FormControl> */}
                                                <Box sx={{color : theme.palette.green.G200, fontSize : '25px'}}>
                                                    USD
                                                </Box>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={match875 ? 6 : 12} sx={{ display : 'flex', flexDirection : 'column', justifyContent : 'space-around'}}>
                    <Box sx={{color : "#43D9AD" }}>
                        <Box className={classes.priceCardTitle}>
                            Payment
                        </Box>
                        <Box className={classes.paymentDiv}>
                            Monthly
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Grid container >
                <Grid item xs={match875 ? 6 : 12}>
                    <Box >
                        <Box sx={{fontSize : 20, fontFamily : 'Montserrat', color : '#43D9AD', pb : '10px', width : 270, textAlign : match875 ? 'center' : 'left'}}>Select Release Date</Box>
                        <Box sx={{backgroundColor : 'rgba(51, 139, 239, 0.21)', height : '200px', width : match875 ? '270px' : '100%', borderRadius : '30px', display : 'flex', justifyContent : 'center'}}>
                            <Box className={classes.calendarDiv} onClick={handleOpenCalendarModal}>
                                {selectedDay ? selectedDay.day : new Date().getDate()}
                            </Box>
                        </Box>
                    </Box>
                    
                    <Box sx={{mt : '25px', fontFamily : 'Montserrat', color : '#43D9AD'}}>
                        <Box sx={{fontSize : 20, pb : '10px', width : match875 ? 270 : '100%', textAlign : match875 ? 'center' : 'left'}}>Distribution Schedule</Box>
                        <Box sx={{backgroundColor : 'rgba(51, 139, 239, 0.21)', height : '200px', width : match875 ? '270px' : '100%', borderRadius : '30px', display : 'flex', justifyContent : 'center'}}>
                            <Box sx={{alignSelf : 'center', fontSize : '40px'}}>Weekly</Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={match875 ? 6:  12} sx={{marginTop : !match875 && '30px'}}>
                    <Box >
                        <Box sx={{fontSize : 20, fontFamily : 'Montserrat', color : '#43D9AD', pb : '10px', width : 270, textAlign : match875 ? 'center' : 'left'}}>Content Release</Box>
                        <Box sx={{width : 250, height : 400}}>
                            <Swiper
                                effect={"cube"}
                                grabCursor={true}
                                cubeEffect={{
                                    slideShadows: true,
                                }}
                                pagination={true}
                                modules={[EffectCube, Pagination]}
                                onSlideChange={handleChangeSwiper}
                            >
                                {
                                    externalsForUpload.map((item, index) => {
                                        return  <SwiperSlide key={index}>
                                            <Box sx={{position : 'relative'}}>
                                                <Box sx={{zIndex : -100}}>
                                                    {
                                                        isYoutubeUrl(item.url) ? <YouTube videoId={getYoutubeId(item.url)} opts={{
                                                            height: 270,
                                                            width: 400,
                                                            playerVars: {
                                                                // https://developers.google.com/youtube/player_parameters
                                                                autoplay: 1,
                                                            }
                                                        }}/> :
                                                        <video src={item.url} width={270} height={400} style={{zIndex : -120}} controls/>
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
                                                            setOpenImage(true);
                                                        default :
                                                            return;
                                                    }
                                                }}>
                                                    <FullscreenIcon/>
                                                </Box>
                                            }
                                            {
                                                item.category === 'video' &&  <video src={item.preview} width={270} height={400} controls/>
                                            }
                                            {
                                                item.category === 'image' && <Box sx={{display : 'flex', alignItems : 'center', justifyContent : 'center', 
                                                width : '270px', height : '400px'}}>
                                                    <img src={item.preview} 
                                                        width={268}
                                                        height={398}
                                                        style={{borderRadius : '10px'}}
                                                    />
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
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <StepperControl 
                        activeStep={2}
                        handleBack={handleBack}
                        handleContinue={handleContinue}

                        disableContinue={disableContinue}
                    />
                </Grid>
            </Grid>
           
            <CalendarModal 
                selectedDay={selectedDay}
                handleChangeSelectedDay={handleChangeSelectedDay}

                open={openCalendarModal}
                handleClose={handleCloseCalendarModal}

                handleFirst={handleCloseCalendarModal}
                handleSecond={handleCloseCalendarModal}

                text1={'Cancel'}
                text2={'Apply'}
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
RecurringPrice.propTypes = {
    InputRecurringPriceConfig : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    solsForUpload : state.upload.solsForUpload,
    externalsForUpload : state.upload.externalsForUpload,

    recurringSubscriptionPrice : state.upload.recurringSubscriptionPrice,
    recurringPriceUnit : state.upload.recurringPriceUnit,
    recurringReleaseDate : state.upload.recurringReleaseDate
});
const mapDispatchToProps = {
    InputRecurringPriceConfig
};
export default connect(mapStateToProps, mapDispatchToProps)(RecurringPrice) ;     