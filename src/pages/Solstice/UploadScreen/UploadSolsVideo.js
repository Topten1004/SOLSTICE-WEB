import React,{useRef, useEffect, useState} from 'react' ;
import { useMeasure } from 'react-use';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { InputUploadFiles, InputProductName, InputExternalLinks, InputProductType } from '../../../redux/actions/upload';
import { UserAccountInfo } from '../../../redux/actions/profile';

import validator from 'validator';
import YouTube from 'react-youtube';
import { getYoutubeId, isYoutubeUrl, removeExtension , getUuid, getCookie, fileNameFormat} from '../../../utils/Helper';

import UploadImage from '../../../assets/menu/Upload.svg';
import TickImage from '../../../assets/common/tick.png' ;
import LinkImage from '../../../assets/common/union.png' ;
import EmptyListImage from '../../../assets/upload/EmptyList.png' ;
import TickProductImage from '../../../assets/profile/TickProductType.svg';

import ExternalLinkModal from '../../../components/Solstice/UploadScreen/ExternalLinkModal';
import StepperControl from '../../../components/Solstice/UploadScreen/StepperControl' ;
import VideoControl from '../../../components/Solstice/UploadScreen/VideoControl';
import PdfPreview from '../../../components/Common/PdfPreview';
import DocxPreview from '../../../components/Common/DocxPreview';
import PdfFullScreen from '../../../components/Common/PdfFullScreen';
import DocxFullScreen from '../../../components/Common/DocxFullScreen';
import ImageFullScreen from '../../../components/Common/ImageFullScreen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

import Loading from 'react-loading-components' ;

import { storage  } from '../../../firebase/config' ;
import { uploadBytesResumable ,ref , getDownloadURL} from 'firebase/storage';

import swal from 'sweetalert';
import { v4 as uuidv4 } from 'uuid';

import { productTypeList, acceptableList } from '../../../constants/static';

import {
    Box,
    Grid,
    List,
    ListItem,
    InputLabel,
    TextField,
    useMediaQuery
} from '@mui/material';

import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { EffectCube, Pagination } from "swiper";

import 'swiper/swiper.min.css';
import 'swiper/modules/effect-cube/effect-cube.min.css' ;

import { useTheme } from '@mui/styles';
import { useStyles } from './StylesDiv/UploadSolsVideo.styles' ;
import DocPreview from '../../../components/Common/DocPreview';

