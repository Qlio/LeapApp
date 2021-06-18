const qrcode = require('qrcode')
const cors = require('cors')({ origin: true });
const axios = require('axios')
const functions = require('firebase-functions');

const admin = require('firebase-admin')
admin.initializeApp()

const BaseUrl = 'https://us-central1-qr-payment-demo-6a1fe.cloudfunctions.net'

// Shop section
exports.shop_create_invoice = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        const db = admin.firestore();
        const invoice = await db.collection('invoices').add(request.body);

        const { qr } = (
            await axios.post(`${ BaseUrl }/bank_qr_generate`, {
                invoiceId: invoice.id,
                price: request.body.price,
                callback: `${ BaseUrl }/shop_callback`,
            })
        ).data;

        response.send({
            qr,
            invoiceId: invoice.id,
        })
    })
});

exports.shop_callback = functions.https.onRequest(async (request, response) => {
    const { invoiceId } = request.body;
    const db = admin.firestore();

    await db.doc(`invoices/${ invoiceId }`).set({
        status: 'paid',
    }, { merge: true })

    response.send('successful')
})


// Bank section
exports.bank_qr_generate = functions.https.onRequest(async (request, response) => {
    const db = admin.firestore();
    const { invoiceId, price, callback } = request.body;

    await db.doc(`bank-invoices/${ invoiceId }`).set({ price, callback })

    qrcode.toDataURL(`${ BaseUrl }/bank_callback?invoiceId=${ invoiceId }`, (err, code) => {
        if(err) return console.log('error occurred')

        response.send({ qr: code });
    })
});

exports.bank_callback = functions.https.onRequest(async (request, response) => {
    const db = admin.firestore()
    const { invoiceId } = request.query

    const invoice = await db.doc(`bank-invoices/${ invoiceId }`).get()
    const { callback: callbackUrl } = invoice.data()

    await axios.post(callbackUrl, { invoiceId })

    await db.doc(`bank-invoices/${ invoiceId }`).set({
        status: 'paid',
    }, {
        merge: true,
    })

    response.send('<h1>Successfully paid! Please go to shop.</h1>')
});
