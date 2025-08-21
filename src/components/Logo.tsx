"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface LogoProps {
  width: number;
  height: number;
  logoName?: boolean;
}

export const Logo = ({ width, height, logoName }: LogoProps) => {
  return (
    <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className=""
        >
    <Link href="/" className="cursor-pointer">
            <div className="flex items-center gap-2">
                <Image
                    src="https://raw.githubusercontent.com/abdoulaydiallo/design/refs/heads/main/assets/icons/logo.svg"
                    width={width}
                    height={height}
                    className="aspect-square"
                    priority
                    alt="Logo"
                />
                {logoName && (<p className="text-2xl font-bold">TransDigit</p>)}
            </div>
    </Link>
        </motion.div>
  );
};