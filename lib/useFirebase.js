import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, serverTimestamp, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, uploadBytes, getStorage, ref } from 'firebase/storage'
import { useState } from "react";

const useFirebase = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyAbO3hm82jPybMILvbZrAezRNZSvZITacs",
        authDomain: "krifin-marketplace.firebaseapp.com",
        projectId: "krifin-marketplace",
        storageBucket: "krifin-marketplace.appspot.com",
        messagingSenderId: "464370378394",
        appId: "1:464370378394:web:36357671c8b8ace3366123"
    };
    const app = initializeApp(firebaseConfig);
    function init() {

        return (getFirestore(app))
    }

    async function getNFTs() {
        const db = init()
        const collectionRef = collection(db, "nfts");
        var result = await getDocs(collectionRef)
        return result.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id
            }
        })
    }

    async function getNFTsByListing(value) {
        console.log('getNFTsByListing')
        const db = init()
        const collectionRef = collection(db, "nfts");
        const q = query(collectionRef, where("listed", "==", value));
        var result = await getDocs(q)
        console.log(result.docs)
        return result.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id
            }
        })
    }

    async function getCollections() {
        const db = init()
        const collectionRef = collection(db, "collections");
        var result = await getDocs(collectionRef)
        return result.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id
            }
        })
    }

    async function getAirdrops() {
        const db = init()
        const collectionRef = collection(db, "airdrops");
        var result = await getDocs(collectionRef)
        return result.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id
            }
        })
    }
    async function getDiscounts() {
        const db = init()
        const collectionRef = collection(db, "discounts");
        var result = await getDocs(collectionRef)
        return result.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id
            }
        })
    }

    async function getPayoutGroups() {
        const db = init()
        const collectionRef = collection(db, "payoutGroups");
        var result = await getDocs(collectionRef)
        return result.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id
            }
        })
    }

    async function getNFT(id) {
        const db = init()
        const documentRef = doc(db, "nfts", id);
        var result = await getDoc(documentRef)
        return {
            ...result.data(),
            id: result.id
        }
    }

    async function getCollection(id) {
        const db = init()
        const documentRef = doc(db, "collections", id);
        var result = await getDoc(documentRef)
        return {
            ...result.data(),
            id: result.id
        }
    }

    async function getAirdrop(id) {
        const db = init()
        const documentRef = doc(db, "airdrops", id);
        var result = await getDoc(documentRef)
        return {
            ...result.data(),
            id: result.id
        }
    }
    async function getDiscount(id) {
        const db = init()
        const documentRef = doc(db, "discounts", id);
        var result = await getDoc(documentRef)
        return {
            ...result.data(),
            id: result.id
        }
    }

    async function getPayoutGroup(id) {
        const db = init()
        const documentRef = doc(db, "payoutGroups", id);
        var result = await getDoc(documentRef)
        return {
            ...result.data(),
            id: result.id
        }
    }

    async function updateNFT(nft) {
        console.log(nft)
        const db = init()
        const documentRef = doc(db, "nfts", nft.id);
        var result = await updateDoc(documentRef, { ...nft, updatedAt: serverTimestamp(), updatedBy: getUser().uid })
    }

    async function updateCollection(collection) {
        const db = init()
        const documentRef = doc(db, "collections", collection.id);
        var result = await updateDoc(documentRef, { ...collection, updatedAt: serverTimestamp(), updatedBy: getUser().uid })
    }

    async function updateAirdrop(airdrop) {
        const db = init()
        const documentRef = doc(db, "airdrops", airdrop.id);
        var result = await updateDoc(documentRef, { ...airdrop, updatedAt: serverTimestamp(), updatedBy: getUser().uid })
    }
    async function updateDiscount(airdrop) {
        const db = init()
        const documentRef = doc(db, "discounts", airdrop.id);
        var result = await updateDoc(documentRef, { ...airdrop, updatedAt: serverTimestamp(), updatedBy: getUser().uid })
    }

    async function updatePayoutGroup(payoutGroup) {
        const db = init()
        const documentRef = doc(db, "payoutGroups", payoutGroup.id);
        var result = await updateDoc(documentRef, { ...payoutGroup, updatedAt: serverTimestamp(), updatedBy: getUser().uid })
    }

    async function getLatestID(val) {
        const db = init()
        const collectionRef = collection(db, val);
        var result = await getDocs(collectionRef)
        if (result.docs.length == 0) return 0;
        var ids = result.docs.map(doc => {
            return parseInt(doc.id);
        })
        return Math.max(...ids)
    }



    async function addNFT(nft, file) {
        const db = init()
        const url = await storeFile(file, 'nfts/')
        console.log(url)
        const collectionRef = collection(db, "nfts");
        const tokenId = (await getLatestID("nfts")) + 1
        console.log(tokenId)
        const docRef = doc(db, "nfts", tokenId.toString());
        var result = await setDoc(docRef, { ...nft, image: url, createdAt: serverTimestamp(), createdBy: getUser().uid, id: tokenId })
        return tokenId;
    }

    async function addCollection(data, file) {
        const db = init()
        const url = await storeFile(file, 'collections/')
        console.log(url)
        const collectionRef = collection(db, "collections");
        const tokenId = (await getLatestID("collections")) + 1
        console.log(tokenId)
        const docRef = doc(db, "collections", tokenId.toString());
        var result = await setDoc(docRef, { ...data, image: url, createdAt: serverTimestamp(), createdBy: getUser().uid, id: tokenId })
    }

    async function addAirdrop(data, file) {
        const db = init()
        const url = await storeFile(file, 'airdrops/')
        const collectionRef = collection(db, "airdrops");
        const tokenId = (await getLatestID("airdrops")) + 1
        const docRef = doc(db, "airdrops", tokenId.toString());
        var result = await setDoc(docRef, { ...data, image: url, createdAt: serverTimestamp(), createdBy: getUser().uid, id: tokenId })
        return tokenId;
    }

    async function addDiscount(data, file) {
        const db = init()
        const url = await storeFile(file, 'discounts/')
        const collectionRef = collection(db, "discounts");
        const tokenId = (await getLatestID("discounts")) + 1
        const docRef = doc(db, "discounts", tokenId.toString());
        var result = await setDoc(docRef, { ...data, image: url, createdAt: serverTimestamp(), createdBy: getUser().uid, id: tokenId })
        return tokenId;
    }

    async function addPayoutGroup(data) {
        const db = init()
        const collectionRef = collection(db, "payoutGroups");
        const tokenId = (await getLatestID("payoutGroups")) + 1
        const docRef = doc(db, "payoutGroups", tokenId.toString());
        var result = await setDoc(docRef, { ...data, createdAt: serverTimestamp(), createdBy: getUser().uid, id: tokenId })
        return tokenId;
    }

    async function deletePayoutGroup(id) {
        const db = init()
        const documentRef = doc(db, "payoutGroups", id);
        var result = await deleteDoc(documentRef)
    }

    async function deleteNFT(id) {
        const db = init()
        const documentRef = doc(db, "nfts", id);
        var result = await deleteDoc(documentRef)
    }


    async function storeFile(file, path) {
        console.log(file.name)
        const storage = getStorage(app);
        const storageRef = ref(storage, path + file.name);
        console.log(storageRef)
        const uploadTask = await uploadBytes(storageRef, file);
        console.log(uploadTask.ref)
        return await getDownloadURL(uploadTask.ref);
    }

    async function updateFile(file, url) {
        const storage = getStorage(app);
        const storageRef = ref(storage, url);
        console.log(storageRef)
        const uploadTask = await uploadBytes(storageRef, file);
        console.log(uploadTask.ref)
        return await getDownloadURL(uploadTask.ref);
    }


    async function login(email, password) {
        const auth = getAuth(app);
        const user = await signInWithEmailAndPassword(auth, email, password);
        return user;
    }

    async function logout() {
        const auth = getAuth(app);
        return signOut(auth);
    }

    function getUser() {
        const auth = getAuth(app);
        return auth.currentUser;
    }

    async function getUserProfile() {
        const db = init();
        let user = getUser();
        if (!user) {
            while (true) {
                await new Promise(r => setTimeout(r, 500));
                user = getUser();
                if (user)
                    break;
            }
        }
        console.log(user)
        const documentRef = doc(db, "users", user.uid);
        console.log("getting user profile")
        return (await getDoc(documentRef)).data()
    }

    async function getUserProfileByEmail(email) {
        const db = init();
        const collectionRef = collection(db, "users");
        var q = query(collectionRef, where("email", "==", email));
        var result = await getDocs(q)
        return result.docs.map(doc => {
            return doc.data()
        })
    }

    async function streamUser(callback) {
        const auth = getAuth(app);
        onAuthStateChanged(auth, callback)
    }


    return { login, logout, getUser, streamUser, getUserProfile, getUserProfileByEmail, getNFTs, getNFT, updateNFT, addNFT, getCollections, getCollection, updateCollection, addCollection, getNFTsByListing, getAirdrops, getAirdrop, updateAirdrop, addAirdrop, getDiscounts, getDiscount, updateDiscount, addDiscount, getPayoutGroups, getPayoutGroup, updatePayoutGroup, addPayoutGroup, deletePayoutGroup, updateFile, deleteNFT }
}


export default useFirebase