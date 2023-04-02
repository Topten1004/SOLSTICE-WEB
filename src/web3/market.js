import erc20Token_abi from '../constants/abis/erc20.json' ;
import { token_address } from '../constants/tokens';

import SOLSMarketplace from './interface/SOLSMarketplace.json' ;

import { ethers } from 'ethers';
import Web3 from 'web3' ;
import { getUnit, getDecimal } from '../utils/Helper';

const marketplace_address = SOLSMarketplace.address ;
const marketplace_abi = SOLSMarketplace.abi ;

const marketplace_owner = process.env.REACT_APP_SOLSTICE_ADDR ;
const private_key = process.env.REACT_APP_SOLSTICE_PRV ;

const web3 = new Web3(new Web3.providers.HttpProvider( 'https://kovan.infura.io/v3/f957dcc0cb6c430f9d32c2c085762bdf' ));

export const Payment = async (web3Provider, _to, price, price_unit) => {
    try {
        const signer = web3Provider.getSigner() ;
        const address = await signer.getAddress() ;

        let nonce = await signer.getTransactionCount() ;
        let nonce_1 = '0x' + (nonce + 1).toString(16);
        let nonce_2 = '0x' + (nonce + 2).toString(16);

        let erc20Token_address = token_address[Number(price_unit)] ;
        let erc20TokenContract = new ethers.Contract(erc20Token_address , erc20Token_abi, signer) ;

        let balance = await erc20TokenContract.balanceOf(address) ;

        let price_decimal = getDecimal(price_unit) ;

        if(Number(ethers.utils.formatUnits(balance.toString(), price_decimal)) < Number(price)) {
            return 'Inffucient ' + getUnit(price_unit) + " Balance";
        }

        let fee = Number(price) * 1 / 100 ;
        let pay_amount = Number(price) * (100 - 1) / 100 ;

        let tx = await erc20TokenContract.transfer(_to, ethers.utils.parseUnits(pay_amount.toString(), price_decimal) ,{nonce : nonce_1}) ;
        await tx.wait() ;

        tx = await erc20TokenContract.transfer(marketplace_owner, ethers.utils.parseUnits(fee.toString(), price_decimal) ,{nonce : nonce_2})
        await tx.wait() ;

        return 200 ;

    } catch(err) {
        return err?.data?.message ? err?.data?.message?.replace('VM Exception while processing transaction: revert ', '') : "You denied transaction signature" ;
    }
}

export const SellNFT = async (owner_wallet, uuid_hash, nft_id, amount) => {
    try {
        const nonce = await web3.eth.getTransactionCount(marketplace_owner, 'latest'); // nonce starts counting from 0

        const etherReceiver = new web3.eth.Contract( marketplace_abi, marketplace_address);

        const tx = {
            to : marketplace_address,
            nonce: nonce,
            gasLimit: 3141592,
            gasUsed: 21662,
            data : etherReceiver.methods.sellNFT(owner_wallet, uuid_hash, Number(nft_id), Number(amount)).encodeABI()
        }

        const signer = await web3.eth.accounts.signTransaction(tx, private_key) ;
        
        await web3.eth.sendSignedTransaction(signer.rawTransaction) ;

        return 200 ;

    }catch(err) {
        console.log(err) ;
        return false ;
    }
}