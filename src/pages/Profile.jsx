import { useEffect, useState, useContext } from 'react'

import { firestore } from '../firebase'
import AuthContext from '../AuthContext'

const ProfilePage = () => {
    const { user, setUser } = useContext(AuthContext);
    const [ profile, setProfile ] = useState({
        username: '',
        age: '',
    })

    useEffect(() => {
        setProfile((profile) => {
            return {
                ...profile,
                ...user,
            }
        })
    }, [user])

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            await firestore.doc(`users/${ user.uid }`).set(profile)
            setUser(profile)
        } catch(e) {
            alert('Уучлаарай алдаа гарчлаа')
            console.error(e)
        }
    }

    const handleInputChange = (field) => {
        return (e) => {
            setProfile({
                ...profile,
                [field]: e.target.value,
            })
        }
    }

    return (
        <form onSubmit={ onSubmit }>
            <h1>Profile Page</h1>
            username: <input type="text" onChange={ handleInputChange('username') } value={ profile.username } />
            age: <input type="text" onChange={ handleInputChange('age') } value={ profile.age } />
            <button type="submit">Хадгалах</button>
        </form>
    )
}

export default ProfilePage
