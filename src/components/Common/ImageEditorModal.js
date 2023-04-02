import * as React from "react";

import CloseImage from '../../assets/modals/CloseDark.svg' ;

import Loading from 'react-loading-components' ;

import  {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    DialogActions,
    Button,
    Grid
} from '@mui/material' ;

import { makeStyles, useTheme } from '@mui/styles' ;

const useStyles = makeStyles((theme) => ({
    root : {

    },
    paper : {
        backgroundColor : '#23262F !important',
        borderRadius : '10px !important',
        
        "& .MuiDialogTitle-root" : {
            color : 'white',
            padding : '10px !important',
            fontFamily : 'Montserrat',
            display : 'flex', alignItems : 'center', justifyContent : 'space-between'
        },

        "& .MuiDialogContent-root" : {
            padding : '0px !important',
            paddingLeft : '10px !important',
            paddingRight : '10px !important',
        },

        "& .MuiButtonBase-root" : {
            textTransform : 'capitalize !important',
            color : 'white',
            borderRadius : 20,
            width : 150,
            paddingLeft : 20, paddingRight : 20,
            "& svg" : {
                fontSize : '25px !important'
            }
        },
    },
    imageDiv : {
        position : 'relative',
        display  : 'flex', alignItems : 'center', justifyContent : 'center',
        gap : 10,
        borderRadius : 10,

        minWidth : 240,
    },
    cropRectDiv : {
        position : 'absolute',

        border : '2px solid white',
        display : 'none' ,
        top : 0,
        left : 0,
        pointerEvents : 'none',

        overflow : 'hidden',

        flexDirection : 'column', justifyContent : 'space-between',

        boxSizing : 'content-box'
    },
    rulerVDiv : {
        display : 'flex' , flexDirection : 'column', justifyContent : 'space-between',
        position : 'absolute',

        top : 0, left : 0,
        width : '100%', height : '100%',
    },
    rulerHDiv : {
        display : 'flex' , justifyContent : 'space-between',
        position : 'absolute',

        top : 0, left : 0,
        width : '100%', height : '100%',
    },
    cropVLineDiv : {
        "&:first-child": {
            opacity : 0
        },
        "&:last-child": {
            opacity : 0
        },
        borderBottom : '0.1px solid #ffffff70',
    },
    cropHLineDiv : {
        "&:first-child": {
            opacity : 0
        },
        "&:last-child": {
            opacity : 0
        },
        borderRight : '0.1px solid #ffffff70',
    },
    lineDiv : {
        borderBottom : '1px solid gray',
        marginBottom : 10
    },
    editorLabelDiv : {
        position : 'absolute',
        color : theme.palette.green.G200,
        top : -10,
        left : 20,

        paddingLeft : 5, paddingRight : 5,

        backgroundColor : '#23262F !important',
    },
    previewLabelDiv : {
        position : 'absolute',
        color : theme.palette.green.G200,
        top : -10,
        left : 20,

        paddingLeft : 5, paddingRight : 5,

        backgroundColor : '#23262F !important',
    },
    editorDiv : {
        position : 'relative',
        border : '1px solid ' + theme.palette.green.G400,
        borderRadius : 10,
        display : 'flex', padding : 10, justifyContent : 'center'
    },
    maskDiv : {
        position : 'absolute',
        
        pointerEvents : 'none',
        left : 0, top : 0,
        width : '100%', height : '100%',

        background : 'white',
        opacity : 0.5,

        display : 'none'
    },
    previewDiv : {
        position : 'relative',
        padding : 20,

        border : '1px solid ' + theme.palette.green.G400,
        borderRadius : 10,
        display : 'flex', justifyContent : 'center', alignItems : 'center'
    }
})) ;

const VIEW_WIDTH = 240 ;
let timer ;

