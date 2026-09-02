"use client";

import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  addDoc,
  increment,
  Timestamp,
  type PartialWithFieldValue,
} from "firebase/firestore";
import { getSalesDb, ensureSalesAuth } from "@/firebase/sales";
import type {
  Coupon,
  CouponEntry,
  CouponRedemption,
  CouponRedemptionEntry,
} from "@/lib/sales/types";

const COUPONS_COLLECTION = "coupons";
const REDEMPTIONS_COLLECTION = "coupon-redemptions";

/**
 * Cupones del catálogo público — lee la colección de la app (proyecto sales).
 * Las reglas requieren auth != null → se firma anónimamente en background.
 */
export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      try {
        await ensureSalesAuth();
      } catch {
        // Si falla la auth anónima, devolvemos lista vacía (no crítico).
        if (!cancelled) {
          setCoupons([]);
          setLoading(false);
        }
        return;
      }
      if (cancelled) return;
      const db = getSalesDb();
      const q = query(
        collection(db, COUPONS_COLLECTION),
        orderBy("createdAt", "desc")
      );
      unsub = onSnapshot(
        q,
        (snap) => {
          if (cancelled) return;
          setCoupons(
            snap.docs.map((d) => ({ ...d.data(), id: d.id })) as Coupon[]
          );
          setLoading(false);
        },
        () => {
          if (!cancelled) {
            setCoupons([]);
            setLoading(false);
          }
        }
      );
    })();

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  const recordRedemption = useCallback(
    async (redemption: CouponRedemptionEntry) => {
      await ensureSalesAuth();
      const db = getSalesDb();
      const docRef = await addDoc(collection(db, REDEMPTIONS_COLLECTION), {
        ...redemption,
        redeemedAt: Timestamp.now().toDate().toISOString(),
      });
      const couponRef = doc(db, COUPONS_COLLECTION, redemption.couponId);
      await updateDoc(couponRef, {
        usedCount: increment(1),
      } as PartialWithFieldValue<CouponEntry>);
      return docRef.id;
    },
    []
  );

  return { coupons, loading, recordRedemption };
}
