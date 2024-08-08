import { database } from '@/db/database'
import ItemCard from './items-card'
import { pageTitleStyles } from '@/styles'

export default async function Home() {
  const allItems = await database.query.items.findMany()

  return (
    <main className="space-y-8">
      <h1 className={pageTitleStyles}>Items For Sale</h1>

      <div className="grid grid-cols-4 gap-8">
        {allItems?.map((item) => <ItemCard key={item.id} item={item} />)}
      </div>
    </main>
  )
}
