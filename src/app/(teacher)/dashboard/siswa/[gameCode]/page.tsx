"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, SearchX } from "lucide-react";
import { useClassRoster } from "@/hooks/use-class-roster";
import { StudentDetail } from "@/components/teacher/student-detail";
import { PageLoading } from "@/components/ui/page-loading";

export default function StudentDetailPage() {
  const { gameCode } = useParams<{ gameCode: string }>();
  const { students, loading } = useClassRoster();

  if (loading) return <PageLoading label="Memuat profil siswa…" />;

  const student = students.find((s) => s.gameCode === gameCode);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard/daftar-siswa"
        className="inline-flex w-fit items-center gap-2 font-manrope text-sm font-bold text-[#19D29F] hover:text-[#FFB319]"
      >
        <ArrowLeft size={16} /> Kembali ke Daftar Siswa
      </Link>

      {student ? (
        <StudentDetail student={student} />
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-[#FFB319]/40 bg-[#0F3943]/50 px-6 py-16 text-center">
          <SearchX size={28} className="text-[#8DA2A6]" />
          <p className="font-manrope text-sm text-[#8DA2A6]">
            Siswa dengan kode <span className="font-bold text-[#FFB319]">{gameCode}</span> tidak ditemukan di
            kelas aktif.
          </p>
        </div>
      )}
    </div>
  );
}
