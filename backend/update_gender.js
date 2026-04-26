const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: 'src/.env' });
dotenv.config();

const Product = require('./src/models/Product');
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://khoilam3789_db_user:jERR73m7b3ZYEF1m@cluster0.lfdp1y7.mongodb.net/fashion_store';

const run = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB.');

        const products = await Product.find({});
        let updatedCount = 0;

        for (const p of products) {
            let newGender = 'men';
            let nameLower = p.name.toLowerCase();
            let descLower = p.description.toLowerCase();
            
            if (nameLower.includes('nữ') || descLower.includes('nữ')) {
                newGender = 'women';
            } else if (nameLower.includes('đôi') || nameLower.includes('nhóm') || nameLower.includes('unisex') || descLower.includes('đôi') || descLower.includes('nhóm') || descLower.includes('unisex')) {
                newGender = 'unisex';
            }
            
            if (p.targetGender !== newGender) {
                p.targetGender = newGender;
                await p.save();
                updatedCount++;
            }
        }
        
        console.log(`Updated ${updatedCount} products gender.`);
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
run();
