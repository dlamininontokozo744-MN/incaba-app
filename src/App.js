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

// ── TRANSLATIONS ──────────────────────────────────────────
const T = {
en: { explore:'Explore Eswatini ✦', tagline:"Unlocking Eswatini's Hidden Treasures", sub:'The Smart Digital Tourism Ecosystem 🇸🇿', offline:'9 Languages · Offline Ready', welcome:"Welcome to Africa's Hidden Fortress 💎", welcomeSub:'Discover breathtaking landscapes, vibrant culture, and unforgettable experiences.', attractions:'Attractions', restaurants:'Restaurants', hotels:'Hotels', topAttractions:'Top Attractions', hiddenGem:'Hidden Gem 💎', aiTitle:'Incaba AI Guide', aiSub:'Ask anything about Eswatini', navigate:'Navigate', home:'Home', ai:'AI Guide', business:'Business', explore2:'Explore', translate:'Translate', compare:'Compare', sos:'SOS Emergency Mode', sosSub:'Tap to share location with emergency services', weather:'Weather Today', currency:'Currency Converter', reviews:'Tourist Reviews', writeReview:'Write a Review', submit:'Submit', cancel:'Cancel', getDir:'Get Directions', savePlace:'❤️ Save Place', about:'About', location:'📍 Location', hours:'🕐 Opening Hours', price:'💰 Entry Fee', tips:'💡 Travel Tips', signIn:'Sign In', signUp:'Sign Up', logout:'Logout', welcome2:'Welcome back', createAccount:'Create Account', virtualTour:'🥽 Virtual Tour', orderFood:'🛒 Order Food', comparePrice:'⚖️ Compare Prices' },
ss: { explore:'Hlola Eswatini ✦', tagline:'Sivula Tigugu Letifihlekile Tase-Eswatini', sub:'Inhlelo Lehlakaniphile Yekuvakasha 🇸🇿', offline:'Tilimi Letingu-9 · Isebenta Ungaxhunyiwe', welcome:'Siyakemukela e-Africa Incaba Lefihlekile 💎', welcomeSub:'Tola tindzawo letimangalisako, inhlalo-mphilo, netilwimi letingakhohlwakali.', attractions:'Tindzawo', restaurants:'Emadlelo', hotels:'Emahhotela', topAttractions:'Tindzawo Letiphambili', hiddenGem:'Sigugu Lesikhulu 💎', aiTitle:'Umcondzi we-Incaba AI', aiSub:'Butseka noma yini nge-Eswatini', navigate:'Hamba', home:'Ekhaya', ai:'Umcondzi', business:'Ibhizinisi', explore2:'Hlola', translate:'Humusha', compare:'Qhatanisa', sos:'Isimo Sehhatsi', sosSub:'Cindzetela wabelane ndzawo yakho nebaphephisi', weather:'Isimo Selizulu Lamuhla', currency:'Shintsha Imali', reviews:'Tibuka Tetivakashi', writeReview:'Bhala Tibuka', submit:'Thumela', cancel:'Yekela', getDir:'Tsatsa Indlela', savePlace:'❤️ Gcina Indawo', about:'Mayelana', location:'📍 Ndzawo', hours:'🕐 Sikhati Sekuvulwa', price:'💰 Inkokhelo', tips:'💡 Imilayeto Yekuvakasha', signIn:'Ngena', signUp:'Bhalisa', logout:'Phuma', welcome2:'Siyakemukela', createAccount:'Yenta Akhawunti', virtualTour:'🥽 Vaka Nge-Virtual', orderFood:'🛒 Odela Kudla', comparePrice:'⚖️ Qhatanisa Tintengo' },
zu: { explore:'Hlola i-Eswatini ✦', tagline:'Sivula Amagugu Asefihliwe Ase-Eswatini', sub:'Uhlelo Lokuhlakanipha Lokuvakasha 🇸🇿', offline:'Izilimi Eziyi-9 · Isebenza Ngaphandle Kwe-Intanethi', welcome:'Siyakwamukela e-Afrika Insaba Efihliwe 💎', welcomeSub:'Thola izindawo ezimangalisayo, amasiko ashisayo, nezilwimi ezingakhohlakali.', attractions:'Izindawo', restaurants:'Ama-Restorenti', hotels:'Amahhotela', topAttractions:'Izindawo Eziphezulu', hiddenGem:'Igugu Elisifihlekile 💎', aiTitle:'Isiqondisi se-Incaba AI', aiSub:'Buza noma yini nge-Eswatini', navigate:'Hamba', home:'Ekhaya', ai:'Isiqondisi', business:'Ibhizinisi', explore2:'Hlola', translate:'Humusha', compare:'Qhatanisa', sos:'Isimo Sezimo', sosSub:'Thepha ukwabelana nendzawo yakho namasevisi lokuphutfumako', weather:'Simo Selitulu Namuhla', currency:'Isiguquli Semali', reviews:'Izibuyekezo Zezivakashi', writeReview:'Bhala Ukubuyekeza', submit:'Thumela', cancel:'Khansela', getDir:'Thola Izikhombo', savePlace:'❤️ Gcina Indawo', about:'Mayelana', location:'📍 Indawo', hours:'🕐 Amahora Okuvula', price:'💰 Imali Yokungena', tips:'💡 Amacebo Okuvakasha', signIn:'Ngena', signUp:'Bhalisa', logout:'Phuma', welcome2:'Siyakwamukela futhi', createAccount:'Dala I-Akhawunti', virtualTour:'🥽 Ithiyetha Elikhulu', orderFood:'🛒 Odela Ukudla', comparePrice:'⚖️ Qhatanisa Amanani' },
af: { explore:'Verken Eswatini ✦', tagline:"Ontsluit Eswatini se Verborge Skatte", sub:'Die Slim Digitale Toerisme-Ekosisteem 🇸🇿', offline:'9 Tale · Vanlyn Gereed', welcome:"Welkom by Afrika se Verborge Vesting 💎", welcomeSub:'Ontdek asemrowende landseigte, lewendige kultuur en onvergeetlike ervarings.', attractions:'Besienswaardighede', restaurants:'Restaurante', hotels:'Hotelle', topAttractions:'Top Besienswaardighede', hiddenGem:'Verborge Juweel 💎', aiTitle:'Incaba KI-Gids', aiSub:'Vra enigiets oor Eswatini', navigate:'Navigeer', home:'Tuis', ai:'KI-Gids', business:'Besigheid', explore2:'Verken', translate:'Vertaal', compare:'Vergelyk', sos:'SOS Noodmodus', sosSub:'Tik om ligging met nooddienste te deel', weather:'Weer Vandag', currency:'Geldomskakelaar', reviews:'Toeriste-resensies', writeReview:'Skryf Resensie', submit:'Indien', cancel:'Kanselleer', getDir:'Kry Aanwysings', savePlace:'❤️ Stoor Plek', about:'Oor', location:'📍 Ligging', hours:'🕐 Openingsure', price:'💰 Toegangsgeld', tips:'💡 Reistips', signIn:'Meld Aan', signUp:'Registreer', logout:'Meld Af', welcome2:'Welkom terug', createAccount:'Skep Rekening', virtualTour:'🥽 Virtuele Toer', orderFood:'🛒 Bestel Kos', comparePrice:'⚖️ Vergelyk Pryse' },
pt: { explore:'Explorar Eswatini ✦', tagline:'Desbloqueando os Tesouros Escondidos de Eswatini', sub:'O Ecossistema de Turismo Digital Inteligente 🇸🇿', offline:'9 Idiomas · Pronto para Uso Offline', welcome:'Bem-vindo à Fortaleza Oculta de África 💎', welcomeSub:'Descubra paisagens deslumbrantes, cultura vibrante e experiências inesquecíveis.', attractions:'Atrações', restaurants:'Restaurantes', hotels:'Hotéis', topAttractions:'Principais Atrações', hiddenGem:'Joia Escondida 💎', aiTitle:'Guia IA Incaba', aiSub:'Pergunte qualquer coisa sobre Eswatini', navigate:'Navegar', home:'Início', ai:'Guia IA', business:'Negócios', explore2:'Explorar', translate:'Traduzir', compare:'Comparar', sos:'Modo de Emergência SOS', sosSub:'Toque para partilhar localização com serviços de emergência', weather:'Tempo Hoje', currency:'Conversor de Moeda', reviews:'Avaliações de Turistas', writeReview:'Escrever Avaliação', submit:'Enviar', cancel:'Cancelar', getDir:'Obter Direções', savePlace:'❤️ Guardar Local', about:'Sobre', location:'📍 Localização', hours:'🕐 Horário de Abertura', price:'💰 Taxa de Entrada', tips:'💡 Dicas de Viagem', signIn:'Entrar', signUp:'Registar', logout:'Sair', welcome2:'Bem-vindo de volta', createAccount:'Criar Conta', virtualTour:'🥽 Visita Virtual', orderFood:'🛒 Encomendar Comida', comparePrice:'⚖️ Comparar Preços' },
fr: { explore:'Explorer Eswatini ✦', tagline:"Déverrouiller les Trésors Cachés d'Eswatini", sub:"L'Écosystème Touristique Numérique Intelligent 🇸🇿", offline:'9 Langues · Prêt Hors Ligne', welcome:"Bienvenue dans la Forteresse Cachée d'Afrique 💎", welcomeSub:'Découvrez des paysages à couper le souffle, une culture vibrante et des expériences inoubliables.', attractions:'Attractions', restaurants:'Restaurants', hotels:'Hôtels', topAttractions:'Meilleures Attractions', hiddenGem:'Joyau Caché 💎', aiTitle:'Guide IA Incaba', aiSub:"Demandez n'importe quoi sur Eswatini", navigate:'Naviguer', home:'Accueil', ai:'Guide IA', business:'Entreprise', explore2:'Explorer', translate:'Traduire', compare:'Comparer', sos:"Mode d'Urgence SOS", sosSub:"Appuyez pour partager l'emplacement avec les services d'urgence", weather:"Météo Aujourd'hui", currency:'Convertisseur de Devises', reviews:'Avis des Touristes', writeReview:'Écrire un Avis', submit:'Soumettre', cancel:'Annuler', getDir:'Obtenir des Directions', savePlace:'❤️ Sauvegarder', about:'À Propos', location:'📍 Emplacement', hours:"🕐 Heures d'Ouverture", price:"💰 Frais d'Entrée", tips:'💡 Conseils de Voyage', signIn:'Se Connecter', signUp:"S'inscrire", logout:'Se Déconnecter', welcome2:'Bon Retour', createAccount:'Créer un Compte', virtualTour:'🥽 Visite Virtuelle', orderFood:'🛒 Commander', comparePrice:'⚖️ Comparer les Prix' },
de: { explore:'Eswatini Erkunden ✦', tagline:'Die Verborgenen Schätze Eswatinis Erschließen', sub:'Das Intelligente Digitale Tourismus-Ökosystem 🇸🇿', offline:'9 Sprachen · Offline Bereit', welcome:"Willkommen in Afrikas Verborgener Festung 💎", welcomeSub:'Entdecken Sie atemberaubende Landschaften, lebendige Kultur und unvergessliche Erlebnisse.', attractions:'Sehenswürdigkeiten', restaurants:'Restaurants', hotels:'Hotels', topAttractions:'Top Sehenswürdigkeiten', hiddenGem:'Verborgenes Juwel 💎', aiTitle:'Incaba KI-Führer', aiSub:'Fragen Sie alles über Eswatini', navigate:'Navigieren', home:'Startseite', ai:'KI-Führer', business:'Geschäft', explore2:'Erkunden', translate:'Übersetzen', compare:'Vergleichen', sos:'SOS-Notfallmodus', sosSub:'Tippen Sie, um den Standort mit Notfalldiensten zu teilen', weather:'Wetter Heute', currency:'Währungsrechner', reviews:'Touristenbewertungen', writeReview:'Bewertung Schreiben', submit:'Einreichen', cancel:'Abbrechen', getDir:'Wegbeschreibung', savePlace:'❤️ Ort Speichern', about:'Über', location:'📍 Standort', hours:'🕐 Öffnungszeiten', price:'💰 Eintrittsgebühr', tips:'💡 Reisetipps', signIn:'Anmelden', signUp:'Registrieren', logout:'Abmelden', welcome2:'Willkommen Zurück', createAccount:'Konto Erstellen', virtualTour:'🥽 Virtuelle Tour', orderFood:'🛒 Essen Bestellen', comparePrice:'⚖️ Preise Vergleichen' },
zh: { explore:'探索斯威士兰 ✦', tagline:'解锁斯威士兰的隐藏宝藏', sub:'智能数字旅游生态系统 🇸🇿', offline:'9种语言 · 离线可用', welcome:'欢迎来到非洲的隐藏堡垒 💎', welcomeSub:'探索令人叹为观止的风景、充满活力的文化和难忘的体验。', attractions:'景点', restaurants:'餐厅', hotels:'酒店', topAttractions:'热门景点', hiddenGem:'隐藏宝石 💎', aiTitle:'Incaba 人工智能向导', aiSub:'询问任何关于斯威士兰的问题', navigate:'导航', home:'主页', ai:'AI向导', business:'商业', explore2:'探索', translate:'翻译', compare:'比较', sos:'SOS紧急模式', sosSub:'点击与紧急服务共享位置', weather:'今日天气', currency:'货币换算器', reviews:'游客评论', writeReview:'写评论', submit:'提交', cancel:'取消', getDir:'获取路线', savePlace:'❤️ 收藏地点', about:'关于', location:'📍 位置', hours:'🕐 营业时间', price:'💰 门票费用', tips:'💡 旅行提示', signIn:'登录', signUp:'注册', logout:'退出', welcome2:'欢迎回来', createAccount:'创建账户', virtualTour:'🥽 虚拟游览', orderFood:'🛒 点餐', comparePrice:'⚖️ 比较价格' },
ar: { explore:'استكشف إسواتيني ✦', tagline:'اكتشف الكنوز الخفية لإسواتيني', sub:'نظام السياحة الرقمية الذكية 🇸🇿', offline:'٩ لغات · متاح بدون إنترنت', welcome:'مرحباً بك في القلعة الخفية لأفريقيا 💎', welcomeSub:'اكتشف مناظر طبيعية خلابة وثقافة نابضة بالحياة وتجارب لا تُنسى.', attractions:'المعالم السياحية', restaurants:'المطاعم', hotels:'الفنادق', topAttractions:'أفضل المعالم', hiddenGem:'الجوهرة المخفية 💎', aiTitle:'دليل Incaba الذكي', aiSub:'اسأل أي شيء عن إسواتيني', navigate:'التنقل', home:'الرئيسية', ai:'الدليل الذكي', business:'الأعمال', explore2:'استكشف', translate:'ترجم', compare:'قارن', sos:'وضع الطوارئ SOS', sosSub:'انقر لمشاركة موقعك مع خدمات الطوارئ', weather:'الطقس اليوم', currency:'محوّل العملات', reviews:'تقييمات السياح', writeReview:'اكتب تقييماً', submit:'إرسال', cancel:'إلغاء', getDir:'احصل على الاتجاهات', savePlace:'❤️ احفظ المكان', about:'حول', location:'📍 الموقع', hours:'🕐 ساعات العمل', price:'💰 رسوم الدخول', tips:'💡 نصائح السفر', signIn:'تسجيل الدخول', signUp:'إنشاء حساب', logout:'تسجيل الخروج', welcome2:'مرحباً بعودتك', createAccount:'إنشاء حساب', virtualTour:'🥽 جولة افتراضية', orderFood:'🛒 طلب الطعام', comparePrice:'⚖️ مقارنة الأسعار' },
};

