import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import hlane from './images/hlane.jpg';
import mantenga from './images/mantenga.jpg';
import lobamba from './images/lobamba.jpg';
import swazi from './images/swazi.jpg';
import malolotja from './images/malolotja.jpg';
import malolotja2 from './images/malolotja2.jpg';
import malolotja3 from './images/malolotja3.jpg';
import sibebe from './images/sibebe.jpg';
import shiselweni from './images/shiselweni.jpg';
import shiselweni2 from './images/shiselweni2.jpg';
import shiselweni3 from './images/shiselweni3.jpg';

const T = {
  en: {
    explore:'Explore Eswatini ✦', tagline:"Unlocking Eswatini's Hidden Treasures",
    sub:'The Smart Digital Tourism Ecosystem 🇸🇿', offline:'siSwati · English · Offline Ready',
    welcome:"Welcome to Africa's Hidden Fortress 💎",
    welcomeSub:'Discover breathtaking landscapes, vibrant culture, and unforgettable experiences.',
    attractions:'Attractions', restaurants:'Restaurants', hotels:'Hotels',
    topAttractions:'Top Attractions', hiddenGem:'Hidden Gem 💎',
    aiTitle:'Incaba AI Guide', aiSub:'Ask anything about Eswatini',

    navigate:'Navigate', home:'Home', ai:'AI Guide', dash:'Dashboard', business:'Business',
    sos:'SOS Emergency Mode', sosSub:'Tap to share location with emergency services',
    weather:'Weather Today', currency:'Currency Converter',
    reviews:'Tourist Reviews', writeReview:'Write a Review',
    submit:'Submit', cancel:'Cancel',
    getDir:'🗺️ Get Directions', savePlace:'❤️ Save Place',
    about:'About', location:'📍 Location', hours:'🕐 Opening Hours',
    price:'💰 Entry Fee', tips:'💡 Travel Tips',
    signIn:'Sign In', signUp:'Sign Up', logout:'Logout',
    welcome2:'Welcome back', createAccount:'Create Account',
  },
  ss: {

    explore:'Hlola Eswatini ✦', tagline:'Sivula Tigugu Letifihlekile Tase-Eswatini',
    sub:'Inhlelo Lehlakaniphile Yekuvakasha 🇸🇿', offline:'siSwati · English · Isebenta Ungaxhunyiwe',
    welcome:'Siyakemukela e-Africa Incaba Lefihlekile 💎',
    welcomeSub:'Tola tindzawo letimangalisako, inhlalo-mphilo, netilwimi letingakhohlwakali.',
    attractions:'Tindzawo', restaurants:'Emadlelo', hotels:'Emahhotela',
    topAttractions:'Tindzawo Letiphambili', hiddenGem:'Sigugu Lesikhulu 💎',
    aiTitle:'Umcondzi we-Incaba AI', aiSub:'Butseka noma yini nge-Eswatini',
    navigate:'Hamba', home:'Ekhaya', ai:'Umcondzi', dash:'Ibalabala', business:'Ibhizinisi',
    sos:'Isimo Sehhatsi', sosSub:'Cindzetela wabelane ndzawo yakho nebaphephisi',
    weather:'Isimo Selizulu Lamuhla', currency:'Shintsha Imali',
    reviews:'Tibuka Tetivakashi', writeReview:'Bhala Tibuka',
    submit:'Thumela', cancel:'Yekela',
    getDir:'🗺️ Tsatsa Indlela', savePlace:'❤️ Gcina Indawo',
    about:'Mayelana', location:'📍 Ndzawo', hours:'🕐 Sikhati Sekuvulwa',
    price:'💰 Inkokhelo', tips:'💡 Imilayeto Yekuvakasha',
    signIn:'Ngena', signUp:'Bhalisa', logout:'Phuma',
    welcome2:'Siyakemukela', createAccount:'Yenta Akhawunti',
  }
};

const RATES = { USD:0.054, ZAR:1.0, EUR:0.050, GBP:0.043, BWP:0.73 };


const places = [
  { name:'Hlane Royal Reserve', region:'Lubombo Region', desc:"Lions, elephants & white rhinos in Eswatini's largest park", fullDesc:"Hlane Royal National Park is Eswatini's largest protected area covering 22,000 hectares. Home to lions, elephants, white rhinos, giraffes, zebras and over 300 bird species. Named by King Sobhuza II — Hlane means wilderness in siSwati.", rating:'4.9', category:'Wildlife', img:hlane, gallery:[hlane,hlane,hlane], location:'Lubombo Region, 67km from Manzini', hours:'Open daily 6am – 6pm', price:'E 150 per person', tips:['Book guided game drives in advance','Best time is early morning','Bring binoculars for bird watching'] },
  { name:'Mantenga Falls', region:'Hhohho Region', desc:'Breathtaking 95m waterfall in the Ezulwini Valley', fullDesc:"Mantenga Falls drops 95 metres into a pristine pool surrounded by lush indigenous forest. Perfect for swimming, hiking and photography.", rating:'4.8', category:'Nature', img:mantenga, gallery:[mantenga,mantenga,mantenga], location:'Ezulwini Valley, Hhohho Region', hours:'Open daily 7am – 5pm', price:'E 80 per person', tips:['Wear waterproof shoes','Best after rainy season','Swimming allowed below the falls'] },
  { name:'Lobamba Royal Village', region:'Manzini Region', desc:'Heart of Swazi culture — home of the King', fullDesc:"Lobamba is the royal and legislative capital of Eswatini. Home of the Queen Mother and where the Incwala and Umhlanga ceremonies take place.", rating:'4.7', category:'Culture', img:lobamba, gallery:

[lobamba,lobamba,lobamba], location:'Ezulwini Valley, Manzini Region', hours:'Open daily 8am – 4pm', price:'E 50 per person', tips:['Dress respectfully','Visit during Umhlanga in August','Photography may require permission'] },
  { name:'Swazi Candles Market', region:'Malkerns Valley', desc:'World-famous handmade candles and craft market', fullDesc:"Artisans hand-craft beautiful animal-shaped candles using traditional techniques. The market features local crafts, textiles, jewelry and fresh produce.", rating:'4.6', category:'Culture', img:swazi, gallery:[swazi,swazi,swazi], location:'Malkerns Valley, Manzini Region', hours:'Open daily 8am – 5pm', price:'Free entry', tips:['Bargaining is acceptable','Buy candles as unique gifts','Try the local food stalls'] },
  { name:'Malolotja Nature Reserve', region:'Hhohho Region', desc:'Ancient mountains, rare orchids and cable car rides', fullDesc:"Malolotja Nature Reserve contains some of the oldest geological formations on earth with rare indigenous flora and rare bird species. The cable car offers stunning mountain views. Less than 2% of tourists ever visit.", rating:'4.8', category:'Nature', img:malolotja, gallery:[malolotja,malolotja2,malolotja3], location:'Northwestern Eswatini, Hhohho Region', hours:'Open daily 6am – 6pm', price:'E 120 per person', tips:['Cable car is a must-do','Bring warm clothing','Great for serious hikers'] },
  { name:'Sibebe Rock', region:'Hhohho Region', desc:"World's second largest rock near Mbabane", fullDesc:"The world's second largest exposed granite rock. Just 10km from capital Mbabane, offering challenging hiking trails and panoramic views across the entire country.", rating:'4.5', category:'Adventure', img:sibebe, gallery:[sibebe,sibebe,sibebe], location:'10km from Mbabane, Hhohho Region', hours:'Open daily 6am – 6pm', price:'E 60 per person', tips:['Wear proper hiking shoes','Go early to avoid heat','Bring plenty of water'] },
  { name:'Shiselweni Region', region:'Shiselweni Region', desc:"Eswatini's southern paradise — untouched and spectacular", fullDesc:"Shiselweni is Eswatini's southernmost region and one of its most beautiful. Home to Nhlangano town, vast forests, rivers and traditional Swazi villages. A true off-the-beaten-path destination.", rating:'4.7', category:'Nature', img:shiselweni, gallery:[shiselweni,shiselweni2,shiselweni3], location:'Southern Eswatini, Shiselweni Region', hours:'Open all year round', price:'Free to explore', tips:['Visit Nhlangano town for local culture','Great for eco-tourism','Best during dry season May–September'] },
];

const restaurants = [
  { name:"Malandela's Restaurant", region:'Malkerns', desc:'Traditional Swazi cuisine in a beautiful garden setting', rating:'4.8', icon:'🍴', price:'E 80–200 per person', hours:'Mon–Sun 11am–9pm' },
  { name:"Tum's George Hotel", region:'Mbabane', desc:'Fine dining with panoramic views of the Ezulwini Valley', rating:'4.6', icon:'🍽️', price:'E 120–300 per person', hours:'Daily 7am–10pm' },
  { name:'Gables Food Court', region:'Ezulwini', desc:'Local and international food options for every budget', rating:'4.2', icon:'🛍️', price:'E 40–120 per person', hours:'Daily 9am–8pm' },
  { name:'Foresters Arms Hotel', region:'Malkerns', desc:'Classic pub meals in a cozy countryside atmosphere', rating:'4.4', icon:'🏡', price:'E 60–150 per person', hours:'Daily 11am–10pm' },
];

