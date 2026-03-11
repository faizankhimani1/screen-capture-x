import Icon from './Icon'
import styles from './Header.module.css'

export default function Header({ onSettingsClick }) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        SCREEN<span className={styles.accent}>CAPTURE</span>X
      </div>
      <div className={styles.tagline}>Free · Browser-Based · No Install</div>
      <button
        className={styles.settingsBtn}
        onClick={onSettingsClick}
        title="Settings"
        aria-label="Open settings"
      >
        <Icon name="settings" size={16} />
      </button>
    </header>
  )
}
