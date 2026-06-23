export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { city } = req.query;
  const apiKey = process.env.REACT_APP_WEATHER_KEY;
  
  if(!apiKey) return res.status(200).json({error:'No weather key'});
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},SZ&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch(e) {
    return res.status(200).json({error:e.message});
  }
}