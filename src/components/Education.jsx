import SectionTitle from "./SectionTitle";


export default function Education() {
  return (
    <div>
      <section className="education glass-gray-200 py-10">
        <SectionTitle title="Education" />
        <div className="edu-item glass-card rounded-md mt-4 text-center p-6 max-w-2xl mx-auto">
          <p className="text-gray-500">Software Engineering</p>
          <p className="text-gray-500">Expected Graduation: 2028</p>
          <h1 className="text-xl font-medium text-gray-700">Dhaka Univarsity</h1>
        </div>
      </section>
    </div>
  );
}
