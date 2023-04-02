import * as React from 'react' ;

import { useMeasure } from 'react-use';

import VideoToCanvas from '../Common/VideoToCanvas';
import ImageToCanvas from '../Common/ImageToCanvas';
import PdfPreview from '../Common/PdfPreview';
import DocxPreview from '../Common/DocxPreview';
import PdfFullScreen from '../Common/PdfFullScreen';
import DocxFullScreen from '../Common/DocxFullScreen';
import ImageFullScreen from '../Common/ImageFullScreen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import DocPreview from '../Common/DocPreview';

import { bytesToSize } from '../../utils/Helper';

import { v4 as uuidv4 } from 'uuid' ;

import {
    Box,
    Tooltip
} from '@mui/material' ;

import { useStyles } from './StylesDiv/SolsList.styles';
import { useTheme } from '@mui/styles';

const SOLDIV_WIDTH = 280 ;
const MINI_ITEM_WIDTH = 230 ;
const MINI_ITEM_HEIGHT = 200 ;

const SolsList = (props) => {

    const classes = useStyles() ;
    const theme = useTheme() ;

    const solsDiv = React.useRef() ;

    const [ setSolsDiv, {width , height} ] = useMeasure() ;

    const {
        sols
    } = props ;
    
    const [openPdf, setOpenPdf] = React.useState(false) ;
    const [openPdfPath, setOpenPdfPath] = React.useState(null) ;

    const [openDocx, setOpenDocx] = React.useState(false) ;
    const [openDocxPath, setOpenDocxPath] = React.useState(null) ;

    const [openImage, setOpenImage] = React.useState(false) ;
    const [openImagePath, setOpenImagePath] = React.useState(null) ;

    const [fileIndex, setFileIndex] = React.useState(0) ;
    const [listModel, setListModel] = React.useState({
        rowCount : 0,
        colCount : 0,
        leftOverIndex : 0,
        estDivWidth : 0
    }) ;

    const handleSelectFile = (fileIndex) => {
        setFileIndex(fileIndex) ;
    }

    React.useEffect(() => {
        setSolsDiv(solsDiv.current) ;
    }, []) ;

    React.useEffect(() => {
        if(sols.length) {
            let colCount = Math.floor(width / SOLDIV_WIDTH) ;
            let estDivWidth = width / colCount ;
            let rowCount = Math.floor(sols.length / colCount) ;
            let leftOverIndex = colCount * rowCount ;

            if(Number.isInteger(colCount) && Number.isInteger(rowCount) && Number.isInteger(leftOverIndex)) {
                setListModel({
                    colCount : colCount,
                    rowCount : rowCount,
                    leftOverIndex : leftOverIndex,
                    estDivWidth : estDivWidth
                });
            }
        }
    }, [width]) ;

    React.useEffect(() => {
        console.log(sols) ;

    }, [sols]) ;

    return (
        <Box className={classes.root} ref={solsDiv}>
            {
                sols ?
                    sols.length ?
                        sols.map((sol, index) => {
                            return (
                                <Box key={index} className={classes.fileItemDiv} onClick={() => handleSelectFile(index) } sx={{ background : index === fileIndex ? theme.palette.blue.B300 : 'transparent'}}>
                                    <Tooltip title={sol?.name}>
                                        <Box className={classes.fileNameDiv}>
                                            Name : {sol.name?.slice(0, 10)}{sol.name.length > 10 && "..."}
                                        </Box>
                                    </Tooltip>
                                    <Box sx={{mt : '10px', width :MINI_ITEM_WIDTH, height : MINI_ITEM_HEIGHT, position : 'relative'}}>
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
                                                        setOpenDocxPath(sol?.path) ;
                                                        return ;
                                                    case 'pdf' : 
                                                        setOpenPdf(true);
                                                        setOpenPdfPath(sol?.path) ;
                                                        return ;
                                                    case 'image' :
                                                        setOpenImage(true);
                                                        setOpenImagePath(sol?.path) ;
                                                    default :
                                                        return;
                                                }
                                            }}>
                                                <FullscreenIcon/>
                                            </Box>
                                        }
                                        {
                                            sol?.category === 'video' 
                                            && <video src={sol?.path} width={MINI_ITEM_WIDTH} height={MINI_ITEM_HEIGHT} style={{borderRadius : '10px'}} controls/>
                                            
                                        }
                                        {
                                            sol?.category === 'image' 
                                            && <img src={sol?.path} width={MINI_ITEM_WIDTH} height={MINI_ITEM_HEIGHT} style={{borderRadius : '10px'}} />
                                        }
                                        {
                                            sol?.category === 'pdf' 
                                            &&  <PdfPreview
                                                previewUrl={sol?.path}
                                                width={MINI_ITEM_WIDTH}
                                                height={MINI_ITEM_HEIGHT}
                                            /> 
                                        }
                                        {
                                            sol?.category === 'docx'
                                            &&  <DocxPreview
                                                    previewUrl={sol?.path}
                                                    width={MINI_ITEM_WIDTH}
                                                    height={MINI_ITEM_HEIGHT}
                                                    key={uuidv4()}
                                                    activeIndex={index}
                                                    selfIndex={fileIndex}
                                                    forceHide={openDocx}
                                            /> 
                                        }
                                        {
                                            sol?.category === 'doc'
                                            &&  <DocPreview
                                                    previewUrl={sol?.path}
                                                    width={MINI_ITEM_WIDTH}
                                                    height={MINI_ITEM_HEIGHT}
                                            /> 
                                        }
                                    </Box>
                                    <Box sx={{display : 'flex', justifyContent : 'space-between', alignItems : 'center', mt : '20px'}}>
                                        <Box >
                                            File Size :
                                            <Box>{bytesToSize(sol?.size)}</Box>
                                        </Box>
                                        <Box>
                                            Created :
                                            <Box>{new Date(sol?.created_at).toLocaleDateString()}</Box>
                                        </Box>
                                    </Box>
                                </Box>
                            )
                        })
                    : <>
                    </>
                : <>
                </>
            }
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

