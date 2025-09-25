const ContactForm = () => {
  return (
    <form className="max-w-4xl mx-auto space-y-6 px-4 md:px-0 z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="firstName"
            className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
          >
            FIRST NAME
          </label>
          <input
            type="text"
            id="firstName"
            placeholder="Enter your first name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="surname"
            className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
          >
            SURNAME
          </label>
          <input
            type="text"
            id="surname"
            placeholder="Enter your surname"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
          >
            EMAIL
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="contactNumber"
            className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
          >
            CONTACT NUMBER
          </label>
          <input
            type="tel"
            id="contactNumber"
            placeholder="Enter your contact number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="journey"
            className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
          >
            JOURNEY
          </label>
          <select
            id="journey"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
          >
            <option value="">Select your journey</option>
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="chuanyu">Chuanyu</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="travellers"
            className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
          >
            TRAVELLERS
          </label>
          <select
            id="travellers"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
          >
            <option value="">Select number of travellers</option>
            <option value="1">1 Traveller</option>
            <option value="2">2 Travellers</option>
            <option value="3">3 Travellers</option>
            <option value="4">4 Travellers</option>
            <option value="5+">5+ Travellers</option>
          </select>
        </div>
      </div>

      {/* Message字段单独一行 */}
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
        >
          MESSAGE
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="Enter your message"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical bg-white"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-primary-terracotta text-primary-parchment font-noto-sans text-[16px] font-[500] leading-[1.6] tracking-[1.6px] py-3 px-6 rounded-full hover:bg-primary-mist transition-colors"
        >
          SUBMIT FORM
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
