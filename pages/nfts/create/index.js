import React, { useEffect } from 'react'
import Layout from '../../../components/Layout'
import styles from '../../../styles/Forms.module.css'
import BrowseFile from '../../../components/BrowseFile'
import useFirebase from '../../../lib/useFirebase'
import useWeb3 from '../../../lib/useWeb3'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

const NFTCreate = () => {
    const [file, setFile] = React.useState(null)
    const categories = [
        "Farms",
        "Farm Estates",
        "Coffee Estate",
        "Orchards",
        "Vineyards",
        "Fiber farms",
        "Forestry plantations",
        "Timber plantations",
        "Bamboo plantations",
        "Rubber plantations",
        "Palm oil plantations",
        "Sugar cane plantations",
        "Cotton plantations",
        "Tea plantations",
        "Cacao plantations",
        "Herb medicinal plantations",
        "Fruit plantations",
        "Flower plantations",
        "Cannabis farms",
        "Maple sugar farms",
        "Wildflower farms",
        "Agritourism farms",
        "Educational farms",
        "Ecotourism farms",
        "Research farms",
        "Rehabilitation farms",
        "Sustainable farms",
        "Organic farms",
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
    const [state, setState] = React.useState({
        name: '',
        city: '',
        country: '',
        state: '',
        pincode: '',
        description: '',
        address: '',
        collection: '',
        assetType: 'Utility',
        price: '',
        payoutGroup: '1',
        category: categories[0],
        totalSupply: '',
        totalAssetValue: '',
        preTaxYield: '',
        activeEarning: 'Yes',
        stablePeriod: '',
        repaymentSession: '',
        developer: '',
        majorityShareholder: '',
        management: '',
        apy: '',
        premium: false,
        listed: false,
    })
    const router = useRouter()

    const [collection, setCollection] = React.useState([])
    const [payoutGroups, setPayoutGroups] = React.useState([])


    const { addNFT, getCollections, getPayoutGroups } = useFirebase()
    const { mint, listNFT } = useWeb3()

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
        var tokenId = await toast.promise(addNFT(state, file), {
            pending: 'Creating NFT...',
            success: 'NFT created successfully',
            error: 'Error creating NFT'
        })
        if (!tokenId) return
        await toast.promise(mint(state.totalSupply), {
            pending: 'Minting NFT...',
            success: 'NFT minted successfully',
            error: 'Error minting NFT'
        })
        await toast.promise(listNFT(tokenId, state.totalSupply, state.price, state.payoutGroup), {
            pending: 'Listing NFT...',
            success: 'NFT listed successfully',
            error: 'Error listing NFT'
        })
        // go to the nft page
        router.push(`/nfts`)

    }

    useEffect(() => {
        getCollections().then(collections => {
            setCollection(collections)
        })
        getPayoutGroups().then(payoutGroups => {
            setPayoutGroups(payoutGroups)
        })
    }, [])
    return (
        <div className={styles.container}>
            <div className={styles.row}>
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
                <input type="text" placeholder="State" className={styles.input} name='state' onChange={handleChange} />
                <input type="text" placeholder="Pincode" className={styles.input} name='pincode' onChange={handleChange} />
                <input type="text" placeholder="APY" className={styles.input} name='apy' onChange={handleChange} />
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
                <select className={styles.input} name='category' onChange={handleChange}>
                    <option disabled>Category</option>
                    {categories.map((item, index) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
                <select className={styles.input} name='assetType' onChange={handleChange}>
                    <option disabled>Asset Type</option>
                    <option value="Utility">Utility</option>
                    <option value="Security">Security</option>
                </select>
            </div>
            <div className={styles.row}>
                <input type="number" step={0.001} placeholder="Per NFT value" className={styles.input} name='price' onChange={handleChange} />
                <input type="number" placeholder="Quantity" className={styles.input} name='totalSupply' onChange={handleChange} />
                <select className={styles.input} name='payoutGroup' onChange={handleChange}>
                    <option disabled>Category</option>
                    {payoutGroups.map((item, index) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
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