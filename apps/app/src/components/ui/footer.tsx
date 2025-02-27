import Link from "next/link"
import React from "react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto flex flex-col items-center">
        <div className="grid grid-cols-1 gap-52 md:grid-cols-3">
          <div>
            <h3 className="mb-4 font-semibold">À propos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about">Notre histoire</Link>
              </li>
              <li>
                <Link href="/team">L&apos;équipe</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy">Politique de confidentialité</Link>
              </li>
              <li>
                <Link href="/terms">Conditions d&apos;utilisation</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 h-1 w-full border-t border-white"></div>

        <div className="mb-14 mt-8 pt-8 text-center">
          <p>© {currentYear} VotreApp. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
