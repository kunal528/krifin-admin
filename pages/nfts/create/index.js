import React, { useEffect } from 'react'
import Layout from '../../../components/Layout'
import styles from '../../../styles/Forms.module.css'
import BrowseFile from '../../../components/BrowseFile'
import useFirebase from '../../../lib/useFirebase'

const NFTCreate = () => {
    const [file, setFile] = React.useState(null)
    const [state, setState] = React.useState({
        name: '',
        city: '',
        country: '',
        description: '',
        address: '',
        collection: '',
        assetType: '',
        price: '',
        totalSupply: '',
        totalAssetValue: '',
        preTaxYield: '',
        activeEarning: '',
        stablePeriod: '',
        repaymentSession: '',
        developer: '',
        majorityShareholder: '',
        management: '',
        premium: false,
        listed: false,
    })

    const [collection, setCollection] = React.useState([])

    const { addNFT, getCollections } = useFirebase()

    const handleChange = (e) => {
        const { name, value } = e.target
        setState(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(state)
        addNFT(state, file)
    }

    useEffect(() => {
        getCollections().then(collections => {
            setCollection(collections)
        })
    }, [])
    return (
        <div className={styles.container}>
            <div className={styles.row} style={{ height: '300px' }}>
                <BrowseFile setFile={setFile} />
                {file ? <img src={URL.createObjectURL(file)} alt="preview" className={styles.preview} /> :
                    <div className={styles.preview}>Preview of the selected file here.</div>
                }
            </div>
            <div className={styles.row}>
                <input type="text" placeholder="Name" className={styles.input} name='name' onChange={handleChange} />
                <input type="text" placeholder="City" className={styles.input} name='city' onChange={handleChange} />
                <input type="text" placeholder="Country" className={styles.input} name='country' onChange={handleChange} />
            </div>
            <div className={styles.row}>
                <textarea type="text" placeholder="Description" className={styles.textarea} name='description' onChange={handleChange} />
            </div>
            <div className={styles.row}>
                <textarea type="text" placeholder="Address" className={styles.textarea} name='address' onChange={handleChange} />
            </div>
            <div className={styles.row}>
                <select className={styles.input} name='collection' onChange={handleChange}>
                    <option disabled>Collection</option>
                    {collection.map((item, index) => (
                        <option key={index} value={item.id}>{item.name}</option>
                    ))}
                </select>
                <select className={styles.input} name='assetType' onChange={handleChange}>
                    <option disabled>Asset Type</option>
                    <option value="utility">Utility</option>
                    <option value="security">Security</option>
                </select>
            </div>
            <div className={styles.row}>
                <input type="number" step={0.001} placeholder="Per NFT value" className={styles.input} name='price' onChange={handleChange} />
                <input type="number" placeholder="Quantity" className={styles.input} name='totalSupply' onChange={handleChange} />
            </div>
            <div className={styles.row}>
                <input type="text" placeholder="Total Asset value" className={styles.input} name='totalAssetValue' onChange={handleChange} />
                <input type="text" placeholder="Pre-tax yield" className={styles.input} name='preTaxYield' onChange={handleChange} />
                <select className={styles.input} name='activeEarning' onChange={handleChange}>
                    <option disabled>Active earning (AE)</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                </select>
            </div>
            <div className={styles.row}>
                <input type="text" placeholder="AE stable period" className={styles.input} name='stablePeriod' onChange={handleChange} />
                <input type="text" placeholder="Repayment session" className={styles.input} name='repaymentSession' onChange={handleChange} />
                <input type="text" placeholder="Developer" className={styles.input} name='developer' onChange={handleChange} />
            </div>
            <div className={styles.row}>
                <input type="text" placeholder="Current Majority Stakeholder" className={styles.input} name='majorityShareholder' onChange={handleChange} />
                <input type="text" placeholder="Management" className={styles.input} name='management' onChange={handleChange} />
            </div>
            <div className={styles.row}>
                <div className={styles.button} onClick={handleSubmit}>Create</div>
            </div>
        </div>
    )
}

export default NFTCreate

NFTCreate.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}