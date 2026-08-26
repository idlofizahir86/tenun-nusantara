export default function StudentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="min-h-screen">
      <h1 className="font-fredoka text-h1 text-deep-indigo">Siswa: {params.id}</h1>
    </main>
  );
}
