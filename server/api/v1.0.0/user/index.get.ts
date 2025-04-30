import { H3Event } from 'h3';
import prisma from '~/lib/prisma'

export default defineEventHandler(async(event:H3Event)=>{
    const query = getQuery(event)

    //Page setting
    const rawPage = parseInt(query.page as string) 
    const rawLimit = parseInt(query.limit as string) 
    const page = Math.max(rawPage || 1,1)
    const limit = Math.min( rawLimit > 0 ? rawLimit : 10,100)

    //Filter
    const name = (query.name as string)?.trim() || ''
    const email = (query.email as string)?.trim() || ''
    const where:any = {
        ...(name ? {name: {contains: name,mode:'insensitive'}} : {}),
        ...(email ? {emain: {contains: email, mode:'insensitive'}}: {})
    }

    //Sorting
    const allowedSortFields = ['name','email','updatedAt']
    const sortRaw = (query.sort as string)?.trim() || 'updatedAt'
    const directionRaw = (query.order as string)?.trim()?.toLowerCase() === 'asc' ? 'asc' : 'desc'
    const sortField = allowedSortFields.includes(sortRaw) ? sortRaw : 'updatedAt'
    const orderBy = { [sortField]:directionRaw } as Record<string, 'asc' | 'desc'>
    
    //Counter
    const totalCount = await prisma.user.count({where})
    const totalPage = Math.max(Math.ceil(totalCount/ limit),1)
    const safePage = Math.min(page, totalPage)
    const skip = (safePage - 1) * limit

    //Query data from DB
    const [items, total] = await prisma.$transaction([
        prisma.user.findMany({
            where,
            orderBy,
            skip,
            take:limit,
            include:{
                _count:{select:{devices:true}}
              }
        }),

        prisma.user.count({where}),
    ])

    //Return {items, totoa}
    return{
        success:true,
        pagination:{
            page: safePage,
            limit,
            total,
            totalPage,
        },
        data:items
    }
})