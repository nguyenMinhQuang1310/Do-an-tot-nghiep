const fs = require('fs');
let content = fs.readFileSync('src/seed.js', 'utf8');

let modified = content.replace(/name: '(.*?)',\s*slug: '(.*?)',\s*catSlug: '(.*?)',\s*description: '(.*?)',\s*brand: '(.*?)',\s*targetGender: 'men'/g, (match, name, slug, catSlug, description, brand) => {
    let newGender = 'men';
    let nameLower = name.toLowerCase();
    let descLower = description.toLowerCase();
    
    // Determine gender
    if (nameLower.includes('nữ') || descLower.includes('nữ')) {
        newGender = 'women';
    } else if (nameLower.includes('đôi') || nameLower.includes('nhóm') || nameLower.includes('unisex') || descLower.includes('đôi') || descLower.includes('nhóm') || descLower.includes('unisex')) {
        newGender = 'unisex';
    }
    
    return `name: '${name}',\n    slug: '${slug}',\n    catSlug: '${catSlug}',\n    description: '${description}',\n    brand: '${brand}',\n    targetGender: '${newGender}'`;
});

fs.writeFileSync('src/seed.js', modified);
console.log('Seed file updated successfully. Gender fixed.');
