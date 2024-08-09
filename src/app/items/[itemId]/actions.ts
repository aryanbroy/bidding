'use server'

import { auth } from '@/auth'
import { database } from '@/db/database'
import { bids, items } from '@/db/schema'
import { env } from '@/env'
import { Knock } from '@knocklabs/node'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

const knock = new Knock(env.KNOCK_SECRET_KEY)

export async function createBidAction(itemId: number) {
  const session = await auth()

  if (!session || !session.user || !session.user.id) {
    throw new Error('Unauthorized')
  }

  const userId = session.user.id

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

  const currentBids = await database.query.bids.findMany({
    where: eq(bids.itemId, itemId),
    with: {
      user: true
    }
  })

  const distinctUserIds: {
    id: string
    name: string
    email: string
  }[] = []

  for (const bid of currentBids) {
    if (bid.userId !== userId && !distinctUserIds.find((user) => user.id === bid.userId)) {
      distinctUserIds.push({
        id: bid.userId,
        name: bid.user.name || 'Anonymous',
        email: bid.user.email || 'Anonymous'
      })
    }
  }

  if (distinctUserIds.length > 0) {
    await knock.workflows.trigger('biddy', {
      actor: {
        id: session.user.id,
        name: session.user.name ?? 'Anonymous',
        email: session.user.email ?? 'Anonymous',
        collection: 'users'
      },
      recipients: distinctUserIds,
      data: {
        itemId,
        bidAmount: item?.currentBid + item?.bidInterval,
        itemName: item?.name
      }
    })
  }

  revalidatePath(`/items/${itemId}`)
}
