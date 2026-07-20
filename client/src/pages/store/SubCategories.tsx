export default function SubCategories() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
      <div className="max-w-lg text-center animate-fade-in-up">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-5xl mx-auto mb-6 shadow-xl">
          🗂️
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: 'Outfit' }}>
          Sub Categories
        </h1>
        <p className="text-gray-500 text-lg mb-8 leading-relaxed">Dive deeper into a specific category of products.</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-full transition-all shadow-lg hover:shadow-blue-300"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
}
