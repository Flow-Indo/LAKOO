// Product data for post and product pages
// All 4 products with post (eksplor) images and product (produk) images

export interface ProductTag {
  productSlug: string;
  position: {
    x: number; // percentage from left (0-100)
    y: number; // percentage from top (0-100)
  };
  imageIndex: number; // which image in carousel (0-3)
}

export interface ProductData {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;

  // For Post Page (eksplor images)
  postImages: string[];

  // For Product Page (produk images)
  productImages: string[];

  // Post-specific data
  postData: {
    title: string;
    content: string;
    tags: string[];
    author: {
      name: string;
      avatar: string;
      followerCount: number;
    };
    location: string;
    editedAt: string;
    interactions: {
      likes: number;
      favorites: number;
      comments: number;
    };
  };

  // Product-specific data - matching DesktopProductPage structure
  productData: {
    rating: number;
    reviewCount: number;
    sold: string;
    sizes: string[];
    colors: string[];
    category: string;
    categorySlug: string;
    subcategory?: string;
    subcategorySlug?: string;
    subtitle?: string;
    sku: string;
    stock: number;
    discountPercentage: number;
    badges?: string[];
  };

  // Tagged products in post images (Dewu style)
  taggedProducts?: {
    tags: ProductTag[];
  };
}

export const productsData: Record<string, ProductData> = {
  'cult-suri': {
    id: 'prod-cult-suri',
    slug: 'cult-suri',
    name: 'Coco Top Chiffon Dengan Scarf Detail',
    brand: 'CULT SURI',
    description: 'Atasan chiffon elegan dengan detail scarf yang cantik. Sempurna untuk acara formal maupun kasual.',
    price: 289000,
    originalPrice: 450000,
    currency: 'Rp',

    postImages: [
      '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor1.webp',
      '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor2.webp',
      '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor3.webp',
      '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor4.webp'
    ],

    productImages: [
      '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_produk.webp'
    ],

    postData: {
      title: 'Atasan Chiffon Elegan untuk Acara Spesial ✨',
      content: `Baru dapat atasan baru dari CULT SURI dan langsung jatuh cinta! Material chiffonnya lembut banget dan detail scarfnya bikin tampilan jadi lebih elegan.
      Cocok banget buat ke acara formal atau dinner date. Bahannya adem dan nyaman dipake seharian.`,
      tags: ['#FashionIndonesia', '#ChiffonTop', '#CULTSURI', '#OOTD', '#ElegantStyle'],
      author: {
        name: 'Fashion Diary',
        avatar: '/avatars/fashion-diary.png',
        followerCount: 45200
      },
      location: 'Jakarta',
      editedAt: '2 jam yang lalu',
      interactions: {
        likes: 2847,
        favorites: 1203,
        comments: 156
      }
    },

    productData: {
      rating: 4.8,
      reviewCount: 342,
      sold: '2.5K+',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Navy', 'Cream'],
      category: 'Tops',
      categorySlug: 'tops',
      subcategory: 'Blouse',
      subcategorySlug: 'blouse',
      subtitle: 'Atasan Chiffon Elegan dengan Scarf Detail',
      sku: 'CULT-COCO-001',
      stock: 50,
      discountPercentage: 36,
      badges: ['Diskon', 'Terlaris']
    },

    taggedProducts: {
      tags: [
        {
          productSlug: 'cult-suri',
          position: { x: 55, y: 35 },
          imageIndex: 0
        }
      ]
    }
  },

  'karakiri': {
    id: 'prod-karakiri',
    slug: 'karakiri',
    name: 'Jolie Pants | Wide Leg Trousers | Culotte Pants',
    brand: 'Karakiri',
    description: 'Celana kulot wide leg yang nyaman dan stylish. Cocok untuk berbagai acara dan mudah dipadukan.',
    price: 325000,
    originalPrice: 499000,
    currency: 'Rp',

    postImages: [
      '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_eksplor1.webp',
      '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_eksplor2.webp',
      '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_eksplor3.webp',
      '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_eksplor4.webp'
    ],

    productImages: [
      '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk.webp',
      '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk2.webp',
      '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk3.webp',
      '/products/Karakiri - Jolie Pants | Wide Leg Trousers | Culotte Pants/kara_produk4.webp'
    ],

    postData: {
      title: 'Wide Leg Pants yang Super Nyaman! 👖',
      content: `Jatuh cinta sama Jolie Pants dari Karakiri! Modelnya wide leg gitu jadi keliatan tinggi dan langsing.
      Bahannya juga adem dan nyaman banget dipake seharian. Bisa dipake ke kantor atau jalan-jalan. Versatile banget deh!`,
      tags: ['#Karakiri', '#WideLegPants', '#CulottePants', '#FashionMuslim', '#OOTD'],
      author: {
        name: 'Style Maven',
        avatar: '/avatars/style-maven.png',
        followerCount: 67800
      },
      location: 'Bandung',
      editedAt: '5 jam yang lalu',
      interactions: {
        likes: 4192,
        favorites: 1876,
        comments: 234
      }
    },

    productData: {
      rating: 4.9,
      reviewCount: 567,
      sold: '5K+',
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      colors: ['Black', 'Navy', 'Olive', 'Khaki', 'Brown'],
      category: 'Bottoms',
      categorySlug: 'bottoms',
      subcategory: 'Culottes',
      subcategorySlug: 'culottes',
      subtitle: 'Celana Kulot Wide Leg Trendy',
      sku: 'KAR-JOLIE-001',
      stock: 75,
      discountPercentage: 35,
      badges: ['Diskon', 'Terlaris']
    },

    taggedProducts: {
      tags: [
        {
          productSlug: 'karakiri',
          position: { x: 50, y: 60 },
          imageIndex: 0
        }
      ]
    }
  },

  'rue': {
    id: 'prod-rue',
    slug: 'rue',
    name: 'Sheer Top Atasan Lengan Panjang Boatneck Longsleeve',
    brand: 'RUE',
    description: 'Atasan sheer dengan boatneck yang feminine dan elegan. Material ringan dan breathable.',
    price: 195000,
    originalPrice: 320000,
    currency: 'Rp',

    postImages: [
      '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_eksplor1.webp',
      '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_eksplor2.webp',
      '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_eksplor3.webp',
      '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_eksplor4.webp'
    ],

    productImages: [
      '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk.webp',
      '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk2.webp',
      '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk3.webp',
      '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_produk4.webp'
    ],

    postData: {
      title: 'Sheer Top yang Bikin Penampilan Makin Feminine 🌸',
      content: `Suka banget sama sheer top dari RUE ini! Modelnya boatneck jadi keliatan lebih anggun.
      Material sheernya tipis tapi gak nerawang, jadi tetep sopan. Bisa dipake buat layering atau pakai sendiri dengan inner. Love it!`,
      tags: ['#RUEFashion', '#SheerTop', '#Boatneck', '#FeminineStyle', '#FashionIndo'],
      author: {
        name: 'Bella Fashion',
        avatar: '/avatars/bella-fashion.png',
        followerCount: 34500
      },
      location: 'Surabaya',
      editedAt: '1 hari yang lalu',
      interactions: {
        likes: 1923,
        favorites: 845,
        comments: 98
      }
    },

    productData: {
      rating: 4.7,
      reviewCount: 289,
      sold: '1.8K+',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Beige', 'Pink'],
      category: 'Tops',
      categorySlug: 'tops',
      subcategory: 'Long Sleeve',
      subcategorySlug: 'long-sleeve',
      subtitle: 'Atasan Sheer Boatneck Feminin',
      sku: 'RUE-SHEER-001',
      stock: 60,
      discountPercentage: 39,
      badges: ['Diskon']
    },

    taggedProducts: {
      tags: [
        {
          productSlug: 'rue',
          position: { x: 50, y: 40 },
          imageIndex: 0
        }
      ]
    }
  },

  'wearthreek': {
    id: 'prod-wearthreek',
    slug: 'wearthreek',
    name: 'Britney Low Waist Jeans',
    brand: 'WEAR THREEK',
    description: 'Jeans low waist dengan model Y2K yang trendy. Stretchable dan comfortable untuk daily wear.',
    price: 399000,
    originalPrice: 650000,
    currency: 'Rp',

    postImages: [
      '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_eksplor1.webp',
      '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_eksplor2.webp',
      '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_eksplor3.webp',
      '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_eksplor4.webp'
    ],

    productImages: [
      '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk.webp',
      '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk2.webp',
      '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk3.webp',
      '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_produk4.webp'
    ],

    postData: {
      title: 'Jeans Low Waist yang Lagi Hits Banget! 🔥',
      content: `OMG finally nemu jeans low waist yang pas banget! Britney Jeans dari WEAR THREEK ini model Y2K vibes gitu.
      Stretchnya pas, gak terlalu ketat tapi tetep shaping body dengan baik. Materialnya juga bagus dan nyaman dipake seharian!`,
      tags: ['#WEARTHREEK', '#LowWaistJeans', '#Y2KFashion', '#DenimLovers', '#JeansOOTD'],
      author: {
        name: 'Denim Queen',
        avatar: '/avatars/denim-queen.png',
        followerCount: 89200
      },
      location: 'Jakarta',
      editedAt: '3 jam yang lalu',
      interactions: {
        likes: 5632,
        favorites: 2341,
        comments: 412
      }
    },

    productData: {
      rating: 4.9,
      reviewCount: 823,
      sold: '8K+',
      sizes: ['24', '25', '26', '27', '28', '29', '30'],
      colors: ['Light Blue', 'Dark Blue', 'Black Denim'],
      category: 'Denim',
      categorySlug: 'denim',
      subcategory: 'Low Waist Jeans',
      subcategorySlug: 'low-waist-jeans',
      subtitle: 'Jeans Y2K Low Waist Trendy',
      sku: 'WT-BRITNEY-001',
      stock: 100,
      discountPercentage: 39,
      badges: ['Diskon', 'Terlaris', 'Hot']
    },

    taggedProducts: {
      tags: [
        {
          productSlug: 'wearthreek',
          position: { x: 45, y: 65 },
          imageIndex: 0
        }
      ]
    }
  }
};

// Helper function to get product by slug
export function getProductBySlug(slug: string): ProductData | undefined {
  return productsData[slug];
}

// Get all product slugs for static generation
export function getAllProductSlugs(): string[] {
  return Object.keys(productsData);
}

// Get products by tag slugs
export function getProductsByTags(tags: ProductTag[]): Array<ProductData & { tag: ProductTag }> {
  return tags
    .map(tag => {
      const product = productsData[tag.productSlug];
      return product ? { ...product, tag } : null;
    })
    .filter(Boolean) as Array<ProductData & { tag: ProductTag }>;
}
