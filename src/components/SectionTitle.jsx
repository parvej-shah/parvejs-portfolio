

// eslint-disable-next-line react/prop-types
export default function SectionTitle({title}) {
  return (
    <div className="flex justify-center items-center">
        <div className="px-4 w-fit py-1 text-sm font-semibold text-gray-900 bg-gray-100 rounded-full">{title}</div>
    </div>
  )
}
