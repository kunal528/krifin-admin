import React, { useEffect } from 'react'
import Layout from '../../../components/Layout'
import useFirebase from '../../../lib/useFirebase'
import styles from '../../../styles/Forms.module.css'
import BrowseFile from '../../../components/BrowseFile'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import useWeb3 from '../../../lib/useWeb3'

const NFTDetails = () => {
    const [file, setFile] = React.useState(null)
    const [state, setState] = React.useState(null)
    const categories = [
        'Retail REITs',
        'Residential REITs',
        'Healthcare REITs',
        'Office REITs',
        'Mortgage REITs',
        'Heritage sites',
        'Cafes',
        'Restaurants',
        'Shops',
        'Amusement parks',
        'Gardens',
        'Tourist sites',
        'Library',
        'Museums',
        'Theatre',
    ]

    const [collections, setCollections] = React.useState([])

    const [payoutGroups, setPayoutGroups] = React.useState([])


    const { updateNFT, getNFT, getCollections, getPayoutGroups, updateFile  } = useFirebase()

    const { updateNFT: changeNFT } = useWeb3()
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(state)
        if (file) {
            await toast.promise(updateFile(file, state.image), {
                pending: 'Updating file...',
                success: 'File updated successfully',
                error: 'Error updating file'
            })
        }
        await toast.promise(changeNFT(state.id, state.price, state.payoutGroup), {
            pending: 'Updating NFT...',
            success: 'NFT updated successfully',
            error: 'Error updating NFT'
        })
        await toast.promise(updateNFT(state), {
            pending: 'Updating NFT...',
            success: 'NFT updated successfully',
            error: 'Error updating NFT'
        })
        router.push('/nfts')
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
        getPayoutGroups().then((payoutGroups) => {
            setPayoutGroups(payoutGroups)
        })
    }, [id])

    if (!state) {
        return <div>Loading...</div>
    }
    return (
        <div className={styles.container}>
            <div className={styles.row}>
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
                <input type="text" placeholder="State" className={styles.input} name='state' onChange={handleChange} disabled={!editMode} value={state.state} />
                <input type="text" placeholder="Pincode" className={styles.input} name='pincode' onChange={handleChange} disabled={!editMode} value={state.pincode} />
                <input type="text" placeholder="APY" className={styles.input} name='apy' onChange={handleChange} disabled={!editMode} value={state.apy} />
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
                <select className={styles.input} name='category' onChange={handleChange} disabled={!editMode} value={state.category}>
                    <option disabled>Category</option>
                    {categories.map((item, index) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
                <select className={styles.input} name='assetType' onChange={handleChange} disabled={!editMode} value={state.assetType}>
                    <option disabled>Asset Type</option>
                    <option value="utility">Utility</option>
                    <option value="security">Security</option>
                </select>
            </div>
            <div className={styles.row}>
                <input type="number" step={0.001} placeholder="Per NFT value" className={styles.input} name='price' onChange={handleChange} disabled value={state.price} />
                <input type="number" placeholder="Quantity" className={styles.input} name='totalSupply' onChange={handleChange} disabled={!editMode} value={state.totalSupply} />
                <select className={styles.input} name='payoutGroup' onChange={handleChange} disabled={!editMode} value={state.payoutGroup}>
                    <option disabled>Category</option>
                    {payoutGroups.map((item, index) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
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