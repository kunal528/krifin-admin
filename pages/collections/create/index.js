import React from 'react'
import Layout from '../../../components/Layout'
import BrowseFile from '../../../components/BrowseFile'
import useFirebase from '../../../lib/useFirebase'
import styles from '../../../styles/Forms.module.css'
import { toast } from 'react-toastify'

const Create = () => {
    const [file, setFile] = React.useState(null)
    const [state, setState] = React.useState({
        name: '',
        description: '',
    })

    const { addCollection } = useFirebase()

    const router = useRouter()

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
        await toast.promise(
            addCollection(state, file), {
            pending: 'Creating Collection...',
            success: 'Collection created successfully',
            error: 'Error creating Collection'
        })
        router.push('/collections')
    }
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
            </div>
            <div className={styles.row}>
                <textarea type="text" placeholder="Description" className={styles.textarea} name='description' onChange={handleChange} />
            </div>
            <div className={styles.row}>
                <div className={styles.button} onClick={handleSubmit}>Create</div>
            </div>
        </div>
    )
}

export default Create

Create.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}