import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Copy, Crosshair, Search } from 'lucide-react';
import { Get_DIGIPIN } from '../utils/digipin';

const MAPBOX_TOKEN = import.meta.env.PUBLIC_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

export default function DigiPinMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(78.9629);
  const [lat, setLat] = useState(20.5937);
  const [zoom, setZoom] = useState(4);
  const [digipin, setDigipin] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/kutazama/clz17xsgs00i001r2bydb2v0h',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.on('load', () => {
      const worldview = 'IN';
      const adminLayers = [
        'admin-0-boundary',
        'admin-1-boundary',
        'admin-0-boundary-disputed',
        'admin-1-boundary-bg',
        'admin-0-boundary-bg'
      ];
      adminLayers.forEach(function (adminLayer) {
        map.current.setFilter(adminLayer, ['match', ['get', 'worldview'], ['all', worldview], true, false]);
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
          <h3 class="font-bold text-lg mb-2 text-gray-700">Your DIGIPIN:</h3>
          <p class="text-xl text-gray-700">${calculatedDigipin}</p>
        </div>
      `)
      .addTo(map.current);
  };

  const handleGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          map.current.flyTo({ center: [longitude, latitude], zoom: 14 });
          updateDigipin(longitude, latitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location. Please try adding a pin on the map.');
        }
      );
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

  const handleSearch = async (e) => {
    e.preventDefault();
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&country=IN`;

    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [long, lat] = data.features[0].center;
        map.current.flyTo({ center: [long, lat], zoom: 14 });
        updateDigipin(long, lat);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Error searching for location:', error);
      alert('An error occurred while searching. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-white">
        <p className="text-gray-800 font-medium mb-4">Click on the map or use your location to find your DIGIPIN:</p>
        <div className="flex mb-2">
          <button
            onClick={handleGeolocation}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-l-lg"
            title="Use My Location"
          >
            <Crosshair size={20} />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a place in India"
            className="flex-grow px-2 py-1 border text-gray-700"
          />
          <button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-r-lg">
            <Search size={20} />
          </button>

        </div>
        {digipin && (
          <div className="mt-2 p-2 rounded-lg bg-gray-100">
            <span className="font-bold mr-2 text-gray-700">DIGIPIN: {digipin}</span>
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
      <div className="flex-grow">
        <div ref={mapContainer} className="h-full" />
      </div>
    </div>
  );
}