const UploadSolsVideo = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;

    const {
        handleChangeUploadStep,
        InputUploadFiles,
        InputProductType,
        InputProductName,
        InputExternalLinks,
        UserAccountInfo,

        externalsForUpload,
        productName,
        solsForUpload,
        solsProductType
    } = props;

    const match1195 = useMediaQuery('(min-width : 1195px)') ;
    const topCtrl = useRef() ;

    const [loading, setLoading] = React.useState(false) ;

    const [setTopCtrl, {width, height}] = useMeasure() ;

    const [productTitle, setProductTitle] = useState('') ;
    const [productType, setProductType] = useState(null);
    const [filesForUpload, setFilesForUpload] = useState([]) ;
    const [linksForUpload, setLinksForUpload] = useState([]) ;
    const [disableContinue, setDisableContinue] = useState(true) ;

    const [activeSol, setActiveSol] = useState(0) ;

    const [openPdf, setOpenPdf] = useState(false) ;
    const [openPdfPath, setOpenPdfPath] = useState(null) ;

    const [openDocx, setOpenDocx] = useState(false) ;
    const [openDocxPath, setOpenDocxPath] = useState(null) ;

    const [openImage, setOpenImage] = useState(false) ;
    const [openImagePath, setOpenImagePath] = useState(null) ;

    const [openLinkModal, setOpenLinkModal] = useState(false) ;

    const handleChangeSwiperSlide = (e) => {
        setActiveSol(e.activeIndex) ;
    }

    const handleOpenLinkModal = () => {
        return swal({
            title : "Coming Soon",
            text : "We're launching soon, follow us for update...",
            icon : 'success',
            buttons : false,
            timer : 5000
        }) ;

        setOpenLinkModal(true) ;
    }

    const handleCloseLinkModal = () => {
        setOpenLinkModal(false) ;
    }
    
    const handleProductType = (product_type) => {
        setFilesForUpload([]) ;
        setLinksForUpload([]) ;
        setProductType(product_type) ;
    }

    const handleChangeDuration = (videoIndex, format_duration, duration, file_type) => {
        if(file_type === 'local') {
            let temp = [...filesForUpload] ;

            temp[videoIndex] = {
                ...temp[videoIndex],
                format_duration : format_duration,
                duration : duration
            };

            setFilesForUpload(temp) ;
        }
        if(file_type === 'link') {
            let temp = [...linksForUpload] ;

            temp[videoIndex] = {
                ...temp[videoIndex],
                format_duration : format_duration,
                duration : duration
            };

            setLinksForUpload(temp) ;
        }        

    }

    const handleChangeSolName = (name, videoIndex, file_type) => {
        if(file_type === 'link') {
            let temp = [...linksForUpload] ;

            temp[videoIndex] = {
                ...temp[videoIndex],
                name : name
            } ;

            setLinksForUpload(temp) ;
        }
        if(file_type === 'local') {
            let temp = [...filesForUpload] ;

            temp[videoIndex] = {
                ...temp[videoIndex],
                name : name
            } ;

            setFilesForUpload(temp) ;
        }
    } 

    const handleChangeUploadSols = async (e) => {
        let temp = [] ;

        setLoading(true) ;

        for(let i = 0 ; i < e.target.files.length ; i++) {
            let ext ;

            if(e.target.files[i].name.indexOf('.') >= 0) {
                ext = e.target.files[i].name.slice(e.target.files[i].name.lastIndexOf('.') + 1, e.target.files[i].name.length) ;

                if(acceptableList[productType].indexOf(ext) >= 0) {
                    let preview ;

                    if(ext === 'doc') {
                        let storageRef = ref(storage, '_doc_temp/' + uuidv4()) ;

                        let uploadTask = await uploadBytesResumable(storageRef, e.target.files[i]) ;

                        preview = await getDownloadURL(uploadTask.ref) ;

                    } else preview = URL.createObjectURL(e.target.files[i]) ;

                    temp.push({
                        preview : preview,
                        name : removeExtension( e.target.files[i].name ),
                        raw : e.target.files[i],
                        format_duration : null,
                        duration : null,
                        type : e.target.files[i].type,
                        category : productType === '#Document' ? ext : productType.replaceAll('#','').toLowerCase(),
                        size : e.target.files[i].size
                    }) ;
                }
            }
        }
        setFilesForUpload(temp);

        setLoading(false) ;
    }

    const handleContinue = () => {
        InputUploadFiles(filesForUpload) ;
        InputExternalLinks(linksForUpload.filter(item => item.url !== '')) ;
        InputProductName(productTitle) ;
        InputProductType(productType) ;

        handleChangeUploadStep('price-config') ;
    }

    useEffect(() => {
        setTopCtrl(topCtrl.current) ;
    }, []) ;

    useEffect(() => {
    }, [height]) ;

    useEffect(() => {
        setProductTitle(productName) ;
    }, [productName]) ;

    useEffect(() => {
        UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;
    }, []) ;

    useEffect(async () => {
        if(productTitle !== '' && (filesForUpload.length || linksForUpload.length ) && productType ) {
            let disableTemp = loading ;

            await Promise.all(
                filesForUpload.map((item, index) => {
                    if(item.name === '') {
                        disableTemp=true;
                        return ;
                    }
                })
            );

            await Promise.all(
                linksForUpload.map((item, index) => {
                    if(item.name === '') {
                        disableTemp=true;
                        return ;
                    }
                })
            );

            setDisableContinue(disableTemp) ;
        } 
        else setDisableContinue(true) ;
    }, [productTitle, filesForUpload, linksForUpload, loading]) ;

    useEffect(() => {
        setProductType(solsProductType) ;
    }, [solsProductType]) ;

    useEffect(() => {
        setFilesForUpload(solsForUpload);
    }, [solsForUpload]) ;

    useEffect(() => {
        setLinksForUpload(externalsForUpload) ;
    }, [externalsForUpload]) ;

    return (
        <>
            <Box className={classes.root}>
                <Box className={classes.greenBlur} />
                <Box className={classes.blueBlur} />
                {/* <Grid container  ref={topCtrl}>
                    <Grid item xs={12} sx={{display : 'flex', justifyContent : 'flex-end', pr : '20px', pt : '20px'}}>
                        <Box sx={{color : 'white', display : 'flex', alignItems : 'center', gap : '10px'}}>Connect External Drive <img src={UploadImage} width={30}/> </Box>
                    </Grid>
                </Grid> */}
                <Grid container >
                    <Grid item xs={12} sx={{mt : '20px'}}>
                        <Box className={classes.zeroToOneDiv}>
                            Select Product
                        </Box>
                        <Box className={classes.productTypeDiv}>
                            {
                                productTypeList?.map((item, index) => {
                                    return (
                                        <Box className={classes.linkItemDiv} key={index} onClick={() => handleProductType(item)} 
                                            sx={{background : productType === item && '#375068'}}
                                        >
                                            {productType === item && <><img src={TickProductImage} width={20}/>&nbsp;</>}
                                            {productType === item ? item.replace('#','') : item}
                                        </Box>
                                    )
                                })
                            }
                        </Box>
                    </Grid>
                </Grid>
                <Grid container sx={{height : '680px', pt : '20px'}}>
                    <Grid item xs={match1195 ? 6 : 12} className={classes.uploadSettingDiv}>
                        <Box className={classes.selectCtrlCss}>
                            <InputLabel htmlFor="upload-sols" sx={{color : 'white', fontSize : '20px' ,fontFamily : 'Montserrat', display : 'flex',alignItems : 'center', gap : '10px'}}>
                                <Box sx={{cursor : 'pointer'}}>
                                    Upload More Files
                                </Box>
                                <Box>
                                    <img src={UploadImage} width={35}/>
                                </Box>
                            </InputLabel>
                            <input
                                multiple
                                accept={acceptableList[productType]}
                                type="file"
                                id="upload-sols"
                                name="sel_sols"
                                style={{ display: "none" }}
                                onChange={handleChangeUploadSols}
                                disabled={productType === '#Music'}
                                onClick={() => {
                                }}
                            />
                        </Box>
                        <Box className={classes.addLinkCss} sx={{mt : '30px', cursor : 'pointer'}} onClick={handleOpenLinkModal}>
                            Add Your External link
                        </Box>
                        <Box className={classes.videoSlideDiv}>
                            {
                                filesForUpload.length || linksForUpload.length ? <>
                                    <Swiper
                                        effect={"cube"}
                                        grabCursor={true}
                                        cubeEffect={{
                                        slideShadows: true,
                                        }}
                                        pagination={true}
                                        modules={[EffectCube, Pagination]}
                                        onSlideChange={handleChangeSwiperSlide}
                                    >
                                        {
                                            linksForUpload.map((item, index) => {
                                                return  validator.isURL(item.url) && <SwiperSlide key={index}>
                                                    <Box sx={{position : 'relative'}}>
                                                        <Box sx={{zIndex : -100}}>
                                                            {
                                                                item.category === 'video' && (
                                                                    isYoutubeUrl(item.url) ? <YouTube videoId={getYoutubeId(item.url)} opts={{
                                                                        height: 248,
                                                                        width: 370,
                                                                        playerVars: {
                                                                            // https://developers.google.com/youtube/player_parameters
                                                                            autoplay: 1,
                                                                        }
                                                                    }}/> :
                                                                    <VideoControl
                                                                        videoIndex={index}
                                                                        videoPreview={item.url}
                                                                        handleChangeDuration={handleChangeDuration}
                                                                        fileType = {'link'}
                                                                    />
                                                                )
                                                            }
                                                            
                                                            {/* <VideoControl
                                                                videoIndex={index}
                                                                videoPreview={item.preview}
                                                                handleChangeDuration={handleChangeDuration}
                                                            /> */}
                                                        </Box>
                                                    </Box>
                                                </SwiperSlide>
                                            })
                                        }
                                        {
                                            filesForUpload.map((item, index) => {
                                                return <SwiperSlide key={index}
                                                >
                                                    {
                                                        (
                                                            item.category === 'image' || 
                                                            item.category === 'pdf' ||
                                                            item.category === 'docx'
                                                        ) &&
                                                        <Box className={classes.fullIconDiv} onClick={() => {
                                                            switch(item.category) {
                                                                case 'docx' :
                                                                    setOpenDocx(true);
                                                                    setOpenDocxPath(item.preview) ;
                                                                    return ;
                                                                case 'pdf' : 
                                                                    setOpenPdf(true);
                                                                    setOpenPdfPath(item.preview) ;
                                                                    return ;
                                                                case 'image' :
                                                                    setOpenImage(true);
                                                                    setOpenImagePath(item.preview) ;
                                                                default :
                                                                    return;
                                                            }
                                                        }}>
                                                            <FullscreenIcon/>
                                                        </Box>
                                                    }
                                                    {
                                                        item.category === 'video' && (
                                                            <VideoControl
                                                                videoIndex={index}
                                                                videoPreview={item.preview}
                                                                handleChangeDuration={handleChangeDuration}
                                                                fileType = {'local'}
                                                            />
                                                        )
                                                    }
                                                    {
                                                        item.category === 'image' && <Box sx={{display : 'flex', alignItems : 'center', justifyContent : 'center', 
                                                        width : '270px', height : '400px'}}>
                                                            <img src={item.preview} 
                                                                width={269}
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
                                                            key={uuidv4()}
                                                            activeIndex={activeSol}
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
                                </>
                                : <Box sx={{width : '100%', textAlign : 'center', pl:'20px', pr:'20px'}}>
                                    {
                                        loading ? <Loading type='oval' width={30} height={30} fill={theme.palette.green.G200} />
                                        :  <>Please, Click "Upload More Files" button to Upload Sols.</>
                                    }
                                </Box>
                            }
                        </Box>
                    </Grid>
                    
                    <Grid item xs={match1195 ? 6 : 12} sx={{pt : '20px', background : theme.palette.blue.main}}>
                        <Box className={classes.rightTopTitleDiv} >
                            <TextField
                                fullWidth
                                placeholder='Title your productName...'
                                value={productTitle}
                                onChange={(e) => setProductTitle(e.target.value)}
                            />
                        </Box>
                        {
                            !linksForUpload.length && !filesForUpload.length ? <Box className={classes.solListEmpytyDiv} sx={{height :  `calc(100vh - ${height}px - 300px)`}}>
                                <Box className={classes.solEmtpyImgDiv}>
                                    <img src={EmptyListImage} width={120} height={120}/>
                                </Box>
                            </Box>
                            : <List className={classes.solListDiv} sx={{height :  `calc(100vh - ${height}px - 300px)`}}>
                                {
                                    linksForUpload.map((item, index) => {
                                        return validator.isURL(item.url) && <ListItem key={index} className={classes.solItemDiv}>
                                            <Box className={classes.solName}>
                                                <TextField
                                                    fullWidth
                                                    value={linksForUpload[index]?.name}
                                                    onChange={(e) => handleChangeSolName(e.target.value, index, "link")}
                                                    placeholder={'Enter File Name.'}
                                                />
                                            </Box>
                                            <Box className={classes.solTime}>
                                                <img src={LinkImage} />&nbsp;{item?.format_duration}
                                            </Box>
                                        </ListItem>
                                    })
                                }
                                {
                                    filesForUpload.map((item, index) => {
                                        return <ListItem key={index} className={classes.solItemDiv}>
                                            <Box className={classes.solName}>
                                                <TextField
                                                    fullWidth
                                                    value={removeExtension(filesForUpload[index]?.name)}
                                                    onChange={(e) => handleChangeSolName(e.target.value, index, "local")}
                                                    placeholder={'Enter File Name.'}
                                                />
                                            </Box>
                                            <Box className={classes.solTime}>
                                                <Box>
                                                    {item.format_duration}
                                                </Box>
                                                <Box>
                                                    {item.category }
                                                </Box>
                                                <img src={TickImage} />
                                            </Box>
                                        </ListItem>
                                    })
                                }
                            </List>
                        }
                        
                    </Grid>
                    <Grid item xs={12}>
                        <StepperControl 
                            handleContinue={handleContinue}
                            disableContinue={disableContinue}
                            activeStep={0}
                        />
                    </Grid>
                </Grid>

                <ExternalLinkModal
                    open={openLinkModal}
                    handleClose={handleCloseLinkModal}
                    linksForUpload={linksForUpload}
                    setLinksForUpload={setLinksForUpload}
                />
            </Box>
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
        </>
    )
}
UploadSolsVideo.propTypes = {
    InputUploadFiles : PropTypes.func.isRequired,
    InputProductName : PropTypes.func.isRequired,
    InputExternalLinks : PropTypes.func.isRequired,
    InputProductType : PropTypes.func.isRequired,
    UserAccountInfo : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    productName : state.upload.productName,
    solsForUpload : state.upload.solsForUpload,
    externalsForUpload : state.upload.externalsForUpload,
    solsProductType : state.upload.solsProductType,
})
const mapDispatchToProps = {
    InputProductType,
    InputUploadFiles,
    InputProductName,
    InputExternalLinks,
    UserAccountInfo
}
export default connect(mapStateToProps, mapDispatchToProps)(UploadSolsVideo) ;