export default SolsList ;




// {
//     sols.length && listModel.leftOverIndex < sols.length ? <Box key={'row_'+ listModel.rowCount + 1} className={classes.rowDiv}>
//         {
//             [...Array(sols.length - listModel.leftOverIndex)].map((item, colIndex) => {
//                 return (
//                     <Box sx={{width : listModel.estDivWidth}} className={classes.colDiv} key={'cell_' + listModel.leftOverIndex + colIndex }>
//                         <Box className={classes.fileItemDiv} onClick={() => handleSelectFile(listModel.leftOverIndex + colIndex) } sx={{background : listModel.leftOverIndex + colIndex === fileIndex ? theme.palette.blue.BMINI_ITEM_HEIGHT : 'transparent'}}>
//                             <Tooltip title={sols[listModel.leftOverIndex + colIndex]?.name}>
//                                 <Box className={classes.fileNameDiv}>
//                                     Name : {sols[listModel.leftOverIndex + colIndex].name?.slice(0, 10)}{sols[listModel.leftOverIndex + colIndex].name.length > 10 && "..."}
//                                 </Box>
//                             </Tooltip>
//                             <Box sx={{mt : '10px', width : MINI_ITEM_WIDTH, height: MINI_ITEM_HEIGHT, position : 'relative'}}>
//                                 {
//                                     (
//                                         sols[listModel.leftOverIndex + colIndex].category === 'image' || 
//                                         sols[listModel.leftOverIndex + colIndex].category === 'pdf' ||
//                                         sols[listModel.leftOverIndex + colIndex].category === 'docx'
//                                     ) &&
//                                     <Box className={classes.fullIconDiv} onClick={() => {
//                                         switch(sols[listModel.leftOverIndex + colIndex].category) {
//                                             case 'docx' :
//                                                 setOpenDocx(true);
//                                                 setOpenDocxPath(sols[listModel.leftOverIndex + colIndex].path) ;
//                                                 return ;
//                                             case 'pdf' : 
//                                                 setOpenPdf(true);
//                                                 setOpenPdfPath(sols[listModel.leftOverIndex + colIndex].path) ;
//                                                 return ;
//                                             case 'image' :
//                                                 setOpenImage(true);
//                                                 setOpenImagePath(sols[listModel.leftOverIndex + colIndex].path) ;
//                                             default :
//                                                 return;
//                                         }
//                                     }}>
//                                         <FullscreenIcon/>
//                                     </Box>
//                                 }
//                                 {
//                                     sols[listModel.leftOverIndex + colIndex].category === 'video' &&
//                                     <video src={sols[listModel.leftOverIndex + colIndex].path} width={MINI_ITEM_WIDTH} height={MINI_ITEM_HEIGHT} style={{background : theme.palette.blue.B300, borderRadius : '10px'}} controls/>
                                    
//                                 }
//                                 {
//                                     sols[listModel.leftOverIndex + colIndex].category === 'image' &&
//                                     <img src={sols[listModel.leftOverIndex + colIndex].path} width={MINI_ITEM_WIDTH} height={MINI_ITEM_HEIGHT} style={{borderRadius : '10px'}} />
//                                 }
//                                 {
//                                     sols[listModel.leftOverIndex + colIndex].category === 'pdf' &&
//                                     <PdfPreview
//                                         previewUrl={ sols[listModel.leftOverIndex + colIndex].path}
//                                         width={MINI_ITEM_WIDTH}
//                                         height={MINI_ITEM_HEIGHT}
//                                     /> 
//                                 }
//                                 {
//                                    sols[listModel.leftOverIndex + colIndex].category === 'docx'
//                                     &&  <DocxPreview
//                                         previewUrl={sols[listModel.leftOverIndex + colIndex].path}
//                                         width={MINI_ITEM_WIDTH}
//                                         height={MINI_ITEM_HEIGHT}
//                                         key={uuidv4()}
//                                         // activeIndex={index}
//                                         // selfIndex={currentSol}
//                                         // forceHide={openDocx}
//                                     /> 
//                                 }
//                             </Box>
//                             <Box sx={{display : 'flex', justifyContent : 'space-between', alignItems : 'center', mt : '20px'}}>
//                                 <Box >
//                                     File Size :
//                                     <Box>{bytesToSize(sols[listModel.leftOverIndex + colIndex].size)}</Box>
//                                 </Box>
//                                 <Box>
//                                     Created :
//                                     <Box>{new Date(sols[listModel.leftOverIndex + colIndex].created_at).toLocaleDateString()}</Box>
//                                 </Box>
//                             </Box>
//                         </Box>
//                     </Box>
//                 )
//             })
//         }
//     </Box>
//         : <>
//     </>
// }