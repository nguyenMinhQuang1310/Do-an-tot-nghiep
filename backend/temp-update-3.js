const fs = require('fs');

const csvData = `ten_san_pham,mo_ta,kieu_ao,phan_loai,url_anh
Áo hoodie đen urban mới,Phong cách đường phố mạnh mẽ phù hợp lookbook nam,Áo dài tay,Hoodie,https://images.pexels.com/photos/32430590/pexels-photo-32430590.jpeg
Áo thun graphic đôi mới,Thiết kế nổi bật hợp phong cách streetwear hiện đại,Áo cộc,Graphic T-shirt,https://images.pexels.com/photos/28870062/pexels-photo-28870062.jpeg
Áo khoác denim nghệ thuật,Phong cách cá tính phù hợp outfit nổi bật,Áo khoác,Jacket denim,https://images.pexels.com/photos/34112008/pexels-photo-34112008.jpeg
Áo hoodie studio nhóm,Form trẻ trung hợp ảnh banner thời trang,Áo dài tay,Hoodie,https://images.pexels.com/photos/19461584/pexels-photo-19461584.jpeg
Áo khoác denim nữ hiện đại,Thiết kế trẻ trung dễ phối quần jean hoặc chân váy,Áo khoác,Jacket denim,https://images.pexels.com/photos/31096723/pexels-photo-31096723.jpeg
Áo khoác denim nữ cá tính,Phong cách thời trang studio sáng tạo và hiện đại,Áo khoác,Jacket denim,https://images.pexels.com/photos/33641950/pexels-photo-33641950.jpeg
Áo khoác denim nữ tối giản,Chất jean đẹp phù hợp chụp catalog thời trang,Áo khoác,Jacket denim,https://images.pexels.com/photos/31502132/pexels-photo-31502132.jpeg
Áo khoác denim nam kính đen,Phong cách bụi bặm hiện đại hợp street style,Áo khoác,Jacket denim,https://images.pexels.com/photos/30090049/pexels-photo-30090049.jpeg
Áo khoác denim beanie,Phong cách casual ngoài trời trẻ trung và năng động,Áo khoác,Jacket denim,https://images.pexels.com/photos/19738592/pexels-photo-19738592.jpeg
Áo khoác denim nền nghệ thuật,Thiết kế nổi bật phù hợp ảnh đại diện sản phẩm,Áo khoác,Jacket denim,https://images.pexels.com/photos/36750689/pexels-photo-36750689.jpeg
Áo hoodie trắng urban,Phong cách năng động hợp outfit dạo phố,Áo dài tay,Hoodie,https://images.pexels.com/photos/32940212/pexels-photo-32940212.jpeg
Áo thun graphic chân dung,Thiết kế cá tính dành cho phong cách trẻ,Áo cộc,Graphic T-shirt,https://images.pexels.com/photos/35074493/pexels-photo-35074493.jpeg
Áo khoác denim nền đỏ,Ảnh sản phẩm nổi bật phù hợp trang chi tiết,Áo khoác,Jacket denim,https://images.pexels.com/photos/36740121/pexels-photo-36740121.jpeg
Áo polo nam kính mát,Phong cách lịch sự trẻ trung phù hợp mùa hè,Áo cộc,Polo,https://images.pexels.com/photos/29381847/pexels-photo-29381847.jpeg
Áo thun bold street style,Họa tiết đậm chất urban thích hợp giới trẻ,Áo cộc,Graphic T-shirt,https://images.pexels.com/photos/31959041/pexels-photo-31959041.jpeg
Áo hoodie xanh navy nữ,Thiết kế trẻ trung phù hợp phong cách năng động,Áo dài tay,Hoodie,https://images.pexels.com/photos/33934070/pexels-photo-33934070.jpeg
Áo polo phối khoác ngoài,Dáng polo gọn gàng mang vẻ lịch lãm hiện đại,Áo cộc,Polo,https://images.pexels.com/photos/15791596/pexels-photo-15791596.jpeg
Áo thun nữ basic mới,Phong cách đơn giản dễ dùng cho danh mục casual,Áo cộc,T-shirt,https://images.pexels.com/photos/17221305/pexels-photo-17221305.jpeg
Áo khoác denim nữ xuống phố,Thiết kế thanh lịch hợp phong cách thành thị,Áo khoác,Jacket denim,https://images.pexels.com/photos/18672951/pexels-photo-18672951.jpeg
Áo thun nữ graphic cá tính,Hình ảnh trẻ trung phù hợp bộ sưu tập streetwear,Áo cộc,Graphic T-shirt,https://images.pexels.com/photos/15207275/pexels-photo-15207275.jpeg`;

const lines = csvData.trim().split("\n");
lines.shift(); // remove header

const catMapping = {
  'T-shirt': 'ao-thun',
  'Polo': 'ao-thun',
  'Hoodie': 'ao-khoac',
  'Oversize T-shirt': 'ao-thun',
  'Graphic T-shirt': 'ao-thun',
  'Sơ mi': 'ao-so-mi',
  'Jacket': 'ao-khoac',
  'Sơ mi hoa': 'ao-so-mi',
  'Jacket denim': 'ao-khoac',
  'Leather jacket': 'ao-khoac',
  'Sơ mi trắng': 'ao-so-mi'
};

const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd');
};

const products = lines.map((line, index) => {
  const parts = line.split(',');
  const name = parts[0].trim();
  const description = parts[1].trim();
  const kieu = parts[2].trim();
  const type_name = parts[3].trim();
  // We use slice in case there are commas in the URL (rare, but possible)
  const image = parts.slice(4).join(',').trim();

  let slug = removeAccents(name).replace(/[^a-z0-9 +]/g, '').replace(/ +/g, '-');
  const catSlug = catMapping[type_name] || 'ao-thun';
  
  let price = 150000;
  if(type_name === 'Polo') price = 200000;
  if(type_name.includes('Sơ mi')) price = 250000;
  if(type_name.includes('Hoodie') || type_name.includes('Jacket')) price = 350000;

  // Since we already have 80 items, new index starts at 81
  let skuBase = `PROD-${index + 81}`;

  return `  {
    name: '${name}',
    slug: '${slug}',
    catSlug: '${catSlug}',
    description: '${description}',
    brand: 'FASHION',
    targetGender: 'men',
    status: 'active',
    images: ['${image}'],
    variants: [
      { size: 'M', color: 'Mặc định', sku: '${skuBase}-M', stock: 50, price: ${price} },
      { size: 'L', color: 'Mặc định', sku: '${skuBase}-L', stock: 50, price: ${price} },
      { size: 'XL', color: 'Mặc định', sku: '${skuBase}-XL', stock: 50, price: ${price} }
    ]
  }`;
});

let seedContent = fs.readFileSync('src/seed.js', 'utf-8');

// Match the end of productsData array
const regex = /(const productsData = \[\s*[\s\S]*?)(\n\];)/m;
if (regex.test(seedContent)) {
  const newProductsStr = ',\n' + products.join(',\n');
  const newContent = seedContent.replace(regex, '$1' + newProductsStr + '$2');
  fs.writeFileSync('src/seed.js', newContent);
  console.log('Successfully appended more products to seed.js');
} else {
  console.log('productsData not found');
}
