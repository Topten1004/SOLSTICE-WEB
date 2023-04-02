import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { connect } from 'react-redux' ;
import PropTypes from 'prop-types' ;
import { SignInWithGoogle } from '../../redux/actions/auth';

import Loading from 'react-loading-components';

import swal from 'sweetalert';

import GoogleImage from '../../assets/auth/Google.png' ;

import {
    Button
} from '@mui/material' ;

import { makeStyles, useTheme } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    buttonCss : {
        background : 'white !important',
        color : 'black !important',
        borderRadius : '30px !important',
        textTransform : 'capitalize !important',
        fontSize : '20px !important'
    }
})) ;
const GoogleLoginButton = (props) => {
    const classes = useStyles() ;
    const navigate = useNavigate() ;
    const theme = useTheme() ;

    const {
        SignInWithGoogle,
        text
    } = props ;

    const [loading, setLoading] = React.useState(false) ;

    const handleSignIn = async () => {
        setLoading(true) ;

        let res = await SignInWithGoogle() ;

        if( res === 'internal_user' || res === 'external_user' || res === 'new_user') {
            if(
                await swal({
                    title: "Let's get building!",
                    buttons: {
                        confirm : {text:'Got it'},
                    },
                    icon : 'success'
                })
            ) {
                setLoading(false) ;
                navigate('/solstice/setting-screen') ;
            }
        }
        if( res === 'error' ) {
            setLoading(false) ;
            await swal({
                title: 'Error',
                text: 'Your Sign In is failed',
                buttons: {
                    confirm : {text:'Got it'},
                },
                icon : 'error'
            }) ;
        }
    };

    return (
        <Button variant={'contained'} onClick={handleSignIn} startIcon={loading ? <Loading type='oval' width={30} height={30} fill={theme.palette.green.G200} /> : <img src={GoogleImage} width={40}/>} className={classes.buttonCss} fullWidth>
            <span className="buttonText">{text}</span>
        </Button>
    );
}
GoogleLoginButton.propTypes = {
    SignInWithGoogle : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
})
const mapDispatchToProps = {
    SignInWithGoogle
}
export default connect(mapStateToProps, mapDispatchToProps)(GoogleLoginButton);