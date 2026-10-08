'use client';

export default function ContactPage() {
  return (
    <div className="max-w-md mx-auto px-5 pt-10 pb-8">
      <h1 className="text-2xl font-semibold mb-1">Contact</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Questions, feedback, or feature requests? Reach out anytime.
      </p>

      {/* Developer card */}
      <div className="rounded-3xl border border-zinc-100 dark:border-zinc-800 p-6 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-emerald-900/20">
          KS
        </div>

        <div className="mt-4 text-lg font-semibold">Koushal Suthar</div>
        <div className="text-xs uppercase tracking-wider text-zinc-500 mt-1">
          Developer of QuitTrack
        </div>

        <p className="text-sm text-zinc-500 mt-4 leading-relaxed">
          Built to help people in India quit smoking with clarity and support.
        </p>

        <div className="mt-6 space-y-3">
          {/* Phone */}
          <a
            href="tel:+919649554772"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
            <div className="text-left flex-1">
              <div className="text-xs text-zinc-500">Call</div>
              <div className="text-sm font-medium">+91 96495 54772</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919649554772"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <div className="text-left flex-1">
              <div className="text-xs text-zinc-500">WhatsApp</div>
              <div className="text-sm font-medium">Message instantly</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>

          {/* SMS */}
          <a
            href="sms:+919649554772"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <div className="text-left flex-1">
              <div className="text-xs text-zinc-500">SMS</div>
              <div className="text-sm font-medium">Send a text message</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        </div>
      </div>

      {/* Info block */}
      <div className="mt-8 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed">
        <div className="font-semibold mb-1">About QuitTrack</div>
        QuitTrack helps you track your smoke-free progress, money saved, and health recovery milestones based on WHO / NHS / CDC cessation research.
      </div>

      <p className="text-[11px] text-zinc-500 leading-relaxed text-center mt-8">
        QuitTrack provides estimates and educational information.
        It is not a medical diagnosis or a substitute for professional medical advice.
      </p>
    </div>
  );
}