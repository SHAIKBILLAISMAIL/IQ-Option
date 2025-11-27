import { db } from '@/db';
import { userBalances } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    const userId = 'zSZmikKcH0ju8f9xzKI9ADE7LfNabAgr';
    
    // Check if balance already exists for this user
    const existingBalance = await db
        .select()
        .from(userBalances)
        .where(eq(userBalances.userId, userId))
        .limit(1);
    
    if (existingBalance.length > 0) {
        console.log('ℹ️ Balance already exists for user');
        return;
    }
    
    const sampleBalance = {
        userId: userId,
        balance: 10000.00,
        realBalance: 0.00,
        currency: 'USD',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    await db.insert(userBalances).values(sampleBalance);
    
    console.log('✅ User balance seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});