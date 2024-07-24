import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Copy } from 'lucide-react';
import { Get_DIGIPIN } from '../utils/digipin';

mapboxgl.accessToken = 'pk.eyJ1Ijoia3V0YXphbWEiLCJhIjoiY2x6MDJrdm1tMmg2djJrcjR5cGJubHZhMiJ9.o4H5G9P-v5SQGP2duyuDxg';

export default function DigiPinMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(78.9629);
  const [lat, setLat] = useState(20.5937);
  const [zoom, setZoom] = useState(4);
  const [digipin, setDigipin] = useState('');

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
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
  }, []);

  const updateDigipin = (longitude, latitude) => {
    const calculatedDigipin = Get_DIGIPIN(latitude, longitude);
    setDigipin(calculatedDigipin);
    setLng(longitude);
    setLat(latitude);

    new mapboxgl.Popup()
      .setLngLat([longitude, latitude])
      .setHTML(`
        <div>
          <h3 class="font-bold">Your DIGIPIN:</h3>
          <p>${calculatedDigipin}</p>
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
      alert('DIGIPIN copied to clipboard!');
    });
  };

  return (
    <div className="relative">
      <div ref={mapContainer} className="map-container" style={{ height: '400px' }} />
      <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded shadow">
        <button onClick={handleGeolocation} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Use My Location
        </button>
        {digipin && (
          <div className="mt-2">
            <span className="font-bold">DIGIPIN: {digipin}</span>
            <button onClick={copyDigipin} className="ml-2">
              <Copy size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}