var admin = require("firebase-admin");

var serviceAccount = require("../../lib/serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default function handler(req, res) {
    const id = req.query.id
    const db = admin.firestore()
    const documentRef = db.collection('nfts').doc(id);
    documentRef.get().then((doc) => {
        if (doc.exists) {
            const data = doc.data()
            const attributes = data;
            delete attributes.name;
            delete attributes.description;
            delete attributes.image;
            delete attributes.listed;
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
