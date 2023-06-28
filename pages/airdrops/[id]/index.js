import React, { useEffect } from 'react'
import Layout from '../../../components/Layout'
import useFirebase from '../../../lib/useFirebase'
import styles from '../../../styles/Forms.module.css'
import BrowseFile from '../../../components/BrowseFile'
import { useRouter } from 'next/router'
import { IoIosClose } from 'react-icons/io'
import useWeb3 from '../../../lib/useWeb3'

const NFTDetails = () => {
    const [file, setFile] = React.useState(null)
    const [state, setState] = React.useState(null)



    const { updateAirdrop, getAirdrop } = useFirebase()

    const { mintAirdrop } = useWeb3();

    const router = useRouter();

    const [addresses, setAddresses] = React.useState([])

    const { id, edit } = router.query;

    const [editMode, setEditMode] = React.useState(edit === 'true')


    const handleChange = (e) => {
        const { name, value } = e.target
        setState(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleAddress = (e) => {
        if (e.key !== 'Enter') return
        const { value } = e.target
        // remove duplicates
        if (state.address.find((val) => val == value)) return
        if (addresses.find((val) => val == value)) return
        console.log(value)
        setAddresses(prevState => [...prevState, value])
        e.target.value = ''
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(state)
        const airdrop = {
            id: state.id,
            name: state.name,
            description: state.description,
            // create a set of state.address, then convert it back to an array
            address: [...new Set([...state.address, ...addresses])],
        }
        await updateAirdrop(airdrop)
        mintAirdrop(id, addresses);
    }

    useEffect(() => {
        if (id) {
            console.log(id)
            getAirdrop(id).then((nft) => {
                setState(nft)
            })
        }
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
                <input type="text" placeholder="Address" className={styles.input} name='' onKeyDown={handleAddress} disabled={!editMode} />
            </div>
            <div className={styles.row} style={{ gap: '10px' }}>
                {state.address.map((address, index) => (
                    <div key={index} className={styles.address}>
                        {address}
                    </div>
                ))}
                {addresses.map((address, index) => (
                    <div key={index} className={styles.address}>
                        {address}
                        <IoIosClose onClick={() => setAddresses(prevState => prevState.filter((_, i) => i !== index))} />
                    </div>
                ))}
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