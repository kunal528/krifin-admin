import React from 'react'
import Navbar from './Navbar/Navbar'
import Sidebar from './Sidebar/Sidebar'
import Head from 'next/head'
import styles from '../styles/Layout.module.css'

const Layout = ({ children }) => {
    return (
        <div>
            <Head>
                <title>Krifin Marketplace</title>
                <meta name="description" content="Krifin Marketplace" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@100;200;300;400;500;600;700;800;900&family=Manjari:wght@400;700&display=swap" rel="stylesheet" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <Sidebar />
            <div className={styles.app}>
                {children}
            </div>
        </div>
    )
}

export default Layout