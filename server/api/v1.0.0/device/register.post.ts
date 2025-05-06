import { H3Event } from 'h3';
import prisma from '~/lib/prisma'
import { validateDeviceRegister}  from '~/models/device';


export default defineEventHandler(async(event:H3Event)=>{
    const body = (await readBody(event)) || {};

    const {error} =  validateDeviceRegister(body)
    if(error){
        throw createError({
            statusCode: 500,
            statusMessage: "Invalid input data",
        });    
    }

    //Finding device 
    let device

    if(body.serialNumber){
        const foundDevice = await prisma.device.findUnique({
            where:{serialNumber: body.serialNumber},
            select:{ownerUuid: true}
        })
        const isAssigned = !!foundDevice?.ownerUuid;
        
        if(isAssigned){
           throw createError({
                statusCode:500,
                statusMessage:'This device is already assigned to a user'
           }) 
        }

        try{
            device = await prisma.device.update({
                where:{serialNumber: body.serialNumber},
                data:{
                    ownerUuid: body.userUuid
                },
                include:{
                    owner:{select:{name:true}}
                }
            })
        }catch(e){
            throw createError({
                statusCode:500,
                statusMessage: 'Register owner failed'
            })
        }

        return {
            success:'true',
            description: 'Register owner successfully',
            data:device
        }
        
    }
    
    if(body.macAddress){
        const foundDevice = await prisma.device.findUnique({
            where:{macAddress: body.macAddress},
            select:{ownerUuid: true}
        })
        const isAssigned = !!foundDevice?.ownerUuid;
        
        if(isAssigned){
           throw createError({
                statusCode:500,
                statusMessage:'This device is already assigned to a user'
           }) 
        }

        try{
            device = await prisma.device.update({
                where:{macAddress: body.macAddress},
                data:{
                    ownerUuid: body.userUuid
                },
                include:{
                    owner:{select:{name:true}}
                }
            })
        }catch(e){
            throw createError({
                statusCode:500,
                statusMessage: 'Register owner failed'
            })
        }

        return {
            success:'true',
            description: 'Register owner successfully',
            data:device
        }
    }








})