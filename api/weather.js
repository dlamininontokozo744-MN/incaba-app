export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { city, lat, lon, type } = req.query;
  const apiKey = process.env.REACT_APP_WEATHER_KEY;
  
  if(!apiKey) return res.status(200).json({error:'No weather key'});
  
  try {
    let url;
    if(lat && lon) {
      url = type==='forecast'
        ? `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=40`
        : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
      url = type==='forecast'
        ? `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&cnt=40`
        : `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch(e) {
    return res.status(200).json({error:e.message});
  }
}