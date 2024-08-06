import Image from "next/image";
import { database } from "@/db/database";
import { bids as bidsSchema, items } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { revalidatePath } from "next/cache";
import { SignIn } from "@/components/sign-in";
import { SignOut } from "@/components/signout-button";
import { auth } from "@/auth";

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
          <div key={item.id} className="border p-8 rounded-xl">
            <p>{item.name}</p>

            <p>starting price : ${item.startingPrice}</p>
          </div>
        ))}

      </div>
    </main>
  );
}