const RATES_TO_SZL = {
USD: 18.5, ZAR: 1.0, EUR: 20.1, GBP: 23.4, BWP: 1.37,
CNY: 2.55, AED: 5.04, INR: 0.222, AUD: 12.1, CAD: 13.6,
JPY: 0.122, CHF: 20.8, BRL: 3.55, MXN: 0.95, NGN: 0.012,
KES: 0.143, GHS: 1.21, ETB: 0.33, TZS: 0.0071, UGX: 0.0049,

};

const places = [
{ name:'Hlane Royal Reserve', region:'Lubombo Region', desc:"Lions, elephants & white rhinos in Eswatini's largest park", fullDesc:"Hlane Royal National Park is Eswatini's largest protected area covering 22,000 hectares. Named by King Sobhuza II — Hlane means wilderness in siSwati. Home to lions, elephants, white rhinos, giraffes, zebras and over 300 bird species.", rating:'4.9', category:'Wildlife', img:hlane, gallery:[hlane,hlane,hlane], location:'Lubombo Region, 67km from Manzini', hours:'Open daily 6am – 6pm', price:'E 150 per person', tips:['Book guided game drives in advance','Best time is early morning','Bring binoculars for bird watching'], videoId:'KWr0KUZLPi4', videoTitle:'Self-Drive Safari at Hlane Royal National Park' },
{ name:'Mantenga Falls', region:'Hhohho Region', desc:'Breathtaking 95m waterfall in the Ezulwini Valley', fullDesc:"Mantenga Falls drops 95 metres into a pristine pool surrounded by lush indigenous forest. One of Eswatini's most spectacular natural wonders. Perfect for swimming, hiking and photography.", rating:'4.8', category:'Nature', img:mantenga, gallery:[mantenga,mantenga,mantenga], location:'Ezulwini Valley, Hhohho Region', hours:'Open daily 7am – 5pm', price:'E 80 per person', tips:['Wear waterproof shoes','Best after rainy season','Swimming allowed below the falls'], videoId:'X9CLKGqqkjU', videoTitle:'Ezulwini Valley 4K HDR Drone Tour' },
{ name:'Lobamba Royal Village', region:'Manzini Region', desc:'Heart of Swazi culture — home of the King', fullDesc:"Lobamba is the royal and legislative capital of Eswatini. Home of the Queen Mother and where the Incwala and Umhlanga ceremonies take place. Contains the National Museum and Parliament buildings.", rating:'4.7', category:'Culture', img:lobamba, gallery:[lobamba,lobamba,lobamba], location:'Ezulwini Valley, Manzini Region', hours:'Open daily 8am – 4pm', price:'E 50 per person', tips:['Dress respectfully','Visit during Umhlanga in August','Photography may require permission'], videoId:'604KjnoBw8o', videoTitle:'Eswatini Lifestyle — Mantenga Cultural Village' },
{ name:'Swazi Candles Market', region:'Malkerns Valley', desc:'World-famous handmade candles and craft market', fullDesc:"Artisans hand-craft beautiful animal-shaped candles using traditional techniques. The market features local crafts, textiles, jewelry and fresh produce. Perfect for authentic Swazi souvenirs.", rating:'4.6', category:'Culture', img:swazi, gallery:[swazi,swazi,swazi], location:'Malkerns Valley, Manzini Region', hours:'Open daily 8am – 5pm', price:'Free entry', tips:['Bargaining is acceptable','Buy candles as unique gifts','Try the local food stalls'], videoId:'gZY5KT6bhGY', videoTitle:'Mantenga Waterfalls in Eswatini' },
{ name:'Malolotja Nature Reserve', region:'Hhohho Region', desc:'Ancient mountains, rare orchids and cable car rides', fullDesc:"Malolotja Nature Reserve contains some of the oldest geological formations on earth. Rare indigenous flora, rare bird species and a famous canopy zipline tour. Less than 2% of tourists ever visit this hidden gem.", rating:'4.8', category:'Nature', img:malolotja, gallery:[malolotja,malolotja2,malolotja3], location:'Northwestern Eswatini, Hhohho Region', hours:'Open daily 6am – 6pm', price:'E 120 per person', tips:['Canopy zipline tour is a must','Bring warm clothing','Great for serious hikers'], videoId:'0ny1QSno2Go', videoTitle:'Siyakwemukela — Kingdom of Eswatini Cultural Experience' },
{ name:'Sibebe Rock', region:'Hhohho Region', desc:"World's second largest rock near Mbabane", fullDesc:"The world's second largest exposed granite rock. Just 10km from capital Mbabane, offering challenging hiking trails and panoramic views across the entire country.", rating:'4.5', category:'Adventure', img:sibebe, gallery:[sibebe,sibebe,sibebe], location:'10km from Mbabane, Hhohho Region', hours:'Open daily 6am – 6pm', price:'E 60 per person', tips:['Wear proper hiking shoes','Go early to avoid heat','Bring plenty of water'], videoId:'sDN7HXh5rdc', videoTitle:'Bhubesi Camp — Hlane Royal National Park' },
{ name:'Shiselweni Region', region:'Shiselweni Region', desc:"Eswatini's southern paradise — untouched and spectacular", fullDesc:"Shiselweni is Eswatini's southernmost region and one of its most beautiful. Home to Nhlangano town, vast forests, rivers and traditional Swazi villages. A true off-the-beaten-path destination.", rating:'4.7', category:'Nature', img:shiselweni, gallery:[shiselweni,shiselweni2,shiselweni3], location:'Southern Eswatini, Shiselweni Region', hours:'Open all year round', price:'Free to explore', tips:['Visit Nhlangano town for local culture','Great for eco-tourism','Best during dry season May–September'], videoId:'clEnwhClD1o', videoTitle:'A Day Trip to Eswatini — Mantenga' },
];

const restaurants = [
{ name:"Malandela's Restaurant", region:'Malkerns', desc:'Traditional Swazi cuisine in a beautiful garden setting', rating:'4.8', icon:'🍴', price:'E 80–200', hours:'Mon–Sun 11am–9pm',
menu:[

{ category:'Starters', items:[{name:'Sishwala Bites',price:45,desc:'Traditional maize bites with dipping sauce'},{name:'Swazi Soup',price:55,desc:'Rich traditional vegetable soup with bread'}]},
{ category:'Main Course', items:[{name:'Grilled Tilapia',price:145,desc:'Fresh local fish with sishwala and vegetables'},{name:'Swazi Chicken',price:135,desc:'Free-range chicken in traditional sauce'},{name:'Braai Platter',price:185,desc:'Mixed grilled meats with pap and salad'}]},
{ category:'Traditional', items:[{name:'Umncweba Plate',price:95,desc:'Dried Swazi meat with emasi and rice'},{name:'Sishwala Special',price:75,desc:'Thick maize porridge with relish and meat'}]},
{ category:'Desserts', items:[{name:'Marula Ice Cream',price:45,desc:'Local marula fruit ice cream'},{name:'Swazi Fritters',price:35,desc:'Traditional fried dough with syrup'}]},
{ category:'Drinks', items:[{name:'Tjwala',price:25,desc:'Traditional Swazi fermented beer'},{name:'Marula Juice',price:30,desc:'Fresh marula fruit juice'},{name:'Soft Drinks',price:20,desc:'Coke, Sprite, Fanta'}]},
]
},
{ name:"Tum's George Hotel", region:'Mbabane', desc:'Fine dining with panoramic views of the Ezulwini Valley', rating:'4.6', icon:'🍽️', price:'E 120–300', hours:'Daily 7am–10pm',
menu:[
{ category:'Breakfast', items:[{name:'Full English',price:95,desc:'Eggs, bacon, sausage, toast and juice'},{name:'Continental',price:75,desc:'Pastries, fruit, yoghurt and coffee'}]},

{ category:'Mains', items:[{name:'Beef Tenderloin',price:245,desc:'Premium cut with seasonal vegetables'},{name:'Seafood Pasta',price:195,desc:'Imported seafood in cream sauce'},{name:'Vegetarian Platter',price:145,desc:'Seasonal vegetables with quinoa'}]},
{ category:'Drinks', items:[{name:'House Wine',price:85,desc:'Red or white per glass'},{name:'Cocktails',price:95,desc:'Selection of mixed drinks'},{name:'Fresh Juice',price:35,desc:'Orange, mango or mixed'}]},
]
},
{ name:'Foresters Arms Hotel', region:'Malkerns', desc:'Classic pub meals in a cozy countryside atmosphere', rating:'4.4', icon:'🏡', price:'E 60–150', hours:'Daily 11am–10pm',
menu:[
{ category:'Pub Meals', items:[{name:'Beef Burger',price:95,desc:'100% beef patty with chips'},{name:'Fish & Chips',price:105,desc:'Battered fish with thick-cut chips'},{name:'Club Sandwich',price:85,desc:'Triple-decker with chips'}]},
{ category:'Grills', items:[{name:'Ribeye Steak',price:185,desc:'300g ribeye with salad and chips'},{name:'Chicken Strips',price:95,desc:'Crispy chicken with dipping sauce'}]},
{ category:'Drinks', items:[{name:'Draft Beer',price:35,desc:'Local Sibebe Lager on tap'},{name:'Ciders',price:40,desc:'Apple or mixed berry'},{name:'Soft Drinks',price:20,desc:'All popular brands'}]},
]
},
{ name:'Gables Food Court', region:'Ezulwini', desc:'Local and international food options for every budget', rating:'4.2', icon:'🛍️', price:'E 40–120', hours:'Daily 9am–8pm',
menu:[
{ category:'Fast Food', items:[{name:'Chicken & Chips',price:65,desc:'Fried chicken with seasoned chips'},{name:'Pizza Slice',price:45,desc:'Various toppings available'},{name:'Hot Dog',price:35,desc:'Classic with mustard and ketchup'}]},
{ category:'Local Food', items:[{name:'Pap & Stew',price:45,desc:'Traditional maize pap with beef stew'},{name:'Vetkoek',price:25,desc:'Fried dough with mince filling'}]},
{ category:'Drinks', items:[{name:'Milkshake',price:40,desc:'Chocolate, vanilla or strawberry'},{name:'Soft Drinks',price:20,desc:'All popular brands'},{name:'Water',price:15,desc:'Still or sparkling'}]},
]
},

];

const hotels = [
{ name:'Royal Swazi Spa & Hotel', region:'Ezulwini Valley', desc:'Luxury 5-star hotel with spa, casino and golf course', rating:'4.9', icon:'🏨', price:'E 1,800–4,500/night', stars:'★★★★★', amenities:['♨️ Luxury Spa','🎰 Casino','⛳ Golf Course','🏊 Pool','🍽️ Fine Dining','💪 Gym'] },
{ name:'Mantengha Cultural Village', region:'Ezulwini', desc:'Authentic cultural experience in traditional Swazi huts', rating:'4.7', icon:'🛖', price:'E 600–1,200/night', stars:'★★★★☆', amenities:['🎭 Cultural Shows','🌿 Nature Walks','🍽️ Traditional Food','📸 Photography Tours'] },
{ name:'Foresters Arms', region:'Malkerns', desc:'Charming country hotel surrounded by forest and gardens', rating:'4.5', icon:'🌲', price:'E 800–1,800/night', stars:'★★★★☆', amenities:['🎣 Fishing','🐎 Horse Riding','🍺 Pub','🌳 Forest Trails'] },
{ name:'Lidwala Backpacker Lodge', region:'Mbabane', desc:'Budget-friendly lodge with stunning rock formations', rating:'4.3', icon:'⛺', price:'E 150–400/night', stars:'★★★☆☆', amenities:['🔥 Braai Area','🌄 Rock Views','🚿 Shared Bathrooms','📶 Free WiFi'] },
];

