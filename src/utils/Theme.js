import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import * as locale from '@mui/material/locale';

import { DefaultLocale } from '../static/constants';

// colors
const GreenColor = {
    main : '#008000',
    G100 : '#4BFF2E',
    G200 : '#43D9AD',
    G300 : "#18AB56",
    G400 : '#33747a',
}

const BlueColor = {
    main : "#011627",
    B100 : "#338BEF",
    B200 : "rgba(51, 139, 239, 0.21)",
    B300 : "rgb(111, 172, 241, 0.21)",
}

const PurpleColor = {
    main : "#32499A"
}

const WarningColor = {
    main : '#b92626eb',
    WR100 : '#f3b2b2'
}

const primary = "#283646";
const secondary = "#C72127";
const background = '#F5F5F5';

// border
const BorderRadius = {
    tiny : '5px',
    small : '10px',
    medium : '15px',
    large : '25px',
    half : '50%'
}
const borderWidth = 1;
const borderColor = "#2e6da4";

// spacing
const spacing = 8;

const theme = createTheme({
    layout: {
        headerHeight : 80 ,
        contentWidth: 1140,
        footerWidth: 1400
    },
    palette: {
        green : {
            ...GreenColor
        },
        blue : {
            ...BlueColor
        },
        purple : {
            ...PurpleColor
        },
        primary: { main: primary, footer: '#055da6' },
        secondary: { main: secondary },
        common: {
        },
        warning: {
            ...WarningColor
        },
        tonalOffset: 0.2,
        background: {
            default: background,
            gray: '#f1f1f170'
        },
        spacing
    },
    border: {
        borderColor: borderColor,
        borderWidth: borderWidth,
        borderRadius : {
            ...BorderRadius
        }
    },
    overrides: {

    },
    typography: {
        fontFamily: "Montserrat",

        useNextVariants: true
    }
}, locale[DefaultLocale]);

export default responsiveFontSizes(theme);
