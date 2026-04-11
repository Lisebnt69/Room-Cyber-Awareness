// Theme-aware ROOMCA logo — switches between dark/light variants automatically
import { useTheme } from '../context/ThemeContext'

export default function BrandLogo({ style = {}, alt = 'ROOMCA', height = 32, forceVariant }) {
  const { theme } = useTheme() || { theme: 'dark' }
  const variant = forceVariant || theme
  const src = variant === 'light' ? '/assets/roomca-logo-light.png' : '/assets/roomca-logo-dark.png'

  return (
    <img
      src={src}
      alt={alt}
      style={{ height: `${height}px`, width: 'auto', display: 'block', ...style }}
    />
  )
}
