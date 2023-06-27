import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
import useFirebase from '../lib/useFirebase'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const { getUserProfile, streamUser, logout } = useFirebase()
  const [user, setUser] = useState()

  useEffect(() => {
    streamUser((user) => {
      if (user) {
        getUserProfile().then((profile) => {
          setUser(profile)
        })
      }
    })
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.welcome}>Welcome, {user && user.name}</div>
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Create NFTs</div>
          <div className={styles.cardContent}>
            Create your first NFT item of Real Estate.
          </div>
          <Link href="/nfts" className={styles.cardButton}>Create NFT</Link>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Sell NFTs</div>
          <div className={styles.cardContent}>
            Sell your NFTs to the world.
          </div>
          <Link href="/sell" className={styles.cardButton}>Create Order</Link>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Logout</div>
          <div className={styles.cardContent}>
            Logout from your account.
          </div>
          <div className={styles.cardOutlinedButton} onClick={logout}>Logout</div>
        </div>
      </div>
    </div>
  )
}


Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