const hotels = [
  { name:'Royal Swazi Spa & Hotel', region:'Ezulwini Valley', desc:'Luxury 5-star hotel with spa, casino and golf course', rating:'4.9', icon:'🏨', price:'E 1,800–4,500/night', stars:'★★★★★' },
  { name:'Mantengha Cultural Village', region:'Ezulwini', desc:'Authentic cultural experience in traditional Swazi huts', rating:'4.7', icon:'🛖', price:'E 600–1,200/night', stars:'★★★★☆' },
  { name:'Foresters Arms', region:'Malkerns', desc:'Charming country hotel surrounded by forest and gardens', rating:'4.5', icon:'🌲', price:'E 800–1,800/night', stars:'★★★★☆' },
  { name:'Lidwala Backpacker Lodge', region:'Mbabane', desc:'Budget-friendly lodge with stunning rock formations', rating:'4.3', icon:'⛺', price:'E 150–400/night', stars:'★★★☆☆' },
];

const weatherData = {
  'Today':    [{name:'Mbabane',temp:22,icon:'⛅',desc:'Partly Cloudy',humidity:'65%',wind:'12 km/h',uv:'Moderate'},{name:'Manzini',temp:26,icon:'☀️',desc:'Sunny',humidity:'45%',wind:'8 km/h',uv:'High'},{name:'Lubombo',temp:29,icon:'🌤️',desc:'Clear',humidity:'38%',wind:'15 km/h',uv:'Very High'}],
  'Tomorrow': [{name:'Mbabane',temp:19,icon:'🌧️',desc:'Light Rain',humidity:'80%',wind:'20 km/h',uv:'Low'},{name:'Manzini',temp:23,icon:'⛅',desc:'Cloudy',humidity:'60%',wind:'12 km/h',uv:'Moderate'},{name:'Lubombo',temp:27,icon:'☀️',desc:'Sunny',humidity:'35%',wind:'10 km/h',uv:'High'}],
  'Wed':      [{name:'Mbabane',temp:21,icon:'⛅',desc:'Partly Cloudy',humidity:'58%',wind:'9 km/h',uv:'Moderate'},{name:'Manzini',temp:25,icon:'🌤️',desc:'Mostly Clear',humidity:'42%',wind:'7 km/h',uv:'High'},{name:'Lubombo',temp:30,icon:'☀️',desc:'Hot & Sunny',humidity:'30%',wind:'11 km/h',uv:'Very High'}],
  'Thu':      [{name:'Mbabane',temp:18,icon:'🌩️',desc:'Thunderstorms',humidity:'90%',wind:'25 km/h',uv:'Low'},{name:'Manzini',temp:20,icon:'🌧️',desc:'Heavy Rain',humidity:'85%',wind:'22 km/h',uv:'Low'},{name:'Lubombo',temp:24,icon:'⛅',desc:'Cloudy',humidity:'55%',wind:'16 km/h',uv:'Moderate'}],
  'Fri':      [{name:'Mbabane',temp:23,icon:'☀️',desc:'Sunny',humidity:'40%',wind:'8 km/h',uv:'High'},{name:'Manzini',temp:27,icon:'☀️',desc:'Clear',humidity:'35%',wind:'6 km/h',uv:'Very High'},{name:'Lubombo',temp:31,icon:'☀️',desc:'Hot',humidity:'28%',wind:'9 km/h',uv:'Extreme'}],
  'Sat':      [{name:'Mbabane',temp:20,icon:'🌤️',desc:'Mostly Clear',humidity:'50%',wind:'10 km/h',uv:'Moderate'},{name:'Manzini',temp:24,icon:'⛅',desc:'Partly Cloudy',humidity:'48%',wind:'9 km/h',uv:'High'},{name:'Lubombo',temp:28,icon:'🌤️',desc:'Warm',humidity:'32%',wind:'12 km/h',uv:'High'}],
  'Sun':      [{name:'Mbabane',temp:17,icon:'🌧️',desc:'Rainy',humidity:'85%',wind:'18 km/h',uv:'Low'},{name:'Manzini',temp:21,icon:'⛅',desc:'Overcast',humidity:'70%',wind:'14 km/h',uv:'Low'},{name:'Lubombo',temp:25,icon:'⛅',desc:'Cloudy',humidity:'52%',wind:'13 km/h',uv:'Moderate'}],
};

