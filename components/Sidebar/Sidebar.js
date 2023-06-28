import React from 'react'
import styles from '../../styles/Sidebar.module.css'
import Link from 'next/link'
import { IoIosArrowDown, IoIosArrowUp, } from 'react-icons/io'
import { RxCross2 } from 'react-icons/rx'
import useFirebase from '../../lib/useFirebase'

const Sidebar = () => {
    const [revenue, setRevenue] = React.useState(false)
    const { logout } = useFirebase()
    return (
        <div className={styles.container}>
            <img src="/logo.png" alt="logo" className={styles.logo} />
            <div className={styles.menu}>
                <Link href="/" className={styles.menuItem}>Dashboard</Link>
                <Link href="/nfts" className={styles.menuItem}>Create</Link>
                <Link href="/sell" className={styles.menuItem}>Sell Order</Link>
                <Link href="/airdrops" className={styles.menuItem}>Airdrops</Link>
                <Link href="/discounts" className={styles.menuItem}>Discounts</Link>
                <Link href="/collections" className={styles.menuItem}>Collection</Link>
                {/* Create a toggle list in revenue */}
                <div>
                    <div className={styles.menuItemTitle} onClick={() => { setRevenue(val => !val) }}>Revenue {revenue ? <IoIosArrowUp /> : <IoIosArrowDown />}</div>
                    {revenue && <div className={styles.subMenu}>
                        <Link href="" className={styles.subMenuItem}>Primary Sales</Link>
                        <Link href="" className={styles.subMenuItem}>Secondary Sales</Link>
                    </div>}
                </div>
                {/* Create a sub item */}
                <Link href="" className={styles.menuItem}>Settings</Link>
                <div className={styles.menuItem} onClick={logout}>Logout</div>
            </div>


        </div>
    )
}

export default Sidebar