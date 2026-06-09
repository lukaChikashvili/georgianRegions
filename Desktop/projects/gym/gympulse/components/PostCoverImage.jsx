"use client"
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function PostCoverImage({ imageId }) {
    const imageUrl = useQuery(
        api.posts.getImageUrl,
        imageId ? { imageId } : "skip"
    )

    if (!imageUrl) return (
        <div className="w-full h-full bg-gradient-to-br from-[#121212] to-[#050505]" />
    )

    return (
        <img
            src={imageUrl}
            alt="cover"
            className="w-full h-full object-cover"
        />
    )
}