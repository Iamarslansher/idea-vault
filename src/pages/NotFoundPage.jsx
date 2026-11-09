import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-lg mx-auto py-24 px-4 text-center space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl font-black">
        404
      </div>
      <h1 className="text-2xl font-extrabold text-navy-950">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-600 leading-relaxed">
        The link you followed may be broken or the opportunity may have been moved.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to IdeaVault</span>
        </Link>
      </div>
    </div>
  );
}

