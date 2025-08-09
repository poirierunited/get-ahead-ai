"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { cn, getTechLogos } from "@/lib/utils";

interface TechIconProps {
  techStack: string[];
}

const DisplayTechIcons = ({ techStack }: TechIconProps) => {
  const [techIcons, setTechIcons] = useState<
    Array<{ tech: string; url: string }>
  >([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchTechIcons = async () => {
      try {
        const icons = await getTechLogos(techStack);
        setTechIcons(icons);
      } catch (error) {
        console.error("Error fetching tech icons:", error);
      }
    };

    fetchTechIcons();
  }, [techStack]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex flex-row">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className={cn(
              "relative group bg-dark-300 rounded-full p-2 flex flex-center w-9 h-9 animate-pulse",
              index >= 1 && "-ml-3"
            )}
          >
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-dark-300 rounded-full p-2 flex flex-center",
            index >= 1 && "-ml-3"
          )}
        >
          <span className="tech-tooltip">{tech}</span>

          <Image
            src={url}
            alt={tech}
            width={100}
            height={100}
            className="size-5"
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;
