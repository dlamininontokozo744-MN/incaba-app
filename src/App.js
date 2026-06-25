import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

// A stable anonymous ID per device/browser, so a tourist can see their own
// order/booking history without needing to create an account.
function getDeviceId(){
  let id = localStorage.getItem('incaba_device_id');
  if(!id){
    id = 'dev_'+Math.random().toString(36).slice(2)+Date.now().toString(36);
    localStorage.setItem('incaba_device_id', id);
  }
  return id;
}

// ── LOCAL IMAGE HELPER ────────────────────────────────────
// Pulls every image bundled in src/images so we can reference them by filename
// instead of relying on external stock-photo URLs.
const localImageFiles = require.context('./images', false, /\.(png|jpe?g|PNG|JPG|JPEG)$/);
const LOCAL_IMAGES = {};
localImageFiles.keys().forEach(key=>{
  const name = key.replace('./','');
  LOCAL_IMAGES[name] = localImageFiles(key);
});
// limg('hotel-bk') matches hotel-bk.jpg, hotel-bk2.jpg, etc. Pass an exact filename for an exact match.
function limg(nameOrPrefix){
  if(LOCAL_IMAGES[nameOrPrefix]) return LOCAL_IMAGES[nameOrPrefix];
  const match = Object.keys(LOCAL_IMAGES).find(k=>k.toLowerCase().startsWith(nameOrPrefix.toLowerCase()));
  return match ? LOCAL_IMAGES[match] : null;
}
// limgAll('hotel-bulembu') -> array of every matching local image, in filename order
function limgAll(prefix){
  return Object.keys(LOCAL_IMAGES)
    .filter(k=>k.toLowerCase().startsWith(prefix.toLowerCase()))
    .sort()
    .map(k=>LOCAL_IMAGES[k]);
}

// ── FREE PHOTO HELPER ─────────────────────────────────────
const ESWATINI_PHOTOS = {
  'lion,safari,africa':'https://media.istockphoto.com/id/1912469501/photo/elephant-and-safari-car-at-sunset-time-hlane-national-park-swaziland.jpg?s=612x612&w=0&k=20&c=fY4mpd5mii-B8sYGxaKFYaNKP2oeH8Okx8CeQeiuCRU=',
  'waterfall,africa,tropical':'https://media.istockphoto.com/id/2177722259/photo/explore-the-serene-beauty-of-a-hidden-waterfall-in-eswatini-surrounded-by-lush-greenery-and.jpg?s=612x612&w=0&k=20&c=os8NAfE0MLu8WVPxcvaKqci3CtfY0dJyt3ZM5IhzvjU=',
  'african,village,traditional,culture':'https://media.istockphoto.com/id/1215749788/photo/traditional-beehive-huts-in-swaziland.jpg?s=612x612&w=0&k=20&c=JtZAdQyCQKN_NDmeLKjAQ0NkeHI3I3Z5qIGRxFjPG9M=',
  'african,craft,market,colorful':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'mountain,africa,landscape,green':'https://media.istockphoto.com/id/1007281912/photo/swaziland-highlands.jpg?s=612x612&w=0&k=20&c=1GBGLCrZTa8uiq_Hvg64wNqsw1_P_nn_V6h3gmfIK54=',
  'granite,rock,hiking,landscape':'https://media.istockphoto.com/id/1214442301/photo/huge-monolith-rock-next-to-mbabane-eswatini.jpg?s=612x612&w=0&k=20&c=4rnZgMWK4fPI3gwLWANeT1Ijjwl8KdqDZVYDwJxPGbU=',
  'africa,river,forest,landscape':'https://media.istockphoto.com/id/2192234701/photo/beautiful-landscape-with-a-forest-and-mountains-at-piggs-peak-in-eswatini.jpg?s=612x612&w=0&k=20&c=vQeLJUZ6N2WRYwqxOD4YVMDOUgt7nsC31WSPYiUQuGQ=',
  'lion,wildlife,africa':'https://media.istockphoto.com/id/1538107598/photo/image-gazelle-looks-at-the-camera-on-hlane-national-park-in-swaziland.webp?a=1&b=1&s=612x612&w=0&k=20&c=oGCyzY7SPl874j3CNMOwTWjHZTnyzIcPqrrQ2kyG9ak=',
  'elephant,safari':'https://media.istockphoto.com/id/1912469501/photo/elephant-and-safari-car-at-sunset-time-hlane-national-park-swaziland.jpg?s=612x612&w=0&k=20&c=fY4mpd5mii-B8sYGxaKFYaNKP2oeH8Okx8CeQeiuCRU=',
  'rhino,africa,wildlife':'https://media.istockphoto.com/id/2237261451/photo/white-rhinoceros-in-hlane-national-park-in-eswatini.jpg?s=612x612&w=0&k=20&c=i-KP1m9bo0h7qndhtYHWo7Z9X9aLrCxGRF4O3x19hZ0=',
  'giraffe,africa':'https://media.istockphoto.com/id/1538107619/photo/a-rhino-standing-on-hlane-national-park-in-swaziland.webp?a=1&b=1&s=612x612&w=0&k=20&c=IytbtA_-UiJJj314UDsvq61l3trcvFNw0yoDQDp4Ihg=',
  'zebra,africa,safari':'https://media.istockphoto.com/id/2277018235/photo/roan-antelopes-mlilwane-wildlife-sanctuary-eswatini.jpg?s=612x612&w=0&k=20&c=6xdIDC2PBYIsMswOkKW4_TUunXYrr37wI-Uai99QGpA=',
  'bird,africa,wildlife':'https://media.istockphoto.com/id/2276876294/photo/a-hamerkop-bird-hlane-royal-national-park-eswatini.jpg?s=612x612&w=0&k=20&c=5m1LUjs12a1uL5Z833hbUY_KGa42skWZT4lz0xH6DIM=',
  'waterfall,africa,nature':'https://media.istockphoto.com/id/2177722259/photo/explore-the-serene-beauty-of-a-hidden-waterfall-in-eswatini-surrounded-by-lush-greenery-and.jpg?s=612x612&w=0&k=20&c=os8NAfE0MLu8WVPxcvaKqci3CtfY0dJyt3ZM5IhzvjU=',
  'waterfall,swimming,tropical':'https://media.istockphoto.com/id/2270258138/photo/the-impressive-phophonyane-falls-cascading-down-the-ancient-archaean-gneiss-in-the-piggs-peak.jpg?s=612x612&w=0&k=20&c=bBohw7KExlUF-9Omqrl6amP_aPKlzhvoA35SSRH9_R4=',
  'jungle,waterfall,green':'https://media.istockphoto.com/id/2177722259/photo/explore-the-serene-beauty-of-a-hidden-waterfall-in-eswatini-surrounded-by-lush-greenery-and.jpg?s=612x612&w=0&k=20&c=os8NAfE0MLu8WVPxcvaKqci3CtfY0dJyt3ZM5IhzvjU=',
  'hiking,waterfall':'https://media.istockphoto.com/id/2270258138/photo/the-impressive-phophonyane-falls-cascading-down-the-ancient-archaean-gneiss-in-the-piggs-peak.jpg?s=612x612&w=0&k=20&c=bBohw7KExlUF-9Omqrl6amP_aPKlzhvoA35SSRH9_R4=',
  'nature,river,africa':'https://media.istockphoto.com/id/2199850478/photo/a-river-in-the-mountains-flows-down.jpg?s=612x612&w=0&k=20&c=Qd6eA9o5wSYFduiCaxjgFCP4S9ppPUDGlLYZJRTP7b4=',
  'african,culture,traditional':'https://media.istockphoto.com/id/1215749788/photo/traditional-beehive-huts-in-swaziland.jpg?s=612x612&w=0&k=20&c=JtZAdQyCQKN_NDmeLKjAQ0NkeHI3I3Z5qIGRxFjPG9M=',
  'african,ceremony,dance':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'africa,museum,heritage':'https://media.istockphoto.com/id/1051594302/photo/swaziland-valley-of-ezulwini.webp?a=1&b=1&s=612x612&w=0&k=20&c=2Riei98Nbq3cxQXv8Ie3c6e_NjMyAk1ZwPKzUC0sDFk=',
  'african,village,people':'https://media.istockphoto.com/id/1215749788/photo/traditional-beehive-huts-in-swaziland.jpg?s=612x612&w=0&k=20&c=JtZAdQyCQKN_NDmeLKjAQ0NkeHI3I3Z5qIGRxFjPG9M=',
  'africa,traditional,dress':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'candles,colorful,handmade':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'african,craft,market':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'african,art,souvenir':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'market,africa,colorful':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'handcraft,africa,basket':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'mountain,green,africa,landscape':'https://media.istockphoto.com/id/1007080492/photo/malalotja-nature-reserve.webp?a=1&b=1&s=612x612&w=0&k=20&c=C9yO3ncy4tctZ8GMme-T060cnZsop0XFNQhKm_A9oGk=',
  'zipline,canopy,forest':'https://media.istockphoto.com/id/1007080492/photo/malalotja-nature-reserve.webp?a=1&b=1&s=612x612&w=0&k=20&c=C9yO3ncy4tctZ8GMme-T060cnZsop0XFNQhKm_A9oGk=',
  'orchid,flowers,wild':'https://media.istockphoto.com/id/2192234701/photo/beautiful-landscape-with-a-forest-and-mountains-at-piggs-peak-in-eswatini.jpg?s=612x612&w=0&k=20&c=vQeLJUZ6N2WRYwqxOD4YVMDOUgt7nsC31WSPYiUQuGQ=',
  'hiking,mountain,africa':'https://media.istockphoto.com/id/1007080492/photo/malalotja-nature-reserve.webp?a=1&b=1&s=612x612&w=0&k=20&c=C9yO3ncy4tctZ8GMme-T060cnZsop0XFNQhKm_A9oGk=',
  'rock,climbing,hiking':'https://media.istockphoto.com/id/1214442301/photo/huge-monolith-rock-next-to-mbabane-eswatini.jpg?s=612x612&w=0&k=20&c=4rnZgMWK4fPI3gwLWANeT1Ijjwl8KdqDZVYDwJxPGbU=',
  'granite,landscape,panoramic':'https://media.istockphoto.com/id/1214442301/photo/huge-monolith-rock-next-to-mbabane-eswatini.jpg?s=612x612&w=0&k=20&c=4rnZgMWK4fPI3gwLWANeT1Ijjwl8KdqDZVYDwJxPGbU=',
  'hiking,summit,views':'https://media.istockphoto.com/id/1007281912/photo/swaziland-highlands.jpg?s=612x612&w=0&k=20&c=1GBGLCrZTa8uiq_Hvg64wNqsw1_P_nn_V6h3gmfIK54=',
  'rock,formation,africa':'https://media.istockphoto.com/id/1214442301/photo/huge-monolith-rock-next-to-mbabane-eswatini.jpg?s=612x612&w=0&k=20&c=4rnZgMWK4fPI3gwLWANeT1Ijjwl8KdqDZVYDwJxPGbU=',
  'mountain,trail,hiking':'https://media.istockphoto.com/id/2192234701/photo/beautiful-landscape-with-a-forest-and-mountains-at-piggs-peak-in-eswatini.jpg?s=612x612&w=0&k=20&c=vQeLJUZ6N2WRYwqxOD4YVMDOUgt7nsC31WSPYiUQuGQ=',
  'africa,forest,green,river':'https://media.istockphoto.com/id/2270258186/photo/view-over-the-rural-settlements-of-piggs-peak-eswatini-framed-by-leaves-of-the-forest-in-the.jpg?s=612x612&w=0&k=20&c=E-OW2cqL4vUR-6zfNPOut14iS67JIlgHlhMO1eaDIGE=',
  'village,africa,traditional':'https://media.istockphoto.com/id/1215749788/photo/traditional-beehive-huts-in-swaziland.jpg?s=612x612&w=0&k=20&c=JtZAdQyCQKN_NDmeLKjAQ0NkeHI3I3Z5qIGRxFjPG9M=',
  'africa,landscape,trees':'https://media.istockphoto.com/id/2192234701/photo/beautiful-landscape-with-a-forest-and-mountains-at-piggs-peak-in-eswatini.jpg?s=612x612&w=0&k=20&c=vQeLJUZ6N2WRYwqxOD4YVMDOUgt7nsC31WSPYiUQuGQ=',
  'river,africa,nature':'https://media.istockphoto.com/id/2199850478/photo/a-river-in-the-mountains-flows-down.jpg?s=612x612&w=0&k=20&c=Qd6eA9o5wSYFduiCaxjgFCP4S9ppPUDGlLYZJRTP7b4=',
  'africa,rural,traditional':'https://media.istockphoto.com/id/2270258186/photo/view-over-the-rural-settlements-of-piggs-peak-eswatini-framed-by-leaves-of-the-forest-in-the.jpg?s=612x612&w=0&k=20&c=E-OW2cqL4vUR-6zfNPOut14iS67JIlgHlhMO1eaDIGE=',
  'african,restaurant,garden,outdoor':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'fine,dining,restaurant,elegant':'https://media.istockphoto.com/id/1366839528/photo/the-capital-downtown-with-the-mall-building-and-wide-street-mbabane-swaziland.jpg?s=612x612&w=0&k=20&c=OvfQ7GpZlXJLk650Zz3QDZy82ZUKjCByuL3sVe1Z77E=',
  'pub,restaurant,countryside,cozy':'https://media.istockphoto.com/id/172126051/photo/horse-riding-milwane-wildlife-sanctuary-swaziland-africa.jpg?s=612x612&w=0&k=20&c=0ppkEdShlruVdiEaFVl4Y77YfW60tFMgLVEtfrLstHk=',
  'food,court,mall,restaurant':'https://media.istockphoto.com/id/1366839528/photo/the-capital-downtown-with-the-mall-building-and-wide-street-mbabane-swaziland.jpg?s=612x612&w=0&k=20&c=OvfQ7GpZlXJLk650Zz3QDZy82ZUKjCByuL3sVe1Z77E=',
  'african,starter,food,appetizer':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'soup,african,bowl,food':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'grilled,fish,african,food':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'grilled,chicken,african,food':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'braai,bbq,grilled,meat,african':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'african,traditional,food,plate':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'porridge,african,food,traditional':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'juice,tropical,fruit,drink':'https://media.istockphoto.com/id/2060084283/photo/swazi-lilangeni-a-business-background.jpg?s=612x612&w=0&k=20&c=dssv-iTM1qG-DDttnhQIs8HQWTBsXIzMQCURHILpREw=',
  'cold,drink,refreshing,soda':'https://media.istockphoto.com/id/2060084283/photo/swazi-lilangeni-a-business-background.jpg?s=612x612&w=0&k=20&c=dssv-iTM1qG-DDttnhQIs8HQWTBsXIzMQCURHILpREw=',
  'english,breakfast,eggs,bacon':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'continental,breakfast,pastry,fruit':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'steak,beef,fine,dining':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'pasta,seafood,restaurant,food':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'wine,glass,restaurant,elegant':'https://media.istockphoto.com/id/1366839528/photo/the-capital-downtown-with-the-mall-building-and-wide-street-mbabane-swaziland.jpg?s=612x612&w=0&k=20&c=OvfQ7GpZlXJLk650Zz3QDZy82ZUKjCByuL3sVe1Z77E=',
  'fresh,juice,tropical,glass':'https://media.istockphoto.com/id/2060084283/photo/swazi-lilangeni-a-business-background.jpg?s=612x612&w=0&k=20&c=dssv-iTM1qG-DDttnhQIs8HQWTBsXIzMQCURHILpREw=',
  'burger,beef,chips,pub':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'fish,chips,pub,food':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'ribeye,steak,grill,restaurant':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'chicken,strips,crispy,food':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'beer,draft,pub,glass':'https://media.istockphoto.com/id/1366839528/photo/the-capital-downtown-with-the-mall-building-and-wide-street-mbabane-swaziland.jpg?s=612x612&w=0&k=20&c=OvfQ7GpZlXJLk650Zz3QDZy82ZUKjCByuL3sVe1Z77E=',
  'cider,apple,drink,glass':'https://media.istockphoto.com/id/2060084283/photo/swazi-lilangeni-a-business-background.jpg?s=612x612&w=0&k=20&c=dssv-iTM1qG-DDttnhQIs8HQWTBsXIzMQCURHILpREw=',
  'fried,chicken,chips,fast,food':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'pizza,slice,food':'https://media.istockphoto.com/id/1366839528/photo/the-capital-downtown-with-the-mall-building-and-wide-street-mbabane-swaziland.jpg?s=612x612&w=0&k=20&c=OvfQ7GpZlXJLk650Zz3QDZy82ZUKjCByuL3sVe1Z77E=',
  'pap,stew,african,food,traditional':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'fried,bread,food,african':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'milkshake,drink,glass,sweet':'https://media.istockphoto.com/id/2060084283/photo/swazi-lilangeni-a-business-background.jpg?s=612x612&w=0&k=20&c=dssv-iTM1qG-DDttnhQIs8HQWTBsXIzMQCURHILpREw=',
  'water,bottle,drink,clear':'https://media.istockphoto.com/id/2199850478/photo/a-river-in-the-mountains-flows-down.jpg?s=612x612&w=0&k=20&c=Qd6eA9o5wSYFduiCaxjgFCP4S9ppPUDGlLYZJRTP7b4=',
  'luxury,hotel,africa,resort':'https://media.istockphoto.com/id/1051594302/photo/swaziland-valley-of-ezulwini.webp?a=1&b=1&s=612x612&w=0&k=20&c=2Riei98Nbq3cxQXv8Ie3c6e_NjMyAk1ZwPKzUC0sDFk=',
  'african,lodge,traditional,hut':'https://media.istockphoto.com/id/1215749788/photo/traditional-beehive-huts-in-swaziland.jpg?s=612x612&w=0&k=20&c=JtZAdQyCQKN_NDmeLKjAQ0NkeHI3I3Z5qIGRxFjPG9M=',
  'countryside,hotel,garden,charming':'https://media.istockphoto.com/id/172126051/photo/horse-riding-milwane-wildlife-sanctuary-swaziland-africa.jpg?s=612x612&w=0&k=20&c=0ppkEdShlruVdiEaFVl4Y77YfW60tFMgLVEtfrLstHk=',
  'backpacker,hostel,budget,travel':'https://media.istockphoto.com/id/1330204854/photo/our-first-camping-trip.jpg?s=612x612&w=0&k=20&c=Oed9NCIfw0oW7XokrOq-6dl57D5WhJ3QJz5AvU8G3QY=',
  'hotel,room,luxury,bedroom':'https://media.istockphoto.com/id/1051594302/photo/swaziland-valley-of-ezulwini.webp?a=1&b=1&s=612x612&w=0&k=20&c=2Riei98Nbq3cxQXv8Ie3c6e_NjMyAk1ZwPKzUC0sDFk=',
  'luxury,suite,hotel,elegant':'https://media.istockphoto.com/id/1007281912/photo/swaziland-highlands.jpg?s=612x612&w=0&k=20&c=1GBGLCrZTa8uiq_Hvg64wNqsw1_P_nn_V6h3gmfIK54=',
  'presidential,suite,luxury,hotel':'https://media.istockphoto.com/id/2192234727/photo/mantenga-nature-reserve-and-cultural-village-in-eswatini.webp?a=1&b=1&s=612x612&w=0&k=20&c=JkQOOI0M6ylg7y8aOSHHReW-j64j7pTsT7BTBx0UaJs=',
  'african,hut,traditional,accommodation':'https://media.istockphoto.com/id/1215749788/photo/traditional-beehive-huts-in-swaziland.jpg?s=612x612&w=0&k=20&c=JtZAdQyCQKN_NDmeLKjAQ0NkeHI3I3Z5qIGRxFjPG9M=',
  'african,lodge,room,traditional':'https://media.istockphoto.com/id/1215749788/photo/traditional-beehive-huts-in-swaziland.jpg?s=612x612&w=0&k=20&c=JtZAdQyCQKN_NDmeLKjAQ0NkeHI3I3Z5qIGRxFjPG9M=',
  'luxury,lodge,africa,room':'https://media.istockphoto.com/id/1912469501/photo/elephant-and-safari-car-at-sunset-time-hlane-national-park-swaziland.jpg?s=612x612&w=0&k=20&c=fY4mpd5mii-B8sYGxaKFYaNKP2oeH8Okx8CeQeiuCRU=',
  'garden,room,hotel,cozy':'https://media.istockphoto.com/id/2192234701/photo/beautiful-landscape-with-a-forest-and-mountains-at-piggs-peak-in-eswatini.jpg?s=612x612&w=0&k=20&c=vQeLJUZ6N2WRYwqxOD4YVMDOUgt7nsC31WSPYiUQuGQ=',
  'forest,suite,hotel,room':'https://media.istockphoto.com/id/2270258186/photo/view-over-the-rural-settlements-of-piggs-peak-eswatini-framed-by-leaves-of-the-forest-in-the.jpg?s=612x612&w=0&k=20&c=E-OW2cqL4vUR-6zfNPOut14iS67JIlgHlhMO1eaDIGE=',
  'cottage,country,bedroom,cozy':'https://media.istockphoto.com/id/172126051/photo/horse-riding-milwane-wildlife-sanctuary-swaziland-africa.jpg?s=612x612&w=0&k=20&c=0ppkEdShlruVdiEaFVl4Y77YfW60tFMgLVEtfrLstHk=',
  'hostel,dorm,backpacker,bed':'https://media.istockphoto.com/id/1330204854/photo/our-first-camping-trip.jpg?s=612x612&w=0&k=20&c=Oed9NCIfw0oW7XokrOq-6dl57D5WhJ3QJz5AvU8G3QY=',
  'hostel,private,room,simple':'https://media.istockphoto.com/id/1330204854/photo/our-first-camping-trip.jpg?s=612x612&w=0&k=20&c=Oed9NCIfw0oW7XokrOq-6dl57D5WhJ3QJz5AvU8G3QY=',
  'budget,hotel,room,clean':'https://media.istockphoto.com/id/1214442301/photo/huge-monolith-rock-next-to-mbabane-eswatini.jpg?s=612x612&w=0&k=20&c=4rnZgMWK4fPI3gwLWANeT1Ijjwl8KdqDZVYDwJxPGbU=',
  'luxury,hotel,pool,africa':'https://media.istockphoto.com/id/1051594302/photo/swaziland-valley-of-ezulwini.webp?a=1&b=1&s=612x612&w=0&k=20&c=2Riei98Nbq3cxQXv8Ie3c6e_NjMyAk1ZwPKzUC0sDFk=',
  'hotel,spa,wellness':'https://media.istockphoto.com/id/1007281912/photo/swaziland-highlands.jpg?s=612x612&w=0&k=20&c=1GBGLCrZTa8uiq_Hvg64wNqsw1_P_nn_V6h3gmfIK54=',
  'hotel,restaurant,fine,dining':'https://media.istockphoto.com/id/1366839528/photo/the-capital-downtown-with-the-mall-building-and-wide-street-mbabane-swaziland.jpg?s=612x612&w=0&k=20&c=OvfQ7GpZlXJLk650Zz3QDZy82ZUKjCByuL3sVe1Z77E=',
  'hotel,golf,course,green':'https://media.istockphoto.com/id/1369538162/photo/drone-photography-sugar-cane-farm-sugar-cane-fields-view-from-the-sky.jpg?s=612x612&w=0&k=20&c=Z5SZBir9vzgupfc88b--OL_6SZ8PJCutjv_9oIXofmU=',
  'hotel,lobby,luxury':'https://media.istockphoto.com/id/1366839528/photo/the-capital-downtown-with-the-mall-building-and-wide-street-mbabane-swaziland.jpg?s=612x612&w=0&k=20&c=OvfQ7GpZlXJLk650Zz3QDZy82ZUKjCByuL3sVe1Z77E=',
  'african,village,traditional,huts':'https://media.istockphoto.com/id/1215749788/photo/traditional-beehive-huts-in-swaziland.jpg?s=612x612&w=0&k=20&c=JtZAdQyCQKN_NDmeLKjAQ0NkeHI3I3Z5qIGRxFjPG9M=',
  'cultural,dance,africa':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'bonfire,africa,traditional':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'african,food,traditional':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'nature,walk,africa':'https://media.istockphoto.com/id/2192234727/photo/mantenga-nature-reserve-and-cultural-village-in-eswatini.webp?a=1&b=1&s=612x612&w=0&k=20&c=JkQOOI0M6ylg7y8aOSHHReW-j64j7pTsT7BTBx0UaJs=',
  'garden,hotel,countryside':'https://media.istockphoto.com/id/2192234701/photo/beautiful-landscape-with-a-forest-and-mountains-at-piggs-peak-in-eswatini.jpg?s=612x612&w=0&k=20&c=vQeLJUZ6N2WRYwqxOD4YVMDOUgt7nsC31WSPYiUQuGQ=',
  'horse,riding,countryside':'https://media.istockphoto.com/id/172126051/photo/horse-riding-milwane-wildlife-sanctuary-swaziland-africa.jpg?s=612x612&w=0&k=20&c=0ppkEdShlruVdiEaFVl4Y77YfW60tFMgLVEtfrLstHk=',
  'fishing,river,countryside':'https://media.istockphoto.com/id/2199850478/photo/a-river-in-the-mountains-flows-down.jpg?s=612x612&w=0&k=20&c=Qd6eA9o5wSYFduiCaxjgFCP4S9ppPUDGlLYZJRTP7b4=',
  'pub,countryside,cozy':'https://media.istockphoto.com/id/1366839528/photo/the-capital-downtown-with-the-mall-building-and-wide-street-mbabane-swaziland.jpg?s=612x612&w=0&k=20&c=OvfQ7GpZlXJLk650Zz3QDZy82ZUKjCByuL3sVe1Z77E=',
  'forest,trail,nature':'https://media.istockphoto.com/id/2270258186/photo/view-over-the-rural-settlements-of-piggs-peak-eswatini-framed-by-leaves-of-the-forest-in-the.jpg?s=612x612&w=0&k=20&c=E-OW2cqL4vUR-6zfNPOut14iS67JIlgHlhMO1eaDIGE=',
  'backpacker,hostel,lounge':'https://media.istockphoto.com/id/1330204854/photo/our-first-camping-trip.jpg?s=612x612&w=0&k=20&c=Oed9NCIfw0oW7XokrOq-6dl57D5WhJ3QJz5AvU8G3QY=',
  'granite,rock,view,landscape':'https://media.istockphoto.com/id/1214442301/photo/huge-monolith-rock-next-to-mbabane-eswatini.jpg?s=612x612&w=0&k=20&c=4rnZgMWK4fPI3gwLWANeT1Ijjwl8KdqDZVYDwJxPGbU=',
  'braai,fire,outdoor':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'kitchen,hostel,shared':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'social,lounge,backpacker':'https://media.istockphoto.com/id/1330204854/photo/our-first-camping-trip.jpg?s=612x612&w=0&k=20&c=Oed9NCIfw0oW7XokrOq-6dl57D5WhJ3QJz5AvU8G3QY=',
  'candles,colorful,handmade,craft':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'basket,weaving,african,craft':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'glass,art,sculpture,colorful':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'african,market,traditional,busy':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'candles,african,handmade,colorful':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'craft,market,africa,colorful':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'candles,animal,shaped,art':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'african,souvenir,craft':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'market,colorful,shopping':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'woven,basket,africa,craft':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'african,woman,weaving':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'basket,handmade,colorful':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'african,craft,women':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'weaving,traditional,africa':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'glass,art,colorful,sculpture':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'recycled,glass,art':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'glass,factory,art':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'colorful,glass,ornament':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'glass,sculpture,art':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'african,market,colorful,food':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'market,africa,vegetables':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'african,market,people,busy':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'traditional,market,africa':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'market,africa,fresh,food':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
  'luxury,hotel,africa,resort2':'https://media.istockphoto.com/id/1051594302/photo/swaziland-valley-of-ezulwini.webp?a=1&b=1&s=612x612&w=0&k=20&c=2Riei98Nbq3cxQXv8Ie3c6e_NjMyAk1ZwPKzUC0sDFk=',
  'african,restaurant,garden':'https://media.istockphoto.com/id/2257742470/photo/a-pot-cooking-stew-over-a-fire-in-a-rural-home-kitchen.jpg?s=612x612&w=0&k=20&c=YFPeSk4JscdyFHb1e77qUIyWCsr--6EoaLDUPy-eQuY=',
  'candles,colorful,craft,african':'https://media.istockphoto.com/id/181893921/photo/swazi.jpg?s=612x612&w=0&k=20&c=-FuSRio-v7RXGNh2vY3F0LJS8lRRWyCfIxEITerBFz0=',
};

const photo = (keywords, w=800, h=600) =>
  ESWATINI_PHOTOS[keywords] ||
  `https://media.istockphoto.com/id/1051594302/photo/swaziland-valley-of-ezulwini.webp?a=1&b=1&s=612x612&w=0&k=20&c=2Riei98Nbq3cxQXv8Ie3c6e_NjMyAk1ZwPKzUC0sDFk=`;

