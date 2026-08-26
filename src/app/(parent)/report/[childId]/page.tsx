export default function ChildReportPage({
  params,
}: {
  params: { childId: string };
}) {
  return (
    <main className="min-h-screen">
      <h1 className="font-fredoka text-h1 text-deep-indigo">
        Laporan Anak: {params.childId}
      </h1>
    </main>
  );
}
