import { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import firebase from '../firebase'

import '../styles/login.scss'

const LoginPage = ({ user }) => {
    const [ value, setValue ] = useState('')
    const [ isSent, setIsSent ] = useState(false)
    const recaptchaVerifier = useRef()
    const confirmationResult = useRef()
    const history = useHistory()

    useEffect(() => {
        recaptchaVerifier.current = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            size: 'invisible',
        });
    }, [])

    useEffect(() => {
        if (user.uid) {
            history.push('/')
        }
    }, [user, history])

    const onSignInSubmit = async () => {
        try {
            const phoneNumber = `+976${ value }`
            confirmationResult.current = await firebase.auth()
                .signInWithPhoneNumber(phoneNumber, recaptchaVerifier.current)
            setValue('')
            setIsSent(true)
        } catch (error) {
            console.error(error)
        }
    }

    const checkConfirmationCode = async () => {
        try {
            await confirmationResult.current.confirm(value)
        } catch(e) {
            alert('Зөв код оруулна уу')
        }
    }

    const onSubmit = async (e) => {
        if (!isSent) {
            await onSignInSubmit();
        } else {
            await checkConfirmationCode()
        }
    }

    return (
        <div className="login-page">
            <div id="recaptcha-container"></div>
            <input type="number" onChange={ (e) => setValue(e.target.value) } />
            <button id="sign-in-button" type="submit" onClick={ onSubmit }>Нэвтрэх</button>
            <button type="submit" onClick={ onSubmit }>Баталгаажуулах</button>
        </div>
    )
}

export default LoginPage
