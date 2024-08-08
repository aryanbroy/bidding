'use server'

import { Button } from '@/components/ui/button'
import { database } from '@/db/database'
import { items } from '@/db/schema'
import { pageTitleStyles } from '@/styles'
import { eq } from 'drizzle-orm'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistance } from 'date-fns'
import { formatToDollar } from '@/utils/currency'

function formatTimestamp(timeStamp: Date) {
  return formatDistance(timeStamp, new Date(), { addSuffix: true })
}

const bids = []

// const bids = [
//   {
//     id: 1,
//     amount: 100,
//     userName: "Bidder 1",
//     timeStamp: new Date()
//   },
//   {
//     id: 2,
//     amount: 200,
//     userName: "Bidder 2",
//     timeStamp: new Date()
//   },
//   {
//     id: 3,
//     amount: 300,
//     userName: "Bidder 3",
//     timeStamp: new Date()
//   }
// ]

export default async function ItemPage({ params: { itemId } }: { params: { itemId: string } }) {
  const item = await database.query.items.findFirst({
    where: eq(items.id, parseInt(itemId))
  })

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
              Starting price: <span className="font-bold">${item?.startingPrice}</span>
            </div>
            <div>
              Bid Interval: <span className="font-bold">${formatToDollar(item.bidInterval)}</span>
            </div>
          </div>
        </div>
        <div className="space-y-4 flex-1">
          <h2 className="text-2xl font-bold">Current Bids</h2>
          {bids.length > 0 ? (
            <ul className="space-y-4">
              {bids.map((bid) => (
                <li key={bid.id} className="bg-gray-100 rounded-xl p-8">
                  <div className="flex gap-4">
                    <div>
                      <span className="font-bold">${bid.amount}</span> by
                      <span className="font-bold"> {bid.userName}</span>
                    </div>
                    <div> {formatTimestamp(bid.timeStamp)}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-xl p-12">
              <Image src="/void.svg" width={200} height={200} alt="Void" />
              <h2 className="text-2xl font-bold">No bids yet!</h2>
              <Button asChild>
                <Link href={`/items/${item.id}`}>Place a Bid</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
