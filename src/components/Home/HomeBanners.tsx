"use client";

import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import Slider from "@/components/Carousel/Slider";
import { sliderData as defaultSliderData } from "@/components/Carousel/data";
import { Banner } from "@/types";

const HomeBanners = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const q = query(collection(db, "banners"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const fetchedBanners: Banner[] = [];
                    querySnapshot.forEach((doc) => {
                        fetchedBanners.push({ id: doc.id, ...doc.data() } as Banner);
                    });
                    setBanners(fetchedBanners);
                } else {
                    // If no banners in DB, use default hardcoded ones
                    setBanners(defaultSliderData);
                }
            } catch (error) {
                console.error("Error fetching homepage banners:", error);
                // Fallback on error
                setBanners(defaultSliderData);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    if (loading) {
        // Optional: Skeleton or just render default while loading to avoid layout shift? 
        // For now, rendering nothing or a simple placeholder is fine. 
        // Actually, let's render defaultData quickly or just a skeleton container.
        return <div className="w-full h-[300px] md:h-[450px] bg-gray-100 dark:bg-zinc-900 animate-pulse" />;
    }

    // Double check if banners is empty (shouldn't be due to fallback logic), but good specific
    const finalSlides = banners.length > 0 ? banners : defaultSliderData;

    return <Slider slides={finalSlides} />;
};

export default HomeBanners;
