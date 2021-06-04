import { useEffect } from 'react'
import { Switch, Route, useHistory, Link } from 'react-router-dom'

import HomePage from './pages/Home'
import LoginPage from './pages/Login'
import ProfilePage from './pages/Profile'
import FriendRequestsPage from './pages/FriendRequests'

import AuthContext from './AuthContext'

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
    }, [user])


    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            console.log("TODO: Auth state changed")
            if (!user) { // Not logged in
                setUser({})
                history.replace('/login')
                setIsLoading(false);
                return;
            }

            const doc = await firestore.doc(`users/${ user.uid }`).get()
            const newUserState = {
                uid: user.uid,
                phone: user.phoneNumber,
                ...(doc.data() || {}),
            }
            setUser(newUserState);

            if (!newUserState.username) {
                history.replace('/profile')
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
        <div>
            <nav>
                <Link to="/home">Home</Link>
                <Link to="/profile">Profile</Link>
            </nav>
            <AuthContext.Provider value={{ user, setUser }}>
                <Switch>
                    <Route path="/login">
                        <LoginPage />
                    </Route>
                    <Route path="/profile">
                        <ProfilePage />
                    </Route>
                    <Route path="/friend-requests">
                        <FriendRequestsPage />
                    </Route>
                    <Route path="/">
                        <HomePage />
                    </Route>
                </Switch>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
