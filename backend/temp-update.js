const fs = require('fs');

const csvData = `ten_san_pham,mo_ta,kieu_ao,phan_loai,url_anh
Áo thun nam basic đen,Thiết kế tối giản dễ phối đồ mặc hằng ngày,Áo cộc,T-shirt,https://images.pexels.com/photos/19562362/pexels-photo-19562362.jpeg
Áo thun graphic trắng nam,Phong cách trẻ trung nổi bật với họa tiết in,Áo cộc,T-shirt,https://images.pexels.com/photos/17583618/pexels-photo-17583618.jpeg
Áo polo nam basic,Kiểu cổ bẻ lịch sự phù hợp đi học đi làm,Áo cộc,Polo,https://images.pexels.com/photos/1861586/pexels-photo-1861586.jpeg
Áo hoodie đỏ nam,Form thoải mái giữ ấm tốt phong cách streetwear,Áo dài tay,Hoodie,https://images.pexels.com/photos/34200833/pexels-photo-34200833.jpeg
Áo thun xám nam casual,Chất liệu mềm nhẹ phù hợp mặc thường ngày,Áo cộc,T-shirt,https://images.pexels.com/photos/16264964/pexels-photo-16264964.jpeg
Áo polo phối sweater,Phong cách nam tính lịch lãm và gọn gàng,Áo cộc,Polo,https://images.pexels.com/photos/11000251/pexels-photo-11000251.jpeg
Áo hoodie đen nam,Năng động cá tính phù hợp thời tiết se lạnh,Áo dài tay,Hoodie,https://images.pexels.com/photos/20954925/pexels-photo-20954925.jpeg
Áo thun oversize đôi nam,Form rộng trẻ trung theo phong cách hiện đại,Áo cộc,Oversize T-shirt,https://images.pexels.com/photos/24233063/pexels-photo-24233063.jpeg
Áo polo cam nam,Tạo điểm nhấn màu sắc nổi bật và trẻ trung,Áo cộc,Polo,https://images.pexels.com/photos/15937031/pexels-photo-15937031.jpeg
Áo hoodie chụp góc thấp,Thiết kế mạnh mẽ phù hợp outfit đường phố,Áo dài tay,Hoodie,https://images.pexels.com/photos/19273947/pexels-photo-19273947.jpeg
Áo thun trắng in họa tiết,Phong cách hiện đại hợp đi chơi chụp ảnh,Áo cộc,Graphic T-shirt,https://images.pexels.com/photos/19881714/pexels-photo-19881714.jpeg
Áo polo xám nam,Chất áo gọn form dễ phối quần jean hoặc kaki,Áo cộc,Polo,https://images.pexels.com/photos/24446647/pexels-photo-24446647.jpeg
Áo hoodie chân dung nam,Thiết kế casual dễ mặc và giữ ấm tốt,Áo dài tay,Hoodie,https://images.pexels.com/photos/19727101/pexels-photo-19727101.jpeg
Áo thun đen chụp studio,Phong cách thời trang tối giản và nam tính,Áo cộc,T-shirt,https://images.pexels.com/photos/18003565/pexels-photo-18003565.jpeg
Áo sơ mi họa tiết thời trang,Thiết kế nổi bật phù hợp phong cách cá tính,Áo ngắn tay,Sơ mi,https://images.pexels.com/photos/25621236/pexels-photo-25621236.jpeg
Áo hoodie graphic nam,Họa tiết nổi bật theo phong cách street style,Áo dài tay,Hoodie,https://images.pexels.com/photos/19697348/pexels-photo-19697348.jpeg
Áo khoác đen nam thời trang,Phong cách urban mạnh mẽ dễ phối đồ,Áo khoác,Jacket,https://images.pexels.com/photos/19565723/pexels-photo-19565723.jpeg
Áo thun anime đen nam,Thiết kế cá tính dành cho giới trẻ,Áo cộc,Graphic T-shirt,https://images.pexels.com/photos/19437841/pexels-photo-19437841.jpeg
Áo sơ mi hoa ngắn tay,Phong cách mùa hè nổi bật và trẻ trung,Áo ngắn tay,Sơ mi hoa,https://images.pexels.com/photos/2897520/pexels-photo-2897520.jpeg
Áo hoodie urban nam,Chất áo dày vừa phải hợp thời tiết mát,Áo dài tay,Hoodie,https://images.pexels.com/photos/33405099/pexels-photo-33405099.jpeg
Áo khoác denim nam đường phố,Phong cách bụi bặm trẻ trung dễ phối,Áo khoác,Jacket denim,https://images.pexels.com/photos/29353589/pexels-photo-29353589.jpeg
Áo thun họa tiết màu nổi,Mang phong cách sáng tạo và hiện đại,Áo cộc,T-shirt,https://images.pexels.com/photos/17970937/pexels-photo-17970937.jpeg
Áo sơ mi nam casual,Cổ áo gọn gàng phù hợp đi chơi cuối tuần,Áo ngắn tay,Sơ mi,https://images.pexels.com/photos/17606178/pexels-photo-17606178.jpeg
Áo hoodie đen đường phố,Thiết kế đơn giản hợp phong cách năng động,Áo dài tay,Hoodie,https://images.pexels.com/photos/20469812/pexels-photo-20469812.jpeg
Áo khoác da nam cá tính,Tạo vẻ ngoài mạnh mẽ và thời trang,Áo khoác,Leather jacket,https://images.pexels.com/photos/31387656/pexels-photo-31387656.jpeg
Áo hoodie đen ngoài trời,Form áo thoải mái phù hợp dạo phố,Áo dài tay,Hoodie,https://images.pexels.com/photos/35240866/pexels-photo-35240866.jpeg
Áo hoodie city style,Thiết kế trẻ trung hợp phong cách hiện đại,Áo dài tay,Hoodie,https://images.pexels.com/photos/18657721/pexels-photo-18657721.jpeg
Áo khoác đen urban fashion,Giữ ấm nhẹ và tôn dáng nam tính,Áo khoác,Jacket,https://images.pexels.com/photos/21656904/pexels-photo-21656904.jpeg
Áo thun nam cận cảnh,Thiết kế basic thích hợp dùng hằng ngày,Áo cộc,T-shirt,https://images.pexels.com/photos/17744884/pexels-photo-17744884.jpeg
Áo thun phối jean nam,Phong cách casual đơn giản dễ mặc,Áo cộc,T-shirt,https://images.pexels.com/photos/16794300/pexels-photo-16794300.jpeg
Áo hoodie studio đen,Phong cách cool ngầu hợp chụp lookbook,Áo dài tay,Hoodie,https://images.pexels.com/photos/19338727/pexels-photo-19338727.jpeg
Áo khoác nam thành thị,Thiết kế hiện đại phù hợp thời trang đường phố,Áo khoác,Jacket,https://images.pexels.com/photos/16053912/pexels-photo-16053912.jpeg
Áo sơ mi trắng nam,Hình ảnh sạch sẽ lịch sự và dễ phối,Áo dài tay,Sơ mi trắng,https://images.pexels.com/photos/18012147/pexels-photo-18012147.jpeg
Áo thun đen basic nam,Thiết kế mạnh mẽ và nam tính,Áo cộc,T-shirt,https://images.pexels.com/photos/16628550/pexels-photo-16628550.jpeg
Áo polo nam buổi tối,Phong cách lịch sự nhưng vẫn trẻ trung,Áo cộc,Polo,https://images.pexels.com/photos/24820835/pexels-photo-24820835.jpeg
Áo khoác denim đôi nam,Thích hợp phong cách bạn bè hoặc couple,Áo khoác,Jacket denim,https://images.pexels.com/photos/12824883/pexels-photo-12824883.jpeg
Áo sơ mi trắng nắng nhẹ,Thiết kế thanh lịch hợp chụp ảnh ngoài trời,Áo dài tay,Sơ mi trắng,https://images.pexels.com/photos/18703882/pexels-photo-18703882.jpeg
Áo sơ mi trắng studio,Phong cách tối giản sạch sẽ và hiện đại,Áo dài tay,Sơ mi trắng,https://images.pexels.com/photos/19895835/pexels-photo-19895835.jpeg
Áo thun in hình đen,Thiết kế cá tính hợp phong cách trẻ,Áo cộc,Graphic T-shirt,https://images.pexels.com/photos/17894191/pexels-photo-17894191.jpeg
Áo khoác denim cận cảnh,Phong cách casual bụi bặm và nam tính,Áo khoác,Jacket denim,https://images.pexels.com/photos/5217821/pexels-photo-5217821.jpeg`;

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

  let skuBase = `PROD-${index + 1}`;

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

const productsStr = 'const productsData = [\n' + products.join(',\n') + '\n];';

let seedContent = fs.readFileSync('src/seed.js', 'utf-8');

const regex = /const productsData = \[\s*[\s\S]*?\n\];/m;
if (regex.test(seedContent)) {
  const newContent = seedContent.replace(regex, productsStr);
  fs.writeFileSync('src/seed.js', newContent);
  console.log('Successfully updated seed.js');
} else {
  console.log('productsData not found');
}
