import SOLSMarketplace from './interface/SOLSMarketplace.json' ;

import { ethers } from 'ethers';
import Web3 from 'web3' ;
import { getDecimal } from '../utils/Helper';

const marketplace_address = SOLSMarketplace.address ;
const marketplace_abi = SOLSMarketplace.abi ;

const marketplace_owner = process.env.REACT_APP_SOLSTICE_ADDR ;
const private_key = process.env.REACT_APP_SOLSTICE_PRV ;

const web3 = new Web3(new Web3.providers.HttpProvider( 'https://kovan.infura.io/v3/f957dcc0cb6c430f9d32c2c085762bdf' ));

export const MintNFT = async ( creator_wallet, solstice_id_hash, nft_type, nft_price, resell_price, amount, royalty, resell, nft_uri, price_unit) => {
    try {
        const nonce = await web3.eth.getTransactionCount(marketplace_owner, 'latest'); // nonce starts counting from 0

        const marketplaceContract = new web3.eth.Contract( marketplace_abi, marketplace_address);

        let decimal = getDecimal(price_unit) ;

        let _nft_price = ethers.utils.parseUnits(nft_price.toString(), decimal ) ;
        let _resell_price = ethers.utils.parseUnits(resell_price.toString(), decimal ) ;
        let _royalty = ethers.utils.parseUnits(royalty.toString(), 'ether') ;

        const tx = {
            to : marketplace_address,
            nonce: nonce,
            gasLimit: 3141592,
            gasUsed: 21662,
            data : marketplaceContract.methods.mintNFT({
                creator_used_wallet : creator_wallet,
                creator_uuid_hash : solstice_id_hash,
                nft_type : Number(nft_type),
                nft_price : _nft_price,
                resell_price : _resell_price,
                minted_amount : Number(amount),
                royalty : _royalty,
                resell : resell,
                uri : nft_uri
            }).encodeABI()
        }

        const signer = await web3.eth.accounts.signTransaction(tx, private_key) ;
        
        let receipt = await web3.eth.sendSignedTransaction(signer.rawTransaction) ;
        
        let eventNFTListed = [] ;

        while(1) {
            eventNFTListed = await marketplaceContract.getPastEvents('NFTListed', {
                fromBlock: receipt.blockNumber,
                toBlock: receipt.blockNumber
            }) ;

            console.log(eventNFTListed) ;

            if(eventNFTListed.length) break ;
        }
        
        // let nft_id = await receipt?.events?.filter(e => e.event === 'NFTListed')[0]?.args[0];
        // let new_nft_id = receipt?.logs?.filter(log => log.event === 'NFTListed')[0]?.args[0] ;

        return Number(Object.entries(eventNFTListed[0].returnValues)[0][1].toString()) ;

    } catch(err) {
        console.log(err) ;
        return 'error' ;
    }
}