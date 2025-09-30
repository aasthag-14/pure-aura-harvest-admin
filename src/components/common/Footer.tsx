import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-pah-gray text-white mt-4" aria-label="Site footer">
      {/* Main Footer Content */}
      <div className="container mx-auto px-3 py-8">
        <nav
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          aria-label="Footer navigation"
        >
          {/* Brand Info */}
          <section aria-labelledby="brand-info" className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <svg viewBox="0 0 400 80" className="w-full h-auto text-gray-700">
                <text
                  x="0"
                  y="50"
                  className="font-rinstonia font-extrabold text-3xl"
                  fill="currentColor"
                >
                  Essence
                </text>

                <text
                  x="130"
                  y="60"
                  className="font-rinstonia font-extrabold text-6xl"
                  fill="currentColor"
                >
                  &amp;
                </text>

                <text
                  x="200"
                  y="50"
                  className="font-rinstonia font-extrabold text-3xl"
                  fill="currentColor"
                >
                  Harvest
                </text>
              </svg>
            </Link>
            <p id="brand-info" className="text-black/80 text-xs leading-snug">
              Bringing you the purest organic products, premium car perfumes,
              aromatherapy oil and fragrance oils.
            </p>
          </section>

          {/* Pure Aura Harvest Links */}
          <section aria-labelledby="pure-aura-harvest">
            <h2
              id="pure-aura-harvest"
              className="text-sm font-semibold text-[#393831] mb-2"
            >
              Pure Aura Harvest
            </h2>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/products/moringa-powder"
                  className="text-black/80 text-xs transition-colors hover:text-black"
                >
                  Moringa Powder
                </Link>
              </li>
              <li>
                <Link
                  href="/products/turmeric-powder"
                  className="text-black/80 text-xs transition-colors hover:text-black"
                >
                  Turmeric Powder
                </Link>
              </li>
              <li>
                <Link
                  href="/products/lemongrass-leaves"
                  className="text-black/80 text-xs transition-colors hover:text-black"
                >
                  Lemongrass Leaves
                </Link>
              </li>
            </ul>
          </section>

          {/* Luxe Aroma Links */}
          <section aria-labelledby="luxe-aroma">
            <h2
              id="luxe-aroma"
              className="text-sm font-semibold text-[#393831] mb-2"
            >
              Luxe Aroma
            </h2>
            <ul className="space-y-1.5"></ul>
          </section>

          {/* Contact Info */}
          <section aria-labelledby="contact-us">
            <h2
              id="contact-us"
              className="text-sm font-semibold text-[#393831] mb-2"
            >
              Contact Us
            </h2>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[#393831]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:essenceandharvest@gmail.com"
                  className="text-black/80 text-xs hover:text-black"
                  title="Send an email"
                >
                  essenceandharvest@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[#393831]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:919695220161"
                  className="text-black/80 text-xs hover:text-black"
                  title="Call us"
                >
                  +91 9695220161
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[#393831]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-black/80 text-xs">India</span>
              </li>
            </ul>
          </section>
        </nav>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/10">
        <div className="container mx-auto px-3 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-black/60 text-[11px]">
              © {new Date().getFullYear()} Essence & Harvest. All rights
              reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="/about-us"
                className="text-black/60 text-[11px] transition-colors hover:text-black"
              >
                About Us
              </Link>
              <Link
                href="/blogs"
                className="text-black/60 text-[11px] transition-colors hover:text-black"
              >
                Blog
              </Link>
              <Link
                href="/privacy-policy"
                className="text-black/60 text-[11px] transition-colors hover:text-black"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-black/60 text-[11px] transition-colors hover:text-black"
              >
                Terms of Service
              </Link>
              <Link
                href="/shipping-policy"
                className="text-black/60 text-[11px] transition-colors hover:text-black"
              >
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
