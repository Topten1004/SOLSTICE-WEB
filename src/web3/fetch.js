import SOLSMarketplace from './interface/SOLSMarketplace.json' ;
import SOLSNFT from './interface/SOLSNFT.json' ;

import { ethers } from 'ethers';
import Web3 from 'web3';
import { getDecimal } from '../utils/Helper';

const solsNFT_address = SOLSNFT.address ;
const solsNFT_abi = SOLSNFT.abi ;

const marketplace_address = SOLSMarketplace.address ;
const marketplace_abi = SOLSMarketplace.abi ;

const marketplace_owner = process.env.REACT_APP_SOLSTICE_ADDR ;
const private_key = process.env.REACT_APP_SOLSTICE_PRV ;

const web3 = new Web3(new Web3.providers.HttpProvider( 'https://kovan.infura.io/v3/f957dcc0cb6c430f9d32c2c085762bdf' ));

export const FetchSupplyAmount = async (web3Provider) => {
    try {
        const signer = web3Provider.getSigner() ;
        let marketplace = new ethers.Contract(marketplace_address, marketplace_abi, signer) ;

        let supply_amount = await marketplace.fetchSupplyAmount() ;

        return Number(supply_amount.toString()) ;

    } catch(err) {
        console.log(err) ;
        return false ;
    }
}
export const FetchNFTs = async (web3Provider) => {
    try {
        const signer = web3Provider.getSigner() ;
        let marketplace = new ethers.Contract(marketplace_address, marketplace_abi, signer) ;

        let nfts = await marketplace.fetchAllNFTs() ;

        console.log(nfts) ;

        return nfts ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}
export const NFTBalance = async (nft_id, account) => {
    try {
        const etherReceiver = new web3.eth.Contract( solsNFT_abi, solsNFT_address);

        const result = await etherReceiver.methods.balanceOf(account, nft_id).call();

        return Number(result.toString()) - 1 ;
        
    } catch(err) {
        console.log(err) ;
        return  false ;
    }
}