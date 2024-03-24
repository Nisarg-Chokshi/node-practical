const { Users } = require('../models/User');
const { Products } = require('../models/Product');
const { Sales } = require('../models/Sale');
const { Revenues } = require('../models/Revenue');
const { USER_ROLES } = require('../helpers/constants');

const usersData = [
  {
    userName: 'Admin',
    email: 'admin@yopmail.com',
    password: '$2b$10$yVT8Qn0h6gGDNOZOiee8Yu6QYvgDLwO0/FC3H1D2daWru/lgm8V9.',
    gender: 'Female',
    contactNumber: '',
    profilePic: '',
    verifyToken: '',
    isVerified: false,
    role: 'Admin',
    deleted: false,
    lastLogin: new Date(),
  },
  {
    userName: 'Backend Developer',
    email: 'backend@yopmail.com',
    password: '$2b$10$yVT8Qn0h6gGDNOZOiee8Yu6QYvgDLwO0/FC3H1D2daWru/lgm8V9.',
    gender: 'Male',
    contactNumber: '',
    profilePic: '',
    verifyToken: '',
    isVerified: false,
    role: 'User',
    deleted: false,
    lastLogin: new Date(),
  },
  {
    userName: 'Frontend Developer',
    email: 'frontend@yopmail.com',
    password: '$2b$10$yVT8Qn0h6gGDNOZOiee8Yu6QYvgDLwO0/FC3H1D2daWru/lgm8V9.',
    gender: 'Female',
    contactNumber: '',
    profilePic: '',
    verifyToken: '',
    isVerified: false,
    role: 'User',
    deleted: false,
    lastLogin: new Date(),
  },
  {
    userName: 'Business Analyst',
    email: 'ba@yopmail.com',
    password: '$2b$10$yVT8Qn0h6gGDNOZOiee8Yu6QYvgDLwO0/FC3H1D2daWru/lgm8V9.',
    gender: 'Female',
    contactNumber: '',
    profilePic: '',
    verifyToken: '',
    isVerified: false,
    role: 'User',
    deleted: false,
    lastLogin: new Date(),
  },
  {
    userName: 'DevOps Lead',
    email: 'devops@yopmail.com',
    password: '$2b$10$yVT8Qn0h6gGDNOZOiee8Yu6QYvgDLwO0/FC3H1D2daWru/lgm8V9.',
    gender: 'Male',
    contactNumber: '',
    profilePic: '',
    verifyToken: '',
    isVerified: false,
    role: 'User',
    deleted: false,
    lastLogin: new Date(),
  },
  {
    userName: 'Quality Assurance Tester',
    email: 'qa@yopmail.com',
    password: '$2b$10$yVT8Qn0h6gGDNOZOiee8Yu6QYvgDLwO0/FC3H1D2daWru/lgm8V9.',
    gender: 'Male',
    contactNumber: '',
    profilePic: '',
    verifyToken: '',
    isVerified: false,
    role: 'User',
    deleted: false,
    lastLogin: new Date(),
  },
  {
    userName: 'Human Resource Manager',
    email: 'hr@yopmail.com',
    password: '$2b$10$yVT8Qn0h6gGDNOZOiee8Yu6QYvgDLwO0/FC3H1D2daWru/lgm8V9.',
    gender: 'Female',
    contactNumber: '',
    profilePic: '',
    verifyToken: '',
    isVerified: false,
    role: 'User',
    deleted: false,
    lastLogin: new Date(),
  },
  {
    userName: 'Marketing Lead',
    email: 'marketing@yopmail.com',
    password: '$2b$10$yVT8Qn0h6gGDNOZOiee8Yu6QYvgDLwO0/FC3H1D2daWru/lgm8V9.',
    gender: 'Male',
    contactNumber: '',
    profilePic: '',
    verifyToken: '',
    isVerified: false,
    role: 'User',
    deleted: false,
    lastLogin: new Date(),
  },
  {
    userName: 'Accountant',
    email: 'accountant@yopmail.com',
    password: '$2b$10$yVT8Qn0h6gGDNOZOiee8Yu6QYvgDLwO0/FC3H1D2daWru/lgm8V9.',
    gender: 'Female',
    contactNumber: '',
    profilePic: '',
    verifyToken: '',
    isVerified: false,
    role: 'User',
    deleted: false,
    lastLogin: new Date(),
  },
  {
    userName: 'intern',
    email: 'intern@yopmail.com',
    password: '$2b$10$yVT8Qn0h6gGDNOZOiee8Yu6QYvgDLwO0/FC3H1D2daWru/lgm8V9.',
    gender: 'Female',
    contactNumber: '',
    profilePic: '',
    verifyToken: '',
    isVerified: false,
    role: 'User',
    deleted: false,
    lastLogin: new Date(),
  },
];

