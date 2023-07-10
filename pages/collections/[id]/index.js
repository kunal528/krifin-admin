import React, { useEffect } from 'react'
import Layout from '../../../components/Layout'
import useFirebase from '../../../lib/useFirebase'
import styles from '../../../styles/Forms.module.css'
import BrowseFile from '../../../components/BrowseFile'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

const Details = () => {
    const [file, setFile] = React.useState(null)
    const [state, setState] = React.useState(null)


    const { updateCollection, getCollection, updateFile } = useFirebase()

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
        if (file) {
            await toast.promise(updateFile(file, state.image), {
                pending: 'Updating file...',
                success: 'File updated successfully',
                error: 'Error updating file'
            })
        }
        console.log(state)
        await toast.promise(updateCollection(state), {
            pending: 'Updating Collection...',
            success: 'Collection updated successfully',
            error: 'Error updating Collection'
        })
        router.push('/collections')
    }

    useEffect(() => {
        if (id) {
            console.log(id)
            getCollection(id).then((nft) => {
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
            </div>
            <div className={styles.row}>
                <textarea type="text" placeholder="Description" className={styles.textarea} name='description' onChange={handleChange} disabled={!editMode} value={state.description} />
            </div>
            {editMode && <div className={styles.row}>
                <div className={styles.button} onClick={handleSubmit}>Update</div>
            </div>}
        </div>
    )
}

export default Details

Details.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}