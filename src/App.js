import { firestore } from './firebase';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const BaseUrl = 'https://us-central1-qr-payment-demo-6a1fe.cloudfunctions.net';
// const BaseUrl = 'http://localhost:5001/qr-payment-demo-6a1fe/us-central1';
function App() {
    const [ qrImage, setQrImage ] = useState();
    const [ isPaid, setIsPaid ] = useState(false);

    const onButtonClick = async () => {
        const response = await axios.post(`${ BaseUrl }/shop_create_invoice`, {
            price: 5000,
            description: 'blabla',
            name: 'blabla'
        })
        const { qr, invoiceId } = response.data

        setQrImage(qr)

        console.log("Invoice id", invoiceId)
        firestore.doc(`invoices/${ invoiceId }`).onSnapshot((doc) => {
            console.log("Is doc exists", doc.exists, doc.id)
            if (doc.data().status === 'paid') {
                setIsPaid(true);
            }
        });

        console.log(qr)
    }

    return (
        <div className="App">
            <header className="App-header">
                {
                    isPaid ? (
                        <h1>Your order successfully paid!</h1>
                    ) : (
                        <img src={qrImage ? qrImage : logo} className="App-logo" alt="logo" />
                    )
                }
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <button onClick={ onButtonClick }>Click me</button>
            </header>
        </div>
    );
}

export default App;
