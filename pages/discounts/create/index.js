import React, { useEffect } from 'react'
import Layout from '../../../components/Layout'
import styles from '../../../styles/Forms.module.css'
import BrowseFile from '../../../components/BrowseFile'
import useFirebase from '../../../lib/useFirebase'
import { IoIosClose } from 'react-icons/io'

const NFTCreate = () => {
    const [file, setFile] = React.useState(null)
    const [state, setState] = React.useState({
        name: '',
        description: '',
        discount: '',
        address: []
    })

    const [addresses, setAddresses] = React.useState([])


    const { addDiscount } = useFirebase()

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


    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(state)
        const airdrop = {
            name: state.name,
            description: state.description,
            // create a set of state.address, then convert it back to an array
            address: [...new Set([...state.address, ...addresses])],
        }
        addDiscount(airdrop, file)
    }

    return (
        <div className={styles.container} >
            <div className={styles.row} style={{ height: '300px' }}>
                <BrowseFile setFile={setFile} />
                {file ? <img src={URL.createObjectURL(file)} alt="preview" className={styles.preview} /> :
                    <div className={styles.preview}>Preview of the selected file here.</div>
                }
            </div>
            <div className={styles.row}>
                <input type="text" placeholder="Name" className={styles.input} name='name' onChange={handleChange} />
                <input type="number" placeholder="Discount" className={styles.input} name='discount' onKeyDown={handleChange} />
                <input type="text" placeholder="Address" className={styles.input} name='' onKeyDown={handleAddress} />
            </div>
            <div className={styles.row} style={{ gap: '10px' }}>
                {addresses.map((address, index) => (
                    <div key={index} className={styles.address}>
                        {address}
                        <IoIosClose onClick={() => setAddresses(prevState => prevState.filter((_, i) => i !== index))} />
                    </div>
                ))}
            </div>
            <div className={styles.row}>
                <textarea type="text" placeholder="Description" className={styles.textarea} name='description' onChange={handleChange} />
            </div>
            <div className={styles.row}>
                <div className={styles.button} onClick={handleSubmit}>Next</div>
            </div>
        </div >
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