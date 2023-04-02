import * as React from 'react' ;

import { useMeasure } from 'react-use';

import FullscreenIcon from '@mui/icons-material/Fullscreen';
import VideoToCanvas from '../Common/VideoToCanvas';
import ImageToCanvas from '../Common/ImageToCanvas';
import PdfPreview from '../Common/PdfPreview';
import DocxPreview from '../Common/DocxPreview';

import { bytesToSize } from '../../utils/Helper';

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
    }, [listModel]) ;

    return (
        <Box className={classes.root} ref={solsDiv}>
            {
                sols.length ? [...Array(listModel.rowCount)].map((item, rowIndex) => {
                    return (
                        <Box key={'row_'+rowIndex} className={classes.rowDiv}>
                            {
                                [...Array(listModel.colCount)].map((item, colIndex) => {
                                    return (
                                        <Box sx={{width : listModel.estDivWidth}} className={classes.colDiv} key={'cell_' + rowIndex * listModel.colCount + colIndex }>
                                            <Box className={classes.fileItemDiv} onClick={() => handleSelectFile(rowIndex * listModel.colCount + colIndex) } sx={{background : rowIndex * listModel.colCount + colIndex === fileIndex ? theme.palette.blue.BMINI_ITEM_HEIGHT : 'transparent'}}>
                                                <Tooltip title={sols[rowIndex * listModel.colCount + colIndex]?.name}>
                                                    <Box className={classes.fileNameDiv}>
                                                        Name : {sols[rowIndex * listModel.colCount + colIndex].name?.slice(0, 10)}{sols[rowIndex * listModel.colCount + colIndex].name.length > 10 && "..."}
                                                    </Box>
                                                </Tooltip>
                                                <Box sx={{mt : '10px', width :MINI_ITEM_WIDTH, height : MINI_ITEM_HEIGHT}}>
                                                    {
                                                        sols[rowIndex * listModel.colCount + colIndex].category === 'video' 
                                                        && <video src={sols[rowIndex * listModel.colCount + colIndex].path}  style={{borderRadius : '10px'}} controls/>
                                                        
                                                        
                                                    }
                                                    {
                                                        sols[rowIndex * listModel.colCount + colIndex].category === 'image' 
                                                        // && <img src={sols[rowIndex * listModel.colCount + colIndex].path} width={MINI_ITEM_WIDTH} height={MINI_ITEM_HEIGHT} style={{borderRadius : '10px'}} />
                                                        && <ImageToCanvas
                                                                imageInfo = {{
                                                                    imageUrl : sols[rowIndex * listModel.colCount + colIndex]?.path,
                                                                    imageId : sols[rowIndex * listModel.colCount + colIndex]?.id+"first"
                                                                }}

                                                                width={MINI_ITEM_WIDTH}
                                                                height={MINI_ITEM_HEIGHT}

                                                                normalColor={theme.palette.green.G200}
                                                                selectedColor={'rgb(173 86 161 / 89%)'}
                                                        /> 
                                                    }
                                                    {
                                                        sols[rowIndex * listModel.colCount + colIndex].category === 'pdf' 
                                                        &&  <PdfPreview
                                                            previewUrl={sols[rowIndex * listModel.colCount + colIndex].path}
                                                            width={MINI_ITEM_WIDTH}
                                                            height={MINI_ITEM_HEIGHT}
                                                        /> 
                                                    }
                                                    {
                                                        sols[rowIndex * listModel.colCount + colIndex].category === 'docx'
                                                        &&  <DocxPreview
                                                            previewUrl={sols[rowIndex * listModel.colCount + colIndex].path}
                                                            width={MINI_ITEM_WIDTH}
                                                            height={MINI_ITEM_HEIGHT}
                                                            key={uuidv4()}
                                                            // activeIndex={index}
                                                            // selfIndex={currentSol}
                                                            // forceHide={openDocx}
                                                        /> 
                                                    }
                                                </Box>
                                                <Box sx={{display : 'flex', justifyContent : 'space-between', alignItems : 'center', mt : '20px'}}>
                                                    <Box >
                                                        File Size :
                                                        <Box>{bytesToSize(sols[rowIndex * listModel.colCount + colIndex].size)}</Box>
                                                    </Box>
                                                    <Box>
                                                        Created :
                                                        <Box>{new Date(sols[rowIndex * listModel.colCount + colIndex].created_at).toLocaleDateString()}</Box>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )
                                })
                            }
                        </Box>
                    )
                }) : <>
                </>
            }
            {
                sols.length && listModel.leftOverIndex < sols.length ? <Box key={'row_'+ listModel.rowCount + 1} className={classes.rowDiv}>
                    {
                        [...Array(sols.length - listModel.leftOverIndex)].map((item, colIndex) => {
                            return (
                                <Box sx={{width : listModel.estDivWidth}} className={classes.colDiv} key={'cell_' + listModel.leftOverIndex + colIndex }>
                                    <Box className={classes.fileItemDiv} onClick={() => handleSelectFile(listModel.leftOverIndex + colIndex) } sx={{background : listModel.leftOverIndex + colIndex === fileIndex ? theme.palette.blue.BMINI_ITEM_HEIGHT : 'transparent'}}>
                                        <Tooltip title={sols[listModel.leftOverIndex + colIndex]?.name}>
                                            <Box className={classes.fileNameDiv}>
                                                Name : {sols[listModel.leftOverIndex + colIndex].name?.slice(0, 10)}{sols[listModel.leftOverIndex + colIndex].name.length > 10 && "..."}
                                            </Box>
                                        </Tooltip>
                                        <Box sx={{mt : '10px', width : MINI_ITEM_WIDTH, height: MINI_ITEM_HEIGHT }}>
                                            {
                                                sols[listModel.leftOverIndex + colIndex].category === 'video' &&
                                                <video src={sols[listModel.leftOverIndex + colIndex].path} width={MINI_ITEM_WIDTH} height={MINI_ITEM_HEIGHT} style={{background : theme.palette.blue.B300, borderRadius : '10px'}} controls/>
                                                
                                            }
                                            {
                                                sols[listModel.leftOverIndex + colIndex].category === 'image' &&
                                                <img src={sols[listModel.leftOverIndex + colIndex].path} width={MINI_ITEM_WIDTH} height={MINI_ITEM_HEIGHT} style={{borderRadius : '10px'}} />
                                            }
                                            {
                                                sols[listModel.leftOverIndex + colIndex].category === 'pdf' &&
                                                <PdfPreview
                                                    previewUrl={ sols[listModel.leftOverIndex + colIndex].path}
                                                    width={MINI_ITEM_WIDTH}
                                                    height={MINI_ITEM_HEIGHT}
                                                /> 
                                            }
                                            {
                                               sols[listModel.leftOverIndex + colIndex].category === 'docx'
                                                &&  <DocxPreview
                                                    previewUrl={sols[listModel.leftOverIndex + colIndex].path}
                                                    width={MINI_ITEM_WIDTH}
                                                    height={MINI_ITEM_HEIGHT}
                                                    key={uuidv4()}
                                                    // activeIndex={index}
                                                    // selfIndex={currentSol}
                                                    // forceHide={openDocx}
                                                /> 
                                            }
                                        </Box>
                                        <Box sx={{display : 'flex', justifyContent : 'space-between', alignItems : 'center', mt : '20px'}}>
                                            <Box >
                                                File Size :
                                                <Box>{bytesToSize(sols[listModel.leftOverIndex + colIndex].size)}</Box>
                                            </Box>
                                            <Box>
                                                Created :
                                                <Box>{new Date(sols[listModel.leftOverIndex + colIndex].created_at).toLocaleDateString()}</Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            )
                        })
                    }
                </Box>
                    : <>
                </>
            }
        </Box>
    )
}

export default SolsList ;