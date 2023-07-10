import React, { useEffect } from "react";
import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import styles from "../../styles/Forms.module.css";
import { toast } from "react-toastify";
import { MdOutlineCancel } from 'react-icons/md'
import useFirebase from "../../lib/useFirebase";
import useWeb3 from "../../lib/useWeb3";
const PayoutDialog = ({ visible, closeHandler, group }) => {

    const [state, setState] = React.useState({
        name: '',
        users: [
            {
                address: '0x3Cb980F7B295651Ae7dd21CB363c358bFE3aAbDf',
                percentage: 40,
            }
        ]
    })

    const { addPayoutGroup, updatePayoutGroup } = useFirebase()

    const { createPayoutGroup, updatePayoutGroup: update  } = useWeb3()



    const handleSubmit = async () => {
        const tokenId = await toast.promise(addPayoutGroup(state), {
            pending: 'Creating payout group...',
            success: 'Payout group created successfully',
            error: 'Error creating payout group'
        })
        await toast.promise(createPayoutGroup(tokenId, state.users.map(u => u.address), state.users.map(u => u.percentage)), {
            pending: 'Creating payout group...',
            success: 'Payout group created successfully',
            error: 'Error creating payout group'
        })
        closeHandler()
    }

    const handleUpdate = async () => {
        const newUser = await toast.promise(updatePayoutGroup(state), {
            pending: 'Updating payout group...',
            success: 'Payout group updated successfully',
            error: 'Error updating payout group'
        })
        await toast.promise(update(group.id,state.users.map(u => u.address), state.users.map(u => u.percentage)), {
            pending: 'Updating payout group...',
            success: 'Payout group updated successfully',
            error: 'Error updating payout group'
        })
        closeHandler()
    }


    useEffect(() => {
        if (group) {
            setState(group)
        }
    }, [group])

    return (
        <Modal
            closeButton
            aria-labelledby="modal-title"
            open={visible}
            onClose={closeHandler}
            width="500px"
        >
            <Modal.Header>
                <Text id="modal-title" size={18}>
                    Add User
                </Text>
            </Modal.Header>
            <Modal.Body>
                <input type="text" placeholder="Name" className={styles.input} name='name' onChange={(e) => {
                    setState(val => {
                        return {
                            ...val,
                            name: e.target.value
                        }
                    })
                }} value={state.name} />
                {
                    state.users.map((user, index) => (
                        <div key={index} className={styles.row}>
                            <input type="text" placeholder="Address" className={styles.input} disabled={index == 0} name='address' onChange={(e) => {
                                setState(val => {
                                    return {
                                        ...val,
                                        users: val.users.map((u, i) => {
                                            if (i == index) {
                                                return {
                                                    ...u,
                                                    address: e.target.value
                                                }
                                            }
                                            return u
                                        })
                                    }
                                })
                            }} value={user.address} />
                            <input type="number" min={0} max={100} placeholder="Percentage" className={styles.input} name='percentage' style={{ maxWidth: '100px' }} onChange={(e) => {
                                setState(val => {
                                    return {
                                        ...val,
                                        users: val.users.map((u, i) => {
                                            if (i == index) {
                                                return {
                                                    ...u,
                                                    percentage: parseFloat(e.target.value)
                                                }
                                            }
                                            return u
                                        })
                                    }
                                })
                            }} value={user.percentage} />
                            <MdOutlineCancel size={24} color="#F4256D" onClick={() => {
                                if (index == 0) return alert('Cannot remove the owner');
                                const users = state.users.filter((u, i) => i !== index)
                                setState({
                                    ...state,
                                    users
                                })
                            }} />
                        </div>
                    ))
                }
                <Button auto flat css={{
                    w: '40%'
                }} onClick={() => {
                    setState({
                        ...state,
                        users: [
                            ...state.users,
                            {
                                address: '',
                                percentage: 0,
                            }
                        ]
                    })
                }}>
                    Add User
                </Button>
            </Modal.Body>
            <Modal.Footer>
                <Button auto flat color="error" onPress={closeHandler}>
                    Close
                </Button>
                <Button auto onPress={group ? handleUpdate : handleSubmit}>
                    {group ? 'Update' : 'Create'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PayoutDialog