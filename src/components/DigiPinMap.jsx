import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Copy, MapPin, Layers } from 'lucide-react';
import { Get_DIGIPIN } from '../utils/digipin';

// Use the environment variable for the Mapbox token
const MAPBOX_TOKEN = import.meta.env.PUBLIC_MAPBOX_TOKEN;

// Set the token for mapboxgl
mapboxgl.accessToken = MAPBOX_TOKEN;

export default function DigiPinMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(78.9629);
  const [lat, setLat] = useState(20.5937);
  const [zoom, setZoom] = useState(4);
  const [digipin, setDigipin] = useState('');
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      countries: 'in'
    });

    map.current.addControl(geocoder);

    geocoder.on('result', (e) => {
      updateDigipin(e.result.center[0], e.result.center[1]);
    });

    map.current.on('load', () => {
      const worldview = 'IN';
      const adminLayers = ['admin-0-boundary', 'admin-1-boundary', 'admin-0-boundary-disputed', 'admin-1-boundary-bg', 'admin-0-boundary-bg'];
      adminLayers.forEach(function(adminLayer) {
        map.current.setFilter(adminLayer, ["match", ["get", "worldview"], ["all", worldview], true, false]);
      });
    });

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      updateDigipin(lng, lat);
    });

    return () => map.current.remove();
  }, []);

  const updateDigipin = (longitude, latitude) => {
    const calculatedDigipin = Get_DIGIPIN(latitude, longitude);
    setDigipin(calculatedDigipin);
    setLng(longitude);
    setLat(latitude);

    new mapboxgl.Popup()
      .setLngLat([longitude, latitude])
      .setHTML(`
        <div class="font-sans">
          <h3 class="font-bold text-lg mb-2">Your DIGIPIN:</h3>
          <p class="text-xl">${calculatedDigipin}</p>
        </div>
      `)
      .addTo(map.current);
  };

  const handleGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { longitude, latitude } = position.coords;
        map.current.flyTo({ center: [longitude, latitude], zoom: 14 });
        updateDigipin(longitude, latitude);
      }, (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please try adding a pin on the map.');
      });
    } else {
      alert('Geolocation is not supported by your browser. Please try adding a pin on the map.');
    }
  };

  const copyDigipin = () => {
    navigator.clipboard.writeText(digipin).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const toggleMapStyle = () => {
    const newStyle = isSatelliteView
      ? 'mapbox://styles/mapbox/streets-v11'
      : 'mapbox://styles/mapbox/satellite-streets-v11';
    map.current.setStyle(newStyle);
    setIsSatelliteView(!isSatelliteView);
  };

  return (
    <div className="relative">
      <div ref={mapContainer} className="map-container rounded-lg overflow-hidden" style={{ height: '500px' }} />
      <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg">
        <button 
          onClick={handleGeolocation} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mb-2"
        >
          <MapPin size={20} className="mr-2" />
          Use My Location
        </button>
        <button 
          onClick={toggleMapStyle} 
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center mb-2"
        >
          <Layers size={20} className="mr-2" />
          Toggle Satellite View
        </button>
        {digipin && (
          <div className="mt-2 bg-gray-100 p-2 rounded-lg">
            <span className="font-bold mr-2">DIGIPIN: {digipin}</span>
            <button 
              onClick={copyDigipin} 
              className={`ml-2 p-1 rounded ${copySuccess ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              title="Copy DIGIPIN"
            >
              <Copy size={16} />
            </button>
            {copySuccess && <span className="text-green-500 ml-2">Copied!</span>}
          </div>
        )}
      </div>
    </div>
  );
}