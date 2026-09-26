export default function Footer() {
  return (
    <footer className="bg-navy-950 text-ink-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex items-center gap-2 text-white col-span-2">
          <span className="font-bold text-lg">Nexora</span>
        </div>
        <div>
          <p className="text-white font-medium mb-2">Shop</p>
          <ul className="space-y-1">
            <li>Fashion</li>
            <li>Electronics</li>
            <li>Home & Living</li>
          </ul>
        </div>
        <div>
          <p className="text-white font-medium mb-2">Support</p>
          <ul className="space-y-1">
            <li>Help Center</li>
            <li>Returns</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}