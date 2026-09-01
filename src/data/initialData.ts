import { Product, Category, BannerSlide, StoreSettings, Order } from '../types';

export const resolvePexelsUrl = (idOrUrl: string | number): string => {
  if (typeof idOrUrl === 'string' && (idOrUrl.startsWith('http://') || idOrUrl.startsWith('https://') || idOrUrl.startsWith('/'))) {
    return idOrUrl;
  }
  return `https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80`;
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    slug: 'ethnic',
    name: 'Ethnic Wear',
    bn: 'ঐতিহ্যবাহী পোশাক',
    d: 'Handloom panjabis, benarasi sarees, organza drapes, and festive ensembles.',
    img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'modern',
    name: 'Modern Wear',
    bn: 'আধুনিক পোশাক',
    d: 'Silk-cotton shirts, tailored trousers, heavyweight tees and hoodies.',
    img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'accessories',
    name: 'Leather & Accessories',
    bn: 'এক্সেসরিজ ও চামড়া',
    d: 'Full-grain leather bags, bifold wallets, aviator sunglasses and fine jewelry.',
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'tech',
    name: 'Tech & Chronographs',
    bn: 'প্রযুক্তি ও ঘড়ি',
    d: 'ANC wireless audio, luxury chronographs, smartwatches and executive gadgets.',
    img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'beauty',
    name: 'Beauty & Fragrance',
    bn: 'সুগন্ধি ও রূপচর্চা',
    d: 'Pure Cambodian oud, Taif rose attar, extrait perfumes and botanical serums.',
    img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'footwear',
    name: 'Footwear',
    bn: 'জুতা ও স্যান্ডেল',
    d: 'Handcrafted leather loafers, Peshawari sandals, Chelsea boots and sneakers.',
    img: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=900&q=80',
  },
];

