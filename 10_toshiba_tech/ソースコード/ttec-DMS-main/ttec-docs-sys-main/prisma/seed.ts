import { prisma } from './client'
import { defaultSeeder } from './default-seeder'

(async () => {
    try {
        await defaultSeeder()
    } catch (err) {
        console.error(err)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
})()