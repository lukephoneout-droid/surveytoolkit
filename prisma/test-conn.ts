import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import "dotenv/config"

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function test() {
    try {
        const count = await prisma.organisation.count()
        console.log("Connection successful. Org count:", count)
    } catch (e) {
        console.error("Connection failed:", e)
    } finally {
        await prisma.$disconnect()
    }
}

test()
