import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const earnings = await prisma.transaction.aggregate({
            where: {
                userId: userId,
                type: 'EARNING',
            },
            _sum: {
                amount: true,
            },
        })

        const expenses = await prisma.transaction.aggregate({
            where: {
                userId: userId,
                type: 'EXPENSE',
            },
            _sum: {
                amount: true,
            },
        })

        const investments = await prisma.transaction.aggregate({
            where: {
                userId: userId,
                type: 'INVESTMENT',
            },
            _sum: {
                amount: true,
            },
        })

        const totalEarnings = Number(earnings._sum.amount) || 0
        const totalExpenses = Number(expenses._sum.amount) || 0
        const totalInvestments = Number(investments._sum.amount) || 0
        const balance = totalEarnings - totalExpenses - totalInvestments

        return {
            balance,
            earnings: totalEarnings,
            expenses: totalExpenses,
            investments: totalInvestments,
        }
    }
}
