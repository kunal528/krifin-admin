import { useEffect, useState } from "react";
import getWeb3WithMetamask, { getWeb3 } from "./getWeb3";
import { AIRDROPABI, FNFTABI, MARKETPLACEABI, DISCOUNTABI } from "./contractABI";
import useFirebase from "./useFirebase";

export default function useWeb3() {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [airdropContract, setAirdropContract] = useState(null);
    const [fnftContract, setFnftContract] = useState(null);
    const [marketplaceContract, setMarketplaceContract] = useState(null);
    const [discountContract, setDiscountContract] = useState(null);
    const airdropAddress = "0x4166D860F77bF73C436B01b1550EDdef4Fb6495c";
    const fnftAddress = "0x4043e6ECc97cE9857a837C5B2F99573d8e83bf54";
    const marketplaceAddress = "0x3A7061Ba3c346986819E74a36E8178b324E9055e";
    const discountAddress = "0xd8ea158eBd0aC6B98bEF5a62F59bBAFC559C6e08";
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
    const { getUser, getUserProfile } = useFirebase();
    const [user, setUser] = useState(null);

    useEffect(() => {
        console.log("useWeb3");
        if (!user)
            getUserProfile().then((user) => {
                if (user) setUser(user);
                if (user && user.role == "super admin") {
                    const web3 = getWeb3();
                    // set the private key
                    const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
                    web3.eth.accounts.wallet.add(account);
                    web3.eth.defaultAccount = account.address;
                    setAccount(account);
                    setWeb3(web3);
                }
            });
        if (web3) {
            console.log("web3");
            getAirdropContract();
            getFnftContract();
            getMarketplaceContract();
            getDiscountContract();
        }
    }
        , [web3, user]);

    const getAccount = async () => {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
    }

    const getAirdropContract = () => {
        const contract = getContract(AIRDROPABI, airdropAddress);
        setAirdropContract(contract);
        return contract;
    }

    const getFnftContract = () => {
        const contract = getContract(FNFTABI, fnftAddress);
        setFnftContract(contract);
        return contract;
    }

    const getMarketplaceContract = () => {
        const contract = getContract(MARKETPLACEABI, marketplaceAddress);
        setMarketplaceContract(contract);
        return contract;
    }

    const getDiscountContract = () => {
        const contract = getContract(DISCOUNTABI, discountAddress);
        setDiscountContract(contract);
        return contract;
    }


    const getContract = (abi, address) => {
        const contract = new web3.eth.Contract(abi, address);
        return contract;
    }

    // add all the functions you want to use in your app
    const mint = async (totalSupply) => {
        console.log("minting");
        const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = 300000;
        const txObject = {
            from: account.address,
            to: fnftAddress,
            gas: web3.utils.toHex(gasLimit),
            gasPrice: web3.utils.toHex(gasPrice),
            data: fnftContract.methods.mint(totalSupply, "").encodeABI()
        }
        const signedTx = await web3.eth.accounts.signTransaction(txObject, account.privateKey);
        const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("minted");
    }

    const listNFT = async (tokenId, quantity, price) => {
        console.log("listing");
        // price will be in eth convert to wei
        price = web3.utils.toWei(price.toString(), 'ether');
        const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = 300000;
        const txObject = {
            from: account.address,
            to: marketplaceAddress,
            gas: web3.utils.toHex(gasLimit),
            gasPrice: web3.utils.toHex(gasPrice),
            data: marketplaceContract.methods.listNFT(tokenId, quantity, price).encodeABI()
        }
        const signedTx = await web3.eth.accounts.signTransaction(txObject, account.privateKey);
        const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("listed");
    }

    const putNFTOnSale = async (tokenId) => {
        const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = 300000;
        console.log(marketplaceContract);
        const txObject = {
            from: account.address,
            to: marketplaceAddress,
            gas: web3.utils.toHex(gasLimit),
            gasPrice: web3.utils.toHex(gasPrice),
            data: marketplaceContract.methods.putNFTOnSale(tokenId).encodeABI()
        }
        console.log(txObject)
        const signedTx = await web3.eth.accounts.signTransaction(txObject, account.privateKey);
        const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        // const result = await marketplaceContract.methods.putNFTOnSale(tokenId).send({ from: account });
    }

    const removeNFTFromSale = async (tokenId) => {
        console.log(web3);
        const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = 300000;
        const marketplaceContract = await getMarketplaceContract();
        const txObject = {
            from: account.address,
            to: marketplaceAddress,
            gas: web3.utils.toHex(gasLimit),
            gasPrice: web3.utils.toHex(gasPrice),
            data: marketplaceContract.methods.removeNFTFromSale(tokenId).encodeABI()
        }
        const signedTx = await web3.eth.accounts.signTransaction(txObject, account.privateKey);
        const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        // const result = await marketplaceContract.methods.removeNFTFromSale(tokenId).send({ from: account });
    }

    const mintAirdrop = async (tokenId, addresses) => {
        const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = 300000;
        const txObject = {
            from: account.address,
            to: airdropAddress,
            gas: web3.utils.toHex(gasLimit),
            gasPrice: web3.utils.toHex(gasPrice),
            data: airdropContract.methods.distributeAirdrop(addresses, tokenId).encodeABI()
        }
        const signedTx = await web3.eth.accounts.signTransaction(txObject, account.privateKey);
        const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        // const result = await airdropContract.methods.distributeAirdrop(addresses, tokenId).send({ from: account });
    }

    const mintDiscount = async (tokenId, addresses, discount) => {
        const discountContract = await getDiscountContract();
        // discount will be in eth convert to wei
        discount = web3.utils.toWei(discount.toString(), 'ether');
        tokenId = parseInt(tokenId);
        // create batch of two transactions
        const gasPrice = await web3.eth.getGasPrice();
        console.log(tokenId, discount, addresses)
        console.log(discountContract)
        const gasLimit = 300000;
        const txObject1 = {
            from: account.address,
            to: discountAddress,
            gas: web3.utils.toHex(gasLimit),
            gasPrice: web3.utils.toHex(gasPrice),
            data: discountContract.methods.distributeDiscountCoupon(addresses, tokenId).encodeABI()
        }
        const txObject2 = {
            from: account.address,
            to: discountAddress,
            gas: web3.utils.toHex(gasLimit),
            gasPrice: web3.utils.toHex(gasPrice),
            data: discountContract.methods.setDiscount(tokenId, discount).encodeABI()
        }
        const signedTx1 = await web3.eth.accounts.signTransaction(txObject1, account.privateKey);
        const signedTx2 = await web3.eth.accounts.signTransaction(txObject2, account.privateKey);
        const result1 = await web3.eth.sendSignedTransaction(signedTx1.rawTransaction);
        const result2 = await web3.eth.sendSignedTransaction(signedTx2.rawTransaction);

        // await discountContract.methods.setDiscount(tokenId, discount).send({ from: account });
        // const result = await discountContract.methods.distributeDiscountCoupon(addresses, tokenId).send({ from: account });
    }



    return { web3, mint, listNFT, putNFTOnSale, removeNFTFromSale, mintAirdrop, mintDiscount }
}