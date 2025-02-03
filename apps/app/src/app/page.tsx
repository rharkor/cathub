"use client";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@heroui/react";

export default function Home() {
  const { data } = trpc.me.test.useQuery();
  console.log(data);
  return <Button>Test</Button>;
}
