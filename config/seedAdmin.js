const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@energy.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      console.log('Seeding Super Admin user...');
      const superAdmin = new User({
        name: 'Super Admin',
        email: adminEmail,
        password: 'energyro@2026',
        role: 'super_admin'
      });

      await superAdmin.save();
      console.log('Super Admin user seeded successfully.');
    } else {
      console.log('Super Admin user already exists.');
    }
  } catch (error) {
    console.error('Error seeding Super Admin user:', error);
  }
};

module.exports = seedAdmin;