export const INITIAL_BANNERS: BannerSlide[] = [
  {
    id: 'b1',
    t: 'Eid & Festive Heritage 2026',
    bn: 'ঈদ ও উৎসবের নতুন কালেকশন',
    s: 'Handcrafted Jamdani panjabis, pure silk Benarasi drapes, and artisan attire — Cash on Delivery nationwide.',
    img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80',
    cta: 'Explore Festive Collection',
    href: '#/shop?tag=festive',
  },
  {
    id: 'b2',
    t: '⚡ Live Flash Sale: Up to 50% Off',
    bn: '⚡ ধামাকা ফ্ল্যাশ সেল: সর্বোচ্চ ৫০% পর্যন্ত ছাড়',
    s: 'Limited stock boutique masterworks on exclusive flash pricing for 24 hours only.',
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
    cta: 'Shop Flash Deals ⚡',
    href: '#/flash-sales',
  },
  {
    id: 'b3',
    t: 'Cash on Delivery Across Bangladesh',
    bn: 'সারা দেশে দ্রুত ক্যাশ অন ডেলিভারি',
    s: 'Instant WhatsApp order confirmation with zero prepayment needed.',
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
    cta: 'Browse All Pieces',
    href: '#/shop',
  },
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'VELORA',
  storeTaglineEn: 'Luxury delivered across Bangladesh',
  storeTaglineBn: 'সারা বাংলাদেশে বিলাসিতা পৌঁছে দিই',
  whatsappNumber: '8801712345678',
  phone: '+880 1712-345678',
  email: 'concierge@velora.bd',
  addressEn: 'House 12, Road 7, Dhanmondi, Dhaka 1205',
  addressBn: 'বাড়ি ১২, রোড ৭, ধানমন্ডি, ঢাকা ১২০৫',
  shippingFeeInsideDhaka: 80,
  shippingFeeOutsideDhaka: 150,
  freeShippingThreshold: 10000,
  currencySymbol: '৳',
  tickerNoticeEn: '⚡ FLASH SALE LIVE · EID EXCLUSIVES UP TO 50% OFF · CASH ON DELIVERY NATIONWIDE',
  tickerNoticeBn: '⚡ ফ্ল্যাশ সেল চলছে · ঈদ কালেকশনে ৫০% পর্যন্ত ছাড় · সারা দেশে ক্যাশ অন ডেলিভারি',
  showTicker: true,
  primaryAdminEmail: 'admin@velora.com',
  flashSaleActive: true,
  flashSaleTitleEn: '⚡ Festive Flash Sale Deals',
  flashSaleTitleBn: '⚡ উৎসবের ধামাকা ফ্ল্যাশ সেল',
  flashSaleEndsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'admin' | 'moderator' | 'customer';
  isPrimaryAdmin?: boolean;
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

export const INITIAL_USERS: StoredUser[] = [
  {
    id: 'usr_primary_admin',
    name: 'Main Administrator',
    email: 'ariyantushar44@gmail.com',
    phone: '01700000000',
    password: 'admin123',
    role: 'admin',
    isPrimaryAdmin: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'usr_admin_alias',
    name: 'Admin Backup',
    email: 'admin@velora.com',
    phone: '01711000000',
    password: 'admin123',
    role: 'admin',
    isPrimaryAdmin: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    lastLogin: new Date().toISOString(),
  },
];

const SZ_CLOTHES = ['S', 'M', 'L', 'XL'];
const SZ_PANJABI = ['S (38)', 'M (40)', 'L (42)', 'XL (44)', 'XXL (46)'];
const SZ_SHOES = ['39', '40', '41', '42', '43', '44'];

function makeP(
  id: string,
  slug: string,
  name: string,
  bn: string,
  price: number,
  was: number | undefined,
  cat: string,
  stock: number,
  imgs: string[],
  sizes: string[],
  colors: { n: string; h: string }[],
  rating: number,
  rc: number,
  tags: string[],
  d: string,
  db: string,
  featured = false,
  flashSale = false,
  flashSaleDiscountPercent?: number,
  flashSaleSold = 0,
  flashSaleStockQuota = 20
): Product {
  return {
    id,
    slug,
    name,
    bn,
    price,
    was,
    cat,
    stock,
    imgs,
    img: imgs,
    sizes,
    colors,
    rating,
    rc,
    tags,
    d,
    db,
    featured,
    flashSale,
    flashSaleDiscountPercent: flashSaleDiscountPercent || (was && was > price ? Math.round(((was - price) / was) * 100) : undefined),
    flashSaleSold,
    flashSaleStockQuota,
    flashSaleEndsAt: flashSale ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : undefined,
    createdAt: new Date().toISOString(),
  };
}

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Ivory Jamdani Panjabi (Ethnic) - Flash Sale
  makeP(
    'p1',
    'ivory-jamdani-panjabi',
    'Ivory Jamdani Handloom Panjabi',
    'আইভরি জামদানি হ্যান্ডলুম পাঞ্জাবি',
    1890,
    2690,
    'ethnic',
    28,
    [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1622519407650-3df9883f76a5?auto=format&fit=crop&w=900&q=80',
    ],
    SZ_PANJABI,
    [{ n: 'Ivory Cream', h: '#f4efe6' }, { n: 'Sand Beige', h: '#d9c3a0' }],
    4.9,
    126,
    ['festive', 'eid', 'cotton', 'premium', 'flash', 'panjabi'],
    'A breathable handloom Jamdani panjabi featuring a tailored mandarin collar and engraved mother-of-pearl buttons. Perfectly balanced for festive Eid mornings and evening gatherings.',
    'হাতে বোনা সূক্ষ্ম জামদানি মোটিফের পাঞ্জাবি। মেটাল ও মাদার-অফ-পার্ল বোতামসহ ঢাকার আর্দ্র সন্ধ্যা ও ঈদের উৎসবের জন্য চমৎকার আরামদায়ক।',
    true,
    true,
    30,
    21,
    30
  ),

  // 2. Crimson Benarasi Saree (Ethnic) - Flash Sale
  makeP(
    'p2',
    'crimson-benarasi-saree',
    'Crimson Heirloom Benarasi Katan Saree',
    'ক্রিমসন হেরিটেজ বেনারসি কাতান শাড়ি',
    4890,
    6890,
    'ethnic',
    14,
    [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
    ],
    ['Free size (5.5m + Blouse Piece)'],
    [{ n: 'Crimson Red', h: '#8e1c2c' }, { n: 'Royal Maroon', h: '#5c1220' }],
    5.0,
    84,
    ['festive', 'wedding', 'silk', 'handloom', 'flash', 'saree'],
    'Rich crimson pure katan silk woven with antique gold zari jaal motifs. Comes with unstitched matching blouse piece and handcrafted tassels on the pallu.',
    'খাঁটি কাতান সিল্কের উপর সোনালি জরির নিখুঁত কাজের বেনারসি শাড়ি। আনস্টিচড ব্লাউজ পিস এবং আকর্ষণীয় আঁচলসহ বিয়ের উৎসবের জন্য সেরা।',
    true,
    true,
    29,
    11,
    15
  ),

  // 3. Moonlit Ivory Organza Saree (Ethnic)
  makeP(
    'p3',
    'moonlit-ivory-saree',
    'Moonlit Pearl Organza Saree',
    'মুনলিট পার্ল অর্গানজা শাড়ি',
    3690,
    4990,
    'ethnic',
    11,
    [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80',
    ],
    ['Free size (5.5m + Blouse)'],
    [{ n: 'Moon Ivory', h: '#f7f1e6' }, { n: 'Silver Mist', h: '#e5e7eb' }],
    4.8,
    61,
    ['festive', 'silk', 'evening', 'saree'],
    'Pearl-white lightweight sheer drape with delicate shimmering bead borders and floral threadwork. Floats effortlessly for rooftop celebrations and intimate dinners.',
    'হালকা মুক্তা-সাদা জমিনে সূক্ষ্ম পুঁতি ও জারদৌসি বর্ডার। রুফটপ পার্টি ও ঘরোয়া অনুষ্ঠানের জন্য অত্যন্ত মার্জিত পোশাক।',
    true
  ),

  // 4. Noir Studio Linen Shirt (Modern)
  makeP(
    'p4',
    'noir-studio-shirt',
    'Noir Studio Tailored Linen Shirt',
    'নয়র স্টুডিও লিনেন শার্ট',
    1590,
    2190,
    'modern',
    32,
    [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80',
    ],
    SZ_CLOTHES,
    [{ n: 'Matte Noir', h: '#111111' }, { n: 'Deep Ink', h: '#1d2433' }],
    4.7,
    73,
    ['work', 'city', 'linen', 'shirt'],
    'A matte black cotton-silk linen blend shirt with relaxed drop-shoulders and concealed front placket. Pairs effortlessly with tailored trousers or loafers.',
    'ম্যাট ব্ল্যাক কটন-সিল্ক মিশ্রণের প্রিমিয়াম শার্ট। ড্রপ শোল্ডার ও হিডেন বোতামের নিখুঁত ফিনিশিং যা অফিস ও ক্যাজুয়াল আউটিংয়ের উপযোগী।',
    false
  ),

  // 5. Cloud Cotton Heavyweight Tee (Modern) - Flash Sale
  makeP(
    'p5',
    'cloud-cotton-tee',
    'Cloud Cotton 240GSM Heavyweight Tee',
    'ক্লাউড কটন হেভিওয়েট টি-শার্ট',
    650,
    990,
    'modern',
    54,
    [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80',
    ],
    SZ_CLOTHES,
    [{ n: 'Bone Foam', h: '#efe7da' }, { n: 'Charcoal Black', h: '#2b2b2b' }, { n: 'Sage Mist', h: '#9ca3af' }],
    4.8,
    190,
    ['basics', 'cotton', 'minimal', 'flash', 't-shirt'],
    'Crafted from 240 GSM organic combed cotton with pre-shrunk ribbed collar. Dense yet exceptionally soft and breathable for everyday urban wear.',
    '২৪০ জিএসএম প্রিমিয়াম কম্বড কটন টি-শার্ট। সহজে কুঁচকে যায় না এবং সারাদিন আরামদায়ক অভিজ্ঞতা দেয়।',
    false,
    true,
    34,
    42,
    60
  ),

  // 6. Heritage Full-Grain Leather Tote (Accessories) - Flash Sale
  makeP(
    'p6',
    'heritage-leather-tote',
    'Heritage Full-Grain Leather Tote',
    'হেরিটেজ ফুল-গ্রেইন লেদার টোট ব্যাগ',
    2890,
    3890,
    'accessories',
    18,
    [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
    ],
    ['One Size (16" x 13" with 14" Laptop Sleeve)'],
    [{ n: 'Cognac Brown', h: '#8a5a32' }, { n: 'Espresso Dark', h: '#3b2416' }],
    4.9,
    97,
    ['leather', 'work', 'travel', 'flash', 'bag'],
    'Handcrafted from 100% full-grain Bangladeshi leather with reinforced double stitching, padded 14-inch laptop compartment, and antique solid brass hardware.',
    'হাতে তৈরি খাঁটি লেদারের লাক্সারি টোট ব্যাগ। ১৪ ইঞ্চি ল্যাপটপ স্লট, জিপার পকেট এবং টেকসই অ্যান্টিক ব্রাস ফিটিংসহ।',
    true,
    true,
    26,
    14,
    20
  ),

  // 7. Oak Minimalist Leather Bifold Wallet (Accessories)
  makeP(
    'p7',
    'fold-wallet-oak',
    'Oak Minimalist Leather Bifold Wallet',
    'ওক মিনিমালিস্ট লেদার বাইফোল্ড ওয়ালেট',
    790,
    1190,
    'accessories',
    40,
    [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80',
    ],
    ['Slim Bifold (RFID Protected)'],
    [{ n: 'Oak Tan', h: '#c4a574' }, { n: 'Obsidian Black', h: '#161616' }],
    4.8,
    142,
    ['leather', 'gift', 'minimal', 'wallet'],
    'Vegetable-tanned oak leather wallet featuring six quick-access card slots, RFID blocking liner, and a compact cash compartment that stays remarkably slim in pockets.',
    'ভেজিটেবল ট্যানড ওক লেদারের আল্ট্রা-স্লিম ওয়ালেট। ৬টি কার্ড স্লট এবং আরএফআইডি সিকিউরিটি লাইনারযুক্ত।',
    false
  ),

  // 8. Gilded Polarized Aviator Sunglasses (Accessories)
  makeP(
    'p8',
    'gilded-aviator-shades',
    'Gilded Polarized Aviator Sunglasses',
    'গিল্ডেড পোলারাইজড এভিয়েটর সানগ্লাস',
    990,
    1490,
    'accessories',
    22,
    [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80',
    ],
    ['Universal Fit (With Leather Case)'],
    [{ n: 'Gold & Midnight', h: '#d4b46a' }, { n: 'Graphite Smoke', h: '#4a4a4a' }],
    4.7,
    58,
    ['summer', 'sunglasses', 'gift'],
    'Stainless steel gold-rim aviators featuring TAC polarized UV400 lenses with anti-reflective coating. Engineered for intense daylight and highway glare protection.',
    'ইউভি ৪০০ পোলারাইজড লেন্স ও প্রিমিয়াম গোল্ড মেটাল ফ্রেমের ক্লাসিক এভিয়েটর। সাথে লাক্সারি হার্ডকেস অন্তর্ভুক্ত।',
    false
  ),

  // 9. Aura ANC Hi-Fi Wireless Earbuds (Tech) - Flash Sale
  makeP(
    'p9',
    'aura-earbuds',
    'Aura ANC Hi-Fi Wireless Earbuds',
    'আউরা হাই-ফাই ওয়্যারলেস ইয়ারবাডস',
    1990,
    2790,
    'tech',
    36,
    [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=900&q=80',
    ],
    ['Standard (Wireless Charging Case)'],
    [{ n: 'Obsidian Black', h: '#0d0d0d' }, { n: 'Mist Pearl', h: '#c9cdd4' }],
    4.9,
    211,
    ['audio', 'gadget', 'tech', 'flash', 'earbuds'],
    'Active noise cancelling earbuds with custom 11mm titanium drivers, environmental quad-mic call isolation, 32-hour battery life, and IPX5 splash resistance.',
    'অ্যাক্টিভ নয়েজ ক্যান্সেলেশন (ANC), হাই-রেজ অডিও, ৩২ ঘণ্টা ব্যাটারি ব্যাকআপ ও ক্লিয়ার কলিং মাইক।',
    true,
    true,
    29,
    28,
    35
  ),

  // 10. Chronos Heritage Chronograph (Tech) - Flash Sale
  makeP(
    'p10',
    'midnight-chronograph',
    'Chronos Heritage Sapphire Chronograph',
    'ক্রোনস হেরিটেজ স্যাফায়ার ক্রোনোগ্রাফ ঘড়ি',
    4990,
    6990,
    'tech',
    9,
    [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80',
    ],
    ['42mm Sapphire Case (Italian Leather Strap)'],
    [{ n: 'Midnight Black', h: '#111111' }, { n: 'Cognac Leather', h: '#6b3f24' }],
    5.0,
    44,
    ['watch', 'gift', 'luxury', 'flash'],
    'Scratch-resistant sapphire crystal glass with precision Japanese quartz movement, 3-subdial stopwatch chronograph functionality, and 50M water resistance.',
    'স্যাফায়ার ক্রিস্টাল গ্লাস ও জাপানি কোয়ার্টজ মুভমেন্টের লাক্সারি ক্রোনোগ্রাফ। ৫ATM ওয়াটার রেজিস্ট্যান্ট।',
    true,
    true,
    29,
    7,
    10
  ),

  // 11. Royal Taif Velvet Oud EDP (Beauty) - Flash Sale
  makeP(
    'p11',
    'velvet-oud-elixir',
    'Royal Taif Velvet Oud EDP (50ml)',
    'রয়্যাল তায়েফ ভেলভেট উদ সুগন্ধি',
    1690,
    2290,
    'beauty',
    25,
    [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80',
    ],
    ['50ml Eau de Parfum', '100ml Eau de Parfum'],
    [{ n: 'Gold Flacon', h: '#c9a227' }],
    4.9,
    133,
    ['fragrance', 'oud', 'gift', 'beauty', 'flash', 'perfume'],
    'An intoxicating blend of aged wild Cambodian agarwood, royal Taif rose, cardamom, smoky amber, and royal cedarwood. Exceptionally long-lasting sillage projection.',
    'ক্যাম্বোডিয়ান আগরউড, তায়েফ গোলাপ ও অ্যাম্বারের রাজকীয় ব্লেন্ড। দীর্ঘস্থায়ী সুবাসসহ সোনালি কাচের বোতলে পরিবেশিত।',
    true,
    true,
    26,
    19,
    25
  ),

  // 12. Kashmiri Saffron Glow Serum (Beauty)
  makeP(
    'p12',
    'saffron-glow-elixir',
    'Kashmiri Saffron Botanical Glow Serum',
    'কাশ্মীরি জাফরান বোটানিক্যাল গ্লো সিরাম',
    1190,
    1590,
    'beauty',
    30,
    [
      'https://images.unsplash.com/photo-1608248597359-597541f5e27a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
    ],
    ['30ml Glass Dropper Bottle'],
    [{ n: 'Amber Gold', h: '#d97706' }],
    4.8,
    92,
    ['skincare', 'glow', 'saffron', 'beauty'],
    'Pure Kashmiri Mogra saffron infused with cold-pressed rosehip oil and hyaluronic acid. Restores natural skin radiance and even tone within two weeks.',
    'খাঁটি কাশ্মীরি জাফরান ও হায়ালুরোনিক অ্যাসিডের প্রাকৃতিক সিরাম। ত্বকের উজ্জ্বলতা বৃদ্ধি করে ও দাগ দূর করতে সাহায্য করে।',
    false
  ),

  // 13. Cloudstride Urban Sneakers (Footwear)
  makeP(
    'p13',
    'cloudstride-sneakers',
    'Cloudstride Cushion Urban Sneakers',
    'ক্লাউডস্ট্রাইড কুশন আরবান স্নিকার্স',
    2490,
    3290,
    'footwear',
    16,
    [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&q=80',
    ],
    SZ_SHOES,
    [{ n: 'Pearl White', h: '#d9d9de' }, { n: 'Graphite Grey', h: '#55555c' }],
    4.7,
    89,
    ['shoes', 'city', 'footwear', 'sneakers'],
    'Engineered with memory foam orthotic insoles, breathable micro-knit uppers, and high-rebound EVA traction soles for all-day comfort across Dhaka streets.',
    'মেমোরি ফোম ইনসোল ও প্রিমিয়াম ব্রিদেবল আপারের আল্ট্রা-লাইট স্নিকার্স। সারাদিন হাঁটার জন্য সর্বোচ্চ আরাম।',
    true
  ),

  // 14. Obsidian Handcrafted Leather Loafers (Footwear) - Flash Sale
  makeP(
    'p14',
    'obsidian-loafers',
    'Obsidian Handcrafted Leather Penny Loafers',
    'অবসিডিয়ান হ্যান্ডক্রাফটেড লেদার পেনি লোফার',
    2690,
    3490,
    'footwear',
    12,
    [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&q=80',
    ],
    SZ_SHOES,
    [{ n: 'Obsidian Black', h: '#0a0a0a' }, { n: 'Deep Tan', h: '#854d0e' }],
    4.9,
    36,
    ['shoes', 'leather', 'formal', 'footwear', 'flash', 'loafers'],
    'Hand-stitched burnished full-grain leather penny loafers with anti-slip Goodyear rubber outsoles and cushioned leather insoles. Transitions seamlessly from formal meetings to wedding galas.',
    'হ্যান্ড-বার্নিশড খাঁটি চামড়ার স্লিপ-অন লোফার। যেকোনো ফর্মাল ও ওয়েডিং ড্রেসের সাথে দারুণ মানানসই।',
    false,
    true,
    23,
    9,
    12
  ),

  // 15. Pearl Cascade Layered Necklace (Accessories)
  makeP(
    'p15',
    'pearl-cascade-necklace',
    'Pearl Cascade 18K Gold Choker Necklace',
    'পার্ল ক্যাসকেড ১৮কে গোল্ড চোকার নেকলেস',
    2490,
    3490,
    'accessories',
    7,
    [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
    ],
    ['Adjustable (16"-18" with Extender)'],
    [{ n: 'Pearl & 18K Gold Vermeil', h: '#f5f0e8' }],
    5.0,
    29,
    ['jewelry', 'wedding', 'pearls'],
    'Lustrous cultured freshwater pearls paired with 18k gold-plated hypoallergenic brass links and sparkling cubic zirconia center teardrop pendant.',
    'কালচার্ড ফ্রেশওয়াটার পার্ল ও ১৮ ক্যারেট গোল্ড প্লেটেড চেইনের গর্জিয়াস নেকলেস। বিয়ের অনুষ্ঠানে এক অনন্য আভিজাত্য।',
    false
  ),

  // 16. Emerald Signet Ring in 18k Gold Plate (Accessories)
  makeP(
    'p16',
    'emerald-signet-ring',
    'Emerald Signet Ring in 18k Gold Plate',
    'পান্না এমারেল্ড সিগনেট গোল্ড রিং',
    1190,
    1690,
    'accessories',
    15,
    [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80',
    ],
    ['Size 7', 'Size 8', 'Size 9', 'Size 10', 'Size 11'],
    [{ n: 'Emerald & Gold', h: '#d4af37' }],
    4.9,
    51,
    ['jewelry', 'ring', 'gold', 'accessories'],
    'Solid stainless steel core electroplated in 18k yellow gold with an octagonal deep-green lab emerald center stone.',
    '১৮ ক্যারেট গোল্ড প্লেটেড এবং সবুজ পান্না পাথরের নিখুঁত সিগনেট আংটি।',
    false
  ),

  // 17. Midnight Navy Jamdani Panjabi (Ethnic) - Flash Sale
  makeP(
    'p17',
    'midnight-navy-jamdani-panjabi',
    'Midnight Navy Jamdani Silk-Cotton Panjabi',
    'মিডনাইট নেভি জামদানি সিল্ক-কটন পাঞ্জাবি',
    2190,
    2990,
    'ethnic',
    22,
    [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
    ],
    SZ_PANJABI,
    [{ n: 'Midnight Navy', h: '#0f172a' }, { n: 'Royal Blue', h: '#1e3a8a' }],
    4.9,
    94,
    ['ethnic', 'panjabi', 'eid', 'flash'],
    'Deep navy blue handloom fabric with tone-on-tone silver threadwork and fine loop buttons.',
    'গাঢ় নেভি ব্লু জমিনে রুপালি সুতার চমৎকার জামদানি মোটিফ। ঈদের দিনের জন্য আভিজাত্যময় পোশাক।',
    true,
    true,
    27,
    16,
    25
  ),

  // 18. Emerald Royal Benarasi Saree (Ethnic)
  makeP(
    'p18',
    'emerald-royal-benarasi-saree',
    'Emerald Green Royal Benarasi Silk Saree',
    'এমেরাল্ড গ্রিন রয়্যাল বেনারসি সিল্ক শাড়ি',
    5290,
    7290,
    'ethnic',
    10,
    [
      'https://images.unsplash.com/photo-1610030469668-9655ec1578e7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80',
    ],
    ['Free size (5.5m + Blouse Piece)'],
    [{ n: 'Emerald Green', h: '#064e3b' }],
    5.0,
    67,
    ['saree', 'wedding', 'benarasi', 'ethnic'],
    'Pure handwoven green katan silk featuring gold zari border and rich designer pallu.',
    'গাঢ় সবুজ কাতান সিল্কে খাঁটি সোনালি জরির জমকালো বেনারসি শাড়ি।',
    true
  ),

  // 19. Titanium Smartwatch Ultra (Tech) - Flash Sale
  makeP(
    'p19',
    'titanium-smartwatch-ultra',
    'Titanium Smartwatch Ultra with AMOLED Display',
    'টাইটানিয়াম স্মার্টওয়াচ আল্ট্রা অ্যামোলেড',
    2890,
    3990,
    'tech',
    20,
    [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    ],
    ['49mm Aerospace Titanium Case'],
    [{ n: 'Titanium Grey', h: '#71717a' }, { n: 'Midnight Sport', h: '#09090b' }],
    4.8,
    115,
    ['smartwatch', 'tech', 'gadget', 'flash'],
    'Aerospace-grade titanium alloy casing, 1.96-inch ultra-bright AMOLED display, Bluetooth calling, heart rate & SpO2 sensors, and 7-day battery endurance.',
    'টাইটানিয়াম বডি ও ক্রিস্টাল ক্লিয়ার অ্যামোলেড ডিসপ্লে। ব্লুটুথ কলিং, হেলথ ট্র্যাকিং এবং ৭ দিনের ব্যাটারি লাইফ।',
    true,
    true,
    28,
    16,
    20
  ),

  // 20. Taif Rose Hydrosol Facial Mist (Beauty)
  makeP(
    'p20',
    'taif-rose-mist',
    'Taif Rose Botanical Hydrosol Mist (100ml)',
    'তায়েফ রোজ বোটানিক্যাল ফেসিয়াল মিস্ট',
    690,
    950,
    'beauty',
    40,
    [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80',
    ],
    ['100ml Ultra-Fine Mist Spray'],
    [{ n: 'Rose Quartz', h: '#fda4af' }],
    4.7,
    104,
    ['beauty', 'skincare', 'rose', 'toner'],
    'Steam-distilled 100% pure organic Taif rosewater. Instantly balances pH, calms redness, and refreshes the complexion throughout the day.',
    '১০০% খাঁটি তায়েফ গোলাপের নির্যাস থেকে তৈরি ফেসিয়াল মিস্ট। ত্বক সতেজ ও আর্দ্র রাখে।',
    false
  ),

  // 21. Olive Oxford Utility Shirt (Modern)
  makeP(
    'p21',
    'olive-oxford-utility-shirt',
    'Olive Oxford Classic Utility Shirt',
    'অলিভ অক্সফোর্ড ক্লাসিক শার্ট',
    1690,
    2290,
    'modern',
    25,
    [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
    ],
    SZ_CLOTHES,
    [{ n: 'Olive Green', h: '#3f6212' }, { n: 'Desert Khaki', h: '#a16207' }],
    4.8,
    78,
    ['modern', 'shirt', 'casual'],
    'Durable 100% washed Oxford cotton shirt with twin chest pockets and horn buttons.',
    '১০০% খাঁটি ওয়াশড কটন অক্সফোর্ড শার্ট। আরামদায়ক ও স্টাইলিশ।',
    false
  ),

  // 22. Cloudweight Heavy Fleece Hoodie (Modern) - Flash Sale
  makeP(
    'p22',
    'cloudweight-heavy-fleece-hoodie',
    'Cloudweight Heavy Fleece Minimal Hoodie',
    'ক্লাউডওয়েট হেভি ফ্লিস মিনিমাল হুডি',
    1790,
    2490,
    'modern',
    30,
    [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80',
    ],
    SZ_CLOTHES,
    [{ n: 'Oatmeal Heather', h: '#e5e5e5' }, { n: 'Charcoal Black', h: '#18181b' }],
    4.9,
    140,
    ['modern', 'hoodie', 'winter', 'flash'],
    '380 GSM ultra-soft brushed interior organic cotton fleece hoodie with double-lined hood.',
    '৩৮০ জিএসএম প্রিমিয়াম হেভিওয়েট অর্গানিক কটন ফ্লিস হুডি।',
    true,
    true,
    28,
    22,
    30
  ),

  // 23. Ink Stealth Daily Runners (Footwear)
  makeP(
    'p23',
    'ink-stealth-daily-runners',
    'Ink Stealth Lightweight Daily Runners',
    'ইঙ্ক স্টিলথ লাইটওয়েট রানিং শু',
    2290,
    2990,
    'footwear',
    20,
    [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
    ],
    SZ_SHOES,
    [{ n: 'Stealth Black & Red', h: '#171717' }],
    4.8,
    88,
    ['footwear', 'sneakers', 'sports'],
    'Responsive nitrogen-infused foam midsole with breathable seamless engineered mesh upper.',
    'হালকা ও ব্রিদেবল রানিং স্নিকার্স। প্রতিদিনের ব্যবহারের জন্য অত্যন্ত আরামদায়ক।',
    false
  ),

  // 24. Tan Saddle Leather Belt (Accessories)
  makeP(
    'p24',
    'tan-saddle-leather-belt',
    'Tan Saddle Full-Grain Leather Belt',
    'ট্যান স্যাডল খাঁটি চামড়ার বেল্ট',
    890,
    1290,
    'accessories',
    35,
    [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=900&q=80',
    ],
    ['32-34 Inch', '36-38 Inch', '40-42 Inch'],
    [{ n: 'Saddle Tan', h: '#92400e' }, { n: 'Classic Black', h: '#09090b' }],
    4.9,
    95,
    ['accessories', 'leather', 'belt'],
    'Single-piece vegetable tanned full grain bridle leather with solid brushed zinc alloy buckle.',
    '১০০% খাঁটি চামড়ার তৈরি টেকসই বেল্ট। ব্রাশড মেটাল বাকলসহ।',
    false
  ),

  // 25. Weekender 45L Leather Travel Duffel (Accessories) - Flash Sale
  makeP(
    'p25',
    'weekender-leather-duffel',
    'Weekender 45L Full-Grain Leather Travel Duffel',
    'উইকএন্ডার লেদার ট্রাভেল ডাফেল ব্যাগ',
    3990,
    5490,
    'accessories',
    10,
    [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=900&q=80',
    ],
    ['45 Liter Cabin Size (52cm x 28cm x 30cm)'],
    [{ n: 'Vintage Cognac', h: '#78350f' }],
    4.9,
    63,
    ['travel', 'leather', 'accessories', 'flash', 'bag'],
    'Heavy-duty full grain cowhide travel duffel with separate shoe compartment and reinforced strap.',
    'ভ্রমণের জন্য নিখুঁত খাঁটি চামড়ার ট্রাভেল ব্যাগ। জুতার আলাদা চেম্বারসহ।',
    true,
    true,
    27,
    6,
    10
  ),

  // 26. Polarized Acetate Wayfarers (Accessories)
  makeP(
    'p26',
    'polarized-acetate-wayfarers',
    'Polarized Hand-Polished Acetate Wayfarers',
    'পোলারাইজড অ্যাসিটেট ওয়েফেয়ারার সানগ্লাস',
    1190,
    1690,
    'accessories',
    24,
    [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
    ],
    ['Standard Fit'],
    [{ n: 'Havana Tortoise', h: '#451a03' }, { n: 'Gloss Black', h: '#09090b' }],
    4.8,
    71,
    ['sunglasses', 'accessories', 'summer'],
    'Premium cellulose acetate frame with 7-barrel stainless steel hinges and UV400 polarized optics.',
    'উন্নত অ্যাসিটেট ফ্রেম ও ইউভি ৪০০ পোলারাইজড লেন্সের প্রিমিয়াম সানগ্লাস।',
    false
  ),

  // 27. Baroque Pearl Drop Earrings (Accessories)
  makeP(
    'p27',
    'baroque-pearl-drop-earrings',
    'Baroque Pearl 18K Gold Drop Earrings',
    'ব্যারোক পার্ল ১৮কে গোল্ড ড্রপ ইয়ারিং',
    1390,
    1890,
    'accessories',
    18,
    [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
    ],
    ['Standard Drop (3.5cm)'],
    [{ n: 'Natural Pearl & Gold', h: '#fef08a' }],
    4.9,
    49,
    ['jewelry', 'pearls', 'accessories', 'wedding'],
    'Unique irregular natural freshwater baroque pearls suspended from 18k gold-plated huggie hoops.',
    'প্রাকৃতিক মুক্তা ও ১৮ ক্যারেট গোল্ড প্লেটেড ড্রপ ইয়ারিং। উৎসব ও পার্টির জন্য অপূর্ব সুন্দর।',
    false
  ),

  // 28. Taif Rose & Oud Bloom Extrait (Beauty) - Flash Sale
  makeP(
    'p28',
    'taif-rose-oud-bloom',
    'Taif Rose & Royal Oud Bloom (50ml Extrait)',
    'তায়েফ রোজ ও রয়্যাল উদ ব্লুম এক্সট্রেইট',
    1990,
    2790,
    'beauty',
    15,
    [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80',
    ],
    ['50ml Extrait de Parfum (35% Oil Concentration)'],
    [{ n: 'Rose Gold Flacon', h: '#fb7185' }],
    5.0,
    62,
    ['beauty', 'perfume', 'oud', 'rose', 'flash'],
    'Ultra-concentrated perfume with Taif rose petals, aged Indian agarwood, ambergris and white musk.',
    '৩৫% তেল ঘনত্বের দীর্ঘস্থায়ী রাজকীয় পারফিউম। কাপড়ে ও ত্বকে সারা দিন স্থায়ী সুবাস।',
    true,
    true,
    29,
    11,
    15
  ),

  // 29. Velora AMOLED Smart Chrono (Tech)
  makeP(
    'p29',
    'velora-smart-chrono',
    'Velora AMOLED Stainless Steel Smart Chrono',
    'ভেলোরা অ্যামোলেড স্মার্ট ক্রোনো',
    3490,
    4690,
    'tech',
    12,
    [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    ],
    ['46mm Stainless Steel Case'],
    [{ n: 'Silver Steel', h: '#e2e8f0' }, { n: 'Space Black', h: '#09090b' }],
    4.8,
    58,
    ['tech', 'smartwatch', 'gadgets'],
    '1.43-inch Always-On HD AMOLED display with sapphire coated glass and continuous biometric monitoring.',
    'এইচডি অ্যামোলেড অলওয়েজ-অন ডিসপ্লে এবং স্টেইনলেস স্টিল স্ট্র্যাপের লাক্সারি স্মার্টওয়াচ।',
    true
  ),

  // 30. Velora Soundscape Pro Headphones (Tech) - Flash Sale
  makeP(
    'p30',
    'velora-soundscape-pro-headphones',
    'Velora Soundscape Pro Hybrid ANC Headphones',
    'ভেলোরা সাউন্ডস্কেপ প্রো হাইব্রিড হেডফোন',
    3290,
    4490,
    'tech',
    14,
    [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
    ],
    ['Over-Ear (With Hard Travel Case)'],
    [{ n: 'Midnight Black', h: '#09090b' }, { n: 'Silver Birch', h: '#e2e8f0' }],
    4.9,
    87,
    ['audio', 'headphones', 'tech', 'flash'],
    '40mm custom graphene drivers with 42dB Hybrid Active Noise Cancellation and 60-hour playtime.',
    'হাই-রেজলেশন অডিও, হাইব্রিড নয়েজ ক্যান্সেলেশন এবং ৬০ ঘণ্টার অবিশ্বাস্য ব্যাটারি লাইফ।',
    true,
    true,
    27,
    8,
    14
  ),

  // 31. Mist Chiffon Hand-Rolled Scarf (Ethnic)
  makeP(
    'p31',
    'mist-chiffon-scarf',
    'Mist Chiffon Hand-Rolled Luxury Scarf',
    'মিস্ট শিফন হ্যান্ড-রোল্ড লাক্সারি স্কার্ফ',
    890,
    1290,
    'ethnic',
    28,
    [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=900&q=80',
    ],
    ['200cm x 75cm Large Wrap'],
    [{ n: 'Powder Sage', h: '#84cc16' }, { n: 'Blush Cream', h: '#fed7aa' }],
    4.8,
    44,
    ['ethnic', 'scarf', 'hijab'],
    'Ultra-sheer pure chiffon silk scarf with hand-rolled hems and subtle metallic thread borders.',
    'হ্যান্ড-রোল্ড বর্ডারের নরম পিওর শিফন সিল্ক স্কার্ফ।',
    false
  ),

  // 32. Imperial Onyx & Gold Beaded Stack (Accessories)
  makeP(
    'p32',
    'imperial-onyx-gold-beaded-stack',
    'Imperial Matte Onyx & 18K Gold Beaded Bracelet',
    'ইম্পেরিয়াল অনিক্স ও গোল্ড ব্রেসলেট স্ট্যাক',
    790,
    1190,
    'accessories',
    25,
    [
      'https://images.unsplash.com/photo-1611591475152-4c09a13a0731?auto=format&fit=crop&w=900&q=80',
    ],
    ['Elastic Stretch (Fits 6.5"-8" Wrists)'],
    [{ n: 'Matte Onyx & Gold', h: '#18181b' }],
    4.9,
    56,
    ['jewelry', 'bracelet', 'accessories'],
    '8mm natural matte black onyx stone beads paired with an 18k gold-plated centerpiece bead.',
    'প্রাকৃতিক ম্যাট ব্ল্যাক অনিক্স স্টোন এবং ১৮ ক্যারেট গোল্ড প্লেটেড ব্রেসলেট।',
    false
  ),

  // 33. Royal Raw Silk Kurta Set (Ethnic)
  makeP(
    'p33',
    'royal-raw-silk-kurta-set',
    'Royal Raw Silk Embroidered Kurta Set',
    'রয়্যাল র সিল্ক এমব্রয়ডারি কুর্তা সেট',
    3490,
    4490,
    'ethnic',
    16,
    [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1622519407650-3df9883f76a5?auto=format&fit=crop&w=900&q=80',
    ],
    SZ_PANJABI,
    [{ n: 'Champagne Gold', h: '#fef08a' }, { n: 'Deep Maroon', h: '#7f1d1d' }],
    4.9,
    67,
    ['ethnic', 'panjabi', 'wedding', 'eid'],
    'Luxurious raw silk kurta featuring subtle zari neck embroidery paired with cotton-silk churidar pyjama.',
    'খাঁটি র সিল্কের কুর্তা এবং পাজামা সেট। প্রিমিয়াম জরি কাজের নিখুঁত ফিনিশিং।',
    true
  ),

  // 34. Hand-Painted Tussar Silk Dupatta (Ethnic)
  makeP(
    'p34',
    'hand-painted-tussar-silk-dupatta',
    'Hand-Painted Botanical Tussar Silk Dupatta',
    'হাতে আঁকা তসর সিল্ক ওড়না',
    2190,
    2990,
    'ethnic',
    12,
    [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1610030469668-9655ec1578e7?auto=format&fit=crop&w=900&q=80',
    ],
    ['2.5m Length x 36" Width'],
    [{ n: 'Ivory & Flora', h: '#fef9c3' }],
    4.8,
    38,
    ['ethnic', 'dupatta', 'silk', 'handloom'],
    'Pure authentic tussar silk dupatta hand-painted with artisanal floral motifs and gold zari borders.',
    'খাঁটি তসর সিল্কের উপর শিল্পীর হাতে আঁকা ফ্লোরাল মোটিফ ওড়না।',
    false
  ),

  // 35. Metropolitan Leather Messenger Bag (Accessories)
  makeP(
    'p35',
    'metropolitan-leather-messenger',
    'Metropolitan Full-Grain Leather Messenger Bag',
    'মেট্রোপলিটন লেদার মেসেঞ্জার ব্যাগ',
    2990,
    3990,
    'accessories',
    15,
    [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
    ],
    ['Fits 14" Laptop & Tablet'],
    [{ n: 'Tobacco Tan', h: '#b45309' }, { n: 'Pitch Black', h: '#09090b' }],
    4.9,
    53,
    ['leather', 'bag', 'work', 'accessories'],
    'Vegetable-tanned cowhide messenger bag with magnetic flap closures and antique bronze buckles.',
    '১৪ ইঞ্চি ল্যাপটপ স্লটসহ খাঁটি চামড়ার প্রিমিয়াম মেসেঞ্জার ব্যাগ।',
    false
  ),

  // 36. Imperial Amber Musk Attar Oil (Beauty) - Flash Sale
  makeP(
    'p36',
    'imperial-amber-musk-attar',
    'Imperial Amber Musk Concentrated Oil (12ml)',
    'ইম্পেরিয়াল অ্যাম্বার মাস্ক খাঁটি আতর',
    990,
    1490,
    'beauty',
    30,
    [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80',
    ],
    ['12ml Pure Concentrated Oil in Crystal Dipstick Bottle'],
    [{ n: 'Crystal & Gold', h: '#fde047' }],
    4.9,
    110,
    ['attar', 'perfume', 'beauty', 'musk', 'flash'],
    '100% alcohol-free non-diluted pure amber musk perfume oil in crystal bottle with glass applicator rod.',
    'অ্যালকোহলমুক্ত খাঁটি অ্যাম্বার মাস্ক আতর। স্ফটিক কাচের রাজকীয় বোতলে পরিবেশিত।',
    true,
    true,
    34,
    21,
    30
  ),

  // 37. Kensington Suede Chelsea Boots (Footwear)
  makeP(
    'p37',
    'kensington-suede-chelsea-boots',
    'Kensington Handcrafted Suede Chelsea Boots',
    'কেনসিংটন সুয়েড চেলসি বুট',
    3290,
    4290,
    'footwear',
    14,
    [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=900&q=80',
    ],
    SZ_SHOES,
    [{ n: 'Camel Suede', h: '#d97706' }, { n: 'Shadow Charcoal', h: '#27272a' }],
    4.9,
    60,
    ['boots', 'footwear', 'leather'],
    'Premium calfskin suede upper with water-repellent coating and Goodyear stitched leather soles.',
    'ওয়াটার-রেপেলেন্ট প্রিমিয়াম সুয়েড লেদারের চেলসি বুট। জিন্স ও ট্রাউজারের সাথে অসাধারণ কম্বিনেশন।',
    false
  ),

  // 38. Minimalist Brass-Clip Card Holder (Accessories)
  makeP(
    'p38',
    'minimalist-brass-clip-card-holder',
    'Minimalist Brass-Clip Leather Card Holder',
    'মিনিমালিস্ট লেদার কার্ড ও মানি ক্লিপ',
    550,
    790,
    'accessories',
    45,
    [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=900&q=80',
    ],
    ['Holds 8 Cards + Cash'],
    [{ n: 'Tan & Brass', h: '#b45309' }, { n: 'Matte Black', h: '#18181b' }],
    4.8,
    132,
    ['accessories', 'leather', 'wallet', 'gift'],
    'Slim front pocket card case with spring-loaded brass money clip and 4 dedicated card slots.',
    'পকেটে সহজে বহনযোগ্য স্লিম লেদার কার্ড কেস ও মানি ক্লিপ।',
    false
  ),

  // 39. Heritage Raw Silk Nehru Vest (Ethnic)
  makeP(
    'p39',
    'heritage-raw-silk-nehru-vest',
    'Heritage Raw Silk Tailored Nehru Vest (Mujib Coat / Koti)',
    'হেরিটেজ র সিল্ক কোটি / নেহেরু ভেস্ট',
    1990,
    2890,
    'ethnic',
    18,
    [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
    ],
    SZ_PANJABI,
    [{ n: 'Matte Black', h: '#18181b' }, { n: 'Royal Maroon', h: '#831843' }],
    4.9,
    74,
    ['ethnic', 'koti', 'panjabi', 'eid'],
    'Tailored raw silk waistcoat with mandarin collar, five metal buttons and satin silk lining.',
    'পাঞ্জাবির ওপর পরার মতো ঐতিহ্যবাহী র সিল্কের কোটি। পাঁচ মেটাল বোতামসহ।',
    false
  ),

  // 40. Full-Grain Leather Passport Folio (Accessories)
  makeP(
    'p40',
    'leather-passport-folio',
    'Full-Grain Leather Travel Passport Folio',
    'ফুল-গ্রেইন লেদার পাসপোর্ট ফোলিও',
    990,
    1390,
    'accessories',
    26,
    [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
    ],
    ['Fits 2 Passports, Boarding Pass & 6 Cards'],
    [{ n: 'Cognac Leather', h: '#9a3412' }],
    4.8,
    46,
    ['accessories', 'travel', 'leather'],
    'Travel wallet crafted from genuine full-grain leather with dedicated boarding pass slot and SIM card pocket.',
    'ভ্রমণের জন্য প্রয়োজনীয় পাসপোর্ট ও টিকিট রাখার প্রিমিয়াম লেদার ফোলিও।',
    false
  ),

  // 41. Smoked Vanilla & Bourbon Extrait Perfume (Beauty)
  makeP(
    'p41',
    'smoked-vanilla-bourbon-extrait',
    'Smoked Vanilla & Bourbon Extrait (50ml)',
    'স্মোকড ভ্যানিলা ও বোরবন এক্সট্রেইট পারফিউম',
    1790,
    2390,
    'beauty',
    19,
    [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80',
    ],
    ['50ml Eau de Parfum in Heavy Glass Bottle'],
    [{ n: 'Smoked Amber', h: '#78350f' }],
    4.9,
    81,
    ['beauty', 'perfume', 'fragrance'],
    'Warm Madagascar vanilla bean infused with aged oak bourbon, dark amber and roasted tonka.',
    'মাদাগাস্কার ভ্যানিলা এবং ওক কাঠের মনমাতানো দীর্ঘস্থায়ী মিষ্টি ও ধোঁয়াটে সুবাস।',
    false
  ),

  // 42. Artisan Calfskin Wingtip Brogues (Footwear)
  makeP(
    'p42',
    'artisan-calfskin-wingtip-brogues',
    'Artisan Hand-Burnished Calfskin Wingtip Brogues',
    'আর্টিসান কাফস্কিন উইংটিপ ফর্মাল শু',
    3490,
    4690,
    'footwear',
    12,
    [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&q=80',
    ],
    SZ_SHOES,
    [{ n: 'Hand-Burnished Tan', h: '#92400e' }, { n: 'Oxford Black', h: '#09090b' }],
    4.9,
    50,
    ['footwear', 'formal', 'shoes', 'leather'],
    'Goodyear welted formal brogues hand-crafted from full grain calfskin leather with perforated wingtip detailing.',
    'ফর্মাল স্যুট ও প্যান্টের সাথে পরার জন্য খাঁটি চামড়ার উইংটিপ ব্রগ জুতো।',
    false
  ),

  // 43. French Linen Cuban Collar Shirt (Modern)
  makeP(
    'p43',
    'french-linen-cuban-collar-shirt',
    'French 100% Linen Cuban Collar Shirt',
    'ফ্রেঞ্চ ১০০% লিনেন কিউবান কলার শার্ট',
    1690,
    2390,
    'modern',
    28,
    [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
    ],
    SZ_CLOTHES,
    [{ n: 'Pure Snow', h: '#ffffff' }, { n: 'Terracotta Rust', h: '#c2410c' }],
    4.8,
    66,
    ['modern', 'linen', 'summer', 'shirt'],
    'Pre-washed pure French flax linen relaxed shirt featuring open camp collar and wooden buttons.',
    '১০০% পিওর ফ্রেঞ্চ লিনেন শার্ট। গরমের দিনে অত্যন্ত আরামদায়ক ও স্টাইলিশ লুক।',
    false
  ),

  // 44. Titanium MagSafe Wireless Power Bank (Tech) - Flash Sale
  makeP(
    'p44',
    'titanium-magsafe-wireless-powerbank',
    'Titanium MagSafe 10,000mAh Fast Power Bank',
    'টাইটানিয়াম ম্যাগসেফ ১০,০০০ এমএএইচ পাওয়ার ব্যাংক',
    1690,
    2290,
    'tech',
    25,
    [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80',
    ],
    ['10,000mAh Ultra-Slim (20W PD + 15W Wireless)'],
    [{ n: 'Titanium Slate', h: '#64748b' }],
    4.9,
    145,
    ['tech', 'gadgets', 'powerbank', 'flash'],
    'Ultra-strong magnetic snap-on wireless charger with 20W USB-C bidirectional fast charging.',
    'ম্যাগসেফ ওয়্যারলেস এবং ২০ ওয়াট ফাস্ট চার্জিং সাপোর্টেড আল্ট্রা-স্লিম পাওয়ার ব্যাংক।',
    true,
    true,
    26,
    18,
    25
  ),

  // 45. Royal Pashmina Blend Zari Shawl (Ethnic)
  makeP(
    'p45',
    'royal-pashmina-zari-shawl',
    'Royal Pashmina Wool & Silk Zari Shawl',
    'রয়্যাল পশমিনা উল ও সিল্ক জরি শাল',
    3790,
    4990,
    'ethnic',
    10,
    [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
    ],
    ['Full Size (2.2m x 1m)'],
    [{ n: 'Deep Royal Maroon', h: '#581c87' }, { n: 'Ivory Cream', h: '#fefce8' }],
    5.0,
    40,
    ['ethnic', 'shawl', 'winter', 'luxury'],
    'Pure blend of fine Cashmere pashmina and mulberry silk with antique gold needlework on borders.',
    'উন্নত পশমিনা উল ও সিল্ক ব্লেন্ডের রাজকীয় শাল। জরি কাজের সূক্ষ্ম বর্ডারযুক্ত।',
    true
  ),

  // 46. Tortoise Shell Vintage Round Eyewear (Accessories)
  makeP(
    'p46',
    'tortoise-shell-vintage-round-eyewear',
    'Tortoise Shell Vintage Round Polarized Sunglasses',
    'ভিন্টেজ রাউন্ড পোলারাইজড সানগ্লাস',
    950,
    1390,
    'accessories',
    20,
    [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80',
    ],
    ['Medium Round (49mm Lens)'],
    [{ n: 'Amber Tortoise', h: '#78350f' }],
    4.7,
    52,
    ['sunglasses', 'accessories', 'vintage'],
    'Classic 1950s inspired round keyhole bridge silhouette with brown tint polarized lenses.',
    'ভিন্টেজ রাউন্ড ডিজাইনের পোলারাইজড সানগ্লাস। রোদ থেকে চোখের পূর্ণ সুরক্ষা।',
    false
  ),

  // 47. Tailored Pleated Wool-Touch Chinos (Modern)
  makeP(
    'p47',
    'tailored-pleated-wool-touch-chinos',
    'Tailored Double-Pleated Smart Chinos',
    'টেইলর্ড ডাবল-প্লিটেড স্মার্ট চিনোজ প্যান্ট',
    1490,
    1990,
    'modern',
    22,
    [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80',
    ],
    ['30 Waist', '32 Waist', '34 Waist', '36 Waist', '38 Waist'],
    [{ n: 'Charcoal Grey', h: '#334155' }, { n: 'Warm Taupe', h: '#78716c' }],
    4.8,
    64,
    ['modern', 'pants', 'formal', 'chinos'],
    'High-rise double pleated smart trousers with side adjusters and tailored tapered leg.',
    'সাইড অ্যাডজাস্টারসহ প্রিমিয়াম প্লিটেড ফর্মাল চিনোজ প্যান্ট।',
    false
  ),

  // 48. Solid Brushed Brass Minimalist Cuff (Accessories)
  makeP(
    'p48',
    'solid-brushed-brass-minimalist-cuff',
    'Solid Brushed Brass Minimalist Cuff Bracelet',
    'সলিড ব্রাশড ব্রাস মিনিমালিস্ট কাফ ব্রেসলেট',
    750,
    990,
    'accessories',
    25,
    [
      'https://images.unsplash.com/photo-1611591475152-4c09a13a0731?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
    ],
    ['Adjustable Open Cuff (One Size Fits All)'],
    [{ n: 'Brushed Raw Brass', h: '#ca8a04' }],
    4.8,
    47,
    ['jewelry', 'bracelet', 'accessories', 'brass'],
    'Hand-formed solid 4mm thick raw brass cuff with subtle matte brushed patina.',
    'খাঁটি ব্রাস মেটালের তৈরি মিনিমালিস্ট কাফ ব্রেসলেট। যেকোনো পোশাকের সাথে মানানসই।',
    false
  ),
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'VEL-8921',
    customerName: 'Tanvir Hossain',
    customerPhone: '01711223344',
    customerEmail: 'tanvir.h@gmail.com',
    deliveryZone: 'dhaka',
    address: 'House 42, Road 11, Banani, Dhaka',
    city: 'Dhaka',
    note: 'Please call before delivery in the afternoon.',
    items: [
      {
        slug: 'ivory-jamdani-panjabi',
        name: 'Ivory Jamdani Handloom Panjabi',
        variant: 'L (42) / Ivory Cream',
        price: 1890,
        quantity: 1,
        img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
      },
      {
        slug: 'fold-wallet-oak',
        name: 'Oak Minimalist Leather Bifold Wallet',
        variant: 'Slim Bifold / Oak Tan',
        price: 790,
        quantity: 1,
        img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80',
      },
    ],
    subtotal: 2680,
    shippingFee: 80,
    total: 2760,
    paymentMethod: 'cod',
    status: 'delivered',
    createdAt: '2026-08-30T10:15:00.000Z',
    trackingNumber: 'REDX-DH-89210',
  },
  {
    id: 'VEL-8922',
    customerName: 'Samira Rahman',
    customerPhone: '01899887766',
    customerEmail: 'samira.rahman@yahoo.com',
    deliveryZone: 'dhaka',
    address: 'Apartment 5B, Road 4, Dhanmondi, Dhaka',
    city: 'Dhaka',
    note: 'Gift wrap requested with festive ribbon',
    items: [
      {
        slug: 'crimson-benarasi-saree',
        name: 'Crimson Heirloom Benarasi Katan Saree',
        variant: 'Free size / Crimson Red',
        price: 4890,
        quantity: 1,
        img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80',
      },
    ],
    subtotal: 4890,
    shippingFee: 0,
    total: 4890,
    paymentMethod: 'cod',
    status: 'shipped',
    createdAt: '2026-08-31T08:30:00.000Z',
    trackingNumber: 'STEAD-90142',
  },
  {
    id: 'VEL-8923',
    customerName: 'Ahsan Habib',
    customerPhone: '01912345678',
    deliveryZone: 'outside',
    address: 'Holding 14, GEC Circle, Nasirabad, Chattogram',
    city: 'Chattogram',
    items: [
      {
        slug: 'aura-earbuds',
        name: 'Aura ANC Hi-Fi Wireless Earbuds',
        variant: 'Standard / Obsidian Black',
        price: 1990,
        quantity: 1,
        img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
      },
      {
        slug: 'heritage-leather-tote',
        name: 'Heritage Full-Grain Leather Tote',
        variant: 'One Size / Cognac Brown',
        price: 2890,
        quantity: 1,
        img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
      },
    ],
    subtotal: 4880,
    shippingFee: 150,
    total: 5030,
    paymentMethod: 'cod',
    status: 'pending',
    createdAt: '2026-08-31T14:45:00.000Z',
  },
];
