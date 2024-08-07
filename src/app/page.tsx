import { auth } from "@/auth";
import { database } from "@/db/database";
import Image from "next/image";
import ItemCard from "./items-card";

export default async function Home() {

  const allItems = await database.query.items.findMany();
  const session = await auth();

  return (
    <main className="container mx-auto py-12 space-y-8">
      <h1 className="text-4xl font-bold">
        Items For Sale
      </h1>

      <div className="grid grid-cols-4 gap-8">

        {allItems?.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}

      </div>
    </main>
  );
}
