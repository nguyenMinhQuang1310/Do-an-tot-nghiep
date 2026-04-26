const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: 'src/.env' });
dotenv.config();

const Product = require('./src/models/Product');
const ProductVariant = require('./src/models/ProductVariant');
const Category = require('./src/models/Category');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://khoilam3789_db_user:jERR73m7b3ZYEF1m@cluster0.lfdp1y7.mongodb.net/fashion_store';

const csvData = `ten_san_pham,mo_ta,kieu_quan,phan_loai,url_anh
Quần jean xanh nam basic,Form casual dễ phối áo thun và sơ mi,Quần dài,Jeans,https://images.pexels.com/photos/12631626/pexels-photo-12631626.jpeg
Quần jogger đỏ thể thao,Kiểu dáng năng động phù hợp phong cách streetwear,Quần dài,Jogger,https://images.pexels.com/photos/6075888/pexels-photo-6075888.jpeg
Quần cargo nam urban,Nhiều túi tiện dụng hợp outfit cá tính,Quần dài,Cargo pants,https://images.pexels.com/photos/21050246/pexels-photo-21050246.jpeg
Quần sweatpants xếp gọn,Phù hợp danh mục quần nỉ hoặc ảnh flatlay sản phẩm,Quần dài,Sweatpants,https://images.pexels.com/photos/31961165/pexels-photo-31961165.jpeg
Quần jean đen nam street,Phong cách đơn giản mạnh mẽ dễ mặc hằng ngày,Quần dài,Jeans,https://images.pexels.com/photos/5004034/pexels-photo-5004034.jpeg
Quần jogger đen thể thao,Thiết kế trẻ trung hợp đi chơi và vận động nhẹ,Quần dài,Jogger,https://images.pexels.com/photos/5554464/pexels-photo-5554464.jpeg
Quần cargo đen phối hoodie,Phong cách hiện đại phù hợp lookbook nam,Quần dài,Cargo pants,https://images.pexels.com/photos/19392459/pexels-photo-19392459.jpeg
Quần nỉ đen logo chữ,Hình ảnh nổi bật phù hợp danh mục sweatpants,Quần dài,Sweatpants,https://images.pexels.com/photos/31220247/pexels-photo-31220247.jpeg
Quần jean xám nam,Thiết kế basic dễ dùng cho trang sản phẩm casual,Quần dài,Jeans,https://images.pexels.com/photos/7651593/pexels-photo-7651593.jpeg
Quần cargo nữ form rộng,Phong cách cá tính hợp street style hiện đại,Quần dài,Cargo pants,https://images.pexels.com/photos/5366340/pexels-photo-5366340.jpeg`;

const lines = csvData.trim().split("\n");
lines.shift(); // remove header

const catMapping = {
  'Jeans': 'quan-jeans',
  'Jogger': 'quan-jeans',
  'Cargo pants': 'quan-jeans',
  'Sweatpants': 'quan-jeans'
};

const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd');
};

const productsToInsert = lines.map((line, index) => {
  const parts = line.split(',');
  const name = parts[0].trim();
  const description = parts[1].trim();
  const kieu = parts[2].trim();
  const type_name = parts[3].trim();
  const image = parts.slice(4).join(',').trim();

  let slug = removeAccents(name).replace(/[^a-z0-9 +]/g, '').replace(/ +/g, '-');
  const catSlug = catMapping[type_name] || 'quan-jeans';
  
  let price = 250000;
  if(type_name === 'Jeans') price = 350000;

  // Gender
  let newGender = 'men';
  let nameLower = name.toLowerCase();
  let descLower = description.toLowerCase();
  if (nameLower.includes('nữ') || descLower.includes('nữ')) {
      newGender = 'women';
  } else if (nameLower.includes('đôi') || nameLower.includes('nhóm') || nameLower.includes('unisex') || descLower.includes('đôi') || descLower.includes('nhóm') || descLower.includes('unisex')) {
      newGender = 'unisex';
  }

  // Prev had 100 prod, so index + 101
  let skuBase = `PROD-${index + 101}`;

  return {
    rawName: name,
    slug: slug,
    catSlug: catSlug,
    description: description,
    brand: 'FASHION',
    targetGender: newGender,
    status: 'active',
    images: [image],
    price: price,
    skuBase: skuBase,
    variantsDef: [
      `      { size: 'M', color: 'Mặc định', sku: '${skuBase}-M', stock: 50, price: ${price} }`,
      `      { size: 'L', color: 'Mặc định', sku: '${skuBase}-L', stock: 50, price: ${price} }`,
      `      { size: 'XL', color: 'Mặc định', sku: '${skuBase}-XL', stock: 50, price: ${price} }`
    ]
  };
});

// Update seed.js
let seedContent = fs.readFileSync('src/seed.js', 'utf-8');
const regex = /(const productsData = \[\s*[\s\S]*?)(\n\];)/m;
if (regex.test(seedContent)) {
  const codeProducts = productsToInsert.map(p => {
    return `  {
    name: '${p.rawName}',
    slug: '${p.slug}',
    catSlug: '${p.catSlug}',
    description: '${p.description}',
    brand: 'FASHION',
    targetGender: '${p.targetGender}',
    status: 'active',
    images: ['${p.images[0]}'],
    variants: [
${p.variantsDef.join(',\n')}
    ]
  }`;
  });
  
  const newProductsStr = ',\n' + codeProducts.join(',\n');
  const newContent = seedContent.replace(regex, '$1' + newProductsStr + '$2');
  fs.writeFileSync('src/seed.js', newContent);
  console.log('Successfully appended more products to seed.js');
}

// Update DB directly to preserve Orders
const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Fetch existing categories
    const categories = await Category.find({});
    const getCatId = (slug) => categories.find(c => c.slug === slug)?._id;

    let added = 0;
    for (const p of productsToInsert) {
      const existingProduct = await Product.findOne({ slug: p.slug });
      if (existingProduct) {
        console.log(`Product ${p.slug} already exists. Skipping.`);
        continue;
      }
      
      const newProd = await Product.create({
        name: p.rawName,
        slug: p.slug,
        categoryId: getCatId(p.catSlug) || categories[0]._id, // fallback
        description: p.description,
        brand: p.brand,
        targetGender: p.targetGender,
        status: p.status,
        images: p.images
      });

      // Variants
      const sizes = ['M', 'L', 'XL'];
      for (const size of sizes) {
        await ProductVariant.create({
          productId: newProd._id,
          size: size,
          color: 'Mặc định',
          sku: `${p.skuBase}-${size}`,
          stock: 50,
          price: p.price,
          image: p.images[0]
        });
      }
      added++;
    }

    console.log(`Successfully inserted ${added} new products to DB directly.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

run();
