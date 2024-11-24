import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PopupComponent from './PopupComponent';
import './MapComponent.css'; // Importa il file CSS per lo stile

// Configurazione per correggere il problema delle icone dei marker con React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Inserisci il tuo token Mapbox qui
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZWxlYWJieSIsImEiOiJjbTJpenQybncwMGIwMmtzZnk2dDRubWd0In0.byfR3QNDcX7fI3VLGWBgKQ';

const MapComponent = () => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson')
      .then(response => response.json())
      .then(data => {
        // Filtra i dati GeoJSON per includere solo i paesi in Africa
        const africaCountries = {
          ...data,
          features: data.features.filter(feature => {
            return feature.properties.continent === "Africa"; // Filtro per il continente Africa
          }),
        };
        setGeoData(africaCountries);
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
      });
  }, []);

  return (
    <div className="map-container">
      {/* Titolo sopra la mappa */}
      <div className="title-container">
        <h1>Hunger Map</h1>
      </div>

      {/* Mappa */}
      <MapContainer
        center={[0, 20]} // Centro dell'Africa
        zoom={3}          // Livello di zoom iniziale
        style={{ height: "100vh", width: "100%" }} // Occupare tutta la pagina
      >
        {/* TileLayer per la mappa di base con Mapbox */}
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`}
          attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
        />

        {/* Mostra il GeoJSON sulla mappa */}
        {geoData && <GeoJSON data={geoData} style={{ color: 'blue' }} onEachFeature={(feature, layer) => PopupComponent(feature, layer)} />}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
