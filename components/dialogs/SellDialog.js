import { Button, Checkbox, Input, Modal, Row, Text } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import useFirebase from '../../lib/useFirebase';
import styles from '../../styles/Forms.module.css'

const SellDialog = ({ open, onClose }) => {

    const [nfts, setNfts] = useState([])

    const { getNFTsByListing, updateNFT } = useFirebase();

    const [selectedNFT, setSelectedNFT] = useState(null)

    const closeHandler = () => {
        onClose()
    }

    useEffect(() => {
        getNFTsByListing(false).then((nfts) => {
            console.log(nfts)
            setNfts(nfts)
        });
    }, [])

    const handleSubmit = (e) => {
        updateNFT({ ...selectedNFT, listed: true, }).then(() => {
            closeHandler()
        })
    }

    const handleChange = (e) => {
        setSelectedNFT(nfts.find((nft) => nft.id === e.target.value))
    }

    return (
        <Modal
            closeButton
            preventClose
            open={open}
            onClose={closeHandler}
        >
            <Modal.Header>
                <Text id="modal-title" size={18}>
                    Sell Order
                </Text>
            </Modal.Header>
            <Modal.Body>
                <select onChange={handleChange} className={styles.input}>
                    <option disabled>Select NFT</option>
                    {nfts.map((nft) => (
                        <option key={nft.id} value={nft.id}>{nft.name}</option>
                    ))}
                </select>
            </Modal.Body>
            <Modal.Footer>
                <Button auto flat color="error" onPress={closeHandler}>
                    Close
                </Button>
                <Button auto onPress={handleSubmit}>
                    Next
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default SellDialog