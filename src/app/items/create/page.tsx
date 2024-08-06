import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createItemAction } from "./actions";

export default async function CreatePage() {

    return (
        <main className="container mx-auto py-12 space-y-8">
            <h1 className="text-4xl font-bold">
                Post an Item
            </h1>
            <form
                className="flex flex-col border p-4 rounded-xl space-y-4 max-w-md"
                action={createItemAction}
            >
                <Input
                    required
                    type="text"
                    name="name"
                    placeholder="Name your item"
                />

                <Input
                    required
                    type="number"
                    step={0.01}
                    name="startPrice"
                    placeholder="What should be the starting price..."
                />
                <Button className="self-end" type="submit">Post item</Button>
            </form>
        </main>
    );
}
