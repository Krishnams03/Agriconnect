import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus("Submitting...");

    try {
      // Mocking an API request. Replace with your real API endpoint.
      const response = await fetch("/api/submit-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionStatus(
          "Thank you for your message! We will get back to you soon."
        );
        setFormData({ name: "", email: "", message: "" }); // Reset form
      } else {
        setSubmissionStatus("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error sending the message:", error); // Log the error for debugging
      setSubmissionStatus(
        "Error: Unable to send the message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      id="contact"
      className="py-20 bg-white"
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-10">Contact Us</h2>
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto space-y-6"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-600"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-600"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Message"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-600"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              className="bg-green-600 text-white hover:bg-green-500 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </motion.div>
        </motion.form>

        {submissionStatus && (
          <div className="mt-6 text-lg text-gray-800">{submissionStatus}</div>
        )}
      </div>
    </motion.section>
  );
}
