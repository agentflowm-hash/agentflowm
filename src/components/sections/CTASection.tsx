"use client";

import { Button } from "@/components/ui";

interface CTASectionProps {
  headline?: string;
  subheadline?: string;
}

export function CTASection({
  headline = "Pakete ansehen",
  subheadline = "Starten Sie klein - oder bauen Sie den kompletten Ablauf inklusive Publishing und Leads.",
}: CTASectionProps) {
  return (
    <section className="section px-4 sm:px-6">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent2)] to-[var(--color-accent3)] p-6 sm:p-8 md:p-12 lg:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative z-10 text-center text-white">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              {headline}
            </h2>
            <p className="text-sm sm:text-base md:text-lg opacity-90 mb-6 sm:mb-8 max-w-xl mx-auto">
              {subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                href="/pakete"
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[var(--color-accent)]"
              >
                Pakete
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="/termin"
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[var(--color-accent)]"
              >
                Termin buchen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
