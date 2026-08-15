const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const sampleProducts = [
  {
    name: 'Wild Organic Sidr Honey',
    description: 'Rare and highly prized raw Sidr honey harvested from ancient forest trees. Rich in natural healing properties.',
    price: 29.99,
    weight: '500g',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800',
    stock: 15
  },
  {
    name: 'Acacia Flower Pure Honey',
    description: 'Light, sweet, and delicate clear honey harvested from organic Acacia blossoms.',
    price: 24.99,
    weight: '500g',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=800',
    stock: 20
  },
  {
    name: 'Raw Natural Honeycomb',
    description: '100% natural honeycomb section straight from our beehives. Eat it directly or pair with artisan cheese.',
    price: 34.99,
    weight: '400g',
    image: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&q=80&w=800',
    stock: 10
  },
  {
    name: 'Wildflower Forest Honey',
    description: 'A dark, complex multi-floral honey packed with antioxidants and natural pollen grains.',
    price: 19.99,
    weight: '500g',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800',
    stock: 25
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    console.log('✅ Sample Honey Products Imported to MongoDB Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();