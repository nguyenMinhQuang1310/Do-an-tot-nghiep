const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const ProductVariant = require('./models/ProductVariant');
const BehaviorLog = require('./models/BehaviorLog');
const Address = require('./models/Address');
const bcrypt = require('bcryptjs');

// Load env
dotenv.config();

const usersData = [
  {
    fullName: 'Admin User',
    email: 'admin@fashion.com',
    password: 'password123',
    phone: '0901234567',
    role: 'admin',
  },
  {
    fullName: 'John Customer',
    email: 'john@example.com',
    password: 'password123',
    phone: '0987654321',
    role: 'customer',
  },
  {
    fullName: 'Jane Customer',
    email: 'jane@example.com',
    password: 'password123',
    phone: '0912345678',
    role: 'customer',
  }
];

const categoriesData = [
  { name: 'Áo Thun', slug: 'ao-thun', isActive: true },
  { name: 'Áo Sơ Mi', slug: 'ao-so-mi', isActive: true },
  { name: 'Quần Jeans', slug: 'quan-jeans', isActive: true },
  { name: 'Áo Khoác', slug: 'ao-khoac', isActive: true },
];

const productsData = [
  {
    name: 'Áo thun nam basic đen',
    slug: 'ao-thun-nam-basic-den',
    catSlug: 'ao-thun',
    description: 'Thiết kế tối giản dễ phối đồ mặc hằng ngày',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/19562362/pexels-photo-19562362.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-1-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-1-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-1-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo thun graphic trắng nam',
    slug: 'ao-thun-graphic-trang-nam',
    catSlug: 'ao-thun',
    description: 'Phong cách trẻ trung nổi bật với họa tiết in',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/17583618/pexels-photo-17583618.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-2-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-2-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-2-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo polo nam basic',
    slug: 'ao-polo-nam-basic',
    catSlug: 'ao-thun',
    description: 'Kiểu cổ bẻ lịch sự phù hợp đi học đi làm',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/1861586/pexels-photo-1861586.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-3-M', stock: 50, price: 200000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-3-L', stock: 50, price: 200000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-3-XL', stock: 50, price: 200000 }
    ]
  },
  {
    name: 'Áo hoodie đỏ nam',
    slug: 'ao-hoodie-do-nam',
    catSlug: 'ao-khoac',
    description: 'Form thoải mái giữ ấm tốt phong cách streetwear',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/34200833/pexels-photo-34200833.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-4-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-4-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-4-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo thun xám nam casual',
    slug: 'ao-thun-xam-nam-casual',
    catSlug: 'ao-thun',
    description: 'Chất liệu mềm nhẹ phù hợp mặc thường ngày',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/16264964/pexels-photo-16264964.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-5-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-5-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-5-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo polo phối sweater',
    slug: 'ao-polo-phoi-sweater',
    catSlug: 'ao-thun',
    description: 'Phong cách nam tính lịch lãm và gọn gàng',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/11000251/pexels-photo-11000251.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-6-M', stock: 50, price: 200000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-6-L', stock: 50, price: 200000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-6-XL', stock: 50, price: 200000 }
    ]
  },
  {
    name: 'Áo hoodie đen nam',
    slug: 'ao-hoodie-den-nam',
    catSlug: 'ao-khoac',
    description: 'Năng động cá tính phù hợp thời tiết se lạnh',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/20954925/pexels-photo-20954925.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-7-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-7-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-7-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo thun oversize đôi nam',
    slug: 'ao-thun-oversize-doi-nam',
    catSlug: 'ao-thun',
    description: 'Form rộng trẻ trung theo phong cách hiện đại',
    brand: 'FASHION',
    targetGender: 'unisex',
    status: 'active',
    images: ['https://images.pexels.com/photos/24233063/pexels-photo-24233063.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-8-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-8-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-8-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo polo cam nam',
    slug: 'ao-polo-cam-nam',
    catSlug: 'ao-thun',
    description: 'Tạo điểm nhấn màu sắc nổi bật và trẻ trung',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/15937031/pexels-photo-15937031.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-9-M', stock: 50, price: 200000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-9-L', stock: 50, price: 200000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-9-XL', stock: 50, price: 200000 }
    ]
  },
  {
    name: 'Áo hoodie chụp góc thấp',
    slug: 'ao-hoodie-chup-goc-thap',
    catSlug: 'ao-khoac',
    description: 'Thiết kế mạnh mẽ phù hợp outfit đường phố',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/19273947/pexels-photo-19273947.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-10-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-10-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-10-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo thun trắng in họa tiết',
    slug: 'ao-thun-trang-in-hoa-tiet',
    catSlug: 'ao-thun',
    description: 'Phong cách hiện đại hợp đi chơi chụp ảnh',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/19881714/pexels-photo-19881714.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-11-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-11-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-11-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo polo xám nam',
    slug: 'ao-polo-xam-nam',
    catSlug: 'ao-thun',
    description: 'Chất áo gọn form dễ phối quần jean hoặc kaki',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/24446647/pexels-photo-24446647.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-12-M', stock: 50, price: 200000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-12-L', stock: 50, price: 200000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-12-XL', stock: 50, price: 200000 }
    ]
  },
  {
    name: 'Áo hoodie chân dung nam',
    slug: 'ao-hoodie-chan-dung-nam',
    catSlug: 'ao-khoac',
    description: 'Thiết kế casual dễ mặc và giữ ấm tốt',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/19727101/pexels-photo-19727101.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-13-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-13-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-13-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo thun đen chụp studio',
    slug: 'ao-thun-den-chup-studio',
    catSlug: 'ao-thun',
    description: 'Phong cách thời trang tối giản và nam tính',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/18003565/pexels-photo-18003565.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-14-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-14-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-14-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo sơ mi họa tiết thời trang',
    slug: 'ao-so-mi-hoa-tiet-thoi-trang',
    catSlug: 'ao-so-mi',
    description: 'Thiết kế nổi bật phù hợp phong cách cá tính',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/25621236/pexels-photo-25621236.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-15-M', stock: 50, price: 250000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-15-L', stock: 50, price: 250000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-15-XL', stock: 50, price: 250000 }
    ]
  },
  {
    name: 'Áo hoodie graphic nam',
    slug: 'ao-hoodie-graphic-nam',
    catSlug: 'ao-khoac',
    description: 'Họa tiết nổi bật theo phong cách street style',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/19697348/pexels-photo-19697348.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-16-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-16-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-16-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác đen nam thời trang',
    slug: 'ao-khoac-den-nam-thoi-trang',
    catSlug: 'ao-khoac',
    description: 'Phong cách urban mạnh mẽ dễ phối đồ',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/19565723/pexels-photo-19565723.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-17-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-17-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-17-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo thun anime đen nam',
    slug: 'ao-thun-anime-den-nam',
    catSlug: 'ao-thun',
    description: 'Thiết kế cá tính dành cho giới trẻ',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/19437841/pexels-photo-19437841.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-18-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-18-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-18-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo sơ mi hoa ngắn tay',
    slug: 'ao-so-mi-hoa-ngan-tay',
    catSlug: 'ao-so-mi',
    description: 'Phong cách mùa hè nổi bật và trẻ trung',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/2897520/pexels-photo-2897520.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-19-M', stock: 50, price: 250000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-19-L', stock: 50, price: 250000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-19-XL', stock: 50, price: 250000 }
    ]
  },
  {
    name: 'Áo hoodie urban nam',
    slug: 'ao-hoodie-urban-nam',
    catSlug: 'ao-khoac',
    description: 'Chất áo dày vừa phải hợp thời tiết mát',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/33405099/pexels-photo-33405099.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-20-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-20-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-20-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác denim nam đường phố',
    slug: 'ao-khoac-denim-nam-duong-pho',
    catSlug: 'ao-khoac',
    description: 'Phong cách bụi bặm trẻ trung dễ phối',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/29353589/pexels-photo-29353589.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-21-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-21-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-21-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo thun họa tiết màu nổi',
    slug: 'ao-thun-hoa-tiet-mau-noi',
    catSlug: 'ao-thun',
    description: 'Mang phong cách sáng tạo và hiện đại',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/17970937/pexels-photo-17970937.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-22-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-22-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-22-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo sơ mi nam casual',
    slug: 'ao-so-mi-nam-casual',
    catSlug: 'ao-so-mi',
    description: 'Cổ áo gọn gàng phù hợp đi chơi cuối tuần',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/17606178/pexels-photo-17606178.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-23-M', stock: 50, price: 250000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-23-L', stock: 50, price: 250000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-23-XL', stock: 50, price: 250000 }
    ]
  },
  {
    name: 'Áo hoodie đen đường phố',
    slug: 'ao-hoodie-den-duong-pho',
    catSlug: 'ao-khoac',
    description: 'Thiết kế đơn giản hợp phong cách năng động',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/20469812/pexels-photo-20469812.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-24-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-24-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-24-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác da nam cá tính',
    slug: 'ao-khoac-da-nam-ca-tinh',
    catSlug: 'ao-khoac',
    description: 'Tạo vẻ ngoài mạnh mẽ và thời trang',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/31387656/pexels-photo-31387656.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-25-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-25-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-25-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo hoodie đen ngoài trời',
    slug: 'ao-hoodie-den-ngoai-troi',
    catSlug: 'ao-khoac',
    description: 'Form áo thoải mái phù hợp dạo phố',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/35240866/pexels-photo-35240866.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-26-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-26-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-26-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo hoodie city style',
    slug: 'ao-hoodie-city-style',
    catSlug: 'ao-khoac',
    description: 'Thiết kế trẻ trung hợp phong cách hiện đại',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/18657721/pexels-photo-18657721.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-27-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-27-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-27-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác đen urban fashion',
    slug: 'ao-khoac-den-urban-fashion',
    catSlug: 'ao-khoac',
    description: 'Giữ ấm nhẹ và tôn dáng nam tính',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/21656904/pexels-photo-21656904.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-28-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-28-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-28-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo thun nam cận cảnh',
    slug: 'ao-thun-nam-can-canh',
    catSlug: 'ao-thun',
    description: 'Thiết kế basic thích hợp dùng hằng ngày',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/17744884/pexels-photo-17744884.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-29-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-29-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-29-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo thun phối jean nam',
    slug: 'ao-thun-phoi-jean-nam',
    catSlug: 'ao-thun',
    description: 'Phong cách casual đơn giản dễ mặc',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/16794300/pexels-photo-16794300.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-30-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-30-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-30-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo hoodie studio đen',
    slug: 'ao-hoodie-studio-den',
    catSlug: 'ao-khoac',
    description: 'Phong cách cool ngầu hợp chụp lookbook',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/19338727/pexels-photo-19338727.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-31-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-31-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-31-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác nam thành thị',
    slug: 'ao-khoac-nam-thanh-thi',
    catSlug: 'ao-khoac',
    description: 'Thiết kế hiện đại phù hợp thời trang đường phố',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/16053912/pexels-photo-16053912.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-32-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-32-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-32-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo sơ mi trắng nam',
    slug: 'ao-so-mi-trang-nam',
    catSlug: 'ao-so-mi',
    description: 'Hình ảnh sạch sẽ lịch sự và dễ phối',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/18012147/pexels-photo-18012147.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-33-M', stock: 50, price: 250000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-33-L', stock: 50, price: 250000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-33-XL', stock: 50, price: 250000 }
    ]
  },
  {
    name: 'Áo thun đen basic nam',
    slug: 'ao-thun-den-basic-nam',
    catSlug: 'ao-thun',
    description: 'Thiết kế mạnh mẽ và nam tính',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/16628550/pexels-photo-16628550.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-34-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-34-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-34-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo polo nam buổi tối',
    slug: 'ao-polo-nam-buoi-toi',
    catSlug: 'ao-thun',
    description: 'Phong cách lịch sự nhưng vẫn trẻ trung',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/24820835/pexels-photo-24820835.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-35-M', stock: 50, price: 200000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-35-L', stock: 50, price: 200000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-35-XL', stock: 50, price: 200000 }
    ]
  },
  {
    name: 'Áo khoác denim đôi nam',
    slug: 'ao-khoac-denim-doi-nam',
    catSlug: 'ao-khoac',
    description: 'Thích hợp phong cách bạn bè hoặc couple',
    brand: 'FASHION',
    targetGender: 'unisex',
    status: 'active',
    images: ['https://images.pexels.com/photos/12824883/pexels-photo-12824883.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-36-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-36-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-36-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo sơ mi trắng nắng nhẹ',
    slug: 'ao-so-mi-trang-nang-nhe',
    catSlug: 'ao-so-mi',
    description: 'Thiết kế thanh lịch hợp chụp ảnh ngoài trời',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/18703882/pexels-photo-18703882.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-37-M', stock: 50, price: 250000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-37-L', stock: 50, price: 250000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-37-XL', stock: 50, price: 250000 }
    ]
  },
  {
    name: 'Áo sơ mi trắng studio',
    slug: 'ao-so-mi-trang-studio',
    catSlug: 'ao-so-mi',
    description: 'Phong cách tối giản sạch sẽ và hiện đại',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/19895835/pexels-photo-19895835.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-38-M', stock: 50, price: 250000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-38-L', stock: 50, price: 250000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-38-XL', stock: 50, price: 250000 }
    ]
  },
  {
    name: 'Áo thun in hình đen',
    slug: 'ao-thun-in-hinh-den',
    catSlug: 'ao-thun',
    description: 'Thiết kế cá tính hợp phong cách trẻ',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/17894191/pexels-photo-17894191.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-39-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-39-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-39-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo khoác denim cận cảnh',
    slug: 'ao-khoac-denim-can-canh',
    catSlug: 'ao-khoac',
    description: 'Phong cách casual bụi bặm và nam tính',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/5217821/pexels-photo-5217821.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-40-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-40-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-40-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo polo trắng urban',
    slug: 'ao-polo-trang-urban',
    catSlug: 'ao-thun',
    description: 'Phong cách lịch sự tối giản phù hợp đi chơi và đi làm',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/22745628/pexels-photo-22745628.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-41-M', stock: 50, price: 200000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-41-L', stock: 50, price: 200000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-41-XL', stock: 50, price: 200000 }
    ]
  },
  {
    name: 'Áo polo đỏ nổi bật',
    slug: 'ao-polo-do-noi-bat',
    catSlug: 'ao-thun',
    description: 'Màu sắc trẻ trung tạo điểm nhấn mạnh cho outfit',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/11751211/pexels-photo-11751211.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-42-M', stock: 50, price: 200000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-42-L', stock: 50, price: 200000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-42-XL', stock: 50, price: 200000 }
    ]
  },
  {
    name: 'Áo polo đen cá tính',
    slug: 'ao-polo-den-ca-tinh',
    catSlug: 'ao-thun',
    description: 'Thiết kế gọn gàng hợp phong cách hiện đại',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/14370669/pexels-photo-14370669.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-43-M', stock: 50, price: 200000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-43-L', stock: 50, price: 200000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-43-XL', stock: 50, price: 200000 }
    ]
  },
  {
    name: 'Áo khoác hoodie đen cận mặt',
    slug: 'ao-khoac-hoodie-den-can-mat',
    catSlug: 'ao-khoac',
    description: 'Phong cách bí ẩn hợp outfit đường phố',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/36607476/pexels-photo-36607476.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-44-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-44-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-44-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác denim xanh nhạt',
    slug: 'ao-khoac-denim-xanh-nhat',
    catSlug: 'ao-khoac',
    description: 'Casual dễ phối với áo thun trắng hoặc tank top',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/17896496/pexels-photo-17896496.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-45-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-45-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-45-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác denim wash sáng',
    slug: 'ao-khoac-denim-wash-sang',
    catSlug: 'ao-khoac',
    description: 'Phong cách bụi bặm trẻ trung hợp street style',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/5675657/pexels-photo-5675657.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-46-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-46-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-46-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo thun đôi in hình tim',
    slug: 'ao-thun-doi-in-hinh-tim',
    catSlug: 'ao-thun',
    description: 'Thiết kế trẻ trung thích hợp chụp ảnh bạn bè hoặc couple',
    brand: 'FASHION',
    targetGender: 'unisex',
    status: 'active',
    images: ['https://images.pexels.com/photos/17399226/pexels-photo-17399226.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-47-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-47-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-47-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo thun đen casual nam',
    slug: 'ao-thun-den-casual-nam',
    catSlug: 'ao-thun',
    description: 'Kiểu dáng đơn giản dễ mặc hằng ngày',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/10690918/pexels-photo-10690918.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-48-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-48-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-48-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo thun xám chụp studio',
    slug: 'ao-thun-xam-chup-studio',
    catSlug: 'ao-thun',
    description: 'Phong cách tối giản hợp outfit hiện đại',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/12661581/pexels-photo-12661581.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-49-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-49-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-49-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo thun oversize navy',
    slug: 'ao-thun-oversize-navy',
    catSlug: 'ao-thun',
    description: 'Form rộng mang cảm giác thoải mái và thời trang',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/13651809/pexels-photo-13651809.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-50-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-50-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-50-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo thun nhóm basic',
    slug: 'ao-thun-nhom-basic',
    catSlug: 'ao-thun',
    description: 'Tông màu đen trắng dễ ứng dụng cho lookbook sản phẩm',
    brand: 'FASHION',
    targetGender: 'unisex',
    status: 'active',
    images: ['https://images.pexels.com/photos/15576197/pexels-photo-15576197.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-51-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-51-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-51-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo thun graphic đen chữ lớn',
    slug: 'ao-thun-graphic-den-chu-lon',
    catSlug: 'ao-thun',
    description: 'Họa tiết in trước ngực nổi bật và cá tính',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/37043496/pexels-photo-37043496.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-52-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-52-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-52-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo thun đen streetwear',
    slug: 'ao-thun-den-streetwear',
    catSlug: 'ao-thun',
    description: 'Phong cách khỏe khoắn hợp jean và sneaker',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/27348257/pexels-photo-27348257.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-53-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-53-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-53-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo thun đen in hình nghệ thuật',
    slug: 'ao-thun-den-in-hinh-nghe-thuat',
    catSlug: 'ao-thun',
    description: 'Thiết kế sáng tạo dành cho phong cách trẻ',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/36942018/pexels-photo-36942018.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-54-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-54-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-54-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo thun trắng in hình màu',
    slug: 'ao-thun-trang-in-hinh-mau',
    catSlug: 'ao-thun',
    description: 'Chất áo basic kết hợp họa tiết vui nhộn nổi bật',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/37025819/pexels-photo-37025819.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-55-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-55-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-55-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo thun trắng ngoài trời',
    slug: 'ao-thun-trang-ngoai-troi',
    catSlug: 'ao-thun',
    description: 'Hình ảnh nhẹ nhàng hợp phong cách mùa hè',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/9157771/pexels-photo-9157771.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-56-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-56-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-56-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo hoodie hồng dusty',
    slug: 'ao-hoodie-hong-dusty',
    catSlug: 'ao-khoac',
    description: 'Form trẻ trung hợp phong cách năng động',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/11202108/pexels-photo-11202108.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-57-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-57-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-57-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo hoodie đỏ rượu',
    slug: 'ao-hoodie-do-ruou',
    catSlug: 'ao-khoac',
    description: 'Cá tính mạnh phù hợp chụp lookbook streetwear',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/10890048/pexels-photo-10890048.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-58-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-58-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-58-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo hoodie xanh rêu',
    slug: 'ao-hoodie-xanh-reu',
    catSlug: 'ao-khoac',
    description: 'Giữ ấm tốt và phù hợp mặc thường ngày',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/36044003/pexels-photo-36044003.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-59-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-59-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-59-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo hoodie nâu trơn',
    slug: 'ao-hoodie-nau-tron',
    catSlug: 'ao-khoac',
    description: 'Thiết kế tối giản dễ phối nhiều kiểu quần',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/31670079/pexels-photo-31670079.png'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-60-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-60-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-60-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo hoodie đen mùa đông',
    slug: 'ao-hoodie-den-mua-dong',
    catSlug: 'ao-khoac',
    description: 'Phong cách ngoài trời mạnh mẽ và lạnh tông',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/11317539/pexels-photo-11317539.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-61-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-61-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-61-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo hoodie trắng basic',
    slug: 'ao-hoodie-trang-basic',
    catSlug: 'ao-khoac',
    description: 'Thiết kế sạch sẽ phù hợp ảnh sản phẩm studio',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/8217416/pexels-photo-8217416.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-62-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-62-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-62-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo hoodie xám sáng',
    slug: 'ao-hoodie-xam-sang',
    catSlug: 'ao-khoac',
    description: 'Phong cách đơn giản phù hợp mặc dạo phố',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/5319493/pexels-photo-5319493.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-63-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-63-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-63-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo hoodie trắng nền hồng',
    slug: 'ao-hoodie-trang-nen-hong',
    catSlug: 'ao-khoac',
    description: 'Hình ảnh nổi bật hợp phong cách trẻ trung',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/6974969/pexels-photo-6974969.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-64-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-64-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-64-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo hoodie đen urban close-up',
    slug: 'ao-hoodie-den-urban-closeup',
    catSlug: 'ao-khoac',
    description: 'Cận cảnh mạnh mẽ hợp banner thời trang nam',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/5319514/pexels-photo-5319514.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-65-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-65-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-65-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác denim đồng cỏ',
    slug: 'ao-khoac-denim-dong-co',
    catSlug: 'ao-khoac',
    description: 'Phong cách vintage nhẹ phù hợp outfit casual',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/15637835/pexels-photo-15637835.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-66-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-66-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-66-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác denim có mũ',
    slug: 'ao-khoac-denim-co-mu',
    catSlug: 'ao-khoac',
    description: 'Thiết kế lạ mắt kết hợp chất streetwear hiện đại',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/28638566/pexels-photo-28638566.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-67-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-67-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-67-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác denim nhóm mẫu',
    slug: 'ao-khoac-denim-nhom-mau',
    catSlug: 'ao-khoac',
    description: 'Ảnh thời trang phù hợp làm sản phẩm bộ sưu tập',
    brand: 'FASHION',
    targetGender: 'unisex',
    status: 'active',
    images: ['https://images.pexels.com/photos/6770027/pexels-photo-6770027.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-68-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-68-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-68-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác denim cận ngực',
    slug: 'ao-khoac-denim-can-nguc',
    catSlug: 'ao-khoac',
    description: 'Chất liệu jean sáng dễ dùng cho trang danh mục',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/17896486/pexels-photo-17896486.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-69-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-69-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-69-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác denim nhóm xanh',
    slug: 'ao-khoac-denim-nhom-xanh',
    catSlug: 'ao-khoac',
    description: 'Phù hợp trưng bày lookbook unisex',
    brand: 'FASHION',
    targetGender: 'unisex',
    status: 'active',
    images: ['https://images.pexels.com/photos/6770036/pexels-photo-6770036.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-70-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-70-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-70-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác denim treo móc',
    slug: 'ao-khoac-denim-treo-moc',
    catSlug: 'ao-khoac',
    description: 'Ảnh flatlay đẹp phù hợp trang chi tiết sản phẩm',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/13662420/pexels-photo-13662420.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-71-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-71-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-71-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác denim xanh phối đôi',
    slug: 'ao-khoac-denim-xanh-phoi-doi',
    catSlug: 'ao-khoac',
    description: 'Chất jean sáng trẻ trung hợp outfit hiện đại',
    brand: 'FASHION',
    targetGender: 'unisex',
    status: 'active',
    images: ['https://images.pexels.com/photos/6769357/pexels-photo-6769357.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-72-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-72-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-72-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác denim đen nam',
    slug: 'ao-khoac-denim-den-nam',
    catSlug: 'ao-khoac',
    description: 'Tạo vẻ ngoài cá tính và mạnh mẽ',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/14584497/pexels-photo-14584497.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-73-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-73-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-73-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo polo đen nữ basic',
    slug: 'ao-polo-den-nu-basic',
    catSlug: 'ao-thun',
    description: 'Dáng polo tối giản phù hợp catalog thời trang',
    brand: 'FASHION',
    targetGender: 'women',
    status: 'active',
    images: ['https://images.pexels.com/photos/16048133/pexels-photo-16048133.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-74-M', stock: 50, price: 200000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-74-L', stock: 50, price: 200000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-74-XL', stock: 50, price: 200000 }
    ]
  },
  {
    name: 'Áo polo olive nam',
    slug: 'ao-polo-olive-nam',
    catSlug: 'ao-thun',
    description: 'Phong cách trưởng thành lịch sự nhưng vẫn trẻ',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/21286442/pexels-photo-21286442.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-75-M', stock: 50, price: 200000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-75-L', stock: 50, price: 200000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-75-XL', stock: 50, price: 200000 }
    ]
  },
  {
    name: 'Áo polo trắng trẻ em',
    slug: 'ao-polo-trang-tre-em',
    catSlug: 'ao-thun',
    description: 'Hình ảnh sạch sẽ phù hợp danh mục polo trắng',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/11807005/pexels-photo-11807005.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-76-M', stock: 50, price: 200000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-76-L', stock: 50, price: 200000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-76-XL', stock: 50, price: 200000 }
    ]
  },
  {
    name: 'Áo polo xanh nhạt',
    slug: 'ao-polo-xanh-nhat',
    catSlug: 'ao-thun',
    description: 'Thiết kế thoải mái phù hợp đi chơi ngoài trời',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/25261567/pexels-photo-25261567.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-77-M', stock: 50, price: 200000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-77-L', stock: 50, price: 200000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-77-XL', stock: 50, price: 200000 }
    ]
  },
  {
    name: 'Áo thun đỏ đô nam',
    slug: 'ao-thun-do-do-nam',
    catSlug: 'ao-thun',
    description: 'Màu sắc nổi bật hợp phong cách casual',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/28179205/pexels-photo-28179205.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-78-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-78-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-78-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo hoodie tay ngắn xanh mint',
    slug: 'ao-hoodie-tay-ngan-xanh-mint',
    catSlug: 'ao-khoac',
    description: 'Kiểu dáng mới lạ phù hợp thời trang trẻ',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/16646931/pexels-photo-16646931.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-79-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-79-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-79-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo thun đen phối quần vàng',
    slug: 'ao-thun-den-phoi-quan-vang',
    catSlug: 'ao-thun',
    description: 'Họa tiết nghệ thuật giúp outfit nổi bật hơn',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/18870456/pexels-photo-18870456.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-80-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-80-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-80-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo hoodie đen urban mới',
    slug: 'ao-hoodie-den-urban-moi',
    catSlug: 'ao-khoac',
    description: 'Phong cách đường phố mạnh mẽ phù hợp lookbook nam',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/32430590/pexels-photo-32430590.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-81-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-81-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-81-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo thun graphic đôi mới',
    slug: 'ao-thun-graphic-doi-moi',
    catSlug: 'ao-thun',
    description: 'Thiết kế nổi bật hợp phong cách streetwear hiện đại',
    brand: 'FASHION',
    targetGender: 'unisex',
    status: 'active',
    images: ['https://images.pexels.com/photos/28870062/pexels-photo-28870062.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-82-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-82-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-82-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo khoác denim nghệ thuật',
    slug: 'ao-khoac-denim-nghe-thuat',
    catSlug: 'ao-khoac',
    description: 'Phong cách cá tính phù hợp outfit nổi bật',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/34112008/pexels-photo-34112008.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-83-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-83-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-83-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo hoodie studio nhóm',
    slug: 'ao-hoodie-studio-nhom',
    catSlug: 'ao-khoac',
    description: 'Form trẻ trung hợp ảnh banner thời trang',
    brand: 'FASHION',
    targetGender: 'unisex',
    status: 'active',
    images: ['https://images.pexels.com/photos/19461584/pexels-photo-19461584.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-84-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-84-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-84-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác denim nữ hiện đại',
    slug: 'ao-khoac-denim-nu-hien-dai',
    catSlug: 'ao-khoac',
    description: 'Thiết kế trẻ trung dễ phối quần jean hoặc chân váy',
    brand: 'FASHION',
    targetGender: 'women',
    status: 'active',
    images: ['https://images.pexels.com/photos/31096723/pexels-photo-31096723.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-85-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-85-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-85-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác denim nữ cá tính',
    slug: 'ao-khoac-denim-nu-ca-tinh',
    catSlug: 'ao-khoac',
    description: 'Phong cách thời trang studio sáng tạo và hiện đại',
    brand: 'FASHION',
    targetGender: 'women',
    status: 'active',
    images: ['https://images.pexels.com/photos/33641950/pexels-photo-33641950.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-86-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-86-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-86-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác denim nữ tối giản',
    slug: 'ao-khoac-denim-nu-toi-gian',
    catSlug: 'ao-khoac',
    description: 'Chất jean đẹp phù hợp chụp catalog thời trang',
    brand: 'FASHION',
    targetGender: 'women',
    status: 'active',
    images: ['https://images.pexels.com/photos/31502132/pexels-photo-31502132.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-87-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-87-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-87-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác denim nam kính đen',
    slug: 'ao-khoac-denim-nam-kinh-den',
    catSlug: 'ao-khoac',
    description: 'Phong cách bụi bặm hiện đại hợp street style',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/30090049/pexels-photo-30090049.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-88-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-88-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-88-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác denim beanie',
    slug: 'ao-khoac-denim-beanie',
    catSlug: 'ao-khoac',
    description: 'Phong cách casual ngoài trời trẻ trung và năng động',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/19738592/pexels-photo-19738592.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-89-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-89-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-89-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo khoác denim nền nghệ thuật',
    slug: 'ao-khoac-denim-nen-nghe-thuat',
    catSlug: 'ao-khoac',
    description: 'Thiết kế nổi bật phù hợp ảnh đại diện sản phẩm',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/36750689/pexels-photo-36750689.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-90-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-90-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-90-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo hoodie trắng urban',
    slug: 'ao-hoodie-trang-urban',
    catSlug: 'ao-khoac',
    description: 'Phong cách năng động hợp outfit dạo phố',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/32940212/pexels-photo-32940212.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-91-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-91-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-91-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo thun graphic chân dung',
    slug: 'ao-thun-graphic-chan-dung',
    catSlug: 'ao-thun',
    description: 'Thiết kế cá tính dành cho phong cách trẻ',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/35074493/pexels-photo-35074493.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-92-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-92-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-92-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo khoác denim nền đỏ',
    slug: 'ao-khoac-denim-nen-do',
    catSlug: 'ao-khoac',
    description: 'Ảnh sản phẩm nổi bật phù hợp trang chi tiết',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/36740121/pexels-photo-36740121.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-93-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-93-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-93-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo polo nam kính mát',
    slug: 'ao-polo-nam-kinh-mat',
    catSlug: 'ao-thun',
    description: 'Phong cách lịch sự trẻ trung phù hợp mùa hè',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/29381847/pexels-photo-29381847.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-94-M', stock: 50, price: 200000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-94-L', stock: 50, price: 200000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-94-XL', stock: 50, price: 200000 }
    ]
  },
  {
    name: 'Áo thun bold street style',
    slug: 'ao-thun-bold-street-style',
    catSlug: 'ao-thun',
    description: 'Họa tiết đậm chất urban thích hợp giới trẻ',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/31959041/pexels-photo-31959041.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-95-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-95-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-95-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo hoodie xanh navy nữ',
    slug: 'ao-hoodie-xanh-navy-nu',
    catSlug: 'ao-khoac',
    description: 'Thiết kế trẻ trung phù hợp phong cách năng động',
    brand: 'FASHION',
    targetGender: 'women',
    status: 'active',
    images: ['https://images.pexels.com/photos/33934070/pexels-photo-33934070.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-96-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-96-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-96-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo polo phối khoác ngoài',
    slug: 'ao-polo-phoi-khoac-ngoai',
    catSlug: 'ao-thun',
    description: 'Dáng polo gọn gàng mang vẻ lịch lãm hiện đại',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/15791596/pexels-photo-15791596.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-97-M', stock: 50, price: 200000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-97-L', stock: 50, price: 200000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-97-XL', stock: 50, price: 200000 }
    ]
  },
  {
    name: 'Áo thun nữ basic mới',
    slug: 'ao-thun-nu-basic-moi',
    catSlug: 'ao-thun',
    description: 'Phong cách đơn giản dễ dùng cho danh mục casual',
    brand: 'FASHION',
    targetGender: 'women',
    status: 'active',
    images: ['https://images.pexels.com/photos/17221305/pexels-photo-17221305.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-98-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-98-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-98-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Áo khoác denim nữ xuống phố',
    slug: 'ao-khoac-denim-nu-xuong-pho',
    catSlug: 'ao-khoac',
    description: 'Thiết kế thanh lịch hợp phong cách thành thị',
    brand: 'FASHION',
    targetGender: 'women',
    status: 'active',
    images: ['https://images.pexels.com/photos/18672951/pexels-photo-18672951.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-99-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-99-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-99-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Áo thun nữ graphic cá tính',
    slug: 'ao-thun-nu-graphic-ca-tinh',
    catSlug: 'ao-thun',
    description: 'Hình ảnh trẻ trung phù hợp bộ sưu tập streetwear',
    brand: 'FASHION',
    targetGender: 'women',
    status: 'active',
    images: ['https://images.pexels.com/photos/15207275/pexels-photo-15207275.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-100-M', stock: 50, price: 150000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-100-L', stock: 50, price: 150000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-100-XL', stock: 50, price: 150000 }
    ]
  },
  {
    name: 'Quần jean xanh nam basic',
    slug: 'quan-jean-xanh-nam-basic',
    catSlug: 'quan-jeans',
    description: 'Form casual dễ phối áo thun và sơ mi',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/12631626/pexels-photo-12631626.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-101-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-101-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-101-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Quần jogger đỏ thể thao',
    slug: 'quan-jogger-do-the-thao',
    catSlug: 'quan-jeans',
    description: 'Kiểu dáng năng động phù hợp phong cách streetwear',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/6075888/pexels-photo-6075888.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-102-M', stock: 50, price: 250000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-102-L', stock: 50, price: 250000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-102-XL', stock: 50, price: 250000 }
    ]
  },
  {
    name: 'Quần cargo nam urban',
    slug: 'quan-cargo-nam-urban',
    catSlug: 'quan-jeans',
    description: 'Nhiều túi tiện dụng hợp outfit cá tính',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/21050246/pexels-photo-21050246.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-103-M', stock: 50, price: 250000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-103-L', stock: 50, price: 250000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-103-XL', stock: 50, price: 250000 }
    ]
  },
  {
    name: 'Quần sweatpants xếp gọn',
    slug: 'quan-sweatpants-xep-gon',
    catSlug: 'quan-jeans',
    description: 'Phù hợp danh mục quần nỉ hoặc ảnh flatlay sản phẩm',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/31961165/pexels-photo-31961165.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-104-M', stock: 50, price: 250000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-104-L', stock: 50, price: 250000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-104-XL', stock: 50, price: 250000 }
    ]
  },
  {
    name: 'Quần jean đen nam street',
    slug: 'quan-jean-den-nam-street',
    catSlug: 'quan-jeans',
    description: 'Phong cách đơn giản mạnh mẽ dễ mặc hằng ngày',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/5004034/pexels-photo-5004034.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-105-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-105-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-105-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Quần jogger đen thể thao',
    slug: 'quan-jogger-den-the-thao',
    catSlug: 'quan-jeans',
    description: 'Thiết kế trẻ trung hợp đi chơi và vận động nhẹ',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/5554464/pexels-photo-5554464.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-106-M', stock: 50, price: 250000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-106-L', stock: 50, price: 250000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-106-XL', stock: 50, price: 250000 }
    ]
  },
  {
    name: 'Quần cargo đen phối hoodie',
    slug: 'quan-cargo-den-phoi-hoodie',
    catSlug: 'quan-jeans',
    description: 'Phong cách hiện đại phù hợp lookbook nam',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/19392459/pexels-photo-19392459.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-107-M', stock: 50, price: 250000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-107-L', stock: 50, price: 250000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-107-XL', stock: 50, price: 250000 }
    ]
  },
  {
    name: 'Quần nỉ đen logo chữ',
    slug: 'quan-ni-den-logo-chu',
    catSlug: 'quan-jeans',
    description: 'Hình ảnh nổi bật phù hợp danh mục sweatpants',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/31220247/pexels-photo-31220247.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-108-M', stock: 50, price: 250000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-108-L', stock: 50, price: 250000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-108-XL', stock: 50, price: 250000 }
    ]
  },
  {
    name: 'Quần jean xám nam',
    slug: 'quan-jean-xam-nam',
    catSlug: 'quan-jeans',
    description: 'Thiết kế basic dễ dùng cho trang sản phẩm casual',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['https://images.pexels.com/photos/7651593/pexels-photo-7651593.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-109-M', stock: 50, price: 350000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-109-L', stock: 50, price: 350000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-109-XL', stock: 50, price: 350000 }
    ]
  },
  {
    name: 'Quần cargo nữ form rộng',
    slug: 'quan-cargo-nu-form-rong',
    catSlug: 'quan-jeans',
    description: 'Phong cách cá tính hợp street style hiện đại',
    brand: 'FASHION',
    targetGender: 'women',
    status: 'active',
    images: ['https://images.pexels.com/photos/5366340/pexels-photo-5366340.jpeg'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: 'PROD-110-M', stock: 50, price: 250000 },
      { size: 'L', color: 'Mặc định', sku: 'PROD-110-L', stock: 50, price: 250000 },
      { size: 'XL', color: 'Mặc định', sku: 'PROD-110-XL', stock: 50, price: 250000 }
    ]
  }
];

