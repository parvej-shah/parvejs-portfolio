import  { useState } from "react";
import { FaLocationPin } from "react-icons/fa6";
import { SiMailboxdotorg } from "react-icons/si";
import { Link } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendEmail = (e) => {
    e.preventDefault();
  };

  return (
    <section id="contact" className="w-full px-4 py-10 bg-gray-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Address Section */}
        <div className="rounded-lg p-6">
          <ul className="mt-4">
            <li className="mb-2 flex items-center gap-2">
              <strong><FaLocationPin className="text-red-500 text-2xl"/></strong> Amar Ekushe Hall, University of Dhaka, Dhaka.
            </li>
            <li className="flex items-center gap-2">
              <Link to="mailto:parvejshahlabib007@gmail.com" className="hover:text-red-500 flex items-center gap-2">
                  <strong><SiMailboxdotorg className="text-2xl text-red-500"/></strong>parvejshahlaib007@gmail.com
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <div className="rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Send a Message</h1>
          <form onSubmit={sendEmail}>
            <div className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="input bg-gray-100  input-bordered w-full"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="input input-bordered bg-gray-100  w-full"
              />
            </div>
            <div className="mb-4">
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleInputChange}
                required
                className="textarea textarea-bordered bg-gray-100 w-full"
              ></textarea>
            </div>
            <button type="submit" className="btn transition-all duration-300 w-full bg-secondary hover:bg-secondary/80 text-white">
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
