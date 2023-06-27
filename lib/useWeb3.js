import { useEffect, useState } from "react";
import getWeb3 from "./getWeb3";

export default function useWeb3() {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const init = async () => {
            const web3 = await getWeb3();
            setWeb3(web3);
        };
        if (!web3)
            init();
        if (web3) {
            getAccount();
        }
    }
        , [web3]);

    const getAccount = async () => {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
    }

    return { web3 }
}