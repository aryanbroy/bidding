import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export function EmptyState() {
  return (
    <div className="space-y-8 flex flex-col justify-center items-center">
      <Image src="/void.svg" width={200} height={200} alt="Void" />
      <h2 className="text-2xl font-bold">You have no current auctions</h2>
      <Button asChild>
        <Link href={'/items/create'}>Create Auction</Link>
      </Button>
    </div>
  )
}
