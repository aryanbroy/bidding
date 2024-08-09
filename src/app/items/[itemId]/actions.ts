'use server'

import { auth } from '@/auth'
import { database } from '@/db/database'
import { bids, items } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createBidAction(itemId: number) {
  const session = await auth()

  if (!session || !session.user || !session.user.id) {
    throw new Error('Unauthorized')
  }

  const item = await database.query.items.findFirst({
    where: eq(items.id, itemId)
  })

  if (!item) {
    throw new Error('No such item exists')
  }

  await database.insert(bids).values({
    amount: item?.currentBid + item?.bidInterval,
    itemId,
    userId: session.user.id,
    timestamp: new Date()
  })

  await database
    .update(items)
    .set({
      currentBid: item?.currentBid + item?.bidInterval
    })
    .where(eq(items.id, itemId))

  revalidatePath(`/items/${itemId}`)
}
