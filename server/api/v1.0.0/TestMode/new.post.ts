import { H3Event } from "h3";
import { PrismaClient } from "@prisma/client";
import { validateTestMode } from "@/models/testmode";
import { valid } from "joi";

const prisma = new PrismaClient();

export default defineEventHandler(async (event:H3Event) => {
    const body = await readBody(event);
    if(!body){
        throw createError({
            statusCode: 500,
            statusMessage: "Missing body",
        })        
    }

    const { error } = validateTestMode(body);
    let result:string = ''

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.details[0].message,
        }) 
    }

    //if duplicate code
    const foundCode = await prisma.testMode.findUnique({
        where:{code:body.code}
    })
    if(foundCode){
        result = "Duplicate code. "
    }

    //if duplicate name
    const foundName = await prisma.testMode.findFirst({
        where:{ name: body.name}
    })
    if(foundName){
        result = result + "Duplicate name. "
    }

    if(!result){
        const data = await prisma.testMode.create({
            data: {
            code: body.code,
            name: body.name
            },
        });
        return { 
            status:200,
            description:"Create success",
            data:data 
        }
    }else{
        return {
            statusCode:500,
            statusMessage:result,
        };
    }

});