const localStores = [
{ name:'Swazi Candles', type:'Craft', region:'Malkerns', priceRange:'E 50–500', rating:'4.8', desc:'World-famous handmade candles and crafts' },
{ name:'Gone Rural', type:'Craft', region:'Malkerns', priceRange:'E 100–2,000', rating:'4.7', desc:'Women-made woven baskets and home décor' },
{ name:'Ngwenya Glass Factory', type:'Glass Art', region:'Ngwenya', priceRange:'E 80–800', rating:'4.6', desc:'Recycled glass art and sculptures' },
{ name:'Manzini Market', type:'Market', region:'Manzini', priceRange:'E 10–200', rating:'4.3', desc:'Largest traditional market in Eswatini' },
];

const weatherData = {
'Today': [{name:'Mbabane',temp:22,icon:'⛅',desc:'Partly Cloudy',humidity:'65%',wind:'12 km/h',uv:'Moderate'},{name:'Manzini',temp:26,icon:'☀️',desc:'Sunny',humidity:'45%',wind:'8 km/h',uv:'High'},{name:'Lubombo',temp:29,icon:'🌤️',desc:'Clear',humidity:'38%',wind:'15 km/h',uv:'Very High'}],

'Tomorrow': [{name:'Mbabane',temp:19,icon:'🌧️',desc:'Light Rain',humidity:'80%',wind:'20 km/h',uv:'Low'},{name:'Manzini',temp:23,icon:'⛅',desc:'Cloudy',humidity:'60%',wind:'12 km/h',uv:'Moderate'},{name:'Lubombo',temp:27,icon:'☀️',desc:'Sunny',humidity:'35%',wind:'10 km/h',uv:'High'}],
'Wed': [{name:'Mbabane',temp:21,icon:'⛅',desc:'Partly Cloudy',humidity:'58%',wind:'9 km/h',uv:'Moderate'},{name:'Manzini',temp:25,icon:'🌤️',desc:'Mostly Clear',humidity:'42%',wind:'7 km/h',uv:'High'},{name:'Lubombo',temp:30,icon:'☀️',desc:'Hot & Sunny',humidity:'30%',wind:'11 km/h',uv:'Very High'}],
'Thu': [{name:'Mbabane',temp:18,icon:'🌩️',desc:'Thunderstorms',humidity:'90%',wind:'25 km/h',uv:'Low'},{name:'Manzini',temp:20,icon:'🌧️',desc:'Heavy Rain',humidity:'85%',wind:'22 km/h',uv:'Low'},{name:'Lubombo',temp:24,icon:'⛅',desc:'Cloudy',humidity:'55%',wind:'16 km/h',uv:'Moderate'}],
'Fri': [{name:'Mbabane',temp:23,icon:'☀️',desc:'Sunny',humidity:'40%',wind:'8 km/h',uv:'High'},{name:'Manzini',temp:27,icon:'☀️',desc:'Clear',humidity:'35%',wind:'6 km/h',uv:'Very High'},{name:'Lubombo',temp:31,icon:'☀️',desc:'Hot',humidity:'28%',wind:'9 km/h',uv:'Extreme'}],
'Sat': [{name:'Mbabane',temp:20,icon:'🌤️',desc:'Mostly Clear',humidity:'50%',wind:'10 km/h',uv:'Moderate'},{name:'Manzini',temp:24,icon:'⛅',desc:'Partly Cloudy',humidity:'48%',wind:'9 km/h',uv:'High'},{name:'Lubombo',temp:28,icon:'🌤️',desc:'Warm',humidity:'32%',wind:'12 km/h',uv:'High'}],
'Sun': [{name:'Mbabane',temp:17,icon:'🌧️',desc:'Rainy',

humidity:'85%',wind:'18 km/h',uv:'Low'},{name:'Manzini',temp:21,icon:'⛅',desc:'Overcast',humidity:'70%',wind:'14 km/h',uv:'Low'},{name:'Lubombo',temp:25,icon:'⛅',desc:'Cloudy',humidity:'52%',wind:'13 km/h',uv:'Moderate'}],
};

const LANG_NAMES = { en:'🇬🇧 EN', ss:'🇸🇿 SS', zu:'🇿🇦 ZU', af:'🇿🇦 AF', pt:'🇲🇿 PT', fr:'🇫🇷 FR', de:'🇩🇪 DE', zh:'🇨🇳 ZH', ar:'🇸🇦 AR' };

// ── TRANSLATION DATA ──────────────────────────────────────
const TRANSLATIONS = {
'Hello': { ss:'Sawubona', zu:'Sawubona', af:'Hallo', pt:'Olá', fr:'Bonjour', de:'Hallo', zh:'你好', ar:'مرحبا' },
'Thank you': { ss:'Ngiyabonga', zu:'Ngiyabonga', af:'Dankie', pt:'Obrigado', fr:'Merci', de:'Danke', 

zh:'谢谢', ar:'شكراً' },
'Where is the toilet?': { ss:'Indlu yokuhlambela ikuphi?', zu:'Indlu yangasese ikuphi?', af:'Waar is die toilet?', pt:'Onde é o banheiro?', fr:'Où sont les toilettes?', de:'Wo ist die Toilette?', zh:'厕所在哪里?', ar:'أين الحمام؟' },
'How much does this cost?': { ss:'Ubiza malini loku?', zu:'Kuyimalini loku?', af:'Hoeveel kos dit?', pt:'Quanto custa isso?', fr:'Combien ça coûte?', de:'Wie viel kostet das?', zh:'这个多少钱?', ar:'كم يكلف هذا؟' },
'I need help': { ss:'Ngidinga lusito', zu:'Ngidinga usizo', af:'Ek het hulp nodig', pt:'Preciso de ajuda', fr:"J'ai besoin d'aide", de:'Ich brauche Hilfe', zh:'我需要帮助', ar:'أحتاج مساعدة' },
'Good morning': { ss:'Sawubona ekuseni', zu:'Sawubona ekuseni', af:'Goeie môre', pt:'Bom dia', fr:'Bonjour', de:'Guten Morgen', zh:'早上好', ar:'صباح الخير' },
'Good evening': { ss:'Lihle ntambama', 

zu:'Sawubona ntambama', af:'Goeie aand', pt:'Boa noite', fr:'Bonsoir', de:'Guten Abend', zh:'晚上好', ar:'مساء الخير' },
'Goodbye': { ss:'Sala kahle', zu:'Sala kahle', af:'Totsiens', pt:'Adeus', fr:'Au revoir', de:'Auf Wiedersehen', zh:'再见', ar:'وداعاً' },
'Police': { ss:'Amaphoyisa', zu:'Amaphoyisa', af:'Polisie', pt:'Polícia', fr:'Police', de:'Polizei', zh:'警察', ar:'شرطة' },
'Hospital': { ss:'Sibitela', zu:'Isibhedlela', af:'Hospitaal', pt:'Hospital', fr:'Hôpital', de:'Krankenhaus', zh:'医院', ar:'مستشفى' },
'Water': { ss:'Emanti', zu:'Amanzi', af:'Water', pt:'Água', fr:'Eau', de:'Wasser', zh:'水', ar:'ماء' },
'Food': { ss:'Kudla', zu:'Ukudla', af:'Kos', pt:'Comida', fr:'Nourriture', de:'Essen', zh:'食物', ar:'طعام' },
};

