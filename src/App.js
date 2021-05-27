import { useEffect } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'

import HomePage from './pages/Home'
import LoginPage from './pages/Login'
import ProfilePage from './pages/Profile'
import FriendRequestsPage from './pages/FriendRequests'

import firebase, { firestore } from './firebase'

import './styles/main.scss';
import { useState } from 'react'

const App = () => {
    const [ user, setUser ] = useState({});
    const [ isLoading, setIsLoading ] = useState(true)
    const history = useHistory()

    useEffect(() => {
        if (user) {
            const onSuccess = (position) => {
                console.log(position.coords.latitude, position.coords.longitude)
            }
            const onError = (e) => {
                console.log(e)
            }
            window.navigator.geolocation.getCurrentPosition(onSuccess, onError)
        }
    }, [])


    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                setUser({})
                history.replace('/login')
                setIsLoading(false);
                return
            }

            const doc = await firestore.doc(`users/${ user.uid }`).get()
            setUser({
                uid: user.uid,
                phone: user.phoneNumber,
                ...(doc.data() || {}),
            });

            if (!user.name) {
                // history.replace('/profile')
            }

            setIsLoading(false);
        });

        return () => {
            unsubscribe()
        }
    }, [history]);

    if (isLoading) {
        return (
            <h1>Please wait...</h1>
        )
    }

    return (
        <Switch>
            <Route path="/login">
                <LoginPage user={ user } />
            </Route>
            <Route path="/profile">
                <ProfilePage user={ user } setUser={ setUser } />
            </Route>
            <Route path="/friend-requests">
                <FriendRequestsPage user={ user } />
            </Route>
            <Route path="/">
                <HomePage user={ user } />
            </Route>
        </Switch>
    );
}

export default App;
