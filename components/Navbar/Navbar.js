import React from 'react'
import styles from '../../styles/Navbar.module.css'
import { AiOutlineMenu } from 'react-icons/ai'
import Link from 'next/link'
import useWeb3 from '../../lib/useWeb3'

const Navbar = () => {
    const { web3 } = useWeb3()
    return (
        <div className={styles.container}>
            <AiOutlineMenu size={30} />
            <div className={styles.actions}>
                {!web3 &&
                    <div className={styles.connectButton}>Connect</div>}
                <Link href="/profile">
                    <img src={"https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"} style={{ height: '40px', width: '40px', borderRadius: '75%', objectFit: 'cover', }} alt="your image" /></Link>
            </div>
        </div>
    )
}

export default Navbar