var admin = require("firebase-admin");

var serviceAccount = require("../../lib/serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
},);

const db = admin.firestore()
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    const id = req.query.id
    const documentRef = db.collection('nfts').doc(id);
    documentRef.get().then((doc) => {
        if (doc.exists) {
            const data = doc.data()
            const attributes = doc.data();
            delete attributes.name;
            delete attributes.description;
            delete attributes.image;
            delete attributes.listed;
            delete attributes.id;
            delete attributes.createdBy;
            delete attributes.createdAt;
            delete attributes.updatedBy;
            delete attributes.updatedAt;
            res.status(200).json({
                name: data.name,
                description: data.description,
                image: data.image,
                attributes: Object.keys(attributes).map(key => {
                    return {
                        "trait_type": key,
                        "value": attributes[key]
                    }
                }
                )
            })
        } else {
            res.status(404).json({ error: 'Not found' })
        }
    }).catch((error) => {
        res.status(404).json({ error: 'Not found' })
    });
}
