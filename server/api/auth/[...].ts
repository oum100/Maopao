import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { NuxtAuthHandler } from '#auth'
import prisma from '~/lib/prisma'
import {User} from '@/models/user'
import bcrypt from 'bcryptjs'


export default NuxtAuthHandler({
  // TODO: SET A STRONG SECRET, SEE https://sidebase.io/nuxt-auth/configuration/nuxt-auth-handler#secret
  secret: process.env.AUTH_SECRET,
  // TODO: ADD YOUR OWN AUTHENTICATION PROVIDER HERE, READ THE DOCS FOR MORE: https://sidebase.io/nuxt-auth

  pages:{
    signIn:'/auth/signin',
    error: '/auth/error',
    newUser: '/auth/signup'
  },

  // pages: {
  //   signIn: '/auth/signIn',
  //   signOut: '/auth/signOut',
  //   error: '/auth/error',
  //   verifyRequest: '/auth/verify-request',
  //   newUser: '/auth/new-user'
  // },

  providers: [
    // @ts-expect-error
    GithubProvider.default({
      clientId: process.env.GITHUB_CLIENT_ID || 'enter-your-client-id-here',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'enter-your-client-secret-here'

      
    }),

    // @ts-expect-error
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID || 'enter-your-client-id-here',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'enter-your-client-secret-here'
    }),

    // @ts-expect-error
    CredentialsProvider.default({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      // credentials: {
      //   email: { label: 'Email', type: 'text', placeholder: '(hint: jsmith)' },
      //   password: { label: 'Password', type: 'password', placeholder: '(hint: hunter2)' }
      // },

      async authorize (credentials: any) {
        // console.warn('Authorization in progress')

        //Getting user from credential information
        // const user = { id: '1', name: 'J Smith', username: 'jsmith', password: 'hunter2' }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
       
        //If user not found.
        if(!user) return null
        
        //Verify password.......Vercel slow for this compare
        const isValid =  await bcrypt.compare(credentials.password, user.password!)
        if (!isValid) return null
       

        //Return valid user information
        return {
          uuid: user.uuid,
          email: user.email
        }
      }
    })
  ],

  //Session 
  session:{ strategy: "jwt"},

  //Callback
  callbacks:{
    async signIn({user,account,profile,email,credentials}){

      //Check type of provider
      if(account?.provider !== 'credentials'){
        if (!account || !profile?.email) return false

        const email = profile?.email
        console.log("user",email)

        const socialUser = await prisma.user.findUnique({
          where:{email}
        })
        //Check exiting user
        // if(!socialUser){
        //   console.log("Creating socialUser",socialUser)
        //   await prisma.user.create({
        //     data:{
        //       email: email,
        //       name: profile.name??'',
        //       provider: account?.profider as string ?? 'unknown' 
        //     }
        //   })
        //   return false
        // }
      }
      return true
    },
    async jwt({token,user,account,profile}){
        // console.log('Token Before: ',token)
        // console.log("Account: ",account)
        // console.log("Profile: ",profile)
        if(user){
            // console.log("jwt callback: ",user)
            token = {
                ...token,
                ...user
            }
        }
        // console.log('Token After: ',token)
        return token
    },

    async session({session,token}){
        // console.log('Session Before: ',session)
        session.user = {
            ...token,
            ...session.user,
        }
        // console.log('Session After: ',session)
        return session
    },
  },
  
})