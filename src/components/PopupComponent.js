// PopupComponent.js
import React from 'react';

const PopupComponent = (country, layer) => {
  const countryName = country.properties.admin;

  layer.bindPopup(`<strong>${countryName}</strong>`);

  layer.on('click', () => {
    fetch(`https://api.hungermapdata.org/v2/info/country?country=${countryName}`)
      .then(response => response.json())
      .then(data => {
        const info = data.data;
        layer.bindPopup(`<strong>${countryName}</strong><br>${info.description || 'No description available.'}`); // Aggiunto il fallback
        layer.openPopup();
      })
      .catch(error => console.error('Error fetching country info:', error));
  });
};

export default PopupComponent;
