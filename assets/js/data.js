/* ============================================================
   BIANCA CORNER — Store Data
   Edit products, categories, governorates, coupons and content
   here. Everything is plain JavaScript, no build step required.
   ============================================================ */

const STORE = {
  name: 'Bianca Corner',
  nameAr: 'بيانكا كورنر',
  // ⚠️ Replace before launch:
  whatsapp: '201000000000',          // WhatsApp number (international format, no +)
  phoneDisplay: '+20 100 000 0000',
  email: 'hello@biancacorner.com',
  instagram: 'https://www.instagram.com/biancacorner42/',
  facebook: 'https://www.facebook.com/groups/474486990195875/',
  currency: 'EGP',
  freeShippingOver: 3000,
  adminPassword: 'bianca2024'        // ⚠️ Change before launch
};

/* ---------- Color palette used across products ---------- */
const COLORS = {
  black:     { ar: 'أسود',        en: 'Black',        hex: '#1b1b1b' },
  white:     { ar: 'أبيض',        en: 'White',        hex: '#f4f1ea' },
  ivory:     { ar: 'عاجي',        en: 'Ivory',        hex: '#ece3d2' },
  beige:     { ar: 'بيج',         en: 'Beige',        hex: '#d6c3a9' },
  camel:     { ar: 'كاميل',       en: 'Camel',        hex: '#b3875a' },
  olive:     { ar: 'زيتوني',      en: 'Olive',        hex: '#6c7048' },
  denim:     { ar: 'جينز أزرق',   en: 'Denim Blue',   hex: '#4f6d8e' },
  denimDark: { ar: 'جينز غامق',   en: 'Dark Denim',   hex: '#2e4057' },
  burgundy:  { ar: 'عنابي',       en: 'Burgundy',     hex: '#6e2837' },
  blush:     { ar: 'وردي باستيل', en: 'Blush Pink',   hex: '#e6c4bd' },
  sage:      { ar: 'أخضر فاتح',   en: 'Sage',         hex: '#a9b6a0' },
  navy:      { ar: 'كحلي',        en: 'Navy',         hex: '#243349' },
  grey:      { ar: 'رمادي',       en: 'Grey',         hex: '#8f8f8c' },
  chocolate: { ar: 'بني',         en: 'Chocolate',    hex: '#5a4032' },
  lilac:     { ar: 'ليلكي',       en: 'Lilac',        hex: '#b9a9cf' },
  champagne: { ar: 'شامبين',      en: 'Champagne',    hex: '#d9c49a' },
  terracotta:{ ar: 'طوبي',        en: 'Terracotta',   hex: '#b9674c' }
};

const CATEGORIES = [
  {
    slug: 'dresses',
    name: { ar: 'فساتين', en: 'Dresses' },
    tagline: { ar: 'قصّات أنثوية لكل مناسبة', en: 'Feminine silhouettes for every occasion' },
    desc: {
      ar: 'من الفساتين الكاجوال اليومية إلى إطلالات السهرة — تشكيلة بيانكا كورنر من الفساتين مصممة لتمنحكِ أناقة بلا مجهود.',
      en: 'From effortless daytime dresses to evening looks — the Bianca Corner dress edit is made for elegance without effort.'
    },
    art: ['#e9ddd0', '#cbb59b']
  },
  {
    slug: 'tshirts',
    name: { ar: 'تيشيرتات وتوبات', en: 'T-Shirts & Tops' },
    tagline: { ar: 'أساسيات بجودة تدوم', en: 'Everyday essentials, made to last' },
    desc: {
      ar: 'قطن مصري فاخر وقصّات مدروسة — تيشيرتات وتوبات تصلح لكل يوم وكل ستايل.',
      en: 'Premium Egyptian cotton and considered cuts — tees and tops for every day and every style.'
    },
    art: ['#e8e4dc', '#c9c2b4']
  },
  {
    slug: 'jeans',
    name: { ar: 'جينز', en: 'Jeans' },
    tagline: { ar: 'القصّة المثالية لجسمك', en: 'The perfect fit for your shape' },
    desc: {
      ar: 'جينز بقصّات متنوعة — وايد ليج، سكيني، مام فيت ومستقيم — بخامات مريحة تتحرك معكِ.',
      en: 'Jeans in every cut — wide leg, skinny, mom fit and straight — in comfortable fabrics that move with you.'
    },
    art: ['#d9dee6', '#8ea3bb']
  },
  {
    slug: 'jackets',
    name: { ar: 'جاكيتات ومعاطف', en: 'Jackets & Coats' },
    tagline: { ar: 'طبقات تكمل إطلالتك', en: 'Layers that complete the look' },
    desc: {
      ar: 'بليزرات، جاكيتات جلد وجينز ومعاطف صوف — القطعة التي تحوّل أي إطلالة عادية إلى ستايل متكامل.',
      en: 'Blazers, leather and denim jackets and wool coats — the piece that turns any outfit into a look.'
    },
    art: ['#e3d9d5', '#a99a90']
  }
];

