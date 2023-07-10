import React from 'react'
import styles from '../../styles/Navbar.module.css'
import { AiOutlineMenu } from 'react-icons/ai'
import Link from 'next/link'
import useWeb3 from '../../lib/useWeb3'

const Navbar = ({ setOpen }) => {
    const { web3, account } = useWeb3()
    return (
        <div className={styles.container}>
            <AiOutlineMenu size={30} onClick={() => setOpen(val => !val)} />
            <div className={styles.actions}>
                {web3 && account ? <div className={styles.connectButton}>
                    {account.slice(0, 6)}...{account.slice(-4)}
                </div>
                    : <div className={styles.connectButton}>Connect</div>}
                <Link href="/profile">
                    <img src={"https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"} style={{ height: '40px', width: '40px', borderRadius: '75%', objectFit: 'cover', }} alt="your image" /></Link>
            </div>
        </div>
    )
}

export default Navbar