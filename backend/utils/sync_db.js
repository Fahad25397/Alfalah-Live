const mongoose = require('mongoose');

async function syncDatabases() {
  const uriSource = 'mongodb+srv://alfalahhoney2_db_user:gulalfalah3%40new@cluster0.kkrjosv.mongodb.net/alfalah_honey?appName=Cluster0';
  const uriTarget = 'mongodb+srv://fahad125397_db_user:AtxGxHQfBKKAN5OT@cluster0.i4zngyg.mongodb.net/alfalah_honey?retryWrites=true&w=majority';

  console.log('Connecting to Source DB (Localhost DB - Cluster kkrjosv)...');
  const sourceConn = await mongoose.createConnection(uriSource).asPromise();

  console.log('Connecting to Target DB (Live Hostinger DB - Cluster i4zngyg)...');
  const targetConn = await mongoose.createConnection(uriTarget).asPromise();

  try {
    // 1. Sync Products
    const sourceProducts = await sourceConn.collection('products').find({}).toArray();
    console.log(`Found ${sourceProducts.length} products in Source DB.`);

    const targetProductCollection = targetConn.collection('products');
    
    // Upsert all source products into target
    const sourceIds = [];
    for (const prod of sourceProducts) {
      sourceIds.push(prod._id);
      await targetProductCollection.replaceOne(
        { _id: prod._id },
        prod,
        { upsert: true }
      );
    }
    console.log(`Successfully synced ${sourceProducts.length} products to Target DB.`);

    // Remove obsolete products not present in Source DB
    const deleteResult = await targetProductCollection.deleteMany({
      _id: { $nin: sourceIds }
    });
    console.log(`Removed ${deleteResult.deletedCount} obsolete products from Target DB.`);

    // 2. Sync Admin credentials so admin logins match
    const sourceAdmins = await sourceConn.collection('admins').find({}).toArray();
    if (sourceAdmins.length > 0) {
      const targetAdminCollection = targetConn.collection('admins');
      for (const admin of sourceAdmins) {
        await targetAdminCollection.replaceOne(
          { email: admin.email },
          admin,
          { upsert: true }
        );
      }
      console.log(`Synced ${sourceAdmins.length} admin accounts to Target DB.`);
    }

    // 3. Verify target products
    const finalCount = await targetProductCollection.countDocuments();
    console.log(`Verification: Target DB now has ${finalCount} products (expected: ${sourceProducts.length}).`);

  } catch (error) {
    console.error('Error during synchronization:', error);
  } finally {
    await sourceConn.close();
    await targetConn.close();
    console.log('Database connections closed.');
    process.exit(0);
  }
}

syncDatabases();
