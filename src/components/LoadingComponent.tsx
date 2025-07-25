import Image from "next/image";
import { Backdrop } from "@mui/material";

export default function LoadingComponent({ open }: { open: boolean }) {
  return (
    <Backdrop
      sx={{ zIndex: (theme: any) => theme.zIndex.drawer + 999999 }}
      open={open}
    >
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
