import { db } from './db';
import { devicesTable, remotesTable } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // Seed remotes
  const remotes = [
    { name: 'Living Room', icon: 'fa-couch' },
    { name: 'Main Bedroom', icon: 'fa-bed' },
    { name: 'Children Bedroom', icon: 'fa-child' },
    { name: 'Kitchen', icon: 'fa-utensils' },
    { name: 'Dining Room', icon: 'fa-wine-glass' },
    { name: 'Home Office', icon: 'fa-briefcase' },
    { name: 'Guest Room', icon: 'fa-door-open' },
    { name: 'Basement', icon: 'fa-stairs' },
    { name: 'Garage', icon: 'fa-car' },
    { name: 'Entertainment Room', icon: 'fa-tv' },
  ];

  console.log('📱 Inserting remotes...');
  await db.insert(remotesTable).values(remotes);

  // Seed devices
  const devices = [
    {
      name: 'Living Room TV',
      type: 'simple',
      icon: 'fa-tv',
      imageUrl: null,
    },
    {
      name: 'Samsung Smart TV',
      type: 'simple',
      icon: 'fa-tv',
      imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop&crop=center',
    },
    {
      name: 'LG Air Conditioner',
      type: 'AC',
      icon: 'fa-snowflake',
      imageUrl: 'https://images.unsplash.com/photo-1581783898377-1dcfeada7e50?w=400&h=300&fit=crop&crop=center',
    },
    {
      name: 'Bedroom AC Unit',
      type: 'AC',
      icon: 'fa-snowflake',
      imageUrl: null,
    },
    {
      name: 'Sound System',
      type: 'simple',
      icon: 'fa-volume-high',
      imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop&crop=center',
    },
    {
      name: 'Kitchen TV',
      type: 'simple',
      icon: 'fa-tv',
      imageUrl: null,
    },
    {
      name: 'Office AC',
      type: 'AC',
      icon: 'fa-snowflake',
      imageUrl: null,
    },
    {
      name: 'Projector',
      type: 'simple',
      icon: 'fa-video',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center',
    },
    {
      name: 'Ceiling Fan',
      type: 'simple',
      icon: 'fa-fan',
      imageUrl: null,
    },
    {
      name: 'Guest Room AC',
      type: 'AC',
      icon: 'fa-snowflake',
      imageUrl: 'https://images.unsplash.com/photo-1585338447937-7082f8fc763d?w=400&h=300&fit=crop&crop=center',
    },
  ];

  console.log('🔌 Inserting devices...');
  await db.insert(devicesTable).values(devices);

  console.log('✅ Seeding completed!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
}); 