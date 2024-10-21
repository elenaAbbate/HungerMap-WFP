// PopupComponent.js
import React from 'react';

const PopupComponent = (country, layer, countryData) => {
  const countryName = country.properties.admin;
  const matchedCountry = countryData.find(item => item.country_name === countryName);
  const phase_3_percent = matchedCountry ? matchedCountry.phase_3_percent : null;

  let popupContent = `<strong>${countryName}</strong>`;
  if (phase_3_percent !== null && phase_3_percent !== undefined) {
    popupContent += `<br>Phase 3 Percent: ${phase_3_percent}%`;
  } else {
    popupContent += `<br>No data available for Phase 3 Percent`;
  }

  layer.bindPopup(popupContent);

  layer.on('click', () => {
    fetch(`https://api.hungermapdata.org/v2/info/country?country=${countryName}`)
      .then(response => response.json())
      .then(data => {
        const info = data.data;
        const description = info.description || 'No description available.';
        const phase_3_percent = info.phase_3_percent ? `<br>Phase 3 Percent: ${info.phase_3_percent}%` : '<br>No data available for Phase 3 Percent';
        layer.bindPopup(`<strong>${countryName}</strong><br>${description}${phase_3_percent}`);
        layer.openPopup();
      })
      .catch(error => console.error('Error fetching country info:', error));
  });
};

export default PopupComponent;
