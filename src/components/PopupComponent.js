import React from 'react';

const PopupComponent = (country, layer) => {
  const countryName = country.properties.admin;

  // Contenuto iniziale del popup (solo il nome del paese)
  layer.bindPopup(`<h3 style="font-size: 22px; font-weight: bold;">${countryName}</h3>`);

  // Aggiungi evento di clic
  layer.on('click', () => {
    // Chiamata API per ottenere i dati del paese
    fetch(`https://api.hungermapdata.org/v2/info/country`)
      .then(response => response.json())
      .then(data => {
        if (data && data.body && data.body.countries) {
          const countryData = data.body.countries.find(c => c.country.name === countryName);
          
          if (countryData) {
            const {
              description,
              population,
              chronic_hunger,
              malnutrition,
              income_group
            } = countryData;

            // Crea il contenuto principale del popup
            let popupContent = `
              <br><strong>Description:</strong> ${description || 'N/A'}
              <br><strong>Population:</strong> ${population ? population.number : 'N/A'}
              <br><strong>Year:</strong> ${population ? population.year : 'N/A'}
              <br><strong>Income Group:</strong> ${income_group ? income_group.level : 'N/A'}
              <br><strong>Chronic Hunger:</strong> ${chronic_hunger || 'N/A'}
            `;

            // Aggiungi la tabella di malnutrizione se i dati esistono
            if (malnutrition) {
              popupContent += `
                <div style="display: flex; justify-content: space-between;">
                  <div style="width: 65%;">
                    <!-- Display the main popup content -->
                    ${popupContent}
                  </div>
                  <div style="width: 30%; margin-left: 10px;">
                    <strong>Malnutrition Data</strong>
                    <table style="border: 1px solid #ddd; width: 100%; border-collapse: collapse;">
                      <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Acute %</th>
                        <td style="border: 1px solid #ddd; padding: 8px;">${malnutrition.acute_percent || 'N/A'}</td>
                      </tr>
                      <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Chronic %</th>
                        <td style="border: 1px solid #ddd; padding: 8px;">${malnutrition.chronic_percent || 'N/A'}</td>
                      </tr>
                      <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Year</th>
                        <td style="border: 1px solid #ddd; padding: 8px;">${malnutrition.year || 'N/A'}</td>
                      </tr>
                      <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Source</th>
                        <td style="border: 1px solid #ddd; padding: 8px;">${malnutrition.source || 'N/A'}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              `;
            } else {
              // Se non ci sono dati di malnutrizione, aggiungi solo il contenuto principale
              popupContent = `
                <div style="width: 100%;">
                  ${popupContent}
                </div>
              `;
            }

            // Aggiungi stile CSS per popup scorrevole e trasparente
            const popupStyle = `
              <style>
                .leaflet-popup-content {
                  max-height: 300px; /* Limita l'altezza del popup */
                  overflow-y: auto;  /* Aggiunge la barra di scorrimento */
                  background-color: rgba(255, 255, 255, 0.8); /* Trasparenza con sfondo bianco */
                  padding: 10px;
                  border-radius: 10px;
                }
              </style>
            `;

            // Inietta lo stile e il contenuto del popup
            layer.bindPopup(popupStyle + popupContent);
            layer.openPopup();
          }
        } else {
          // Gestione del caso in cui non ci siano dati
          layer.bindPopup(`
            <strong>${countryName}</strong>
            <br>No additional data available from API.
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
