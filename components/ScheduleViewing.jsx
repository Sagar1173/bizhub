"use client";

import { useState } from "react";
import { sendEmail } from "@/actions/email";
import swal from "sweetalert";

const times = [
  { label: "Morning", time: "8am-12pm" },
  { label: "Afternoon", time: "12pm-4pm" },
  { label: "Evening", time: "4pm-8pm" },
];

// Generate today + next 7 days dynamically
function generateDates() {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
  ];

  return Array.from({ length: 8 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      label: i === 0 ? "TODAY" : days[date.getDay()],
      day: date.getDate(),
      month: months[date.getMonth()],
      fullDate: date,
    };
  });
}

export default function ScheduleViewing({ property }) {
  const dates = generateDates();

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedTime, setSelectedTime] = useState(times[0]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const previewImage = property?.images?.[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      swal("Missing Info", "Please fill in all contact details", "warning");
      return;
    }

    setLoading(true);
    try {
      const result = await sendEmail({
        content: {
          propertyName: property?.name || "N/A",
          selectedDate: `${selectedDate.label} ${selectedDate.day} ${selectedDate.month}`,
          selectedTime: `${selectedTime.label} (${selectedTime.time})`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          "Page URL": window.location.href,
        },
        title: "Schedule Viewing - Inquiry",
      });

      if (result.success) {
        swal(
          `Schedule Request Sent`,
          `Thank you ${formData.name}, we have received your request for ${selectedDate.day} ${selectedDate.month} at ${selectedTime.time}.`,
          "success"
        );
        setFormData({ name: "", email: "", phone: "" });
      } else {
        swal("Message Failed", "Cannot send your message", "error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      swal("Error", "Something went wrong. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto rounded-2xl overflow-hidden bg-[#f4f3f1] border border-gray-200">
      {/* Left: Property Image */}
      <div className="w-full md:w-1/2">
        {previewImage ? (
          <img
            src={previewImage}
            alt={property?.name || "Property image"}
            className="h-40 md:h-full w-full object-cover"
          />
        ) : (
          <div className="h-40 md:h-full w-full bg-gray-200" />
        )}
      </div>

      {/* Right: Form */}
      <div className="w-full md:w-1/2 p-3 sm:p-4 md:p-10 flex flex-col justify-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 leading-tight">
          Schedule a viewing
        </h2>

        {/* Date Picker — horizontally scrollable */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 sm:mb-6 scrollbar-hide">
          {dates.map((date) => {
            const active = selectedDate.day === date.day && selectedDate.month === date.month;
            return (
              <button
                key={`${date.day}-${date.month}`}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 w-16 sm:w-20 h-24 sm:h-28 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                  active
                    ? "border-black bg-white"
                    : "border-gray-300 hover:border-gray-500 bg-transparent"
                }`}
              >
                <span className={`text-xs font-medium ${active ? "text-black" : "text-gray-500"}`}>
                  {date.label}
                </span>
                <span className="text-xl sm:text-2xl font-semibold mt-0.5">{date.day}</span>
                <span className={`text-xs ${active ? "text-black" : "text-gray-500"}`}>
                  {date.month}
                </span>
              </button>
            );
          })}
        </div>

        {/* Time Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 sm:mb-6">
          {times.map((slot) => {
            const active = selectedTime.label === slot.label;
            return (
              <button
                key={slot.label}
                onClick={() => setSelectedTime(slot)}
                className={`w-full px-3 sm:px-4 py-3 rounded-xl border-2 text-left transition-all ${
                  active
                    ? "border-black bg-white"
                    : "border-gray-300 hover:border-gray-500 bg-transparent"
                }`}
              >
                <p className="font-medium">{slot.label}</p>
                <p className="text-xs sm:text-sm text-gray-600">{slot.time}</p>
              </button>
            );
          })}
        </div>

        {/* Contact Fields */}
        <div className="space-y-3 mb-6">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-base outline-none focus:ring-2 focus:ring-black transition-all"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-base outline-none focus:ring-2 focus:ring-black transition-all"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-base outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          No obligation or purchase necessary, cancel at any time.
        </p>

        <button
          onClick={handleSchedule}
          disabled={loading}
          className={`bg-blue-700 cursor-pointer hover:bg-blue-600 text-white py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Scheduling..." : "Schedule tour"}
        </button>
      </div>
    </div>
  );
}