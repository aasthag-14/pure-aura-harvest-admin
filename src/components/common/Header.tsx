import Link from "next/link";

export const Header = () => (
  <>
    <header className="flex justify-between items-center px-6 py-4 bg-pah-gray shadow-md mb-4">
      <div>
        <Link href="/" className="py-8 text-2xl font-rinstonia font-extrabold">
          Essence & Harvest
        </Link>
      </div>
    </header>
  </>
);
