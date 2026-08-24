import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="pt-36 pb-28 md:py-40 bg-canvas min-h-screen text-primary-dark flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-mint bg-primary-dark px-3 py-1.5 rounded-full inline-block">
          ERROR 404
        </span>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-primary-dark leading-[0.95]">
          PAGE NOT FOUND
        </h1>

        <p className="text-base sm:text-lg text-secondary-dark max-w-lg mx-auto leading-relaxed">
          The route you are looking for has moved, been archived, or does not exist on this digital system.
        </p>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/" variant="primary" size="md" icon>
            RETURN HOME
          </Button>
          <Button href="/work" variant="secondary" size="md">
            VIEW WORK
          </Button>
        </div>
      </div>
    </div>
  );
}
