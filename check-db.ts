import { connectDB } from './src/lib/mongodb';
import { StoreSettings } from './src/models/StoreSettings';

async function checkSettings() {
  await connectDB();
  const settings = await StoreSettings.findOne();
  console.log('Current Settings in DB:', JSON.stringify(settings?.theme, null, 2));
  process.exit(0);
}

checkSettings();
