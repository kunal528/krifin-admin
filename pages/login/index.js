import React, { useState } from 'react'
import styles from '../../styles/Login.module.css'
import useFirebase from '../../lib/useFirebase'
import { toast } from 'react-toastify'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, getUserProfileByEmail } = useFirebase()
    const handleSubmit = async (e) => {
        e.preventDefault()
        var docRef = document.getElementsByTagName('inputs');
        for (var i = 0; i < docRef.length; i++) {
            var input = docRef[i];
            var validate = input.reportValidity();
            if (!validate) {
                return;
            }
        }
        var result = await getUserProfileByEmail(email);
        console.log(result)
        if (result.length > 0 && (result[0].role === 'super admin' || result[0].role === 'admin')) {
            login(email, password).catch((error) => {
                toast.error(error.message)
            });
        }
        else {
            toast.error('You are not an admin');
        }
    }
    return (
        <div className={styles.app}>
            <div className={styles.container}>
                <img src='/logo.png' alt='logo' className={styles.logo} />
                <input type='text' placeholder='Username' className={styles.input} onChange={(e) => setEmail(e.target.value)} />
                <input type='password' placeholder='Password' className={styles.input} onChange={(e) => setPassword(e.target.value)} />
                <div className={styles.button} onClick={async () => {
                    await toast.promise(handleSubmit(), {
                        pending: 'Logging in...',
                        success: 'Logged in successfully',
                        error: 'Error logging in'
                    })
                }}>Login</div>
            </div>
        </div>
    )
}

export default Login