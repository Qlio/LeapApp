import { firestore } from './firebase';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const BaseUrl = 'https://us-central1-qr-payment-demo-6a1fe.cloudfunctions.net';
function App() {
    const [ qrImage, setQrImage ] = useState();
    const [ isPaid, setIsPaid ] = useState(false);
    const [ order, setOrder ] = useState({});

    const onButtonClick = async () => {
        const response = await axios.post(`${ BaseUrl }/shop_create_invoice`, order)
        const { qr, invoiceId } = response.data

        setQrImage(qr)

        firestore.doc(`invoices/${ invoiceId }`).onSnapshot((doc) => {
            if (doc.data().status === 'paid') {
                setIsPaid(true);
            }
        });
    }

    const handleInputChange = (fieldName) => {
        return (e) => {
            setOrder({
                ...order,
                [fieldName]: e.target.value,
            })
        }
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
                <form>
                    <div>
                        <input type="text" placeholder="Барааны нэр" onChange={ handleInputChange('name') }/>
                    </div>
                    <div>
                        <input type="number" placeholder="Үнэ" onChange={  handleInputChange('price') }/>
                    </div>
                    <div>
                        <textarea placeholder="Тайлбар"onChange={  handleInputChange('description') }></textarea>
                    </div>
                </form>
                <button onClick={ onButtonClick }>Click me</button>
            </header>
        </div>
    );
}

export default App;
