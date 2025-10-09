"use client"; 

import React, { useState } from "react";
import Image from "next/image";
import Heading from "../components/Heading";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", number: "", message: "" });
  };

  return (
    <div>
      <section className="hero-section h-[500px] relative bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="text-center px-6">
          <h2 className="font-rose text-[32px] text-white mb-4">
            Get in Touch with Raajsi
          </h2>
          <p className="font-avenir-400 text-[18px] text-white max-w-[600px] mx-auto">
            Luxury meets responsibility. Share your thoughts, inquiries, or
            feedback with us.
          </p>
        </div>
        <Image
          src="/images/home/arrow.svg"
          height={42}
          width={42}
          alt="arrow"
          className="absolute bottom-10 animate-bounce left-1/2 -translate-x-1/2"
        />
      </section>

      {/* Contact Form Section */}
      <section className="bg-[#F9F3EC] py-[80px] px-6">
        <div className="max-w-[1440px] mx-auto">
          <Heading title="Contact Us" />
          <div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-[20px] shadow-xl p-10 lg:max-w-3xl mx-auto mt-10"
          >
            <form
              onSubmit={handleSubmit}
              className="grid gap-6 lg:grid-cols-2"
            >
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BA7E38]"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BA7E38]"
                required
              />
              <input
                type="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BA7E38]"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BA7E38] lg:col-span-2"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-[#BA7E38] text-white py-3 rounded-lg hover:bg-[#a36b2f] transition-colors duration-300 lg:col-span-2"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
