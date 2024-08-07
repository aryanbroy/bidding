'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createItemAction } from "./actions";

export default function CreatePage() {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        createItemAction(formData);
    }

    return (
        <main className="container mx-auto py-12 space-y-8">
            <h1 className="text-4xl font-bold">
                Post an Item
            </h1>
            <form
                className="flex flex-col border p-4 rounded-xl space-y-4 max-w-md"
                onSubmit={handleSubmit}
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

                <Input
                    required
                    type="file"
                    name="image"
                    accept="image/*"
                />
                <Button className="self-end" type="submit">Post item</Button>
            </form>
        </main>
    );
}
