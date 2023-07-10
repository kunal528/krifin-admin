import React, { useEffect } from 'react'
import Navbar from './Navbar/Navbar'
import Sidebar from './Sidebar/Sidebar'
import Head from 'next/head'
import styles from '../styles/Layout.module.css'

const Layout = ({ children }) => {
    const [visible, setVisible] = React.useState(true)
    useEffect(() => {
        if (window.innerWidth > 768) {
            setVisible(false)
        }
        else {
            setVisible(true)
        }
        window.addEventListener('resize', (e) => {
            if (window.innerWidth > 768) {
                setVisible(false)
            }
            else {
                setVisible(true)
            }
        }
        )

    }, [])
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
            <Navbar setOpen={setVisible} />
            <Sidebar open={visible} setOpen={() => {
                setVisible(val => !val)
            }} />
            <div className={styles.app} style={{ marginLeft: visible ? '0px' : '300px' }}>
                {children}
            </div>
        </div>
    )
}

export default Layout