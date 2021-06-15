const qrcode = require('qrcode')
const cors = require('cors')({ origin: true });
const axios = require('axios')
const functions = require('firebase-functions');

const admin = require('firebase-admin')
admin.initializeApp()

const baseUrl = 'https://us-central1-qr-payment-demo-6a1fe.cloudfunctions.net/somefunction'
exports.shop_create_invoice = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        const db = admin.firestore()
        const invoice = await db.collection('invoices').add({
            name: 'some name',
        });

        axios.post('', {
            invoiceId: invoice.id
        })
    })
});

exports.somefunction = functions.https.onRequest(async (request, response) => {
    const db = admin.firestore()
    const { invoiceId } = request.query
    functions.logger.log('invoiceId', invoiceId)

    await db.doc(`invoices/${ invoiceId }`).set({
        status: 'paid',
    }, {
        merge: true,
    })

    response.send({
        status: 'succes'
    })
});
