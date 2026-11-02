'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** Enquanto o pagamento é confirmado (cartão em segundos, Pix quando cair), relê o pedido a cada 5 s. */
export function Atualizar() {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(t);
  }, [router]);
  return null;
}
