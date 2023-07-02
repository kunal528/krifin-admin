
import React from 'react'
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, deleteUser } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, serverTimestamp, setDoc, Timestamp, updateDoc } from "firebase/firestore";


const useAccess = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyAbO3hm82jPybMILvbZrAezRNZSvZITacs",
        authDomain: "krifin-marketplace.firebaseapp.com",
        projectId: "krifin-marketplace",
        storageBucket: "krifin-marketplace.appspot.com",
        messagingSenderId: "464370378394",
        appId: "1:464370378394:web:36357671c8b8ace3366123"
    };
    const app = initializeApp(firebaseConfig, 'admin app');


    async function getUsers() {
        const db = getFirestore(app)
        const collectionRef = collection(db, "users");
        var result = await getDocs(collectionRef)
        return result.docs.map(doc => {
            return {
                ...doc.data(),
            }
        }
        )
    }

    function removeUser(id) {
        const db = getFirestore(app)
        const documentRef = doc(db, "users", id);
        return deleteDoc(documentRef)
    }

    async function addUser(id, data) {
        const db = getFirestore(app)
        const documentRef = doc(db, "users", id);
        await setDoc(documentRef, { ...data, id: id, createdAt: serverTimestamp(), })
        return (await getDoc(documentRef)).data()
    }

    async function updateUser(id, data) {
        const db = getFirestore(app)
        const documentRef = doc(db, "users", id);
        await updateDoc(documentRef, { ...data, id: id, updatedAt: serverTimestamp(), })
        return (await getDoc(documentRef)).data()
    }

    async function signin(email, password) {
        const auth = getAuth(app);
        return await createUserWithEmailAndPassword(auth, email, password);
    }

    return { getUsers, removeUser, addUser, signin, updateUser }

}

export default useAccess