// ── ALL 9 LANGUAGES ───────────────────────────────────────
const T = {
  en:{flag:'🇬🇧',name:'English',explore:'Explore Eswatini ✦',tagline:"Unlocking Eswatini's Hidden Treasures",sub:'The Smart Digital Tourism Ecosystem 🇸🇿',offline:'9 Languages · Works Offline',welcome:"Welcome to Africa's Hidden Fortress 💎",welcomeSub:'Discover breathtaking landscapes, vibrant culture, and unforgettable experiences.',attractions:'Attractions',restaurants:'Restaurants',hotels:'Hotels',topAttractions:'Top Attractions',hiddenGem:'Hidden Gem',aiTitle:'Incaba AI Guide',aiSub:'Ask anything about Eswatini',navigate:'Navigate',home:'Home',ai:'AI Guide',business:'Business',explore2:'Explore',translate:'Translate',compare:'Compare',sos:'SOS Emergency',sosSub:'Tap to share location with emergency services',weather:'Weather Today',currency:'Currency Converter',reviews:'Tourist Reviews',writeReview:'Write Review',submit:'Submit',cancel:'Cancel',getDir:'Get Directions',savePlace:'Save Place',about:'About',location:'Location',hours:'Opening Hours',price:'Entry Fee',tips:'Travel Tips',signIn:'Sign In',signUp:'Sign Up',logout:'Logout',welcome2:'Welcome back',createAccount:'Create Account',virtualTour:'Virtual Tour',orderFood:'Order Food',comparePrice:'Compare Prices',menu:'Menu',addToCart:'Add to Cart',cart:'Cart',placeOrder:'Place Order',tableNum:'Table number or delivery address',bookNow:'Book Now',checkIn:'Check-in Date',checkOut:'Check-out Date',guests:'Number of Guests',confirmBooking:'Confirm Booking',amenities:'Amenities',photos:'Photos',rooms:'Rooms',dishes:'Dishes'},
  ss:{flag:'🇸🇿',name:'siSwati',explore:'Hlola Eswatini ✦',tagline:'Sivula Tigugu Letifihlekile Tase-Eswatini',sub:'Inhlelo Lehlakaniphile Yekuvakasha 🇸🇿',offline:'Tilimi Letingu-9 · Isebenta Ungaxhunyiwe',welcome:'Siyakemukela e-Africa Incaba Lefihlekile 💎',welcomeSub:'Tola tindzawo letimangalisako, inhlalo-mphilo, netilwimi letingakhohlwakali.',attractions:'Tindzawo',restaurants:'Emadlelo',hotels:'Emahhotela',topAttractions:'Tindzawo Letiphambili',hiddenGem:'Sigugu',aiTitle:'Umcondzi we-Incaba AI',aiSub:'Butseka noma yini nge-Eswatini',navigate:'Hamba',home:'Ekhaya',ai:'Umcondzi',business:'Ibhizinisi',explore2:'Hlola',translate:'Humusha',compare:'Qhatanisa',sos:'Isimo Sehhatsi',sosSub:'Cindzetela wabelane ndzawo yakho nebaphephisi',weather:'Isimo Selizulu',currency:'Shintsha Imali',reviews:'Tibuka',writeReview:'Bhala Tibuka',submit:'Thumela',cancel:'Yekela',getDir:'Tsatsa Indlela',savePlace:'Gcina Indawo',about:'Mayelana',location:'Ndzawo',hours:'Sikhati',price:'Inkokhelo',tips:'Imilayeto',signIn:'Ngena',signUp:'Bhalisa',logout:'Phuma',welcome2:'Siyakemukela',createAccount:'Yenta Akhawunti',virtualTour:'Vaka Nge-Virtual',orderFood:'Odela Kudla',comparePrice:'Qhatanisa Tintengo',menu:'Menyu',addToCart:'Engeta',cart:'Inqola',placeOrder:'Odela',tableNum:'Inombolo yetafula',bookNow:'Buka Manje',checkIn:'Lusuku Lokungena',checkOut:'Lusuku Lokuphuma',guests:'Tinombolo Tetivakashi',confirmBooking:'Cina Kubuka',amenities:'Tinhlelo',photos:'Tifoto',rooms:'Tigumbi',dishes:'Kudla'},
  zu:{flag:'🇿🇦',name:'Zulu',explore:'Hlola i-Eswatini ✦',tagline:'Sivula Amagugu Ase-Eswatini',sub:'Uhlelo Lokuhlakanipha Lokuvakasha 🇸🇿',offline:'Izilimi Eziyi-9 · Isebenza Offline',welcome:'Siyakwamukela e-Afrika Insaba Efihliwe 💎',welcomeSub:'Thola izindawo ezimangalisayo, amasiko ashisayo.',attractions:'Izindawo',restaurants:'Ama-Restorenti',hotels:'Amahhotela',topAttractions:'Izindawo Eziphezulu',hiddenGem:'Igugu Elisifihlekile',aiTitle:'Isiqondisi se-Incaba AI',aiSub:'Buza noma yini nge-Eswatini',navigate:'Hamba',home:'Ekhaya',ai:'Isiqondisi',business:'Ibhizinisi',explore2:'Hlola',translate:'Humusha',compare:'Qhatanisa',sos:'Isimo Sezimo',sosSub:'Thepha ukwabelana nendawo yakho',weather:'Isimo Sezulu',currency:'Isiguquli Semali',reviews:'Izibuyekezo',writeReview:'Bhala Ukubuyekeza',submit:'Thumela',cancel:'Khansela',getDir:'Thola Izikhombo',savePlace:'Gcina Indawo',about:'Mayelana',location:'Indawo',hours:'Amahora',price:'Imali Yokungena',tips:'Amacebo',signIn:'Ngena',signUp:'Bhalisa',logout:'Phuma',welcome2:'Siyakwamukela futhi',createAccount:'Dala I-Akhawunti',virtualTour:'Ithiyetha Elikhulu',orderFood:'Odela Ukudla',comparePrice:'Qhatanisa Amanani',menu:'Imenyu',addToCart:'Engeza',cart:'Inqola',placeOrder:'Odela',tableNum:'Inombolo yetafula',bookNow:'Bhuka Manje',checkIn:'Usuku Lokungena',checkOut:'Usuku Lokuphuma',guests:'Izivakashi',confirmBooking:'Qinisekisa Ukubhuka',amenities:'Izinsiza',photos:'Izithombe',rooms:'Amagumbi',dishes:'Ukudla'},
  af:{flag:'🇿🇦',name:'Afrikaans',explore:'Verken Eswatini ✦',tagline:"Ontsluit Eswatini se Verborge Skatte",sub:'Die Slim Digitale Toerisme-Ekosisteem 🇸🇿',offline:'9 Tale · Vanlyn Gereed',welcome:"Welkom by Afrika se Verborge Vesting 💎",welcomeSub:'Ontdek asemrowende landseigte, lewendige kultuur.',attractions:'Besienswaardighede',restaurants:'Restaurante',hotels:'Hotelle',topAttractions:'Top Besienswaardighede',hiddenGem:'Verborge Juweel',aiTitle:'Incaba KI-Gids',aiSub:'Vra enigiets oor Eswatini',navigate:'Navigeer',home:'Tuis',ai:'KI-Gids',business:'Besigheid',explore2:'Verken',translate:'Vertaal',compare:'Vergelyk',sos:'SOS Nood',sosSub:'Tik om ligging te deel',weather:'Weer Vandag',currency:'Geldomskakelaar',reviews:'Resensies',writeReview:'Skryf Resensie',submit:'Indien',cancel:'Kanselleer',getDir:'Kry Aanwysings',savePlace:'Stoor Plek',about:'Oor',location:'Ligging',hours:'Openingsure',price:'Toegangsgeld',tips:'Reistips',signIn:'Meld Aan',signUp:'Registreer',logout:'Meld Af',welcome2:'Welkom terug',createAccount:'Skep Rekening',virtualTour:'Virtuele Toer',orderFood:'Bestel Kos',comparePrice:'Vergelyk Pryse',menu:'Spyskaart',addToCart:'Voeg By',cart:'Mandjie',placeOrder:'Plaas Bestelling',tableNum:'Tafelnommer',bookNow:'Bespreek Nou',checkIn:'Inboekdatum',checkOut:'Uitboekdatum',guests:'Gaste',confirmBooking:'Bevestig Besprekings',amenities:'Fasiliteite',photos:'Fotos',rooms:'Kamers',dishes:'Geregte'},
  pt:{flag:'🇲🇿',name:'Portugues',explore:'Explorar Eswatini ✦',tagline:'Desbloqueando os Tesouros Escondidos',sub:'O Ecossistema de Turismo Digital Inteligente 🇸🇿',offline:'9 Idiomas · Disponivel Offline',welcome:'Bem-vindo a Fortaleza Oculta de Africa 💎',welcomeSub:'Descubra paisagens deslumbrantes, cultura vibrante.',attractions:'Atracoes',restaurants:'Restaurantes',hotels:'Hoteis',topAttractions:'Principais Atracoes',hiddenGem:'Joia Escondida',aiTitle:'Guia IA Incaba',aiSub:'Pergunte qualquer coisa sobre Eswatini',navigate:'Navegar',home:'Inicio',ai:'Guia IA',business:'Negocios',explore2:'Explorar',translate:'Traduzir',compare:'Comparar',sos:'Emergencia SOS',sosSub:'Toque para partilhar localizacao',weather:'Tempo Hoje',currency:'Conversor de Moeda',reviews:'Avaliacoes',writeReview:'Escrever Avaliacao',submit:'Enviar',cancel:'Cancelar',getDir:'Obter Direcoes',savePlace:'Guardar Local',about:'Sobre',location:'Localizacao',hours:'Horario',price:'Taxa de Entrada',tips:'Dicas',signIn:'Entrar',signUp:'Registar',logout:'Sair',welcome2:'Bem-vindo de volta',createAccount:'Criar Conta',virtualTour:'Visita Virtual',orderFood:'Encomendar',comparePrice:'Comparar Precos',menu:'Menu',addToCart:'Adicionar',cart:'Carrinho',placeOrder:'Fazer Pedido',tableNum:'Numero da mesa',bookNow:'Reservar Agora',checkIn:'Data de Entrada',checkOut:'Data de Saida',guests:'Hospedes',confirmBooking:'Confirmar Reserva',amenities:'Comodidades',photos:'Fotos',rooms:'Quartos',dishes:'Pratos'},
  fr:{flag:'🇫🇷',name:'Francais',explore:'Explorer Eswatini ✦',tagline:"Deverrouiller les Tresors Caches d Eswatini",sub:"L Ecosysteme Touristique Numerique 🇸🇿",offline:'9 Langues · Disponible Hors Ligne',welcome:"Bienvenue dans la Forteresse Cachee d Afrique 💎",welcomeSub:'Decouvrez des paysages a couper le souffle.',attractions:'Attractions',restaurants:'Restaurants',hotels:'Hotels',topAttractions:'Meilleures Attractions',hiddenGem:'Joyau Cache',aiTitle:'Guide IA Incaba',aiSub:"Demandez n importe quoi sur Eswatini",navigate:'Naviguer',home:'Accueil',ai:'Guide IA',business:'Entreprise',explore2:'Explorer',translate:'Traduire',compare:'Comparer',sos:'Urgence SOS',sosSub:"Appuyez pour partager l emplacement",weather:"Meteo Aujourd hui",currency:'Convertisseur',reviews:'Avis',writeReview:'Ecrire un Avis',submit:'Soumettre',cancel:'Annuler',getDir:'Obtenir des Directions',savePlace:'Sauvegarder',about:'A Propos',location:'Emplacement',hours:"Heures d Ouverture",price:"Frais d Entree",tips:'Conseils',signIn:'Se Connecter',signUp:"S inscrire",logout:'Se Deconnecter',welcome2:'Bon Retour',createAccount:'Creer un Compte',virtualTour:'Visite Virtuelle',orderFood:'Commander',comparePrice:'Comparer les Prix',menu:'Menu',addToCart:'Ajouter',cart:'Panier',placeOrder:'Passer la Commande',tableNum:'Numero de table',bookNow:'Reserver Maintenant',checkIn:"Date d Arrivee",checkOut:'Date de Depart',guests:'Invites',confirmBooking:'Confirmer la Reservation',amenities:'Equipements',photos:'Photos',rooms:'Chambres',dishes:'Plats'},
  de:{flag:'🇩🇪',name:'Deutsch',explore:'Eswatini Erkunden ✦',tagline:'Die Verborgenen Schatze Eswatinis',sub:'Das Intelligente Digitale Tourismus-Okosystem 🇸🇿',offline:'9 Sprachen · Offline Verfugbar',welcome:"Willkommen in Afrikas Verborgener Festung 💎",welcomeSub:'Entdecken Sie atemberaubende Landschaften.',attractions:'Sehenswurdigkeiten',restaurants:'Restaurants',hotels:'Hotels',topAttractions:'Top Sehenswurdigkeiten',hiddenGem:'Verborgenes Juwel',aiTitle:'Incaba KI-Fuhrer',aiSub:'Fragen Sie alles uber Eswatini',navigate:'Navigieren',home:'Startseite',ai:'KI-Fuhrer',business:'Geschaft',explore2:'Erkunden',translate:'Ubersetzen',compare:'Vergleichen',sos:'SOS-Notfall',sosSub:'Tippen Sie um den Standort zu teilen',weather:'Wetter Heute',currency:'Wahrungsrechner',reviews:'Bewertungen',writeReview:'Bewertung Schreiben',submit:'Einreichen',cancel:'Abbrechen',getDir:'Wegbeschreibung',savePlace:'Ort Speichern',about:'Uber',location:'Standort',hours:'Offnungszeiten',price:'Eintrittsgebuh',tips:'Reisetipps',signIn:'Anmelden',signUp:'Registrieren',logout:'Abmelden',welcome2:'Willkommen Zuruck',createAccount:'Konto Erstellen',virtualTour:'Virtuelle Tour',orderFood:'Essen Bestellen',comparePrice:'Preise Vergleichen',menu:'Speisekarte',addToCart:'Hinzufugen',cart:'Warenkorb',placeOrder:'Bestellung Aufgeben',tableNum:'Tischnummer',bookNow:'Jetzt Buchen',checkIn:'Anreisedatum',checkOut:'Abreisedatum',guests:'Gaste',confirmBooking:'Buchung Bestatigen',amenities:'Annehmlichkeiten',photos:'Fotos',rooms:'Zimmer',dishes:'Gerichte'},
  zh:{flag:'🇨🇳',name:'Chinese',explore:'探索斯威士兰 ✦',tagline:'解锁斯威士兰的隐藏宝藏',sub:'智能数字旅游生态系统 🇸🇿',offline:'9种语言 · 离线可用',welcome:'欢迎来到非洲的隐藏堡垒 💎',welcomeSub:'探索令人叹为观止的风景、充满活力的文化。',attractions:'景点',restaurants:'餐厅',hotels:'酒店',topAttractions:'热门景点',hiddenGem:'隐藏宝石',aiTitle:'Incaba 人工智能向导',aiSub:'询问任何关于斯威士兰的问题',navigate:'导航',home:'主页',ai:'AI向导',business:'商业',explore2:'探索',translate:'翻译',compare:'比较',sos:'SOS紧急',sosSub:'点击与紧急服务共享位置',weather:'今日天气',currency:'货币换算器',reviews:'游客评论',writeReview:'写评论',submit:'提交',cancel:'取消',getDir:'获取路线',savePlace:'收藏地点',about:'关于',location:'位置',hours:'营业时间',price:'门票费用',tips:'旅行提示',signIn:'登录',signUp:'注册',logout:'退出',welcome2:'欢迎回来',createAccount:'创建账户',virtualTour:'虚拟游览',orderFood:'点餐',comparePrice:'比较价格',menu:'菜单',addToCart:'添加',cart:'购物车',placeOrder:'下单',tableNum:'桌号',bookNow:'立即预订',checkIn:'入住日期',checkOut:'退房日期',guests:'客人数量',confirmBooking:'确认预订',amenities:'设施',photos:'照片',rooms:'房间',dishes:'菜肴'},
  ar:{flag:'🇸🇦',name:'Arabic',explore:'استكشف اسواتيني ✦',tagline:'اكتشف الكنوز الخفية لاسواتيني',sub:'نظام السياحة الرقمية الذكية 🇸🇿',offline:'9 لغات متاح بدون انترنت',welcome:'مرحبا بك في القلعة الخفية لافريقيا 💎',welcomeSub:'اكتشف مناظر طبيعية خلابة وثقافة نابضة بالحياة.',attractions:'المعالم',restaurants:'المطاعم',hotels:'الفنادق',topAttractions:'افضل المعالم',hiddenGem:'الجوهرة الخفية',aiTitle:'دليل Incaba الذكي',aiSub:'اسال اي شيء عن اسواتيني',navigate:'التنقل',home:'الرئيسية',ai:'الدليل الذكي',business:'الاعمال',explore2:'استكشف',translate:'ترجم',compare:'قارن',sos:'طوارئ SOS',sosSub:'انقر لمشاركة موقعك',weather:'الطقس اليوم',currency:'محول العملات',reviews:'تقييمات',writeReview:'اكتب تقييما',submit:'ارسال',cancel:'الغاء',getDir:'احصل على الاتجاهات',savePlace:'احفظ المكان',about:'حول',location:'الموقع',hours:'ساعات العمل',price:'رسوم الدخول',tips:'نصائح',signIn:'تسجيل الدخول',signUp:'انشاء حساب',logout:'خروج',welcome2:'مرحبا بعودتك',createAccount:'انشاء حساب',virtualTour:'جولة افتراضية',orderFood:'طلب الطعام',comparePrice:'مقارنة الاسعار',menu:'القائمة',addToCart:'اضف',cart:'السلة',placeOrder:'اطلب',tableNum:'رقم الطاولة',bookNow:'احجز الان',checkIn:'تاريخ الوصول',checkOut:'تاريخ المغادرة',guests:'عدد الضيوف',confirmBooking:'تاكيد الحجز',amenities:'المرافق',photos:'الصور',rooms:'الغرف',dishes:'الاطباق'},
};

const RATES = {USD:18.5,ZAR:1.0,EUR:20.1,GBP:23.4,BWP:1.37,CNY:2.55,AED:5.04,INR:0.222,AUD:12.1,CAD:13.6,JPY:0.122,CHF:20.8,BRL:3.55,MXN:0.95,NGN:0.012,KES:0.143,GHS:1.21};

// ── REAL PHOTO DATA ───────────────────────────────────────
const places = [
  {
    name:'Hlane Royal Reserve', region:'Lubombo Region',
    desc:"Lions, elephants and white rhinos in Eswatini's largest park",
    fullDesc:"Hlane Royal National Park is Eswatini's largest protected area covering 22,000 hectares. Named by King Sobhuza II — Hlane means wilderness in siSwati. Home to lions, elephants, white rhinos, giraffes, zebras and over 300 bird species.",
    rating:'4.9', category:'Wildlife',
    img: photo('lion,safari,africa'),
    gallery:[photo('lion,wildlife,africa'),photo('elephant,safari'),photo('rhino,africa,wildlife'),photo('giraffe,africa'),photo('zebra,africa,safari')],
    location:'Lubombo Region, 67km from Manzini', hours:'6am to 6pm daily', price:'E 150',
    tips:['Book guided game drives in advance','Best time is early morning','Bring binoculars'],
    videoId:'KWr0KUZLPi4', videoTitle:'Self-Drive Safari at Hlane'
  },
  {
    name:'Mantenga Falls', region:'Hhohho Region',
    desc:'Breathtaking 95m waterfall in the Ezulwini Valley',
    fullDesc:"Mantenga Falls drops 95 metres into a pristine pool surrounded by lush indigenous forest. Perfect for swimming, hiking and photography. One of Eswatini's most spectacular natural wonders.",
    rating:'4.8', category:'Nature',
    img: photo('waterfall,africa,tropical'),
    gallery:[photo('waterfall,africa,nature'),photo('waterfall,swimming,tropical'),photo('jungle,waterfall,green'),photo('hiking,waterfall'),photo('nature,river,africa')],
    location:'Ezulwini Valley, Hhohho Region', hours:'7am to 5pm daily', price:'E 80',
    tips:['Wear waterproof shoes','Best after rainy season','Swimming allowed below the falls'],
    videoId:'X9CLKGqqkjU', videoTitle:'Ezulwini Valley Drone Tour'
  },
  {
    name:'Lobamba Royal Village', region:'Manzini Region',
    desc:'Heart of Swazi culture — home of the King',
    fullDesc:"Lobamba is the royal and legislative capital of Eswatini. Home of the Queen Mother and where the Incwala and Umhlanga ceremonies take place. Contains the National Museum and Parliament buildings.",
    rating:'4.7', category:'Culture',
    img: photo('african,village,traditional,culture'),
    gallery:[photo('african,culture,traditional'),photo('african,ceremony,dance'),photo('africa,museum,heritage'),photo('african,village,people'),photo('africa,traditional,dress')],
    location:'Ezulwini Valley, Manzini Region', hours:'8am to 4pm daily', price:'E 50',
    tips:['Dress respectfully','Visit during Umhlanga in August','Photography may need permission'],
    videoId:'604KjnoBw8o', videoTitle:'Mantenga Cultural Village'
  },
  {
    name:'Swazi Candles Market', region:'Malkerns Valley',
    desc:'World-famous handmade candles and African craft market',
    fullDesc:"Artisans hand-craft beautiful animal-shaped candles using traditional techniques. The market features local crafts, textiles, jewelry and fresh produce. Perfect for authentic Swazi souvenirs.",
    rating:'4.6', category:'Culture',
    img: photo('african,craft,market,colorful'),
    gallery:[photo('candles,colorful,handmade'),photo('african,craft,market'),photo('african,art,souvenir'),photo('market,africa,colorful'),photo('handcraft,africa,basket')],
    location:'Malkerns Valley, Manzini Region', hours:'8am to 5pm daily', price:'Free',
    tips:['Bargaining is acceptable','Great for unique gifts','Try the local food stalls'],
    videoId:'gZY5KT6bhGY', videoTitle:'Mantenga Waterfalls Eswatini'
  },
  {
    name:'Malolotja Nature Reserve', region:'Hhohho Region',
    desc:'Ancient mountains, rare orchids and spectacular zipline',
    fullDesc:"Malolotja Nature Reserve contains some of the oldest geological formations on earth. Rare indigenous flora, rare bird species and a famous canopy zipline. Less than 2% of tourists ever visit.",
    rating:'4.8', category:'Nature',
    img: photo('mountain,africa,landscape,green'),
    gallery:[photo('mountain,green,africa,landscape'),photo('zipline,canopy,forest'),photo('orchid,flowers,wild'),photo('bird,africa,wildlife'),photo('hiking,mountain,africa')],
    location:'Northwestern Eswatini, Hhohho Region', hours:'6am to 6pm daily', price:'E 120',
    tips:['Zipline tour is a must-do','Bring warm clothing','Great for serious hikers'],
    videoId:'0ny1QSno2Go', videoTitle:'Kingdom of Eswatini Cultural Experience'
  },
  {
    name:'Sibebe Rock', region:'Hhohho Region',
    desc:"World's second largest exposed granite rock near Mbabane",
    fullDesc:"The world's second largest exposed granite rock. Just 10km from capital Mbabane, offering challenging hiking trails and panoramic views across the entire country.",
    rating:'4.5', category:'Adventure',
    img: photo('granite,rock,hiking,landscape'),
    gallery:[photo('rock,climbing,hiking'),photo('granite,landscape,panoramic'),photo('hiking,summit,views'),photo('rock,formation,africa'),photo('mountain,trail,hiking')],
    location:'10km from Mbabane, Hhohho Region', hours:'6am to 6pm daily', price:'E 60',
    tips:['Wear proper hiking shoes','Go early to avoid heat','Bring plenty of water'],
    videoId:'sDN7HXh5rdc', videoTitle:'Bhubesi Camp Hlane'
  },
  {
    name:'Shiselweni Region', region:'Shiselweni Region',
    desc:"Eswatini's southern paradise — untouched and spectacular",
    fullDesc:"Shiselweni is Eswatini's southernmost region and one of its most beautiful. Home to Nhlangano town, vast forests, rivers and traditional Swazi villages. A true off-the-beaten-path destination.",
    rating:'4.7', category:'Nature',
    img: photo('africa,river,forest,landscape'),
    gallery:[photo('africa,forest,green,river'),photo('village,africa,traditional'),photo('africa,landscape,trees'),photo('river,africa,nature'),photo('africa,rural,traditional')],
    location:'Southern Eswatini, Shiselweni Region', hours:'All year round', price:'Free',
    tips:['Visit Nhlangano town for local culture','Great for eco-tourism','Best in dry season'],
    videoId:'clEnwhClD1o', videoTitle:'A Day Trip to Eswatini'
  },
];

const restaurants = [
  {
    name:"Malandela's Restaurant", region:'Malkerns', rating:'4.8',
    price:'E 80 to 200', hours:'11am to 9pm daily',
    phone:'+268 2528 3110', email:'bookings@malandelas.com', address:"Malandela's Farm, Malkerns Valley, Eswatini", lat:-26.5212, lng:31.2003,
    coverImg: photo('african,restaurant,garden,outdoor'),
    desc:'Traditional Swazi cuisine in a beautiful garden setting',
    menu:[
      {category:'Starters',items:[
        {name:'Sishwala Bites',price:45,desc:'Traditional maize bites with dipping sauce',img:photo('african,starter,food,appetizer')},
        {name:'Swazi Soup',price:55,desc:'Rich traditional vegetable soup',img:photo('soup,african,bowl,food')},
      ]},
      {category:'Main Course',items:[
        {name:'Grilled Tilapia',price:145,desc:'Fresh local fish with sishwala and vegetables',img:photo('grilled,fish,african,food')},
        {name:'Swazi Chicken',price:135,desc:'Free-range chicken in traditional sauce',img:photo('grilled,chicken,african,food')},
        {name:'Braai Platter',price:185,desc:'Mixed grilled meats with pap and salad',img:photo('braai,bbq,grilled,meat,african')},
      ]},
      {category:'Traditional',items:[
        {name:'Umncweba Plate',price:95,desc:'Dried Swazi meat with emasi and rice',img:photo('african,traditional,food,plate')},
        {name:'Sishwala Special',price:75,desc:'Thick maize porridge with relish',img:photo('porridge,african,food,traditional')},
      ]},
      {category:'Drinks',items:[
        {name:'Marula Juice',price:30,desc:'Fresh local marula fruit juice',img:photo('juice,tropical,fruit,drink')},
        {name:'Soft Drinks',price:20,desc:'Coke, Sprite, Fanta',img:photo('cold,drink,refreshing,soda')},
      ]},
    ]
  },
  {
    name:"Tum's George Hotel", region:'Mbabane', rating:'4.6',
    price:'E 120 to 300', hours:'7am to 10pm daily',
    phone:'+268 2404 4030', email:'reservations@tumsgeorge.com', address:'Mbabane, Eswatini', lat:-26.3054, lng:31.1367,
    coverImg: photo('fine,dining,restaurant,elegant'),
    desc:'Fine dining with panoramic views of the Ezulwini Valley',
    menu:[
      {category:'Breakfast',items:[
        {name:'Full English',price:95,desc:'Eggs, bacon, sausage, toast and juice',img:photo('english,breakfast,eggs,bacon')},
        {name:'Continental',price:75,desc:'Pastries, fruit, yoghurt and coffee',img:photo('continental,breakfast,pastry,fruit')},
      ]},
      {category:'Mains',items:[
        {name:'Beef Tenderloin',price:245,desc:'Premium cut with seasonal vegetables',img:photo('steak,beef,fine,dining')},
        {name:'Seafood Pasta',price:195,desc:'Imported seafood in cream sauce',img:photo('pasta,seafood,restaurant,food')},
      ]},
      {category:'Drinks',items:[
        {name:'House Wine',price:85,desc:'Red or white per glass',img:photo('wine,glass,restaurant,elegant')},
        {name:'Fresh Juice',price:35,desc:'Orange, mango or mixed',img:photo('fresh,juice,tropical,glass')},
      ]},
    ]
  },
  {
    name:'Foresters Arms', region:'Malkerns', rating:'4.4',
    price:'E 60 to 150', hours:'11am to 10pm daily',
    phone:'+268 2528 3344', email:'info@forestersarms.co.sz', address:'Mhlambanyatsi, Eswatini', lat:-26.5523, lng:31.0136,
    coverImg: photo('pub,restaurant,countryside,cozy'),
    desc:'Classic pub meals in a cozy countryside atmosphere',
    menu:[
      {category:'Pub Meals',items:[
        {name:'Beef Burger',price:95,desc:'100% beef patty with chips',img:photo('burger,beef,chips,pub')},
        {name:'Fish and Chips',price:105,desc:'Battered fish with thick-cut chips',img:photo('fish,chips,pub,food')},
      ]},
      {category:'Grills',items:[
        {name:'Ribeye Steak',price:185,desc:'300g ribeye with salad and chips',img:photo('ribeye,steak,grill,restaurant')},
        {name:'Chicken Strips',price:95,desc:'Crispy chicken with dipping sauce',img:photo('chicken,strips,crispy,food')},
      ]},
      {category:'Drinks',items:[
        {name:'Draft Beer',price:35,desc:'Local Sibebe Lager on tap',img:photo('beer,draft,pub,glass')},
        {name:'Ciders',price:40,desc:'Apple or mixed berry',img:photo('cider,apple,drink,glass')},
      ]},
    ]
  },
  {
    name:'Gables Food Court', region:'Ezulwini', rating:'4.2',
    price:'E 40 to 120', hours:'9am to 8pm daily',
    phone:'+268 2416 1100', email:'info@gablescentre.co.sz', address:'Gables Shopping Centre, Ezulwini, Eswatini', lat:-26.4453, lng:31.1366,
    coverImg: photo('food,court,mall,restaurant'),
    desc:'Local and international food options for every budget',
    menu:[
      {category:'Fast Food',items:[
        {name:'Chicken and Chips',price:65,desc:'Fried chicken with seasoned chips',img:photo('fried,chicken,chips,fast,food')},
        {name:'Pizza Slice',price:45,desc:'Various toppings available',img:photo('pizza,slice,food')},
      ]},
      {category:'Local Food',items:[
        {name:'Pap and Stew',price:45,desc:'Traditional maize pap with beef stew',img:photo('pap,stew,african,food,traditional')},
        {name:'Vetkoek',price:25,desc:'Fried dough with mince filling',img:photo('fried,bread,food,african')},
      ]},
      {category:'Drinks',items:[
        {name:'Milkshake',price:40,desc:'Chocolate, vanilla or strawberry',img:photo('milkshake,drink,glass,sweet')},
        {name:'Water',price:15,desc:'Still or sparkling',img:photo('water,bottle,drink,clear')},
      ]},
    ]
  },
];

