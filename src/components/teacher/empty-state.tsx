"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

// Panel kosong untuk area guru — panduan ke tindakan berikutnya.
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-[#FFB319]/40 bg-[#0F3943]/50 px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#144955] text-[#FFB319]">
        <Icon size={28} />
      </span>
      <div className="flex flex-col gap-1.5">
        <h3 className="font-outfit text-lg font-extrabold text-white">{title}</h3>
        <p className="mx-auto max-w-md font-manrope text-sm text-[#8DA2A6]">{description}</p>
      </div>
      {action && (
        <Link
          href={action.href}
          className="mt-2 inline-flex items-center gap-2 rounded-[32px] bg-[#FFB319] px-6 py-3 font-outfit text-sm font-extrabold uppercase text-[#0B1D23] transition hover:brightness-110"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
