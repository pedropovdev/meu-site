document.addEventListener("DOMContentLoaded", function () {
  // Verifica se o Leaflet está carregado
  if (typeof L === 'undefined') {
      console.error('Leaflet não carregado! Verifique os links do script no HTML.');
      return;
  }

  // Criando o mapa
  var map = L.map('map').setView([-12.45, -38.97], 6); // Zoom ajustado para visualizar melhor as comunidades

  // Adicionando camada do OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Buscando os dados do backend
  fetch('http://localhost:5000/api/comunidades') // Certifique-se de que o backend está rodando
      .then(response => {
          if (!response.ok) {
              throw new Error(`Erro na resposta da API: ${response.status} ${response.statusText}`);
          }
          return response.json();
      })
      .then(data => {
          if (!Array.isArray(data)) {
              throw new Error('Formato de dados inválido. Esperado um array.');
          }

          data.forEach(comunidade => {
              if (comunidade.latitude && comunidade.longitude) {
                  // Criando marcador no mapa
                  var marker = L.marker([parseFloat(comunidade.latitude), parseFloat(comunidade.longitude)]).addTo(map);

                  // Criando popup com informações
                  marker.bindPopup(`
                      <strong>${comunidade.nome}</strong><br>
                      ${comunidade.municipio ? comunidade.municipio + '<br>' : ''}
                      ${comunidade.estado ? comunidade.estado + '<br>' : ''}
                      ${comunidade.atrativos ? comunidade.atrativos : ''}
                  `);
              } else {
                  console.warn('Coordenadas inválidas para:', comunidade);
              }
          });
      })
      .catch(error => console.error('Erro ao carregar os dados:', error));
});
