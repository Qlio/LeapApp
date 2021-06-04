import { useContext, useEffect, useRef, useState } from 'react'
import AuthContext from '../AuthContext'

import { firestore } from '../firebase'

import '../styles/home.scss'

const GOOGLE_API_KEY = 'AIzaSyDD1bL9fKZ3r1YsNSBNd7kWwVyW3F4FkV4'
const ulaanbaatar = { lat: 47.919067, lng: 106.9175938 };

const HomePage = () => {
    const { user } = useContext(AuthContext);
    const [ positions, setPositions ] = useState([]);
    const mapElementRef = useRef();
    const mapRef = useRef();

    useEffect(() => {
        const watchId = window.navigator.geolocation.watchPosition(({ coords: { latitude: lat, longitude: lng }, timestamp }) => {
            firestore.doc(`tracking/${ user.uid }`).set({
                position: { lat, lng },
                username: user.username,
                timestamp,
            })
        })
        return () => {
            window.navigator.geolocation.clearWatch(watchId);
        }
    }, [user])

    useEffect(() => {
        const markers = positions.map(({ position, username, image }) => {
            return new window.google.maps.Marker({
                position,
                label: username,
                icon: {
                    url: image || 'https://developers.google.com/maps/images/maps-icon.svg',
                    scaledSize: {
                        width: 50,
                        height: 50,
                    },
                },
                map: mapRef.current,
            })
        })

        return () => {
            markers.forEach((marker) => {
                marker.setMap(null);
            })
        }
    }, [positions])

    const onGoogleMapLoad = () => {
        mapRef.current = new window.google.maps.Map(mapElementRef.current, {
            center: ulaanbaatar,
            zoom: 8,
        });

        const before5min = Date.now() - 300000
        firestore.collection('tracking').where('timestamp', '>', before5min).onSnapshot((querySnapshot) => {
            const _positions = [];
            querySnapshot.forEach((doc) => {
                _positions.push(doc.data())
            })
            setPositions(_positions)
        })
    }

    useEffect(() => {
        if (window.google) {
            onGoogleMapLoad()
            return;
        }

        const googleMapScript = document.createElement('script');
        googleMapScript.src=`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
        googleMapScript.async = true;
        window.document.body.appendChild(googleMapScript);
        googleMapScript.addEventListener('load', onGoogleMapLoad);
    }, [])

    return (
        <div className="home-page">
            <div ref={ mapElementRef } className="map"></div>
        </div>
    )
}

export default HomePage
