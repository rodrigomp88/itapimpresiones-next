"use client";

import React, { useEffect, useState } from "react";
import { collection, query, limit, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Product } from "@/types";
import ProductItem from "../Product/ProductItem";

const FeaturedProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                // Fetch 4 most recent products
                const q = query(
                    collection(db, "products"),
                    orderBy("createdAt", "desc"),
                    limit(4)
                );
                const querySnapshot = await getDocs(q);
                const fetched: Product[] = [];
                querySnapshot.forEach((doc) => {
                    fetched.push({ id: doc.id, ...doc.data() } as Product);
                });
                setProducts(fetched);
            } catch (error) {
                console.error("Error fetching featured products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-[400px] w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductItem key={product.id} {...product} />
            ))}
        </div>
    );
};

export default FeaturedProducts;