const ImageEditorModal = (props) => {

    const classes = useStyles() ;
    const theme = useTheme() ;

    const {
        open,
        handleClose,
        
        scale,

        path,
        id ,
        handleEndPoint
    } = props ;

    const canvasRef = React.useRef() ;
    const cropRectRef = React.useRef() ;
    const maskRef = React.useRef() ;
    const unMaskRef = React.useRef() ;
    
    const isCliping = React.useRef() ;
    const isResizing = React.useRef() ;
    
    const [drawStatus, setDrawStatus] = React.useState('isCliping') ;

    const startX = React.useRef() ;
    const startY = React.useRef() ;

    const [loading, setLoading] = React.useState(false) ;
    const [rendering, setRendering] = React.useState(false) ;

    const [canvas, setCanvas] =  React.useState(null) ;

    const point = (pointValue) => {
        return pointValue  + "px" ;
    }

    const BeginCrop = (e, ctx, scaleX, scaleY) => {
        e.preventDefault();
        e.stopPropagation();

        if(!ctx || drawStatus === 'isResizing') return ;
        
        maskRef.current.style.display = 'block' ;
        unMaskRef.current.style.left = point(e.layerX * -1) ;
        unMaskRef.current.style.top = point(e.layerY * -1) ;

        startX.current.value = e.layerX ;
        startY.current.value = e.layerY ;

        cropRectRef.current.style.left = point(e.layerX) ;
        cropRectRef.current.style.top = point(e.layerY) ;

        cropRectRef.current.style.display  = 'flex' ;
        cropRectRef.current.style.width = '0px';
        cropRectRef.current.style.height = '0px' ;
    
        // set a flag indicating the drag has begun
        isCliping.current.value = 'true' ;
    }
			
    const UpdateCrop = (e, ctx, scaleX, scaleY) => {
        e.preventDefault();
        e.stopPropagation();

        if (isCliping.current.value === 'false' || !ctx) {	
        
            return;
        }

        unMaskRef.current.style.left = point(e.layerX > startX.current.value ? startX.current.value * -1 : e.layerX * -1) ;
        unMaskRef.current.style.top = point(e.layerY > startY.current.value ? startY.current.value * -1 : e.layerY * -1) ;

        cropRectRef.current.style.left = point(e.layerX > startX.current.value ? startX.current.value : e.layerX) ;
        cropRectRef.current.style.top = point(e.layerY > startY.current.value ? startY.current.value : e.layerY) ;
        cropRectRef.current.style.width = point(Math.abs(e.layerX - startX.current.value));
        cropRectRef.current.style.height = point(Math.abs(e.layerY - startY.current.value));
    }

    const EndCrop = (e, ctx, image, scaleX, scaleY) => {
        e.preventDefault();
        e.stopPropagation();

        if(isCliping.current.value === 'false' || !ctx || drawStatus === 'isResizing') return ;

        ctx.clearRect(0,0, VIEW_WIDTH, VIEW_WIDTH / scale) ;

        ctx.drawImage(  image, startX.current.value * scaleX, startY.current.value * scaleY, 
                        (e.layerX - startX.current.value) * scaleX, (e.layerY - startY.current.value) * scaleY, 
                        0, 0, VIEW_WIDTH, VIEW_WIDTH / scale);
        
        // cropRectRef.current.style.display = 'none' ;

        // maskRef.current.style.display = 'none' ;

        isCliping.current.value = 'false' ;
        isResizing.current.value = 'true' ;
        
        setDrawStatus('isCompleted') ;
    }

    const handleCrop = () => {
        canvas.toBlob( async (blob) => {
            setLoading(true) ;
           
            await handleEndPoint(blob) ;

            setLoading(false) ;

            handleClose() ;
        }) ;
    }

    const handleReset = () => {
        let canvas = document.getElementById(id + "_canvas") ;

        let ctx = canvas.getContext('2d') ;

        let image = document.getElementById(id + "_image") ;

        image.style.width = "240px" ;
        image.style.height = "auto" ;

        let scaleX = image.naturalWidth / 240 ;
        let scaleY = image.naturalHeight / image.height ;

        maskRef.current.style.display = 'block' ;
        unMaskRef.current.style.left = point(0) ;
        unMaskRef.current.style.top = point(0) ;

        cropRectRef.current.style.left = point(0) ;
        cropRectRef.current.style.top = point(0) ;

        cropRectRef.current.style.display  = 'flex' ;
        cropRectRef.current.style.width = '240px';
        cropRectRef.current.style.height = image.height + 'px';

        ctx.clearRect(0,0, VIEW_WIDTH, VIEW_WIDTH / scale) ;

        ctx.drawImage(  image, 0, 0, 
                    240 * scaleX, image.height * scaleY, 
                    0, 0, VIEW_WIDTH, VIEW_WIDTH / scale);
    }

    React.useEffect(() => {
        let mounted = true ;

        if(id && path) {
            setDrawStatus('isCliping') ;

            timer = setTimeout(() => {
                if(!mounted) return ;

                console.log('mouned' , mounted) ;
                setRendering(true) ;

                let canvas = document.getElementById(id + "_canvas") ;
                setCanvas(canvas) ;
                if(canvas) {
                    let ctx = canvas.getContext("2d") ;

                    let image = document.createElement("img");
                   
                    image.crossOrigin = 'anonymous' ;
                    image.src = path;
                    image.id = id + '_image' ;

                    document.getElementById(id + "_editor").appendChild(image);

                    if(image.complete) {
                        ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_WIDTH / scale) ;

                        ctx.drawImage(image, 0,0, VIEW_WIDTH, VIEW_WIDTH / scale);
                    }
                    else {
                        image.addEventListener('load', () => {
                            
                            
                            console.log("natural:", image.naturalWidth, image.naturalHeight);
                            
                            image.style.width = "240px" ;
                            image.style.height = "auto" ;

                            console.log("real:", image.width, image.height) ;

                            let scaleX = image.naturalWidth / 240 ;
                            let scaleY = image.naturalHeight / image.height ;

                            maskRef.current.style.display = 'block' ;
                            unMaskRef.current.style.left = point(0) ;
                            unMaskRef.current.style.top = point(0) ;
                    
                            cropRectRef.current.style.left = point(0) ;
                            cropRectRef.current.style.top = point(0) ;

                            cropRectRef.current.style.display  = 'flex' ;
                            cropRectRef.current.style.width = '240px';
                            cropRectRef.current.style.height = (240 / scale) + 'px';

                            ctx.clearRect(0,0, VIEW_WIDTH, VIEW_WIDTH / scale) ;

                            ctx.drawImage(  image, 0, 0, 
                                        240 * scaleX, (240 / scale) * scaleY, 
                                        0, 0, VIEW_WIDTH, VIEW_WIDTH / scale);

                            setRendering(false) ;

                            image.onmousedown = (e) => {
                                BeginCrop(e, ctx, scaleX, scaleY) ;
                            } ;
        
                            image.onmousemove = (e) => {
                                UpdateCrop(e, ctx, scaleX, scaleY) ;
                            } ;
    
                            image.onmouseout = (e) => {
                                EndCrop(e, ctx, image, scaleX, scaleY) ;
                            } ;
    
                            image.onmouseup = (e) => {
                                EndCrop(e, ctx, image, scaleX, scaleY) ;
                            } ;
                        });
                    }
                    
                }
            }, [2000]) ;
        }

        return () => {
            clearTimeout(timer) ;
            timer = null ;
            mounted = false ;
            console.log('here') ;
        }

    }, [path, id]) ;

    return (
        <Box className={classes.root}>
            <Dialog
                open={open}
                classes ={{
                    paper : classes.paper
                }}
                hideBackdrop={true}
            >
                <DialogTitle>
                    Edit Photo { !loading && <img src={CloseImage} onClick={handleClose} style={{cursor : 'pointer'}}/> }
                </DialogTitle>
                <Box className={classes.lineDiv}/>
                <DialogContent>
                    <Grid container sx={{marginTop : '10px'}}>
                        <Grid item xs={12}>
                            <Box className={classes.editorDiv}>
                                <Box className={classes.editorLabelDiv}>
                                    Editor
                                </Box>
                                <Box sx={{display : 'flex'}}>
                                    <Box className={classes.imageDiv}
                                        sx={{cursor :   'crosshair' }}
                                    >
                                        {/* <img src={path} 
                                            ref={imgRef}
                                            onMouseDown={BeginCrop} 
                                            onMouseMove={UpdateCrop}
                                            onMouseUp={EndCrop}
                                            onMouseOut={EndCrop}
                                            crossOrigin='anonymous'
                                            style={{maxWidth : '240px', height : '240px'}}
                                        /> */}
                                        <Box id={id + "_editor"} >
                                            {
                                                rendering && <Loading type='oval' width={40} height={40} fill={'white'} />
                                            }
                                        </Box>
                                        {/* <input type={'text'} defaultValue={'isCliping'} 
                                            ref={drawStatus}
                                            hidden
                                        />  */}
                                        <input type={'text'} defaultValue={'false'} 
                                            ref={isCliping}
                                            hidden
                                        /> 
                                        <input type={'text'} defaultValue={'false'} 
                                            ref={isResizing}
                                            hidden
                                        />  
                                        <input type={'number'} defaultValue={0} 
                                            ref={startX}
                                            hidden
                                        />  
                                        <input type={'number'} defaultValue={0} 
                                            ref={startY}
                                            hidden
                                        />  
                                        <Box className={classes.maskDiv} ref={maskRef} />
                                        <Box className={classes.cropRectDiv} ref={cropRectRef}
                                           
                                        >
                                            <Box sx={{position : 'relative', pointerEvents : 'none',}}>
                                                <img src={path} ref={unMaskRef} 
                                                    style={{position : 'absolute', pointerEvents : 'none', width : '240px', height : 'auto'}}
                                                />
                                            </Box>
                                            <Box className={classes.rulerVDiv}>
                                                {
                                                    [...Array(4)].map((item, index) => {
                                                        return (
                                                            <Box key={index} className={classes.cropVLineDiv} />
                                                        )
                                                    })
                                                }
                                            </Box>
                                            <Box className={classes.rulerHDiv}>
                                                {
                                                    [...Array(4)].map((item, index) => {
                                                        return (
                                                            <Box key={index} className={classes.cropHLineDiv} />
                                                        )
                                                    })
                                                }
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{marginTop : '10px'}}>
                            <Box className={classes.previewDiv}>
                                <Box className={classes.previewLabelDiv}>
                                    Preview
                                </Box>
                                <canvas id={id + "_canvas"} width={VIEW_WIDTH} height={VIEW_WIDTH / scale} 
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' sx={{background : '#484C56 !important'}} disabled={loading}
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                    <Button variant={'contained'} sx={{background : '#3772FF !important'}} onClick={handleCrop}
                        disabled={loading || !path}
                        startIcon={loading && <Loading type='oval' width={20} height={20} fill={'white'} />}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ImageEditorModal ;