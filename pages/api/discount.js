var admin = require("firebase-admin");

var serviceAccount = require("../../lib/serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
}, "discount");

export default function handler(req, res) {
    const id = req.query.id
    const db = admin.firestore()
    const documentRef = db.collection('discounts').doc(id);
    documentRef.get().then((doc) => {
        if (doc.exists) {
            const data = doc.data()
            res.status(200).json({
                name: data.name,
                description: data.description,
                image: data.image,
                attributes: [
                    {
                        "trait_type": "Discount",
                        "value": data.discount
                    },
                ]
            })
        } else {
            res.status(404).json({ error: 'Not found' })
        }
    }).catch((error) => {
        res.status(404).json({ error: 'Not found' })
    });
}