const hotels = [
  {
    name:'Royal Swazi Spa and Hotel', region:'Ezulwini Valley', category:'Hotel',
    rating:'4.9', stars:'★★★★★', price:'E 1,800 to 4,500 per night',
    desc:'Luxury 5-star hotel with spa, casino and golf course',
    phone:'+268 2416 5000', email:'reservations@royalswazispa.sz',
    booking:'https://www.suninternational.com/royal-swazi-spa', address:'Ezulwini Valley, Eswatini', lat:-26.4495, lng:31.1349,
    coverImg: limg('royalswazispa') || limg('hotel-royalswazispainezulwinivalley'),
    amenities:['Luxury Spa','Casino','Golf Course','Swimming Pool','Fine Dining','Gym','Conference Rooms'],
    rooms:[
      {name:'Standard Room',price:'E 1,800',img:limg('hotel-royalswazispainezulwinivalley')},
      {name:'Deluxe Suite',price:'E 2,800',img:limg('swazi-royalgolfcourse')},
      {name:'Presidential Suite',price:'E 4,500',img:limg('royalswazispa')},
    ],
    gallery: [limg('royalswazispa'), limg('hotel-royalswazispainezulwinivalley'), limg('swazi-royalgolfcourse'), limg('ezulwinivalley'), limg('ezulwinimarket')].filter(Boolean)
  },
  {
    name:'Mantenga Cultural Village', region:'Ezulwini', category:'Lodge',
    rating:'4.7', stars:'★★★★☆', price:'E 600 to 1,200 per night',
    desc:'Authentic cultural experience in traditional Swazi huts',
    phone:'+268 2416 1151', email:'info@mantengalodge.sz',
    booking:'https://www.mantengalodge.com', address:'Mantenga Nature Reserve, Ezulwini, Eswatini', lat:-26.4642, lng:31.1564,
    coverImg: limg('mantenga'),
    amenities:['Cultural Shows','Nature Walks','Traditional Food','Photography Tours','Bonfire'],
    rooms:[
      {name:'Traditional Hut',price:'E 600',img:limg('mantenga')},
      {name:'Family Hut',price:'E 900',img:limg('lobamba')},
      {name:'Premium Hut',price:'E 1,200',img:limg('hotel-piggspeak')},
    ],
    gallery: limgAll('mantenga').length ? limgAll('mantenga') : [limg('mantenga'),limg('lobamba')].filter(Boolean)
  },
  {
    name:'Foresters Arms Hotel', region:'Malkerns', category:'Hotel',
    rating:'4.5', stars:'★★★★☆', price:'E 800 to 1,800 per night',
    desc:'Charming country hotel surrounded by forest and gardens',
    phone:'+268 2528 3144', email:'info@forestersarms.co.sz',
    booking:'https://www.forestersarms.co.sz', address:'Mhlambanyatsi, Eswatini', lat:-26.5523, lng:31.0136,
    coverImg: limg('hotel-forestersarms'),
    amenities:['Fishing','Horse Riding','Pub','Forest Trails','Garden'],
    rooms:limgAll('hotel-forestersarms').slice(0,3).map((img,i)=>({name:['Garden Room','Forest Suite','Country Cottage'][i],price:['E 800','E 1,200','E 1,800'][i],img})),
    gallery: limgAll('hotel-forestersarms')
  },
  {
    name:'Lidwala Backpacker Lodge', region:'Mbabane', category:'Guesthouse',
    rating:'4.3', stars:'★★★☆☆', price:'E 150 to 400 per night',
    desc:'Budget-friendly lodge with stunning rock formations',
    phone:'+268 7602 1234', email:'stay@lidwala.sz',
    booking:'https://www.hostelworld.com', address:'Mbabane, Eswatini', lat:-26.3054, lng:31.1367,
    coverImg: limg('hotel-gorge'),
    amenities:['Braai Area','Rock Views','Free WiFi','Shared Kitchen','Social Lounge'],
    rooms:[
      {name:'Dorm Bed',price:'E 150',img:limg('hotel-gorge')},
      {name:'Private Room',price:'E 280',img:limg('guesthouse-elwandle1')},
      {name:'Deluxe Room',price:'E 400',img:limg('guesthouse-elwandle2')},
    ],
    gallery: [limg('hotel-gorge'),...limgAll('guesthouse-elwandle')].filter(Boolean)
  },
  {
    name:'Hilton Garden Inn', region:'Mbabane', category:'Hotel',
    rating:'4.6', stars:'★★★★☆', price:'E 1,400 to 2,600 per night',
    desc:'Modern international hotel in the heart of Mbabane',
    phone:'+268 2404 0000', email:'frontdesk@hiltonmbabane.sz',
    booking:'https://www.hilton.com', address:'Mbabane City, Eswatini', lat:-26.3167, lng:31.1408,
    coverImg: limg('hotel-hilton'),
    amenities:['Free WiFi','Conference Rooms','Restaurant','Gym','Airport Shuttle'],
    rooms:limgAll('hotel-hilton').slice(0,3).map((img,i)=>({name:['City Room','Executive Room','Hilton Suite'][i],price:['E 1,400','E 1,900','E 2,600'][i],img})),
    gallery: limgAll('hotel-hilton')
  },
  {
    name:'Hlangano Country Lodge', region:'Manzini', category:'Lodge',
    rating:'4.4', stars:'★★★★☆', price:'E 700 to 1,300 per night',
    desc:'Peaceful country lodge with lush gardens',
    phone:'+268 2505 5678', email:'bookings@hlangano.sz',
    booking:'https://www.booking.com', address:'Manzini, Eswatini', lat:-26.4839, lng:31.3667,
    coverImg: limg('hotel-hlangano'),
    amenities:['Garden Views','Pool','Restaurant','Conference Facilities'],
    rooms:limgAll('hotel-hlangano').slice(0,3).map((img,i)=>({name:['Garden Room','Lodge Suite','Family Room'][i],price:['E 700','E 1,000','E 1,300'][i],img})),
    gallery: limgAll('hotel-hlangano')
  },
  {
    name:"Kendrick's Lodge", region:'Mbabane', category:'Lodge',
    rating:'4.5', stars:'★★★★☆', price:'E 900 to 1,700 per night',
    desc:'Cosy lodge with mountain views and warm hospitality',
    phone:'+268 2404 2233', email:'info@kendrickslodge.sz',
    booking:'https://www.booking.com', address:'Mbabane, Eswatini', lat:-26.3208, lng:31.1295,
    coverImg: limg('hotel-kendricks'),
    amenities:['Mountain Views','Breakfast Included','Free WiFi','Braai Facilities'],
    rooms:limgAll('hotel-kendricks').slice(0,3).map((img,i)=>({name:['Standard Room','Mountain View Room','Family Suite'][i],price:['E 900','E 1,300','E 1,700'][i],img})),
    gallery: limgAll('hotel-kendricks')
  },
  {
    name:'Liphiva Bush Lodge', region:'Lubombo', category:'Lodge',
    rating:'4.6', stars:'★★★★☆', price:'E 1,100 to 2,000 per night',
    desc:'Bushveld lodge bordering Hlane Royal National Park',
    phone:'+268 2383 8100', email:'stay@liphiva.sz',
    booking:'https://www.booking.com', address:'Lubombo Region, Eswatini', lat:-26.1736, lng:31.8606,
    coverImg: limg('hotel-liphivabushlodge'),
    amenities:['Game Drives','Bushveld Views','Pool','Restaurant'],
    rooms:limgAll('hotel-liphivabushlodge').slice(0,3).map((img,i)=>({name:['Bush Chalet','Family Chalet','Luxury Suite'][i],price:['E 1,100','E 1,500','E 2,000'][i],img})),
    gallery: limgAll('hotel-liphivabushlodge')
  },
  {
    name:'Mahamba Gorge Lodge', region:'Shiselweni', category:'Lodge',
    rating:'4.5', stars:'★★★★☆', price:'E 800 to 1,500 per night',
    desc:'Riverside lodge nestled in the dramatic Mahamba Gorge',
    phone:'+268 2207 1122', email:'bookings@mahambalodge.sz',
    booking:'https://www.booking.com', address:'Mahamba, Eswatini', lat:-27.0167, lng:31.4167,
    coverImg: limg('hotel-mahamba'),
    amenities:['River Views','Hiking Trails','Restaurant','Birdwatching'],
    rooms:limgAll('hotel-mahamba').slice(0,3).map((img,i)=>({name:['Riverside Room','Gorge View Room','Family Cabin'][i],price:['E 800','E 1,100','E 1,500'][i],img})),
    gallery: limgAll('hotel-mahamba')
  },
  {
    name:'Mogi Self-Catering', region:'Ezulwini', category:'Guesthouse',
    rating:'4.3', stars:'★★★☆☆', price:'E 500 to 950 per night',
    desc:'Self-catering apartments in the Ezulwini Valley',
    phone:'+268 7611 9090', email:'stay@mogi.sz',
    booking:'https://www.airbnb.com', address:'Ezulwini Valley, Eswatini', lat:-26.4513, lng:31.1397,
    coverImg: limg('hotel-mogi-inezulwini'),
    amenities:['Self-Catering Kitchen','Free WiFi','Secure Parking','Garden'],
    rooms:limgAll('hotel-mogi').slice(0,3).map((img,i)=>({name:['Studio Apartment','One-Bedroom Unit','Two-Bedroom Unit'][i],price:['E 500','E 700','E 950'][i],img})),
    gallery: limgAll('hotel-mogi')
  },
  {
    name:"Pigg's Peak Hotel and Casino", region:'Piggs Peak', category:'Hotel',
    rating:'4.4', stars:'★★★★☆', price:'E 1,200 to 2,200 per night',
    desc:'Mountain-top hotel and casino with forest views',
    phone:'+268 2437 1104', email:'reservations@piggspeakhotel.sz',
    booking:'https://www.suninternational.com', address:"Pigg's Peak, Eswatini", lat:-25.9667, lng:31.25,
    coverImg: limg('hotel-piggspeak'),
    amenities:['Casino','Forest Views','Pool','Restaurant'],
    rooms:[{name:'Standard Room',price:'E 1,200',img:limg('hotel-piggspeak')},{name:'Forest View Room',price:'E 1,700',img:limg('malolotja')},{name:'Suite',price:'E 2,200',img:limg('hotel-piggspeak')}],
    gallery: [limg('hotel-piggspeak'),limg('malolotja')].filter(Boolean)
  },
  {
    name:'Bulembu Country Lodge', region:'Bulembu', category:'Lodge',
    rating:'4.6', stars:'★★★★☆', price:'E 700 to 1,400 per night',
    desc:'Restored mining-town lodge high in the mountains',
    phone:'+268 2452 4900', email:'bookings@bulembu.org',
    booking:'https://www.bulembu.org', address:'Bulembu, Eswatini', lat:-25.9764, lng:31.1394,
    coverImg: limg('hotel-bulembu'),
    amenities:['Mountain Hiking','Heritage Tours','Restaurant','Fireplace Lounge'],
    rooms:limgAll('hotel-bulembu').slice(0,3).map((img,i)=>({name:['Cottage Room','Heritage Room','Family Cottage'][i],price:['E 700','E 1,000','E 1,400'][i],img})),
    gallery: limgAll('hotel-bulembu')
  },
  {
    name:'BK Guesthouse', region:'Manzini', category:'Guesthouse',
    rating:'4.2', stars:'★★★☆☆', price:'E 400 to 800 per night',
    desc:'Friendly guesthouse close to Manzini city centre',
    phone:'+268 2505 4321', email:'info@bkguesthouse.sz',
    booking:'https://www.booking.com', address:'Manzini, Eswatini', lat:-26.4847, lng:31.3656,
    coverImg: limg('hotel-bk'),
    amenities:['Free WiFi','Breakfast Included','Secure Parking'],
    rooms:limgAll('hotel-bk').slice(0,3).map((img,i)=>({name:['Single Room','Double Room','Family Room'][i],price:['E 400','E 600','E 800'][i],img})),
    gallery: limgAll('hotel-bk')
  },
  {
    name:'Hlanganophumula Guesthouse', region:'Hluthi', category:'Guesthouse',
    rating:'4.3', stars:'★★★☆☆', price:'E 350 to 700 per night',
    desc:'Warm, family-run guesthouse in the Shiselweni region',
    phone:'+268 2207 5566', email:'info@hlanganophumula.sz',
    booking:'https://www.booking.com', address:'Hluthi, Eswatini', lat:-27.1167, lng:31.4333,
    coverImg: limg('guesthouse-hlanganophumula'),
    amenities:['Home-Cooked Meals','Garden','Free WiFi'],
    rooms:limgAll('guesthouse-hlanganophumula').slice(0,3).map((img,i)=>({name:['Standard Room','Garden Room','Family Room'][i],price:['E 350','E 500','E 700'][i],img})),
    gallery: limgAll('guesthouse-hlanganophumula')
  },
  {
    name:'Malolotja Camping Grounds', region:'Malolotja Nature Reserve', category:'Camping',
    rating:'4.7', stars:'★★★★☆', price:'E 120 to 300 per night',
    desc:'Mountain-top campsites inside Malolotja Nature Reserve, with hiking trails right outside your tent',
    phone:'+268 2444 3241', email:'malolotja@sntc.org.sz',
    booking:'https://www.sntc.org.sz/malolotja', address:'Malolotja Nature Reserve, Eswatini', lat:-26.1667, lng:31.1167,
    coverImg: limg('malolotja'),
    amenities:['Hiking Trails','Braai Stands','Ablution Blocks','Wildlife Viewing','Stargazing'],
    rooms:[
      {name:'Tent Site (own tent)',price:'E 120',img:limg('malolotja')},
      {name:'Log Cabin (sleeps 4)',price:'E 300',img:limg('malolotja')},
    ],
    gallery: limgAll('malolotja')
  },
  {
    name:'Mlilwane Camping', region:'Mlilwane Wildlife Sanctuary', category:'Camping',
    rating:'4.8', stars:'★★★★★', price:'E 100 to 280 per night',
    desc:'Camp among free-roaming antelope and zebra at Eswatini\'s oldest wildlife sanctuary',
    phone:'+268 2528 3943', email:'mlilwane@biggame.co.sz',
    booking:'https://www.biggame.co.sz', address:'Mlilwane Wildlife Sanctuary, Eswatini', lat:-26.5167, lng:31.1833,
    coverImg: limg('mlilwane'),
    amenities:['Wildlife Walks','Horse Trails','Braai Stands','Communal Kitchen'],
    rooms:[
      {name:'Camp Site',price:'E 100',img:limg('mlilwane')},
      {name:'Rustic Camp Hut',price:'E 280',img:limg('mlilwane')},
    ],
    gallery: limgAll('mlilwane')
  },
];

const localStores = [
  {
    name:'Swazi Candles', region:'Malkerns', rating:'4.8',
    price:'E 50 to 500', type:'Craft Market',
    desc:'World-famous handmade candles and African crafts',
    coverImg: photo('candles,colorful,handmade,craft'),
    gallery:[photo('candles,african,handmade,colorful'),photo('craft,market,africa,colorful'),photo('candles,animal,shaped,art'),photo('african,souvenir,craft'),photo('market,colorful,shopping')]
  },
  {
    name:'Gone Rural', region:'Malkerns', rating:'4.7',
    price:'E 100 to 2,000', type:'Woven Crafts',
    desc:'Women-made woven baskets and premium home decor',
    coverImg: photo('basket,weaving,african,craft'),
    gallery:[photo('woven,basket,africa,craft'),photo('african,woman,weaving'),photo('basket,handmade,colorful'),photo('african,craft,women'),photo('weaving,traditional,africa')]
  },
  {
    name:'Ngwenya Glass Factory', region:'Ngwenya', rating:'4.6',
    price:'E 80 to 800', type:'Glass Art',
    desc:'Recycled glass art and stunning sculptures',
    coverImg: photo('glass,art,sculpture,colorful'),
    gallery:[photo('glass,art,colorful,sculpture'),photo('recycled,glass,art'),photo('glass,factory,art'),photo('colorful,glass,ornament'),photo('glass,sculpture,art')]
  },
  {
    name:'Manzini Market', region:'Manzini', rating:'4.3',
    price:'E 10 to 200', type:'Traditional Market',
    desc:'Largest traditional market in Eswatini',
    coverImg: photo('african,market,traditional,busy'),
    gallery:[photo('african,market,colorful,food'),photo('market,africa,vegetables'),photo('african,market,people,busy'),photo('traditional,market,africa'),photo('market,africa,fresh,food')]
  },
];

const weatherData = {
  'Today':    [{name:'Mbabane',temp:22,icon:'⛅',desc:'Partly Cloudy',humidity:'65%',wind:'12 km/h',uv:'Moderate'},{name:'Manzini',temp:26,icon:'☀️',desc:'Sunny',humidity:'45%',wind:'8 km/h',uv:'High'},{name:'Lubombo',temp:29,icon:'🌤️',desc:'Clear',humidity:'38%',wind:'15 km/h',uv:'Very High'}],
  'Tomorrow': [{name:'Mbabane',temp:19,icon:'🌧️',desc:'Light Rain',humidity:'80%',wind:'20 km/h',uv:'Low'},{name:'Manzini',temp:23,icon:'⛅',desc:'Cloudy',humidity:'60%',wind:'12 km/h',uv:'Moderate'},{name:'Lubombo',temp:27,icon:'☀️',desc:'Sunny',humidity:'35%',wind:'10 km/h',uv:'High'}],
  'Wed':      [{name:'Mbabane',temp:21,icon:'⛅',desc:'Partly Cloudy',humidity:'58%',wind:'9 km/h',uv:'Moderate'},{name:'Manzini',temp:25,icon:'🌤️',desc:'Mostly Clear',humidity:'42%',wind:'7 km/h',uv:'High'},{name:'Lubombo',temp:30,icon:'☀️',desc:'Hot and Sunny',humidity:'30%',wind:'11 km/h',uv:'Very High'}],
  'Thu':      [{name:'Mbabane',temp:18,icon:'🌩️',desc:'Thunderstorms',humidity:'90%',wind:'25 km/h',uv:'Low'},{name:'Manzini',temp:20,icon:'🌧️',desc:'Heavy Rain',humidity:'85%',wind:'22 km/h',uv:'Low'},{name:'Lubombo',temp:24,icon:'⛅',desc:'Cloudy',humidity:'55%',wind:'16 km/h',uv:'Moderate'}],
  'Fri':      [{name:'Mbabane',temp:23,icon:'☀️',desc:'Sunny',humidity:'40%',wind:'8 km/h',uv:'High'},{name:'Manzini',temp:27,icon:'☀️',desc:'Clear',humidity:'35%',wind:'6 km/h',uv:'Very High'},{name:'Lubombo',temp:31,icon:'☀️',desc:'Hot',humidity:'28%',wind:'9 km/h',uv:'Extreme'}],
  'Sat':      [{name:'Mbabane',temp:20,icon:'🌤️',desc:'Mostly Clear',humidity:'50%',wind:'10 km/h',uv:'Moderate'},{name:'Manzini',temp:24,icon:'⛅',desc:'Partly Cloudy',humidity:'48%',wind:'9 km/h',uv:'High'},{name:'Lubombo',temp:28,icon:'🌤️',desc:'Warm',humidity:'32%',wind:'12 km/h',uv:'High'}],
  'Sun':      [{name:'Mbabane',temp:17,icon:'🌧️',desc:'Rainy',humidity:'85%',wind:'18 km/h',uv:'Low'},{name:'Manzini',temp:21,icon:'⛅',desc:'Overcast',humidity:'70%',wind:'14 km/h',uv:'Low'},{name:'Lubombo',temp:25,icon:'⛅',desc:'Cloudy',humidity:'52%',wind:'13 km/h',uv:'Moderate'}],
};

const PHRASES = {
  'Hello':{ ss:'Sawubona',zu:'Sawubona',af:'Hallo',pt:'Ola',fr:'Bonjour',de:'Hallo',zh:'你好',ar:'مرحبا'},
  'Thank you':{ ss:'Ngiyabonga',zu:'Ngiyabonga',af:'Dankie',pt:'Obrigado',fr:'Merci',de:'Danke',zh:'谢谢',ar:'شكرا'},
  'Where is the toilet?':{ ss:'Indlu yokuhlambela ikuphi?',zu:'Indlu yangasese ikuphi?',af:'Waar is die toilet?',pt:'Onde e o banheiro?',fr:'Ou sont les toilettes?',de:'Wo ist die Toilette?',zh:'厕所在哪里?',ar:'اين الحمام؟'},
  'How much?':{ ss:'Malini?',zu:'Malini?',af:'Hoeveel?',pt:'Quanto?',fr:'Combien?',de:'Wie viel?',zh:'多少钱?',ar:'كم؟'},
  'I need help':{ ss:'Ngidinga lusito',zu:'Ngidinga usizo',af:'Ek het hulp nodig',pt:'Preciso de ajuda',fr:'Jai besoin daide',de:'Ich brauche Hilfe',zh:'我需要帮助',ar:'احتاج مساعدة'},
  'Good morning':{ ss:'Sawubona ekuseni',zu:'Sawubona ekuseni',af:'Goeie more',pt:'Bom dia',fr:'Bonjour',de:'Guten Morgen',zh:'早上好',ar:'صباح الخير'},
  'Goodbye':{ ss:'Sala kahle',zu:'Sala kahle',af:'Totsiens',pt:'Adeus',fr:'Au revoir',de:'Auf Wiedersehen',zh:'再见',ar:'وداعا'},
  'Police':{ ss:'Amaphoyisa',zu:'Amaphoyisa',af:'Polisie',pt:'Policia',fr:'Police',de:'Polizei',zh:'警察',ar:'شرطة'},
  'Water':{ ss:'Emanti',zu:'Amanzi',af:'Water',pt:'Agua',fr:'Eau',de:'Wasser',zh:'水',ar:'ماء'},
  'Food':{ ss:'Kudla',zu:'Ukudla',af:'Kos',pt:'Comida',fr:'Nourriture',de:'Essen',zh:'食物',ar:'طعام'},
};

// ── LAZY IMAGE COMPONENT ──────────────────────────────────
function Img({src, alt, style, fallback='https://media.istockphoto.com/id/1051594302/photo/swaziland-valley-of-ezulwini.webp?a=1&b=1&s=612x612&w=0&k=20&c=2Riei98Nbq3cxQXv8Ie3c6e_NjMyAk1ZwPKzUC0sDFk='}) {
  const [loaded,setLoaded] = useState(false);
  const [error,setError]   = useState(false);
  return (
    <div style={{...style,position:'relative',overflow:'hidden',background:'#0f2040'}}>
      {!loaded&&!error&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',color:'#8fa3c4',fontSize:12}}>Loading...</div>}
      <img
        src={error?fallback:src}
        alt={alt||''}
        onLoad={()=>setLoaded(true)}
        onError={()=>setError(true)}
        style={{width:'100%',height:'100%',objectFit:'cover',opacity:loaded?1:0,transition:'opacity 0.4s'}}
      />
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────
// ── AUTH ───────────────────────────────────────────────────
// Guests can browse, search, view places, get directions, and call
// restaurants freely. Signing in only gets asked for at the moment it
// actually unlocks something: ordering, booking, or reviewing.
const AuthContext = createContext(null);
function useAuth(){ return useContext(AuthContext); }

function AuthProvider({children}){
  const [user,setUser]   = useState(null);
  const [ready,setReady] = useState(false);
  const [prompt,setPrompt] = useState(null);   // {reason, onSuccess}
  const [authScreen,setAuthScreen] = useState(null); // null | 'signin' | 'signup'

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{ setUser(data.session?.user||null); setReady(true); });
    const {data:sub} = supabase.auth.onAuthStateChange((_e,session)=>{ setUser(session?.user||null); });
    return ()=> sub.subscription.unsubscribe();
  },[]);

  // Call this before any "members only" action. If signed in, runs onSuccess
  // immediately. If not, shows a friendly prompt instead of blocking outright.
  const requireAuth = (reason, onSuccess)=>{
    if(user){ onSuccess && onSuccess(); return true; }
    setPrompt({reason, onSuccess});
    return false;
  };

  const signOut = ()=> supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{user,ready,requireAuth,setAuthScreen,signOut}}>
      {children}
      {prompt && (
        <SignInPrompt
          reason={prompt.reason}
          onClose={()=>setPrompt(null)}
          onChooseAuth={(mode)=>{ setAuthScreen(mode); }}
        />
      )}
      {authScreen && (
        <AuthScreen
          mode={authScreen}
          onClose={()=>setAuthScreen(null)}
          onSwitch={(m)=>setAuthScreen(m)}
          onSuccess={()=>{
            setAuthScreen(null);
            if(prompt&&prompt.onSuccess) prompt.onSuccess();
            setPrompt(null);
          }}
        />
      )}
    </AuthContext.Provider>
  );
}

