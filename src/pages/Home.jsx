import { useEffect, useRef } from 'react'

import '../styles/home.scss'

const GOOGLE_API_KEY = 'AIzaSyAznMHud7kisBu--oS38VQ6iq_8MrIge74'
const ulaanbaatar = { lat: 47.919067, lng: 106.9175938 };

const HomePage = () => {
    const mapElementRef = useRef();
    const mapRef = useRef();

    const onGoogleMapLoad = () => {
        mapRef.current = new window.google.maps.Map(mapElementRef.current, {
            center: ulaanbaatar,
            zoom: 16,
        });

        new window.google.maps.Marker({
            position: ulaanbaatar,
            map: mapRef.current,
        });


        new window.google.maps.Marker({
            position: { lat: 47.9120174, lng: 106.8771703 },
            map: mapRef.current,
        });
    }

    useEffect(() => {
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
