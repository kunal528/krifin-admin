import React, { useEffect } from 'react'
import Layout from '../../../components/Layout'
import useFirebase from '../../../lib/useFirebase'
import styles from '../../../styles/Forms.module.css'
import BrowseFile from '../../../components/BrowseFile'
import { useRouter } from 'next/router'

const NFTDetails = () => {
    const [file, setFile] = React.useState(null)
    const [state, setState] = React.useState(null)

    const [collections, setCollections] = React.useState([])


    const { updateNFT, getNFT, getCollections } = useFirebase()

    const router = useRouter();

    const { id, edit } = router.query;

    const [editMode, setEditMode] = React.useState(edit === 'true')


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
        updateNFT(state)
    }

    useEffect(() => {
        if (id) {
            console.log(id)
            getNFT(id).then((nft) => {
                setState(nft)
            })
        }
        getCollections().then((collections) => {
            setCollections(collections)
        })
    }, [id])

    if (!state) {
        return <div>Loading...</div>
    }
    return (
        <div className={styles.container}>
            <div className={styles.row} style={{ height: '300px' }}>
                {editMode && <BrowseFile setFile={setFile} />}
                {(state.image || file) ? <img src={file ? URL.createObjectURL(file) : state.image} alt="preview" className={styles.preview} /> :
                    <div className={styles.preview}>Preview of the selected file here.</div>
                }
            </div>
            <div className={styles.row}>
                <input type="text" placeholder="Name" className={styles.input} name='name' onChange={handleChange} disabled={!editMode} value={state.name} />
                <input type="text" placeholder="City" className={styles.input} name='city' onChange={handleChange} disabled={!editMode} value={state.city} />
                <input type="text" placeholder="Country" className={styles.input} name='country' onChange={handleChange} disabled={!editMode} value={state.country} />
            </div>
            <div className={styles.row}>
                <textarea type="text" placeholder="Description" className={styles.textarea} name='description' onChange={handleChange} disabled={!editMode} value={state.description} />
            </div>
            <div className={styles.row}>
                <textarea type="text" placeholder="Address" className={styles.textarea} name='address' onChange={handleChange} disabled={!editMode} value={state.address} />
            </div>
            <div className={styles.row}>
                <select className={styles.input} name='collection' onChange={handleChange} disabled={!editMode} value={state.collection}>
                    <option disabled>Collection</option>
                    {
                        collections.map((collection) => {
                            return <option key={collection.id} value={collection.id}>{collection.name}</option>
                        })
                    }
                </select>
                <select className={styles.input} name='assetType' onChange={handleChange} disabled={!editMode} value={state.assetType}>
                    <option disabled>Asset Type</option>
                    <option value="utility">Utility</option>
                    <option value="security">Security</option>
                </select>
            </div>
            <div className={styles.row}>
                <input type="number" step={0.001} placeholder="Per NFT value" className={styles.input} name='price' onChange={handleChange} disabled={!editMode} value={state.price} />
                <input type="number" placeholder="Quantity" className={styles.input} name='totalSupply' onChange={handleChange} disabled={!editMode} value={state.totalSupply} />
            </div>
            <div className={styles.row}>
                <input type="text" placeholder="Total Asset value" className={styles.input} name='totalAssetValue' onChange={handleChange} disabled={!editMode} value={state.totalAssetValue} />
                <input type="text" placeholder="Pre-tax yield" className={styles.input} name='preTaxYield' onChange={handleChange} disabled={!editMode} value={state.preTaxYield} />
                <select className={styles.input} name='activeEarning' onChange={handleChange} disabled={!editMode} value={state.activeEarning}>
                    <option disabled>Active earning (AE)</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                </select>
            </div>
            <div className={styles.row}>
                <input type="text" placeholder="AE stable period" className={styles.input} name='stablePeriod' onChange={handleChange} disabled={!editMode} value={state.stablePeriod} />
                <input type="text" placeholder="Repayment session" className={styles.input} name='repaymentSession' onChange={handleChange} disabled={!editMode} value={state.repaymentSession} />
                <input type="text" placeholder="Developer" className={styles.input} name='developer' onChange={handleChange} disabled={!editMode} value={state.developer} />
            </div>
            <div className={styles.row}>
                <input type="text" placeholder="Current Majority Stakeholder" className={styles.input} name='majorityShareholder' onChange={handleChange} disabled={!editMode} value={state.majorityShareholder} />
                <input type="text" placeholder="Management" className={styles.input} name='management' onChange={handleChange} disabled={!editMode} value={state.management} />
            </div>
            {editMode && <div className={styles.row}>
                <div className={styles.button} onClick={handleSubmit}>Update</div>
            </div>}
        </div>
    )
}

export default NFTDetails

NFTDetails.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}