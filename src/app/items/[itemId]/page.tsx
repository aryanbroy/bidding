'use server'

import { Button } from '@/components/ui/button'
import { getBidsForItem } from '@/data-access/bids'
import { getItem } from '@/data-access/items'
import { pageTitleStyles } from '@/styles'
import { formatToDollar } from '@/utils/currency'
import { formatDistance } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { createBidAction } from './actions'
import { auth } from '@/auth'

function formatTimestamp(timeStamp: Date) {
  return formatDistance(timeStamp, new Date(), { addSuffix: true })
}

export default async function ItemPage({ params: { itemId } }: { params: { itemId: string } }) {
  const session = await auth()

  const allBids = await getBidsForItem(parseInt(itemId))

  const item = await getItem(parseInt(itemId))

  const canPlaceBid = session && item?.userId !== session.user.id

  if (!item) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center mt-12">
        <Image src="/location.svg" width={200} height={200} alt="Void" />
        <h1 className={pageTitleStyles}>Item not found!</h1>
        <p>No such items found. Please go back and find another item</p>
        <Button asChild>
          <Link href={'/'}>Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="space-y-8">
      <div className="flex gap-8">
        <div className="flex flex-col gap-6">
          <h1 className={pageTitleStyles}>
            <span className="font-normal">Auction for: </span>
            {item?.name}
          </h1>
          <Image className="rounded-xl" src={item.image} alt={item.name} width={400} height={200} />
          <div className="text-xl space-y-4">
            <div>
              Starting price:{' '}
              <span className="font-bold">${formatToDollar(item?.startingPrice)}</span>
            </div>
            <div>
              Current price:{' '}
              <span className="font-bold">
                ${formatToDollar(item.startingPrice + item.currentBid)}
              </span>
            </div>
            <div>
              Bid Interval: <span className="font-bold">${formatToDollar(item.bidInterval)}</span>
            </div>
          </div>
        </div>
        <div className="space-y-4 flex-1">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold">Current Bids</h2>
            {canPlaceBid && (
              <form action={createBidAction.bind(null, item.id)}>
                <Button>Place a Bid</Button>
              </form>
            )}
          </div>
          {allBids.length > 0 ? (
            <ul className="space-y-4">
              {allBids.map((bid) => (
                <li key={bid.id} className="bg-gray-100 rounded-xl p-8">
                  <div className="flex gap-4">
                    <div>
                      <span className="font-bold">${formatToDollar(bid.amount)}</span> by
                      <span className="font-bold"> {bid.user.name}</span>
                    </div>
                    <div> {formatTimestamp(bid.timestamp)}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-xl p-12">
              <Image src="/void.svg" width={200} height={200} alt="Void" />
              <h2 className="text-2xl font-bold">No bids yet!</h2>
              {canPlaceBid && (
                <form action={createBidAction.bind(null, item.id)}>
                  <Button>Place a Bid</Button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