const seedData = async (options = {}) => {
  const {
    connect = true,
    close = true,
    reset = true,
    skipIfHasData = false,
    exitOnFinish = false,
  } = options;

  try {
    const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://khoilam3789_db_user:jERR73m7b3ZYEF1m@cluster0.lfdp1y7.mongodb.net/fashion_store';
    if (connect) {
      await mongoose.connect(MONGO_URI);
      console.log('MongoDB Connected for Seeding...');
    }

    if (skipIfHasData) {
      const productCount = await Product.countDocuments({});
      if (productCount > 0) {
        console.log('Database already has data. Skip seeding.');
        if (close && connect) await mongoose.connection.close();
        if (exitOnFinish) process.exit(0);
        return { seeded: false, reason: 'already-has-data' };
      }
    }

    if (reset) {
      // Clean DB
      console.log('Cleaning database...');
      await User.deleteMany({});
      await Category.deleteMany({});
      await Product.deleteMany({});
      await ProductVariant.deleteMany({});
      await BehaviorLog.deleteMany({});
      await Address.deleteMany({});
    }
    
    // 1. Seed Users
    console.log('Seeding Users...');
    const createdUsers = [];
    for (const u of usersData) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      const user = await User.create({
        ...u,
        passwordHash: hashedPassword,
      });
      createdUsers.push(user);
    }
    
    const customerId = createdUsers[1]._id;

    // Create an Address for John Customer
    await Address.create({
      userId: customerId,
      fullName: 'John Customer',
      phone: '0987654321',
      street: '123 Fake Street',
      ward: 'Ward 1',
      district: 'District 1',
      cityProvince: 'Ho Chi Minh',
      isDefault: true
    });

    // 2. Seed Categories
    console.log('Seeding Categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    
    // Helper function to find category ID by slug
    const getCatId = (slug) => createdCategories.find(c => c.slug === slug)._id;

    // 3. Seed Products & Variants
    console.log('Seeding Products and Variants...');
    const createdProducts = [];
    for (const p of productsData) {
      const product = await Product.create({
        name: p.name,
        slug: p.slug,
        categoryId: getCatId(p.catSlug),
        description: p.description,
        brand: p.brand,
        targetGender: p.targetGender,
        status: p.status,
        images: p.images
      });
      createdProducts.push(product);

      for (const v of p.variants) {
        await ProductVariant.create({
          productId: product._id,
          size: v.size,
          color: v.color,
          sku: v.sku,
          stock: v.stock,
          price: v.price,
          image: p.images[0]
        });
      }
    }

    // 4. Seed Behavior Logs (AI logic demo)
    // Giả sử customer đã xem Áo sơ mi nam, áo thun oversize nam
    console.log('Seeding Behavior Logs...');
    const shirt = createdProducts.find(p => p.slug === 'ao-so-mi-oxford');
    const oversize = createdProducts.find(p => p.slug === 'ao-thun-oversize-streetwear');
    const basicT = createdProducts.find(p => p.slug === 'ao-thun-basic-cotton');
    
    if (shirt) {
        await BehaviorLog.create({ userId: customerId, productId: shirt._id, eventType: 'view' });
        await BehaviorLog.create({ userId: customerId, productId: shirt._id, eventType: 'add_to_cart' });
    }
    if (oversize) {
        await BehaviorLog.create({ userId: customerId, productId: oversize._id, eventType: 'view' });
    }
    if (basicT) {
        await BehaviorLog.create({ userId: createdUsers[2]._id, productId: basicT._id, eventType: 'purchase' });
    }

    console.log('Data Seeding Successful!');
    if (close && connect) await mongoose.connection.close();
    if (exitOnFinish) process.exit(0);
    return { seeded: true };
  } catch (error) {
    console.error(`Error with Seeding Data: ${error.message}`);
    if (close && connect) {
      try {
        await mongoose.connection.close();
      } catch (closeError) {
        console.error(`Error closing connection: ${closeError.message}`);
      }
    }
    if (exitOnFinish) process.exit(1);
    throw error;
  }
};

if (require.main === module) {
  seedData({ connect: true, close: true, reset: true, exitOnFinish: true });
}

module.exports = { seedData };
