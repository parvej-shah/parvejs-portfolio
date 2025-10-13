import { useState, useRef } from "react";
import { FaLocationPin } from "react-icons/fa6";
import { SiMailboxdotorg } from "react-icons/si";
import { Link } from "react-router-dom";
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    // Name validation
    if (formData.name.trim().length < 2) {
      setStatus({ type: "error", message: "Name must be at least 2 characters long." });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return false;
    }

    // Message validation
    if (formData.message.trim().length < 10) {
      setStatus({ type: "error", message: "Message must be at least 10 characters long." });
      return false;
    }

    return true;
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    // Validate form before sending
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Prepare template params for EmailJS
    const templateParams = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      time: new Date().toLocaleString()
    };

    emailjs
      .send(
        'service_rfz5bb9',  // Replace with your EmailJS service ID
        'template_o9ck4y9', // Replace with your EmailJS template ID
        templateParams,
        '8LIpWTqX7mHlzgWsK'   // Replace with your EmailJS public key
      )
      .then(
        () => {
          setStatus({ type: "success", message: "Message sent successfully! I'll get back to you soon." });
          setFormData({ name: "", email: "", message: "" });
          setIsLoading(false);
        },
        (error) => {
          setStatus({ type: "error", message: "Failed to send message. Please try again." });
          console.log('FAILED...', error.text);
          setIsLoading(false);
        }
      );
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
          
          {/* Status Message */}
          {status.message && (
            <div className={`mb-4 p-3 rounded ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {status.message}
            </div>
          )}

          <form ref={form} onSubmit={sendEmail}>
            <div className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="input bg-gray-100 input-bordered w-full"
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
                disabled={isLoading}
                className="input input-bordered bg-gray-100 w-full"
              />
            </div>
            <div className="mb-4">
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="textarea textarea-bordered bg-gray-100 w-full"
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn transition-all duration-300 w-full bg-secondary hover:bg-secondary/80 text-white disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="inline-flex">
                    <span className="animate-wave" style={{ animationDelay: '0s' }}>S</span>
                    <span className="animate-wave" style={{ animationDelay: '0.1s' }}>e</span>
                    <span className="animate-wave" style={{ animationDelay: '0.2s' }}>n</span>
                    <span className="animate-wave" style={{ animationDelay: '0.3s' }}>d</span>
                    <span className="animate-wave" style={{ animationDelay: '0.4s' }}>i</span>
                    <span className="animate-wave" style={{ animationDelay: '0.5s' }}>n</span>
                    <span className="animate-wave" style={{ animationDelay: '0.6s' }}>g</span>
                  </span>
                  <span className="inline-flex ml-1">
                    <span className="animate-wave" style={{ animationDelay: '0.7s' }}>.</span>
                    <span className="animate-wave" style={{ animationDelay: '0.8s' }}>.</span>
                    <span className="animate-wave" style={{ animationDelay: '0.9s' }}>.</span>
                  </span>
                </span>
              ) : (
                "Send"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
