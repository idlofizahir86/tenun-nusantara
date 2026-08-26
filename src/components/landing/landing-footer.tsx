export function LandingFooter() {
  return (
    <footer className="relative w-full bg-deep-indigo py-12">
      {/* Decorative top border (batik pattern) */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-nusantara-red via-batik-gold to-nusantara-red" />

      <div className="mx-auto max-w-7xl px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Branding */}
          <div className="text-center md:text-left">
            <h3 className="font-fredoka text-2xl font-bold text-warm-cream">
              Tenun Nusantara
            </h3>
            <p className="mt-1 font-caveat text-lg text-batik-gold">
              Merajut Bakat, Menenun Masa Depan
            </p>
          </div>

          {/* Credits */}
          <div className="text-center md:text-right">
            <p className="font-nunito text-sm text-warm-cream/60">
              Dikembangkan dengan ❤️ oleh
            </p>
            <p className="mt-1 font-fredoka text-xl font-bold tracking-wider text-batik-gold">
              ATEAM
            </p>
          </div>
        </div>

        {/* Bottom info */}
        <div className="mt-8 border-t border-warm-cream/10 pt-6 text-center">
          <p className="font-nunito text-xs text-warm-cream/40">
            © 2026 Tenun Nusantara. Platform gamifikasi naratif untuk pemetaan
            minat bakat anak Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
}