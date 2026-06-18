import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// ── FREE PHOTO HELPER ─────────────────────────────────────
const photo = (keywords, w=800, h=600) =>
  `https://source.unsplash.com/${w}x${h}/?${keywords}`;

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
    name:'Royal Swazi Spa and Hotel', region:'Ezulwini Valley',
    rating:'4.9', stars:'★★★★★', price:'E 1,800 to 4,500 per night',
    desc:'Luxury 5-star hotel with spa, casino and golf course',
    coverImg: photo('luxury,hotel,africa,resort'),
    amenities:['Luxury Spa','Casino','Golf Course','Swimming Pool','Fine Dining','Gym','Conference Rooms'],
    rooms:[
      {name:'Standard Room',price:'E 1,800',img:photo('hotel,room,luxury,bedroom')},
      {name:'Deluxe Suite',price:'E 2,800',img:photo('luxury,suite,hotel,elegant')},
      {name:'Presidential Suite',price:'E 4,500',img:photo('presidential,suite,luxury,hotel')},
    ],
    gallery:[photo('luxury,hotel,pool,africa'),photo('hotel,spa,wellness'),photo('hotel,restaurant,fine,dining'),photo('hotel,golf,course,green'),photo('hotel,lobby,luxury')]
  },
  {
    name:'Mantengha Cultural Village', region:'Ezulwini',
    rating:'4.7', stars:'★★★★☆', price:'E 600 to 1,200 per night',
    desc:'Authentic cultural experience in traditional Swazi huts',
    coverImg: photo('african,lodge,traditional,hut'),
    amenities:['Cultural Shows','Nature Walks','Traditional Food','Photography Tours','Bonfire'],
    rooms:[
      {name:'Traditional Hut',price:'E 600',img:photo('african,hut,traditional,accommodation')},
      {name:'Family Hut',price:'E 900',img:photo('african,lodge,room,traditional')},
      {name:'Premium Hut',price:'E 1,200',img:photo('luxury,lodge,africa,room')},
    ],
    gallery:[photo('african,village,traditional,huts'),photo('cultural,dance,africa'),photo('bonfire,africa,traditional'),photo('african,food,traditional'),photo('nature,walk,africa')]
  },
  {
    name:'Foresters Arms Hotel', region:'Malkerns',
    rating:'4.5', stars:'★★★★☆', price:'E 800 to 1,800 per night',
    desc:'Charming country hotel surrounded by forest and gardens',
    coverImg: photo('countryside,hotel,garden,charming'),
    amenities:['Fishing','Horse Riding','Pub','Forest Trails','Garden'],
    rooms:[
      {name:'Garden Room',price:'E 800',img:photo('garden,room,hotel,cozy')},
      {name:'Forest Suite',price:'E 1,200',img:photo('forest,suite,hotel,room')},
      {name:'Country Cottage',price:'E 1,800',img:photo('cottage,country,bedroom,cozy')},
    ],
    gallery:[photo('garden,hotel,countryside'),photo('horse,riding,countryside'),photo('fishing,river,countryside'),photo('pub,countryside,cozy'),photo('forest,trail,nature')]
  },
  {
    name:'Lidwala Backpacker Lodge', region:'Mbabane',
    rating:'4.3', stars:'★★★☆☆', price:'E 150 to 400 per night',
    desc:'Budget-friendly lodge with stunning rock formations',
    coverImg: photo('backpacker,hostel,budget,travel'),
    amenities:['Braai Area','Rock Views','Free WiFi','Shared Kitchen','Social Lounge'],
    rooms:[
      {name:'Dorm Bed',price:'E 150',img:photo('hostel,dorm,backpacker,bed')},
      {name:'Private Room',price:'E 280',img:photo('hostel,private,room,simple')},
      {name:'Deluxe Room',price:'E 400',img:photo('budget,hotel,room,clean')},
    ],
    gallery:[photo('backpacker,hostel,lounge'),photo('granite,rock,view,landscape'),photo('braai,fire,outdoor'),photo('kitchen,hostel,shared'),photo('social,lounge,backpacker')]
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
function Img({src, alt, style, fallback='https://source.unsplash.com/400x300/?africa,nature'}) {
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
function App() {
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
        </div>
      </div>

      <div style={styles.content}>
        {tab==='home'      && <HomeTab setTab={setTab} onSelect={setSelectedPlace} onSelectRestaurant={setSelectedRestaurant} onSelectHotel={setSelectedHotel} onSelectStore={setSelectedStore} t={t}/>}
        {tab==='explore'   && <ExploreTab onSelect={setSelectedPlace} onVirtualTour={setShowVirtualTour} t={t}/>}
        {tab==='translate' && <TranslateTab t={t} lang={lang}/>}
        {tab==='compare'   && <CompareTab t={t} onSelectRestaurant={setSelectedRestaurant} onSelectHotel={setSelectedHotel} onSelectStore={setSelectedStore}/>}
        {tab==='map'       && <MapTab t={t}/>}
        {tab==='ai'        && <AITab t={t}/>}
        {tab==='business'  && <BusinessTab t={t}/>}
      </div>

      <div style={styles.bottomNav}>
        {[
          {id:'home',     icon:'🏠',label:t.home},
          {id:'explore',  icon:'🔭',label:t.explore2},
          {id:'translate',icon:'🌐',label:t.translate},
          {id:'compare',  icon:'⚖️', label:t.compare},
          {id:'map',      icon:'🗺️', label:t.navigate},
          {id:'ai',       icon:'🤖',label:t.ai},
          {id:'business', icon:'🏢',label:t.business},
        ].map(item=>(
          <div key={item.id} style={tab===item.id?styles.navActive:styles.navItem} onClick={()=>setTab(item.id)}>
            <span style={{fontSize:16}}>{item.icon}</span>
            <span style={{fontSize:8,color:tab===item.id?'#c9a227':'#8fa3c4',fontWeight:500}}>{item.label}</span>
          </div>
        ))}
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
  const [list,setList] = useState([
    {name:'Sarah M.',flag:'🇬🇧',stars:5,text:'Absolutely breathtaking! Best experience of my life.',date:'2 days ago'},
    {name:'Joao P.',flag:'🇧🇷',stars:5,text:'Incredible! Will definitely come back.',date:'1 week ago'},
    {name:'Thandi D.',flag:'🇿🇦',stars:4,text:'Beautiful place, well maintained.',date:'2 weeks ago'},
  ]);
  const [show,setShow] = useState(false);
  const [nName,setNName]=useState(''); const [nText,setNText]=useState(''); const [nStars,setNStars]=useState(5);
  return (
    <div style={{marginBottom:16}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <div style={styles.sectionTitle}>{t.reviews}</div>
        <button style={{fontSize:11,color:'#c9a227',background:'rgba(201,162,39,0.1)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:20,padding:'4px 12px',cursor:'pointer'}} onClick={()=>setShow(!show)}>+ {t.writeReview}</button>
      </div>
      {show&&(
        <div style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:12,padding:14,marginBottom:12}}>
          <div style={{display:'flex',gap:5,marginBottom:10}}>{[1,2,3,4,5].map(s=><span key={s} onClick={()=>setNStars(s)} style={{fontSize:22,cursor:'pointer',opacity:s<=nStars?1:0.3}}>⭐</span>)}</div>
          <input value={nName} onChange={e=>setNName(e.target.value)} placeholder="Your name" style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:8,padding:'9px 12px',color:'#f0f4ff',fontSize:13,outline:'none',marginBottom:8,boxSizing:'border-box'}}/>
          <textarea value={nText} onChange={e=>setNText(e.target.value)} placeholder="Share your experience..." rows={3} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:8,padding:'9px 12px',color:'#f0f4ff',fontSize:13,outline:'none',resize:'none',fontFamily:'inherit',boxSizing:'border-box'}}/>
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button style={{...styles.btnPrimary,flex:1,padding:'9px',fontSize:13}} onClick={()=>{if(!nName||!nText)return;setList(p=>[{name:nName,flag:'🌍',stars:nStars,text:nText,date:'Just now'},...p]);setNName('');setNText('');setShow(false);}}>{t.submit}</button>
            <button style={{flex:1,padding:'9px',fontSize:13,borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:'transparent',color:'#8fa3c4',cursor:'pointer'}} onClick={()=>setShow(false)}>{t.cancel}</button>
          </div>
        </div>
      )}
      {list.map((r,i)=>(
        <div key={i} style={{background:'rgba(255,255,255,0.04)',border:'0.5px solid rgba(201,162,39,0.15)',borderRadius:12,padding:12,marginBottom:8}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:18}}>{r.flag}</span><span style={{fontSize:13,fontWeight:600,color:'#f0f4ff'}}>{r.name}</span></div>
            <span style={{fontSize:10,color:'#8fa3c4'}}>{r.date}</span>
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
  const [saved,setSaved] = useState(false);
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
          <button style={{flex:1,padding:'11px',fontSize:13,borderRadius:50,border:saved?'0.5px solid rgba(29,158,117,0.6)':'0.5px solid rgba(201,162,39,0.4)',background:saved?'rgba(29,158,117,0.15)':'transparent',color:saved?'#5dcaa5':'#c9a227',cursor:'pointer',fontWeight:600}} onClick={()=>setSaved(true)}>{saved?'✅ Saved':t.savePlace}</button>
        </div>
        <button style={{width:'100%',padding:'11px',fontSize:13,borderRadius:50,border:'1px solid rgba(226,75,74,0.4)',background:'rgba(226,75,74,0.1)',color:'#e24b4a',cursor:'pointer',fontWeight:600,marginBottom:16}} onClick={()=>{if(window.confirm('Call Eswatini Emergency Services 999?'))window.location.href='tel:999';}}>🆘 {t.sos}</button>
      </div>
    </div>
  );
}

// ── RESTAURANT DETAIL WITH PHOTOS & ORDERING ──────────────
function RestaurantDetail({item,onBack,t}) {
  const [cart,setCart]         = useState([]);
  const [showCart,setShowCart] = useState(false);
  const [ordered,setOrdered]   = useState(false);
  const [tableNum,setTableNum] = useState('');
  const addToCart = mi=>{
    setCart(prev=>{
      const ex=prev.find(c=>c.name===mi.name);
      return ex?prev.map(c=>c.name===mi.name?{...c,qty:c.qty+1}:c):[...prev,{...mi,qty:1}];
    });
  };
  const total = cart.reduce((s,c)=>s+c.price*c.qty,0);

  if(ordered) return (
    <div style={styles.app}>
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:32,textAlign:'center'}}>
        <div style={{fontSize:60,marginBottom:14}}>✅</div>
        <div style={{fontSize:20,fontWeight:700,color:'#5dcaa5',marginBottom:8}}>Order Placed!</div>
        <div style={{fontSize:13,color:'#8fa3c4',lineHeight:1.7,marginBottom:20}}>Your order from {item.name} has been received.<br/>Table: {tableNum} · Est. time: 20-30 min</div>
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
        {showCart&&cart.length>0&&(
          <div style={{background:'rgba(201,162,39,0.08)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:14,padding:14,marginBottom:14}}>
            <div style={{fontSize:14,fontWeight:600,color:'#c9a227',marginBottom:10}}>🛒 {t.cart}</div>
            {cart.map(c=>(
              <div key={c.name} style={{display:'flex',justifyContent:'space-between',marginBottom:5,fontSize:13,color:'#f0f4ff'}}>
                <span>{c.name} x{c.qty}</span><span style={{color:'#c9a227'}}>E {c.price*c.qty}</span>
              </div>
            ))}
            <div style={{borderTop:'0.5px solid rgba(255,255,255,0.1)',marginTop:8,paddingTop:8,fontSize:14,fontWeight:700,color:'#c9a227',display:'flex',justifyContent:'space-between'}}>
              <span>Total:</span><span>E {total}</span>
            </div>
            <input value={tableNum} onChange={e=>setTableNum(e.target.value)} placeholder={t.tableNum} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'9px',color:'#f0f4ff',fontSize:12,outline:'none',marginTop:10,boxSizing:'border-box'}}/>
            <button style={{...styles.btnPrimary,marginTop:10}} onClick={()=>{if(!tableNum)return alert('Please enter table number');setOrdered(true);}}>{t.placeOrder}</button>
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
  const [showBooking,setShowBooking] = useState(false);
  const [checkIn,setCheckIn]   = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [guests,setGuests]     = useState('2');
  const [selRoom,setSelRoom]   = useState(null);
  return (
    <div style={styles.app}>
      <div style={{position:'relative',flexShrink:0}}>
        <Slideshow images={item.gallery} height={240}/>
        <button onClick={onBack} style={{position:'absolute',top:14,left:14,background:'rgba(10,22,40,0.75)',border:'none',borderRadius:50,padding:'7px 13px',color:'#f0f4ff',fontSize:12,cursor:'pointer',zIndex:10}}>← Back</button>
        <div style={{position:'absolute',top:14,right:14,background:'rgba(201,162,39,0.9)',borderRadius:20,padding:'3px 10px',fontSize:11,color:'#0a1628',zIndex:10}}>{item.stars}</div>
        <div style={{position:'absolute',bottom:12,left:14,zIndex:10}}>
          <div style={{fontSize:18,fontWeight:700,color:'#fff',textShadow:'0 2px 8px rgba(0,0,0,0.9)'}}>{item.name}</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.85)'}}>📍 {item.region} · ⭐ {item.rating}</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:16}}>
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
            <button style={{padding:'7px 13px',borderRadius:50,background:'linear-gradient(135deg,#c9a227,#e8b93a)',border:'none',color:'#0a1628',fontSize:11,fontWeight:700,cursor:'pointer',flexShrink:0}} onClick={(e)=>{e.stopPropagation();setShowBooking(true);}}>{t.bookNow}</button>
          </div>
        ))}
        {showBooking&&(
          <div style={{background:'rgba(201,162,39,0.06)',border:'0.5px solid rgba(201,162,39,0.25)',borderRadius:14,padding:16,marginTop:14,marginBottom:14}}>
            <div style={{fontSize:14,fontWeight:600,color:'#c9a227',marginBottom:14}}>📅 {t.bookNow}</div>
            {[[t.checkIn,checkIn,setCheckIn,'date'],[t.checkOut,checkOut,setCheckOut,'date'],[t.guests,guests,setGuests,'number']].map(([label,val,setter,type])=>(
              <div key={label} style={{marginBottom:12}}>
                <div style={{fontSize:11,color:'#8fa3c4',marginBottom:5}}>{label}</div>
                <input type={type} value={val} onChange={e=>setter(e.target.value)} style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'10px 14px',color:'#f0f4ff',fontSize:13,outline:'none',boxSizing:'border-box'}}/>
              </div>
            ))}
            <button style={{...styles.btnPrimary,marginBottom:8}} onClick={()=>{if(checkIn&&checkOut)alert('Booking Confirmed!\n'+item.name+'\nCheck-in: '+checkIn+'\nCheck-out: '+checkOut+'\nGuests: '+guests+'\nWe will contact you within 24 hours!');else alert('Please fill in all dates');}}>{t.confirmBooking}</button>
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
function WeatherWidget({t}) {
  const [day,setDay]     = useState('Today');
  const [sel,setSel]     = useState(null);
  const days = Object.keys(weatherData);
  const cities = weatherData[day];
  return (
    <div style={{marginBottom:16}}>
      <div style={styles.sectionTitle}>{t.weather}</div>
      <div style={{display:'flex',gap:7,overflowX:'auto',paddingBottom:8,marginBottom:10,scrollbarWidth:'none'}}>
        {days.map(d=><button key={d} onClick={()=>{setDay(d);setSel(null);}} style={{flexShrink:0,padding:'5px 13px',borderRadius:20,border:d===day?'1px solid #c9a227':'0.5px solid rgba(201,162,39,0.2)',background:d===day?'rgba(201,162,39,0.15)':'transparent',color:d===day?'#c9a227':'#8fa3c4',fontSize:11,cursor:'pointer',fontWeight:d===day?600:400}}>{d}</button>)}
      </div>
      <div style={{display:'flex',gap:10}}>
        {cities.map(c=>(
          <div key={c.name} onClick={()=>setSel(sel&&sel.name===c.name?null:c)} style={{flex:1,background:sel&&sel.name===c.name?'rgba(24,95,165,0.25)':'rgba(24,95,165,0.12)',border:sel&&sel.name===c.name?'0.5px solid rgba(24,95,165,0.6)':'0.5px solid rgba(24,95,165,0.3)',borderRadius:12,padding:'10px 6px',textAlign:'center',cursor:'pointer',transition:'all 0.2s'}}>
            <div style={{fontSize:22}}>{c.icon}</div>
            <div style={{fontSize:17,fontWeight:700,color:'#f0f4ff',marginTop:4}}>{c.temp}°C</div>
            <div style={{fontSize:10,color:'#c9a227',fontWeight:600,marginTop:2}}>{c.name}</div>
            <div style={{fontSize:9,color:'#8fa3c4',marginTop:1}}>{c.desc}</div>
          </div>
        ))}
      </div>
      {sel&&(
        <div style={{background:'rgba(24,95,165,0.12)',border:'0.5px solid rgba(24,95,165,0.3)',borderRadius:12,padding:12,marginTop:10}}>
          <div style={{fontSize:13,fontWeight:600,color:'#f0f4ff',marginBottom:8}}>{sel.icon} {sel.name} — {day}</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
            {[['💧',sel.humidity,'Humidity'],['💨',sel.wind,'Wind'],['☀️',sel.uv,'UV']].map(([ic,val,lbl])=>(
              <div key={lbl} style={{background:'rgba(255,255,255,0.05)',borderRadius:8,padding:'9px 6px',textAlign:'center'}}>
                <div style={{fontSize:16}}>{ic}</div>
                <div style={{fontSize:12,fontWeight:600,color:'#c9a227',marginTop:3}}>{val}</div>
                <div style={{fontSize:9,color:'#8fa3c4',marginTop:2}}>{lbl}</div>
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

// ── HOME TAB ──────────────────────────────────────────────
function HomeTab({setTab,onSelect,onSelectRestaurant,onSelectHotel,onSelectStore,t}) {
  const [sec,setSec] = useState('attractions');
  const handleSOS = ()=>{if(window.confirm('Call Eswatini Emergency Services?\nPolice: 999\nAmbulance: 977\nFire: 933'))window.location.href='tel:999';};
  return (
    <div>
      <div style={styles.sosBtn} onClick={handleSOS}>
        <span style={{fontSize:18}}>🆘</span>
        <div><div style={{fontSize:12,fontWeight:600,color:'#e24b4a'}}>{t.sos}</div><div style={{fontSize:10,color:'#8fa3c4'}}>{t.sosSub}</div></div>
        <span style={{color:'#8fa3c4',marginLeft:'auto'}}>›</span>
      </div>
      <WeatherWidget t={t}/>
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
      <div style={{background:'#0d2540',border:'0.5px solid rgba(201,162,39,0.2)',borderRadius:16,height:190,overflow:'hidden',marginBottom:14}}>
        <svg width="100%" height="100%" viewBox="0 0 340 190" xmlns="http://www.w3.org/2000/svg">
          <rect width="340" height="190" fill="#0d2540"/>
          <rect x="8" y="8" width="324" height="174" rx="10" fill="#0f2a4a" stroke="rgba(201,162,39,0.2)" strokeWidth="0.5"/>
          <path d="M55 160 Q115 130 168 97 Q218 65 272 42" stroke="#c9a227" strokeWidth="3" fill="none" strokeDasharray="6,4" opacity="0.9"/>
          <circle cx="55" cy="160" r="8" fill="#e24b4a"/>
          <text x="55" y="164" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">{loc?'📍':'YOU'}</text>
          <circle cx="168" cy="97" r="9" fill="#c9a227"/>
          <text x="168" y="101" textAnchor="middle" fill="#0a1628" fontSize="9" fontWeight="700">★</text>
          <circle cx="272" cy="42" r="7" fill="#5dcaa5"/>
          <text x="272" y="46" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">B</text>
          <rect x="106" y="82" width="72" height="15" rx="4" fill="rgba(201,162,39,0.25)" stroke="rgba(201,162,39,0.5)" strokeWidth="0.5"/>
          <text x="142" y="93" textAnchor="middle" fill="#c9a227" fontSize="8">Mantenga Falls</text>
          <rect x="237" y="29" width="62" height="14" rx="4" fill="rgba(93,202,165,0.2)" stroke="rgba(93,202,165,0.4)" strokeWidth="0.5"/>
          <text x="268" y="40" textAnchor="middle" fill="#5dcaa5" fontSize="8">Hlane Reserve</text>
        </svg>
      </div>
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
  const [card,setCard]   = useState('');
  const [exp,setExp]     = useState('');
  const [cvv,setCvv]     = useState('');
  const [selBiz,setSelBiz] = useState(null);
  const [list,setList]   = useState([
    {name:'Royal Swazi Hotel',type:'Hotel',region:'Ezulwini Valley',img:photo('luxury,hotel,africa,resort'),views:'1,240',verified:true,revenue:'E 4,500'},
    {name:"Malandela's Restaurant",type:'Restaurant',region:'Malkerns',img:photo('african,restaurant,garden'),views:'876',verified:true,revenue:'E 2,800'},
    {name:'Swazi Candles Market',type:'Craft',region:'Malkerns',img:photo('candles,colorful,craft,african'),views:'654',verified:true,revenue:'E 1,200'},
  ]);
  const pay=()=>{
    if(!card||!exp||!cvv||card.replace(/\s/g,'').length<16){alert('Please fill in all valid payment details');return;}
    alert('Payment of E200 successful!\nYour listing will go live within 24 hours.');
    setList(p=>[...p,{name:form.name,type:form.type,region:form.region,img:photo(form.type+',business,africa'),views:'0',verified:false,revenue:'E 0'}]);
    setStep('list'); setForm({name:'',type:'Hotel',region:'',phone:'',email:'',desc:''}); setCard(''); setExp(''); setCvv('');
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
          <button style={{...styles.btnPrimary,marginBottom:8}} onClick={pay}>Pay E200 and Submit Listing</button>
          <button style={{width:'100%',padding:'10px',borderRadius:50,border:'0.5px solid rgba(201,162,39,0.3)',background:'transparent',color:'#8fa3c4',cursor:'pointer',fontSize:13}} onClick={()=>setStep('register')}>← Back</button>
        </div>
      )}
    </div>
  );
}

// ── STYLES ────────────────────────────────────────────────
const styles = {
  splash:{minHeight:'100vh',background:'linear-gradient(160deg,#0a1628 0%,#0d1f3c 40%,#0a1628 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'2rem',position:'relative',overflow:'hidden'},
  splashGlow:{position:'absolute',top:'20%',left:'50%',transform:'translateX(-50%)',width:300,height:300,background:'radial-gradient(circle,rgba(201,162,39,0.1) 0%,transparent 70%)',borderRadius:'50%',pointerEvents:'none'},
  splashTitle:{fontSize:48,fontWeight:700,color:'#f0f4ff',margin:'0 0 6px',letterSpacing:-1},
  gold:{color:'#c9a227'},
  btnPrimary:{background:'linear-gradient(135deg,#c9a227,#e8b93a)',color:'#0a1628',border:'none',padding:'13px 36px',borderRadius:50,fontSize:15,fontWeight:700,cursor:'pointer',width:'100%',maxWidth:480},
  authInput:{width:'100%',background:'rgba(255,255,255,0.06)',border:'0.5px solid rgba(201,162,39,0.3)',borderRadius:10,padding:'11px 13px',color:'#f0f4ff',fontSize:14,outline:'none',marginBottom:11,boxSizing:'border-box',fontFamily:'inherit'},
  app:{minHeight:'100vh',background:'#0a1628',display:'flex',flexDirection:'column',maxWidth:480,margin:'0 auto'},
  topbar:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 15px',borderBottom:'0.5px solid rgba(201,162,39,0.25)',background:'rgba(10,22,40,0.98)',position:'sticky',top:0,zIndex:100},
  content:{flex:1,overflowY:'auto',padding:14},
  bottomNav:{display:'flex',justifyContent:'space-around',padding:'7px 0 11px',borderTop:'0.5px solid rgba(201,162,39,0.25)',background:'rgba(10,22,40,0.98)',position:'sticky',bottom:0},
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