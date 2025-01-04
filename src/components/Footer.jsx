import SocialLinks from './SocialLinks'

export default function Footer() {
  return (
    <div><footer className="footer bg-neutral text-neutral-content items-center p-4">
    <aside className="grid-flow-col items-center">
      <p>Copyright © {new Date().getFullYear()} - Parvej Shah Labib</p>
    </aside>
    <SocialLinks />
  </footer></div>
  )
}
