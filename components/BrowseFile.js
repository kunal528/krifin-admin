import React from 'react'
import FilePicker from './FilePicker'
import styles from '../styles/BrowseFile.module.css'

const BrowseFile = ({ setFile, file }) => {
    const [dragging, setDragging] = React.useState(false)

    return (
        <div className={styles.uploadAsset + `${dragging ? styles.dragging : ''}`} onDragOver={
            (e) => {
                e.preventDefault()
                setDragging(true)
            }
        }
            onDragLeave={
                (e) => {
                    e.preventDefault()
                    setDragging(false)
                }
            }
            onDrop={
                (e) => {
                    e.preventDefault()
                    setDragging(false)
                    const files = e.dataTransfer.files
                    if (files.length > 0) {
                        setFile(files[0])
                    }
                }
            }
        >
            <div className={styles.uploadText}>Drag & Drop 3D Model Here</div>
            <div className={styles.uploadText} style={{ fontSize: '16px' }}>Or</div>
            <FilePicker accept="image/*" onChange={(file) => {
                setFile(file)
            }} >
                <div className={styles.fileButton}>Select File</div>
            </FilePicker>
        </div>
    )
}

export default BrowseFile