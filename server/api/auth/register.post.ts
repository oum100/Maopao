import { H3Event } from 'h3';
import prisma from "~/lib/prisma";
import {User, validateNewUser} from '@/models/user'
import bcrypt from 'bcryptjs'
import {customAlphabet} from 'nanoid'

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwzyzABCDEFGHIGKLMNOPQRSTUVWXYZ')

export default defineEventHandler(async(event:H3Event)=> {
    const body = await readBody(event)
    // console.log(body)
    const {error} = validateNewUser(body)
    if(error){
        throw createError({
            statusCode: 500,
            statusMessage: 'Invalid user data'
        })
    }

    //Verify duplicate user
    const foundUser = await prisma.user.findFirst({
        where:{email:body.email}
    })
    if(foundUser){
        throw createError({
            statusCode:500,
            statusMessage:'User already existed'
        })
    }
  
    const nowDateTime = new Date()
    const uuid = nanoid(10)
    // const reverseUuid = (s:string):string => {return [...s].reverse().join("")}
    
    const data = {
        // uuid: uuid,
        name: body.name || undefined,
        email: body.email,
        password: await bcrypt.hash(body.password, bcrypt.genSaltSync(10)),
        appKey: uuid,
        appSecret:nanoid(25),
        createdAt: nowDateTime,
        updatedAt: nowDateTime
    }


    try{
        const newUser = await prisma.user.create({
            data:data
        })

        return {
            success: true,
            statusMessage: 'New user created complete',
            data:{
                ...newUser,
                password:undefined
            }
        }
    }catch(e){
        throw createError({
            statusCode: 500,
            statusMessage: 'Register failed, please try again'
        })

    }

})