function App() {

const [screen, setScreen] = useState('splash');
const [tab, setTab] = useState('home');
const [lang, setLang] = useState('en');
const [user, setUser] = useState(null);
const [showLangPicker, setShowLangPicker] = useState(false);
const [selectedPlace, setSelectedPlace] = useState(null);
const [selectedRestaurant, setSelectedRestaurant] = useState(null);
const [selectedHotel, setSelectedHotel] = useState(null);
const [showVirtualTour, setShowVirtualTour] = useState(null);
const t = T[lang];

if (screen === 'splash') {
return (
<div style={styles.splash}>
<div style={styles.splashGlow}/>

<div style={{fontSize:72,marginBottom:16}}>💎</div>
<h1 style={styles.splashTitle}>Inc<span style={styles.gold}>aba</span></h1>
<div style={{fontSize:15,color:'#c9a227',fontWeight:600,marginBottom:8}}>{t.tagline}</div>
<p style={{color:'#8fa3c4',fontSize:13,margin:'0 0 16px',lineHeight:1.6}}>{t.sub}</p>
<div style={{display:'flex',gap:6,justifyContent:'center',marginBottom:20,flexWrap:'wrap',maxWidth:320}}>
{Object.entries(LANG_NAMES).map(([code,label])=>(
<button key={code} onClick={()=>setLang(code)} style={{padding:'4px 10px',borderRadius:20,border:0.5px solid ${lang===code?'#c9a227':'rgba(201,162,39,0.3)'}`,background:lang===code?'rgba(201,162,39,0.2)':'transparent',color:lang===code?'#c9a227':'#8fa3c4',fontSize:11,cursor:'pointer'}}>{label}</button>
))}
</div>
<button style={styles.btnPrimary} onClick={()=>setScreen('auth')}>{t.explore}</button>
<p style={{color:'#5f7a9a',fontSize:11,marginTop:16}}>{t.offline}</p>
</div>
);
}

if (screen === 'auth') return <AuthScreen onLogin={(u)=>{setUser(u);setScreen('main');}} t={t}/>;
if (showVirtualTour) return <VirtualTourScreen place={showVirtualTour} 

onBack={()=>setShowVirtualTour(null)} t={t}/>;
if (selectedPlace) return <DetailScreen place={selectedPlace} onBack={()=>setSelectedPlace(null)} t={t} onVirtualTour={()=>setShowVirtualTour(selectedPlace)}/>;
if (selectedRestaurant) return <RestaurantDetail item={selectedRestaurant} onBack={()=>setSelectedRestaurant(null)} t={t}/>;
if (selectedHotel) return <HotelDetail item={selectedHotel} onBack={()=>setSelectedHotel(null)} t={t}/>;

return (
<div style={styles.app}>
<div style={styles.topbar}>
<div style={{display:'flex',alignItems:'center',gap:8}}>
<div 

style={{fontSize:20,width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#c9a227,#e8b93a)',display:'flex',alignItems:'center',justifyContent:'center'}}>💎</div>
<span style={{fontSize:18,fontWeight:700,color:'#f0f4ff'}}>Inc<span style={styles.gold}>aba</span></span>
</div>
<div style={{display:'flex',alignItems:'center',gap:8,position:'relative'}}>
<button onClick={()=>setShowLangPicker(!showLangPicker)} style={{padding:'4px 10px',borderRadius:20,border:'0.5px solid rgba(201,162,39,0.3)',background:'rgba(201,162,39,0.08)',color:'#c9a227',fontSize:11,cursor:'pointer'}}>{LANG_NAMES[lang]} ▾</button>
{showLangPicker&&(

<div style={{position:'absolute',top:32,right:0,background:'#0f2040',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:12,padding:8,zIndex:200,minWidth:140,boxShadow:'0 8px 32px rgba(0,0,0,0.4)'}}>
{Object.entries(LANG_NAMES).map(([code,label])=>(
<div key={code} onClick={()=>{setLang(code);setShowLangPicker(false);}} style={{padding:'8px 12px',borderRadius:8,cursor:'pointer',color:lang===code?'#c9a227':'#f0f4ff',background:lang===code?'rgba(201,162,39,0.1)':'transparent',fontSize:13}}>{label}</div>
))}
</div>
)}
<span style={{fontSize:22}}>🇸🇿</span>
</div>

</div>

<div style={styles.content}>
{tab==='home' && <HomeTab setTab={setTab} onSelect={setSelectedPlace} onSelectRestaurant={setSelectedRestaurant} onSelectHotel={setSelectedHotel} t={t}/>}
{tab==='explore' && <ExploreTab onSelect={setSelectedPlace} onVirtualTour={setShowVirtualTour} t={t}/>}
{tab==='translate' && <TranslateTab t={t} lang={lang}/>}
{tab==='compare' && <CompareTab t={t}/>}
{tab==='map' && <MapTab t={t}/>}
{tab==='ai' && <AITab t={t}/>}
{tab==='business' && <BusinessTab t={t}/>}
</div>

<div style={styles.bottomNav}>
{[

{id:'home', icon:'🏠', label:t.home},
{id:'explore', icon:'🔭', label:t.explore2},
{id:'translate',icon:'🌐', label:t.translate},
{id:'compare', icon:'⚖️', label:t.compare},
{id:'map', icon:'🗺️', label:t.navigate},
{id:'ai', icon:'🤖', label:t.ai},
{id:'business', icon:'🏢', label:t.business},
 ].map(item=>(
<div key={item.id} style={tab===item.id?styles.navActive:styles.navItem} onClick={()=>setTab(item.id)}>
<span style={{fontSize:18}}>{item.icon}</span>
<span style={{fontSize:9,color:tab===item.id?'#c9a227':'#8fa3c4',fontWeight:500}}>{item.label}</span>
</div>
))}
</div>
</div>
);

}

// ── AUTH ──────────────────────────────────────────────────
function AuthScreen({onLogin,t}) {
const [mode,setMode] = useState('login');
const [email,setEmail] = useState('');
const [password,setPassword] = useState('');
const [name,setName] = useState('');
const [error,setError] = useState('');

const handleLogin = ()=>{
if(!email||!password){setError('Please fill in all fields');return;}
if(email&&password.length>=6){onLogin({name:name||email.split('@')[0],email});return;}
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
<button style={{width:'100%',padding:'13px',borderRadius:12,border:'0.5px solid rgba(255,255,255,0.2)',background:'rgba(255,255,255,0.08)',color:'#f0f4ff',fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:16}} onClick={()=>onLogin({name:'Google User',email:'tourist@gmail.com'})}>
<span style={{fontSize:20}}>🌐</span> Continue with Google
</button>
<div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
<div style={{flex:1,height:'0.5px',background:'rgba(255,255,255,0.1)'}}/>
<span style={{fontSize:12,color:'#8fa3c4'}}>or</span>
<div style={{flex:1,height:'0.5px',background:'rgba(255,255,255,0.1)'}}/>

</div>
{mode==='signup'&&<input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={styles.authInput}/>}
<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" type="email" style={styles.authInput}/>
<input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" style={{...styles.authInput,marginBottom:6}}/>
{error&&<div style={{fontSize:12,color:'#e24b4a',marginBottom:10,textAlign:'center'}}>{error}</div>}
<button style={{...styles.btnPrimary,marginBottom:16}} onClick={handleLogin}>{mode==='login'?t.signIn:t.createAccount}</button>

<button style={{width:'100%',padding:'11px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:'transparent',color:'#c9a227',cursor:'pointer',fontSize:14}} onClick={()=>onLogin({name:'Guest',email:'guest'})}>Continue as Guest</button>
</div>
</div>
);
}

// ── VIRTUAL TOUR ──────────────────────────────────────────
function VirtualTourScreen({place,onBack,t}) {
const [tourStep,setTourStep] = useState(0);
const [speaking,setSpeaking] = useState(false);
const [showVideo,setShowVideo] = useState(false);


const tourSteps = [
{ title:Welcome to${place.name}, desc:You are about to experience a virtual tour of one of Eswatini's most magnificent destinations. 
 
{place.location}. 
 
{place.price}. This destination is accessible by car, kombi taxi, or organised tour., icon:'📍' }, { title:'What to See & Do', desc:
 
 

{place.name} is deeply connected to the heritage of the Swazi people and the Kingdom of Eswatini. Visitors are encouraged to be respectful and embrace the local culture.`, icon:'🇸🇿' },
 ];

const speakText = (text) => {
if('speechSynthesis' in window) {
window.speechSynthesis.cancel();
const utterance = new SpeechSynthesisUtterance(text);
utterance.rate = 0.9;
utterance.pitch = 1;
utterance.onstart = ()=>setSpeaking(true);
utterance.onend = ()=>setSpeaking(false);
window.speechSynthesis.speak(utterance);
}
};

const stopSpeaking = ()=>{
window.speechSynthesis.cancel();
setSpeaking(false);
};

return (
<div style={styles.app}>
<div style={{background:'linear-gradient(135deg,#0a1628,#1a3a5c)',padding:'16px',display:'flex',alignItems:'center',gap:12,borderBottom:'0.5px solid rgba(201,162,39,0.25)',flexShrink:0}}>
<button onClick={onBack} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:50,padding:'8px 14px',color:'#f0f4ff',fontSize:13,cursor:'pointer'}}>← {t.cancel}</button>
<div>
<div style={{fontSize:14,fontWeight:700,color:'#c9a227'}}>{t.virtualTour}</div>
<div style={{fontSize:11,color:'#8fa3c4'}}>{place.name}</div>
</div>
</div>

<div style={{flex:1,overflowY:'auto',padding:16}}>
{!showVideo ? (
<>
<div style={{background:'rgba(83,74,183,0.15)',border:'0.5px solid rgba(131,122,221,0.3)',borderRadius:16,padding:20,marginBottom:16,textAlign:'center'}}>
<div style={{fontSize:48,marginBottom:12}}>{tourSteps[tourStep].icon}</div>
<div style={{fontSize:18,fontWeight:700,color:'#c9a227',marginBottom:12}}>{tourSteps[tourStep].title}</div>

<div style={{fontSize:13,color:'#b0c4de',lineHeight:1.8,marginBottom:16}}>{tourSteps[tourStep].desc}</div>
<div style={{display:'flex',gap:8,justifyContent:'center'}}>
<button onClick={()=>speakText(tourSteps[tourStep].desc)} style={{padding:'10px 20px',borderRadius:50,border:'0.5px solid rgba(131,122,221,0.4)',background:speaking?'rgba(131,122,221,0.3)':'rgba(131,122,221,0.15)',color:'#afa9ec',cursor:'pointer',fontSize:13}}>
{speaking?'🔊 Speaking...':'🔊 Listen'}
</button>
{speaking&&<button onClick={stopSpeaking} style={{padding:'10px 16px',borderRadius:50,border:'0.5px solid rgba(226,75,74,0.4)',background:'rgba(226,75,74,0.15)',color:'#e24b4a',cursor:'pointer',fontSize:13}}>⏹ Stop</button>}
</div>
</div>

<div style={{display:'flex',gap:6,justifyContent:'center',marginBottom:16}}>
{tourSteps.map((_,i)=>(
<div key={i} onClick={()=>setTourStep(i)} style={{width:i===tourStep?24:8,height:8,borderRadius:4,background:i===tourStep?'#c9a227':'rgba(201,162,39,0.3)',cursor:'pointer',transition:'all 0.3s'}}/>
))}
</div>

<div style={{display:'flex',gap:10,marginBottom:16}}>
<button 

onClick={()=>setTourStep(p=>Math.max(0,p-1))} disabled={tourStep===0} style={{flex:1,padding:'12px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:'transparent',color:tourStep===0?'#4a5568':'#c9a227',cursor:tourStep===0?'not-allowed':'pointer',fontSize:14}}>← Previous</button>
<button onClick={()=>setTourStep(p=>Math.min(tourSteps.length-1,p+1))} disabled={tourStep===tourSteps.length-1} style={{flex:1,padding:'12px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:tourStep===tourSteps.length-1?'transparent':'rgba(201,162,39,0.15)',color:tourStep===tourSteps.length-1?'#4a5568':'#c9a227',cursor:tourStep===tourSteps.length-1?'not-allowed':'pointer',fontSize:14}}>Next →</button>

</div>

<div style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:14,overflow:'hidden',marginBottom:16}}>
<div style={{padding:'12px 14px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
<div>
<div style={{fontSize:14,fontWeight:600,color:'#f0f4ff',marginBottom:3}}>📹 {place.videoTitle}</div>
<div style={{fontSize:11,color:'#8fa3c4'}}>Real video footage from YouTube</div>
</div>
<button onClick={()=>setShowVideo(true)} style={{padding:'10px 18px',borderRadius:50,background:'linear-gradient(135deg,#c9a227,#e8b93a)',border:'none',color:'#0a1628',fontSize:13,fontWeight:700,cursor:'pointer'}}>▶ Watch</button>
</div>
</div>

<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:16}}>
{place.gallery.map((img,i)=>(
<div key={i} style={{height:80,borderRadius:10,overflow:'hidden'}}>
<img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
</div>
))}
</div>
</>

) : (
<div>
<button onClick={()=>setShowVideo(false)} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:50,padding:'8px 14px',color:'#f0f4ff',fontSize:13,cursor:'pointer',marginBottom:14}}>← Back to Tour</button>
<div style={{borderRadius:16,overflow:'hidden',marginBottom:14}}>
<iframe
width="100%"
height="220"
src={https://www.youtube.com/embed/${place.videoId}?autoplay=1`}
title={place.videoTitle}
frameBorder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
allowFullScreen
style={{display:'block'}}/>
</div>
<div style={{fontSize:13,color:'#8fa3c4',textAlign:'center',marginBottom:16}}>{place.videoTitle}</div>
</div>
)}
</div>
</div>
);
}

// ── PHOTO SLIDESHOW ───────────────────────────────────────
function PhotoSlideshow({images,height=280}) {
const [current,setCurrent] = useState(0);
const [playing,setPlaying] = useState(true);
useEffect(()=>{

if(!playing) return;
const timer = setInterval(()=>setCurrent(prev=>(prev+1)%images.length),3000);
return ()=>clearInterval(timer);},[playing,images.length]);
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
</div>
);
}

// ── WEATHER ───────────────────────────────────────────────
function WeatherWidget({t}) {
const [day,setDay] = useState('Today');
const [selected,setSelected] = useState(null);
const days = Object.keys(weatherData);
const cities = weatherData[day];
return (
<div style={{marginBottom:16}}>
<div style={styles.sectionTitle}>{t.weather}</div>

<div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:8,marginBottom:12,scrollbarWidth:'none'}}>
{days.map(d=>(
<button key={d} onClick={()=>{setDay(d);setSelected(null);}} style={{flexShrink:0,padding:'6px 14px',borderRadius:20,border:0.5px solid${d===day?'#c9a227':'rgba(201,162,39,0.2)'},background:d===day?'rgba(201,162,39,0.15)':'transparent',color:d===day?'#c9a227':'#8fa3c4',fontSize:12,cursor:'pointer',fontWeight:d===day?600:400}}&gt;{d}&lt;/button&gt; ))} &lt;/div&gt; &lt;div style={{display:'flex',gap:10}}&gt; {cities.map(c=&gt;( &lt;div key={c.name} onClick={()=&gt;setSelected(selected?.name===c.name?null:c)} style={{flex:1,background:selected?.name===c.name?'rgba(24,95,165,0.25)':'rgba(24,95,165,0.12)'

,border:0.5px solid ${selected?.name===c.name?'rgba(24,95,165,0.6)':'rgba(24,95,165,0.3)'},borderRadius:12,padding:'12px 8px',textAlign:'center',cursor:'pointer',transition:'all 0.2s'}}>
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
{[['💧',selected.humidity,'Humidity'],['💨',selected.wind,'Wind'],['☀️',selected.uv,'UV Index']].map(([icon,val,label])=>(
<div key={label} style={{background:'rgba(255,255,255,0.05)',borderRadius:8,padding:'10px 8px',textAlign:'center'}}>
<div style={{fontSize:18}}>{icon}</div>

<div style={{fontSize:13,fontWeight:600,color:'#c9a227',marginTop:4}}>{val}</div>
<div style={{fontSize:9,color:'#8fa3c4',marginTop:2}}>{label}</div>
</div>
))}
</div>
</div>
)}
</div>
);
}

// ── CURRENCY ──────────────────────────────────────────────
function CurrencyConverter({t}) {

const [amount,setAmount] = useState('100');
const [from,setFrom] = useState('USD');
const result = amount?(parseFloat(amount)*RATES_TO_SZL[from]).toFixed(2):'0.00';
return (
<div style={{background:'rgba(201,162,39,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:14,padding:14,marginBottom:16}}>
<div style={styles.sectionTitle}>{t.currency}</div>
<div style={{fontSize:12,color:'#8fa3c4',marginBottom:10}}>Any Currency → Eswatini Lilangeni (SZL)</div>
<div style={{display:'flex',gap:10,alignItems:'center',marginBottom:12}}>
<input type="number" value={amount} 

onChange={e=>setAmount(e.target.value)} style={{flex:1,background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px 14px',color:'#f0f4ff',fontSize:16,fontWeight:700,outline:'none'}} placeholder="Amount"/>
<select value={from} onChange={e=>setFrom(e.target.value)} style={{background:'#0f2040',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px 12px',color:'#c9a227',fontSize:13,fontWeight:600,outline:'none',cursor:'pointer'}}>
{Object.keys(RATES_TO_SZL).map(k=><option key={k} value={k}>{k}</option>)}
</select>
</div>
<div style={{background:'rgba(201,162,39,0.1)',border

Radius:10,padding:'12px 14px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<span style={{fontSize:13,color:'#8fa3c4'}}>{amount||'0'} {from} =</span>
<span style={{fontSize:22,fontWeight:700,color:'#c9a227'}}>E {result} SZL</span>
</div>
<div style={{fontSize:10,color:'#8fa3c4',marginTop:8,textAlign:'center'}}>💡 SZL = Emalangeni — official currency of Eswatini</div>
</div>
);
}

// ── TRANSLATE TAB ─────────────────────────────────────────

function TranslateTab({t,lang}) {
const [inputText,setInputText] = useState('');
const [fromLang,setFromLang] = useState('en');
const [toLang,setToLang] = useState('ss');
const [result,setResult] = useState('');
const [speaking,setSpeaking] = useState(false);

const translate = ()=>{
if(!inputText.trim()) return;
const key = Object.keys(TRANSLATIONS).find(k=>k.toLowerCase()===inputText.toLowerCase().trim());
if(key && TRANSLATIONS[key][toLang]) {
setResult(TRANSLATIONS[key][toLang]);
} else {
const phrases = {
'hello': {ss:'Sawubona',zu:'Sawubona',af:'Hallo',pt:'Olá',fr:'Bonjour',de:'Hallo',zh:'你好',ar:'مرحبا'},
'hi': {ss:'Sawubona',zu:'Sawubona',af:'Hallo',pt:'Oi',fr:'Salut',de:'Hallo',zh:'嗨',ar:'مرحبا'},
'yes': {ss:'Yebo',zu:'Yebo',af:'Ja',pt:'Sim',fr:'Oui',de:'Ja',zh:'是',ar:'نعم'},
'no': {ss:'Cha',zu:'Cha',af:'Nee',pt:'Não',fr:'Non',de:'Nein',zh:'不',ar:'لا'},
'sorry': {ss:'Ngiyaxolisa',zu:'Ngiyaxolisa',af:'Jammer',pt:'Desculpe',fr:'Désolé',de:'Entschuldigung',zh:'对不起',ar:'آسف'},
'welcome': {ss:'Siyakwemukela',zu:'Siyakwemukela',af:'Welkom',pt:'Bem-vindo',fr:'Bienvenue',de:'Willkommen',zh:'欢迎',ar:'مرحباً'},
'please': {ss:'Ngicela',zu:'Ngicela',af:'Asseblief',pt:'Por favor',fr:'S'il vous plaît',de:'Bitte',zh:'请',ar:'من فضلك'},
'money': {ss:'Imali',zu:'Imali',af:'Geld',pt:'Dinheiro',fr:'Argent',de:'Geld',zh:'钱',ar:'مال'},
'beautiful':{ss:'Kuhle',zu:'Kuhle',af:'Mooi',pt:'Bonito',fr:'Beau',de:'Schön',zh:'美丽',ar:'جميل'},
'eswatini': {ss:'eSwatini',zu:'eSwatini',af:'Eswatini',pt:'Eswatini',fr:'Eswatini',de:'Eswatini',zh:'斯威士兰',ar:'إسواتيني'},
};
const lower = inputText.toLowerCase().trim();
if(phrases[lower]&&phrases[lower][toLang]) {
setResult(phrases[lower][toLang]);
} else {
setResult(Translation for "${inputText}" → ${toLang.toUpperCase()}: Coming soon! Try common phrases below.);
}

}
};

const speak = (text)=>{
if('speechSynthesis' in window) {
window.speechSynthesis.cancel();
const u = new SpeechSynthesisUtterance(text);
u.onstart=()=>setSpeaking(true);
u.onend=()=>setSpeaking(false);
window.speechSynthesis.speak(u);
}
};

return (
<div>
<div style={styles.sectionTitle}>{t.translate} 🌐</div>
<div style={{fontSize:12,color:'#8fa3c4',marginBottom:16}}>Translate words and phrases for your Eswatini journey</div>

<div style={{display:'flex',gap:10,marginBottom:12,alignItems:'center'}}>
<select value={fromLang} onChange={e=>setFromLang(e.target.value)} style={{flex:1,background:'#0f2040',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px',color:'#c9a227',fontSize:13,outline:'none',cursor:'pointer'}}>
{Object.entries(LANG_NAMES).map(([code,label])=><option key={code} value={code}>{label}</option>)}
</select>
<span style={{color:'#c9a227',fontSize:20}}>→</span>
<select value={toLang} onChange={e=>setToLang(e.target.value)} 

style={{flex:1,background:'#0f2040',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px',color:'#c9a227',fontSize:13,outline:'none',cursor:'pointer'}}>
{Object.entries(LANG_NAMES).map(([code,label])=><option key={code} value={code}>{label}</option>)}
</select>
</div>

<textarea value={inputText} onChange={e=>setInputText(e.target.value)} placeholder="Type a word or phrase to translate..." rows={3} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:12,padding:'12px 14px',color:'#f0f4ff',fontSize:14,outline:'none',resize:'none',fontFamily:'inherit',boxSizing:'border-box',marginBottom:10}}/>

<button style={{...styles.btnPrimary,marginBottom:14}} onClick={translate}>Translate →</button>

{result&&(
<div style={{background:'rgba(83,74,183,0.15)',border:'0.5px solid rgba(131,122,221,0.3)',borderRadius:12,padding:16,marginBottom:16}}>
<div style={{fontSize:11,color:'#8fa3c4',marginBottom:6}}>Translation ({LANG_NAMES[toLang]}):</div>
<div style={{fontSize:20,fontWeight:600,color:'#f0f4ff',marginBottom:12}}>{result}</div>
<button onClick={()=>speak(result)} style={{padding:'8px 16px',borderRadius:50,border:'0.5px solid rgba(131,122,221,0.4)',background:speaking?'rgba(131,122,221,0.3)':'rgba(131,122,221,0.15)',color:'#afa9ec',cursor:'pointer',fontSize:12}}>
{speaking?'🔊 Speaking...':'🔊 Hear Pronunciation'}
</button>
</div>
)}

<div style={styles.sectionTitle}>Common Phrases</div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
{Object.entries(TRANSLATIONS).map(([phrase,trans])=>(
<div key={phrase} onClick={()=>{setInputText(phrase);setResult(trans[toLang]||trans['ss']||phrase);}} style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:10,padding:'10px 12px',cursor:'pointer'}}>
<div style={{fontSize:12,fontWeight:600,color:'#f0f4ff',marginBottom:3}}>{phrase}</div>
<div style={{fontSize:11,color:'#c9a227'}}>{trans['ss']}</div>
</div>
))}
</div><div style={styles.sectionTitle}>siSwati Essentials 🇸🇿</div>
{[
['Sawubona','Hello / I see you'],
['Ngiyabonga','Thank you'],
['Yebo','Yes'],

['Cha','No'],
['Siyabonga','We thank you'],
['Sala kahle','Goodbye (stay well)'],
['Hamba kahle','Go well'],
['Ngiyakutsanda','I love you'],
['Eswatini','The Kingdom of Eswatini'],
['Incaba','Fortress / Hidden treasure'],
].map(([ss,en2])=>(
<div key={ss} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'0.5px solid rgba(255,255,255,0.05)'}}>
<div style={{fontSize:15,fontWeight:600,color:'#c9a227'}}>{ss}</div>
<div style={{fontSize:12,color:'#8fa3c4'}}>{en2}</div>
<button onClick={()=>speak(ss)} style={{padding:'4px 10px',borderRadius:20,border:'0.5px solid rgba(131,122,221,0.3)',background:'rgba(131,122,221,0.1)',color:'#afa9ec',cursor:'pointer',fontSize:11}}>🔊</button>
</div>
))}
</div>
);
}

// ── COMPARE TAB ───────────────────────────────────────────
function CompareTab({t}) {
const [category,setCategory] = useState('attractions');

const attractionComparison = [
{ name:'Hlane Royal Reserve', price:'E 150', rating:4.9, crowd:'Low', type:'Wildlife', best:'Big 5 Safari' },
{ name:'Mantenga Falls', price:'E 80', rating:4.8, crowd:'Medium', type:'Nature', best:'Swimming & Hiking' },
{ name:'Malolotja Reserve', price:'E 120', rating:4.8, crowd:'Very Low', type:'Nature', best:'Zipline & Hiking' },
{ name:'Lobamba Village', price:'E 50', rating:4.7, crowd:'Low', type:'Culture', best:'Cultural Immersion' },
{ name:'Sibebe Rock', price:'E 60', rating:4.5, crowd:'Low', type:'Adventure', best:'Panoramic Views' },
{ name:'Swazi Candles', price:'Free', rating:4.6, crowd:'Medium', type:'Culture', best:'Shopping & Crafts' },
 ];

const hotelComparison = [

{ name:'Royal Swazi Spa', price:'E 1,800+', rating:4.9, stars:'★★★★★', best:'Luxury & Spa' },
{ name:'Mantengha Village', price:'E 600+', rating:4.7, stars:'★★★★☆', best:'Cultural Experience' },
{ name:'Foresters Arms', price:'E 800+', rating:4.5, stars:'★★★★☆', best:'Countryside Charm' },
{ name:'Lidwala Backpacker', price:'E 150+', rating:4.3, stars:'★★★☆☆', best:'Budget Travel' },
 ];

const restaurantComparison = [
{ name:"Malandela's", price:'E 80–200', rating:4.8, cuisine:'Traditional Swazi', best:'Authentic Experience' },
{ name:"Tum's George Hotel", price:'E 120–300', rating:4.6, cuisine:'Fine Dining', best:'Special Occasions' },

{ name:'Foresters Arms', price:'E 60–150', rating:4.4, cuisine:'Pub Meals', best:'Casual Dining' },
{ name:'Gables Food Court', price:'E 40–120', rating:4.2, cuisine:'Mixed', best:'Budget Meals' },
 ];

const storeComparison = [
{ name:'Swazi Candles', price:'E 50–500', rating:4.8, type:'Candles & Crafts', best:'Unique Gifts' },
{ name:'Gone Rural', price:'E 100–2000', rating:4.7, type:'Woven Crafts', best:'Premium Baskets' },
{ name:'Ngwenya Glass', price:'E 80–800', rating:4.6, type:'Glass Art', best:'Art Collectors' },
{ name:'Manzini Market', price:'E 10–200', rating:4.3, type:'Traditional Market', best:'Budget Shopping' },
 ];


const data = category==='attractions'?attractionComparison:category==='hotels'?hotelComparison:category==='restaurants'?restaurantComparison:storeComparison;

return (
<div>
<div style={styles.sectionTitle}>{t.comparePrice} 🇸🇿</div>
<div style={{fontSize:12,color:'#8fa3c4',marginBottom:14}}>Compare prices and value across Eswatini</div>

<div style={{display:'flex',gap:8,marginBottom:16,overflowX:'auto',scrollbarWidth:'none'}}>
{[['attractions','🏞️ Attractions'],['hotels','🏨 Hotels'],['restaurants','🍴 Restaurants'],['stores','🛍️ Stores']].map(([cat,label])=>(
<button key={cat} onClick={()=>setCategory(cat)} style={{flexShrink:0,padding:'8px 14px',borderRadius:20,border:0.5px solid${category===cat?'#c9a227':'rgba(201,162,39,0.2)'}`,background:category===cat?'rgba(201,162,39,0.15)':'transparent',color:category===cat?'#c9a227':'#8fa3c4',fontSize:12,cursor:'pointer',fontWeight:category===cat?600:400}}>{label}</button>
))}
</div>

<div style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:14,overflow:'hidden',marginBottom:16}}>
<div style={{display:'grid',gridTemplateColumns:'2fr 

1fr 1fr 1fr',gap:0,background:'rgba(201,162,39,0.1)',padding:'10px 12px'}}>
{['Name','Price','Rating','Best For'].map(h=>(
<div key={h} style={{fontSize:10,fontWeight:700,color:'#c9a227',textTransform:'uppercase',letterSpacing:0.5}}>{h}</div>
))}
</div>
{data.map((item,i)=>(
<div key={i} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:0,padding:'12px',borderBottom:i<data.length-1?'0.5px solid rgba(255,255,255,0.05)':'none',background:i%2===0?'transparent':'rgba(255,255,255,0.02)'}}>
<div style={{fontSize:12,fontWeight:600,color:'#f0f4ff'

}}>{item.name}</div>
<div style={{fontSize:11,color:'#5dcaa5'}}>{item.price}</div>
<div style={{fontSize:11,color:'#c9a227'}}>{'⭐'.repeat(Math.floor(item.rating))} {item.rating}</div>
<div style={{fontSize:10,color:'#8fa3c4'}}>{item.best}</div>
</div>
))}
</div>

<div style={{background:'rgba(29,158,117,0.08)',border:'0.5px solid rgba(29,158,117,0.2)',borderRadius:12,padding:14,marginBottom:16}}>
<div style={{fontSize:13,fontWeight:600,color:'#5dcaa5',marginBottom:8}}>💡 Best Value in Eswatini</div>
{category==='attractions'&&<div style={{fontSize:12,color:'#8fa3c4',lineHeight:1.7}}>🥇 Best Overall: <span style={{color:'#c9a227'}}>Hlane Royal Reserve</span> — Big 5 for E150<br/>💰 Best Budget: <span style={{color:'#c9a227'}}>Swazi Candles</span> — Free entry, world-class crafts<br/>🌿 Best Hidden Gem: <span style={{color:'#c9a227'}}>Malolotja Reserve</span> — Zipline + hiking E120</div>}
{category==='hotels'&&<div style={{fontSize:12,color:'#8fa3c4',lineHeight:1.7}}>🥇 Best Luxury: <span style={{color:'#c9a227'}}>Royal Swazi Spa</span> — 5-star experience<br/>💰 Best Budget: <span style={{color:'#c9a227'}}>Lidwala Backpacker</span> — from E150/night<br/>🌿 Best Experience: <span style={{color:'#c9a227'}}>Mantengha Village</span> — authentic Swazi culture</div>}
{category==='restaurants'&&<div style={{fontSize:12,color:'#8fa3c4',lineHeight:1.7}}>🥇 Best Traditional: <span style={{color:'#c9a227'}}>Malandela's</span> — authentic Swazi cuisine<br/>💰 Best Budget: <span style={{color:'#c9a227'}}>Gables Food Court</span> — from E40<br/>🌿 Best Special Occasion: <span style={{color:'#c9a227'}}>Tum's George Hotel</span></div>}
{category==='stores'&&<div style={{fontSize:12,color:'#8fa3c4',lineHeight:1.7}}>🥇 Most Unique: <span style={{color:'#c9a227'}}>Swazi Candles</span> — world-famous<br/>💰 Best Budget: <span style={{color:'#c9a227'}}>Manzini Market</span> — from E10<br/>🌿 Best Quality: <span style={{color:'#c9a227'}}>Gone Rural</span> — premium crafts</div>}
</div>

</div>
);
}

// ── EXPLORE TAB ───────────────────────────────────────────
function ExploreTab({onSelect,onVirtualTour,t}) {
const [filter,setFilter] = useState('All');
const categories = ['All','Wildlife','Nature','Culture','Adventure'];
const filtered = filter==='All'?places:places.filter(p=>p.category===filter);
return (
<div>
<div style={styles.sectionTitle}>{t.explore2} Eswatini 🇸🇿</div>
<div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:8,marginBottom:14,scrollbarWidth:'none'}}>
{categories.map(cat=>(
<button key={cat} onClick={()=>setFilter(cat)} style={{flexShrink:0,padding:'8px 16px',borderRadius:20,border:0.5px solid ${filter===cat?'#c9a227':'rgba(201,162,39,0.2)'}`,background:filter===cat?'rgba(201,162,39,0.15)':'transparent',color:filter===cat?'#c9a227':'#8fa3c4',fontSize:12,cursor:'pointer',fontWeight:filter===cat?600:400}}>{cat}</button>
))}
</div>
{filtered.map(p=>(
<div key={p.name} style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:14,overflow:'hidden',marginBottom:12}}>
<div style={{position:'relative',height:160}}><img src={p.img} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
<div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(to bottom,transparent 40%,rgba(10,22,40,0.9) 100%)'}}/>
<div style={{position:'absolute',top:10,right:10,background:'rgba(201,162,39,0.9)',borderRadius:20,padding:'3px 10px',fontSize:10,fontWeight:700,color:'#0a1628'}}>{p.category}</div>
<div style={{position:'absolute',bottom:10,left:12}}>
<div style={{fontSize:16,fontWeight:700,color:'#f0f4ff'}}>{p.name}</div>
<div style={{fontSize:11,color:'rgba(255,255,255,0.8)'}}>📍 {p.region} · ⭐ {p.rating}</div>
</div>
</div>
<div style={{padding:'12px 14px'}}>
<div style={{fontSize:12,color:'#8fa3c4',lineHeight:1.6,marginBottom:12}}>{p.desc}</div>
<div style={{display:'flex',gap:8}}>
<button style={{flex:1,padding:'10px',borderRadius:50,background:'linear-gradient(135deg,#c9a227,#e8b93a)',border:'none',color:'#0a1628',fontSize:12,fontWeight:700,cursor:'pointer'}} onClick={()=>onSelect(p)}>View Details</button>
<button style={{flex:1,padding:'10px',borderRadius:50,border:'0.5px solid rgba(131,122,221,0.4)',background:'rgba(131,122,221,0.15)',color:'#afa9ec',fontSize:12,cursor:'pointer'}} onClick={()=>onVirtualTour(p)}>{t.virtualTour}</button>
</div>
</div>
</div>
))}
</div>
);
}

// ── REVIEWS ───────────────────────────────────────────────
function ReviewsSection({placeName,t}) {
const [reviews,setReviews] = useState([
{name:'Sarah M.',flag:'🇬🇧',stars:5,text:"Absolutely breathtaking! One of the best experiences of my life.",date:'2 days ago'},
{name:'João P.', flag:'🇧🇷',stars:5,text:'Incredible wildlife and friendly people. Will definitely come back!',date:'1 week ago'},
{name:'Thandi D.',flag:'🇿🇦',stars:4,text:'Beautiful place, well maintained. The guided tour was very informative.',date:'2 weeks ago'},
 ]);
const [showForm,setShowForm] = useState(false);
const [newName,setNewName] = useState('');
const [newText,setNewText] = useState('');
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
<textarea value={newText} onChange={e=>setNewText(e.target.value)} placeholder="Share your experience..." rows={3} 

style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:8,padding:'10px 12px',color:'#f0f4ff',fontSize:13,outline:'none',resize:'none',fontFamily:'inherit',boxSizing:'border-box'}}/>
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

// ── DETAIL SCREEN ─────────────────────────────────────────
function DetailScreen({place,onBack,t,onVirtualTour}) {
const [saved,setSaved] = useState(false);
return (
<div style={styles.app}>
<div style={{flexShrink:0,position:'relative'}}>

<PhotoSlideshow images={place.gallery} height={260}/>
<button onClick={onBack} style={{position:'absolute',top:16,left:16,background:'rgba(10,22,40,0.7)',border:'0.5px solid rgba(255,255,255,0.2)',borderRadius:50,padding:'8px 14px',color:'#f0f4ff',fontSize:13,cursor:'pointer',zIndex:10}}>← Back</button>
<div style={{position:'absolute',top:16,right:16,background:'rgba(201,162,39,0.9)',borderRadius:20,padding:'4px 10px',fontSize:11,fontWeight:700,color:'#0a1628',zIndex:10}}>{place.category}</div>
<div style={{position:'absolute',bottom:36,left:16,zIndex:10}}>
<div style={{fontSize:20,fontWeight:700,color:'#f0f4ff',marginBottom:4,textShadow:'0 2px 8px rgba(0,0,0,0.8)'}}>{place.name}</div>
<div style={{fontSize:13,color:'rgba(255,255,255,0.9)',textShadow:'0 1px 4px rgba(0,0,0,0.8)'}}>📍 {place.region}</div>
</div>
</div>
<div style={{flex:1,overflowY:'auto',padding:16}}>
<div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
<div style={styles.infoBadge}>⭐ {place.rating}</div>
<div style={styles.infoBadge}>{place.price}</div>
<div style={{...styles.infoBadge,color:'#5dcaa5',borderColor:'rgba(29,158,117,0.3)',background:'rgba(29,158,117,0.1)'}}>{place.hours}</div>
</div>

<button style={{width:'100%',padding:'12px',borderRadius:50,border:'0.5px solid rgba(131,122,221,0.4)',background:'rgba(131,122,221,0.15)',color:'#afa9ec',cursor:'pointer',fontWeight:600,fontSize:13,marginBottom:14}} onClick={onVirtualTour}>{t.virtualTour} — Experience {place.name}</button>
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
<button style={{...styles.btnPrimary,flex:1,padding:'12px',fontSize:14}} onClick={()=>window.open(https://www.google.com/maps/search/${encodeURIComponent(place.name)}+Eswatini,'_blank')}&gt;🗺️ {t.getDir}&lt;/button&gt; &lt;button style={{flex:1,padding:'12px',fontSize:14,borderRadius:50,border:0.5px solid ${saved?'rgba(29,158,117,0.6)':'rgba(201,162,39,0.4)'},background:saved?'rgba(29,158,117,0.15)':'transparent',color:saved?'#5dcaa5':'#c9a227',cursor:'pointer',fontWeight:600}} onClick={()=>setSaved(true)}>{saved?'✅ Saved':t.savePlace}</button>
</div>
<button style={{width:'100%',padding:'12px',fontSize:14,borderRadius:50,border:'1px solid rgba(226,75,74,0.4)',background:'rgba(226,75,74,0.1)',color:'#e24b4a',cursor:'pointer',fontWeight:600,marginBottom:20}} onClick={()=>{if(window.confirm('🆘 Call Eswatini Emergency Services (999)?'))window.location.href='tel:999';}}>🆘 {t.sos}</button>
</div>
</div>
);

}

// ── RESTAURANT DETAIL WITH ORDERING ──────────────────────
function RestaurantDetail({item,onBack,t}) {
const [cart,setCart] = useState([]);
const [showCart,setShowCart] = useState(false);
const [orderPlaced,setOrderPlaced] = useState(false);
const [tableNum,setTableNum] = useState('');

const addToCart = (menuItem)=>{
setCart(prev=>{
const existing = prev.find(c=>c.name===menuItem.name);
if(existing) return prev.map(c=>c.name===menuItem.name?{...c,qty:c.qty+1}:c);
return [...prev,{...menuItem,qty:1}];

});
};

const total = cart.reduce((sum,item)=>sum+item.price*item.qty,0);

const placeOrder = ()=>{
if(!tableNum){alert('Please enter your table number or delivery details');return;}
setOrderPlaced(true);
};

if(orderPlaced) return (
<div style={styles.app}>
<div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:32,textAlign:'center'}}>
<div style={{fontSize:64,marginBottom:16}}>✅</

div>
<div style={{fontSize:22,fontWeight:700,color:'#5dcaa5',marginBottom:8}}>Order Placed!</div>
<div style={{fontSize:14,color:'#8fa3c4',lineHeight:1.7,marginBottom:24}}>Your order from {item.name} has been received. Table/Delivery: {tableNum}<br/>Estimated time: 20–30 minutes</div>
<div style={{background:'rgba(29,158,117,0.1)',border:'0.5px solid rgba(29,158,117,0.3)',borderRadius:14,padding:16,width:'100%',marginBottom:20}}>
<div style={{fontSize:14,fontWeight:600,color:'#5dcaa5',marginBottom:10}}>Your Order:</div>
{cart.map(c=>(
<div key={c.name} 

style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:13,color:'#f0f4ff'}}>
<span>{c.name} x{c.qty}</span>
<span style={{color:'#c9a227'}}>E {c.price*c.qty}</span>
</div>
))}
<div style={{borderTop:'0.5px solid rgba(255,255,255,0.1)',marginTop:10,paddingTop:10,display:'flex',justifyContent:'space-between',fontWeight:700,color:'#c9a227',fontSize:16}}>
<span>Total</span><span>E {total}</span>
</div>
</div>
<button style={styles.btnPrimary} onClick={onBack}>← Back to Restaurants</button>
</div>

</div>
);

return (
<div style={styles.app}>
<div style={{background:'linear-gradient(135deg,#1a3a1a,#2d5a2d)',height:180,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,position:'relative'}}>
<div style={{fontSize:56}}>{item.icon}</div>
<button onClick={onBack} style={{position:'absolute',top:16,left:16,background:'rgba(10,22,40,0.7)',border:'0.5px solid rgba(255,255,255,0.2)',borderRadius:50,padding:'8px 14px',color:'#f0f4ff',fontSize:13,cursor:'pointer'}}>← Back</button>
{cart.length>0&&<button onClick={()=>setShowCart(!showCart)} style={{position:'absolute',top:16,right:16,backgr

ound:'rgba(201,162,39,0.9)',border:'none',borderRadius:50,padding:'8px 14px',color:'#0a1628',fontSize:13,fontWeight:700,cursor:'pointer'}}>🛒 {cart.length} · E{total}</button>}
</div>
<div style={{flex:1,overflowY:'auto',padding:16}}>
<h2 style={{fontSize:20,fontWeight:700,color:'#f0f4ff',marginBottom:4}}>{item.name}</h2>
<div style={{fontSize:12,color:'#8fa3c4',marginBottom:12}}>📍 {item.region} · ⭐ {item.rating} · 🕐 {item.hours}</div>

{showCart&&cart.length>0&&(
<div style={{background:'rgba(201,162,39,0.08)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:14,padding:14,marginBottom:14}}>
<div style={{fontSize:14,fontWeight:600,color:'#c9a227',marginBottom:10}}>🛒 Your Cart</div>
{cart.map(c=>(
<div key={c.name} style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:13,color:'#f0f4ff'}}>
<span>{c.name} x{c.qty}</span>
<span style={{color:'#c9a227'}}>E {c.price*c.qty}</span>
</div>
))}
<div style={{borderTop:'0.5px solid rgba(255,255,255,0.1)',marginTop:8,paddingTop:8,fontSize:15,fontWeight:700,color:'#c9a227',display:'flex',justifyContent:'space-between'}}>
<span>Total:</span><span>E {total}</span>
</div>

<input value={tableNum} onChange={e=>setTableNum(e.target.value)} placeholder="Table number or delivery address" style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px',color:'#f0f4ff',fontSize:13,outline:'none',marginTop:10,boxSizing:'border-box'}}/>
<button style={{...styles.btnPrimary,marginTop:10}} onClick={placeOrder}>Place Order →</button>
</div>
)}

{item.menu.map(cat=>(
<div key={cat.category} style={{marginBottom:16}}>
<div style={{fontSize:14,fontWeight:700,color:'#c9a227',marginBottom:10,borderBottom:'0.5px solid 

rgba(201,162,39,0.2)',paddingBottom:6}}>{cat.category}</div>
{cat.items.map(menuItem=>(
<div key={menuItem.name} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'0.5px solid rgba(255,255,255,0.04)'}}>
<div style={{flex:1}}>
<div style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{menuItem.name}</div>
<div style={{fontSize:11,color:'#8fa3c4',marginTop:2}}>{menuItem.desc}</div>
<div style={{fontSize:13,color:'#c9a227',marginTop:4,fontWeight:600}}>E {menuItem.price}</div>
</div>
<button onClick={()=>addToCart(menuItem)} style={{padding:'8px 

14px',borderRadius:50,background:'linear-gradient(135deg,#c9a227,#e8b93a)',border:'none',color:'#0a1628',fontSize:12,fontWeight:700,cursor:'pointer',flexShrink:0}}>+ Add</button>
</div>
))}
</div>
))}
<ReviewsSection placeName={item.name} t={t}/>
</div>
</div>
);
}

// ── HOTEL DETAIL ──────────────────────────────────────────
function HotelDetail({item,onBack,t}) {
const [showBooking,setShowBooking] = useState(false);

const [checkIn,setCheckIn] = useState('');
const [checkOut,setCheckOut] = useState('');
const [guests,setGuests] = useState('2');
return (
<div style={styles.app}>
<div style={{background:'linear-gradient(135deg,#1a2a3a,#2d3d5a)',height:200,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,position:'relative'}}>
<div style={{fontSize:64}}>{item.icon}</div>
<button onClick={onBack} style={{position:'absolute',top:16,left:16,background:'rgba(10,22,40,0.7)',border:'0.5px solid rgba(255,255,255,0.2)',borderRadius:50,padding:'8px 14px',color:'#f0f4ff',fontSize:13,cursor:'pointer'}}>← Back</button>
<div style={{position:'absolute',top:16,right:16,fontSize:14,color:'#c9a227'}}>{item.stars}</div>

</div>
<div style={{flex:1,overflowY:'auto',padding:16}}>
<h2 style={{fontSize:22,fontWeight:700,color:'#f0f4ff',marginBottom:4}}>{item.name}</h2>
<div style={{fontSize:13,color:'#8fa3c4',marginBottom:10}}>📍 {item.region}</div>
<div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
<div style={styles.infoBadge}>⭐ {item.rating}</div>
<div style={{...styles.infoBadge,color:'#5dcaa5',borderColor:'rgba(29,158,117,0.3)',background:'rgba(29,158,117,0.1)'}}>{item.price}</div>
</div>
<div style={{fontSize:13,color:'#b0c4de',lineHeight:1.

8,marginBottom:14}}>{item.desc}</div>
<div style={{fontSize:14,color:'#c9a227',fontWeight:600,marginBottom:10}}>Amenities</div>
<div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:16}}>
{item.amenities.map(a=>(
<span key={a} style={styles.tag}>{a}</span>
))}
</div>
{!showBooking?(
<button style={{...styles.btnPrimary,marginBottom:12}} onClick={()=>setShowBooking(true)}>🛏️ Book Now</button>
):(
<div style={{background:'rgba(201,162,39,0.06)',border:'0.5px solid 

rgba(201,162,39,0.25)',borderRadius:14,padding:16,marginBottom:16}}>
<div style={{fontSize:15,fontWeight:600,color:'#c9a227',marginBottom:14}}>📅 Book Your Stay</div>
{[['Check-in Date',checkIn,setCheckIn,'date'],['Check-out Date',checkOut,setCheckOut,'date'],['Number of Guests',guests,setGuests,'number']].map(([label,val,setter,type])=>(
<div key={label} style={{marginBottom:12}}>
<div style={{fontSize:12,color:'#8fa3c4',marginBottom:6}}>{label}</div>
<input type={type} value={val} onChange={e=>setter(e.target.value)} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px 

14px',color:'#f0f4ff',fontSize:14,outline:'none',boxSizing:'border-box'}}/>
</div>
))}
<button style={{...styles.btnPrimary,marginBottom:8}} onClick={()=>{if(checkIn&&checkOut)alert(✅ Booking Request Sent!\n\n🏨${item.name}\n📅 
 
{checkOut}\n👥 ${guests} guests\n\nWe will contact you within 24 hours!);else alert('Please fill in all dates');}}>Confirm Booking</button>
<button style={{width:'100%',padding:'11px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:'transparent',color:'#8fa3c4',cursor:'pointer',fontSize:14}} onClick={()=>setShowBooking(false)}>Cancel</button>
</div>

)}
<ReviewsSection placeName={item.name} t={t}/>
</div>
</div>
);
}

// ── HOME TAB ──────────────────────────────────────────────
function HomeTab({setTab,onSelect,onSelectRestaurant,onSelectHotel,t}) {
const [activeSection,setActiveSection] = useState('attractions');
const handleSOS = ()=>{
if(window.confirm('🆘 Call Eswatini Emergency Services?\n\nPolice: 999\nAmbulance: 977\nFire: 933'))

window.location.href='tel:999';
};
return (
<div>
<div style={styles.sosBtn} onClick={handleSOS}>
<span style={{fontSize:20}}>🆘</span>
<div><div style={{fontSize:13,fontWeight:600,color:'#e24b4a'}}>{t.sos}</div><div style={{fontSize:11,color:'#8fa3c4'}}>{t.sosSub}</div></div>
<span style={{color:'#8fa3c4',marginLeft:'auto'}}>›</span>
</div>
<WeatherWidget t={t}/>
<div style={styles.heroBanner}>
<div style={styles.heroBadge}>✦ Kingdom of Eswatini</div>
<h2 style={{fontSize:22,fontWeight:700,color:'#f0f4ff'

,marginBottom:8}}>{t.welcome}</h2>
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
<div key={r.name} 

style={{...styles.bizCard,cursor:'pointer'}} onClick={()=>onSelectRestaurant(r)}>
<div style={{width:50,height:50,borderRadius:12,background:'rgba(29,158,117,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,flexShrink:0}}>{r.icon}</div>
<div style={{flex:1}}>
<div style={{fontSize:14,fontWeight:600,color:'#f0f4ff'}}>{r.name}</div>
<div style={{fontSize:12,color:'#8fa3c4',marginTop:2}}>📍 {r.region}</div>
<div style={{fontSize:11,color:'#6a85a8',marginTop:3}}>{r.desc}</div>
</div>
<div style={{textAlign:'right',flexShrink:0}}>
<div 

style={{fontSize:13,fontWeight:600,color:'#c9a227'}}>⭐ {r.rating}</div>
<div style={{fontSize:10,color:'#5dcaa5',marginTop:4}}>Tap to order →</div>
</div>
</div>
))}
</>
)}
{activeSection==='hotels'&&(
<>
<div style={styles.sectionTitle}>{t.hotels}</div>
{hotels.map(h=>(
<div key={h.name} style={{...styles.bizCard,cursor:'pointer'}} onClick={()=>onSelectHotel(h)}>
<div style={{width:50,height:50,borderRadius:12,background:'rgba(201,162,39,0.12)',display:'flex',align

Items:'center',justifyContent:'center',fontSize:26,flexShrink:0}}>{h.icon}</div>
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

// ── MAP TAB ──────────────────────────────────────────

─────
function MapTab({t}) {
const [location,setLocation] = useState(null);
const [activeRoute,setActiveRoute] = useState(null);
const [error,setError] = useState('');
const watchRef = useRef(null);
useEffect(()=>()=>{if(watchRef.current)navigator.geolocation.clearWatch(watchRef.current);},[]);
const startTracking = ()=>{
if(!navigator.geolocation){setError('GPS not supported.');return;}
setError('');
navigator.geolocation.getCurrentPosition(
pos=>setLocation({lat:pos.coords.latitude,lng:pos.coords.longitude,acc:Math.round(pos.coords.accuracy)}),
()=>setError('Could not get location. Please allow location access.'),
{enableHighAccuracy:true,timeout:10000}

);
watchRef.current = navigator.geolocation.watchPosition(
pos=>setLocation({lat:pos.coords.latitude,lng:pos.coords.longitude,acc:Math.round(pos.coords.accuracy)}),
()=>{},{enableHighAccuracy:true,maximumAge:3000}
);
};
const routes = [
{name:'🌿 Scenic Route', time:'2h 15m',dist:'87 km',type:'Recommended',color:'#5dcaa5',desc:'Pass through Ezulwini Valley, Mantenga Falls, and Lobamba.',stops:['Mantenga Falls','Lobamba Village','Swazi Candles'],url:'https://www.google.com/maps/dir/Mbabane/Mantenga+Falls+Eswatini/Lobamba+Eswatini'},
{name:'⚡ Fastest Route', time:'1h 20m',dist:'62 km',type:'Quick',color:'#c9a227',desc:'Direct highway via MR3.',stops:['Manzini Highway','Mbabane Bypass'],url:'https://www.google.com/maps/dir/Mbabane/Manzini+Eswatini'},
{name:'💰 Budget Route', time:'2h 45m',dist:'E45',type:'Affordable',color:'#534ab7',desc:'Uses public kombi taxis.',stops:['Manzini Bus Rank','Mbabane Market'],url:'https://www.google.com/maps/dir/Mbabane/Manzini+Bus+Rank+Eswatini'},
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
<div 

style={{fontSize:10,color:'#8fa3c4',marginBottom:3}}>Longitude</div>
<div style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{location.lng.toFixed(6)}</div>
</div>
</div>
<div style={{fontSize:12,color:'#5dcaa5',marginBottom:10}}>🟢 Updating live every 3 seconds · ±{location.acc}m accuracy</div>
<button style={{...styles.btnPrimary,padding:'10px',fontSize:13}} onClick={()=>window.open(https://www.google.com/maps?q=${location.lat},{activeRoute===r.name?r.color:'rgba(201,162,39,0.2)'},borderRadius:activeRoute===r.name?'12px 12px 0 0':12,padding:'12px 14px',marginBottom:activeRoute===r.name?0:10,cursor:'pointer'}}&gt; &lt;div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}&gt; &lt;div&gt; &lt;div style={{fontSize:14,fontWeight:600,color:'#f0f4ff'}}&gt;{r.name}&lt;/div&gt; &lt;div style={{fontSize:12,color:'#8fa3c4',marginTop:3}}&gt;{r.time} · {r.dist}&lt;/div&gt; &lt;/div&gt; &lt;span style={{fontSize:11,padding:'3px 10px',borderRadius:20,border:0.5px solid {r.color}`,borderTop:'none',borderRadius:'0 0 12px 12px',padding:14,marginBottom:10}}>
<div style={{fontSize:13,color:'#b0c4de',lineHeight:1.6,marginBottom:10}}>{r.desc}</div>

{r.stops.map((s,i)=>(
<div key={i} style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
<div style={{width:6,height:6,borderRadius:'50%',background:r.color,flexShrink:0}}/>
<div style={{fontSize:12,color:'#8fa3c4'}}>{s}</div>
</div>
))}
<button style={{...styles.btnPrimary,marginTop:12,padding:'11px',fontSize:13}} onClick={()=>window.open(r.url,'_blank')}>🗺️ Open in Google Maps</button>
</div>
)}
</div>
))}

</div>
);
}

// ── AI TAB ────────────────────────────────────────────────
function AITab({t}) {
const [messages,setMessages] = useState([
{role:'ai',text:"Sawubona! 👋 I'm Vaka, your Incaba AI Guide for the Kingdom of Eswatini.\n\nI speak 9 languages and can help with:\n• 🗓 Trip planning\n• 🦁 Wildlife & nature\n• 🍽 Food & restaurants\n• 🎭 Culture & festivals\n• 🏨 Hotels & booking\n• 💱 Currency & weather\n• 🚌 Transport\n• 🆘 Emergency help\n\nWhat would you like to know? 💎"}
 ]);
const [input,setInput] = useState('');

const [typing,setTyping] = useState(false);
const [speaking,setSpeaking] = useState(false);
const chatRef = useRef(null);

useEffect(()=>{
if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight;
},[messages,typing]);

const speakText = (text)=>{
if('speechSynthesis' in window){
window.speechSynthesis.cancel();
const u = new SpeechSynthesisUtterance(text.replace(/[🌍🇸🇿💎🤖🦁🍽🎭🏨💱🚌🆘🗓📍⭐]/g,''));
u.rate=0.9; u.pitch=1.1;
u.onstart=()=>setSpeaking(true);
u.onend=()=>setSpeaking(false);
window.speechSynthesis.speak(u);

}
};

const getReply = async (msg)=>{
try {
const response = await fetch('/api/chat',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({message:msg})
});
const data = await response.json();
return data.reply||"Please try again! 🙏";
} catch(e) {
return "I could not connect right now. Please try again! 🙏";
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

const lastAI = [...messages].reverse().find(m=>m.role==='ai');

return (
<div style={{display:'flex',flexDirection:'column',height:'75vh'}}>
<div style={{textAlign:'center',padding:'10px 0 6px'}}>
<div style={{fontSize:36}}>🤖</div>

<div style={{fontSize:16,fontWeight:700,color:'#f0f4ff'}}>{t.aiTitle}</div>
<div style={{fontSize:11,color:'#8fa3c4'}}>{t.aiSub}</div>
{lastAI&&(
<button onClick={()=>speakText(lastAI.text)} style={{marginTop:6,padding:'5px 14px',borderRadius:20,border:'0.5px solid rgba(131,122,221,0.4)',background:speaking?'rgba(131,122,221,0.3)':'rgba(131,122,221,0.15)',color:'#afa9ec',cursor:'pointer',fontSize:11}}>
{speaking?'🔊 Speaking...':'🔊 Read Last Answer Aloud'}
</button>
)}
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
{['Plan my trip','Wildlife','Local food','Culture','Weather','Currency','Hotels','Emergency'].map(s=>(
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
<input style={styles.chatInput} value={input} onChange={e=>setInput(e.target.value)} 

onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask anything about Eswatini..."/>
<button style={styles.sendBtn} onClick={send}>➤</button>
</div>
</div>
);
}

// ── BUSINESS TAB ──────────────────────────────────────────
function BusinessTab({t}) {
const [step,setStep] = useState('list');
const [form,setForm] = useState({name:'',type:'Hotel',region:'',phone:'',email:'',desc:'',website:''});
const [cardNum,setCardNum] = useState('');
const [expiry,setExpiry] = useState('');
const [cvv,setCvv] = useState('');

const [selectedBiz,setSelectedBiz] = useState(null);
const [businesses,setBusinesses] = useState([{name:'Royal Swazi Hotel', type:'Hotel', region:'Ezulwini Valley',icon:'🏨',views:'1,240',verified:true,revenue:'E 4,500'},
{name:"Malandela's Restaurant", type:'Restaurant', region:'Malkerns', icon:'🍴',views:'876', verified:true,revenue:'E 2,800'},
{name:'Swazi Candles Market', type:'Craft Market',region:'Malkerns', icon:'🎨',views:'654', verified:true,revenue:'E 1,200'},
 ]);
const submitPayment = ()=>{
if(!cardNum||!expiry||!cvv){alert('Please fill in all payment details');return;}
if(cardNum.replace(/\s/g,'').length<16){alert('Please enter a valid 16-digit card number');return;alert('✅ Payment of E200 successful!\n\nYour business listing is being reviewed. We will activate it within 24 hours.');
setBusinesses(prev=>[...prev,{name:form.name,type:form.type,region:form.region,icon:'🏢',views:'0',verified:false,revenue:'E 0'}]);
setStep('list');
setForm({name:'',type:'Hotel',region:'',phone:'',email:'',desc:'',website:''});
setCardNum(''); setExpiry(''); setCvv('');};
if(selectedBiz) return (
<div style={styles.app}>
<div style={{background:'linear-gradient(135deg,#1a2a1a,#2d4a2d)',height:180,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,position:'relative'}}>
<div style={{fontSize:64}}>{selectedBiz.icon}</div>
<button onClick={()=>setSelectedBiz(null)} style={{position:'absolute',top:16,left:16,background:'rgba(10,22,40,0.7)',border:'0.5px solid rgba(255,255,255,0.2)',borderRadius:50,padding:'8px 14px',color:'#f0f4ff',fontSize:13,cursor:'pointer'}}>← Back</button>
</div>
<div style={{flex:1,overflowY:'auto',padding:16}}>
<h2 style={{fontSize:22,fontWeight:700,color:'#f0f4ff',marginBottom:4}}>{selectedBiz.name}</h2>
<div style={{fontSize:13,color:'#8fa3c4',marginBottom:6}}>📍 {selectedBiz.region}</div>
<div style={{display:'flex',gap:8,marginBottom:14}}>
<span style={styles.tag}>{selectedBiz.type}</span>{selectedBiz.verified&&<span style={{...styles.tag,color:'#5dcaa5',borderColor:'rgba(29,158,117,0.3)'}}>✓ Verified</span>}
</div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:14}}>
{[['👁️ Views',selectedBiz.views+'/week'],['💰 Revenue',selectedBiz.revenue],['⭐ Rating','4.7']].map(([l,v])=>(
<div key={l} style={{background:'rgba(255,255,255,0.05)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:10,padding:'12px 8px',textAlign:'center'}}>
<div style={{fontSize:10,color:'#8fa3c4',marginBottom:4}}>{l}</div>
<div style={{fontSize:13,fontWeight:600,color:'#c9a227'}}>{v}</div>
</div>
))}
</div>
<ReviewsSection placeName={selectedBiz.name} t={t}/>
<button style={{...styles.btnPrimary,marginBottom:20}} onClick={()=>window.open(https://www.google.com/maps/search/${encodeURIComponent(selectedBiz.name)}+Eswatini,'_blank')}&gt;🗺️ Get Directions&lt;/button&gt; &lt;/div&gt; &lt;/div&gt; ); return ( &lt;div&gt; {step==='list'&&( &lt;&gt; &lt;div style={{background:'rgba(29,158,117,0.1)',border:'0.5px solid rgba(29,158,117,0.3)',borderRadius:16,padding:20,marginBottom:14}}&gt; &lt;div style={{fontSize:11,color:'#5dcaa5',fontWeight:600,letterSpacing:1,marginBottom:6}}&gt;BUSINESS PORTAL&lt;/div&gt; &lt;div style={{fontSize:20,fontWeight:700,color:'#f0f4ff',marginBottom:6}}&gt;Grow With Tourism 🌱&lt;/div&gt; &lt;div style={{fontSize:13,color:'#8fa3c4',lineHeight:1.6,marginBottom:4}}&gt;List your business and reach thousands of tourists.&lt;/div&gt; &lt;div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(201,162,39,0.08)',borderRadius:10,padding:'10px 12px',marginBottom:14}}&gt; &lt;span style={{fontSize:20}}&gt;💰&lt;/span&gt; &lt;div&gt;&lt;div style={{fontSize:13,fontWeight:600,color:'#c9a227'}}&gt;E200/month listing fee&lt;/div&gt;&lt;div style={{fontSize:11,color:'#8fa3c4'}}&gt;Pay upfront — listing goes live within 24 hours&lt;/div&gt;&lt;/div&gt; &lt;/div&gt; &lt;button style={{...styles.btnPrimary,padding:'11px 24px',fontSize:14}} onClick={()=&gt;setStep('register')}&gt;+ Register Your Business&lt;/button&gt; &lt;/div&gt; &lt;div style={styles.sectionTitle}&gt;Active Businesses&lt;/div&gt; {businesses.map(b=&gt;( &lt;div key={b.name} style={{...styles.bizCard,cursor:'pointer'}} onClick={()=&gt;setSelectedBiz(b)}&gt; &lt;div style={{width:46,height:46,borderRadius:12,background:'rgba(201,162,39,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}&gt;{b.icon}&lt;/div&gt; &lt;div style={{flex:1}}&gt; &lt;div style={{fontSize:14,fontWeight:600,color:'#f0f4ff'}}&gt;{b.name}&lt;/div&gt; &lt;div style={{fontSize:12,color:'#8fa3c4',marginTop:2}}&gt;{b.type} · {b.region}&lt;/div&gt; {b.verified&&&lt;span style={{fontSize:10,padding:'2px 8px',borderRadius:6,background:'rgba(29,158,117,0.15)',color:'#5dcaa5',border:'0.5px solid rgba(29,158,117,0.3)',marginTop:4,display:'inline-block'}}&gt;✓ Verified&lt;/span&gt;} &lt;/div&gt; &lt;div style={{textAlign:'right',flexShrink:0}}&gt; &lt;div style={{fontSize:13,fontWeight:600,color:'#c9a227'}}&gt;{b.views}&lt;/div&gt; &lt;div style={{fontSize:10,color:'#8fa3c4'}}&gt;views/week&lt;/div&gt; &lt;/div&gt; &lt;/div&gt; ))} &lt;/&gt; )} {step==='register'&&( &lt;div&gt; &lt;div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}&gt; &lt;button onClick={()=&gt;setStep('list')} style={{background:'transparent',border:'none',color:'#c9a227',fontSize:20,cursor:'pointer'}}&gt;←&lt;/button&gt; &lt;div style={{fontSize:18,fontWeight:700,color:'#f0f4ff'}}&gt;Register Business&lt;/div&gt; &lt;/div&gt; {[{label:'Business Name *',key:'name',type:'text',ph:'e.g. My Eswatini Lodge'},{label:'Phone *',key:'phone',type:'tel',ph:'+268 2XXX XXXX'},{label:'Email *',key:'email',type:'email',ph:'info@mybusiness.com'},{label:'Region',key:'region',type:'text',ph:'e.g. Ezulwini Valley'},{label:'Website',key:'website',type:'url',ph:'www.myhotel.com'},{label:'Description',key:'desc',type:'text',ph:'Tell tourists about your business'}].map(f=&gt;( &lt;div key={f.key} style={{marginBottom:12}}&gt; &lt;div style={{fontSize:12,color:'#8fa3c4',marginBottom:6}}&gt;{f.label}&lt;/div&gt; &lt;input type={f.type} value={form[f.key]} onChange={e=&gt;setForm(prev=&gt;({...prev,[f.key]:e.target.value}))} placeholder={f.ph} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px 14px',color:'#f0f4ff',fontSize:13,outline:'none',boxSizing:'border-box'}}/&gt; &lt;/div&gt; ))} &lt;div style={{marginBottom:16}}&gt; &lt;div style={{fontSize:12,color:'#8fa3c4',marginBottom:6}}&gt;Business Type&lt;/div&gt; &lt;select value={form.type} onChange={e=&gt;setForm(prev=&gt;({...prev,type:e.target.value}))} style={{width:'100%',background:'#0f2040',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px 14px',color:'#c9a227',fontSize:13,outline:'none',cursor:'pointer'}}&gt; {['Hotel','Restaurant','Craft Market','Tour Operator','Activity Centre','Transport','Spa & Wellness','Local Store','Other'].map(o=&gt;&lt;option key={o} value={o}&gt;{o}&lt;/option&gt;)} &lt;/select&gt; &lt;/div&gt; &lt;button style={styles.btnPrimary} onClick={()=&gt;{if(!form.name||!form.phone||!form.email){alert('Please fill required fields');return;}setStep('payment');}}&gt;Continue to Payment →&lt;/button&gt; &lt;/div&gt; )} {step==='payment'&&( &lt;div&gt; &lt;div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}&gt; &lt;button onClick={()=&gt;setStep('register')} style={{background:'transparent',border:'none',color:'#c9a227',fontSize:20,cursor:'pointer'}}&gt;←&lt;/button&gt; &lt;div style={{fontSize:18,fontWeight:700,color:'#f0f4ff'}}&gt;Payment&lt;/div&gt; &lt;/div&gt; &lt;div style={{background:'rgba(201,162,39,0.08)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:14,padding:16,marginBottom:20}}&gt; &lt;div style={{fontSize:13,color:'#8fa3c4',marginBottom:4}}&gt;Listing for: &lt;span style={{color:'#f0f4ff',fontWeight:600}}&gt;{form.name}&lt;/span&gt;&lt;/div&gt; &lt;div style={{fontSize:26,fontWeight:700,color:'#c9a227'}}&gt;E200.00&lt;/div&gt; &lt;div style={{fontSize:12,color:'#8fa3c4'}}&gt;Monthly listing fee&lt;/div&gt; &lt;/div&gt; &lt;div style={{marginBottom:12}}&gt; &lt;div style={{fontSize:12,color:'#8fa3c4',marginBottom:6}}&gt;Card Number&lt;/div&gt; &lt;input value={cardNum} onChange={e=&gt;setCardNum(e.target.value.replace(/\D/g,'').replace(/(\d{4})/g,'$1 ').trim().slice(0,19))} placeholder="1234 5678 9012 3456" maxLength={19} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'12px 14px',color:'#f0f4ff',fontSize:16,outline:'none',boxSizing:'border-box',letterSpacing:2}}/>
</div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
<div>
<div style={{fontSize:12,color:'#8fa3c4',marginBottom:6}}>Expiry</div>
<input value={expiry} onChange={e=>setExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'12px 14px',color:'#f0f4ff',fontSize:14,outline:'none',boxSizing:'border-box'}}/>
</div>
<div>
<div style={{fontSize:12,color:'#8fa3c4',marginBottom:6}}>CVV</div>

<input value={cvv} onChange={e=>setCvv(e.target.value.replace(/\D/g,''))} placeholder="123" maxLength={3} type="password" style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'12px 14px',color:'#f0f4ff',fontSize:14,outline:'none',boxSizing:'border-box'}}/>
</div>
</div>
<div style={{background:'rgba(29,158,117,0.08)',border:'0.5px solid rgba(29,158,117,0.2)',borderRadius:10,padding:12,marginBottom:16,display:'flex',gap:8,alignItems:'center'}}>
<span>🔒</span>
<div style={{fontSize:12,color:'#5dcaa5'}}>Secured with 256-bit SSL encryption</div>
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
topbar:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',borderBottom:'0.5px solid rgba(201,162,39,0.25)',background:'rgba(10,22,40,0.98)',position:'sticky',top:0,zIndex:100},

content:{flex:1,overflowY:'auto',padding:16},
bottomNav:{display:'flex',justifyContent:'space-around',padding:'8px 0 12px',borderTop:'0.5px solid rgba(201,162,39,0.25)',background:'rgba(10,22,40,0.98)',position:'sticky',bottom:0},
navItem:{display:'flex',flexDirection:'column',alignItems:'center',gap:2,cursor:'pointer',padding:'3px 4px',borderRadius:10},
navActive:{display:'flex',flexDirection:'column',alignItems:'center',gap:2,cursor:'pointer',padding:'3px 4px',borderRadius:10,background:'rgba(201,162,39,0.1)'},
sosBtn:{display:'flex',alignItems:'center',gap:10,background:'rgba(226,75,74,0.1)',border:'1px solid rgba(226,75,74,0.3)',borderRadius:12,padding:'12px 14px',marginBottom:14,cursor:'pointer'},

heroBanner:{background:'linear-gradient(135deg,#1a3a5c,#0d2540)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:16,padding:20,marginBottom:14},
heroBadge:{fontSize:11,color:'#f5d87a',background:'rgba(201,162,39,0.15)',border:'0.5px solid rgba(201,162,39,0.4)',padding:'4px 10px',borderRadius:20,display:'inline-block',marginBottom:10,fontWeight:600},
hstat:{flex:1,background:'rgba(201,162,39,0.08)',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:10,padding:10,textAlign:'center'},
aiCard:{background:'rgba(83,74,183,0.15)',border:'0.5px solid rgba(131,122,221,0.35)',borderRadius:14,padding

:'14px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:12,cursor:'pointer'},
sectionTitle:{fontSize:15,fontWeight:600,color:'#f0f4ff',marginBottom:12,marginTop:4},
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
