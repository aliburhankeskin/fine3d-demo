"use client";

import Image from "next/image";
import { Backdrop } from "@mui/material";

export default function Loading() {
  return (
    <Backdrop open>
      <Image
        priority
        width={250}
        height={100}
        src="/favicon.svg"
        alt="fine hub loading Logo"
        className="rotating-image"
      />
    </Backdrop>
  );
}
