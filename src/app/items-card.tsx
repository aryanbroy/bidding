import React from 'react'
import { Item } from '@/db/schema'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatToDollar } from '@/utils/currency'

export default function ItemCard({ item }: { item: Item }) {
  return (
    <div key={item.id} className="border p-8 rounded-xl space-y-2">
      <Image src={item.image} alt={item.name} width={400} height={200} />
      <p className="text-xl font-bold">{item.name}</p>

      <p className="text-lg">starting price : ${formatToDollar(item.startingPrice)}</p>
      <Button asChild>
        <Link href={`/items/${item.id}`}>Place Bid</Link>
      </Button>
    </div>
  )
}
