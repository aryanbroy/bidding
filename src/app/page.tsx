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
    <main className="container mx-auto py-12">

      {session ? <SignOut /> : <SignIn />}

      {session?.user?.name}

      <form action={async (formdata: FormData) => {
        'use server'
        // const bid = formdata.get('bid') as string;
        await database.insert(items).values({
          name: formdata.get('name') as string,
          userId: session?.user?.id!
        });
        revalidatePath("/");
      }}
      >
        <Input type="text" name="name" placeholder="Name your item" />
        <Button type="submit">Post item</Button>
      </form>

      {allItems?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </main>
  );
}
