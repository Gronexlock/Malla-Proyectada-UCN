"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ThemeLogoProps {
  src: string;
  alt: string;
}

export function ThemeLogo({ src, alt }: ThemeLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const imageSrc =
    resolvedTheme === "dark" ? `/${src}-dark.png` : `/${src}.png`;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={0}
      height={0}
      sizes="100vw"
      className="h-full w-auto object-contain"
    />
  );
}
