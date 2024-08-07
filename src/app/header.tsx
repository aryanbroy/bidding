import { auth } from '@/auth';
import { SignIn } from '@/components/sign-in';
import { SignOut } from '@/components/signout-button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default async function Header() {
  const session = await auth();
  return (
    <div className="bg-gray-200 py-2">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-12">
          <Link href={'/'} className="flex items-center gap-1 hover:underline">
            <Image src={'/logo.png'} width={'50'} height={'50'} alt="Logo" />
            Biddy.com
          </Link>

          <div className="flex items-center gap-8">
            <Link
              href={'/'}
              className="flex items-center gap-1 hover:underline"
            >
              All Auctions
            </Link>
            <Link
              href={'/items/create'}
              className="flex items-center gap-1 hover:underline"
            >
              Create Auction
            </Link>
            <Link
              href={'/auctions'}
              className="flex items-center gap-1 hover:underline"
            >
              My Auctions
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div>{session?.user?.name}</div>
          <div>{session ? <SignOut /> : <SignIn />}</div>
        </div>
      </div>
    </div>
  );
}