function App() {
  const [screen, setScreen]   = useState('splash');
  const [tab, setTab]         = useState('home');
  const [lang, setLang]       = useState('en');
  const [user, setUser]       = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedPlace, setSelectedPlace]           = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedHotel, setSelectedHotel]           = useState(null);
  const t = T[lang];

  if (screen === 'splash') {
    return (
      <div style={styles.splash}>
        <div style={styles.splashGlow}/>
        <div style={{fontSize:72,marginBottom:16}}>💎</div>

        <h1 style={styles.splashTitle}>Inc<span style={styles.gold}>aba</span></h1>
        <div style={{fontSize:15,color:'#c9a227',fontWeight:600,marginBottom:8}}>{t.tagline}</div>
        <p style={{color:'#8fa3c4',fontSize:13,margin:'0 0 20px',lineHeight:1.6}}>{t.sub}</p>
        <div style={{display:'flex',gap:8,justifyContent:'center',marginBottom:28}}>
          {['#3E5EB9','#FFD700','#B22234','#2E7D32'].map(c=>(
            <div key={c} style={{width:12,height:12,borderRadius:'50%',background:c}}/>
          ))}
        </div>
        <button style={styles.btnPrimary} onClick={()=>setScreen('auth')}>{t.explore}</button>
        <p style={{color:'#5f7a9a',fontSize:11,marginTop:16}}>{t.offline}</p>
      </div>
    );
  }

  if (screen === 'auth') {
    return <AuthScreen onLogin={(u,admin)=>{setUser(u);setIsAdmin(admin);setScreen('main');}} t={t}/>;
  }

  if (selectedPlace)      return <DetailScreen place={selectedPlace} onBack={()=>setSelectedPlace(null)} t={t}/>;
  if (selectedRestaurant) return <RestaurantDetail item={selectedRestaurant} onBack={()=>setSelectedRestaurant(null)} t={t}/>;
  if (selectedHotel)      return <HotelDetail item={selectedHotel} onBack={()=>setSelectedHotel(null)} t={t}/>;

  return (
    <div style={styles.app}>
      <div style={styles.topbar}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{fontSize:20,width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#c9a227,#e8b93a)',display:'flex',alignItems:'center',justifyContent:'center'}}>💎</div>
          <span style={{fontSize:18,fontWeight:700,color:'#f0f4ff'}}>Inc<span style={styles.gold}>aba</span></span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{...styles.langBtn,...(lang==='en'?styles.langBtnActive:{})}} onClick={()=>setLang('en')}>EN</span>
          <span style={{...styles.langBtn,...(lang==='ss'?styles.langBtnActive:{})}} onClick={()=>setLang('ss')}>SS</span>
          {user&&<div onClick={()=>{setUser(null);setIsAdmin(false);setScreen('auth');}} style={{fontSize:11,color:'#e24b4a',cursor:'pointer',border:'0.5px solid rgba(226,75,74,0.3)',borderRadius:6,padding:'3px 8px'}}>Logout</div>}
          <span style={{fontSize:22}}>🇸🇿</span>
        </div>

      </div>
      <div style={styles.content}>
        {tab==='home'     && <HomeTab setTab={setTab} onSelect={setSelectedPlace} onSelectRestaurant={setSelectedRestaurant} onSelectHotel={setSelectedHotel} t={t}/>}
        {tab==='map'      && <MapTab t={t}/>}
        {tab==='ai'       && <AITab t={t}/>}
        {tab==='dash'     && isAdmin && <DashTab t={t}/>}
        {tab==='dash'     && !isAdmin && <div style={{padding:40,textAlign:'center',color:'#8fa3c4'}}><div style={{fontSize:48,marginBottom:16}}>🔒</div><div style={{fontSize:16,color:'#e24b4a',fontWeight:600}}>Admin Access Only</div><div style={{fontSize:13,marginTop:8}}>This area is restricted to Incaba administrators.</div></div>}
        {tab==='business' && <BusinessTab t={t}/>}
      </div>
      <div style={styles.bottomNav}>
        {[
          {id:'home',    icon:'🏠',label:t.home},
          {id:'map',     icon:'🗺️', label:t.navigate},
          {id:'ai',      icon:'🤖',label:t.ai},
          {id:'dash',    icon:'📊',label:t.dash},
          {id:'business',icon:'🏨',label:t.business},
        ].map(item=>(
          <div key={item.id} style={tab===item.id?styles.navActive:styles.navItem} onClick={()=>setTab(item.id)}>
            <span style={{fontSize:20}}>{item.icon}</span>
            <span style={{fontSize:10,color:tab===item.id?'#c9a227':'#8fa3c4',fontWeight:500}}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuthScreen({onLogin,t}) {
  const [mode,setMode]         = useState('login');
  const [email,setEmail]       = useState('');
  const [password,setPassword] = useState('');
  const [name,setName]         = useState('');
  const [error,setError]       = useState('');

  const handleLogin = ()=>{
    if(!email||!password){setError('Please fill in all fields');return;}

    if(email==='admin@incaba.com'&&password==='admin123'){onLogin({name:'Admin',email},true);return;}
    if(email&&password.length>=6){onLogin({name:name||email.split('@')[0],email},false);return;}
    setError('Password must be at least 6 characters');
  };

  return (
    <div style={{...styles.splash,justifyContent:'flex-start',paddingTop:'8vh'}}>
      <div style={styles.splashGlow}/>
      <div style={{fontSize:48,marginBottom:8}}>💎</div>
      <h1 style={{...styles.splashTitle,fontSize:32,marginBottom:4}}>Inc<span style={styles.gold}>aba</span></h1>
      <p style={{color:'#8fa3c4',fontSize:13,marginBottom:24}}>{mode==='login'?t.welcome2:'Join the Incaba community'}</p>
      <div style={{width:'100%',maxWidth:340}}>
        <div style={{display:'flex',background:'rgba(255,255,255,0.05)',borderRadius:12,padding:4,marginBottom:20}}>
          <button style={{flex:1,padding:'10px',borderRadius:10,border:'none',background:mode==='login'?'rgba(201,162,39,0.2)':'transparent',color:mode==='login'?'#c9a227':'#8fa3c4',cursor:'pointer',fontWeight:600,fontSize:14}} onClick={()=>setMode('login')}>{t.signIn}</button>
          <button style={{flex:1,padding:'10px',borderRadius:10,border:'none',background:mode==='signup'?'rgba(201,162,39,0.2)':'transparent',color:mode==='signup'?'#c9a227':'#8fa3c4',cursor:'pointer',fontWeight:600,fontSize:14}} onClick={()=>setMode('signup')}>{t.signUp}</button>
        </div>
        <button style={{width:'100%',padding:'13px',borderRadius:12,border:'0.5px solid rgba(255,255,255,0.2)',background:'rgba(255,255,255,0.08)',color:'#f0f4ff',fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:16,fontWeight:500}} onClick={()=>onLogin({name:'Google User',email:'tourist@gmail.com'},false)}>
          <span style={{fontSize:20}}>🌐</span> 
        </button>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
          <div style={{flex:1,height:'0.5px',background:'rgba(255,255,255,0.1)'}}/>
          <span style={{fontSize:12,color:'#8fa3c4'}}>or</span>
          <div style={{flex:1,height:'0.5px',background:'rgba(255,255,255,0.1)'}}/>
        </div>
        {mode==='signup'&&<input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={styles.authInput}/>}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" type="email" style={styles.authInput}/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (min 6 characters)" type="password" style={{...styles.authInput,marginBottom:6}}/>
        {error&&<div style={{fontSize:12,color:'#e24b4a',marginBottom:10,textAlign:'center'}}>{error}</div>}
        <button style={{...styles.btnPrimary,marginBottom:16}} onClick={handleLogin}>{mode==='login'?t.signIn:t.createAccount}</button>
        <div style={{textAlign:'center',fontSize:12,color:'#8fa3c4',marginBottom:12}}></div>
        <button style={{width:'100%',padding:'11px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:'transparent',color:'#c9a227',cursor:'pointer',fontSize:14}} onClick={()=>onLogin({name:'Guest',email:'guest'},false)}>Continue as Guest</button>
      </div>
    </div>
  );
}

function PhotoSlideshow({images,height=280}) {
  const [current,setCurrent] = useState(0);
  const [playing,setPlaying] = useState(true);
  useEffect(()=>{
    if(!playing) return;

    const timer = setInterval(()=>setCurrent(prev=>(prev+1)%images.length),3000);
    return ()=>clearInterval(timer);
  },[playing,images.length]);
  return (
    <div style={{position:'relative',height,overflow:'hidden',background:'#0d2540'}}>
      {images.map((img,i)=>(
        <img key={i} src={img} alt="" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover',opacity:i===current?1:0,transition:'opacity 0.8s ease'}}/>
      ))}
      <div style={{position:'absolute',bottom:12,left:'50%',transform:'translateX(-50%)',display:'flex',gap:6}}>
        {images.map((_,i)=>(

          <div key={i} onClick={()=>{setCurrent(i);setPlaying(false);}} style={{width:i===current?20:6,height:6,borderRadius:3,background:i===current?'#c9a227':'rgba(255,255,255,0.5)',cursor:'pointer',transition:'all 0.3s'}}/>
        ))}
      </div>
      <button onClick={()=>{setCurrent(p=>(p-1+images.length)%images.length);setPlaying(false);}} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',background:'rgba(10,22,40,0.6)',border:'none',borderRadius:'50%',width:32,height:32,color:'white',fontSize:16,cursor:'pointer'}}>‹</button>
      <button onClick={()=>{setCurrent(p=>(p+1)%images.length);setPlaying(false);}} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'rgba(10,22,40,0.6)',border:'none',borderRadius:'50%',width:32,height:32,color:'white',fontSize:16,cursor:'pointer'}}>›</button>
      <button onClick={()=>setPlaying(p=>!p)} style={{position:'absolute',top:12,right:12,background:'rgba(10,22,40,0.6)',border:'none',borderRadius:20,padding:'4px 10px',color:'white',fontSize:11,cursor:'pointer'}}>{playing?'⏸':'▶'}</button>
    </div>
  );
}

function WeatherWidget({t}) {
  const [day,setDay]           = useState('Today');
  const [selected,setSelected] = useState(null);
  const days = Object.keys(weatherData);
  const cities = weatherData[day];

  return (
    <div style={{marginBottom:16}}>
      <div style={styles.sectionTitle}>{t.weather}</div>
      <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:8,marginBottom:12,scrollbarWidth:'none'}}>
        {days.map(d=>(
          <button key={d} onClick={()=>{setDay(d);setSelected(null);}} style={{flexShrink:0,padding:'6px 14px',borderRadius:20,border:`0.5px solid ${d===day?'#c9a227':'rgba(201,162,39,0.2)'}`,background:d===day?'rgba(201,162,39,0.15)':'transparent',color:d===day?'#c9a227':'#8fa3c4',fontSize:12,cursor:'pointer',fontWeight:d===day?600:400}}>{d}</button>
        ))}
      </div>

      <div style={{display:'flex',gap:10}}>
        {cities.map(c=>(
          <div key={c.name} onClick={()=>setSelected(selected?.name===c.name?null:c)} style={{flex:1,background:selected?.name===c.name?'rgba(24,95,165,0.25)':'rgba(24,95,165,0.12)',border:`0.5px solid ${selected?.name===c.name?'rgba(24,95,165,0.6)':'rgba(24,95,165,0.3)'}`,borderRadius:12,padding:'12px 8px',textAlign:'center',cursor:'pointer',transition:'all 0.2s'}}>
            <div style={{fontSize:24}}>{c.icon}</div>
            <div style={{fontSize:18,fontWeight:700,color:'#f0f4ff',marginTop:4}}>{c.temp}°C</div>
            <div style={{fontSize:11,color:'#c9a227',fontWeight:600,marginTop:2}}>{c.name}</div>

            <div style={{fontSize:10,color:'#8fa3c4',marginTop:2}}>{c.desc}</div>
          </div>
        ))}
      </div>
      {selected&&(
        <div style={{background:'rgba(24,95,165,0.12)',border:'0.5px solid rgba(24,95,165,0.3)',borderRadius:12,padding:14,marginTop:10}}>
          <div style={{fontSize:14,fontWeight:600,color:'#f0f4ff',marginBottom:10}}>{selected.icon} {selected.name} — {day}</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
            {[['💧 Humidity',selected.humidity],['💨 Wind',selected.wind],['☀️ UV Index',selected.uv]].map(([l,v])=>(
              <div key={l} style={{background:'rgba(255,255,255,0.05)',borderRadius:8,padding:'10px 8px',textAlign:'center'}}>
                <div style={{fontSize:10,color:'#8fa3c4',marginBottom:4}}>{l}</div>
                <div style={{fontSize:13,fontWeight:600,color:'#c9a227'}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CurrencyConverter({t}) {

  const [amount,setAmount] = useState('100');
  const [to,setTo]         = useState('USD');
  const result = amount?(parseFloat(amount)*RATES[to]).toFixed(2):'0.00';
  return (
    <div style={{background:'rgba(201,162,39,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:14,padding:14,marginBottom:16}}>
      <div style={styles.sectionTitle}>{t.currency}</div>
      <div style={{fontSize:12,color:'#8fa3c4',marginBottom:10}}>Eswatini Lilangeni (SZL) →</div>
      <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:12}}>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={{flex:1,background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px 14px',color:'#f0f4ff',fontSize:16,fontWeight:700,outline:'none'}} placeholder="Amount in SZL"/>
        <select value={to} onChange={e=>setTo(e.target.value)} style={{background:'#0f2040',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px 12px',color:'#c9a227',fontSize:14,fontWeight:600,outline:'none',cursor:'pointer'}}>
          {Object.keys(RATES).map(k=><option key={k} value={k}>{k}</option>)}
        </select>
      </div>
      <div style={{background:'rgba(201,162,39,0.1)',borderRadius:10,padding:'12px 14px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:13,color:'#8fa3c4'}}>E {amount||'0'} SZL =</span>
        <span style={{fontSize:22,fontWeight:700,color:'#c9a227'}}>{result} {to}</span>
      </div>
    </div>
  );
}

function ReviewsSection({placeName,t}) {
  const [reviews,setReviews] = useState([
    {name:'Sarah M.',flag:'🇬🇧',stars:5,text:"Absolutely breathtaking! One of the best experiences of my life.",date:'2 days ago'},

    {name:'João P.', flag:'🇧🇷',stars:5,text:'Incredible wildlife and friendly people. Will definitely come back!',date:'1 week ago'},
    {name:'Thandi D.',flag:'🇿🇦',stars:4,text:'Beautiful place, well maintained. The guided tour was very informative.',date:'2 weeks ago'},
  ]);
  const [showForm,setShowForm] = useState(false);
  const [newName,setNewName]   = useState('');
  const [newText,setNewText]   = useState('');
  const [newStars,setNewStars] = useState(5);
  const submit = ()=>{
    if(!newName.trim()||!newText.trim()) return;
    

setReviews(prev=>[{name:newName,flag:'🌍',stars:newStars,text:newText,date:'Just now'},...prev]);
    setNewName(''); setNewText(''); setShowForm(false);
  };
  return (
    <div style={{marginBottom:16}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div style={styles.sectionTitle}>{t.reviews}</div>
        <button style={{fontSize:12,color:'#c9a227',background:'rgba(201,162,39,0.1)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:20,padding:'5px 12px',cursor:'pointer'}} onClick={()=>setShowForm(!showForm)}>+ {t.writeReview}</button>
      </div>
      {showForm&&(
        <div style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:12,padding:14,marginBottom:12}}>
          <div style={{display:'flex',gap:6,marginBottom:10}}>
            {[1,2,3,4,5].map(s=>(
              <span key={s} onClick={()=>setNewStars(s)} style={{fontSize:24,cursor:'pointer',opacity:s<=newStars?1:0.3}}>⭐</span>
            ))}
          </div>
          <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Your name" style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:8,padding:'10px 12px',color:'#f0f4ff',fontSize:13,outline:'none',marginBottom:8,boxSizing:'border-box'}}/>
          <textarea value={newText} onChange={e=>setNewText(e.target.value)} placeholder="Share your experience..." rows={3} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:8,padding:'10px 12px',color:'#f0f4ff',fontSize:13,outline:'none',resize:'none',fontFamily:'inherit',boxSizing:'border-box'}}/>
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button style={{...styles.btnPrimary,flex:1,padding:'10px',fontSize:13}} onClick={submit}>{t.submit}</button>
            <button style={{flex:1,padding:'10px',fontSize:13,borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:'transparent',color:'#8fa3c4',cursor:'pointer'}} onClick={()=>setShowForm(false)}>{t.cancel}</button>
          </div>
        </div>
      )}
      {reviews.map((r,i)=>(
        <div key={i} style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.15)',borderRadius:12,padding:14,marginBottom:8}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:20}}>{r.flag}</span>
              <span style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{r.name}</span>
            </div>
            <span style={{fontSize:11,color:'#8fa3c4'}}>{r.date}</span>
          </div>
          <div style={{marginBottom:6}}>{'⭐'.repeat(r.stars)}</div>
          <div style={{fontSize:13,color:'#b0c4de',lineHeight:1.6}}>{r.text}</div>
        </div>

      ))}
    </div>
  );
}

function DetailScreen({place,onBack,t}) {
  const [saved,setSaved] = useState(false);
  return (
    <div style={styles.app}>
      <div style={{flexShrink:0,position:'relative'}}>
        <PhotoSlideshow images={place.gallery} height={280}/>
        <button onClick={onBack} style={{position:'absolute',top:16,left:16,background:'rgba(10,22,40,0.7)',border:'0.5px solid rgba(255,255,255,0.2)',borderRadius:50,padding:'8px 14px',color:'#f0f4ff',fontSize:13,cursor:'pointer',zIndex:10}}>← Back</button>

        <div style={{position:'absolute',top:16,right:16,background:'rgba(201,162,39,0.9)',borderRadius:20,padding:'4px 10px',fontSize:11,fontWeight:700,color:'#0a1628',zIndex:10}}>{place.category}</div>
        <div style={{position:'absolute',bottom:36,left:16,zIndex:10}}>
          <div style={{fontSize:20,fontWeight:700,color:'#f0f4ff',marginBottom:4,textShadow:'0 2px 8px rgba(0,0,0,0.8)'}}>{place.name}</div>
          <div style={{fontSize:13,color:'rgba(255,255,255,0.9)',textShadow:'0 1px 4px rgba(0,0,0,0.8)'}}>📍 {place.region}</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:16}}>
        <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
          <div style={styles.infoBadge}>⭐ {place.rating}</div>
          <div style={styles.infoBadge}>{place.hours}</div>
          <div style={{...styles.infoBadge,color:'#5dcaa5',borderColor:'rgba(29,158,117,0.3)',background:'rgba(29,158,117,0.1)'}}>{place.price}</div>
        </div>
        <div style={{fontSize:14,color:'#c9a227',fontWeight:600,marginBottom:8}}>{t.about}</div>
        <div style={{fontSize:13,color:'#b0c4de',lineHeight:1.8,marginBottom:16}}>{place.fullDesc}</div>

        <div style={{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:12,padding:14,marginBottom:14}}>
          <div style={{fontSize:14,color:'#c9a227',fontWeight:600,marginBottom:6}}>{t.location}</div>
          <div style={{fontSize:13,color:'#8fa3c4'}}>{place.location}</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
          <div style={{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:12,padding:14}}>

            <div style={{fontSize:12,color:'#c9a227',fontWeight:600,marginBottom:4}}>{t.hours}</div>
            <div style={{fontSize:12,color:'#8fa3c4'}}>{place.hours}</div>
          </div>
          <div style={{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:12,padding:14}}>
            <div style={{fontSize:12,color:'#c9a227',fontWeight:600,marginBottom:4}}>{t.price}</div>
            <div style={{fontSize:12,color:'#8fa3c4'}}>{place.price}</div>
          </div>
        </div>
        <div style={{fontSize:14,color:'#c9a227',fontWeight:600,marginBottom:10}}>{t.tips}</div>
        {place.tips.map((tip,i)=>(
          <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:8}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:'#c9a227',flexShrink:0,marginTop:5}}/>
            <div style={{fontSize:13,color:'#8fa3c4',lineHeight:1.6}}>{tip}</div>
          </div>
        ))}
        <ReviewsSection placeName={place.name} t={t}/>
        <div style={{display:'flex',gap:10,marginTop:8,marginBottom:8}}>
          <button style={{...styles.btnPrimary,flex:1,padding:'12px',fontSize:14}} onClick={()=>window.open(`https://www.google.com/maps/search/${encodeURIComponent(place.name)}+Eswatini`,'_blank')}>{t.getDir}</button>
          <button style={{flex:1,padding:'12px',fontSize:14,borderRadius:50,border:`0.5px solid ${saved?'rgba(29,158,117,0.6)':'rgba(201,162,39,0.4)'}`,background:saved?'rgba(29,158,117,0.15)':'transparent',color:saved?'#5dcaa5':'#c9a227',cursor:'pointer',fontWeight:600}} onClick={()=>setSaved(true)}>{saved?'✅ Saved':t.savePlace}</button>
        </div>
        <button style={{width:'100%',padding:'12px',fontSize:14,borderRadius:50,border:'1px solid rgba(226,75,74,0.4)',background:'rgba(226,75,74,0.1)',color:'#e24b4a',cursor:'pointer',fontWeight:600,marginBottom:20}} onClick={()=>{if(window.confirm('🆘 Call Eswatini Emergency Services (999)?'))window.location.href='tel:999';}}>🆘 {t.sos}</button>
      </div>
    </div>
  );
}

function RestaurantDetail({item,onBack,t}) {
  return (
    <div style={styles.app}>
      <div style={{background:'linear-gradient(135deg,#1a3a1a,#2d5a2d)',height:200,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,position:'relative'}}>
        <div style={{fontSize:64}}>{item.icon}</div>
        <button onClick={onBack} style={{position:'absolute',top:16,left:16,background:'rgba(10,22,40,0.7)',border:'0.5px solid rgba(255,255,255,0.2)',borderRadius:50,padding:'8px 14px',color:'#f0f4ff',fontSize:13,cursor:'pointer'}}>← Back</button>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:16}}>
        <h2 style={{fontSize:22,fontWeight:700,color:'#f0f4ff',marginBottom:4}}>{item.name}</h2>
        <div style={{fontSize:13,color:'#8fa3c4',marginBottom:14}}>📍 {item.region}</div>
        <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
          <div style={styles.infoBadge}>⭐ {item.rating}</div>
          <div style={styles.infoBadge}>🕐 {item.hours}</div>
          <div style={{...styles.infoBadge,color:'#5dcaa5',borderColor:'rgba(29,158,117,0.3)',background:'rgba(29,158,117,0.1)'}}>{item.price}</div>
        </div>
        <div style={{fontSize:13,color:'#b0c4de',lineHeight:1.8,marginBottom:16}}>{item.desc}</div>
        <ReviewsSection placeName={item.name} t={t}/>
        <button style={{...styles.btnPrimary,marginBottom:20}} onClick={()=>window.open(`https://www.google.com/maps/search/${encodeURIComponent(item.name)}+Eswatini`,'_blank')}>🗺️ Get Directions</button>
      </div>
    </div>
  );
}

function HotelDetail({item,onBack,t}) {
  const [showBooking,setShowBooking] = useState(false);
  const [checkIn,setCheckIn]   = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [guests,setGuests]     = useState('2');
  return (
    <div style={styles.app}>
      <div style={{background:'linear-gradient(135deg,#1a2a3a,#2d3d5a)',height:200,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,position:'relative'}}>
        <div style={{fontSize:64}}>{item.icon}</div>
        <button onClick={onBack} style={{position:'absolute',top:16,left:16,background:'rgba(10,22,40,0.7)',border:'0.5px solid rgba(255,255,255,0.2)',borderRadius:50,padding:'8px 14px',color:'#f0f4ff',fontSize:13,cursor:'pointer'}}>← Back</button>
        <div style={{position:'absolute',top:16,right:16,fontSize:14,color:'#c9a227'}}>{item.stars}</div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:16}}>
        <h2 style={{fontSize:22,fontWeight:700,color:'#f0f4ff',marginBottom:4}}>{item.name}</h2>
        <div style={{fontSize:13,color:'#8fa3c4',marginBottom:14}}>📍 {item.region}</div>
        <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
          <div style={styles.infoBadge}>⭐ {item.rating}</div>
          <div style={{...styles.infoBadge,color:'#5dcaa5',borderColor:'rgba(29,158,117,0.3)',background:'rgba(29,158,117,0.1)'}}>{item.price}</div>
        </div>
        <div style={{fontSize:13,color:'#b0c4de',lineHeight:1.8,marginBottom:16}}>{item.desc}</div>
        {!showBooking?(
          <button style={{...styles.btnPrimary,marginBottom:12}} onClick={()=>setShowBooking(true)}>🛏️ Book Now</button>
        ):(
          <div style={{background:'rgba(201,162,39,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:14,padding:16,marginBottom:16}}>
            <div style={{fontSize:15,fontWeight:600,color:'#c9a227',marginBottom:14}}>📅 Book Your Stay</div>
            {[['Check-in Date',checkIn,setCheckIn,'date'],['Check-out Date',checkOut,setCheckOut,'date'],['Number of Guests',guests,setGuests,'number']].map(([label,val,setter,type])=>(
              <div key={label} style={{marginBottom:12}}>

                <div style={{fontSize:12,color:'#8fa3c4',marginBottom:6}}>{label}</div>
                <input type={type} value={val} onChange={e=>setter(e.target.value)} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px 14px',color:'#f0f4ff',fontSize:14,outline:'none',boxSizing:'border-box'}}/>
              </div>
            ))}
            <button style={{...styles.btnPrimary,marginBottom:8}} onClick={()=>{if(checkIn&&checkOut)alert(`✅ Booking Request Sent!\n\n🏨 ${item.name}\n📅 ${checkIn} → ${checkOut}\n👥 ${guests} guests\n\nWe will contact you within 24 hours!`);else alert('Please fill in all dates');}}>Confirm Booking</button>
            <button style={{width:'100%',padding:'11px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:'transparent',color:'#8fa3c4',cursor:'pointer',fontSize:14}} onClick={()=>setShowBooking(false)}>Cancel</button>
          </div>
        )}
        <ReviewsSection placeName={item.name} t={t}/>
      </div>
    </div>
  );
}

function HomeTab({setTab,onSelect,onSelectRestaurant,onSelectHotel,t}) {

  const [activeSection,setActiveSection] = useState('attractions');
  const handleSOS = ()=>{
    if(window.confirm('🆘 Call Eswatini Emergency Services?\n\nPolice: 999\nAmbulance: 977\nFire: 933'))window.location.href='tel:999';};
  return (
  <div>
      <div style={styles.sosBtn} onClick={handleSOS}>
        <span style={{fontSize:20}}>🆘</span>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:'#e24b4a'}}>{t.sos}</div>
          <div style={{fontSize:11,color:'#8fa3c4'}}>{t.sosSub}</div>
        </div>

        <span style={{color:'#8fa3c4',marginLeft:'auto'}}>›</span>
      </div>
      <WeatherWidget t={t}/>
      <div style={styles.heroBanner}>
        <div style={styles.heroBadge}>✦ Kingdom of Eswatini</div>
        <h2 style={{fontSize:22,fontWeight:700,color:'#f0f4ff',marginBottom:8}}>{t.welcome}</h2>
        <p style={{fontSize:13,color:'#8fa3c4',lineHeight:1.5,marginBottom:14}}>{t.welcomeSub}</p>
        <div style={{display:'flex',gap:10}}>
          {[['120+',t.attractions,'attractions'],['48',t.restaurants,'restaurants'],['35',t.hotels,'hotels']].map(([n,l,sec])=>(
            <div key={l} onClick={()=>setActiveSection(sec)} style={{...styles.hstat,cursor:'pointer',border:activeSection===sec?'1.5px solid #c9a227':'0.5px solid rgba(201,162,39,0.2)'}}>
              <div style={{fontSize:18,fontWeight:700,color:'#c9a227'}}>{n}</div>
              <div style={{fontSize:10,color:activeSection===sec?'#c9a227':'#8fa3c4',marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <CurrencyConverter t={t}/>
      <div style={styles.aiCard} onClick={()=>setTab('ai')}>
        <div style={{width:48,height:48,borderRadius:12,background:'rgba(83,74,183,0.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>🤖</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:600,color:'#f0f4ff',marginBottom:3}}>{t.aiTitle}</div>
          <div style={{fontSize:12,color:'#8fa3c4',lineHeight:1.4}}>{t.aiSub}</div>
        </div>
        <span style={{color:'#c9a227',fontSize:20}}>›</span>
      </div>
      {activeSection==='attractions'&&( 
        <>
          <div style={styles.sectionTitle}>{t.topAttractions}</div>
          <div style={styles.placesGrid}>
            {places.map(p=>(
              <div key={p.name} style={styles.placeCard} onClick={()=>onSelect(p)}>
                <div style={styles.placeImgBox}>
                  <img src={p.img} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  <div style={styles.placeCategory}>{p.category}</div>
                </div>
                <div style={{padding:'10px 12px'}}>
                  <div style={{fontSize:13,fontWeight:600,color:'#f0f4ff',marginBottom:3}}>{p.name}</div>
                  <div style={{fontSize:11,color:'#8fa3c4',marginBottom:4}}>📍 {p.region}</div>
                  <div style={{fontSize:10,color:'#6a85a8',lineHeight:1.4,marginBottom:5}}>{p.desc}</div>
                  <div style={{fontSize:11,color:'#c9a227'}}>⭐ {p.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {activeSection==='restaurants'&&(
        <>
          <div style={styles.sectionTitle}>{t.restaurants}</div>
          {restaurants.map(r=>(
            <div key={r.name} style={{...styles.bizCard,cursor:'pointer'}} onClick={()=>onSelectRestaurant(r)}>
              <div style={{width:50,height:50,borderRadius:12,background:'rgba(29,158,117,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,flexShrink:0}}>{r.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600,color:'#f0f4ff'}}>{r.name}</div>
                <div style={{fontSize:12,color:'#8fa3c4',marginTop:2}}>📍 {r.region}</div>
                <div style={{fontSize:11,color:'#6a85a8',marginTop:3,lineHeight:1.4}}>{r.desc}</div>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'#c9a227'}}>⭐ {r.rating}</div>
                <div style={{fontSize:10,color:'#8fa3c4',marginTop:4}}>{r.price}</div>
              </div>
            </div>))}
        </>
      )}
      {activeSection==='hotels'&&(
        <>
          <div style={styles.sectionTitle}>{t.hotels}</div>
          {hotels.map(h=>(
            <div key={h.name} style={{...styles.bizCard,cursor:'pointer'}} onClick={()=>onSelectHotel(h)}>
              <div style={{width:50,height:50,borderRadius:12,background:'rgba(201,162,39,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,flexShrink:0}}>{h.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600,color:'#f0f4ff'}}>{h.name}</div>

                <div style={{fontSize:12,color:'#8fa3c4',marginTop:2}}>📍 {h.region}</div>
                <div style={{fontSize:11,color:'#c9a227',marginTop:3}}>{h.stars}</div>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontSize:11,color:'#5dcaa5'}}>{h.price}</div>
                <div style={{fontSize:10,color:'#8fa3c4',marginTop:4}}>Tap to book →</div>
              </div>
            </div>
          ))}
        </>
      )}
      <div style={styles.sectionTitle}>{t.hiddenGem}</div>
      <div style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:14,overflow:'hidden',marginBottom:16,cursor:'pointer'}} onClick={()=>onSelect(places.find(p=>p.name==='Shiselweni Region'))}>
        <img src={shiselweni} alt="Shiselweni" style={{width:'100%',height:140,objectFit:'cover'}}/>
        <div style={{padding:14}}>
          <div style={{fontSize:15,fontWeight:700,color:'#f0f4ff',marginBottom:6}}>Shiselweni Region 🌿</div>
          <div style={{fontSize:12,color:'#8fa3c4',lineHeight:1.6,marginBottom:10}}>Eswatini's southern paradise — untouched forests, rivers and traditional villages.</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['🌿 Nature','📍 South','🆓 Uncrowded'].map(tag=>(
              <span key={tag} style={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MapTab({t}) {
  const [location,setLocation]       = useState(null);
  const [tracking,setTracking]       = useState(false);

  const [activeRoute,setActiveRoute] = useState(null);
  const [error,setError]             = useState('');
  const watchRef = useRef(null);useEffect(()=>()=>{if(watchRef.current)navigator.geolocation.clearWatch(watchRef.current);},[]);
  const startTracking = ()=>{
    if(!navigator.geolocation){setError('GPS not supported on this device.');return;}
    setTracking(true); setError('');
    navigator.geolocation.getCurrentPosition(
      pos=>setLocation({lat:pos.coords.latitude,lng:pos.coords.longitude,acc:Math.round(pos.coords.accuracy)}),
      ()=>setError('Could not get location. Please allow location access.'),{enableHighAccuracy:true,timeout:10000}
    );
    watchRef.current = navigator.geolocation.watchPosition(
      pos=>setLocation({lat:pos.coords.latitude,lng:pos.coords.longitude,acc:Math.round(pos.coords.accuracy)}),
      ()=>{},{enableHighAccuracy:true,maximumAge:3000}
    );
  };
  const routes = [
    {name:'🌿 Scenic Route', time:'2h 15m',dist:'87 km',   type:'Recommended',color:'#5dcaa5',desc:'Pass through Ezulwini Valley, Mantenga Falls, and Lobamba.',stops:['Mantenga Falls','Lobamba Village','Swazi Candles'],mapsUrl:'https://www.google.com/maps/dir/Mbabane/Mantenga+Falls+Eswatini/Lobamba+Eswatini'},
    {name:'⚡ Fastest Route', time:'1h 20m',dist:'62 km',   type:'Quick',       color:'#c9a227',desc:'Direct highway route via MR3.',stops:['Manzini Highway','Mbabane Bypass'],mapsUrl:'https://www.google.com/maps/dir/Mbabane/Manzini+Eswatini'},
    {name:'💰 Budget Route',  time:'2h 45m',dist:'E45 total',type:'Affordable', color:'#534ab7',desc:'Uses public kombi taxis.',stops:['Manzini Bus Rank','Mbabane Market'],mapsUrl:'https://www.google.com/maps/dir/Mbabane/Manzini+Bus+Rank+Eswatini'},
  ];
  return (
    <div>

      <div style={styles.sectionTitle}>{t.navigate}</div>
      {location?(
        <div style={{background:'rgba(29,158,117,0.12)',border:'0.5px solid rgba(29,158,117,0.3)',borderRadius:12,padding:14,marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:600,color:'#5dcaa5',marginBottom:6}}>📍 Your Live Location</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
            <div style={{background:'rgba(255,255,255,0.05)',borderRadius:8,padding:10}}>
              <div style={{fontSize:10,color:'#8fa3c4',marginBottom:3}}>Latitude</div>

              <div style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{location.lat.toFixed(6)}</div>
            </div>
            <div style={{background:'rgba(255,255,255,0.05)',borderRadius:8,padding:10}}>
              <div style={{fontSize:10,color:'#8fa3c4',marginBottom:3}}>Longitude</div>
              <div style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{location.lng.toFixed(6)}</div>
            </div>
          </div>
          <div style={{fontSize:12,color:'#5dcaa5',marginBottom:10}}>🟢 Location updating live</div>
          <button style={{...styles.btnPrimary,padding:'10px',fontSize:13}} onClick={()=>window.open(`https://www.google.com/maps?q=${location.lat},${location.lng}`,'_blank')}>📍 Open in Google Maps</button>
        </div>
      ):(
        <>
          {error&&<div style={{background:'rgba(226,75,74,0.1)',border:'0.5px solid rgba(226,75,74,0.3)',borderRadius:10,padding:12,marginBottom:12,fontSize:13,color:'#e24b4a'}}>{error}</div>}
          <button style={{...styles.btnPrimary,marginBottom:14}} onClick={startTracking}>📍 Show My Live Location</button>
        </>
      )}
      <div style={{background:'#0d2540',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:16,height:200,overflow:'hidden',marginBottom:16}}>
        <svg width="100%" height="100%" viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg">
          <rect width="340" height="200" fill="#0d2540"/>
          <rect x="10" y="10" width="320" height="180" rx="10" fill="#0f2a4a" stroke="rgba(201,162,39,0.2)" strokeWidth="0.5"/>
          <path d="M60 165 Q120 135 170 100 Q220 68 275 45" stroke="#c9a227" strokeWidth="3" fill="none" strokeDasharray="6,4" opacity="0.9"/>
          <circle cx="60" cy="165" r="8" fill="#e24b4a"/>
          <text x="60" y="169" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">{location?'📍':'A'}</text>
          <circle cx="170" cy="100" r="9" fill="#c9a227"/>
          <text x="170" y="104" textAnchor="middle" fill="#0a1628" fontSize="10" fontWeight="700">★</text>
          <circle cx="275" cy="45" r="7" fill="#5dcaa5"/>
          <text x="275" y="49" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">B</text>
        </svg>
      </div>
      <div style={styles.sectionTitle}>Smart Routes</div>
      {routes.map(r=>(
        <div key={r.name}>
          <div onClick={()=>setActiveRoute(activeRoute===r.name?null:r.name)} style={{background:'rgba(255,255,255,0.05)',border:`0.5px solid ${activeRoute===r.name?r.color:'rgba(201,162,39,0.2)'}`,borderRadius:activeRoute===r.name?'12px 12px 0 0':12,padding:'12px 14px',marginBottom:activeRoute===r.name?0:10,cursor:'pointer'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div style={{fontSize:14,fontWeight:600,color:'#f0f4ff'}}>{r.name}</div>
                <div style={{fontSize:12,color:'#8fa3c4',marginTop:3}}>{r.time} · {r.dist}</div>
              </div>
              <span style={{fontSize:11,padding:'3px 10px',borderRadius:20,border:`0.5px solid ${r.color}`,color:r.color}}>{r.type}</span>
            </div>
          </div>
          {activeRoute===r.name&&(
            <div style={{background:'rgba(255,255,255,0.03)',border:`0.5px solid ${r.color}`,borderTop:'none',borderRadius:'0 0 12px 12px',padding:14,marginBottom:10}}>
              <div style={{fontSize:13,color:'#b0c4de',lineHeight:1.6,marginBottom:10}}>{r.desc}</div>
              {r.stops.map((s,i)=>(
                <div key={i} style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:r.color,flexShrink:0}}/>

                  <div style={{fontSize:12,color:'#8fa3c4'}}>{s}</div>
                </div>
              ))}
              <button style={{...styles.btnPrimary,marginTop:12,padding:'11px',fontSize:13}} onClick={()=>window.open(r.mapsUrl,'_blank')}>🗺️ Open in Google Maps</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AITab({t}) {
  const [messages,setMessages] = useState([{role:'ai',text:"Sawubona! 👋 I'm Vaka, your Incaba AI Guide for the Kingdom of Eswatini.\n\nI can help with anything:\n• 🗓 Trip planning & itineraries\n• 🦁 Wildlife & nature parks\n• 🍽 Food, restaurants & local cuisine\n• 🎭 Culture, festivals & ceremonies\n• 🏨 Hotels & accommodation\n• 💱 Currency & money\n• 🌤️ Weather forecasts\n• 🚌 Transport & getting around\n• 🆘 Emergency help\n• 🌍 Any question about Eswatini\n\nWhat would you like to know? 💎"}
  ]);
  const [input,setInput]   = useState('');
  const [typing,setTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(()=>{
    if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight;
  },[messages,typing]);

  const getReply = async (msg)=>{
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({message: msg})
      });
      const data = await response.json();
      return data.reply || "Please try again! 🙏";
    } catch(e) {
      return "Could not connect. Please try again! 🙏";
    }
  };


  const send = async ()=>{
    if(!input.trim()) return;
    const userMsg = input;
    setMessages(prev=>[...prev,{role:'user',text:userMsg}]);
    setInput('');

    setTyping(true);
    const reply = await getReply(userMsg);
    setTyping(false);
    setMessages(prev=>[...prev,{role:'ai',text:reply}]);
  };

  return (
    <div style={{display:'flex',flexDirection:'column',height:'75vh'}}>
      <div style={{textAlign:'center',padding:'12px 0 8px'}}>
        <div style={{fontSize:40}}>🤖</div>
        <div style={{fontSize:17,fontWeight:700,color:'#f0f4ff'}}>{t.aiTitle}</div>
        <div style={{fontSize:11,color:'#8fa3c4'}}>{t.aiSub}</div>

      </div>
      <div ref={chatRef} style={{flex:1,overflowY:'auto',paddingBottom:12}}>
        {messages.map((m,i)=>(
          <div key={i} style={m.role==='ai'?styles.bubbleAI:styles.bubbleUser}>{m.text}</div>
        ))}
        {typing&&(
          <div style={{...styles.bubbleAI,display:'flex',gap:6,alignItems:'center',padding:'16px'}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:'#8fa3c4'}}/>
            <div style={{width:8,height:8,borderRadius:'50%',background:'#8fa3c4'}}/>
            <div style={{width:8,height:8,borderRadius:'50%',background:'#8fa3c4'}}/>
          </div>
        )}
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10}}>
        {['Plan my trip','Wildlife','Waterfalls','Local food','Swazi culture','Hotels','Weather','Currency','Transport','Emergency'].map(s=>(
          <button key={s} style={styles.pill} onClick={async()=>{
            setMessages(prev=>[...prev,{role:'user',text:s}]);
            setTyping(true);
            const reply = await getReply(s);
            setTyping(false);
            setMessages(prev=>[...prev,{role:'ai',text:reply}]);

          }}>{s}</button>
        ))}
      </div>
      <div style={{display:'flex',gap:8,paddingTop:6}}>
        <input style={styles.chatInput} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask anything about Eswatini..."/>
        <button style={styles.sendBtn} onClick={send}>➤</button>
      </div>
    </div>
  );
}

function DashTab({t}) {
  const bars=[45,62,55,78,100,88,70];
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return (
    <div>
      <div style={{background:'rgba(201,162,39,0.1)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:12,padding:14,marginBottom:16,display:'flex',alignItems:'center',gap:10}}>
        <span style={{fontSize:20}}>🔐</span>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:'#c9a227'}}>Admin Dashboard</div>
          <div style={{fontSize:11,color:'#8fa3c4'}}>Restricted access — Incaba administrators only</div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
        {[
          {val:'12,847',label:'Active Tourists',  delta:'↑ 23% this month'},
          {val:'E 4.2M', label:'Revenue Generated',delta:'↑ 18% this month'},
          {val:'89',     label:'Businesses Listed',delta:'↑ 12 new this week'},
          {val:'4.8★',   label:'App Rating',       delta:'↑ 0.2 points'},
        ].map(m=>(
          <div key={m.label} style={{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:12,padding:14}}>
            <div style={{fontSize:22,fontWeight:700,color:'#c9a227'}}>{m.val}</div>
            <div style={{fontSize:11,color:'#8fa3c4',marginTop:2}}>{m.label}</div>
            <div style={{fontSize:11,color:'#5dcaa5',marginTop:4}}>{m.delta}</div>
          </div>
        ))}
      </div>
      <div style={{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:14,padding:14,marginBottom:12}}>
        <div style={{fontSize:14,fontWeight:600,color:'#f0f4ff',marginBottom:4}}>Visitor Traffic — This Week</div>
        <div style={{fontSize:11,color:'#8fa3c4',marginBottom:12}}>Daily unique app sessions</div>
        <div style={{display:'flex',alignItems:'flex-end',gap:8,height:90}}>
          {bars.map((h,i)=>(
            <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
              <div style={{width:'100%',borderRadius:'4px 4px 0 0',height:`${h}%`,background:h===100?'linear-gradient(0deg,#c9a227,#e8b93a)':'rgba(201,162,39,0.25)'}}/>
              <span style={{fontSize:9,color:'#8fa3c4'}}>{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:14,padding:14}}>
        <div style={{fontSize:14,fontWeight:600,color:'#f0f4ff',marginBottom:10}}>Recent Activity</div>
        {[
          {color:'#5dcaa5',text:'New business registered: Royal Swazi Hotel',time:'5 min ago'},
          {color:'#c9a227',text:'Tourist reviewed Hlane Reserve — 5 stars',time:'12 min ago'},
          {color:'#534ab7',text:'New attraction added: Phophonyane Falls',time:'1 hour ago'},
          {color:'#e24b4a',text:'SOS resolved — tourist assisted in Lubombo',time:'2 hours ago'},
        ].map((a,i,arr)=>(
          <div key={i} style={{display:'flex',gap:10,padding:'10px 0',borderBottom:i<arr.length-1?'0.5px solid rgba(255,255,255,0.05)':'none'}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:a.color,flexShrink:0,marginTop:4}}/>
            <div>
              <div style={{fontSize:13,color:'#f0f4ff'}}>{a.text}</div>
              <div style={{fontSize:11,color:'#8fa3c4',marginTop:2}}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function BusinessTab({t}) {
  const [step,setStep]             = useState('list');
  const [form,setForm]             = useState({name:'',type:'Hotel',region:'',phone:'',email:'',desc:'',website:''});
  const [cardNum,setCardNum]       = useState('');
  const [expiry,setExpiry]         = useState('');
  const [cvv,setCvv]               = useState('');
  const [selectedBiz,setSelectedBiz] = useState(null);
  const [businesses,setBusinesses] = useState([
    {name:'Royal Swazi Hotel',      type:'Hotel',       region:'Ezulwini Valley',icon:'🏨',views:'1,240',verified:true, revenue:'E 4,500'},
    {name:"Malandela's Restaurant", type:'Restaurant',  region:'Malkerns',       icon:'🍴',views:'876',  verified:true, revenue:'E 2,800'},
    {name:'Swazi Candles Market',   type:'Craft Market',region:'Malkerns',       icon:'🎨',views:'654',  verified:true, revenue:'E 1,200'},
  ]);

  const submitPayment = ()=>{
    if(!cardNum||!expiry||!cvv){alert('Please fill in all payment details');return;}
    if(cardNum.replace(/\s/g,'').length<16){alert('Please enter a valid 16-digit card number');return;}
    alert('✅ Payment of E200 successful!\n\nYour business listing is now being reviewed. We will activate it within 24 hours.');
    setBusinesses(prev=>[...prev,{name:form.name,type:form.type,region:form.region,icon:'🏢',views:'0',verified:false,revenue:'E 0'}]);
    setStep('list');
    setForm({name:'',type:'Hotel',region:'',phone:'',email:'',desc:'',website:''});
    setCardNum(''); setExpiry(''); setCvv('');
  };

  if(selectedBiz) return (
    <div style={styles.app}>
      <div style={{background:'linear-gradient(135deg,#1a2a1a,#2d4a2d)',height:180,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,position:'relative'}}>
        <div style={{fontSize:64}}>{selectedBiz.icon}</div>
        <button onClick={()=>setSelectedBiz(null)} style={{position:'absolute',top:16,left:16,background:'rgba(10,22,40,0.7)',border:'0.5px solid rgba(255,255,255,0.2)',borderRadius:50,padding:'8px 14px',color:'#f0f4ff',fontSize:13,cursor:'pointer'}}>← Back</button>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:16}}>
        <h2 style={{fontSize:22,fontWeight:700,color:'#f0f4ff',marginBottom:4}}>{selectedBiz.name}</h2>
        <div style={{fontSize:13,color:'#8fa3c4',marginBottom:6}}>📍 {selectedBiz.region}</div>
        <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
          <span style={styles.tag}>{selectedBiz.type}</span>

          {selectedBiz.verified&&<span style={{...styles.tag,color:'#5dcaa5',borderColor:'rgba(29,158,117,0.3)'}}>✓ Verified</span>}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:14}}>
          {[['👁 Views',selectedBiz.views+'/week'],['💰 Revenue',selectedBiz.revenue],['⭐ Rating','4.7']].map(([l,v])=>(
            <div key={l} style={{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:10,padding:'12px 8px',textAlign:'center'}}>
              <div style={{fontSize:10,color:'#8fa3c4',marginBottom:4}}>{l}</div>
              <div style={{fontSize:13,fontWeight:600,color:'#c9a227'}}>{v}</div>
            </div>
          ))}
        </div>
        <ReviewsSection placeName={selectedBiz.name} t={t}/>
        <button style={{...styles.btnPrimary,marginBottom:20}} onClick={()=>window.open(`https://www.google.com/maps/search/${encodeURIComponent(selectedBiz.name)}+Eswatini`,'_blank')}>🗺️ Get Directions</button>
      </div>
    </div>
  );

  return (
    <div>
      {step==='list'&&(
        <>

          <div style={{background:'rgba(29,158,117,0.1)',border:'0.5px solid rgba(29,158,117,0.3)',borderRadius:16,padding:20,marginBottom:14}}>
            <div style={{fontSize:11,color:'#5dcaa5',fontWeight:600,letterSpacing:1,marginBottom:6}}>BUSINESS PORTAL</div>
            <div style={{fontSize:20,fontWeight:700,color:'#f0f4ff',marginBottom:6}}>Grow With Tourism 🌱</div>
            <div style={{fontSize:13,color:'#8fa3c4',lineHeight:1.6,marginBottom:4}}>List your business and reach thousands of tourists.</div>
            <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(201,162,39,0.08)',borderRadius:10,padding:'10px 12px',marginBottom:14}}>
              <span style={{fontSize:20}}>💰</span>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:'#c9a227'}}>E200/month listing fee</div>
                <div style={{fontSize:11,color:'#8fa3c4'}}>Pay upfront — listing goes live within 24 hours</div>
              </div>
            </div>
            <button style={{...styles.btnPrimary,padding:'11px 24px',fontSize:14}} onClick={()=>setStep('register')}>+ Register Your Business</button>
          </div>
          <div style={styles.sectionTitle}>Active Businesses</div>
          {businesses.map(b=>(
            <div key={b.name} style={{...styles.bizCard,cursor:'pointer'}} onClick={()=>setSelectedBiz(b)}>
              <div style={{width:46,height:46,borderRadius:12,background:'rgba(201,162,39,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{b.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600,color:'#f0f4ff'}}>{b.name}</div>
                <div style={{fontSize:12,color:'#8fa3c4',marginTop:2}}>{b.type} · {b.region}</div>
                {b.verified&&<span style={{fontSize:10,padding:'2px 8px',borderRadius:6,background:'rgba(29,158,117,0.15)',color:'#5dcaa5',border:'0.5px solid rgba(29,158,117,0.3)',marginTop:4,display:'inline-block'}}>✓ Verified</span>}
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'#c9a227'}}>{b.views}</div>
                <div style={{fontSize:10,color:'#8fa3c4'}}>views/week</div>
                <div style={{fontSize:10,color:'#c9a227',marginTop:4}}>Tap →</div>
              </div>
            </div>
          ))}
        </>
      )}

      {step==='register'&&(
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
            <button onClick={()=>setStep('list')} style={{background:'transparent',border:'none',color:'#c9a227',fontSize:20,cursor:'pointer'}}>←</button>
            <div style={{fontSize:18,fontWeight:700,color:'#f0f4ff'}}>Register Business</div>
          </div>
          {[
            {label:'Business Name *',key:'name',    type:'text',  ph:'e.g. My Eswatini Lodge'},
            {label:'Phone Number *', key:'phone',   type:'tel',   ph:'e.g. +268 2XXX XXXX'},
            {label:'Email Address *',key:'email',   type:'email', ph:'e.g. info@mybusiness.com'},

            {label:'Region / Area',  key:'region',  type:'text',  ph:'e.g. Ezulwini Valley'},
            {label:'Website',        key:'website', type:'url',   ph:'e.g. www.myhotel.com'},
            {label:'Description',    key:'desc',    type:'text',  ph:'Tell tourists about your business'},
          ].map(f=>(
            <div key={f.key} style={{marginBottom:12}}>
              <div style={{fontSize:12,color:'#8fa3c4',marginBottom:6}}>{f.label}</div>
              <input type={f.type} value={form[f.key]} onChange={e=>setForm(prev=>({...prev,[f.key]:e.target.value}))} placeholder={f.ph} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px 14px',color:'#f0f4ff',fontSize:13,outline:'none',boxSizing:'border-box'}}/>
            </div>
          ))}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,color:'#8fa3c4',marginBottom:6}}>Business Type</div>
            <select value={form.type} onChange={e=>setForm(prev=>({...prev,type:e.target.value}))} style={{width:'100%',background:'#0f2040',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px 14px',color:'#c9a227',fontSize:13,outline:'none',cursor:'pointer'}}>
              {['Hotel','Restaurant','Craft Market','Tour Operator','Activity Centre','Transport','Spa & Wellness','Other'].map(o=><option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <button style={{...styles.btnPrimary}} onClick={()=>{if(!form.name||!form.phone||!form.email){alert('Please fill in all required fields');return;}setStep('payment');}}>Continue to Payment →</button>
        </div>
      )}
      {step==='payment'&&(
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
            <button onClick={()=>setStep('register')} style={{background:'transparent',border:'none',color:'#c9a227',fontSize:20,cursor:'pointer'}}>←</button>
            <div style={{fontSize:18,fontWeight:700,color:'#f0f4ff'}}>Payment</div>
          </div>
          <div style={{background:'rgba(201,162,39,0.08)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:14,padding:16,marginBottom:20}}>
            <div style={{fontSize:13,color:'#8fa3c4',marginBottom:4}}>Listing for: <span style={{color:'#f0f4ff',fontWeight:600}}>{form.name}</span></div>
            <div style={{fontSize:22,fontWeight:700,color:'#c9a227'}}>E200.00</div>
            <div style={{fontSize:12,color:'#8fa3c4'}}>Monthly listing fee</div>
          </div>
          <div style={{marginBottom:12}}>

            <div style={{fontSize:12,color:'#8fa3c4',marginBottom:6}}>Card Number</div>
            <input value={cardNum} onChange={e=>setCardNum(e.target.value.replace(/\D/g,'').replace(/(\d{4})/g,'$1 ').trim().slice(0,19))} placeholder="1234 5678 9012 3456" maxLength={19} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'12px 14px',color:'#f0f4ff',fontSize:16,outline:'none',boxSizing:'border-box',letterSpacing:2}}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
            <div>
              <div style={{fontSize:12,color:'#8fa3c4',marginBottom:6}}>Expiry Date</div>
              <input value={expiry} onChange={e=>setExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'12px 14px',color:'#f0f4ff',fontSize:14,outline:'none',boxSizing:'border-box'}}/>
            </div>
            <div>
              <div style={{fontSize:12,color:'#8fa3c4',marginBottom:6}}>CVV</div>
              <input value={cvv} onChange={e=>setCvv(e.target.value.replace(/\D/g,''))} placeholder="123" maxLength={3} type="password" style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'12px 14px',color:'#f0f4ff',fontSize:14,outline:'none',boxSizing:'border-box'}}/>
            </div>
          </div>
          <div style={{background:'rgba(29,158,117,0.08)',border:'0.5px solid rgba(29,158,117,0.2)',borderRadius:10,padding:12,marginBottom:16,display:'flex',gap:8,alignItems:'center'}}>
            <span style={{fontSize:16}}>🔒</span>
            <div style={{fontSize:12,color:'#5dcaa5'}}>Your payment is secured with 256-bit SSL encryption</div>
          </div>
          <button style={{...styles.btnPrimary,marginBottom:10}} onClick={submitPayment}>Pay E200 & Submit Listing</button>
          <button style={{width:'100%',padding:'11px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:'transparent',color:'#8fa3c4',cursor:'pointer',fontSize:14}} onClick={()=>setStep('register')}>← Back</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  splash:{minHeight:'100vh',background:'linear-gradient(160deg,#0a1628 0%,#0d1f3c 40%,#0a1628 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'2rem',position:'relative',overflow:'hidden'},
  splashGlow:{position:'absolute',top:'20%',left:'50%',transform:'translateX(-50%)',width:300,height:300,background:'radial-gradient(circle,rgba(201,162,39,0.1) 0%,transparent 70%)',borderRadius:'50%',pointerEvents:'none'},
  splashTitle:{fontSize:48,fontWeight:700,color:'#f0f4ff',margin:'0 0 6px',letterSpacing:-1},
  gold:{color:'#c9a227'},
  btnPrimary:{background:'linear-gradient(135deg,#c9a227,#e8b93a)',color:'#0a1628',border:'none',padding:'14px 40px',borderRadius:50,fontSize:16,fontWeight:700,cursor:'pointer',width:'100%',maxWidth:480},
  authInput:{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'12px 14px',color:'#f0f4ff',fontSize:14,outline:'none',marginBottom:12,boxSizing:'border-box',fontFamily:'inherit'},
  app:{minHeight:'100vh',background:'#0a1628',display:'flex',flexDirection:'column',maxWidth:480,margin:'0 auto'},
  topbar:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',borderBottom:'0.5px solid rgba(201,162,39,0.25)',background:'rgba(10,22,40,0.98)',position:'sticky',top:0,zIndex:100},
  langBtn:{fontSize:11,padding:'3px 8px',borderRadius:6,border:'0.5px solid rgba(201,162,39,0.3)',color:'#8fa3c4',cursor:'pointer',background:'transparent'},
  langBtnActive:{color:'#c9a227',background:'rgba(201,162,39,0.15)'},
  content:{flex:1,overflowY:'auto',padding:16},
  bottomNav:{display:'flex',justifyContent:'space-around',padding:'10px 0 16px',borderTop:'0.5px solid rgba(201,162,39,0.25)',background:'rgba(10,22,40,0.98)',position:'sticky',bottom:0},
  navItem:{display:'flex',flexDirection:'column',alignItems:'center',gap:3,cursor:'pointer',padding:'4px 8px',borderRadius:12},
  navActive:{display:'flex',flexDirection:'column',alignItems:'center',gap:3,cursor:'pointer',padding:'4px 8px',borderRadius:12,background:'rgba(201,162,39,0.1)'},
  sosBtn:{display:'flex',alignItems:'center',gap:10,background:'rgba(226,75,74,0.1)',border:'1px solid rgba(226,75,74,0.3)',borderRadius:12,padding:'12px 14px',marginBottom:14,cursor:'pointer'},
  heroBanner:{background:'linear-gradient(135deg,#1a3a5c,#0d2540)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:16,padding:20,marginBottom:14},
  heroBadge:{fontSize:11,color:'#f5d87a',background:'rgba(201,162,39,0.15)',border:'0.5px solid rgba(201,162,39,0.4)',padding:'4px 10px',borderRadius:20,display:'inline-block',marginBottom:10,fontWeight:600},

  hstat:{flex:1,background:'rgba(201,162,39,0.08)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:10,padding:10,textAlign:'center'},
  aiCard:{background:'rgba(83,74,183,0.15)',border:'0.5px solid rgba(131,122,221,0.35)',borderRadius:14,padding:'14px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:12,cursor:'pointer'},
  sectionTitle:{fontSize:16,fontWeight:600,color:'#f0f4ff',marginBottom:12,marginTop:4},
  placesGrid:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16},
  placeCard:{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:14,overflow:'hidden',cursor:'pointer'},
  placeImgBox:{height:110,overflow:'hidden',position:'relative'},
  placeCategory:{position:'absolute',top:8,right:8,fontSize:9,fontWeight:700,background:'rgba(201,162,39,0.9)',color:'#0a1628',padding:'2px 7px',borderRadius:6},
  tag:{fontSize:11,padding:'3px 8px',borderRadius:20,border:'0.5px solid rgba(201,162,39,0.3)',color:'#c9a227',background:'rgba(201,162,39,0.08)'},
  infoBadge:{fontSize:11,padding:'5px 10px',borderRadius:20,border:'0.5px solid rgba(201,162,39,0.3)',color:'#c9a227',background:'rgba(201,162,39,0.08)'},
  bizCard:{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:14,padding:'12px 14px',marginBottom:10,display:'flex',alignItems:'center',gap:12},
  bubbleAI:{background:'rgba(83,74,183,0.15)',border:'0.5px solid rgba(131,122,221,0.25)',borderRadius:14,padding:'12px 14px',marginBottom:10,fontSize:13,color:'#f0f4ff',lineHeight:1.7,whiteSpace:'pre-line',maxWidth:'85%'},
  bubbleUser:{background:'rgba(201,162,39,0.12)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:14,padding:'12px 14px',marginBottom:10,fontSize:13,color:'#f0f4ff',lineHeight:1.7,whiteSpace:'pre-line',maxWidth:'85%',marginLeft:'auto'},
  chatInput:{flex:1,background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:24,padding:'11px 16px',color:'#f0f4ff',fontSize:14,outline:'none',fontFamily:'inherit'},
  sendBtn:{width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,#c9a227,#e8b93a)',border:'none',cursor:'pointer',fontSize:16,color:'#0a1628',fontWeight:700,flexShrink:0},
  pill:{padding:'6px 12px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.25)',fontSize:11,cursor:'pointer',background:'rgba(255,255,255,0.04)',color:'#f0f4ff',fontFamily:'inherit'},
};

export default App;
