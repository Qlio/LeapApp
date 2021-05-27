import { useEffect, useState } from 'react'

import { firestore } from '../firebase'

const ProfilePage = ({ user, setUser }) => {
    const [ profile, setProfile ] = useState({
        name: '',
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
            name: <input type="text" onChange={ handleInputChange('name') } value={ profile.name } />
            age: <input type="text" onChange={ handleInputChange('age') } value={ profile.age } />
            <button type="submit">Хадгалах</button>
        </form>
    )
}

export default ProfilePage
