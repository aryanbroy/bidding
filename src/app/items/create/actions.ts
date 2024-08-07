'use server'

import { auth } from '@/auth';
import { database } from '@/db/database';
import { items } from '@/db/schema';
import { redirect } from 'next/navigation';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function createItemAction(formData: FormData) {

    const session = await auth();

    if (!session) {
        throw new Error("Unauthorized")
    }

    const user = session.user;

    if (!user || !user.id) {
        {
            throw new Error("Unauthorized")
        }
    }

    try {

        const imageFile = formData.get('image') as File;
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            )
            streamifier.createReadStream(buffer).pipe(uploadStream);
        })

        const uploadResult = await uploadPromise as any;

        await database.insert(items).values({
            name: formData.get('name') as string,
            userId: user.id,
            startingPrice: formData.get("startPrice") as string,
            image: uploadResult.url
        });
    } catch (error) {
        console.log(error)
    }

    redirect("/");
}