const productsData = (generatedBy) => [
  {
    name: 'Nike Air Max',
    description: 'Nike Air Max Alpha Trainer 5 Sneakers For Men',
    category: "Mens's Footwear",
    price: '7495',
    availableQuantity: 75,
    quantitySold: 5,
    generatedBy,
    status: 'Available',
  },
  {
    name: 'Acer Aspire 7',
    description:
      'Acer Aspire 7 Intel Core i5 12th Gen 12450H - (8 GB/512 GB SSD/Windows 11 Home/4 GB Graphics/NVIDIA GeForce RTX 2050) A715-76G-59WG Gaming Laptop  (15.6 Inch, Charcoal Black, 2.1 Kg)',
    category: 'Laptops',
    price: '51990',
    availableQuantity: 1211,
    quantitySold: 0,
    generatedBy,
    status: 'Available',
  },
  {
    name: 'boAt Airdopes 161',
    description:
      'boAt Airdopes 161 ANC w/ Active Noise Cancellation(32dB),50HRS Playback & ASAP Charge Bluetooth Headset  (Black, True Wireless)',
    category: 'Earphones',
    price: '1399',
    availableQuantity: 861227,
    quantitySold: 1534,
    generatedBy,
    status: 'Available',
  },
  {
    name: 'SONY HT-S20R',
    description:
      'SONY HT-S20R 5.1ch Home Theatre with Dolby Digital, Subwoofer, Rear Speakers, Bluetooth Soundbar  (Black, 5.1 Channel)',
    category: 'Speakers',
    price: '15850',
    availableQuantity: 10463,
    quantitySold: 18,
    generatedBy,
    status: 'Available',
  },
  {
    name: 'SAMSUNG 236L Refrigerator',
    description:
      'SAMSUNG 236 L Frost Free Double Door 3 Star Refrigerator  (Black DOI, RT28C3733B1/HL)',
    category: 'Refrigerators',
    price: '26990',
    availableQuantity: 0,
    quantitySold: 8,
    generatedBy,
    status: 'Out of Stock',
  },
  {
    name: 'Mi A series Television',
    description:
      'Mi A series 80 cm (32 inch) HD Ready LED Smart Google TV 2023 Edition with HD |Dolby Audio | DTS:HD | Vivid Picture Engine',
    category: 'Television',
    price: '12990',
    availableQuantity: 4,
    quantitySold: 10,
    generatedBy,
    status: 'Available',
  },
  {
    name: 'AJANTA wall clock',
    description:
      'AJANTA Analog 26 cm X 26 cm Wall Clock  (White, With Glass, Standard)',
    category: 'WallClocks',
    price: '349',
    availableQuantity: 1714,
    quantitySold: 0,
    generatedBy,
    status: 'Available',
  },
  {
    name: 'NIVEA Moisturizing Cream',
    description: 'NIVEA Soft Moisturizing Cream for all skin types  (300 ml)',
    category: 'Beauty & Grooming',
    price: '302',
    availableQuantity: 0,
    quantitySold: 45,
    generatedBy,
    status: 'Out of Stock',
  },
  {
    name: 'Skybags Bagpack',
    description: '21.65 L Backpack BRAT  (Green)',
    category: 'Bagpack',
    price: '529',
    availableQuantity: 74,
    quantitySold: 5,
    generatedBy,
    status: 'Available',
  },
];

const salesData = [];
const revenuesData = [];

module.exports = {
  addDefaultUsers: async () => {
    try {
      await Users.insertMany(usersData);
    } catch (error) {
      if (error.code !== 11000) {
        console.log('addDefaultUsers | Error adding users documents =>', error);
        process.exit(1);
      }
    }
  },
  addDefaultProducts: async () => {
    try {
      const admin = await Users.findOne({ role: USER_ROLES.ADMIN }).lean();
      const products = await Products.insertMany(productsData(admin._id));
      return products;
    } catch (error) {
      if (error.code !== 11000) {
        console.log(
          'addDefaultProducts | Error adding users documents =>',
          error
        );
        process.exit(1);
      }
    }
  },
};
