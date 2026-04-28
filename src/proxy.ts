//this file is just for get or creating db and storage in appwrite

import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

import getOrCreateDB from './models/server/dbSetup'
import fetOrCreateStorage from './models/server/storageSetup'

export async function proxy(request: NextRequest) { 
    await Promise.all([
        getOrCreateDB(),
        fetOrCreateStorage(),
    ])
    return NextResponse.next();
}

export const config = {
  /*
   * match all request paths except for the ones that
   * starts with:
   * - api
   * - _next/static
   * - _next/image
   * - favicon.ico
   */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
 
