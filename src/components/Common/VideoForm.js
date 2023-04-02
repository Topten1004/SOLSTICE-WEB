import React, { useState, useEffect, useRef, lazy } from 'react' ;

// import ReactPlayer from 'react-player';
import YouTube from 'react-youtube';

import { connect } from 'react-redux' ;

import {
    Box,
    Button,
    useMediaQuery
} from '@mui/material' ;

import { makeStyles } from '@mui/styles' ;

const useStyles = makeStyles(() => ({
    root : {
    },
    videoForm : {
        width : props => props.width,
        height : props => props.height,

        "& .MuiButton-root" : {
            width : '100px',
            borderRadius : 20,
            textTransform : 'capitalize'
        },
    },
}))

const VideoForm = (props) => {

    const  {
        width,
        height,
        url
    } = props ;

    const classes = useStyles(props) ;
    
    const videoRef = useRef() ;

    const [videoUrl, setVideoUrl] = useState(null);
    const [isYoutube, setIsYoutube] = useState(null);
    const [opts, setOpts] = useState(null);
    const [youtubeId, setYoutubeId] = useState(null);

    const YouTubeGetID = (url) => {
        url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
     }

    useEffect(() => {
        if(url) {
            var isYoutube = url && url.match(/(?:youtu|youtube)(?:\.com|\.be)\/([\w\W]+)/i);
            setIsYoutube(isYoutube);

            if(isYoutube){
                setYoutubeId( YouTubeGetID(url));
                setOpts ( {
                    height: height,
                    width: width,
                    playerVars: {
                    // https://developers.google.com/youtube/player_parameters
                    url,
                    autoplay: 1,
                    },
                });
            }
            try {
                videoRef.current?.load();
                const playPromis = videoRef.current?.play();
                if(playPromis !== undefined) {
                    playPromis
                    .then(_ => {
                    })
                    .catch(error => {
                    });
                }
            } catch(err) {
            }   
        }

    }, [url]) ;

    return (
        <Box className={classes.videoForm}>
            {
                isYoutube ?
                <YouTube videoId={youtubeId} opts={opts}/>
                :
                <Box component={'video'} width={width} height={height} controls ref={videoRef} muted playsInline preload='metadata' >
                    <Box component={'source'} src={url} type="video/mp4"/>
                </Box>
            }
            
        </Box>
        
    )
}

VideoForm.propTypes = {

}

const mapStateToProps = state => ({
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoForm)