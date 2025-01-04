// eslint-disable-next-line react/prop-types
export default function CVButton({isNav}) {
  return (
    <button className={`btn ${isNav && "btn-sm"} hover:text-secondary bg-gray-50 border-secondary bg-secondary/10 text-secondary transition-all hover:bg-secondary/30 hover:border-secondary/80 hover:shadow-md hover:shadow-secondary/50 transform duration-300`}>Download CV</button>
  )
}