function SignInPrompt({reason,onClose,onChooseAuth}){
  const signInWithGoogle = async()=>{
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(10,22,40,0.75)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#0f2040',border:'0.5px solid rgba(201,162,39,0.35)',borderRadius:18,padding:24,maxWidth:340,width:'100%',textAlign:'center',boxShadow:'0 20px 60px rgba(0,0,0,0.6)'}}>
        <div style={{fontSize:40,marginBottom:10}}>🔐</div>
        <div style={{fontSize:15,fontWeight:700,color:'#f0f4ff',marginBottom:8}}>Sign in to continue</div>
        <div style={{fontSize:13,color:'#8fa3c4',lineHeight:1.6,marginBottom:18}}>{reason}</div>
        <button onClick={signInWithGoogle} style={{width:'100%',padding:'11px',borderRadius:50,border:'0.5px solid rgba(255,255,255,0.2)',background:'#fff',color:'#1f1f1f',fontWeight:600,fontSize:13,cursor:'pointer',marginBottom:14,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
          <span style={{fontSize:16}}>🇬</span> Continue with Google
        </button>
        <div style={{textAlign:'center',color:'#5f7a9a',fontSize:11,marginBottom:14}}>— or use email —</div>
        <button style={{...styles.btnPrimary,marginBottom:8}} onClick={()=>onChooseAuth('signup')}>Create free account</button>
        <button style={{width:'100%',padding:'11px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:'transparent',color:'#c9a227',fontWeight:600,fontSize:13,cursor:'pointer',marginBottom:8}} onClick={()=>onChooseAuth('signin')}>I already have an account</button>
        <button style={{width:'100%',padding:'9px',border:'none',background:'transparent',color:'#5f7a9a',fontSize:12,cursor:'pointer'}} onClick={onClose}>Maybe later</button>
      </div>
    </div>
  );
}

function AuthScreen({mode,onClose,onSwitch,onSuccess}){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [fullName,setFullName] = useState('');
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');

  const signInWithGoogle = async()=>{
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const submit = async()=>{
    if(!email||!password) return setError('Please fill in email and password.');
    setLoading(true); setError('');
    if(mode==='signup'){
      const {error} = await supabase.auth.signUp({email,password,options:{data:{full_name:fullName}}});
      if(error) setError(error.message);
      else { setLoading(false); onSuccess(); return; }
    } else {
      const {error} = await supabase.auth.signInWithPassword({email,password});
      if(error) setError(error.message);
      else { setLoading(false); onSuccess(); return; }
    }
    setLoading(false);
  };

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(10,22,40,0.92)',zIndex:1001,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{background:'#0f2040',border:'0.5px solid rgba(201,162,39,0.35)',borderRadius:18,padding:24,maxWidth:340,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.6)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <div style={{fontSize:17,fontWeight:700,color:'#f0f4ff'}}>{mode==='signup'?'Create your account':'Welcome back'}</div>
          <button onClick={onClose} style={{background:'transparent',border:'none',color:'#8fa3c4',fontSize:18,cursor:'pointer'}}>✕</button>
        </div>
        <button onClick={signInWithGoogle} style={{width:'100%',padding:'11px',borderRadius:50,border:'0.5px solid rgba(255,255,255,0.2)',background:'#fff',color:'#1f1f1f',fontWeight:600,fontSize:13,cursor:'pointer',marginBottom:10,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
          <span style={{fontSize:16}}>🇬</span> Continue with Google
        </button>
        <div style={{textAlign:'center',color:'#5f7a9a',fontSize:11,marginBottom:14}}>— or use email —</div>
        {mode==='signup'&&(
          <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Full name" style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:10,padding:'11px 13px',color:'#f0f4ff',fontSize:13,outline:'none',marginBottom:10,boxSizing:'border-box'}}/>
        )}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:10,padding:'11px 13px',color:'#f0f4ff',fontSize:13,outline:'none',marginBottom:10,boxSizing:'border-box'}}/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:10,padding:'11px 13px',color:'#f0f4ff',fontSize:13,outline:'none',marginBottom:10,boxSizing:'border-box'}}/>
        {error && <div style={{fontSize:12,color:'#e24b4a',marginBottom:10}}>{error}</div>}
        <button style={{...styles.btnPrimary,marginBottom:10,opacity:loading?0.6:1}} disabled={loading} onClick={submit}>{loading?'Please wait…':(mode==='signup'?'Create account':'Sign in')}</button>
        <div style={{textAlign:'center',fontSize:12,color:'#8fa3c4'}}>
          {mode==='signup' ? (
            <>Already have an account? <span style={{color:'#c9a227',cursor:'pointer'}} onClick={()=>onSwitch('signin')}>Sign in</span></>
          ) : (
            <>New here? <span style={{color:'#c9a227',cursor:'pointer'}} onClick={()=>onSwitch('signup')}>Create an account</span></>
          )}
        </div>
      </div>
    </div>
  );
}
function AppInner() {
  const [screen,setScreen]   = useState('splash');
  const [tab,setTab]         = useState('home');
  const [lang,setLang]       = useState('en');
  const [showLangPicker,setShowLangPicker] = useState(false);
  const [selectedPlace,setSelectedPlace]           = useState(null);
  const [selectedRestaurant,setSelectedRestaurant] = useState(null);
  const [selectedHotel,setSelectedHotel]           = useState(null);
  const [selectedStore,setSelectedStore]           = useState(null);
  const [showVirtualTour,setShowVirtualTour]       = useState(null);
  const t = T[lang];

  if(screen==='splash') return (
    <div style={styles.splash}>
      <div style={styles.splashGlow}/>
      <div style={{fontSize:72,marginBottom:12}}>💎</div>
      <h1 style={styles.splashTitle}>Inc<span style={styles.gold}>aba</span></h1>
      <div style={{fontSize:14,color:'#c9a227',fontWeight:600,marginBottom:6}}>{t.tagline}</div>
      <p style={{color:'#8fa3c4',fontSize:12,margin:'0 0 16px',lineHeight:1.6}}>{t.sub}</p>
      <div style={{display:'flex',gap:6,justifyContent:'center',marginBottom:16,flexWrap:'wrap',maxWidth:340}}>
        {Object.entries(T).map(([code,data])=>(
          <button key={code} onClick={()=>setLang(code)} style={{padding:'5px 10px',borderRadius:20,border:lang===code?'1.5px solid #c9a227':'0.5px solid rgba(201,162,39,0.3)',background:lang===code?'rgba(201,162,39,0.2)':'transparent',color:lang===code?'#c9a227':'#8fa3c4',fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}>
            {data.flag} {code.toUpperCase()}
          </button>
        ))}
      </div>
      <button style={styles.btnPrimary} onClick={()=>setScreen('main')}>{t.explore}</button>
      <p style={{color:'#5f7a9a',fontSize:10,marginTop:12}}>{t.offline}</p>
    </div>
  );

  if(showVirtualTour) return <VirtualTourScreen place={showVirtualTour} onBack={()=>setShowVirtualTour(null)} t={t}/>;
  if(selectedPlace) return <DetailScreen place={selectedPlace} onBack={()=>setSelectedPlace(null)} t={t} onVirtualTour={()=>setShowVirtualTour(selectedPlace)}/>;
  if(selectedRestaurant) return <RestaurantDetail item={selectedRestaurant} onBack={()=>setSelectedRestaurant(null)} t={t}/>;
  if(selectedHotel) return <HotelDetail item={selectedHotel} onBack={()=>setSelectedHotel(null)} t={t}/>;
  if(selectedStore) return <StoreDetail item={selectedStore} onBack={()=>setSelectedStore(null)} t={t}/>;

  return (
    <div style={styles.app}>
      <div style={styles.topbar}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{fontSize:18,width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#c9a227,#e8b93a)',display:'flex',alignItems:'center',justifyContent:'center'}}>💎</div>
          <span style={{fontSize:17,fontWeight:700,color:'#f0f4ff'}}>Inc<span style={styles.gold}>aba</span></span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,position:'relative'}}>
          <button onClick={()=>setShowLangPicker(!showLangPicker)} style={{padding:'4px 10px',borderRadius:20,border:'0.5px solid rgba(201,162,39,0.3)',background:'rgba(201,162,39,0.08)',color:'#c9a227',fontSize:11,cursor:'pointer'}}>{T[lang].flag} {lang.toUpperCase()} ▾</button>
          {showLangPicker&&(
            <div style={{position:'absolute',top:34,right:0,background:'#0d1f3c',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:12,padding:8,zIndex:300,minWidth:160,boxShadow:'0 8px 32px rgba(0,0,0,0.5)',maxHeight:300,overflowY:'auto'}}>
              {Object.entries(T).map(([code,data])=>(
                <div key={code} onClick={()=>{setLang(code);setShowLangPicker(false);}} style={{padding:'8px 12px',borderRadius:8,cursor:'pointer',color:lang===code?'#c9a227':'#f0f4ff',background:lang===code?'rgba(201,162,39,0.12)':'transparent',fontSize:13,display:'flex',alignItems:'center',gap:8}}>
                  {data.flag} {data.name}
                </div>
              ))}
            </div>
          )}
          <span style={{fontSize:20}}>🇸🇿</span>
          <ProfileButton/>
        </div>
      </div>

      <div style={styles.content}>
        {tab==='home'      && <HomeTab setTab={setTab} onSelect={setSelectedPlace} onSelectRestaurant={setSelectedRestaurant} onSelectHotel={setSelectedHotel} onSelectStore={setSelectedStore} t={t}/>}
        {tab==='explore'   && <ExploreTab onSelect={setSelectedPlace} onVirtualTour={setShowVirtualTour} t={t}/>}
        {tab==='stay'      && <AccommodationTab onSelectHotel={setSelectedHotel} t={t}/>}
        {tab==='culture'   && <CultureTab t={t}/>}
        {tab==='getaround' && <GettingAroundTab t={t}/>}
        {tab==='book'      && <BookTab t={t} setTab={setTab} onSelectHotel={setSelectedHotel} onSelect={setSelectedPlace}/>}
        {tab==='translate' && <TranslateTab t={t} lang={lang}/>}
        {tab==='compare'   && <CompareTab t={t} onSelectRestaurant={setSelectedRestaurant} onSelectHotel={setSelectedHotel} onSelectStore={setSelectedStore}/>}
        {tab==='map'       && <MapTab t={t}/>}
        {tab==='ai'        && <AITab t={t}/>}
        {tab==='business'  && <BusinessTab t={t}/>}
        {tab==='mytrips'   && <MyOrdersTab t={t}/>}
      </div>

      <BottomNav tab={tab} setTab={setTab} t={t}/>
    </div>
  );
}

function ProfileButton(){
  const {user,requireAuth,signOut} = useAuth();
  const [open,setOpen] = useState(false);
  const name = user && (user.user_metadata?.full_name || user.email);

  if(!user) return (
    <button onClick={()=>requireAuth('Sign in to save favourites, see your order history, and manage bookings.')}
      style={{padding:'4px 11px',borderRadius:20,border:'0.5px solid rgba(201,162,39,0.3)',background:'rgba(201,162,39,0.08)',color:'#c9a227',fontSize:11,fontWeight:600,cursor:'pointer'}}>
      Sign in
    </button>
  );

  return (
    <div style={{position:'relative'}}>
      <button onClick={()=>setOpen(!open)} style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#c9a227,#e8b93a)',border:'none',color:'#0a1628',fontWeight:700,fontSize:12,cursor:'pointer'}}>
        {(name||'?').charAt(0).toUpperCase()}
      </button>
      {open&&(
        <div style={{position:'absolute',top:34,right:0,background:'#0d1f3c',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:12,padding:10,zIndex:300,minWidth:180,boxShadow:'0 8px 32px rgba(0,0,0,0.5)'}}>
          <div style={{fontSize:12,color:'#8fa3c4',padding:'4px 8px 10px',borderBottom:'0.5px solid rgba(255,255,255,0.08)',marginBottom:6,wordBreak:'break-all'}}>Signed in as<br/><b style={{color:'#f0f4ff'}}>{name}</b></div>
          <button onClick={()=>{signOut();setOpen(false);}} style={{width:'100%',textAlign:'left',padding:'8px',borderRadius:8,border:'none',background:'transparent',color:'#e24b4a',fontSize:13,cursor:'pointer'}}>Sign out</button>
        </div>
      )}
    </div>
  );
}



function App(){
  return <AuthProvider><AppInner/></AuthProvider>;
}

function MyOrdersTab({t}){
  const {user,requireAuth} = useAuth();
  const [orders,setOrders]   = useState([]);
  const [bookings,setBookings] = useState([]);
  const [favorites,setFavorites] = useState([]);
  const [loading,setLoading] = useState(true);

  const load = ()=>{
    if(!user){ setLoading(false); return; }
    setLoading(true);
    Promise.all([
      supabase.from('orders').select('*').eq('user_id',user.id).order('created_at',{ascending:false}),
      supabase.from('bookings').select('*').eq('user_id',user.id).order('created_at',{ascending:false}),
      supabase.from('favorites').select('*').eq('user_id',user.id).order('created_at',{ascending:false}),
    ]).then(([o,b,f])=>{
      if(o.error) console.error('Load orders failed:', o.error.message); else setOrders(o.data||[]);
      if(b.error) console.error('Load bookings failed:', b.error.message); else setBookings(b.data||[]);
      if(f.error) console.error('Load favorites failed:', f.error.message); else setFavorites(f.data||[]);
      setLoading(false);
    });
  };
  useEffect(load,[user]); // eslint-disable-line react-hooks/exhaustive-deps

  const cancelOrder = (code)=>{
    if(!window.confirm('Cancel this order?')) return;
    supabase.from('orders').update({status:'cancelled'}).eq('order_code',code).then(()=>load());
  };
  const cancelBooking = (code)=>{
    if(!window.confirm('Cancel this booking?')) return;
    supabase.from('bookings').update({status:'cancelled'}).eq('booking_code',code).then(()=>load());
  };
  const removeFavorite = (id)=>{
    supabase.from('favorites').delete().eq('id',id).then(()=>load());
  };

  if(!user) return (
    <div style={{textAlign:'center',padding:'40px 16px'}}>
      <div style={{fontSize:46,marginBottom:12}}>🔐</div>
      <div style={{fontSize:15,fontWeight:700,color:'#f0f4ff',marginBottom:8}}>This is your space</div>
      <div style={{fontSize:13,color:'#8fa3c4',lineHeight:1.6,marginBottom:18}}>
        Sign in to see your saved favourites, order history with receipts, and manage your bookings — all in one place.
      </div>
      <button style={styles.btnPrimary} onClick={()=>requireAuth('Sign in to see your favourites, orders, and bookings.')}>Sign in</button>
    </div>
  );

  const Empty = ({label})=>(
    <div style={{textAlign:'center',padding:'20px 10px',color:'#8fa3c4',fontSize:13}}>{label}</div>
  );

  return (
    <div>
      <div style={styles.sectionTitle}>📋 My Account</div>
      {loading ? (
        <div style={{textAlign:'center',padding:30,color:'#8fa3c4',fontSize:13}}>Loading…</div>
      ) : (
        <>
          <div style={{fontSize:13,fontWeight:700,color:'#c9a227',margin:'4px 0 10px'}}>❤️ Favourites</div>
          {favorites.length===0 ? <Empty label="No favourites yet — tap 'Save' on any place you like."/> : favorites.map(f=>(
            <div key={f.id} style={{display:'flex',alignItems:'center',gap:10,background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:12,padding:10,marginBottom:8}}>
              <Img src={f.img} alt={f.place_name} style={{width:48,height:48,borderRadius:8,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{f.place_name}</div>
                <div style={{fontSize:11,color:'#8fa3c4'}}>{f.region}</div>
              </div>
              <button onClick={()=>removeFavorite(f.id)} style={{padding:'6px 10px',borderRadius:50,border:'0.5px solid rgba(226,75,74,0.4)',background:'rgba(226,75,74,0.08)',color:'#e24b4a',fontSize:11,fontWeight:600,cursor:'pointer'}}>Remove</button>
            </div>
          ))}

          <div style={{fontSize:13,fontWeight:700,color:'#c9a227',margin:'18px 0 10px'}}>🍽️ Food Orders</div>
          {orders.length===0 ? <Empty label="No orders yet."/> : orders.map(o=>(
                <div key={o.id} style={{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:12,padding:13,marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{o.restaurant_name}</span>
                    <span style={{fontSize:11,fontWeight:700,color:o.status==='cancelled'?'#e24b4a':'#5dcaa5'}}>{o.status==='cancelled'?'Cancelled':'Active'}</span>
                  </div>
                  <div style={{fontSize:11,color:'#8fa3c4',marginBottom:6}}>{o.dining_mode==='dinein'?'Dine-in':'Takeaway'} · {new Date(o.created_at).toLocaleString([], {dateStyle:'medium',timeStyle:'short'})}</div>
                  <div style={{fontSize:18,fontWeight:800,color:'#c9a227',letterSpacing:1,marginBottom:6}}>{o.order_code}</div>
                  <div style={{fontSize:12,color:'#f0f4ff',marginBottom:8}}>
                    {(o.items||[]).map((it,i)=><div key={i}>{it.name} x{it.qty} — E {it.price*it.qty}</div>)}
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:13,fontWeight:700,color:'#c9a227'}}>Total: E {o.total}</span>
                    {o.status!=='cancelled' && <button onClick={()=>cancelOrder(o.order_code)} style={{padding:'6px 12px',borderRadius:50,border:'0.5px solid rgba(226,75,74,0.4)',background:'rgba(226,75,74,0.08)',color:'#e24b4a',fontSize:11,fontWeight:600,cursor:'pointer'}}>Cancel</button>}
                  </div>
                </div>
              ))}

          <div style={{fontSize:13,fontWeight:700,color:'#c9a227',margin:'18px 0 10px'}}>🛏️ Accommodation Bookings</div>
          {bookings.length===0 ? <Empty label="No bookings yet."/> : bookings.map(b=>(
                <div key={b.id} style={{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:12,padding:13,marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{b.property_name}</span>
                    <span style={{fontSize:11,fontWeight:700,color:b.status==='cancelled'?'#e24b4a':'#5dcaa5'}}>{b.status==='cancelled'?'Cancelled':'Confirmed'}</span>
                  </div>
                  <div style={{fontSize:11,color:'#8fa3c4',marginBottom:6}}>{b.check_in} → {b.check_out} · {b.guests} guest(s)</div>
                  <div style={{fontSize:18,fontWeight:800,color:'#c9a227',letterSpacing:1,marginBottom:8}}>{b.booking_code}</div>
                  {b.status!=='cancelled' && <button onClick={()=>cancelBooking(b.booking_code)} style={{padding:'6px 12px',borderRadius:50,border:'0.5px solid rgba(226,75,74,0.4)',background:'rgba(226,75,74,0.08)',color:'#e24b4a',fontSize:11,fontWeight:600,cursor:'pointer'}}>Cancel</button>}
                </div>
              ))}
        </>
      )}
    </div>
  );
}

function BottomNav({tab,setTab,t}){
  const [showMore,setShowMore]=useState(false);
  const primary=[
    {id:'home',    icon:'🏠',label:t.home},
    {id:'explore', icon:'🔭',label:t.explore2},
    {id:'stay',    icon:'🛏️',label:'Stay'},
    {id:'book',    icon:'🎟️',label:'Book'},
    {id:'map',     icon:'🗺️',label:t.navigate},
  ];
  const more=[
    {id:'mytrips',  icon:'📋',label:'My Trips'},
    {id:'culture',  icon:'🎭',label:'Culture'},
    {id:'getaround',icon:'🚗',label:'Travel'},
    {id:'translate',icon:'🌐',label:t.translate},
    {id:'compare',  icon:'⚖️',label:t.compare},
    {id:'ai',       icon:'🤖',label:t.ai},
    {id:'business', icon:'🏢',label:t.business},
  ];
  const moreActive = more.some(m=>m.id===tab);
  return (
    <div style={{position:'relative'}}>
      {showMore&&(
        <div style={{position:'absolute',bottom:'100%',right:8,marginBottom:6,background:'#0f2040',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:12,boxShadow:'0 8px 24px rgba(0,0,0,0.5)',overflow:'hidden',zIndex:50,minWidth:170}}>
          {more.map(item=>(
            <div key={item.id} onClick={()=>{setTab(item.id);setShowMore(false);}}
              style={{display:'flex',alignItems:'center',gap:10,padding:'11px 14px',cursor:'pointer',background:tab===item.id?'rgba(201,162,39,0.12)':'transparent',color:tab===item.id?'#c9a227':'#f0f4ff',fontSize:13,borderBottom:'0.5px solid rgba(255,255,255,0.05)'}}>
              <span style={{fontSize:16}}>{item.icon}</span><span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
      <div style={styles.bottomNav}>
        {primary.map(item=>(
          <div key={item.id} style={tab===item.id?styles.navActive:styles.navItem} onClick={()=>{setTab(item.id);setShowMore(false);}}>
            <span style={{fontSize:16}}>{item.icon}</span>
            <span style={{fontSize:8,color:tab===item.id?'#c9a227':'#8fa3c4',fontWeight:500}}>{item.label}</span>
          </div>
        ))}
        <div style={moreActive?styles.navActive:styles.navItem} onClick={()=>setShowMore(s=>!s)}>
          <span style={{fontSize:16}}>{showMore?'✕':'⋯'}</span>
          <span style={{fontSize:8,color:moreActive?'#c9a227':'#8fa3c4',fontWeight:500}}>More</span>
        </div>
      </div>
    </div>
  );
}

// ── VIRTUAL TOUR ──────────────────────────────────────────
function VirtualTourScreen({place,onBack,t}) {
  const [step,setStep]       = useState(0);
  const [speaking,setSpeaking] = useState(false);
  const [showVideo,setShowVideo] = useState(false);
  const steps = [
    {title:'Welcome to '+place.name,desc:'You are about to experience a virtual tour of one of Eswatini most magnificent destinations. '+place.fullDesc,icon:'🎭'},
    {title:t.location,desc:'Located at '+place.location+'. '+place.hours+'. Entry: '+place.price+'. Accessible by car, kombi taxi, or organised tour.',icon:'📍'},
    {title:t.tips,desc:place.tips.join('. ')+'. A must-visit for any tourist in the Kingdom of Eswatini.',icon:'💡'},
    {title:'Cultural Significance',desc:place.name+' is deeply connected to the heritage of the Swazi people. Visitors are encouraged to be respectful and embrace local culture.',icon:'🇸🇿'},
  ];
  const speak = (text)=>{
    if('speechSynthesis' in window){
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate=0.85; u.onstart=()=>setSpeaking(true); u.onend=()=>setSpeaking(false);
      window.speechSynthesis.speak(u);
    }
  };
  return (
    <div style={styles.app}>
      <div style={{background:'linear-gradient(135deg,#0a1628,#1a3a5c)',padding:'12px 16px',display:'flex',alignItems:'center',gap:12,borderBottom:'0.5px solid rgba(201,162,39,0.25)',flexShrink:0}}>
        <button onClick={onBack} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:50,padding:'7px 14px',color:'#f0f4ff',fontSize:12,cursor:'pointer'}}>← Back</button>
        <div><div style={{fontSize:13,fontWeight:700,color:'#c9a227'}}>{t.virtualTour}</div><div style={{fontSize:11,color:'#8fa3c4'}}>{place.name}</div></div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:16}}>
        {!showVideo?(
          <>
            <Img src={place.gallery[step%place.gallery.length]} alt={place.name} style={{width:'100%',height:200,borderRadius:14,marginBottom:14}}/>
            <div style={{background:'rgba(83,74,183,0.15)',border:'0.5px solid rgba(131,122,221,0.3)',borderRadius:16,padding:18,marginBottom:14,textAlign:'center'}}>
              <div style={{fontSize:40,marginBottom:10}}>{steps[step].icon}</div>
              <div style={{fontSize:17,fontWeight:700,color:'#c9a227',marginBottom:10}}>{steps[step].title}</div>
              <div style={{fontSize:13,color:'#b0c4de',lineHeight:1.8,marginBottom:14}}>{steps[step].desc}</div>
              <button onClick={()=>speak(steps[step].desc)} style={{padding:'9px 20px',borderRadius:50,border:'0.5px solid rgba(131,122,221,0.4)',background:speaking?'rgba(131,122,221,0.3)':'rgba(131,122,221,0.15)',color:'#afa9ec',cursor:'pointer',fontSize:12}}>
                {speaking?'🔊 Speaking...':'🔊 Listen'}
              </button>
            </div>
            <div style={{display:'flex',gap:6,justifyContent:'center',marginBottom:14}}>
              {steps.map((_,i)=><div key={i} onClick={()=>setStep(i)} style={{width:i===step?22:7,height:7,borderRadius:4,background:i===step?'#c9a227':'rgba(201,162,39,0.3)',cursor:'pointer',transition:'all 0.3s'}}/>)}
            </div>
            <div style={{display:'flex',gap:10,marginBottom:14}}>
              <button onClick={()=>setStep(p=>Math.max(0,p-1))} disabled={step===0} style={{flex:1,padding:'11px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:'transparent',color:step===0?'#4a5568':'#c9a227',cursor:step===0?'not-allowed':'pointer',fontSize:13}}>← Prev</button>
              <button onClick={()=>setStep(p=>Math.min(steps.length-1,p+1))} disabled={step===steps.length-1} style={{flex:1,padding:'11px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:step===steps.length-1?'transparent':'rgba(201,162,39,0.15)',color:step===steps.length-1?'#4a5568':'#c9a227',cursor:step===steps.length-1?'not-allowed':'pointer',fontSize:13}}>Next →</button>
            </div>
            <div style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:14,padding:'12px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
              <div><div style={{fontSize:13,fontWeight:600,color:'#f0f4ff',marginBottom:3}}>{place.videoTitle}</div><div style={{fontSize:11,color:'#8fa3c4'}}>Real YouTube video</div></div>
              <button onClick={()=>setShowVideo(true)} style={{padding:'9px 16px',borderRadius:50,background:'linear-gradient(135deg,#c9a227,#e8b93a)',border:'none',color:'#0a1628',fontSize:12,fontWeight:700,cursor:'pointer'}}>▶ Watch</button>
            </div>
            <div style={styles.sectionTitle}>{t.photos}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
              {place.gallery.map((img,i)=><Img key={i} src={img} alt="" style={{height:80,borderRadius:10}}/>)}
            </div>
          </>
        ):(
          <div>
            <button onClick={()=>setShowVideo(false)} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:50,padding:'7px 14px',color:'#f0f4ff',fontSize:12,cursor:'pointer',marginBottom:12}}>← Back</button>
            <div style={{borderRadius:14,overflow:'hidden',marginBottom:12}}>
              <iframe width="100%" height="210" src={'https://www.youtube.com/embed/'+place.videoId+'?autoplay=1'} title={place.videoTitle} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{display:'block'}}/>
            </div>
            <div style={{fontSize:12,color:'#8fa3c4',textAlign:'center'}}>{place.videoTitle}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── PHOTO SLIDESHOW ───────────────────────────────────────
function Slideshow({images,height=260}) {
  const [cur,setCur] = useState(0);
  const [play,setPlay] = useState(true);
  useEffect(()=>{
    if(!play) return;
    const t = setInterval(()=>setCur(p=>(p+1)%images.length),3500);
    return ()=>clearInterval(t);
  },[play,images.length]);
  return (
    <div style={{position:'relative',height,overflow:'hidden',background:'#0d2540',flexShrink:0}}>
      {images.map((img,i)=>(
        <div key={i} style={{position:'absolute',inset:0,opacity:i===cur?1:0,transition:'opacity 0.9s ease'}}>
          <Img src={img} alt="" style={{width:'100%',height:'100%'}}/>
        </div>
      ))}
      <div style={{position:'absolute',bottom:10,left:'50%',transform:'translateX(-50%)',display:'flex',gap:5}}>
        {images.map((_,i)=><div key={i} onClick={()=>{setCur(i);setPlay(false);}} style={{width:i===cur?18:6,height:6,borderRadius:3,background:i===cur?'#c9a227':'rgba(255,255,255,0.5)',cursor:'pointer',transition:'all 0.3s'}}/>)}
      </div>
      <button onClick={()=>{setCur(p=>(p-1+images.length)%images.length);setPlay(false);}} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',background:'rgba(10,22,40,0.65)',border:'none',borderRadius:'50%',width:30,height:30,color:'white',fontSize:15,cursor:'pointer'}}>‹</button>
      <button onClick={()=>{setCur(p=>(p+1)%images.length);setPlay(false);}} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'rgba(10,22,40,0.65)',border:'none',borderRadius:'50%',width:30,height:30,color:'white',fontSize:15,cursor:'pointer'}}>›</button>
    </div>
  );
}

// ── REVIEWS ───────────────────────────────────────────────
function Reviews({name,t}) {
  const {user,requireAuth} = useAuth();
  const seedList = [
    {id:'seed1',user_name:'Sarah M.',stars:5,text:'Absolutely breathtaking! Best experience of my life.',created_at:null},
    {id:'seed2',user_name:'Joao P.',stars:5,text:'Incredible! Will definitely come back.',created_at:null},
    {id:'seed3',user_name:'Thandi D.',stars:4,text:'Beautiful place, well maintained.',created_at:null},
  ];
  const [list,setList] = useState(seedList);
  const [loading,setLoading] = useState(true);
  const [show,setShow] = useState(false);
  const [nText,setNText]=useState(''); const [nStars,setNStars]=useState(5);
  const reviewerName = user ? (user.user_metadata?.full_name || user.email) : '';

  useEffect(()=>{
    setLoading(true);
    supabase.from('reviews').select('*').eq('place_name',name).order('created_at',{ascending:false})
      .then(({data,error})=>{
        if(error){ console.error('Load reviews failed:', error.message); setLoading(false); return; }
        setList([...(data||[]), ...seedList]);
        setLoading(false);
      });
  },[name]); // eslint-disable-line react-hooks/exhaustive-deps

  const openReviewForm = ()=>{
    requireAuth("Sign in to write a review — it helps other tourists, and we'll credit it to your name.", ()=> setShow(true));
  };
  const submitReview = ()=>{
    if(!nText) return;
    supabase.from('reviews').insert({user_id:user.id, user_name:reviewerName, place_name:name, stars:nStars, text:nText})
      .then(({error})=>{
        if(error){ console.error('Review save failed:', error.message); alert('Could not post your review — please try again.'); return; }
        setList(p=>[{id:'tmp'+Date.now(),user_name:reviewerName,stars:nStars,text:nText,created_at:new Date().toISOString()},...p]);
        setNText(''); setShow(false);
      });
  };

  return (
    <div style={{marginBottom:16}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <div style={styles.sectionTitle}>{t.reviews}</div>
        <button style={{fontSize:11,color:'#c9a227',background:'rgba(201,162,39,0.1)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:20,padding:'4px 12px',cursor:'pointer'}} onClick={openReviewForm}>+ {t.writeReview}</button>
      </div>
      {show&&(
        <div style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:12,padding:14,marginBottom:12}}>
          <div style={{fontSize:11,color:'#8fa3c4',marginBottom:8}}>Posting as <b style={{color:'#c9a227'}}>{reviewerName}</b></div>
          <div style={{display:'flex',gap:5,marginBottom:10}}>{[1,2,3,4,5].map(s=><span key={s} onClick={()=>setNStars(s)} style={{fontSize:22,cursor:'pointer',opacity:s<=nStars?1:0.3}}>⭐</span>)}</div>
          <textarea value={nText} onChange={e=>setNText(e.target.value)} placeholder="Share your experience..." rows={3} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:8,padding:'9px 12px',color:'#f0f4ff',fontSize:13,outline:'none',resize:'none',fontFamily:'inherit',boxSizing:'border-box'}}/>
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button style={{...styles.btnPrimary,flex:1,padding:'9px',fontSize:13}} onClick={submitReview}>{t.submit}</button>
            <button style={{flex:1,padding:'9px',fontSize:13,borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:'transparent',color:'#8fa3c4',cursor:'pointer'}} onClick={()=>setShow(false)}>{t.cancel}</button>
          </div>
        </div>
      )}
      {loading ? (
        <div style={{textAlign:'center',padding:16,color:'#8fa3c4',fontSize:12}}>Loading reviews…</div>
      ) : list.map((r,i)=>(
        <div key={r.id||i} style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.15)',borderRadius:12,padding:12,marginBottom:8}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
            <span style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{r.user_name}</span>
            <span style={{fontSize:10,color:'#8fa3c4'}}>{r.created_at?new Date(r.created_at).toLocaleDateString():''}</span>
          </div>
          <div style={{marginBottom:5}}>{'⭐'.repeat(r.stars)}</div>
          <div style={{fontSize:13,color:'#b0c4de',lineHeight:1.6}}>{r.text}</div>
        </div>
      ))}
    </div>
  );
}

// ── DETAIL SCREEN ─────────────────────────────────────────
function DetailScreen({place,onBack,t,onVirtualTour}) {
  const {user,requireAuth} = useAuth();
  const [saved,setSaved] = useState(false);

  useEffect(()=>{
    if(!user) return;
    supabase.from('favorites').select('id').eq('user_id',user.id).eq('place_name',place.name).maybeSingle()
      .then(({data})=> setSaved(!!data));
  },[user, place.name]);

  const toggleSave = ()=>{
    requireAuth('Sign in to save places to your favourites and find them again anytime.', async()=>{
      if(saved){
        await supabase.from('favorites').delete().eq('user_id',user.id).eq('place_name',place.name);
        setSaved(false);
      }else{
        await supabase.from('favorites').insert({user_id:user.id, place_name:place.name, place_type:'attraction', region:place.region, img:place.gallery&&place.gallery[0]});
        setSaved(true);
      }
    });
  };
  return (
    <div style={styles.app}>
      <div style={{position:'relative',flexShrink:0}}>
        <Slideshow images={place.gallery} height={260}/>
        <button onClick={onBack} style={{position:'absolute',top:14,left:14,background:'rgba(10,22,40,0.75)',border:'none',borderRadius:50,padding:'7px 13px',color:'#f0f4ff',fontSize:12,cursor:'pointer',zIndex:10}}>← {t.cancel}</button>
        <div style={{position:'absolute',top:14,right:14,background:'rgba(201,162,39,0.9)',borderRadius:20,padding:'3px 10px',fontSize:10,fontWeight:700,color:'#0a1628',zIndex:10}}>{place.category}</div>
        <div style={{position:'absolute',bottom:30,left:14,zIndex:10}}>
          <div style={{fontSize:19,fontWeight:700,color:'#fff',textShadow:'0 2px 8px rgba(0,0,0,0.9)'}}>{place.name}</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.85)',textShadow:'0 1px 4px rgba(0,0,0,0.8)'}}>📍 {place.region}</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:16}}>
        <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
          <div style={styles.badge}>⭐ {place.rating}</div>
          <div style={styles.badge}>{place.price}</div>
          <div style={{...styles.badge,color:'#5dcaa5',borderColor:'rgba(29,158,117,0.3)',background:'rgba(29,158,117,0.1)'}}>{place.hours}</div>
        </div>
        <button style={{width:'100%',padding:'11px',borderRadius:50,border:'0.5px solid rgba(131,122,221,0.4)',background:'rgba(131,122,221,0.15)',color:'#afa9ec',cursor:'pointer',fontWeight:600,fontSize:13,marginBottom:14}} onClick={onVirtualTour}>🥽 {t.virtualTour} — {place.name}</button>
        <div style={{fontSize:13,color:'#c9a227',fontWeight:600,marginBottom:6}}>{t.about}</div>
        <div style={{fontSize:13,color:'#b0c4de',lineHeight:1.8,marginBottom:14}}>{place.fullDesc}</div>
        <div style={{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:12,padding:12,marginBottom:12}}>
          <div style={{fontSize:12,color:'#c9a227',fontWeight:600,marginBottom:4}}>{t.location}</div>
          <div style={{fontSize:12,color:'#8fa3c4'}}>{place.location}</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
          <div style={{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:12,padding:12}}>
            <div style={{fontSize:11,color:'#c9a227',fontWeight:600,marginBottom:3}}>{t.hours}</div>
            <div style={{fontSize:11,color:'#8fa3c4'}}>{place.hours}</div>
          </div>
          <div style={{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:12,padding:12}}>
            <div style={{fontSize:11,color:'#c9a227',fontWeight:600,marginBottom:3}}>{t.price}</div>
            <div style={{fontSize:11,color:'#8fa3c4'}}>{place.price}</div>
          </div>
        </div>
        <div style={{fontSize:13,color:'#c9a227',fontWeight:600,marginBottom:8}}>{t.tips}</div>
        {place.tips.map((tip,i)=>(
          <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:7}}>
            <div style={{width:5,height:5,borderRadius:'50%',background:'#c9a227',flexShrink:0,marginTop:5}}/>
            <div style={{fontSize:12,color:'#8fa3c4',lineHeight:1.6}}>{tip}</div>
          </div>
        ))}
        <Reviews name={place.name} t={t}/>
        <div style={{display:'flex',gap:10,marginTop:8,marginBottom:8}}>
          <button style={{...styles.btnPrimary,flex:1,padding:'11px',fontSize:13}} onClick={()=>window.open('https://www.google.com/maps/search/'+encodeURIComponent(place.name)+'+Eswatini','_blank')}>🗺️ {t.getDir}</button>
          <button style={{flex:1,padding:'11px',fontSize:13,borderRadius:50,border:saved?'0.5px solid rgba(29,158,117,0.6)':'0.5px solid rgba(201,162,39,0.4)',background:saved?'rgba(29,158,117,0.15)':'transparent',color:saved?'#5dcaa5':'#c9a227',cursor:'pointer',fontWeight:600}} onClick={toggleSave}>{saved?'✅ Saved':t.savePlace}</button>
        </div>
        <button style={{width:'100%',padding:'11px',fontSize:13,borderRadius:50,border:'1px solid rgba(226,75,74,0.4)',background:'rgba(226,75,74,0.1)',color:'#e24b4a',cursor:'pointer',fontWeight:600,marginBottom:16}} onClick={()=>{if(window.confirm('Call Eswatini Emergency Services 999?'))window.location.href='tel:999';}}>🆘 {t.sos}</button>
      </div>
    </div>
  );
}

// ── RESTAURANT DETAIL WITH PHOTOS & ORDERING ──────────────
// Generates a short human-friendly pickup/proof-of-order code, e.g. "MK-4D7A"
function genOrderCode(item){
  const prefix=(item.name||'OR').replace(/[^A-Za-z]/g,'').slice(0,2).toUpperCase()||'OR';
  const rand=Math.random().toString(36).slice(2,6).toUpperCase();
  return prefix+'-'+rand;
}

function RestaurantDetail({item,onBack,t}) {
  const {user,requireAuth} = useAuth();
  const [cart,setCart]           = useState([]);
  const [showCart,setShowCart]   = useState(false);
  const [ordered,setOrdered]     = useState(false);
  const [cancelled,setCancelled] = useState(false);
  const [tableNum,setTableNum]   = useState('');
  const [diningMode,setDiningMode] = useState(null); // 'dinein' | 'takeaway'
  const [orderCode,setOrderCode] = useState('');
  const [orderTime,setOrderTime] = useState(null);

  const addToCart = mi=>{
    setCart(prev=>{
      const ex=prev.find(c=>c.name===mi.name);
      return ex?prev.map(c=>c.name===mi.name?{...c,qty:c.qty+1}:c):[...prev,{...mi,qty:1}];
    });
  };
  const removeFromCart = mi=>{
    setCart(prev=>prev.map(c=>c.name===mi.name?{...c,qty:c.qty-1}:c).filter(c=>c.qty>0));
  };
  const total = cart.reduce((s,c)=>s+c.price*c.qty,0);

  const dirUrl = item.lat&&item.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address||item.name)}`;

  const placeOrder = ()=>{
    if(!diningMode) return alert('Please choose Dine-in or Takeaway');
    if(diningMode==='dinein' && !tableNum) return alert('Please enter your table number');
    if(diningMode==='takeaway' && !tableNum) return alert('Please enter a contact number for pickup');
    requireAuth('Sign in to complete your order and receive a receipt.', ()=>{
    const code = genOrderCode(item);
    setOrderCode(code);
    setOrderTime(Date.now());
    setOrdered(true);
    setCancelled(false);
    supabase.from('orders').insert({
      order_code: code,
      restaurant_name: item.name,
      dining_mode: diningMode,
      contact: tableNum,
      items: cart.map(c=>({name:c.name,qty:c.qty,price:c.price})),
      total: total,
      device_id: getDeviceId(),
      user_id: user.id,
    }).then(({error})=>{ if(error) console.error('Order save failed:', error.message); });
    });
  };

  const cancelOrder = ()=>{
    if(!window.confirm('Cancel this order? The restaurant will be notified.')) return;
    setCancelled(true);
    supabase.from('orders').update({status:'cancelled'}).eq('order_code', orderCode)
      .then(({error})=>{ if(error) console.error('Cancel update failed:', error.message); });
  };

  const emailSubject = encodeURIComponent(`Order ${orderCode} – ${item.name}`);
  const emailBody = encodeURIComponent(
    `Order code: ${orderCode}\nRestaurant: ${item.name}\nMode: ${diningMode==='dinein'?'Dine-in':'Takeaway'}\n${diningMode==='dinein'?'Table':'Contact'}: ${tableNum}\n\nItems:\n`+
    cart.map(c=>`- ${c.name} x${c.qty} (E ${c.price*c.qty})`).join('\n')+
    `\n\nTotal: E ${total}`
  );

  if(ordered) return (
    <div style={styles.app}>
      <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',alignItems:'center',padding:28,textAlign:'center'}}>
        {cancelled ? (
          <>
            <div style={{fontSize:60,marginBottom:14}}>🚫</div>
            <div style={{fontSize:20,fontWeight:700,color:'#e24b4a',marginBottom:8}}>Order Cancelled</div>
            <div style={{fontSize:13,color:'#8fa3c4',lineHeight:1.7,marginBottom:20}}>Your order {orderCode} from {item.name} has been cancelled.<br/>Contact the restaurant if you've already been charged.</div>
          </>
        ) : (
          <>
            <div style={{fontSize:60,marginBottom:14}}>✅</div>
            <div style={{fontSize:20,fontWeight:700,color:'#5dcaa5',marginBottom:6}}>Order Placed!</div>
            <div style={{fontSize:13,color:'#8fa3c4',lineHeight:1.6,marginBottom:16}}>
              Your order from {item.name} has been received.<br/>
              {diningMode==='dinein' ? <>Table: {tableNum}</> : <>Pickup · Contact: {tableNum}</>} · Est. time: 20-30 min{orderTime?<> (ready by {new Date(orderTime+25*60000).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})})</>:null}<br/>
              🔥 Your food will be prepared fresh and served hot.
            </div>
            <div style={{background:'rgba(201,162,39,0.12)',border:'1px solid rgba(201,162,39,0.5)',borderRadius:14,padding:'14px 20px',marginBottom:16,width:'100%'}}>
              <div style={{fontSize:11,color:'#8fa3c4',marginBottom:4,letterSpacing:0.5}}>SHOW THIS CODE AT THE RESTAURANT AS PROOF OF ORDER</div>
              <div style={{fontSize:28,fontWeight:800,color:'#c9a227',letterSpacing:2}}>{orderCode}</div>
            </div>
            <div style={{background:'rgba(29,158,117,0.1)',border:'0.5px solid rgba(29,158,117,0.3)',borderRadius:14,padding:16,width:'100%',marginBottom:16}}>
              {cart.map(c=>(
                <div key={c.name} style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:13,color:'#f0f4ff'}}>
                  <span>{c.name} x{c.qty}</span><span style={{color:'#c9a227'}}>E {c.price*c.qty}</span>
                </div>
              ))}
              <div style={{borderTop:'0.5px solid rgba(255,255,255,0.1)',marginTop:8,paddingTop:8,display:'flex',justifyContent:'space-between',fontWeight:700,color:'#c9a227',fontSize:15}}>
                <span>Total</span><span>E {total}</span>
              </div>
            </div>
            <div style={{display:'flex',gap:8,width:'100%',marginBottom:10}}>
              <a href={dirUrl} target="_blank" rel="noreferrer" style={{...styles.btnPrimary,flex:1,textDecoration:'none',display:'flex',alignItems:'center',justifyContent:'center'}}>🧭 {t.getDir}</a>
              {item.phone && <a href={`tel:${item.phone.replace(/\s/g,'')}`} style={{flex:1,textDecoration:'none',padding:'11px',borderRadius:50,border:'0.5px solid rgba(131,122,221,0.4)',background:'rgba(131,122,221,0.15)',color:'#afa9ec',fontWeight:600,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center'}}>📞 Call</a>}
            </div>
            {item.email && (
              <a href={`mailto:${item.email}?subject=${emailSubject}&body=${emailBody}`} style={{width:'100%',textDecoration:'none',padding:'11px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:'transparent',color:'#c9a227',fontWeight:600,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:10,boxSizing:'border-box'}}>✉️ Email order to restaurant</a>
            )}
            <button style={{width:'100%',padding:'11px',fontSize:13,borderRadius:50,border:'1px solid rgba(226,75,74,0.4)',background:'rgba(226,75,74,0.08)',color:'#e24b4a',cursor:'pointer',fontWeight:600,marginBottom:10}} onClick={cancelOrder}>Cancel Order</button>
          </>
        )}
        <button style={styles.btnPrimary} onClick={onBack}>Back</button>
      </div>
    </div>
  );

  return (
    <div style={styles.app}>
      <div style={{position:'relative',flexShrink:0}}>
        <Img src={item.coverImg} alt={item.name} style={{width:'100%',height:200}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,0.3) 0%,transparent 50%,rgba(10,22,40,0.9) 100%)'}}/>
        <button onClick={onBack} style={{position:'absolute',top:14,left:14,background:'rgba(10,22,40,0.75)',border:'none',borderRadius:50,padding:'7px 13px',color:'#f0f4ff',fontSize:12,cursor:'pointer',zIndex:10}}>← Back</button>
        {cart.length>0&&<button onClick={()=>setShowCart(!showCart)} style={{position:'absolute',top:14,right:14,background:'rgba(201,162,39,0.9)',border:'none',borderRadius:50,padding:'7px 13px',color:'#0a1628',fontSize:12,fontWeight:700,cursor:'pointer',zIndex:10}}>🛒 {cart.length} · E{total}</button>}
        <div style={{position:'absolute',bottom:12,left:14,zIndex:10}}>
          <div style={{fontSize:18,fontWeight:700,color:'#fff',textShadow:'0 2px 8px rgba(0,0,0,0.9)'}}>{item.name}</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.85)'}}>📍 {item.region} · ⭐ {item.rating} · {item.hours}</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:16}}>
        <div style={{display:'flex',gap:8,marginBottom:14}}>
          <a href={dirUrl} target="_blank" rel="noreferrer" style={{flex:1,textDecoration:'none',padding:'9px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.35)',background:'rgba(201,162,39,0.08)',color:'#c9a227',fontWeight:600,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>🧭 {t.getDir}</a>
          {item.phone && <a href={`tel:${item.phone.replace(/\s/g,'')}`} style={{flex:1,textDecoration:'none',padding:'9px',borderRadius:50,border:'0.5px solid rgba(131,122,221,0.35)',background:'rgba(131,122,221,0.1)',color:'#afa9ec',fontWeight:600,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>📞 Call</a>}
          {item.email && <a href={`mailto:${item.email}`} style={{flex:1,textDecoration:'none',padding:'9px',borderRadius:50,border:'0.5px solid rgba(93,202,165,0.35)',background:'rgba(93,202,165,0.1)',color:'#5dcaa5',fontWeight:600,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>✉️ Email</a>}
        </div>
        {showCart&&cart.length>0&&(
          <div style={{background:'rgba(201,162,39,0.08)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:14,padding:14,marginBottom:14}}>
            <div style={{fontSize:14,fontWeight:600,color:'#c9a227',marginBottom:10}}>🛒 {t.cart}</div>
            {cart.map(c=>(
              <div key={c.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5,fontSize:13,color:'#f0f4ff'}}>
                <span>{c.name}</span>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <button onClick={()=>removeFromCart(c)} style={{width:22,height:22,borderRadius:'50%',border:'0.5px solid rgba(201,162,39,0.4)',background:'transparent',color:'#c9a227',cursor:'pointer',fontSize:13,lineHeight:1}}>−</button>
                  <span>{c.qty}</span>
                  <button onClick={()=>addToCart(c)} style={{width:22,height:22,borderRadius:'50%',border:'0.5px solid rgba(201,162,39,0.4)',background:'transparent',color:'#c9a227',cursor:'pointer',fontSize:13,lineHeight:1}}>+</button>
                  <span style={{color:'#c9a227',minWidth:56,textAlign:'right'}}>E {c.price*c.qty}</span>
                </div>
              </div>
            ))}
            <div style={{borderTop:'0.5px solid rgba(255,255,255,0.1)',marginTop:8,paddingTop:8,fontSize:14,fontWeight:700,color:'#c9a227',display:'flex',justifyContent:'space-between'}}>
              <span>Total:</span><span>E {total}</span>
            </div>

            <div style={{fontSize:12,color:'#8fa3c4',marginTop:12,marginBottom:6}}>Are you staying or taking away?</div>
            <div style={{display:'flex',gap:8,marginBottom:10}}>
              <button onClick={()=>setDiningMode('dinein')} style={{flex:1,padding:'9px',borderRadius:10,border:diningMode==='dinein'?'1.5px solid #c9a227':'0.5px solid rgba(201,162,39,0.3)',background:diningMode==='dinein'?'rgba(201,162,39,0.18)':'transparent',color:diningMode==='dinein'?'#c9a227':'#8fa3c4',fontSize:12,fontWeight:600,cursor:'pointer'}}>🍽️ Dine-in</button>
              <button onClick={()=>setDiningMode('takeaway')} style={{flex:1,padding:'9px',borderRadius:10,border:diningMode==='takeaway'?'1.5px solid #c9a227':'0.5px solid rgba(201,162,39,0.3)',background:diningMode==='takeaway'?'rgba(201,162,39,0.18)':'transparent',color:diningMode==='takeaway'?'#c9a227':'#8fa3c4',fontSize:12,fontWeight:600,cursor:'pointer'}}>🥡 Takeaway</button>
            </div>

            {diningMode && (
              <input value={tableNum} onChange={e=>setTableNum(e.target.value)} placeholder={diningMode==='dinein'?t.tableNum:'Phone number for pickup'} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'9px',color:'#f0f4ff',fontSize:12,outline:'none',marginTop:2,boxSizing:'border-box'}}/>
            )}
            <button style={{...styles.btnPrimary,marginTop:10}} onClick={placeOrder}>{t.placeOrder}</button>
          </div>
        )}
        {item.menu.map(cat=>(
          <div key={cat.category} style={{marginBottom:18}}>
            <div style={{fontSize:14,fontWeight:700,color:'#c9a227',marginBottom:10,borderBottom:'0.5px solid rgba(201,162,39,0.2)',paddingBottom:6}}>{cat.category}</div>
            {cat.items.map(mi=>(
              <div key={mi.name} style={{display:'flex',gap:12,padding:'10px 0',borderBottom:'0.5px solid rgba(255,255,255,0.04)',alignItems:'center'}}>
                <Img src={mi.img} alt={mi.name} style={{width:70,height:60,borderRadius:10,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{mi.name}</div>
                  <div style={{fontSize:11,color:'#8fa3c4',marginTop:2,lineHeight:1.4}}>{mi.desc}</div>
                  <div style={{fontSize:13,color:'#c9a227',marginTop:4,fontWeight:600}}>E {mi.price}</div>
                </div>
                <button onClick={()=>addToCart(mi)} style={{padding:'7px 13px',borderRadius:50,background:'linear-gradient(135deg,#c9a227,#e8b93a)',border:'none',color:'#0a1628',fontSize:12,fontWeight:700,cursor:'pointer',flexShrink:0}}>+ {t.addToCart}</button>
              </div>
            ))}
          </div>
        ))}
        <Reviews name={item.name} t={t}/>
      </div>
    </div>
  );
}

// ── HOTEL DETAIL WITH ROOM PHOTOS ─────────────────────────
function HotelDetail({item,onBack,t}) {
  const {user,requireAuth} = useAuth();
  const [showBooking,setShowBooking] = useState(false);
  const [checkIn,setCheckIn]   = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [guests,setGuests]     = useState('2');
  const [guestName,setGuestName] = useState('');
  const [selRoom,setSelRoom]   = useState(null);
  const [confirmed,setConfirmed] = useState(null);

  useEffect(()=>{
    if(user) setGuestName(user.user_metadata?.full_name || user.email || '');
  },[user]);

  const dirUrl = item.lat&&item.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address||item.name)}`;

  const confirmBooking = ()=>{
    if(!checkIn||!checkOut) return alert('Please fill in all dates');
    requireAuth('Sign in to confirm your booking and manage it later.', ()=>{
    const code = genOrderCode(item);
    const roomName = selRoom||(item.rooms[0]&&item.rooms[0].name);
    setConfirmed({code,room:roomName,checkIn,checkOut,guests});
    setShowBooking(false);
    supabase.from('bookings').insert({
      booking_code: code,
      property_name: item.name,
      property_type: item.category||'Hotel',
      check_in: checkIn,
      check_out: checkOut,
      guests: parseInt(guests)||1,
      device_id: getDeviceId(),
      user_id: user.id,
      guest_name: guestName,
    }).then(({error})=>{ if(error) console.error('Booking save failed:', error.message); });
    });
  };
  const cancelBooking = ()=>{
    if(!window.confirm('Cancel this booking? The property will be notified.')) return;
    supabase.from('bookings').update({status:'cancelled'}).eq('booking_code', confirmed.code)
      .then(({error})=>{ if(error) console.error('Cancel update failed:', error.message); });
    setConfirmed(null);
  };

  if(confirmed) return (
    <div style={styles.app}>
      <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',alignItems:'center',padding:28,textAlign:'center'}}>
        <div style={{fontSize:60,marginBottom:14}}>✅</div>
        <div style={{fontSize:20,fontWeight:700,color:'#5dcaa5',marginBottom:6}}>Booking Confirmed!</div>
        <div style={{fontSize:13,color:'#8fa3c4',lineHeight:1.6,marginBottom:16}}>
          {item.name} · {confirmed.room}<br/>
          {confirmed.checkIn} → {confirmed.checkOut} · {confirmed.guests} guest(s)
        </div>
        <div style={{background:'rgba(201,162,39,0.12)',border:'1px solid rgba(201,162,39,0.5)',borderRadius:14,padding:'14px 20px',marginBottom:16,width:'100%'}}>
          <div style={{fontSize:11,color:'#8fa3c4',marginBottom:4}}>SHOW THIS CODE AT CHECK-IN AS PROOF OF BOOKING</div>
          <div style={{fontSize:28,fontWeight:800,color:'#c9a227',letterSpacing:2}}>{confirmed.code}</div>
        </div>
        <div style={{display:'flex',gap:8,width:'100%',marginBottom:10}}>
          <a href={dirUrl} target="_blank" rel="noreferrer" style={{...styles.btnPrimary,flex:1,textDecoration:'none',display:'flex',alignItems:'center',justifyContent:'center'}}>🧭 {t.getDir}</a>
          {item.phone && <a href={`tel:${item.phone.replace(/\s/g,'')}`} style={{flex:1,textDecoration:'none',padding:'11px',borderRadius:50,border:'0.5px solid rgba(131,122,221,0.4)',background:'rgba(131,122,221,0.15)',color:'#afa9ec',fontWeight:600,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center'}}>📞 Call</a>}
        </div>
        {item.email && <a href={`mailto:${item.email}?subject=${encodeURIComponent('Booking '+confirmed.code+' – '+item.name)}&body=${encodeURIComponent('Booking code: '+confirmed.code+'\nRoom: '+confirmed.room+'\nCheck-in: '+confirmed.checkIn+'\nCheck-out: '+confirmed.checkOut+'\nGuests: '+confirmed.guests)}`} style={{width:'100%',textDecoration:'none',padding:'11px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:'transparent',color:'#c9a227',fontWeight:600,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:10,boxSizing:'border-box'}}>✉️ Email booking</a>}
        <button style={{width:'100%',padding:'11px',fontSize:13,borderRadius:50,border:'1px solid rgba(226,75,74,0.4)',background:'rgba(226,75,74,0.08)',color:'#e24b4a',cursor:'pointer',fontWeight:600,marginBottom:10}} onClick={cancelBooking}>Cancel Booking</button>
        <button style={styles.btnPrimary} onClick={onBack}>Back</button>
      </div>
    </div>
  );

  return (
    <div style={styles.app}>
      <div style={{position:'relative',flexShrink:0}}>
        <Slideshow images={item.gallery} height={240}/>
        <button onClick={onBack} style={{position:'absolute',top:14,left:14,background:'rgba(10,22,40,0.75)',border:'none',borderRadius:50,padding:'7px 13px',color:'#f0f4ff',fontSize:12,cursor:'pointer',zIndex:10}}>← Back</button>
        <div style={{position:'absolute',top:14,right:14,display:'flex',gap:6,zIndex:10}}>
          {item.category && <div style={{background:'rgba(131,122,221,0.9)',borderRadius:20,padding:'3px 10px',fontSize:10,fontWeight:700,color:'#fff'}}>{item.category}</div>}
          <div style={{background:'rgba(201,162,39,0.9)',borderRadius:20,padding:'3px 10px',fontSize:11,color:'#0a1628'}}>{item.stars}</div>
        </div>
        <div style={{position:'absolute',bottom:12,left:14,zIndex:10}}>
          <div style={{fontSize:18,fontWeight:700,color:'#fff',textShadow:'0 2px 8px rgba(0,0,0,0.9)'}}>{item.name}</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.85)'}}>📍 {item.region} · ⭐ {item.rating}</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:16}}>
        <div style={{display:'flex',gap:8,marginBottom:12}}>
          <a href={dirUrl} target="_blank" rel="noreferrer" style={{flex:1,textDecoration:'none',padding:'9px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.35)',background:'rgba(201,162,39,0.08)',color:'#c9a227',fontWeight:600,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>🧭 {t.getDir}</a>
          {item.phone && <a href={`tel:${item.phone.replace(/\s/g,'')}`} style={{flex:1,textDecoration:'none',padding:'9px',borderRadius:50,border:'0.5px solid rgba(131,122,221,0.35)',background:'rgba(131,122,221,0.1)',color:'#afa9ec',fontWeight:600,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>📞 Call</a>}
          {item.booking && <a href={item.booking} target="_blank" rel="noreferrer" style={{flex:1,textDecoration:'none',padding:'9px',borderRadius:50,border:'0.5px solid rgba(93,202,165,0.35)',background:'rgba(93,202,165,0.1)',color:'#5dcaa5',fontWeight:600,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>🔗 Booking site</a>}
        </div>
        <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
          <div style={styles.badge}>⭐ {item.rating}</div>
          <div style={{...styles.badge,color:'#5dcaa5',borderColor:'rgba(29,158,117,0.3)',background:'rgba(29,158,117,0.1)'}}>{item.price}</div>
        </div>
        <div style={{fontSize:13,color:'#b0c4de',lineHeight:1.8,marginBottom:14}}>{item.desc}</div>
        <div style={{fontSize:13,color:'#c9a227',fontWeight:600,marginBottom:10}}>{t.amenities}</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:16}}>
          {item.amenities.map(a=><span key={a} style={styles.tag}>{a}</span>)}
        </div>
        <div style={{fontSize:13,color:'#c9a227',fontWeight:600,marginBottom:10}}>{t.rooms}</div>
        {item.rooms.map(r=>(
          <div key={r.name} onClick={()=>setSelRoom(selRoom===r.name?null:r.name)} style={{display:'flex',gap:12,alignItems:'center',padding:'10px 0',borderBottom:'0.5px solid rgba(255,255,255,0.05)',cursor:'pointer'}}>
            <Img src={r.img} alt={r.name} style={{width:80,height:65,borderRadius:10,flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{r.name}</div>
              <div style={{fontSize:13,color:'#c9a227',marginTop:3,fontWeight:600}}>{r.price} / night</div>
            </div>
            <button style={{padding:'7px 13px',borderRadius:50,background:'linear-gradient(135deg,#c9a227,#e8b93a)',border:'none',color:'#0a1628',fontSize:11,fontWeight:700,cursor:'pointer',flexShrink:0}} onClick={(e)=>{e.stopPropagation();setSelRoom(r.name);setShowBooking(true);}}>{t.bookNow}</button>
          </div>
        ))}
        {showBooking&&(
          <div style={{background:'rgba(201,162,39,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:14,padding:16,marginTop:14,marginBottom:14}}>
            <div style={{fontSize:14,fontWeight:600,color:'#c9a227',marginBottom:14}}>📅 {t.bookNow}{selRoom?' — '+selRoom:''}</div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:'#8fa3c4',marginBottom:5}}>Name for this booking</div>
              <input type="text" value={guestName} onChange={e=>setGuestName(e.target.value)} placeholder="Sign in to auto-fill your name" style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px 14px',color:'#f0f4ff',fontSize:13,outline:'none',boxSizing:'border-box'}}/>
            </div>
            {[[t.checkIn,checkIn,setCheckIn,'date'],[t.checkOut,checkOut,setCheckOut,'date'],[t.guests,guests,setGuests,'number']].map(([label,val,setter,type])=>(
              <div key={label} style={{marginBottom:12}}>
                <div style={{fontSize:11,color:'#8fa3c4',marginBottom:5}}>{label}</div>
                <input type={type} value={val} onChange={e=>setter(e.target.value)} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px 14px',color:'#f0f4ff',fontSize:13,outline:'none',boxSizing:'border-box'}}/>
              </div>
            ))}
            <button style={{...styles.btnPrimary,marginBottom:8}} onClick={confirmBooking}>{t.confirmBooking}</button>
            <button style={{width:'100%',padding:'10px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:'transparent',color:'#8fa3c4',cursor:'pointer',fontSize:13}} onClick={()=>setShowBooking(false)}>{t.cancel}</button>
          </div>
        )}
        <Reviews name={item.name} t={t}/>
      </div>
    </div>
  );
}

// ── STORE DETAIL ──────────────────────────────────────────
function StoreDetail({item,onBack,t}) {
  return (
    <div style={styles.app}>
      <div style={{position:'relative',flexShrink:0}}>
        <Slideshow images={item.gallery} height={220}/>
        <button onClick={onBack} style={{position:'absolute',top:14,left:14,background:'rgba(10,22,40,0.75)',border:'none',borderRadius:50,padding:'7px 13px',color:'#f0f4ff',fontSize:12,cursor:'pointer',zIndex:10}}>← Back</button>
        <div style={{position:'absolute',bottom:12,left:14,zIndex:10}}>
          <div style={{fontSize:18,fontWeight:700,color:'#fff',textShadow:'0 2px 8px rgba(0,0,0,0.9)'}}>{item.name}</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.85)'}}>📍 {item.region} · ⭐ {item.rating}</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:16}}>
        <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
          <div style={styles.badge}>{item.type}</div>
          <div style={{...styles.badge,color:'#5dcaa5',borderColor:'rgba(29,158,117,0.3)',background:'rgba(29,158,117,0.1)'}}>{item.price}</div>
        </div>
        <div style={{fontSize:13,color:'#b0c4de',lineHeight:1.8,marginBottom:16}}>{item.desc}</div>
        <div style={styles.sectionTitle}>{t.photos}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
          {item.gallery.map((img,i)=><Img key={i} src={img} alt="" style={{height:120,borderRadius:12}}/>)}
        </div>
        <Reviews name={item.name} t={t}/>
        <button style={{...styles.btnPrimary,marginBottom:20}} onClick={()=>window.open('https://www.google.com/maps/search/'+encodeURIComponent(item.name)+'+Eswatini','_blank')}>🗺️ {t.getDir}</button>
      </div>
    </div>
  );
}

// ── WEATHER ───────────────────────────────────────────────
function WeatherMiniCard({t,onClick}) {
  const [data,setData] = useState(null);
  const today = new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});

  useEffect(()=>{
    fetch('/api/weather?city=Mbabane')
      .then(r=>r.json())
      .then(d=>{
        if(d.main) setData({
          temp: Math.round(d.main.temp),
          desc: d.weather[0].description,
          city: d.name,
          icon: d.weather[0].main==='Rain'?'🌧️':d.weather[0].main==='Clouds'?'⛅':d.weather[0].main==='Thunderstorm'?'🌩️':'☀️',
        });
      }).catch(()=>{});
  },[]);

  return (
    <div onClick={onClick} style={{background:'linear-gradient(135deg,rgba(24,95,165,0.25),rgba(24,95,165,0.1))',border:'0.5px solid rgba(24,95,165,0.4)',borderRadius:14,padding:'12px 14px',marginBottom:13,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <div>
        <div style={{fontSize:10,color:'#5dcaa5',fontWeight:600,marginBottom:2}}>🟢 Live Weather · {today}</div>
        <div style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{data?`${data.icon} ${data.city} · ${data.temp}°C`:'Loading weather...'}</div>
        <div style={{fontSize:11,color:'#8fa3c4',marginTop:2,textTransform:'capitalize'}}>{data?.desc||''}</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
        <div style={{fontSize:28}}>{data?.icon||'⏳'}</div>
        <div style={{fontSize:9,color:'#c9a227',fontWeight:600}}>Tap for forecast →</div>
      </div>
    </div>
  );
}
function WeatherWidget({t}) {
  const [sel,setSel] = useState(null);
  const [liveWeather,setLiveWeather] = useState({});
  const [forecast,setForecast] = useState([]);
  const [searchCity,setSearchCity] = useState('');
  const [searching,setSearching] = useState(false);
  const [cities,setCities] = useState(['Mbabane','Manzini','Siteki']);
  const [locating,setLocating] = useState(false);

  // Get day name from date
  const getDayName = (date)=>{
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return days[date.getDay()];
  };

  // Today's full date
  const today = new Date().toLocaleDateString('en-GB',{
    weekday:'long',day:'numeric',month:'long',year:'numeric'
  });

  const getIcon = (main)=>{
    if(main==='Rain') return '🌧️';
    if(main==='Thunderstorm') return '🌩️';
    if(main==='Drizzle') return '🌦️';
    if(main==='Clouds') return '⛅';
    if(main==='Snow') return '❄️';
    return '☀️';
  };

  const fetchWeather = (city, lat, lon)=>{
    const params = lat&&lon ? `lat=${lat}&lon=${lon}` : `city=${encodeURIComponent(city)}`;
    
    // Current weather
    fetch(`/api/weather?${params}`)
      .then(r=>r.json())
      .then(d=>{
        if(d.main){
          const name = d.name;
          setLiveWeather(prev=>({...prev,[name]:{
            temp: Math.round(d.main.temp),
            desc: d.weather[0].description,
            humidity: d.main.humidity+'%',
            wind: Math.round(d.wind.speed*3.6)+' km/h',
            feelsLike: Math.round(d.main.feels_like),
            icon: getIcon(d.weather[0].main),
            country: d.sys.country,
            lat: d.coord.lat,
            lon: d.coord.lon,
            live: true,
          }}));
          setCities(prev=>prev.includes(name)?prev:[...prev,name]);
          setSel(name);

          // Fetch 7-day forecast
          fetch(`/api/weather?${params}&type=forecast`)
            .then(r=>r.json())
            .then(f=>{
              if(f.list){
                // Get one entry per day (noon readings)
                const days = [];
                const seen = new Set();
                f.list.forEach(item=>{
                  const date = new Date(item.dt*1000);
                  const dayKey = date.toDateString();
                  if(!seen.has(dayKey)){
                    seen.add(dayKey);
                    days.push({
                      day: getDayName(date),
                      date: date.toLocaleDateString('en-GB',{day:'numeric',month:'short'}),
                      temp: Math.round(item.main.temp),
                      min: Math.round(item.main.temp_min),
                      max: Math.round(item.main.temp_max),
                      desc: item.weather[0].description,
                      icon: getIcon(item.weather[0].main),
                      isToday: date.toDateString()===new Date().toDateString(),
                    });
                  }
                });
                setForecast(days.slice(0,7));
              }
            }).catch(()=>{});
        } else {
          alert('Location not found. Try another name!');
        }
        setSearching(false);
        setLocating(false);
      }).catch(()=>{setSearching(false);setLocating(false);});
  };

  // Load default cities on mount
  useEffect(()=>{
    ['Mbabane','Manzini','Siteki'].forEach(c=>fetchWeather(c));
  },[]); // eslint-disable-line

  // Get user's live GPS location
  const getMyLocation = ()=>{
    if(!navigator.geolocation){alert('GPS not supported');return;}
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      p=>fetchWeather('',p.coords.latitude,p.coords.longitude),
      ()=>{setLocating(false);alert('Could not get location');}
    );
  };

  const handleSearch = ()=>{
    if(!searchCity.trim()) return;
    setSearching(true);
    fetchWeather(searchCity.trim());
    setSearchCity('');
  };

  const selectedData = sel ? liveWeather[sel] : null;

  return (
    <div style={{marginBottom:16}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:2}}>
        <div style={styles.sectionTitle}>{t.weather}</div>
        <div style={{fontSize:10,color:'#5dcaa5'}}>🟢 Live</div>
      </div>
      <div style={{fontSize:11,color:'#c9a227',fontWeight:600,marginBottom:10}}>📅 {today}</div>

      {/* Search bar */}
      <div style={{display:'flex',gap:8,marginBottom:10}}>
        <input
          value={searchCity}
          onChange={e=>setSearchCity(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&handleSearch()}
          placeholder="Search any town or village in Eswatini..."
          style={{flex:1,background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'9px 12px',color:'#f0f4ff',fontSize:12,outline:'none'}}
        />
        <button onClick={handleSearch} disabled={searching} style={{padding:'9px 12px',borderRadius:10,background:'linear-gradient(135deg,#c9a227,#e8b93a)',border:'none',color:'#0a1628',fontSize:13,fontWeight:700,cursor:'pointer'}}>
          {searching?'…':'🔍'}
        </button>
        <button onClick={getMyLocation} disabled={locating} style={{padding:'9px 12px',borderRadius:10,border:'0.5px solid rgba(29,158,117,0.4)',background:'rgba(29,158,117,0.12)',color:'#5dcaa5',fontSize:13,cursor:'pointer'}}>
          {locating?'…':'📍'}
        </button>
      </div>

      {/* City pills */}
      <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:6,scrollbarWidth:'none',marginBottom:12}}>
        {cities.map(c=>(
          <div key={c} onClick={()=>setSel(c)} style={{flexShrink:0,minWidth:80,background:sel===c?'rgba(201,162,39,0.18)':'rgba(24,95,165,0.12)',border:sel===c?'1px solid #c9a227':'0.5px solid rgba(24,95,165,0.3)',borderRadius:12,padding:'8px 6px',textAlign:'center',cursor:'pointer',transition:'all 0.2s'}}>
            <div style={{fontSize:18}}>{liveWeather[c]?.icon||'⏳'}</div>
            <div style={{fontSize:15,fontWeight:700,color:'#f0f4ff',marginTop:2}}>{liveWeather[c]?liveWeather[c].temp+'°C':'--'}</div>
            <div style={{fontSize:9,color:sel===c?'#c9a227':'#8fa3c4',fontWeight:600,marginTop:1}}>{c}</div>
          </div>
        ))}
      </div>

      {/* Current weather detail */}
      {selectedData&&(
        <div style={{background:'rgba(24,95,165,0.15)',border:'0.5px solid rgba(24,95,165,0.4)',borderRadius:14,padding:14,marginBottom:12}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:'#f0f4ff'}}>{selectedData.icon} {sel}</div>
              <div style={{fontSize:11,color:'#8fa3c4',marginTop:2,textTransform:'capitalize'}}>{selectedData.desc}</div>
              <div style={{fontSize:10,color:'#5dcaa5',marginTop:2}}>🟢 Live · {today.split(',')[0]}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:40,fontWeight:700,color:'#c9a227'}}>{selectedData.temp}°C</div>
              <div style={{fontSize:10,color:'#8fa3c4'}}>Feels {selectedData.feelsLike}°C</div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            {[['💧 Humidity',selectedData.humidity],['💨 Wind',selectedData.wind]].map(([lbl,val])=>(
              <div key={lbl} style={{background:'rgba(255,255,255,0.06)',borderRadius:10,padding:'8px',textAlign:'center'}}>
                <div style={{fontSize:11,color:'#8fa3c4'}}>{lbl}</div>
                <div style={{fontSize:13,fontWeight:700,color:'#c9a227',marginTop:2}}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7-day forecast starting from TODAY */}
      {forecast.length>0&&(
        <div>
          <div style={{fontSize:12,fontWeight:600,color:'#f0f4ff',marginBottom:8}}>7-Day Forecast</div>
          <div style={{display:'flex',gap:7,overflowX:'auto',paddingBottom:6,scrollbarWidth:'none'}}>
            {forecast.map((f,i)=>(
              <div key={i} style={{flexShrink:0,minWidth:70,background:f.isToday?'rgba(201,162,39,0.15)':'rgba(255,255,255,0.04)',border:f.isToday?'1px solid rgba(201,162,39,0.5)':'0.5px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'10px 6px',textAlign:'center'}}>
                <div style={{fontSize:10,fontWeight:700,color:f.isToday?'#c9a227':'#8fa3c4'}}>{f.isToday?'TODAY':f.day.toUpperCase()}</div>
                <div style={{fontSize:9,color:'#5f7a9a',marginBottom:4}}>{f.date}</div>
                <div style={{fontSize:20}}>{f.icon}</div>
                <div style={{fontSize:13,fontWeight:700,color:'#f0f4ff',marginTop:4}}>{f.temp}°C</div>
                <div style={{fontSize:9,color:'#8fa3c4',marginTop:2}}>{f.max}° / {f.min}°</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── CURRENCY ──────────────────────────────────────────────
function CurrencyWidget({t}) {
  const [amount,setAmount] = useState('100');
  const [from,setFrom]     = useState('USD');
  const result = amount?(parseFloat(amount)*RATES[from]).toFixed(2):'0.00';
  return (
    <div style={{background:'rgba(201,162,39,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:14,padding:14,marginBottom:16}}>
      <div style={styles.sectionTitle}>{t.currency}</div>
      <div style={{fontSize:11,color:'#8fa3c4',marginBottom:10}}>Any Currency → Eswatini Lilangeni (SZL / Emalangeni)</div>
      <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:12}}>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={{flex:1,background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px 12px',color:'#f0f4ff',fontSize:16,fontWeight:700,outline:'none'}} placeholder="Amount"/>
        <select value={from} onChange={e=>setFrom(e.target.value)} style={{background:'#0f2040',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px 10px',color:'#c9a227',fontSize:13,fontWeight:600,outline:'none',cursor:'pointer'}}>
          {Object.keys(RATES).map(k=><option key={k} value={k}>{k}</option>)}
        </select>
      </div>
      <div style={{background:'rgba(201,162,39,0.1)',borderRadius:10,padding:'12px 14px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:12,color:'#8fa3c4'}}>{amount||'0'} {from} =</span>
        <span style={{fontSize:21,fontWeight:700,color:'#c9a227'}}>E {result} SZL</span>
      </div>
      <div style={{fontSize:9,color:'#8fa3c4',marginTop:6,textAlign:'center'}}>SZL = Emalangeni · Official currency of Eswatini</div>
    </div>
  );
}

// ── TRANSLATE TAB ─────────────────────────────────────────
function TranslateTab({t,lang}) {
  const [input,setInput]   = useState('');
  const [toLang,setToLang] = useState('ss');
  const [result,setResult] = useState('');
  const [speaking,setSpeaking] = useState(false);
  const words = {
    hello:{ss:'Sawubona',zu:'Sawubona',af:'Hallo',pt:'Ola',fr:'Bonjour',de:'Hallo',zh:'你好',ar:'مرحبا'},
    hi:{ss:'Sawubona',zu:'Sawubona',af:'Hallo',pt:'Oi',fr:'Salut',de:'Hallo',zh:'嗨',ar:'مرحبا'},
    yes:{ss:'Yebo',zu:'Yebo',af:'Ja',pt:'Sim',fr:'Oui',de:'Ja',zh:'是',ar:'نعم'},
    no:{ss:'Cha',zu:'Cha',af:'Nee',pt:'Nao',fr:'Non',de:'Nein',zh:'不',ar:'لا'},
    sorry:{ss:'Ngiyaxolisa',zu:'Ngiyaxolisa',af:'Jammer',pt:'Desculpe',fr:'Desole',de:'Entschuldigung',zh:'对不起',ar:'آسف'},
    welcome:{ss:'Siyakemukela',zu:'Siyakwamukela',af:'Welkom',pt:'Bem-vindo',fr:'Bienvenue',de:'Willkommen',zh:'欢迎',ar:'مرحبا'},
    please:{ss:'Ngicela',zu:'Ngicela',af:'Asseblief',pt:'Por favor',fr:'Sil vous plait',de:'Bitte',zh:'请',ar:'من فضلك'},
    money:{ss:'Imali',zu:'Imali',af:'Geld',pt:'Dinheiro',fr:'Argent',de:'Geld',zh:'钱',ar:'مال'},
    beautiful:{ss:'Kuhle',zu:'Kuhle',af:'Mooi',pt:'Bonito',fr:'Beau',de:'Schon',zh:'美丽',ar:'جميل'},
    water:{ss:'Emanti',zu:'Amanzi',af:'Water',pt:'Agua',fr:'Eau',de:'Wasser',zh:'水',ar:'ماء'},
    food:{ss:'Kudla',zu:'Ukudla',af:'Kos',pt:'Comida',fr:'Nourriture',de:'Essen',zh:'食物',ar:'طعام'},
    help:{ss:'Lusito',zu:'Usizo',af:'Hulp',pt:'Ajuda',fr:'Aide',de:'Hilfe',zh:'帮助',ar:'مساعدة'},
    'thank you':{ss:'Ngiyabonga',zu:'Ngiyabonga',af:'Dankie',pt:'Obrigado',fr:'Merci',de:'Danke',zh:'谢谢',ar:'شكرا'},
    goodbye:{ss:'Sala kahle',zu:'Sala kahle',af:'Totsiens',pt:'Adeus',fr:'Au revoir',de:'Auf Wiedersehen',zh:'再见',ar:'وداعا'},
    eswatini:{ss:'eSwatini',zu:'eSwatini',af:'Eswatini',pt:'Eswatini',fr:'Eswatini',de:'Eswatini',zh:'斯威士兰',ar:'اسواتيني'},
  };
  const translate = ()=>{
    if(!input.trim()) return;
    const lower = input.toLowerCase().trim();
    const pKey = Object.keys(PHRASES).find(k=>k.toLowerCase()===lower);
    if(pKey&&PHRASES[pKey][toLang]){setResult(PHRASES[pKey][toLang]);return;}
    if(words[lower]&&words[lower][toLang]){setResult(words[lower][toLang]);return;}
    setResult('Translation coming soon. Try the phrases below!');
  };
  const speak = txt=>{
    if('speechSynthesis' in window){
      window.speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(txt);
      u.onstart=()=>setSpeaking(true); u.onend=()=>setSpeaking(false);
      window.speechSynthesis.speak(u);
    }
  };
  return (
    <div>
      <div style={styles.sectionTitle}>{t.translate} 🌐</div>
      <div style={{fontSize:11,color:'#8fa3c4',marginBottom:14}}>Translate words and phrases for your Eswatini journey</div>
      <div style={{display:'flex',gap:10,marginBottom:12,alignItems:'center'}}>
        <div style={{flex:1,padding:'10px 12px',borderRadius:10,border:'0.5px solid rgba(201,162,39,0.3)',background:'rgba(255,255,255,0.04)',color:'#8fa3c4',fontSize:12}}>{T[lang].flag} {T[lang].name}</div>
        <span style={{color:'#c9a227',fontSize:18,fontWeight:700}}>→</span>
        <select value={toLang} onChange={e=>setToLang(e.target.value)} style={{flex:1,background:'#0f2040',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px',color:'#c9a227',fontSize:12,outline:'none',cursor:'pointer'}}>
          {Object.entries(T).map(([code,data])=><option key={code} value={code}>{data.flag} {data.name}</option>)}
        </select>
      </div>
      <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a word or phrase..." rows={3} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:12,padding:'12px 14px',color:'#f0f4ff',fontSize:14,outline:'none',resize:'none',fontFamily:'inherit',boxSizing:'border-box',marginBottom:10}}/>
      <button style={{...styles.btnPrimary,marginBottom:14}} onClick={translate}>Translate →</button>
      {result&&(
        <div style={{background:'rgba(83,74,183,0.15)',border:'0.5px solid rgba(131,122,221,0.3)',borderRadius:12,padding:16,marginBottom:16}}>
          <div style={{fontSize:10,color:'#8fa3c4',marginBottom:5}}>{T[toLang].flag} {T[toLang].name}:</div>
          <div style={{fontSize:22,fontWeight:600,color:'#f0f4ff',marginBottom:12}}>{result}</div>
          <button onClick={()=>speak(result)} style={{padding:'7px 16px',borderRadius:50,border:'0.5px solid rgba(131,122,221,0.4)',background:speaking?'rgba(131,122,221,0.3)':'rgba(131,122,221,0.15)',color:'#afa9ec',cursor:'pointer',fontSize:11}}>
            {speaking?'🔊 Speaking...':'🔊 Hear Pronunciation'}
          </button>
        </div>
      )}
      <div style={styles.sectionTitle}>Common Phrases</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
        {Object.entries(PHRASES).map(([phrase,trans])=>(
          <div key={phrase} onClick={()=>{setInput(phrase);setResult(trans[toLang]||trans['ss']||phrase);}} style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:10,padding:'9px 11px',cursor:'pointer'}}>
            <div style={{fontSize:12,fontWeight:600,color:'#f0f4ff',marginBottom:2}}>{phrase}</div>
            <div style={{fontSize:11,color:'#c9a227'}}>{trans['ss']}</div>
          </div>
        ))}
      </div>
      <div style={styles.sectionTitle}>siSwati Essentials 🇸🇿</div>
      {[['Sawubona','Hello / I see you'],['Ngiyabonga','Thank you'],['Yebo','Yes'],['Cha','No'],['Sala kahle','Goodbye — stay well'],['Hamba kahle','Go well'],['Siyabonga','We thank you'],['Ngiyakuthanda','I love you'],['Incaba','Fortress / Hidden treasure'],['Eswatini','The Kingdom of Eswatini']].map(([ss,en])=>(
        <div key={ss} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'0.5px solid rgba(255,255,255,0.05)'}}>
          <div style={{fontSize:14,fontWeight:600,color:'#c9a227'}}>{ss}</div>
          <div style={{fontSize:11,color:'#8fa3c4',flex:1,marginLeft:12}}>{en}</div>
          <button onClick={()=>speak(ss)} style={{padding:'3px 10px',borderRadius:20,border:'0.5px solid rgba(131,122,221,0.3)',background:'rgba(131,122,221,0.1)',color:'#afa9ec',cursor:'pointer',fontSize:11}}>🔊</button>
        </div>
      ))}
    </div>
  );
}

// ── COMPARE TAB ───────────────────────────────────────────
function CompareTab({t,onSelectRestaurant,onSelectHotel,onSelectStore}) {
  const [cat,setCat] = useState('attractions');
  const data = {
    attractions:[
      {name:'Hlane Royal Reserve',price:'E 150',rating:4.9,type:'Wildlife',best:'Big 5 Safari',obj:places[0]},
      {name:'Mantenga Falls',price:'E 80',rating:4.8,type:'Nature',best:'Swimming and Hiking',obj:places[1]},
      {name:'Malolotja Reserve',price:'E 120',rating:4.8,type:'Nature',best:'Zipline and Hiking',obj:places[4]},
      {name:'Lobamba Village',price:'E 50',rating:4.7,type:'Culture',best:'Cultural Immersion',obj:places[2]},
      {name:'Sibebe Rock',price:'E 60',rating:4.5,type:'Adventure',best:'Panoramic Views',obj:places[5]},
      {name:'Swazi Candles',price:'Free',rating:4.6,type:'Culture',best:'Shopping',obj:places[3]},
    ],
    hotels:[
      {name:'Royal Swazi Spa',price:'E 1,800 plus',rating:4.9,type:'5 star',best:'Luxury',obj:hotels[0]},
      {name:'Mantengha Village',price:'E 600 plus',rating:4.7,type:'4 star',best:'Culture',obj:hotels[1]},
      {name:'Foresters Arms',price:'E 800 plus',rating:4.5,type:'4 star',best:'Countryside',obj:hotels[2]},
      {name:'Lidwala Backpacker',price:'E 150 plus',rating:4.3,type:'Budget',best:'Budget',obj:hotels[3]},
    ],
    restaurants:[
      {name:"Malandela's",price:'E 80 to 200',rating:4.8,type:'Traditional',best:'Authentic Swazi',obj:restaurants[0]},
      {name:"Tum's George",price:'E 120 to 300',rating:4.6,type:'Fine Dining',best:'Special Occasion',obj:restaurants[1]},
      {name:'Foresters Arms',price:'E 60 to 150',rating:4.4,type:'Pub',best:'Casual',obj:restaurants[2]},
      {name:'Gables Food Court',price:'E 40 to 120',rating:4.2,type:'Mixed',best:'Budget',obj:restaurants[3]},
    ],
    stores:[
      {name:'Swazi Candles',price:'E 50 to 500',rating:4.8,type:'Craft',best:'Gifts',obj:localStores[0]},
      {name:'Gone Rural',price:'E 100 to 2,000',rating:4.7,type:'Baskets',best:'Premium',obj:localStores[1]},
      {name:'Ngwenya Glass',price:'E 80 to 800',rating:4.6,type:'Glass Art',best:'Art',obj:localStores[2]},
      {name:'Manzini Market',price:'E 10 to 200',rating:4.3,type:'Market',best:'Budget',obj:localStores[3]},
    ],
  };
  const items = data[cat];
  return (
    <div>
      <div style={styles.sectionTitle}>{t.comparePrice}</div>
      <div style={{fontSize:11,color:'#8fa3c4',marginBottom:14}}>Compare prices across Eswatini — tap any item to browse</div>
      <div style={{display:'flex',gap:7,marginBottom:16,overflowX:'auto',scrollbarWidth:'none'}}>
        {[['attractions','Attractions'],['hotels','Hotels'],['restaurants','Restaurants'],['stores','Stores']].map(([c,l])=>(
          <button key={c} onClick={()=>setCat(c)} style={{flexShrink:0,padding:'7px 14px',borderRadius:20,border:cat===c?'1px solid #c9a227':'0.5px solid rgba(201,162,39,0.2)',background:cat===c?'rgba(201,162,39,0.15)':'transparent',color:cat===c?'#c9a227':'#8fa3c4',fontSize:12,cursor:'pointer',fontWeight:cat===c?600:400}}>{l}</button>
        ))}
      </div>
      {items.map((item,i)=>(
        <div key={i} onClick={()=>{
          if(cat==='restaurants'&&onSelectRestaurant) onSelectRestaurant(item.obj);
          else if(cat==='hotels'&&onSelectHotel) onSelectHotel(item.obj);
          else if(cat==='stores'&&onSelectStore) onSelectStore(item.obj);
        }} style={{display:'flex',gap:12,alignItems:'center',padding:'12px',background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:12,marginBottom:8,cursor:cat!=='attractions'?'pointer':'default'}}>
          <Img src={cat==='hotels'?item.obj.coverImg:cat==='restaurants'?item.obj.coverImg:item.obj.coverImg||item.obj.img} alt={item.name} style={{width:70,height:60,borderRadius:10,flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{item.name}</div>
            <div style={{fontSize:11,color:'#8fa3c4',marginTop:2}}>{item.type} · {item.best}</div>
            <div style={{display:'flex',gap:10,marginTop:5}}>
              <span style={{fontSize:11,color:'#5dcaa5'}}>{item.price}</span>
              <span style={{fontSize:11,color:'#c9a227'}}>⭐ {item.rating}</span>
            </div>
          </div>
          {cat!=='attractions'&&<span style={{color:'#c9a227',fontSize:16,flexShrink:0}}>›</span>}
        </div>
      ))}
      <div style={{background:'rgba(29,158,117,0.08)',border:'0.5px solid rgba(29,158,117,0.2)',borderRadius:12,padding:14,marginTop:8}}>
        <div style={{fontSize:12,fontWeight:600,color:'#5dcaa5',marginBottom:6}}>Best Value in Eswatini 💎</div>
        {cat==='attractions'&&<div style={{fontSize:11,color:'#8fa3c4',lineHeight:1.8}}>Best Overall: Hlane — Big 5 for E150{'\n'}Best Free: Swazi Candles{'\n'}Best Hidden: Malolotja — Zipline E120</div>}
        {cat==='hotels'&&<div style={{fontSize:11,color:'#8fa3c4',lineHeight:1.8}}>Best Luxury: Royal Swazi Spa{'\n'}Best Budget: Lidwala from E150{'\n'}Best Experience: Mantengha Cultural Village</div>}
        {cat==='restaurants'&&<div style={{fontSize:11,color:'#8fa3c4',lineHeight:1.8}}>Best Traditional: Malandela's{'\n'}Best Budget: Gables from E40{'\n'}Best Special Occasion: Tum's George</div>}
        {cat==='stores'&&<div style={{fontSize:11,color:'#8fa3c4',lineHeight:1.8}}>Most Unique: Swazi Candles{'\n'}Best Budget: Manzini Market from E10{'\n'}Best Quality: Gone Rural</div>}
      </div>
    </div>
  );
}

// ── EXPLORE TAB ───────────────────────────────────────────
function ExploreTab({onSelect,onVirtualTour,t}) {
  const [filter,setFilter] = useState('All');
  const cats = ['All','Wildlife','Nature','Culture','Adventure'];
  const filtered = filter==='All'?places:places.filter(p=>p.category===filter);
  return (
    <div>
      <div style={styles.sectionTitle}>{t.explore2} Eswatini 🇸🇿</div>
      <div style={{display:'flex',gap:7,overflowX:'auto',paddingBottom:8,marginBottom:14,scrollbarWidth:'none'}}>
        {cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{flexShrink:0,padding:'7px 15px',borderRadius:20,border:filter===c?'1px solid #c9a227':'0.5px solid rgba(201,162,39,0.2)',background:filter===c?'rgba(201,162,39,0.15)':'transparent',color:filter===c?'#c9a227':'#8fa3c4',fontSize:12,cursor:'pointer',fontWeight:filter===c?600:400}}>{c}</button>)}
      </div>
      {filtered.map(p=>(
        <div key={p.name} style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:14,overflow:'hidden',marginBottom:12}}>
          <div style={{position:'relative',height:170}}>
            <Img src={p.img} alt={p.name} style={{width:'100%',height:'100%'}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 40%,rgba(10,22,40,0.92) 100%)'}}/>
            <div style={{position:'absolute',top:10,right:10,background:'rgba(201,162,39,0.9)',borderRadius:20,padding:'3px 10px',fontSize:10,fontWeight:700,color:'#0a1628'}}>{p.category}</div>
            <div style={{position:'absolute',bottom:10,left:12}}>
              <div style={{fontSize:16,fontWeight:700,color:'#f0f4ff'}}>{p.name}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.8)'}}>📍 {p.region} · ⭐ {p.rating}</div>
            </div>
          </div>
          <div style={{padding:'12px 14px'}}>
            <div style={{fontSize:12,color:'#8fa3c4',lineHeight:1.6,marginBottom:10}}>{p.desc}</div>
            <div style={{display:'flex',gap:8}}>
              <button style={{flex:1,padding:'10px',borderRadius:50,background:'linear-gradient(135deg,#c9a227,#e8b93a)',border:'none',color:'#0a1628',fontSize:12,fontWeight:700,cursor:'pointer'}} onClick={()=>onSelect(p)}>View Details</button>
              <button style={{flex:1,padding:'10px',borderRadius:50,border:'0.5px solid rgba(131,122,221,0.4)',background:'rgba(131,122,221,0.15)',color:'#afa9ec',fontSize:12,cursor:'pointer'}} onClick={()=>onVirtualTour(p)}>🥽 {t.virtualTour}</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── ACCOMMODATION TAB (Hotels / Lodges / Guesthouses / Camping) ──
function AccommodationTab({onSelectHotel,t}) {
  const [filter,setFilter] = useState('All');
  const cats = ['All','Hotel','Lodge','Guesthouse','Camping'];
  const filtered = filter==='All' ? hotels : hotels.filter(h=>h.category===filter);
  return (
    <div>
      <div style={styles.sectionTitle}>🛏️ Accommodation</div>
      <div style={{fontSize:12,color:'#8fa3c4',marginBottom:12,lineHeight:1.6}}>Hotels, lodges, guesthouses and camping — with prices, photos and direct booking links.</div>
      <div style={{display:'flex',gap:7,overflowX:'auto',paddingBottom:8,marginBottom:14,scrollbarWidth:'none'}}>
        {cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{flexShrink:0,padding:'7px 15px',borderRadius:20,border:filter===c?'1px solid #c9a227':'0.5px solid rgba(201,162,39,0.2)',background:filter===c?'rgba(201,162,39,0.15)':'transparent',color:filter===c?'#c9a227':'#8fa3c4',fontSize:12,cursor:'pointer',fontWeight:filter===c?600:400}}>{c}</button>)}
      </div>
      {filtered.map(h=>(
        <div key={h.name} onClick={()=>onSelectHotel(h)} style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:14,overflow:'hidden',marginBottom:12,cursor:'pointer'}}>
          <div style={{position:'relative',height:160}}>
            <Img src={h.coverImg} alt={h.name} style={{width:'100%',height:'100%'}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 40%,rgba(10,22,40,0.92) 100%)'}}/>
            <div style={{position:'absolute',top:10,right:10,background:'rgba(131,122,221,0.9)',borderRadius:20,padding:'3px 10px',fontSize:10,fontWeight:700,color:'#fff'}}>{h.category}</div>
            <div style={{position:'absolute',bottom:10,left:12}}>
              <div style={{fontSize:15,fontWeight:700,color:'#f0f4ff'}}>{h.name}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.8)'}}>📍 {h.region} · ⭐ {h.rating} · {h.stars}</div>
            </div>
          </div>
          <div style={{padding:'12px 14px'}}>
            <div style={{fontSize:12,color:'#8fa3c4',lineHeight:1.6,marginBottom:8}}>{h.desc}</div>
            <div style={{fontSize:12,color:'#5dcaa5',fontWeight:600}}>{h.price}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── CULTURE & EVENTS TAB ─────────────────────────────────
const cultureItems = [
  {name:'Umhlanga (Reed Dance)', img:limg('lobamba'), when:'Late August / Early September',
   desc:"Thousands of unmarried young women gather at the Royal residence in Ludzidzini to cut reeds and present them to the Queen Mother, in a celebration of purity, unity and Swazi heritage. One of Africa's most spectacular cultural events."},
  {name:'Incwala (Kingship Ceremony)', img:limg('lobamba')||limg('mantenga'), when:'December / January (timed to the new moon)',
   desc:"The most sacred ceremony in Swazi culture — a multi-day ritual affirming the kingship and the bond between the king, his people and the land. Several stages are open to respectful visitors."},
  {name:'Marula Festival (Buganu)', img:limg('Food-Umoba-Sugarcane')||limg('gonerural'), when:'February / March',
   desc:'A harvest celebration of the marula fruit, marking the start of the traditional brewing season with feasting, song and dance across rural homesteads.'},
  {name:'Traditional Villages', img:limg('mantenga'), when:'Open daily',
   desc:'Living cultural villages such as Mantenga and Mantenga Cultural Village showcase traditional Swazi homestead life, beehive huts, dance performances and storytelling.'},
  {name:'Crafts & Markets', img:limg('swazicandles')||limg('ezulwinimarket'), when:'Open daily',
   desc:'Swazi Candles, Gone Rural weavers and Ngwenya Glass turn traditional craft skills into world-renowned art — all of it handmade locally and available to buy directly from the makers.'},
];
function CultureTab({t}) {
  const [open,setOpen] = useState(null);
  return (
    <div>
      <div style={styles.sectionTitle}>🎭 Culture & Events</div>
      <div style={{fontSize:12,color:'#8fa3c4',marginBottom:14,lineHeight:1.6}}>Eswatini's living traditions — ceremonies, festivals, villages and crafts.</div>
      {cultureItems.map(c=>(
        <div key={c.name} style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:14,overflow:'hidden',marginBottom:12}}>
          {c.img && <Img src={c.img} alt={c.name} style={{width:'100%',height:150}}/>}
          <div style={{padding:'12px 14px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',cursor:'pointer'}} onClick={()=>setOpen(open===c.name?null:c.name)}>
              <div style={{fontSize:14,fontWeight:700,color:'#f0f4ff'}}>{c.name}</div>
              <span style={{color:'#c9a227',fontSize:13}}>{open===c.name?'▲':'▼'}</span>
            </div>
            <div style={{fontSize:11,color:'#c9a227',marginTop:3,fontWeight:600}}>📅 {c.when}</div>
            {open===c.name && <div style={{fontSize:12,color:'#b0c4de',lineHeight:1.7,marginTop:8}}>{c.desc}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── GETTING AROUND TAB ───────────────────────────────────
const carRentals = [
  {name:'Avis Eswatini', location:'King Mswati III Airport / Mbabane', phone:'+268 2518 4905', price:'From E 450/day'},
  {name:'Europcar Eswatini', location:'Manzini & Mbabane', phone:'+268 2505 8392', price:'From E 400/day'},
  {name:'Eswatini Car Hire', location:'Mbabane', phone:'+268 7602 8855', price:'From E 350/day'},
];
const distances = [
  {from:'Mbabane',to:'Manzini',dist:'40 km',time:'35 min'},
  {from:'Mbabane',to:'Ezulwini Valley',dist:'15 km',time:'15 min'},
  {from:'Mbabane',to:"Pigg's Peak",dist:'50 km',time:'50 min'},
  {from:'Manzini',to:'Hlane Royal National Park',dist:'67 km',time:'1 hr'},
  {from:'Ezulwini',to:'Malolotja Nature Reserve',dist:'45 km',time:'45 min'},
  {from:'Manzini',to:'Mlilwane Wildlife Sanctuary',dist:'18 km',time:'20 min'},
];
function GettingAroundTab({t}) {
  const [section,setSection] = useState('car');
  return (
    <div>
      <div style={styles.sectionTitle}>🚗 Getting Around</div>
      <div style={{display:'flex',gap:7,overflowX:'auto',paddingBottom:8,marginBottom:14}}>
        {[['car','Car Rental'],['taxi','Taxi/Kombi'],['dist','Distances'],['map','Map Nav']].map(([id,label])=>(
          <button key={id} onClick={()=>setSection(id)} style={{flexShrink:0,padding:'7px 15px',borderRadius:20,border:section===id?'1px solid #c9a227':'0.5px solid rgba(201,162,39,0.2)',background:section===id?'rgba(201,162,39,0.15)':'transparent',color:section===id?'#c9a227':'#8fa3c4',fontSize:12,cursor:'pointer',fontWeight:section===id?600:400}}>{label}</button>
        ))}
      </div>

      {section==='car' && carRentals.map(c=>(
        <div key={c.name} style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:12,padding:14,marginBottom:10}}>
          <div style={{fontSize:14,fontWeight:700,color:'#f0f4ff'}}>{c.name}</div>
          <div style={{fontSize:12,color:'#8fa3c4',marginTop:4}}>📍 {c.location}</div>
          <div style={{fontSize:12,color:'#5dcaa5',fontWeight:600,marginTop:4}}>{c.price}</div>
          <a href={`tel:${c.phone.replace(/\s/g,'')}`} style={{display:'inline-block',marginTop:8,textDecoration:'none',padding:'7px 14px',borderRadius:50,border:'0.5px solid rgba(131,122,221,0.4)',background:'rgba(131,122,221,0.15)',color:'#afa9ec',fontSize:12,fontWeight:600}}>📞 Call to book</a>
        </div>
      ))}

      {section==='taxi' && (
        <div style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:12,padding:16}}>
          <div style={{fontSize:13,fontWeight:700,color:'#c9a227',marginBottom:8}}>Kombi Taxis (Minibus)</div>
          <div style={{fontSize:12,color:'#b0c4de',lineHeight:1.8,marginBottom:14}}>The cheapest way to get around. Kombis run fixed routes between towns and leave once full — no fixed timetable. Main ranks: Mbabane Bus Rank and Manzini Bus Rank. Fares are typically E10–E45 depending on distance. Look out for the route signs in the front window.</div>
          <div style={{fontSize:13,fontWeight:700,color:'#c9a227',marginBottom:8}}>Metered Taxis</div>
          <div style={{fontSize:12,color:'#b0c4de',lineHeight:1.8}}>Available in Mbabane and Manzini for door-to-door trips, especially at night or with luggage. Most hotels can call one for you, or ask at a guesthouse front desk. Agree on a fare before you get in if the cab isn't metered.</div>
        </div>
      )}

      {section==='dist' && (
        <div style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:12,padding:4}}>
          {distances.map((d,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',borderBottom:i<distances.length-1?'0.5px solid rgba(255,255,255,0.06)':'none'}}>
              <div style={{fontSize:12,color:'#f0f4ff'}}>{d.from} → {d.to}</div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:12,color:'#c9a227',fontWeight:600}}>{d.dist}</div>
                <div style={{fontSize:10,color:'#8fa3c4'}}>{d.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {section==='map' && (
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:12,color:'#8fa3c4',marginBottom:14,lineHeight:1.6}}>Open turn-by-turn navigation between any two places in Eswatini using Google Maps.</div>
          <button style={styles.btnPrimary} onClick={()=>window.open('https://www.google.com/maps/dir/','_blank')}>🗺️ Open Map Navigation</button>
        </div>
      )}
    </div>
  );
}

// ── BOOK / RESERVE HUB TAB ───────────────────────────────
const tourGuides = [
  {name:'Sibusiso Dlamini', specialty:'Cultural & Heritage Tours', phone:'+268 7611 2233', email:'sibusiso.guide@eswatini-tours.sz'},
  {name:'Nomvula Shongwe', specialty:'Wildlife & National Parks', phone:'+268 7622 4455', email:'nomvula.guide@eswatini-tours.sz'},
  {name:'Thabo Mamba', specialty:'Hiking & Adventure', phone:'+268 7633 6677', email:'thabo.guide@eswatini-tours.sz'},
];
const experiences = [
  {name:'Sunset Game Drive – Hlane Royal National Park', price:'E 450 per person', img:limg('hlane')},
  {name:'Mantenga Cultural Dance Show', price:'E 150 per person', img:limg('mantenga')},
  {name:'Glass-Blowing Demo – Ngwenya Glass', price:'E 80 per person', img:limg('ngwenya glass')},
  {name:'Malolotja Canopy Hike', price:'E 350 per person', img:limg('malolotja')},
];
function BookTab({t,setTab,onSelectHotel,onSelect}) {
  const bookExperience = (exp)=>{
    if(window.confirm(`Buy "${exp.name}" for ${exp.price}?\nThis will email our bookings team to confirm.`)){
      window.location.href = `mailto:bookings@incaba-eswatini.com?subject=${encodeURIComponent('Experience booking: '+exp.name)}&body=${encodeURIComponent('I would like to book: '+exp.name+' ('+exp.price+')')}`;
    }
  };
  return (
    <div>
      <div style={styles.sectionTitle}>🎟️ Book / Reserve</div>
      <div style={{fontSize:12,color:'#8fa3c4',marginBottom:16,lineHeight:1.6}}>Everything you need to book your Eswatini trip, in one place.</div>

      <div onClick={()=>setTab('stay')} style={{...styles.hstat,display:'flex',alignItems:'center',gap:12,cursor:'pointer',marginBottom:10,padding:14}}>
        <span style={{fontSize:22}}>🛏️</span>
        <div><div style={{fontSize:13,fontWeight:700,color:'#f0f4ff'}}>Book Accommodation</div><div style={{fontSize:11,color:'#8fa3c4'}}>Hotels, lodges, guesthouses & camping</div></div>
      </div>
      <div onClick={()=>setTab('explore')} style={{...styles.hstat,display:'flex',alignItems:'center',gap:12,cursor:'pointer',marginBottom:18,padding:14}}>
        <span style={{fontSize:22}}>🔭</span>
        <div><div style={{fontSize:13,fontWeight:700,color:'#f0f4ff'}}>Book Activities</div><div style={{fontSize:11,color:'#8fa3c4'}}>Attractions, parks & virtual tours</div></div>
      </div>

      <div style={{fontSize:13,fontWeight:700,color:'#c9a227',marginBottom:10}}>📞 Contact a Tour Guide</div>
      {tourGuides.map(g=>(
        <div key={g.name} style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:12,padding:12,marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{g.name}</div>
            <div style={{fontSize:11,color:'#8fa3c4'}}>{g.specialty}</div>
          </div>
          <div style={{display:'flex',gap:6}}>
            <a href={`tel:${g.phone.replace(/\s/g,'')}`} style={{textDecoration:'none',padding:'6px 10px',borderRadius:50,border:'0.5px solid rgba(131,122,221,0.4)',background:'rgba(131,122,221,0.15)',color:'#afa9ec',fontSize:14}}>📞</a>
            <a href={`mailto:${g.email}`} style={{textDecoration:'none',padding:'6px 10px',borderRadius:50,border:'0.5px solid rgba(93,202,165,0.35)',background:'rgba(93,202,165,0.1)',color:'#5dcaa5',fontSize:14}}>✉️</a>
          </div>
        </div>
      ))}

      <div style={{fontSize:13,fontWeight:700,color:'#c9a227',marginTop:18,marginBottom:10}}>✨ Buy an Experience</div>
      {experiences.map(e=>(
        <div key={e.name} style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:12,overflow:'hidden',marginBottom:10,display:'flex',alignItems:'center',gap:10}}>
          {e.img && <Img src={e.img} alt={e.name} style={{width:80,height:70,flexShrink:0}}/>}
          <div style={{flex:1,padding:'8px 4px'}}>
            <div style={{fontSize:12,fontWeight:600,color:'#f0f4ff'}}>{e.name}</div>
            <div style={{fontSize:12,color:'#5dcaa5',fontWeight:600,marginTop:3}}>{e.price}</div>
          </div>
          <button onClick={()=>bookExperience(e)} style={{margin:'0 10px',padding:'8px 13px',borderRadius:50,background:'linear-gradient(135deg,#c9a227,#e8b93a)',border:'none',color:'#0a1628',fontSize:11,fontWeight:700,cursor:'pointer',flexShrink:0}}>Buy</button>
        </div>
      ))}
    </div>
  );
}

// ── HOME TAB ──────────────────────────────────────────────
function HomeTab({setTab,onSelect,onSelectRestaurant,onSelectHotel,onSelectStore,t}) {
  const [sec,setSec] = useState('attractions');
  const [showWeather,setShowWeather] = useState(false);
  const handleSOS = ()=>{if(window.confirm('Call Eswatini Emergency Services?\nPolice: 999\nAmbulance: 977\nFire: 933'))window.location.href='tel:999';};
  return (
    <div>
      <div style={styles.sosBtn} onClick={handleSOS}>
        <span style={{fontSize:18}}>🆘</span>
        <div><div style={{fontSize:12,fontWeight:600,color:'#e24b4a'}}>{t.sos}</div><div style={{fontSize:10,color:'#8fa3c4'}}>{t.sosSub}</div></div>
        <span style={{color:'#8fa3c4',marginLeft:'auto'}}>›</span>
      </div>
      <WeatherMiniCard t={t} onClick={()=>setShowWeather(true)}/>
{showWeather&&(
  <div style={{position:'fixed',inset:0,background:'#0a1628',zIndex:200,overflowY:'auto',padding:16,maxWidth:480,margin:'0 auto'}}>
    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
      <button onClick={()=>setShowWeather(false)} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:50,padding:'7px 14px',color:'#f0f4ff',fontSize:12,cursor:'pointer'}}>← Back</button>
      <div style={{fontSize:14,fontWeight:700,color:'#f0f4ff'}}>{t.weather}</div>
    </div>
    <WeatherWidget t={t}/>
  </div>
)}
      <div style={styles.heroBanner}>
        <div style={styles.heroBadge}>✦ Kingdom of Eswatini</div>
        <h2 style={{fontSize:20,fontWeight:700,color:'#f0f4ff',marginBottom:7}}>{t.welcome}</h2>
        <p style={{fontSize:12,color:'#8fa3c4',lineHeight:1.5,marginBottom:12}}>{t.welcomeSub}</p>
        <div style={{display:'flex',gap:10}}>
          {[['120+',t.attractions,'attractions'],['48',t.restaurants,'restaurants'],['35',t.hotels,'hotels']].map(([n,l,s])=>(
            <div key={l} onClick={()=>setSec(s)} style={{...styles.hstat,cursor:'pointer',border:sec===s?'1.5px solid #c9a227':'0.5px solid rgba(201,162,39,0.2)'}}>
              <div style={{fontSize:17,fontWeight:700,color:'#c9a227'}}>{n}</div>
              <div style={{fontSize:9,color:sec===s?'#c9a227':'#8fa3c4',marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <CurrencyWidget t={t}/>
      <div style={styles.aiCard} onClick={()=>setTab('ai')}>
        <div style={{width:44,height:44,borderRadius:12,background:'rgba(83,74,183,0.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>🤖</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:600,color:'#f0f4ff',marginBottom:2}}>{t.aiTitle}</div>
          <div style={{fontSize:11,color:'#8fa3c4',lineHeight:1.4}}>{t.aiSub}</div>
        </div>
        <span style={{color:'#c9a227',fontSize:18}}>›</span>
      </div>

      {sec==='attractions'&&(
        <>
          <div style={styles.sectionTitle}>{t.topAttractions}</div>
          <div style={styles.grid}>
            {places.map(p=>(
              <div key={p.name} style={styles.card} onClick={()=>onSelect(p)}>
                <Img src={p.img} alt={p.name} style={{width:'100%',height:110}}/>
                <div style={{position:'absolute',top:8,right:8,background:'rgba(201,162,39,0.9)',borderRadius:6,padding:'2px 7px',fontSize:9,fontWeight:700,color:'#0a1628'}}>{p.category}</div>
                <div style={{padding:'9px 11px'}}>
                  <div style={{fontSize:12,fontWeight:600,color:'#f0f4ff',marginBottom:2}}>{p.name}</div>
                  <div style={{fontSize:10,color:'#8fa3c4',marginBottom:3}}>📍 {p.region}</div>
                  <div style={{fontSize:10,color:'#6a85a8',lineHeight:1.4,marginBottom:4}}>{p.desc}</div>
                  <div style={{fontSize:10,color:'#c9a227'}}>⭐ {p.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {sec==='restaurants'&&(
        <>
          <div style={styles.sectionTitle}>{t.restaurants}</div>
          {restaurants.map(r=>(
            <div key={r.name} style={{...styles.listCard,cursor:'pointer'}} onClick={()=>onSelectRestaurant(r)}>
              <Img src={r.coverImg} alt={r.name} style={{width:72,height:65,borderRadius:10,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{r.name}</div>
                <div style={{fontSize:11,color:'#8fa3c4',marginTop:2}}>📍 {r.region} · {r.hours}</div>
                <div style={{fontSize:11,color:'#6a85a8',marginTop:2,lineHeight:1.4}}>{r.desc}</div>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontSize:12,fontWeight:600,color:'#c9a227'}}>⭐ {r.rating}</div>
                <div style={{fontSize:10,color:'#5dcaa5',marginTop:4}}>Tap to order →</div>
              </div>
            </div>
          ))}
        </>
      )}

      {sec==='hotels'&&(
        <>
          <div style={styles.sectionTitle}>{t.hotels}</div>
          {hotels.map(h=>(
            <div key={h.name} style={{...styles.listCard,cursor:'pointer'}} onClick={()=>onSelectHotel(h)}>
              <Img src={h.coverImg} alt={h.name} style={{width:72,height:65,borderRadius:10,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{h.name}</div>
                <div style={{fontSize:11,color:'#8fa3c4',marginTop:2}}>📍 {h.region}</div>
                <div style={{fontSize:11,color:'#c9a227',marginTop:2}}>{h.stars}</div>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontSize:11,color:'#5dcaa5'}}>{h.price}</div>
                <div style={{fontSize:10,color:'#8fa3c4',marginTop:4}}>Tap to book →</div>
              </div>
            </div>
          ))}
        </>
      )}

      <div style={styles.sectionTitle}>{t.hiddenGem} 💎</div>
      <div style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:14,overflow:'hidden',marginBottom:16,cursor:'pointer'}} onClick={()=>onSelect(places[6])}>
        <Img src={places[6].img} alt="Shiselweni" style={{width:'100%',height:140}}/>
        <div style={{padding:12}}>
          <div style={{fontSize:14,fontWeight:700,color:'#f0f4ff',marginBottom:5}}>Shiselweni Region 🌿</div>
          <div style={{fontSize:11,color:'#8fa3c4',lineHeight:1.6,marginBottom:8}}>Eswatini's southern paradise — untouched forests, rivers and traditional villages. Only 5% of tourists visit.</div>
          <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
            {['🌿 Nature','📍 South Eswatini','🆓 Uncrowded'].map(tag=><span key={tag} style={styles.tag}>{tag}</span>)}
          </div>
        </div>
      </div>

      <div style={styles.sectionTitle}>Local Stores 🛍️</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
        {localStores.map(s=>(
          <div key={s.name} style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:12,overflow:'hidden',cursor:'pointer'}} onClick={()=>onSelectStore(s)}>
            <Img src={s.coverImg} alt={s.name} style={{width:'100%',height:90}}/>
            <div style={{padding:'8px 10px'}}>
              <div style={{fontSize:12,fontWeight:600,color:'#f0f4ff',marginBottom:2}}>{s.name}</div>
              <div style={{fontSize:10,color:'#8fa3c4'}}>{s.type}</div>
              <div style={{fontSize:10,color:'#c9a227',marginTop:3}}>⭐ {s.rating}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAP TAB ───────────────────────────────────────────────
// Real interactive map using Leaflet + OpenStreetMap raster tiles.
// Raster tiles render with plain <img> elements — no WebGL required,
// so it works on every browser/device, including older or locked-down ones.
function RealMap({loc,t}){
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(()=>{
    if(!window.L || !elRef.current || mapRef.current) return;
    const L = window.L;
    const start = loc ? [loc.lat,loc.lng] : [-26.5, 31.4]; // Eswatini centre
    const map = L.map(elRef.current,{zoomControl:true,attributionControl:true}).setView(start, loc?13:9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom:19,
      attribution:'© OpenStreetMap contributors'
    }).addTo(map);

    const spots = [
      {name:'Mantenga Falls',lat:-26.4546,lng:31.1844},
      {name:'Hlane Royal Reserve',lat:-26.1667,lng:31.85},
      {name:'Mbabane',lat:-26.3054,lng:31.1367},
      {name:'Manzini',lat:-26.4886,lng:31.3719},
    ];
    spots.forEach(s=>{
      L.circleMarker([s.lat,s.lng],{radius:7,color:'#c9a227',fillColor:'#c9a227',fillOpacity:0.9,weight:2})
        .addTo(map).bindPopup(`<b>${s.name}</b>`);
    });

    mapRef.current = map;
    setTimeout(()=>map.invalidateSize(), 200);
  },[]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(()=>{
    if(!window.L || !mapRef.current || !loc) return;
    const L = window.L;
    const map = mapRef.current;
    if(markerRef.current) markerRef.current.remove();
    markerRef.current = L.marker([loc.lat,loc.lng],{
      icon: L.divIcon({className:'',html:'<div style="width:16px;height:16px;border-radius:50%;background:#e24b4a;border:3px solid white;box-shadow:0 0 0 4px rgba(226,75,74,0.3)"></div>'})
    }).addTo(map).bindPopup('You are here');
    map.setView([loc.lat,loc.lng], 13);
  },[loc]);

  return (
    <div style={{borderRadius:16,overflow:'hidden',marginBottom:14,border:'0.5px solid rgba(201,162,39,0.2)'}}>
      <div ref={elRef} style={{height:220,width:'100%',background:'#0d2540'}}/>
    </div>
  );
}

function MapTab({t}) {
  const [loc,setLoc]     = useState(null);
  const [active,setActive] = useState(null);
  const [err,setErr]     = useState('');
  const wRef = useRef(null);
  useEffect(()=>()=>{if(wRef.current)navigator.geolocation.clearWatch(wRef.current);},[]);
  const startTracking = ()=>{
    if(!navigator.geolocation){setErr('GPS not supported.');return;}
    setErr('');
    navigator.geolocation.getCurrentPosition(
      p=>setLoc({lat:p.coords.latitude,lng:p.coords.longitude,acc:Math.round(p.coords.accuracy)}),
      ()=>setErr('Could not get location. Please allow location access.'),
      {enableHighAccuracy:true,timeout:10000}
    );
    wRef.current=navigator.geolocation.watchPosition(
      p=>setLoc({lat:p.coords.latitude,lng:p.coords.longitude,acc:Math.round(p.coords.accuracy)}),
      ()=>{},{enableHighAccuracy:true,maximumAge:3000}
    );
  };
  const routes=[
    {name:'🌿 Scenic Route',time:'2h 15m',dist:'87 km',type:'Recommended',color:'#5dcaa5',desc:'Ezulwini Valley, Mantenga Falls, Lobamba.',stops:['Mantenga Falls','Lobamba','Swazi Candles'],url:'https://www.google.com/maps/dir/Mbabane/Mantenga+Falls+Eswatini/Lobamba+Eswatini'},
    {name:'⚡ Fastest Route',time:'1h 20m',dist:'62 km',type:'Quick',color:'#c9a227',desc:'Direct highway via MR3.',stops:['Manzini Highway','Mbabane Bypass'],url:'https://www.google.com/maps/dir/Mbabane/Manzini+Eswatini'},
    {name:'💰 Budget Route',time:'2h 45m',dist:'E45',type:'Affordable',color:'#534ab7',desc:'Kombi taxis — travel like a local.',stops:['Manzini Bus Rank','Mbabane Market'],url:'https://www.google.com/maps/dir/Mbabane/Manzini+Bus+Rank+Eswatini'},
  ];
  return (
    <div>
      <div style={styles.sectionTitle}>{t.navigate}</div>
      {loc?(
        <div style={{background:'rgba(29,158,117,0.12)',border:'0.5px solid rgba(29,158,117,0.3)',borderRadius:12,padding:14,marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:600,color:'#5dcaa5',marginBottom:6}}>📍 Your Live Location</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
            <div style={{background:'rgba(255,255,255,0.05)',borderRadius:8,padding:9}}>
              <div style={{fontSize:9,color:'#8fa3c4',marginBottom:2}}>Latitude</div>
              <div style={{fontSize:12,fontWeight:600,color:'#f0f4ff'}}>{loc.lat.toFixed(6)}</div>
            </div>
            <div style={{background:'rgba(255,255,255,0.05)',borderRadius:8,padding:9}}>
              <div style={{fontSize:9,color:'#8fa3c4',marginBottom:2}}>Longitude</div>
              <div style={{fontSize:12,fontWeight:600,color:'#f0f4ff'}}>{loc.lng.toFixed(6)}</div>
            </div>
          </div>
          <div style={{fontSize:11,color:'#5dcaa5',marginBottom:10}}>🟢 Updating live · ±{loc.acc}m accuracy</div>
          <button style={{...styles.btnPrimary,padding:'9px',fontSize:12}} onClick={()=>window.open('https://www.google.com/maps?q='+loc.lat+','+loc.lng,'_blank')}>Open in Google Maps</button>
        </div>
      ):(
        <>
          {err&&<div style={{background:'rgba(226,75,74,0.1)',border:'0.5px solid rgba(226,75,74,0.3)',borderRadius:10,padding:10,marginBottom:10,fontSize:12,color:'#e24b4a'}}>{err}</div>}
          <button style={{...styles.btnPrimary,marginBottom:14}} onClick={startTracking}>📍 Show My Live Location</button>
        </>
      )}
      <RealMap loc={loc} t={t}/>
      <div style={styles.sectionTitle}>Smart Routes</div>
      {routes.map(r=>(
        <div key={r.name}>
          <div onClick={()=>setActive(active===r.name?null:r.name)} style={{background:'rgba(255,255,255,0.05)',border:active===r.name?'0.5px solid '+r.color:'0.5px solid rgba(201,162,39,0.2)',borderRadius:active===r.name?'12px 12px 0 0':12,padding:'11px 13px',marginBottom:active===r.name?0:8,cursor:'pointer'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{r.name}</div>
                <div style={{fontSize:11,color:'#8fa3c4',marginTop:2}}>{r.time} · {r.dist}</div>
              </div>
              <span style={{fontSize:10,padding:'3px 10px',borderRadius:20,border:'0.5px solid '+r.color,color:r.color}}>{r.type}</span>
            </div>
          </div>
          {active===r.name&&(
            <div style={{background:'rgba(255,255,255,0.03)',border:'0.5px solid '+r.color,borderTop:'none',borderRadius:'0 0 12px 12px',padding:12,marginBottom:8}}>
              <div style={{fontSize:12,color:'#b0c4de',lineHeight:1.6,marginBottom:8}}>{r.desc}</div>
              {r.stops.map((s,i)=><div key={i} style={{display:'flex',gap:7,alignItems:'center',marginBottom:5}}><div style={{width:5,height:5,borderRadius:'50%',background:r.color,flexShrink:0}}/><div style={{fontSize:11,color:'#8fa3c4'}}>{s}</div></div>)}
              <button style={{...styles.btnPrimary,marginTop:10,padding:'10px',fontSize:12}} onClick={()=>window.open(r.url,'_blank')}>🗺️ Open in Google Maps</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── AI TAB ────────────────────────────────────────────────
function AITab({t}) {
  const [msgs,setMsgs] = useState([{role:'ai',text:"Sawubona! 👋 I'm Vaka, your Incaba AI Guide for the Kingdom of Eswatini.\n\nI speak 9 languages and can help with:\n• Trip planning and itineraries\n• Wildlife and nature parks\n• Food, restaurants and local cuisine\n• Culture, festivals and ceremonies\n• Hotels and accommodation\n• Currency and weather\n• Transport and getting around\n• Emergency help\n• Any question about Eswatini\n\nWhat would you like to know? 💎"}]);
  const [input,setInput]   = useState('');
  const [typing,setTyping] = useState(false);
  const [speaking,setSpeaking] = useState(false);
  const chatRef = useRef(null);
  useEffect(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight;},[msgs,typing]);
  const speak = txt=>{
    if('speechSynthesis' in window){
      window.speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(txt.replace(/[💎🇸🇿🤖🦁🍽🎭🏨💱🚌🆘🗓📍⭐🌍👋•]/g,''));
      u.rate=0.9; u.onstart=()=>setSpeaking(true); u.onend=()=>setSpeaking(false);
      window.speechSynthesis.speak(u);
    }
  };
  const getReply = async msg=>{
    try{
      const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg})});
      const d=await r.json();
      return d.reply||'Please try again!';
    }catch(e){return 'Could not connect right now. Please try again!';}
  };
  const send = async ()=>{
    if(!input.trim()) return;
    const msg=input;
    setMsgs(p=>[...p,{role:'user',text:msg}]);
    setInput(''); setTyping(true);
    const reply=await getReply(msg);
    setTyping(false);
    setMsgs(p=>[...p,{role:'ai',text:reply}]);
  };
  const lastAI=[...msgs].reverse().find(m=>m.role==='ai');
  return (
    <div style={{display:'flex',flexDirection:'column',height:'75vh'}}>
      <div style={{textAlign:'center',padding:'10px 0 6px'}}>
        <div style={{fontSize:36}}>🤖</div>
        <div style={{fontSize:15,fontWeight:700,color:'#f0f4ff'}}>{t.aiTitle}</div>
        <div style={{fontSize:10,color:'#8fa3c4'}}>{t.aiSub}</div>
        {lastAI&&<button onClick={()=>speak(lastAI.text)} style={{marginTop:5,padding:'4px 12px',borderRadius:20,border:'0.5px solid rgba(131,122,221,0.4)',background:speaking?'rgba(131,122,221,0.3)':'rgba(131,122,221,0.15)',color:'#afa9ec',cursor:'pointer',fontSize:10}}>{speaking?'🔊 Speaking...':'🔊 Read Aloud'}</button>}
      </div>
      <div ref={chatRef} style={{flex:1,overflowY:'auto',paddingBottom:10}}>
        {msgs.map((m,i)=><div key={i} style={m.role==='ai'?styles.bubbleAI:styles.bubbleUser}>{m.text}</div>)}
        {typing&&<div style={{...styles.bubbleAI,display:'flex',gap:5,alignItems:'center',padding:'14px'}}><div style={{width:7,height:7,borderRadius:'50%',background:'#8fa3c4'}}/><div style={{width:7,height:7,borderRadius:'50%',background:'#8fa3c4'}}/><div style={{width:7,height:7,borderRadius:'50%',background:'#8fa3c4'}}/></div>}
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:8}}>
        {['Plan my trip','Wildlife','Local food','Culture','Hotels','Weather','Currency','Emergency'].map(s=>(
          <button key={s} style={styles.pill} onClick={async()=>{setMsgs(p=>[...p,{role:'user',text:s}]);setTyping(true);const r=await getReply(s);setTyping(false);setMsgs(p=>[...p,{role:'ai',text:r}]);}}>{s}</button>
        ))}
      </div>
      <div style={{display:'flex',gap:8,paddingTop:5}}>
        <input style={styles.chatInput} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask anything about Eswatini..."/>
        <button style={styles.sendBtn} onClick={send}>➤</button>
      </div>
    </div>
  );
}

// ── BUSINESS TAB ──────────────────────────────────────────
function BusinessTab({t}) {
  const [step,setStep]   = useState('list');
  const [form,setForm]   = useState({name:'',type:'Hotel',region:'',phone:'',email:'',desc:''});
  const [photos,setPhotos] = useState([]); // data-URLs of uploaded business photos
  const [saving,setSaving] = useState(false);
  const handlePhotoUpload = (e)=>{
    const files = Array.from(e.target.files||[]).slice(0,6-photos.length);
    files.forEach(file=>{
      const reader = new FileReader();
      reader.onload = ()=> setPhotos(p=>[...p, reader.result]);
      reader.readAsDataURL(file);
    });
  };
  const removePhoto = (i)=> setPhotos(p=>p.filter((_,idx)=>idx!==i));
  const [card,setCard]   = useState('');
  const [exp,setExp]     = useState('');
  const [cvv,setCvv]     = useState('');
  const [selBiz,setSelBiz] = useState(null);
  const [list,setList]   = useState([
    {name:'Royal Swazi Hotel',type:'Hotel',region:'Ezulwini Valley',img:photo('luxury,hotel,africa,resort'),views:'1,240',verified:true,revenue:'E 4,500'},
    {name:"Malandela's Restaurant",type:'Restaurant',region:'Malkerns',img:photo('african,restaurant,garden'),views:'876',verified:true,revenue:'E 2,800'},
    {name:'Swazi Candles Market',type:'Craft',region:'Malkerns',img:photo('candles,colorful,craft,african'),views:'654',verified:true,revenue:'E 1,200'},
  ]);

  // Load any previously-saved businesses from Supabase so listings persist for everyone.
  useEffect(()=>{
    supabase.from('businesses').select('*').order('created_at',{ascending:false})
      .then(({data,error})=>{
        if(error){ console.error('Load businesses failed:', error.message); return; }
        if(data&&data.length){
          setList(prev=>[
            ...data.map(b=>({
              name:b.name, type:b.type, region:b.region,
              img:(b.photos&&b.photos[0])||photo(b.type+',business,africa'),
              gallery:b.photos||[], views:String(b.views||0), verified:b.verified,
              revenue:'E 0', phone:b.phone, email:b.email, desc:b.description,
            })),
            ...prev,
          ]);
        }
      });
  },[]);

  const dataURLtoBlob = (dataURL)=>{
    const [meta, base64] = dataURL.split(',');
    const mime = meta.match(/data:(.*);base64/)[1];
    const bin = atob(base64);
    const arr = new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++) arr[i]=bin.charCodeAt(i);
    return new Blob([arr],{type:mime});
  };

  const pay=async()=>{
    if(!card||!exp||!cvv||card.replace(/\s/g,'').length<16){alert('Please fill in all valid payment details');return;}
    setSaving(true);
    let photoUrls = [];
    try{
      for(let i=0;i<photos.length;i++){
        const blob = dataURLtoBlob(photos[i]);
        const path = `${Date.now()}_${i}.jpg`;
        const { error: upErr } = await supabase.storage.from('business-photos').upload(path, blob, {contentType:blob.type});
        if(upErr){ console.error('Photo upload failed:', upErr.message); continue; }
        const { data:pub } = supabase.storage.from('business-photos').getPublicUrl(path);
        if(pub&&pub.publicUrl) photoUrls.push(pub.publicUrl);
      }
      const { error: insErr } = await supabase.from('businesses').insert({
        name:form.name, type:form.type, region:form.region,
        phone:form.phone, email:form.email, description:form.desc,
        photos: photoUrls,
      });
      if(insErr) console.error('Business save failed:', insErr.message);
    }catch(e){ console.error('Business registration error:', e); }
    setSaving(false);
    alert('Payment of E200 successful!\nYour listing will go live within 24 hours.');
    setList(p=>[...p,{name:form.name,type:form.type,region:form.region,img:photoUrls[0]||photos[0]||photo(form.type+',business,africa'),gallery:photoUrls.length?photoUrls:photos,views:'0',verified:false,revenue:'E 0'}]);
    setStep('list'); setForm({name:'',type:'Hotel',region:'',phone:'',email:'',desc:''}); setCard(''); setExp(''); setCvv(''); setPhotos([]);
  };
  if(selBiz) return (
    <div style={styles.app}>
      <div style={{position:'relative',flexShrink:0}}>
        <Img src={selBiz.img} alt={selBiz.name} style={{width:'100%',height:200}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,0.2) 0%,transparent 40%,rgba(10,22,40,0.9) 100%)'}}/>
        <button onClick={()=>setSelBiz(null)} style={{position:'absolute',top:14,left:14,background:'rgba(10,22,40,0.75)',border:'none',borderRadius:50,padding:'7px 13px',color:'#f0f4ff',fontSize:12,cursor:'pointer',zIndex:10}}>← Back</button>
        <div style={{position:'absolute',bottom:12,left:14,zIndex:10}}>
          <div style={{fontSize:18,fontWeight:700,color:'#fff',textShadow:'0 2px 8px rgba(0,0,0,0.9)'}}>{selBiz.name}</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.85)'}}>📍 {selBiz.region} · {selBiz.type}</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:16}}>
        {selBiz.verified&&<div style={{display:'inline-block',fontSize:11,padding:'3px 10px',borderRadius:20,background:'rgba(29,158,117,0.15)',color:'#5dcaa5',border:'0.5px solid rgba(29,158,117,0.3)',marginBottom:14}}>✓ Verified Business</div>}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:16}}>
          {[['Views',selBiz.views+'/week'],['Revenue',selBiz.revenue],['Rating','4.7 ⭐']].map(([l,v])=>(
            <div key={l} style={{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:10,padding:'11px 8px',textAlign:'center'}}>
              <div style={{fontSize:9,color:'#8fa3c4',marginBottom:3}}>{l}</div>
              <div style={{fontSize:12,fontWeight:600,color:'#c9a227'}}>{v}</div>
            </div>
          ))}
        </div>
        <Reviews name={selBiz.name} t={t}/>
        {selBiz.gallery&&selBiz.gallery.length>0&&(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
            {selBiz.gallery.map((img,i)=><Img key={i} src={img} alt="" style={{height:100,borderRadius:10}}/>)}
          </div>
        )}
        <button style={{...styles.btnPrimary,marginBottom:16}} onClick={()=>window.open('https://www.google.com/maps/search/'+encodeURIComponent(selBiz.name)+'+Eswatini','_blank')}>🗺️ {t.getDir}</button>
      </div>
    </div>
  );
  return (
    <div>
      {step==='list'&&(
        <>
          <div style={{background:'rgba(29,158,117,0.1)',border:'0.5px solid rgba(29,158,117,0.3)',borderRadius:16,padding:18,marginBottom:14}}>
            <div style={{fontSize:10,color:'#5dcaa5',fontWeight:600,letterSpacing:1,marginBottom:5}}>BUSINESS PORTAL</div>
            <div style={{fontSize:19,fontWeight:700,color:'#f0f4ff',marginBottom:5}}>Grow With Tourism 🌱</div>
            <div style={{fontSize:12,color:'#8fa3c4',lineHeight:1.6,marginBottom:10}}>List your business and reach thousands of tourists from around the world.</div>
            <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(201,162,39,0.08)',borderRadius:10,padding:'9px 12px',marginBottom:12}}>
              <span>💰</span>
              <div><div style={{fontSize:12,fontWeight:600,color:'#c9a227'}}>E200 per month listing fee</div><div style={{fontSize:10,color:'#8fa3c4'}}>Pay upfront — listing goes live within 24 hours</div></div>
            </div>
            <button style={{...styles.btnPrimary,padding:'11px 24px',fontSize:14}} onClick={()=>setStep('register')}>+ Register Your Business</button>
          </div>
          <div style={styles.sectionTitle}>Active Businesses</div>
          {list.map((b,i)=>(
            <div key={i} style={{...styles.listCard,cursor:'pointer'}} onClick={()=>setSelBiz(b)}>
              <Img src={b.img} alt={b.name} style={{width:65,height:58,borderRadius:10,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{b.name}</div>
                <div style={{fontSize:11,color:'#8fa3c4',marginTop:2}}>{b.type} · {b.region}</div>
                {b.verified&&<span style={{fontSize:9,padding:'2px 7px',borderRadius:6,background:'rgba(29,158,117,0.15)',color:'#5dcaa5',border:'0.5px solid rgba(29,158,117,0.3)',marginTop:4,display:'inline-block'}}>✓ Verified</span>}
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontSize:12,fontWeight:600,color:'#c9a227'}}>{b.views}</div>
                <div style={{fontSize:9,color:'#8fa3c4'}}>views/week</div>
                <div style={{fontSize:9,color:'#c9a227',marginTop:3}}>Tap →</div>
              </div>
            </div>
          ))}
        </>
      )}
      {step==='register'&&(
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
            <button onClick={()=>setStep('list')} style={{background:'transparent',border:'none',color:'#c9a227',fontSize:20,cursor:'pointer'}}>←</button>
            <div style={{fontSize:17,fontWeight:700,color:'#f0f4ff'}}>Register Business</div>
          </div>
          {[{l:'Business Name *',k:'name',tp:'text',ph:'My Eswatini Lodge'},{l:'Phone *',k:'phone',tp:'tel',ph:'+268 2XXX XXXX'},{l:'Email *',k:'email',tp:'email',ph:'info@mybusiness.com'},{l:'Region',k:'region',tp:'text',ph:'Ezulwini Valley'},{l:'Description',k:'desc',tp:'text',ph:'Tell tourists about your business'}].map(f=>(
            <div key={f.k} style={{marginBottom:11}}>
              <div style={{fontSize:11,color:'#8fa3c4',marginBottom:5}}>{f.l}</div>
              <input type={f.tp} value={form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px 13px',color:'#f0f4ff',fontSize:13,outline:'none',boxSizing:'border-box'}}/>
            </div>
          ))}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:'#8fa3c4',marginBottom:5}}>Business Type</div>
            <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={{width:'100%',background:'#0f2040',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px 13px',color:'#c9a227',fontSize:13,outline:'none',cursor:'pointer'}}>
              {['Hotel','Restaurant','Craft Market','Tour Operator','Activity Centre','Transport','Spa','Local Store','Other'].map(o=><option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,color:'#8fa3c4',marginBottom:5}}>Photos of your business (up to 6)</div>
            <label style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,border:'1px dashed rgba(201,162,39,0.4)',borderRadius:10,padding:'14px',cursor:photos.length>=6?'not-allowed':'pointer',color:'#c9a227',fontSize:12,fontWeight:600,opacity:photos.length>=6?0.5:1}}>
              📷 {photos.length>=6?'Maximum 6 photos added':'Tap to add photos'}
              <input type="file" accept="image/*" multiple disabled={photos.length>=6} onChange={handlePhotoUpload} style={{display:'none'}}/>
            </label>
            {photos.length>0&&(
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginTop:10}}>
                {photos.map((p,i)=>(
                  <div key={i} style={{position:'relative'}}>
                    <Img src={p} alt="" style={{width:'100%',height:70,borderRadius:8}}/>
                    <button onClick={()=>removePhoto(i)} style={{position:'absolute',top:3,right:3,width:20,height:20,borderRadius:'50%',border:'none',background:'rgba(10,22,40,0.85)',color:'#e24b4a',fontSize:12,cursor:'pointer',lineHeight:1}}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button style={styles.btnPrimary} onClick={()=>{if(!form.name||!form.phone||!form.email){alert('Please fill required fields');return;}setStep('payment');}}>Continue to Payment →</button>
        </div>
      )}
      {step==='payment'&&(
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
            <button onClick={()=>setStep('register')} style={{background:'transparent',border:'none',color:'#c9a227',fontSize:20,cursor:'pointer'}}>←</button>
            <div style={{fontSize:17,fontWeight:700,color:'#f0f4ff'}}>Payment</div>
          </div>
          <div style={{background:'rgba(201,162,39,0.08)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:14,padding:14,marginBottom:18}}>
            <div style={{fontSize:12,color:'#8fa3c4',marginBottom:3}}>Listing for: <span style={{color:'#f0f4ff',fontWeight:600}}>{form.name}</span></div>
            <div style={{fontSize:24,fontWeight:700,color:'#c9a227'}}>E200.00</div>
            <div style={{fontSize:11,color:'#8fa3c4'}}>Monthly listing fee — first month</div>
          </div>
          <div style={{marginBottom:11}}>
            <div style={{fontSize:11,color:'#8fa3c4',marginBottom:5}}>Card Number</div>
            <input value={card} onChange={e=>setCard(e.target.value.replace(/\D/g,'').replace(/(\d{4})/g,'$1 ').trim().slice(0,19))} placeholder="1234 5678 9012 3456" maxLength={19} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'11px 13px',color:'#f0f4ff',fontSize:16,outline:'none',boxSizing:'border-box',letterSpacing:2}}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:18}}>
            <div>
              <div style={{fontSize:11,color:'#8fa3c4',marginBottom:5}}>Expiry</div>
              <input value={exp} onChange={e=>setExp(e.target.value)} placeholder="MM/YY" maxLength={5} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'11px 13px',color:'#f0f4ff',fontSize:13,outline:'none',boxSizing:'border-box'}}/>
            </div>
            <div>
              <div style={{fontSize:11,color:'#8fa3c4',marginBottom:5}}>CVV</div>
              <input value={cvv} onChange={e=>setCvv(e.target.value.replace(/\D/g,''))} placeholder="123" maxLength={3} type="password" style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'11px 13px',color:'#f0f4ff',fontSize:13,outline:'none',boxSizing:'border-box'}}/>
            </div>
          </div>
          <div style={{background:'rgba(29,158,117,0.08)',border:'0.5px solid rgba(29,158,117,0.2)',borderRadius:10,padding:10,marginBottom:14,display:'flex',gap:7,alignItems:'center'}}>
            <span>🔒</span><div style={{fontSize:11,color:'#5dcaa5'}}>Secured with 256-bit SSL encryption</div>
          </div>
          <button style={{...styles.btnPrimary,marginBottom:8,opacity:saving?0.6:1}} disabled={saving} onClick={pay}>{saving?'Saving…':'Pay E200 and Submit Listing'}</button>
          <button style={{width:'100%',padding:'10px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:'transparent',color:'#8fa3c4',cursor:'pointer',fontSize:13}} onClick={()=>setStep('register')}>← Back</button>
        </div>
      )}
    </div>
  );
}

// ── STYLES ────────────────────────────────────────────────
const styles = {
  splash:{minHeight:'100vh',background:'linear-gradient(160deg,#0a1628 0%,#0d1f3c 40%,#0a1628 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'2rem',position:'relative',overflow:'hidden'},
  splashGlow:{position:'absolute',top:'20%',left:'50%',transform:'translateX(-50%)',width:300,height:300,background:'radial-gradient(circle,rgba(201,162,39,0.14) 0%,transparent 70%)',borderRadius:'50%',pointerEvents:'none'},
  splashTitle:{fontSize:48,fontWeight:700,color:'#f0f4ff',margin:'0 0 6px',letterSpacing:-1},
  gold:{color:'#c9a227'},
  btnPrimary:{background:'linear-gradient(135deg,#c9a227,#e8b93a)',color:'#0a1628',border:'none',padding:'13px 36px',borderRadius:50,fontSize:15,fontWeight:700,cursor:'pointer',width:'100%',maxWidth:480},
  authInput:{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'11px 13px',color:'#f0f4ff',fontSize:14,outline:'none',marginBottom:11,boxSizing:'border-box',fontFamily:'inherit'},
  app:{minHeight:'100vh',background:'#0a1628',display:'flex',flexDirection:'column',maxWidth:480,margin:'0 auto'},
  topbar:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'calc(11px + env(safe-area-inset-top)) 15px 11px',borderBottom:'0.5px solid rgba(201,162,39,0.25)',background:'rgba(10,22,40,0.98)',position:'sticky',top:0,zIndex:100,flexShrink:0},
  content:{flex:1,overflowY:'auto',padding:14},
  bottomNav:{display:'flex',justifyContent:'space-around',padding:'7px 0 calc(11px + env(safe-area-inset-bottom))',borderTop:'0.5px solid rgba(201,162,39,0.25)',background:'rgba(10,22,40,0.98)',position:'sticky',bottom:0,flexShrink:0},
  navItem:{display:'flex',flexDirection:'column',alignItems:'center',gap:2,cursor:'pointer',padding:'2px 3px',borderRadius:9},
  navActive:{display:'flex',flexDirection:'column',alignItems:'center',gap:2,cursor:'pointer',padding:'2px 3px',borderRadius:9,background:'rgba(201,162,39,0.1)'},
  sosBtn:{display:'flex',alignItems:'center',gap:9,background:'rgba(226,75,74,0.1)',border:'1px solid rgba(226,75,74,0.3)',borderRadius:12,padding:'10px 13px',marginBottom:13,cursor:'pointer'},
  heroBanner:{background:'linear-gradient(135deg,#1a3a5c,#0d2540)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:16,padding:18,marginBottom:13},
  heroBadge:{fontSize:10,color:'#f5d87a',background:'rgba(201,162,39,0.15)',border:'0.5px solid rgba(201,162,39,0.4)',padding:'3px 9px',borderRadius:20,display:'inline-block',marginBottom:9,fontWeight:600},
  hstat:{flex:1,background:'rgba(201,162,39,0.08)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:10,padding:'9px 7px',textAlign:'center'},
  aiCard:{background:'rgba(83,74,183,0.15)',border:'0.5px solid rgba(131,122,221,0.35)',borderRadius:14,padding:'12px 14px',marginBottom:14,display:'flex',alignItems:'center',gap:10,cursor:'pointer'},
  sectionTitle:{fontSize:14,fontWeight:600,color:'#f0f4ff',marginBottom:11,marginTop:3},
  grid:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14},
  card:{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:13,overflow:'hidden',cursor:'pointer',position:'relative'},
  listCard:{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:13,padding:'11px 12px',marginBottom:9,display:'flex',alignItems:'center',gap:11},
  tag:{fontSize:10,padding:'2px 7px',borderRadius:20,border:'0.5px solid rgba(201,162,39,0.3)',color:'#c9a227',background:'rgba(201,162,39,0.08)'},
  badge:{fontSize:10,padding:'4px 9px',borderRadius:20,border:'0.5px solid rgba(201,162,39,0.3)',color:'#c9a227',background:'rgba(201,162,39,0.08)'},
  bubbleAI:{background:'rgba(83,74,183,0.15)',border:'0.5px solid rgba(131,122,221,0.25)',borderRadius:13,padding:'11px 13px',marginBottom:9,fontSize:12,color:'#f0f4ff',lineHeight:1.7,whiteSpace:'pre-line',maxWidth:'85%'},
  bubbleUser:{background:'rgba(201,162,39,0.12)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:13,padding:'11px 13px',marginBottom:9,fontSize:12,color:'#f0f4ff',lineHeight:1.7,whiteSpace:'pre-line',maxWidth:'85%',marginLeft:'auto'},
  chatInput:{flex:1,background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:24,padding:'10px 15px',color:'#f0f4ff',fontSize:13,outline:'none',fontFamily:'inherit'},
  sendBtn:{width:42,height:42,borderRadius:'50%',background:'linear-gradient(135deg,#c9a227,#e8b93a)',border:'none',cursor:'pointer',fontSize:15,color:'#0a1628',fontWeight:700,flexShrink:0},
  pill:{padding:'5px 11px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.25)',fontSize:10,cursor:'pointer',background:'rgba(255,255,255,0.04)',color:'#f0f4ff',fontFamily:'inherit'},
};

export default App;