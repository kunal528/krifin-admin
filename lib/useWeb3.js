import { useEffect, useState } from "react";
import getWeb3 from "./getWeb3";
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
    const fnftAddress = "0xA5d3526a4A7c8636C705406519b6849D30fC6806";
    const marketplaceAddress = "0x1415f894b155B31FB84aF9e88114bF0443dD2D8b";
    const discountAddress = "0x96b23Df2c0dcB34E035A06719B0B0B5DE19c334a";
    const secondaryMarketplaceAddress = "0xE1b98135A59Ea59fa0c5444539C9720946fff9E7";
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    useEffect(() => {
        const init = async () => {
            const web3 = await getWeb3();
            setWeb3(web3);
        }
        if (!web3) {
            init();
        }
        if (web3) {
            getAccount();
            getAirdropContract();
            getFnftContract();
            getMarketplaceContract();
            getDiscountContract();
        }
    }
        , [web3]);

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

    const getSales = async () => {
        var response = await fetch("https://api-testnet.polygonscan.com/api?module=logs&action=getLogs&address=" + marketplaceAddress + "&topic0=0x041bfe3082d481c8f62f6ed145f1d8cbec0daebcb4d750ae5c42a51946551d13&apikey=" + apiKey)
        var res = await response.json();
        res.result = res.result.reverse();
        var sales = res.result.map((sale, index) => {
            const id = index + 1;
            const price = web3.utils.fromWei(parseInt(sale.data.substring(2, 66), 16).toString(), 'ether');
            const quantity = parseInt(sale.data.substring(66, 130), 16);
            const timestamp = parseInt(sale.timeStamp, 16);
            const from = "0x" + sale.topics[2].substring(26);
            const tokenId = parseInt(sale.topics[1], 16);
            const hash = sale.transactionHash;
            const saleObj = { id, price, quantity, timestamp, from, tokenId, hash };
            return saleObj;
        })
        return sales;

        // get the NFTSale event from the marketplace contract
    }

    const getSecondarySales = async () => {
        var response = await fetch("https://api-testnet.polygonscan.com/api?module=logs&action=getLogs&address=" + secondaryMarketplaceAddress + "&topic0=0x2495de287d9a3f2752f486b8d322283e113b944afd440197cec3d064ad0ee79a&apikey=" + apiKey)
        var res = await response.json();
        res.result = res.result.reverse();
        var sales = res.result.map((sale, index) => {
            const id = index + 1;
            const tokenId = parseInt(sale.data.substring(2, 66), 16)
            const quantity = parseInt(sale.data.substring(66, 130), 16);
            const price = web3.utils.fromWei(parseInt(sale.data.substring(130, 194), 16).toString(), 'ether');
            const timestamp = parseInt(sale.timeStamp, 16);
            const from = "0x" + sale.topics[1].substring(26);
            const hash = sale.transactionHash;
            const saleObj = { id, price, quantity, timestamp, from, tokenId, hash };
            return saleObj;
        })
        return sales;
    }

    // add all the functions you want to use in your app
    const mint = async (totalSupply) => {
        await fnftContract.methods.mint(totalSupply, "").send({ from: account });
    }

    const listNFT = async (tokenId, quantity, price, payoutId) => {
        console.log("listing");
        price = web3.utils.toWei(price.toString(), 'ether');
        await marketplaceContract.methods.listNFT(tokenId, quantity, price, payoutId).send({ from: account });
        console.log("listed");
    }

    const putNFTOnSale = async (tokenId) => {

        marketplaceContract.methods.putNFTOnSale(tokenId).send({ from: account });
        // const result = await marketplaceContract.methods.putNFTOnSale(tokenId).send({ from: account });
    }

    const removeNFTFromSale = async (tokenId) => {
        const result = await marketplaceContract.methods.removeNFTFromSale(tokenId).send({ from: account });
    }

    const updateNFT = async (tokenId, price, payoutId) => {
        price = web3.utils.toWei(price.toString(), 'ether');
        const result = await marketplaceContract.methods.updateNFT(tokenId, price, payoutId).send({ from: account });
    }

    const delistNFT = async (tokenId) => {
        const result = await marketplaceContract.methods.delistNFT(tokenId).send({ from: account });
    }

    const createPayoutGroup = async (id,addresses, percentages) => {
        const result = await marketplaceContract.methods.createPayoutGroup(id,addresses, percentages).send({ from: account });
    }

    const updatePayoutGroup = async (payoutId, addresses, percentages) => {
        const result = await marketplaceContract.methods.updatePayoutGroup(payoutId, addresses, percentages).send({ from: account });
    }

    const deletePayoutGroup = async (payoutId) => {
        const result = await marketplaceContract.methods.removePayoutGroup(payoutId).send({ from: account });
    }

    const mintAirdrop = async (tokenId, addresses) => {
        airdropContract.methods.distributeAirdrop(addresses, tokenId).send({ from: account });
        // const result = await airdropContract.methods.distributeAirdrop(addresses, tokenId).send({ from: account });
    }

    const mintDiscount = async (tokenId, addresses, discount) => {
        await discountContract.methods.setDiscount(tokenId, discount).send({ from: account });
        const result = await discountContract.methods.distributeDiscountCoupon(addresses, tokenId).send({ from: account });
    }



    return { web3, account, fnftContract, marketplaceContract, airdropContract, discountContract, mint, listNFT, putNFTOnSale, removeNFTFromSale, mintAirdrop, mintDiscount, getSales, getSecondarySales, createPayoutGroup, updatePayoutGroup, deletePayoutGroup, delistNFT, updateNFT }
}