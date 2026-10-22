/* All page content, mirroring the live site's data. */
export const WA_NUMBER = '971541676733'
export const WA_TEXT = "Hi TeddyPups! I'd love to know more about your puppies."
export const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEXT)}`
export const PHONE_TEL = 'tel:+971541676733'

const m = (id, hash, file) => `/media/${id}/${hash}/${file}`

export const PUPPY_IMAGES = {
  max: m('Z0ToauDx7Eve', '5fffe4d022', 'b942a5_4b8cfb8204d24eadaf524332aba1dc15-mv2.webp'),
  ktm: m('gAaGwoGej2g6', '5523e884dd', 'b942a5_50f0ae67c9ff437d911597d52a9e63b3-mv2.jpg'),
  ktp: m('xeMJCapr5vcU', 'e618c653b2', 'b942a5_14376a216177484dbbb27995d0f6aeb7-mv2.jpg'),
  malcav: m('YQhey4j7uWvZ', '3ea10db6c1', 'b942a5_7ce7e7bd18424b6c8fb16dd30113ade2-mv2.jpg'),
  toypoo: m('vMu0BPvkAZ-j', 'c65e53967d', 'b942a5_0b2c0c0d178c4005acbe28725a5ea573-mv2.jpg'),
  mal2: m('3WJNmn6VVgVu', '732f779474', 'b942a5_2b5dcece361b4589890ae920c66a1b70-mv2.jpg'),
  pom1: m('3yOfnmoyPooH', '81e0c7e00c', 'b942a5_556841b9a73942e5a9d782a683f3bc68-mv2.jpg'),
  copper: m('O-6w4FYqE10j', 'be76f399cc', 'b942a5_bb73ebbb952047988f944f3a8e3052bd-mv2.jpg'),
  shitzuf: m('qNrTCSrsYyzY', '168fa8c4ff', 'b942a5_eb14616c76c24da89afe7fa3b7d7ae6a-mv2.jpeg'),
  shitzum: m('crgs9ih6as_M', 'e37bafb1bf', 'b942a5_344e49c6c34940d2b09a3ddd5c2e3234-mv2.jpg'),
  mal1: m('wNm2_VIBEQvK', '4b68f59e75', 'b942a5_7dd33c9b78c04f78a6a1c7386fb55620-mv2.jpg'),
  mal3: m('lMhASnmIIVQ4', 'ad2353ad31', 'b942a5_6a5617708d75408b8f73725080ed0149-mv2.jpg'),
  ktomp1: m('EsAq2LSRvVCJ', '4d553ed044', 'b942a5_a8d264c1aa754d80bc7c98917dfd1fda-mv2.jpg'),
  ktomp2: m('vzf7P8SPCZ-Q', 'a8db4ee114', 'b942a5_967bb346583b4146acb56607f5da5f21-mv2.jpg'),
  ktompm: m('nZTGFv46hrZI', 'fb9eeefc9c', 'b942a5_dcb8eb174915463ea0c40c58b7b0e406-mv2.jpg'),
  show1: m('FHyoHcIosLZE', '60f6e7e00a', '27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg'),
  show2: m('Vi-kzyvemRl4', 'e740ed8a24', '27b888_323008bb0f6a41d4bde2a0da7206cd98f001.jpg'),
  show3: m('g_e4ebbc7fyG', '8276289ae7', '27b888_323008bb0f6a41d4bde2a0da7206cd98f002.jpg'),
  show4: m('skvodl2NZiKq', 'cefab5eee9', '27b888_323008bb0f6a41d4bde2a0da7206cd98f003.jpg'),
  video: m('dSAUmXs8Qai9', 'ef39cbea20', '27b888_323008bb0f6a41d4bde2a0da7206cd98-720p.mp4'),
  fam1: m('dI8Jv0KRTiLJ', 'd2d7e5375b', '27b888_7d940ce5701f48d98327e4a242b53ac4-mv2.jpg'),
  fam2: m('TI-WtaFssfQt', 'c41fb2a387', '27b888_15920f828b864dd1b44b98ec4e964c53-mv2.jpg'),
  fam3: m('j6T9eswP2eS8', '59c6879a1d', '27b888_bc27df54dcce410196c6016475364ff3-mv2.jpg'),
  fam4: m('HJgL4rRnmReV', '533701358f', '27b888_082e47dfd8144423a96dc70d966fa5b2-mv2.jpg'),
  fam5: m('uc5ANs5jm7r7', '7160d8b7b1', '27b888_f7f4966e59e94db591784d4ec546682f-mv2.jpg'),
  fam6: m('pRJubyqHw8p7', 'd58c4c07ee', '27b888_b073c5815f7c4f92ad9a57741a653663-mv2.jpg'),
  fam7: m('4wOJk9azop_-', '65ecf66bf0', '27b888_cfe895dbcc2d4bff85f890be9b496543-mv2.jpg'),
  fam8: m('3h20rIasJCOa', '10c307cb1c', '27b888_a7e7ab6a931e4c79a798bab9927d396e-mv2.jpg'),
}

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Puppies', href: '/puppies' },
  { label: 'Happy families', href: '/happy-families' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Visit & contact', href: '/contact' },
]

/* Hero lineup — same seats as the live page */
export const LINEUP = [
  { name: 'Max', img: PUPPY_IMAGES.max, x: '9%', w: '8.6rem', peek: 0.62, tilt: '-5deg', label: 'Max, Maltipoo', pos: '53.8% 44.3%' },
  { name: 'Korean Teacup Maltipoo', img: PUPPY_IMAGES.ktm, x: '22.5%', w: '10.4rem', peek: 0.8, tilt: '3deg', pos: '52.5% 42.6%' },
  { name: 'Korean Teacup Poodle', img: PUPPY_IMAGES.ktp, x: '35%', w: '9.2rem', peek: 0.7, tilt: '-2deg', pos: '54.5% 45.7%' },
  { name: 'Maltipoo & Cavapoo', img: PUPPY_IMAGES.malcav, x: '65%', w: '9.4rem', peek: 0.74, tilt: '3deg', pos: '44.7% 29.5%' },
  { name: 'Toy Poodle', img: PUPPY_IMAGES.toypoo, x: '77.5%', w: '10.6rem', peek: 0.82, tilt: '-3deg', pos: '65.4% 44.7%' },
  { name: 'Maltipoo', img: PUPPY_IMAGES.mal2, x: '91%', w: '8.4rem', peek: 0.6, tilt: '4deg', pos: '64.6% 42.3%' },
]

/* Meet-the-pups doors */
export const DOORS = [
  { name: 'Max', meta: 'Maltipoo, boy, 3 months, with video', img: PUPPY_IMAGES.max, pos: '53.8% 44.3%', door: '#a24a1a' },
  { name: 'Korean Teacup Maltipoo', meta: 'girl, 2 months, with video', img: PUPPY_IMAGES.ktm, pos: '52.5% 42.6%', door: '#5a3a28' },
  { name: 'Korean Teacup Poodle', meta: 'girl, 2 months', img: PUPPY_IMAGES.ktp, pos: '54.5% 45.7%', door: '#d4893f' },
  { name: 'Maltipoo & Cavapoo', meta: 'boy, 3 months Maltipoo & 2 months Cavapoo, with video', img: PUPPY_IMAGES.malcav, pos: '44.7% 29.5%', door: '#b8644a' },
  { name: 'Toy Poodle', meta: 'boy & girl, 2 months', img: PUPPY_IMAGES.toypoo, pos: '65.4% 44.7%', door: '#7a4a2e' },
  { name: 'Maltipoo', meta: 'girl, 3 months, with video', img: PUPPY_IMAGES.mal2, pos: '64.6% 42.3%', door: '#a24a1a' },
  { name: 'Pomeranian', meta: 'girl, 3 months', img: PUPPY_IMAGES.pom1, pos: '40.3% 44.3%', door: '#5a3a28' },
  { name: 'Copper', meta: 'Cavapoo, boy, 2 months', img: PUPPY_IMAGES.copper, pos: '43.0% 50.5%', door: '#d4893f' },
  { name: 'Shih Tzu', meta: 'girl, 2 months', img: PUPPY_IMAGES.shitzuf, pos: '44.8% 42.5%', door: '#b8644a' },
  { name: 'Shih Tzu', meta: 'boy, 2 months', img: PUPPY_IMAGES.shitzum, pos: '40.3% 43.6%', door: '#7a4a2e' },
  { name: 'Maltipoo', meta: 'girl, 2.5 months', img: PUPPY_IMAGES.mal1, pos: '47.5% 50.5%', door: '#a24a1a' },
  { name: 'Maltipoo', meta: 'girl, 2 months', img: PUPPY_IMAGES.mal3, pos: '56.9% 49.2%', door: '#5a3a28' },
  { name: 'Korean Teacup Pomeranian', meta: 'girl, 2 months', img: PUPPY_IMAGES.ktomp1, pos: '49.9% 51.3%', door: '#d4893f' },
  { name: 'Korean Teacup Pomeranian', meta: 'girl, 2 months', img: PUPPY_IMAGES.ktomp2, pos: '49.9% 48.6%', door: '#b8644a' },
  { name: 'Korean Teacup Pomeranian', meta: 'boy, 2 months', img: PUPPY_IMAGES.ktompm, pos: '48.9% 44.1%', door: '#7a4a2e' },
]

export const CHAT_STEPS = [
  {
    title: 'Choose your breed',
    text: "Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle.",
  },
  {
    title: 'Get photos & details',
    text: 'Our team will share real photos, health details, and all necessary information directly on WhatsApp.',
  },
  {
    title: 'Secure & safe delivery',
    text: 'Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.',
  },
]

export const BREED_CHIPS = [
  { label: 'Maltipoo', href: '#meet' },
  { label: 'Pomeranian', href: '#meet' },
  { label: 'Poodle', href: '#meet' },
  { label: 'Cavapoo', href: '#meet' },
  { label: 'Shih Tzu', href: '#meet' },
]

export const STAMP_ENTRIES = [
  { shape: 'round', ink: '#a24a1a', tilt: '-8deg', title: 'Vet-checked & healthy', text: 'Every puppy comes vaccinated, dewormed, and with a verified health certificate.', icon: 'heart' },
  { shape: 'ticket', ink: '#1f6b45', tilt: '5deg', title: 'Korea to Dubai, safely', text: 'Trusted breeders, safe travel, and premium care from start to finish.', icon: 'plane' },
  { shape: 'oval', ink: '#5a3a28', tilt: '-4deg', title: 'Support 24/7', text: 'Always here to help, from choosing your puppy to post-delivery support.', icon: 'headset' },
  { shape: 'scallop', ink: '#c2622b', tilt: '7deg', title: 'Trusted by families worldwide', text: 'Puppies delivered to loving homes all around the world.', icon: 'globe' },
]

export const FAMILY_PHOTOS = [
  { img: PUPPY_IMAGES.fam1, caption: 'Lulu \u{1F9F8} with her new mummy ❤️', tilt: '-2.2deg', tape: '#f6d79a', tapePos: 'center', delay: 330 },
  { img: PUPPY_IMAGES.fam2, caption: 'Adorable Maltipoo baby \u{1F9F8}❤️', tilt: '1.6deg', tape: '#f9cdbf', tapePos: 'left', delay: 0 },
  { img: PUPPY_IMAGES.fam3, caption: 'My new teddy puppy \u{1F970}\u{1F9F8}', tilt: '-0.9deg', tape: '#cfe5f6', tapePos: 'right', delay: 550 },
  { img: PUPPY_IMAGES.fam4, caption: 'Our new puppies \u{1F9F8}\u{1F970}\u{1F917}', tilt: '2.4deg', tape: '#f6d79a', tapePos: 'tl-tr', delay: 110 },
  { img: PUPPY_IMAGES.fam5, caption: 'New puppy \u{1F9F8}\u{1F60D}', tilt: '-1.5deg', tape: '#e9dcc4', tapePos: 'center', delay: 660 },
  { img: PUPPY_IMAGES.fam6, caption: 'Gang of 3 \u{1F60D}\u{1F9F8}', tilt: '0.8deg', tape: '#f6d79a', tapePos: 'right', delay: 220 },
  { img: PUPPY_IMAGES.fam7, caption: 'So happy \u{1F60D}\u{1F60D}', tilt: '-2.6deg', tape: '#f9cdbf', tapePos: 'left', delay: 770 },
  { img: PUPPY_IMAGES.fam8, caption: 'New pup \u{1F917}\u{1F4AB}', tilt: '1.2deg', tape: '#cfe5f6', tapePos: 'center', delay: 440 },
]

export const FAQS = [
  {
    q: 'Are your puppies vaccinated and health-checked?',
    a: 'Yes. All our puppies come with a verified health certificate from licensed vets. Every puppy is vaccinated, dewormed, and thoroughly checked before joining your family.',
  },
  {
    q: 'Can I meet a puppy before I decide?',
    a: 'Yes. Come meet our locally available puppies in our Downtown Dubai showroom and spend time bonding before making your decision.',
  },
  {
    q: 'Can I take my puppy home the same day?',
    a: 'Local puppies are available immediately, so you can take your puppy home the same day.',
  },
]

export const FOOTER_EXPLORE = [
  { label: 'Available puppies', href: '/puppies' },
  { label: 'Gone home', href: '/gone-home' },
  { label: 'Happy families', href: '/happy-families' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Delivery & collection', href: '/how-it-works#delivery' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Visit & contact', href: '/contact' },
]

export const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/teddypups.worldwide/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@teddypupsuae' },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61567496944539' },
]

/* Star scatter for the night scene + footer (same as live) */
export const NIGHT_STARS = [
  { left: '4%', top: '12%', size: 18 }, { left: '12%', top: '48%', size: 12 }, { left: '20%', top: '22%', size: 22 },
  { left: '27%', top: '70%', size: 14 }, { left: '35%', top: '10%', size: 16 }, { left: '43%', top: '55%', size: 20 },
  { left: '52%', top: '18%', size: 13 }, { left: '60%', top: '74%', size: 17 }, { left: '68%', top: '30%', size: 21 },
  { left: '78%', top: '12%', size: 15 }, { left: '88%', top: '52%', size: 19 },
]

export const FOOTER_STARS = [
  { left: '6%', top: '18%', size: 16 }, { left: '16%', top: '55%', size: 12 }, { left: '26%', top: '25%', size: 20 },
  { left: '38%', top: '60%', size: 13 }, { left: '47%', top: '20%', size: 17 }, { left: '58%', top: '50%', size: 14 },
  { left: '66%', top: '15%', size: 19 }, { left: '76%', top: '58%', size: 12 }, { left: '86%', top: '28%', size: 16 },
]
