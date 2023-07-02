import React, { useEffect } from "react";
import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import styles from "../../styles/Forms.module.css";
import useAccess from "../../lib/useAccess";
import { toast } from "react-toastify";
const UserDialog = ({ visible, closeHandler, user }) => {

    const [state, setState] = React.useState({
        name: '',
        email: '',
        password: '',
        role: 'super admin'
    })

    const { signin, addUser, updateUser } = useAccess()

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        const { name, email, password, role } = state
        const user = await toast.promise(signin(email, password), {
            pending: 'Creating account...',
            success: 'Account created successfully',
            error: 'Error creating account'
        })
        if (user) {
            const newUser = await toast.promise(addUser(user.user.uid, { name, email, role }), {
                pending: 'Creating user...',
                success: 'User created successfully',
                error: 'Error creating user'
            })
        }
        closeHandler()
    }

    const handleUpdate = async () => {
        const { name, email, role } = state
        const newUser = await toast.promise(updateUser(user.id, { name, role }), {
            pending: 'Updating user...',
            success: 'User updated successfully',
            error: 'Error updating user'
        })
        closeHandler()
    }


    useEffect(() => {
        if (user) {
            setState(user)
        }
    }, [user])

    return (
        <Modal
            closeButton
            aria-labelledby="modal-title"
            open={visible}
            onClose={closeHandler}
        >
            <Modal.Header>
                <Text id="modal-title" size={18}>
                    Add User
                </Text>
            </Modal.Header>
            <Modal.Body>
                <input type="text" placeholder="Name" className={styles.input} name='name' onChange={handleChange} value={state.name}/>
                <input type="text" placeholder="Email" className={styles.input} name='email' onChange={handleChange} disabled={user} value={state.email}/>
                {!user && <input type="password" placeholder="Password" className={styles.input} name='password' onChange={handleChange} />}
                <select onChange={handleChange} name="role" className={styles.input} value={state.role}>
                    <option value="super admin">Super Admin</option>
                    <option value="admin">Admin</option>
                </select>
            </Modal.Body>
            <Modal.Footer>
                <Button auto flat color="error" onPress={closeHandler}>
                    Close
                </Button>
                <Button auto onPress={user ? handleUpdate :handleSubmit}>
                    {user ? 'Update' : 'Create'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UserDialog