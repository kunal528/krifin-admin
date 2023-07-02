import React from 'react'
import styles from '../../styles/Settings.module.css'
import Layout from '../../components/Layout'
import Link from 'next/link'
import { FiUsers } from 'react-icons/fi'
const Settings = () => {

    return (
        <div className={styles.container}>
            <div className={styles.cards}>
                <Link href={'/settings/users'} className={styles.card}>
                    <FiUsers size={40} />
                    <div>
                        <div className={styles.cardTitle}>Users</div>
                        <div className={styles.cardContent}>Manage users</div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Settings

Settings.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    );
}