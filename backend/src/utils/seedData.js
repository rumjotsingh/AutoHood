import mongoose from 'mongoose';
import Brand from '../models/Brand.js';
import Car from '../models/Car.js';
import User from '../models/User.js';
import Dealer from '../models/Dealer.js';
import dotenv from 'dotenv';

dotenv.config();

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const brands = [
  { name: 'Toyota', slug: 'toyota', country: 'Japan', logo: { url: 'https://www.carlogos.org/car-logos/toyota-logo.png' }, description: 'Reliability and innovation' },
  { name: 'Honda', slug: 'honda', country: 'Japan', logo: { url: 'https://www.carlogos.org/car-logos/honda-logo.png' }, description: 'The Power of Dreams' },
  { name: 'BMW', slug: 'bmw', country: 'Germany', logo: { url: 'https://www.carlogos.org/car-logos/bmw-logo.png' }, description: 'Ultimate Driving Machine' },
  { name: 'Mercedes-Benz', slug: 'mercedes-benz', country: 'Germany', logo: { url: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png' }, description: 'The Best or Nothing' },
  { name: 'Audi', slug: 'audi', country: 'Germany', logo: { url: 'https://www.carlogos.org/car-logos/audi-logo.png' }, description: 'Vorsprung durch Technik' },
  { name: 'Hyundai', slug: 'hyundai', country: 'South Korea', logo: { url: 'https://www.carlogos.org/car-logos/hyundai-logo.png' }, description: 'New Thinking New Possibilities' },
  { name: 'Ford', slug: 'ford', country: 'USA', logo: { url: 'https://www.carlogos.org/car-logos/ford-logo.png' }, description: 'Built Ford Tough' },
  { name: 'Maruti Suzuki', slug: 'maruti-suzuki', country: 'India', logo: { url: 'https://www.carlogos.org/car-logos/suzuki-logo.png' }, description: 'Way of Life' },
  { name: 'Tata', slug: 'tata', country: 'India', logo: { url: 'https://www.carlogos.org/car-logos/tata-logo.png' }, description: 'Connecting Aspirations' },
  { name: 'Mahindra', slug: 'mahindra', country: 'India', logo: { url: 'https://www.carlogos.org/car-logos/mahindra-logo.png' }, description: 'Rise' },
];

const cars = [
  // Toyota
  { title: 'Toyota Fortuner 2023', brand: 'Toyota', model: 'Fortuner', year: 2023, price: 3500000, mileage: 15000, fuelType: 'Diesel', transmission: 'Automatic', bodyType: 'SUV', color: 'White', description: 'Premium SUV with excellent features', city: 'Mumbai', state: 'Maharashtra' },
  { title: 'Toyota Innova Crysta 2022', brand: 'Toyota', model: 'Innova Crysta', year: 2022, price: 2200000, mileage: 25000, fuelType: 'Diesel', transmission: 'Manual', bodyType: 'Van', color: 'Silver', description: 'Spacious family car', city: 'Delhi', state: 'Delhi' },
  
  // Honda
  { title: 'Honda City 2023', brand: 'Honda', model: 'City', year: 2023, price: 1200000, mileage: 8000, fuelType: 'Petrol', transmission: 'Automatic', bodyType: 'Sedan', color: 'Black', description: 'Stylish sedan with great mileage', city: 'Bangalore', state: 'Karnataka' },
  { title: 'Honda Amaze 2022', brand: 'Honda', model: 'Amaze', year: 2022, price: 850000, mileage: 18000, fuelType: 'Petrol', transmission: 'Manual', bodyType: 'Sedan', color: 'White', description: 'Compact sedan perfect for city', city: 'Pune', state: 'Maharashtra' },
  
  // BMW
  { title: 'BMW X5 2023', brand: 'BMW', model: 'X5', year: 2023, price: 8500000, mileage: 5000, fuelType: 'Petrol', transmission: 'Automatic', bodyType: 'SUV', color: 'Blue', description: 'Luxury SUV with premium features', city: 'Mumbai', state: 'Maharashtra' },
  { title: 'BMW 3 Series 2022', brand: 'BMW', model: '3 Series', year: 2022, price: 5200000, mileage: 12000, fuelType: 'Diesel', transmission: 'Automatic', bodyType: 'Sedan', color: 'Black', description: 'Sports sedan with performance', city: 'Delhi', state: 'Delhi' },
  
  // Mercedes-Benz
  { title: 'Mercedes-Benz GLC 2023', brand: 'Mercedes-Benz', model: 'GLC', year: 2023, price: 7200000, mileage: 3000, fuelType: 'Petrol', transmission: 'Automatic', bodyType: 'SUV', color: 'Silver', description: 'Luxury compact SUV', city: 'Bangalore', state: 'Karnataka' },
  { title: 'Mercedes-Benz E-Class 2022', brand: 'Mercedes-Benz', model: 'E-Class', year: 2022, price: 6800000, mileage: 10000, fuelType: 'Diesel', transmission: 'Automatic', bodyType: 'Sedan', color: 'White', description: 'Executive luxury sedan', city: 'Hyderabad', state: 'Telangana' },
  
  // Hyundai
  { title: 'Hyundai Creta 2023', brand: 'Hyundai', model: 'Creta', year: 2023, price: 1450000, mileage: 6000, fuelType: 'Petrol', transmission: 'Automatic', bodyType: 'SUV', color: 'Red', description: 'Popular compact SUV', city: 'Chennai', state: 'Tamil Nadu' },
  { title: 'Hyundai Venue 2022', brand: 'Hyundai', model: 'Venue', year: 2022, price: 950000, mileage: 15000, fuelType: 'Petrol', transmission: 'Manual', bodyType: 'SUV', color: 'White', description: 'Compact SUV with features', city: 'Kolkata', state: 'West Bengal' },
  
  // Maruti Suzuki
  { title: 'Maruti Swift 2023', brand: 'Maruti Suzuki', model: 'Swift', year: 2023, price: 750000, mileage: 5000, fuelType: 'Petrol', transmission: 'Manual', bodyType: 'Hatchback', color: 'Blue', description: 'Popular hatchback', city: 'Mumbai', state: 'Maharashtra' },
  { title: 'Maruti Brezza 2022', brand: 'Maruti Suzuki', model: 'Brezza', year: 2022, price: 1100000, mileage: 12000, fuelType: 'Petrol', transmission: 'Automatic', bodyType: 'SUV', color: 'Grey', description: 'Compact SUV bestseller', city: 'Delhi', state: 'Delhi' },
  
  // Tata
  { title: 'Tata Nexon 2023', brand: 'Tata', model: 'Nexon', year: 2023, price: 1200000, mileage: 8000, fuelType: 'Petrol', transmission: 'Automatic', bodyType: 'SUV', color: 'Blue', description: '5-star safety rated SUV', city: 'Pune', state: 'Maharashtra' },
  { title: 'Tata Harrier 2022', brand: 'Tata', model: 'Harrier', year: 2022, price: 1850000, mileage: 15000, fuelType: 'Diesel', transmission: 'Manual', bodyType: 'SUV', color: 'Black', description: 'Premium SUV with space', city: 'Bangalore', state: 'Karnataka' },
  
  // Mahindra
  { title: 'Mahindra Thar 2023', brand: 'Mahindra', model: 'Thar', year: 2023, price: 1550000, mileage: 4000, fuelType: 'Diesel', transmission: 'Manual', bodyType: 'SUV', color: 'Red', description: 'Off-road legend', city: 'Jaipur', state: 'Rajasthan' },
  { title: 'Mahindra XUV700 2022', brand: 'Mahindra', model: 'XUV700', year: 2022, price: 2100000, mileage: 10000, fuelType: 'Diesel', transmission: 'Automatic', bodyType: 'SUV', color: 'White', description: 'Feature-packed SUV', city: 'Ahmedabad', state: 'Gujarat' },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await Brand.deleteMany({});
    await Car.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert brands
    const createdBrands = await Brand.insertMany(brands);
    console.log(`✅ Created ${createdBrands.length} brands`);

    // Create brand map
    const brandMap = {};
    createdBrands.forEach(brand => {
      brandMap[brand.name] = brand._id;
    });

    // Create demo user and dealer
    let demoUser = await User.findOne({ email: 'dealer@autohood.com' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Demo Dealer',
        email: 'dealer@autohood.com',
        password: 'dealer123',
        phone: '9876543210',
        role: 'dealer',
      });
      console.log('✅ Created demo dealer user');
    }

    // Create demo buyer user
    let demoBuyer = await User.findOne({ email: 'buyer@autohood.com' });
    if (!demoBuyer) {
      demoBuyer = await User.create({
        name: 'Demo Buyer',
        email: 'buyer@autohood.com',
        password: 'buyer123',
        phone: '9876543211',
        role: 'buyer',
      });
      console.log('✅ Created demo buyer user');
    }

    let demoDealer = await Dealer.findOne({ user: demoUser._id });
    if (!demoDealer) {
      demoDealer = await Dealer.create({
        user: demoUser._id,
        companyName: 'AutoHood Motors Pvt Ltd',
        businessType: 'dealership',
        location: {
          address: '123 MG Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
        },
        contactEmail: 'dealer@autohood.com',
        contactPhone: '9876543210',
        website: 'https://autohood.com',
        description: 'Premium automotive dealership offering the best cars and service',
        verified: true,
        rating: {
          average: 4.5,
          count: 150,
        },
      });
      console.log('✅ Created demo dealer profile');
    }

    // Insert cars with brand references
    const carsWithBrands = cars.map((car, index) => ({
      title: car.title,
      slug: slugify(`${car.title}-${index}`),
      brand: brandMap[car.brand],
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      kmDriven: car.mileage,
      fuelType: car.fuelType.toLowerCase(),
      transmission: car.transmission.toLowerCase(),
      bodyType: car.bodyType.toLowerCase(),
      color: car.color,
      seats: 5,
      doors: 4,
      engineCapacity: 2000,
      condition: 'used',
      negotiable: true,
      description: car.description,
      location: {
        city: car.city,
        state: car.state,
        country: 'India',
      },
      owner: demoUser._id,
      dealerProfile: demoDealer._id,
      status: 'active',
      featured: Math.random() > 0.7,
      images: [
        {
          url: `https://source.unsplash.com/800x600/?${car.brand.replace(' ', '-')}-car`,
          public_id: `car_${Date.now()}_${index}_1`,
        },
        {
          url: `https://source.unsplash.com/800x600/?luxury-car`,
          public_id: `car_${Date.now()}_${index}_2`,
        },
      ],
    }));

    const createdCars = await Car.insertMany(carsWithBrands);
    console.log(`✅ Created ${createdCars.length} cars`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Brands: ${createdBrands.length}`);
    console.log(`   Cars: ${createdCars.length}`);
    console.log(`   Demo Dealer: dealer@autohood.com / dealer123`);
    console.log(`   Demo Buyer: buyer@autohood.com / buyer123`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
