'use client'
import { Button } from '@/components/ui/button'
import { NotificationCell, NotificationFeedPopover, NotificationIconButton } from '@knocklabs/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

export default function Header() {
  const [isVisible, setIsVisible] = useState(false)
  const notifButtonRef = useRef(null)
  const session = useSession()
  const userId = session.data?.user?.id
  return (
    <div className="bg-gray-200 py-2">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-12">
          <Link href={'/'} className="flex items-center gap-1 hover:underline">
            <Image src={'/logo.png'} width={'50'} height={'50'} alt="Logo" />
            Biddy.com
          </Link>

          <div className="flex items-center gap-8">
            <Link href={'/'} className="flex items-center gap-1 hover:underline">
              All Auctions
            </Link>
            {userId && (
              <>
                <Link href={'/items/create'} className="flex items-center gap-1 hover:underline">
                  Create Auction
                </Link>
                <Link href={'/auctions'} className="flex items-center gap-1 hover:underline">
                  My Auctions
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <NotificationIconButton
              ref={notifButtonRef}
              onClick={(e) => setIsVisible(!isVisible)}
            />
            <NotificationFeedPopover
              buttonRef={notifButtonRef}
              isVisible={isVisible}
              onClose={() => setIsVisible(false)}
              renderItem={({ item, ...props }) => (
                <NotificationCell {...props} item={item}>
                  <div onClick={() => setIsVisible(false)}>
                    <Link href={`/items/${item?.data?.itemId}`}>
                      Someone outbidded you on
                      <span className="font-bold"> {item?.data?.itemName}</span>!
                    </Link>
                  </div>
                </NotificationCell>
              )}
            />
          </div>
          <div>{session?.data?.user?.name}</div>
          <div>
            {userId ? (
              <Button
                type="submit"
                onClick={() =>
                  signOut({
                    callbackUrl: '/'
                  })
                }
              >
                Sign Out
              </Button>
            ) : (
              <Button type="submit" onClick={() => signIn()}>
                Sign in
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
