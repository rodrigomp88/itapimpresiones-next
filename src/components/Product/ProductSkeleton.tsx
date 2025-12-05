"use client";

import React from "react";

const ProductSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-pulse">
            {/* Image skeleton */}
            <div className="relative w-full h-64 bg-gray-300 dark:bg-gray-700" />

            {/* Content skeleton */}
            <div className="flex flex-col p-4 gap-2 flex-grow">
                {/* Title skeleton */}
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />

                {/* Description skeleton */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
                </div>

                {/* Price skeleton */}
                <div className="mt-auto pt-2">
                    <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
                </div>
            </div>

            {/* Button skeleton */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg" />
            </div>
        </div>
    );
};

export default ProductSkeleton;
