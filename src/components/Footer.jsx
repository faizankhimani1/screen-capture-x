import Icon from './Icon'
import styles from './Footer.module.css'

const YEAR = new Date().getFullYear()

const LINKS = [
  {
    label: 'GitHub',
    icon: 'github',
    href: 'https://github.com/faizankhimani1',
    title: 'Faizan on GitHub',
  },
  {
    label: 'LinkedIn',
    icon: 'linkedin',
    href: 'https://www.linkedin.com/in/faizan-khimani-',
    title: 'Faizan on LinkedIn',
  },
  {
    label: 'WhatsApp',
    icon: 'whatsapp',
    href: 'https://wa.me/911234567890',
    title: 'Chat on WhatsApp',
  },
  {
    label: 'Portfolio',
    icon: 'globe',
    href: 'https://faizankhimani.netlify.app/',
    title: 'Faizan\'s Portfolio',
  },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Privacy note */}
      <div className={styles.privacyNote}>
        🔒 All recordings stay on your device — nothing is uploaded to any server
      </div>

      <div className={styles.divider} />

      {/* Social links */}
      <div className={styles.social}>
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            title={link.title}
            aria-label={link.title}
          >
            <Icon name={link.icon} size={15} />
            <span>{link.label}</span>
          </a>
        ))}
      </div>

      {/* Copyright */}
      <div className={styles.copyright}>
        © {YEAR} ScreenCaptureX — Developed by{' '}
        <a
          href="https://faizankhimani.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.nameLink}
        >
          Faizan Khimani
        </a>
        . All rights reserved.
      </div>
    </footer>
  )
}
