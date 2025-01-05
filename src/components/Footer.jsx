import SocialLinks from './SocialLinks'

export default function Footer() {
  return (
    <div><footer className="flex flex-col gap-4 justify-center bg-neutral text-neutral-content items-center p-4">
    <SocialLinks />
    <aside className="text-center items-center">
      <p>Copyright © {new Date().getFullYear()} - Parvej Shah Labib</p>
    </aside>
  </footer></div>
  )
}
