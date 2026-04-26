const fs = require('fs');

const csvData = `ten_san_pham,mo_ta,kieu_ao,phan_loai,url_anh
Áo polo trắng urban,Phong cách lịch sự tối giản phù hợp đi chơi và đi làm,Áo cộc,Polo,https://images.pexels.com/photos/22745628/pexels-photo-22745628.jpeg
Áo polo đỏ nổi bật,Màu sắc trẻ trung tạo điểm nhấn mạnh cho outfit,Áo cộc,Polo,https://images.pexels.com/photos/11751211/pexels-photo-11751211.jpeg
Áo polo đen cá tính,Thiết kế gọn gàng hợp phong cách hiện đại,Áo cộc,Polo,https://images.pexels.com/photos/14370669/pexels-photo-14370669.jpeg
Áo khoác hoodie đen cận mặt,Phong cách bí ẩn hợp outfit đường phố,Áo dài tay,Hoodie,https://images.pexels.com/photos/36607476/pexels-photo-36607476.jpeg
Áo khoác denim xanh nhạt,Casual dễ phối với áo thun trắng hoặc tank top,Áo khoác,Jacket denim,https://images.pexels.com/photos/17896496/pexels-photo-17896496.jpeg
Áo khoác denim wash sáng,Phong cách bụi bặm trẻ trung hợp street style,Áo khoác,Jacket denim,https://images.pexels.com/photos/5675657/pexels-photo-5675657.jpeg
Áo thun đôi in hình tim,Thiết kế trẻ trung thích hợp chụp ảnh bạn bè hoặc couple,Áo cộc,Graphic T-shirt,https://images.pexels.com/photos/17399226/pexels-photo-17399226.jpeg
Áo thun đen casual nam,Kiểu dáng đơn giản dễ mặc hằng ngày,Áo cộc,T-shirt,https://images.pexels.com/photos/10690918/pexels-photo-10690918.jpeg
Áo thun xám chụp studio,Phong cách tối giản hợp outfit hiện đại,Áo cộc,T-shirt,https://images.pexels.com/photos/12661581/pexels-photo-12661581.jpeg
Áo thun oversize navy,Form rộng mang cảm giác thoải mái và thời trang,Áo cộc,Oversize T-shirt,https://images.pexels.com/photos/13651809/pexels-photo-13651809.jpeg
Áo thun nhóm basic,Tông màu đen trắng dễ ứng dụng cho lookbook sản phẩm,Áo cộc,T-shirt,https://images.pexels.com/photos/15576197/pexels-photo-15576197.jpeg
Áo thun graphic đen chữ lớn,Họa tiết in trước ngực nổi bật và cá tính,Áo cộc,Graphic T-shirt,https://images.pexels.com/photos/37043496/pexels-photo-37043496.jpeg
Áo thun đen streetwear,Phong cách khỏe khoắn hợp jean và sneaker,Áo cộc,T-shirt,https://images.pexels.com/photos/27348257/pexels-photo-27348257.jpeg
Áo thun đen in hình nghệ thuật,Thiết kế sáng tạo dành cho phong cách trẻ,Áo cộc,Graphic T-shirt,https://images.pexels.com/photos/36942018/pexels-photo-36942018.jpeg
Áo thun trắng in hình màu,Chất áo basic kết hợp họa tiết vui nhộn nổi bật,Áo cộc,Graphic T-shirt,https://images.pexels.com/photos/37025819/pexels-photo-37025819.jpeg
Áo thun trắng ngoài trời,Hình ảnh nhẹ nhàng hợp phong cách mùa hè,Áo cộc,T-shirt,https://images.pexels.com/photos/9157771/pexels-photo-9157771.jpeg
Áo hoodie hồng dusty,Form trẻ trung hợp phong cách năng động,Áo dài tay,Hoodie,https://images.pexels.com/photos/11202108/pexels-photo-11202108.jpeg
Áo hoodie đỏ rượu,Cá tính mạnh phù hợp chụp lookbook streetwear,Áo dài tay,Hoodie,https://images.pexels.com/photos/10890048/pexels-photo-10890048.jpeg
Áo hoodie xanh rêu,Giữ ấm tốt và phù hợp mặc thường ngày,Áo dài tay,Hoodie,https://images.pexels.com/photos/36044003/pexels-photo-36044003.jpeg
Áo hoodie nâu trơn,Thiết kế tối giản dễ phối nhiều kiểu quần,Áo dài tay,Hoodie,https://images.pexels.com/photos/31670079/pexels-photo-31670079.png
Áo hoodie đen mùa đông,Phong cách ngoài trời mạnh mẽ và lạnh tông,Áo dài tay,Hoodie,https://images.pexels.com/photos/11317539/pexels-photo-11317539.jpeg
Áo hoodie trắng basic,Thiết kế sạch sẽ phù hợp ảnh sản phẩm studio,Áo dài tay,Hoodie,https://images.pexels.com/photos/8217416/pexels-photo-8217416.jpeg
Áo hoodie xám sáng,Phong cách đơn giản phù hợp mặc dạo phố,Áo dài tay,Hoodie,https://images.pexels.com/photos/5319493/pexels-photo-5319493.jpeg
Áo hoodie trắng nền hồng,Hình ảnh nổi bật hợp phong cách trẻ trung,Áo dài tay,Hoodie,https://images.pexels.com/photos/6974969/pexels-photo-6974969.jpeg
Áo hoodie đen urban close-up,Cận cảnh mạnh mẽ hợp banner thời trang nam,Áo dài tay,Hoodie,https://images.pexels.com/photos/5319514/pexels-photo-5319514.jpeg
Áo khoác denim đồng cỏ,Phong cách vintage nhẹ phù hợp outfit casual,Áo khoác,Jacket denim,https://images.pexels.com/photos/15637835/pexels-photo-15637835.jpeg
Áo khoác denim có mũ,Thiết kế lạ mắt kết hợp chất streetwear hiện đại,Áo khoác,Jacket denim,https://images.pexels.com/photos/28638566/pexels-photo-28638566.jpeg
Áo khoác denim nhóm mẫu,Ảnh thời trang phù hợp làm sản phẩm bộ sưu tập,Áo khoác,Jacket denim,https://images.pexels.com/photos/6770027/pexels-photo-6770027.jpeg
Áo khoác denim cận ngực,Chất liệu jean sáng dễ dùng cho trang danh mục,Áo khoác,Jacket denim,https://images.pexels.com/photos/17896486/pexels-photo-17896486.jpeg
Áo khoác denim nhóm xanh,Phù hợp trưng bày lookbook unisex,Áo khoác,Jacket denim,https://images.pexels.com/photos/6770036/pexels-photo-6770036.jpeg
Áo khoác denim treo móc,Ảnh flatlay đẹp phù hợp trang chi tiết sản phẩm,Áo khoác,Jacket denim,https://images.pexels.com/photos/13662420/pexels-photo-13662420.jpeg
Áo khoác denim xanh phối đôi,Chất jean sáng trẻ trung hợp outfit hiện đại,Áo khoác,Jacket denim,https://images.pexels.com/photos/6769357/pexels-photo-6769357.jpeg
Áo khoác denim đen nam,Tạo vẻ ngoài cá tính và mạnh mẽ,Áo khoác,Jacket denim,https://images.pexels.com/photos/14584497/pexels-photo-14584497.jpeg
Áo polo đen nữ basic,Dáng polo tối giản phù hợp catalog thời trang,Áo cộc,Polo,https://images.pexels.com/photos/16048133/pexels-photo-16048133.jpeg
Áo polo olive nam,Phong cách trưởng thành lịch sự nhưng vẫn trẻ,Áo cộc,Polo,https://images.pexels.com/photos/21286442/pexels-photo-21286442.jpeg
Áo polo trắng trẻ em,Hình ảnh sạch sẽ phù hợp danh mục polo trắng,Áo cộc,Polo,https://images.pexels.com/photos/11807005/pexels-photo-11807005.jpeg
Áo polo xanh nhạt,Thiết kế thoải mái phù hợp đi chơi ngoài trời,Áo cộc,Polo,https://images.pexels.com/photos/25261567/pexels-photo-25261567.jpeg
Áo thun đỏ đô nam,Màu sắc nổi bật hợp phong cách casual,Áo cộc,T-shirt,https://images.pexels.com/photos/28179205/pexels-photo-28179205.jpeg
Áo hoodie tay ngắn xanh mint,Kiểu dáng mới lạ phù hợp thời trang trẻ,Áo ngắn tay,Hoodie,https://images.pexels.com/photos/16646931/pexels-photo-16646931.jpeg
Áo thun đen phối quần vàng,Họa tiết nghệ thuật giúp outfit nổi bật hơn,Áo cộc,Graphic T-shirt,https://images.pexels.com/photos/18870456/pexels-photo-18870456.jpeg`;

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
  const image = parts.slice(4).join(',').trim();

  let slug = removeAccents(name).replace(/[^a-z0-9 +]/g, '').replace(/ +/g, '-');
  const catSlug = catMapping[type_name] || 'ao-thun';
  
  let price = 150000;
  if(type_name === 'Polo') price = 200000;
  if(type_name.includes('Sơ mi')) price = 250000;
  if(type_name.includes('Hoodie') || type_name.includes('Jacket')) price = 350000;

  // The previous script used PROD-1 to PROD-40, we continue from PROD-41
  let skuBase = `PROD-${index + 41}`;

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

// We need to append these new products to productsData array.
// The array currently ends like:
//   }
// ];
// We can replace "\n];" with ",\n" + new_products + "\n];"
// Wait, the regex should match the closing bracket of productsData.
// A simpler way: Find the last product closing "  }" before the "];"
// Actually, earlier we did: const regex = /const productsData = \[\s*[\s\S]*?\n\];/m;
// Let's capture the inside so we can append.

const regex = /(const productsData = \[\s*[\s\S]*?)(\n\];)/m;
if (regex.test(seedContent)) {
  const newProductsStr = ',\n' + products.join(',\n');
  const newContent = seedContent.replace(regex, '$1' + newProductsStr + '$2');
  fs.writeFileSync('src/seed.js', newContent);
  console.log('Successfully appended more products to seed.js');
} else {
  console.log('productsData not found');
}
