const form = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;
    weatherResult.innerHTML = 'Loading...';
    try {
        const apiKey = '18ff27e6044e480394b112845250807';
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=yes`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();

        // Fetch city image from Unsplash
        let cityImageUrl = '';
        try {
            const unsplashRes = await fetch(`https://source.unsplash.com/600x300/?${encodeURIComponent(city)},landmark`);
            cityImageUrl = unsplashRes.url;
        } catch (imgErr) {
            cityImageUrl = '';
        }

        weatherResult.innerHTML = `
            ${cityImageUrl ? `<img src="${cityImageUrl}" alt="${data.location.name}" style="width:100%;border-radius:8px;margin-bottom:12px;object-fit:cover;max-height:200px;" />` : ''}
            <h2>${data.location.name}, ${data.location.country}</h2>
            <img src="${data.current.condition.icon}" alt="${data.current.condition.text}" />
            <span><strong>${data.current.condition.text}</strong></span><br/>
            <span>Temperature: ${data.current.temp_c}°C (${data.current.temp_f}°F)</span><br/>
            <span>Humidity: ${data.current.humidity}%</span><br/>
            <span>Wind: ${data.current.wind_kph} kph (${data.current.wind_mph} mph) ${data.current.wind_dir}</span><br/>
            <span>Air Quality Index: ${data.current["air_quality"] ? data.current["air_quality"]["us-epa-index"] : 'N/A'}</span>
        `;
    } catch (err) {
        weatherResult.innerHTML = `<span style='color:red;'>${err.message}</span>`;
    }
}); 