"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 flex justify-center"
    >
      <div className="relative w-full max-w-md">
        <Input
          type="text"
          placeholder="Search discussions..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10"
        />
        <Search className="absolute right-3 top-3 text-gray-400" />
      </div>
    </motion.div>
  );
}