/* ---------- Products ----------
   badge options: 'new' | 'bestseller' | 'sale' | 'limited'
   art: two colors used to render the illustrated placeholder  */
const PRODUCTS = [
  /* ------- DRESSES ------- */
  {
    id: 'd01', slug: 'satin-midi-dress', cat: 'dresses',
    name: { ar: 'فستان ميدي ساتان بربطة خصر', en: 'Satin Midi Dress with Waist Tie' },
    price: 1650, oldPrice: 2100,
    colors: ['burgundy', 'black', 'olive'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 14, badges: ['bestseller', 'sale'],
    rating: 4.8, reviewsCount: 32, sku: 'BC-DR-001',
    art: ['#e7d3cd', '#b06a72'],
    desc: {
      ar: 'فستان ميدي من الساتان الناعم بقصّة انسيابية وربطة خصر تحدد القوام برقي. مثالي للمناسبات والخروجات المسائية، بأكمام طويلة وفتحة رقبة V أنيقة.',
      en: 'A fluid satin midi dress with a waist-defining tie. Perfect for occasions and evenings out, with long sleeves and an elegant V-neckline.'
    },
    material: { ar: '٩٥٪ بوليستر ساتان، ٥٪ إيلاستين', en: '95% satin polyester, 5% elastane' },
    care: { ar: 'غسيل يدوي بماء بارد، يُكوى على درجة حرارة منخفضة من الداخل.', en: 'Hand wash cold, iron inside-out on low heat.' }
  },
  {
    id: 'd02', slug: 'floral-maxi-dress', cat: 'dresses',
    name: { ar: 'فستان ماكسي مزهر بأكمام واسعة', en: 'Floral Maxi Dress with Flowy Sleeves' },
    price: 1890, oldPrice: null,
    colors: ['blush', 'ivory', 'sage'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 9, badges: ['new'],
    rating: 4.7, reviewsCount: 18, sku: 'BC-DR-002',
    art: ['#f0ddd6', '#c99d97'],
    desc: {
      ar: 'فستان ماكسي بنقشة زهور رومانسية وأكمام واسعة تمنحكِ حركة انسيابية. خصر مطاطي مريح وقماش خفيف مثالي للصيف والربيع.',
      en: 'A maxi dress in a romantic floral print with flowy sleeves. Comfortable elastic waist and airy fabric — made for spring and summer.'
    },
    material: { ar: '١٠٠٪ فيسكوز', en: '100% viscose' },
    care: { ar: 'غسيل لطيف في الغسالة بماء بارد، يُجفف على علاقة.', en: 'Gentle machine wash cold, hang to dry.' }
  },
  {
    id: 'd03', slug: 'little-black-dress', cat: 'dresses',
    name: { ar: 'فستان أسود كلاسيك قصير', en: 'Classic Little Black Dress' },
    price: 1250, oldPrice: 1500,
    colors: ['black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 22, badges: ['bestseller'],
    rating: 4.9, reviewsCount: 45, sku: 'BC-DR-003',
    art: ['#d6d2cb', '#3c3a38'],
    desc: {
      ar: 'الفستان الأسود الذي لا يغيب عن أي دولاب — قصّة A-line بسيطة وأنيقة تناسب العمل والمناسبات. قماش كريب متوسط السماكة يحافظ على شكله طوال اليوم.',
      en: 'The little black dress every wardrobe needs — a clean A-line cut that works for office and occasions alike, in a structured crepe that holds its shape all day.'
    },
    material: { ar: '٩٨٪ بوليستر كريب، ٢٪ إيلاستين', en: '98% crepe polyester, 2% elastane' },
    care: { ar: 'غسيل في الغسالة على برنامج لطيف، لا تستخدمي المبيض.', en: 'Machine wash gentle, do not bleach.' }
  },
  {
    id: 'd04', slug: 'linen-summer-dress', cat: 'dresses',
    name: { ar: 'فستان كتان صيفي بأزرار', en: 'Linen Summer Shirt Dress' },
    price: 1450, oldPrice: null,
    colors: ['ivory', 'beige', 'olive'],
    sizes: ['S', 'M', 'L'],
    stock: 7, badges: ['new', 'limited'],
    rating: 4.6, reviewsCount: 11, sku: 'BC-DR-004',
    art: ['#eee7d8', '#b7a377'],
    desc: {
      ar: 'فستان قميص من الكتان الطبيعي بأزرار أمامية كاملة وحزام خصر من نفس القماش. خامة تتنفس تحافظ على انتعاشكِ في أحرّ الأيام.',
      en: 'A natural linen shirt dress with full front buttons and a self-fabric belt. A breathable weave that keeps you cool on the hottest days.'
    },
    material: { ar: '٧٠٪ كتان، ٣٠٪ قطن', en: '70% linen, 30% cotton' },
    care: { ar: 'غسيل بارد، يُفضل التجفيف الطبيعي للحفاظ على خامة الكتان.', en: 'Cold wash, air dry recommended to preserve the linen.' }
  },
  {
    id: 'd05', slug: 'embroidered-evening-dress', cat: 'dresses',
    name: { ar: 'فستان سهرة مطرز بالترتر', en: 'Embroidered Sequin Evening Dress' },
    price: 2400, oldPrice: 2900,
    colors: ['navy', 'black', 'burgundy'],
    sizes: ['S', 'M', 'L'],
    stock: 5, badges: ['limited', 'sale'],
    rating: 4.8, reviewsCount: 9, sku: 'BC-DR-005',
    art: ['#d8d5e0', '#4a4a72'],
    desc: {
      ar: 'فستان سهرة فاخر بتطريز ترتر يدوي على الصدر والأكمام. قصّة ضيقة من الأعلى وتننورة انسيابية — قطعة تلفت الأنظار في أي مناسبة.',
      en: 'A statement evening gown with hand-sewn sequin embroidery across the bodice and sleeves. Fitted top with a flowing skirt — made to turn heads.'
    },
    material: { ar: 'تول مطرز، بطانة كاملة من الداخل', en: 'Embroidered tulle, fully lined' },
    care: { ar: 'تنظيف جاف فقط.', en: 'Dry clean only.' }
  },
  {
    id: 'd06', slug: 'wrap-belted-dress', cat: 'dresses',
    name: { ar: 'فستان راب محزم بقصة التفاف', en: 'Belted Wrap Dress' },
    price: 1350, oldPrice: null,
    colors: ['terracotta', 'black', 'sage'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 18, badges: ['bestseller'],
    rating: 4.7, reviewsCount: 27, sku: 'BC-DR-006',
    art: ['#ecd9cf', '#bb7a5e'],
    desc: {
      ar: 'فستان بقصّة الالتفاف الأيقونية التي تناسب كل الأجسام، مع حزام يُربط على الخصر. قطعة عملية تنتقلين بها من المكتب إلى العشاء.',
      en: 'The iconic wrap silhouette that flatters every figure, finished with a waist tie. A versatile piece that goes from desk to dinner.'
    },
    material: { ar: '٩٦٪ فيسكوز، ٤٪ إيلاستين', en: '96% viscose, 4% elastane' },
    care: { ar: 'غسيل بارد في الغسالة، كيّ على درجة متوسطة.', en: 'Machine wash cold, medium iron.' }
  },

  /* ------- T-SHIRTS & TOPS ------- */
  {
    id: 't01', slug: 'essential-cotton-tee', cat: 'tshirts',
    name: { ar: 'تيشيرت قطن أساسي', en: 'Essential Cotton Tee' },
    price: 390, oldPrice: 450,
    colors: ['white', 'black', 'beige', 'grey'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 60, badges: ['bestseller'],
    rating: 4.9, reviewsCount: 87, sku: 'BC-TS-001',
    art: ['#eeeae2', '#b5ada0'],
    desc: {
      ar: 'القطعة الأساسية التي لا غنى عنها — تيشيرت من قطن مصري ١٠٠٪ بقصّة مريحة ورقبة دائرية. خامة ثقيلة تدوم مع الغسيل المتكرر.',
      en: 'The essential you can never have enough of — a 100% Egyptian cotton tee with a relaxed cut and crew neck, in a substantial fabric that survives repeat washing.'
    },
    material: { ar: '١٠٠٪ قطن مصري، ٢٢٠ جم/م²', en: '100% Egyptian cotton, 220 gsm' },
    care: { ar: 'غسيل في الغسالة بماء بارد مع ألوان مشابهة.', en: 'Machine wash cold with like colors.' }
  },
  {
    id: 't02', slug: 'oversized-tee', cat: 'tshirts',
    name: { ar: 'تيشيرت أوفرسايز واسع', en: 'Oversized Boyfriend Tee' },
    price: 450, oldPrice: null,
    colors: ['white', 'black', 'lilac'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 35, badges: ['new'],
    rating: 4.6, reviewsCount: 24, sku: 'BC-TS-002',
    art: ['#e4e0ea', '#9f8fb8'],
    desc: {
      ar: 'تيشيرت بقصّة أوفرسايز عصرية بأكتاف منخفضة — ستايل مريح يتناسق مع الجينز أو التنانير. حواف مدرّجة تمنح القطعة شكلًا راقيًا.',
      en: 'A modern oversized tee with dropped shoulders — relaxed styling that pairs with jeans or skirts, finished with clean bound edges.'
    },
    material: { ar: '١٠٠٪ قطن', en: '100% cotton' },
    care: { ar: 'غسيل بارد، يُجفف مسطحًا للحفاظ على القصّة.', en: 'Cold wash, dry flat to keep the shape.' }
  },
  {
    id: 't03', slug: 'ribbed-knit-top', cat: 'tshirts',
    name: { ar: 'توب ريب محبوك بدون أكمام', en: 'Ribbed Knit Sleeveless Top' },
    price: 480, oldPrice: 560,
    colors: ['black', 'ivory', 'camel', 'olive'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 26, badges: ['sale'],
    rating: 4.7, reviewsCount: 33, sku: 'BC-TS-003',
    art: ['#eae2d5', '#a98f6d'],
    desc: {
      ar: 'توب محبوك بخامة ريب مرنة تحتضن القوام بشكل مريح. رقبة عالية وأكمام مكشوفة — مثالي كقطعة أساسية تحت البليزر أو بمفرده.',
      en: 'A ribbed-knit top with stretch that hugs the figure comfortably. High neck, sleeveless — perfect as a base layer under blazers or on its own.'
    },
    material: { ar: '٩٠٪ فيسكوز ريب، ١٠٪ إيلاستين', en: '90% ribbed viscose, 10% elastane' },
    care: { ar: 'غسيل يدوي لطيف، لا يُعصر.', en: 'Gentle hand wash, do not wring.' }
  },
  {
    id: 't04', slug: 'graphic-statement-tee', cat: 'tshirts',
    name: { ar: 'تيشيرت بطبعة جرافيك', en: 'Graphic Statement Tee' },
    price: 520, oldPrice: null,
    colors: ['white', 'black'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20, badges: ['new'],
    rating: 4.5, reviewsCount: 14, sku: 'BC-TS-004',
    art: ['#e9e6df', '#7d7668'],
    desc: {
      ar: 'تيشيرت قطني بطبعة فنية مستوحاة من الخط العربي الحديث — قطعة تضيف شخصية لأي إطلالة كاجوال.',
      en: 'A cotton tee featuring an art print inspired by modern Arabic calligraphy — a piece that adds character to any casual look.'
    },
    material: { ar: '١٠٠٪ قطن', en: '100% cotton' },
    care: { ar: 'يُغسل مقلوبًا لحماية الطبعة، ماء بارد.', en: 'Wash inside-out to protect the print, cold water.' }
  },
  {
    id: 't05', slug: 'satin-camisole-top', cat: 'tshirts',
    name: { ar: 'توب ساتان بحمالات رفيعة', en: 'Satin Camisole Top' },
    price: 550, oldPrice: 650,
    colors: ['champagne', 'black', 'blush'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 16, badges: ['sale'],
    rating: 4.6, reviewsCount: 19, sku: 'BC-TS-005',
    art: ['#efe4d3', '#c4a87e'],
    desc: {
      ar: 'توب ساتان ناعم بحمالات قابلة للتعديل وحافة دانتيل رقيقة. يُلبس تحت الجاكيتات أو بمفرده في الأمسيات.',
      en: 'A soft satin camisole with adjustable straps and delicate lace trim. Wear it under jackets or solo for evenings.'
    },
    material: { ar: 'ساتان بوليستر، دانتيل نايلون', en: 'Polyester satin, nylon lace' },
    care: { ar: 'غسيل يدوي بارد.', en: 'Cold hand wash.' }
  },

  /* ------- JEANS ------- */
  {
    id: 'j01', slug: 'wide-leg-jeans', cat: 'jeans',
    name: { ar: 'بنطلون جينز وايد ليج عالي الخصر', en: 'High-Waist Wide-Leg Jeans' },
    price: 1150, oldPrice: 1350,
    colors: ['denim', 'denimDark', 'black'],
    sizes: ['26', '27', '28', '29', '30', '31', '32'],
    stock: 24, badges: ['bestseller', 'sale'],
    rating: 4.8, reviewsCount: 41, sku: 'BC-JN-001',
    art: ['#ccd6e2', '#5f7c9d'],
    desc: {
      ar: 'جينز وايد ليج بخصر عالٍ يطيل القوام — القصّة الأكثر رواجًا هذا الموسم. خامة جينز متوسطة السماكة بمطّاطية خفيفة للراحة.',
      en: 'High-waist wide-leg jeans that elongate the silhouette — the season\'s most-wanted cut in a mid-weight denim with light stretch.'
    },
    material: { ar: '٩٨٪ قطن دنيم، ٢٪ إيلاستين', en: '98% cotton denim, 2% elastane' },
    care: { ar: 'يُغسل مقلوبًا بماء بارد للحفاظ على اللون.', en: 'Wash inside-out cold to preserve color.' }
  },
  {
    id: 'j02', slug: 'skinny-high-rise-jeans', cat: 'jeans',
    name: { ar: 'جينز سكيني عالي الخصر', en: 'High-Rise Skinny Jeans' },
    price: 950, oldPrice: null,
    colors: ['denimDark', 'black', 'grey'],
    sizes: ['25', '26', '27', '28', '29', '30', '31', '32'],
    stock: 30, badges: [],
    rating: 4.6, reviewsCount: 38, sku: 'BC-JN-002',
    art: ['#d0d7df', '#44586f'],
    desc: {
      ar: 'جينز سكيني كلاسيك بخصر عالٍ يشد القوام — خامة مطاطية مريحة تتحرك معكِ طوال اليوم دون أن تفقد شكلها.',
      en: 'A classic high-rise skinny that sculpts the figure — comfortable stretch denim that moves with you all day without bagging out.'
    },
    material: { ar: '٩٢٪ قطن، ٦٪ بوليستر، ٢٪ إيلاستين', en: '92% cotton, 6% polyester, 2% elastane' },
    care: { ar: 'غسيل بارد، يُجفف طبيعيًا.', en: 'Cold wash, air dry.' }
  },
  {
    id: 'j03', slug: 'mom-fit-jeans', cat: 'jeans',
    name: { ar: 'جينز مام فيت بغسالة فاتحة', en: 'Mom-Fit Jeans, Light Wash' },
    price: 1050, oldPrice: 1200,
    colors: ['denim'],
    sizes: ['26', '27', '28', '29', '30', '31'],
    stock: 15, badges: ['sale'],
    rating: 4.7, reviewsCount: 22, sku: 'BC-JN-003',
    art: ['#d8e0ea', '#7d97b4'],
    desc: {
      ar: 'جينز مام فيت بقصّة مريحة على الأرداف وضيقة تدريجيًا نحو الكاحل — غسالة فاتحة بملمس فينتاج راقٍ.',
      en: 'Mom-fit jeans relaxed through the hip and tapered to the ankle — a light vintage wash with a premium feel.'
    },
    material: { ar: '١٠٠٪ قطن دنيم', en: '100% cotton denim' },
    care: { ar: 'غسيل بارد مقلوبًا.', en: 'Wash cold inside-out.' }
  },
  {
    id: 'j04', slug: 'distressed-straight-jeans', cat: 'jeans',
    name: { ar: 'جينز مستقيم بتفاصيل ممزقة', en: 'Distressed Straight-Leg Jeans' },
    price: 1100, oldPrice: null,
    colors: ['denim', 'grey'],
    sizes: ['26', '27', '28', '29', '30', '32'],
    stock: 12, badges: ['new'],
    rating: 4.5, reviewsCount: 16, sku: 'BC-JN-004',
    art: ['#d2dbe4', '#6b87a3'],
    desc: {
      ar: 'جينز بقصّة مستقيمة وتفاصيل ممزقة مدروسة على الركبتين — لمسة جريئة لإطلالات الكاجوال.',
      en: 'Straight-leg jeans with considered distressing at the knees — a bold touch for casual styling.'
    },
    material: { ar: '٩٩٪ قطن، ١٪ إيلاستين', en: '99% cotton, 1% elastane' },
    care: { ar: 'غسيل لطيف بارد.', en: 'Gentle cold wash.' }
  },
  {
    id: 'j05', slug: 'white-cropped-jeans', cat: 'jeans',
    name: { ar: 'جينز أبيض كروب بقصة مستقيمة', en: 'White Cropped Straight Jeans' },
    price: 990, oldPrice: null,
    colors: ['white'],
    sizes: ['25', '26', '27', '28', '29', '30', '31'],
    stock: 10, badges: ['limited'],
    rating: 4.6, reviewsCount: 13, sku: 'BC-JN-005',
    art: ['#ece8e0', '#b0a893'],
    desc: {
      ar: 'جينز أبيض بطول كروب يبرز الحذاء — قماش سميك غير شفاف بقصّة مستقيمة أنيقة، قطعة أساسية لصيفكِ.',
      en: 'White cropped jeans that show off your shoes — opaque, substantial denim in an elegant straight cut. A summer staple.'
    },
    material: { ar: '٩٨٪ قطن، ٢٪ إيلاستين', en: '98% cotton, 2% elastane' },
    care: { ar: 'يُغسل مع الألوان الفاتحة فقط.', en: 'Wash with light colors only.' }
  },

  /* ------- JACKETS ------- */
  {
    id: 'k01', slug: 'leather-biker-jacket', cat: 'jackets',
    name: { ar: 'جاكيت جلد بايكر', en: 'Leather Biker Jacket' },
    price: 2400, oldPrice: 2900,
    colors: ['black', 'chocolate'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 8, badges: ['bestseller', 'limited', 'sale'],
    rating: 4.9, reviewsCount: 29, sku: 'BC-JK-001',
    art: ['#ddd4ce', '#584539'],
    desc: {
      ar: 'جاكيت بايكر من الجلد الصناعي الفاخر بسحّابات معدنية وياقة مائلة — القطعة الاستثمارية التي تكمل أي خزانة.',
      en: 'A premium faux-leather biker jacket with metal zips and a moto collar — the investment piece every wardrobe needs.'
    },
    material: { ar: 'جلد صناعي عالي الجودة، بطانة بوليستر', en: 'High-grade faux leather, polyester lining' },
    care: { ar: 'يُمسح بقطعة قماش رطبة، لا يُغسل.', en: 'Wipe with a damp cloth, do not wash.' }
  },
  {
    id: 'k02', slug: 'linen-blazer', cat: 'jackets',
    name: { ar: 'بليزر كتان بقصة مريحة', en: 'Relaxed Linen Blazer' },
    price: 1750, oldPrice: null,
    colors: ['beige', 'ivory', 'olive'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 13, badges: ['new'],
    rating: 4.7, reviewsCount: 17, sku: 'BC-JK-002',
    art: ['#e9e1d0', '#b09b74'],
    desc: {
      ar: 'بليزر كتان بقصّة أوفرسايز مريحة وأزرار قشر طبيعي — يضفي طابعًا راقيًا على التيشيرتات والفساتين على حد سواء.',
      en: 'A relaxed oversized linen blazer with natural shell buttons — lends polish to tees and dresses alike.'
    },
    material: { ar: '٦٠٪ كتان، ٤٠٪ فيسكوز', en: '60% linen, 40% viscose' },
    care: { ar: 'تنظيف جاف مفضل، أو غسيل يدوي بارد.', en: 'Dry clean preferred, or cold hand wash.' }
  },
  {
    id: 'k03', slug: 'classic-denim-jacket', cat: 'jackets',
    name: { ar: 'جاكيت جينز كلاسيك', en: 'Classic Denim Jacket' },
    price: 1250, oldPrice: 1450,
    colors: ['denim', 'denimDark'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 19, badges: ['bestseller'],
    rating: 4.8, reviewsCount: 35, sku: 'BC-JK-003',
    art: ['#cfd9e4', '#617c99'],
    desc: {
      ar: 'جاكيت الجينز الذي لا يموت موضته — قصّة كلاسيكية بجيوب صدر وأزرار معدنية، يتحسن شكلًا مع الاستخدام.',
      en: 'The denim jacket that never goes out of style — a classic cut with chest pockets and metal buttons that only gets better with wear.'
    },
    material: { ar: '١٠٠٪ قطن دنيم', en: '100% cotton denim' },
    care: { ar: 'غسيل بارد مقلوبًا.', en: 'Wash cold inside-out.' }
  },
  {
    id: 'k04', slug: 'long-wool-coat', cat: 'jackets',
    name: { ar: 'معطف صوف طويل بحزام', en: 'Long Belted Wool Coat' },
    price: 2600, oldPrice: null,
    colors: ['camel', 'black', 'grey'],
    sizes: ['S', 'M', 'L'],
    stock: 6, badges: ['limited'],
    rating: 4.9, reviewsCount: 12, sku: 'BC-JK-004',
    art: ['#e5d9c6', '#a07d50'],
    desc: {
      ar: 'معطف طويل من مخلوط الصوف بحزام خصر وجيوب جانبية — دفء وأناقة في قطعة واحدة لأيام الشتاء.',
      en: 'A long wool-blend coat with a waist belt and side pockets — warmth and elegance in a single winter piece.'
    },
    material: { ar: '٦٠٪ صوف، ٤٠٪ بوليستر، بطانة كاملة', en: '60% wool, 40% polyester, fully lined' },
    care: { ar: 'تنظيف جاف فقط.', en: 'Dry clean only.' }
  },
  {
    id: 'k05', slug: 'cropped-bomber-jacket', cat: 'jackets',
    name: { ar: 'جاكيت بومبر قصير', en: 'Cropped Bomber Jacket' },
    price: 1350, oldPrice: 1600,
    colors: ['olive', 'black'],
    sizes: ['S', 'M', 'L'],
    stock: 11, badges: ['sale'],
    rating: 4.5, reviewsCount: 15, sku: 'BC-JK-005',
    art: ['#dde0d2', '#7a7e5c'],
    desc: {
      ar: 'جاكيت بومبر بطول كروب بسحّاب أمامي وأطراف مضلعة — خفيف ومثالي للطقس الانتقالي.',
      en: 'A cropped bomber with a front zip and ribbed trims — light enough for in-between weather, sharp enough for everywhere.'
    },
    material: { ar: 'بوليستر مقاوم للماء، بطانة داخلية', en: 'Water-resistant polyester, lined' },
    care: { ar: 'غسيل بارد، يُجفف طبيعيًا.', en: 'Cold wash, air dry.' }
  }
];

/* ---------- Egyptian governorates & delivery fees (EGP) ---------- */
const GOVERNORATES = [
  { id: 'cairo',        ar: 'القاهرة',           en: 'Cairo',          fee: 60, days: '1-2' },
  { id: 'giza',         ar: 'الجيزة',            en: 'Giza',           fee: 60, days: '1-2' },
  { id: 'alexandria',   ar: 'الإسكندرية',        en: 'Alexandria',     fee: 65, days: '2-3' },
  { id: 'qalyubia',     ar: 'القليوبية',         en: 'Qalyubia',       fee: 65, days: '2-3' },
  { id: 'dakahlia',     ar: 'الدقهلية',          en: 'Dakahlia',       fee: 70, days: '2-4' },
  { id: 'sharqia',      ar: 'الشرقية',           en: 'Sharqia',        fee: 70, days: '2-4' },
  { id: 'gharbia',      ar: 'الغربية',           en: 'Gharbia',        fee: 70, days: '2-4' },
  { id: 'monufia',      ar: 'المنوفية',          en: 'Monufia',        fee: 70, days: '2-4' },
  { id: 'beheira',      ar: 'البحيرة',           en: 'Beheira',        fee: 70, days: '2-4' },
  { id: 'kafrsheikh',   ar: 'كفر الشيخ',         en: 'Kafr El-Sheikh', fee: 75, days: '3-4' },
  { id: 'damietta',     ar: 'دمياط',             en: 'Damietta',       fee: 75, days: '3-4' },
  { id: 'portsaid',     ar: 'بورسعيد',           en: 'Port Said',      fee: 75, days: '3-4' },
  { id: 'ismailia',     ar: 'الإسماعيلية',       en: 'Ismailia',       fee: 75, days: '3-4' },
  { id: 'suez',         ar: 'السويس',            en: 'Suez',           fee: 75, days: '3-4' },
  { id: 'faiyum',       ar: 'الفيوم',            en: 'Faiyum',         fee: 75, days: '3-4' },
  { id: 'benisuef',     ar: 'بني سويف',          en: 'Beni Suef',      fee: 80, days: '3-5' },
  { id: 'minya',        ar: 'المنيا',            en: 'Minya',          fee: 80, days: '3-5' },
  { id: 'assiut',       ar: 'أسيوط',             en: 'Assiut',         fee: 85, days: '3-5' },
  { id: 'sohag',        ar: 'سوهاج',             en: 'Sohag',          fee: 85, days: '3-5' },
  { id: 'qena',         ar: 'قنا',               en: 'Qena',           fee: 85, days: '4-6' },
  { id: 'luxor',        ar: 'الأقصر',            en: 'Luxor',          fee: 90, days: '4-6' },
  { id: 'aswan',        ar: 'أسوان',             en: 'Aswan',          fee: 90, days: '4-6' },
  { id: 'redsea',       ar: 'البحر الأحمر',      en: 'Red Sea',        fee: 95, days: '4-6' },
  { id: 'matrouh',      ar: 'مطروح',             en: 'Matrouh',        fee: 90, days: '4-6' },
  { id: 'newvalley',    ar: 'الوادي الجديد',     en: 'New Valley',     fee: 95, days: '5-7' },
  { id: 'northsinai',   ar: 'شمال سيناء',        en: 'North Sinai',    fee: 95, days: '5-7' },
  { id: 'southsinai',   ar: 'جنوب سيناء',        en: 'South Sinai',    fee: 95, days: '4-6' }
];

const COUPONS = {
  'BIANCA10':  { type: 'percent', value: 10, min: 500,  desc: { ar: 'خصم ١٠٪ على الطلبات فوق ٥٠٠ ج.م', en: '10% off orders over EGP 500' } },
  'WELCOME50': { type: 'fixed',   value: 50, min: 800,  desc: { ar: 'خصم ٥٠ ج.م على أول طلب فوق ٨٠٠ ج.م', en: 'EGP 50 off first order over EGP 800' } },
  'FREESHIP':  { type: 'ship',    value: 0,  min: 1000, desc: { ar: 'شحن مجاني للطلبات فوق ١٠٠٠ ج.م', en: 'Free shipping on orders over EGP 1000' } }
};

const TESTIMONIALS = [
  { name: 'مريم أ.', city: 'القاهرة', rating: 5, text: 'الفستان وصل في يومين والخامة أحسن بكتير من الصور. التغليف كان شيك جدًا والمقاس مظبوط — أول مرة أطلب منهم ومش هتكون الأخيرة.' },
  { name: 'سارة م.', city: 'الإسكندرية', rating: 5, text: 'طلبت جينز وايد ليج وكنت خايفة من المقاس، بس جدول المقاسات عندهم دقيق فعلًا. خدمة العملاء على واتساب ردوا عليّ في دقايق.' },
  { name: 'نورهان خ.', city: 'المنصورة', rating: 4, text: 'البليزر الكتان قطعة تحفة، خامة نضيفة وقصّة مظبوطة. الاستبدال كان سهل لما غيرت اللون. أسعار معقولة جدًا للجودة دي.' },
  { name: 'فريدة س.', city: 'الجيزة', rating: 5, text: 'الدفع عند الاستلام ريحني من القلق. فستان السهرة وصل قبل مناسبتي بيومين والتطريز شغل نظيف وواضح إنه متعوب عليه.' }
];

const FAQS = [
  { q: { ar: 'ما هي طرق الدفع المتاحة؟', en: 'What payment methods are available?' },
    a: { ar: 'حاليًا نوفّر الدفع عند الاستلام لجميع محافظات مصر. نعمل على إضافة الدفع بالبطاقات والمحافظ الإلكترونية قريبًا.', en: 'We currently offer Cash on Delivery across all Egyptian governorates. Card and mobile-wallet payments are coming soon.' } },
  { q: { ar: 'كم تستغرق مدة التوصيل؟', en: 'How long does delivery take?' },
    a: { ar: 'القاهرة والجيزة: ١-٢ يوم عمل. الدلتا والإسكندرية: ٢-٤ أيام. الصعيد والمدن الساحلية: ٣-٦ أيام عمل. تظهر المدة التقديرية ورسم الشحن في صفحة إتمام الطلب قبل التأكيد.', en: 'Cairo & Giza: 1–2 business days. Delta & Alexandria: 2–4 days. Upper Egypt & coastal cities: 3–6 business days. The estimate and fee are shown at checkout before you confirm.' } },
  { q: { ar: 'هل يمكنني استبدال أو إرجاع المنتج؟', en: 'Can I exchange or return an item?' },
    a: { ar: 'نعم، لديكِ ١٤ يومًا من تاريخ الاستلام للاستبدال أو الإرجاع بشرط أن تكون القطعة بحالتها الأصلية وبطاقاتها. استبدال المقاس مجاني لأول مرة.', en: 'Yes — you have 14 days from delivery to exchange or return, provided the item is in original condition with tags attached. First size exchange is free.' } },
  { q: { ar: 'كيف أعرف مقاسي المناسب؟', en: 'How do I find my size?' },
    a: { ar: 'كل صفحة منتج تحتوي على جدول مقاسات بالسنتيمتر. إذا كنتِ بين مقاسين ننصح بالأكبر، أو راسلينا على واتساب وسنساعدكِ في الاختيار.', en: 'Every product page includes a size chart in centimeters. If you\'re between sizes we recommend sizing up — or message us on WhatsApp and we\'ll help you choose.' } },
  { q: { ar: 'هل الشحن متاح لجميع المحافظات؟', en: 'Do you ship to all governorates?' },
    a: { ar: 'نعم، نشحن لجميع محافظات مصر الـ٢٧. رسم الشحن يُحسب تلقائيًا حسب محافظتكِ في صفحة الدفع، والشحن مجاني للطلبات فوق ٣٠٠٠ ج.م.', en: 'Yes, we ship to all 27 Egyptian governorates. The fee is calculated automatically at checkout, and shipping is free on orders over EGP 3,000.' } },
  { q: { ar: 'كيف أتتبع طلبي؟', en: 'How do I track my order?' },
    a: { ar: 'بعد تأكيد الطلب ستصلكِ رسالة برقم الطلب. أدخليه في صفحة «تتبع الطلب» مع رقم هاتفكِ لعرض حالة الشحنة لحظة بلحظة.', en: 'After confirmation you\'ll receive an order number. Enter it on the Track Order page with your phone number to see live shipment status.' } }
];

const SIZE_CHART = {
  clothes: {
    head: { ar: ['المقاس', 'الصدر (سم)', 'الخصر (سم)', 'الأرداف (سم)'], en: ['Size', 'Bust (cm)', 'Waist (cm)', 'Hips (cm)'] },
    rows: [
      ['XS', '80–84', '60–64', '86–90'],
      ['S',  '84–88', '64–68', '90–94'],
      ['M',  '88–94', '68–74', '94–100'],
      ['L',  '94–100', '74–80', '100–106'],
      ['XL', '100–106', '80–86', '106–112'],
      ['XXL','106–114', '86–94', '112–120']
    ]
  },
  jeans: {
    head: { ar: ['المقاس', 'الخصر (سم)', 'الأرداف (سم)'], en: ['Size', 'Waist (cm)', 'Hips (cm)'] },
    rows: [
      ['25', '63–66', '87–90'],
      ['26', '66–69', '90–93'],
      ['27', '69–72', '93–96'],
      ['28', '72–75', '96–99'],
      ['29', '75–78', '99–102'],
      ['30', '78–81', '102–105'],
      ['31', '81–84', '105–108'],
      ['32', '84–88', '108–112']
    ]
  }
};
