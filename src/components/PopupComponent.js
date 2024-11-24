import React from 'react';

const PopupComponent = (country, layer) => {
  const countryName = country.properties.admin;

  // Contenuto iniziale del popup
  layer.bindPopup(`<strong>${countryName}</strong>`);

  // Aggiungi evento di clic
  layer.on('click', () => {
    // Chiamata API per ottenere i dati di tutti i paesi
    fetch(`https://api.hungermapdata.org/v2/info/country`)
      .then(response => response.json())
      .then(data => {
        const countries = data.body.countries;

        // Trova i dati relativi al paese cliccato
        const countryData = countries.find(
          c => c.country.name.toLowerCase() === countryName.toLowerCase()
        );

        if (countryData) {
          // Destruttura i dati del paese trovato
          const {
            country: { name, iso2, iso3 },
            population,
            chronic_hunger,
            malnutrition,
            income_group,
          } = countryData;

          // Crea il contenuto del popup
          const popupContent = `
            <strong>${name}</strong>
            <br><strong>ISO2:</strong> ${iso2 || 'N/A'}
            <br><strong>ISO3:</strong> ${iso3 || 'N/A'}
            <br><strong>Population:</strong> ${population?.number || 'N/A'} (${population?.year || 'N/A'})
            <br><strong>Chronic Hunger:</strong> ${chronic_hunger || 'N/A'}
            <br><strong>Malnutrition:</strong> ${malnutrition || 'N/A'}
            <br><strong>Income Group:</strong> ${income_group?.level || 'N/A'}
          `;

          // Aggiorna il popup con i nuovi dati
          layer.bindPopup(popupContent);
          layer.openPopup();
        } else {
          // Gestione del caso in cui non ci siano dati
          layer.bindPopup(`
            <strong>${countryName}</strong>
            <br>No data available for this country.
          `);
          layer.openPopup();
        }
      })
      .catch(error => {
        console.error('Error fetching country info:', error);
        // Mostra un errore nel popup in caso di fallimento
        layer.bindPopup(`
          <strong>${countryName}</strong>
          <br>Unable to fetch data. Please try again later.
        `);
        layer.openPopup();
      });
  });
};

export default PopupComponent;
