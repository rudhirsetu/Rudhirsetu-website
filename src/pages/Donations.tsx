import { QrCode, CreditCard, MapPin, Heart, ArrowRight, Gift, Users } from 'lucide-react';

const Donations = () => {
  const donationImpact = [
    {
      amount: "₹500",
      impact: "Provides essential medical supplies for one blood donation camp",
      icon: Heart
    },
    {
      amount: "₹1,000",
      impact: "Supports one thalassemia patient's monthly treatment",
      icon: Gift
    },
    {
      amount: "₹2,500",
      impact: "Enables free eye check-ups for 25 underprivileged individuals",
      icon: Users
    }
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Support Our Cause</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
            Your contribution helps us continue our mission of providing healthcare support and community services to those in need.
          </p>
        </div>

        {/* Impact Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Your Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {donationImpact.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.amount} className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <div className="inline-block p-3 bg-red-50 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-red-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.amount}</h3>
                  <p className="text-gray-600">{item.impact}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Donation Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* UPI Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <QrCode className="w-10 h-10 text-red-700" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">UPI Payment</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <img
                src="/images/upi-qr.png"
                alt="UPI QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>
            <p className="text-center text-gray-600 text-sm mb-4">
              Scan to donate via any UPI app
            </p>
            <p className="text-center text-gray-800 font-medium">
              UPI ID: donate@rudhirsetu
            </p>
          </div>

          {/* Bank Transfer Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <CreditCard className="w-10 h-10 text-red-700" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">Bank Transfer</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Account Name</p>
                <p className="font-medium">Rudhirsetu Seva Sanstha</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Account Number</p>
                <p className="font-medium">1234567890</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">IFSC Code</p>
                <p className="font-medium">SBIN0123456</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Bank & Branch</p>
                <p className="font-medium">State Bank of India, Panvel</p>
              </div>
            </div>
          </div>

          {/* Physical Donation Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <MapPin className="w-10 h-10 text-red-700" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">Visit Us</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800">
                  C-23, Nandanvan Complex,<br />
                  Near Wadale Talav,<br />
                  Old Mumbai Pune Highway,<br />
                  Panvel-410206
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Contact Number</p>
                <p className="font-medium">93216 06868</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Office Hours</p>
                <p className="font-medium">Mon-Sat: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Benefits Section */}
        <section className="bg-red-50 p-8 rounded-xl mb-16">
          <h2 className="text-2xl font-bold mb-4">Tax Benefits</h2>
          <p className="text-gray-700 mb-4">
            All donations to Rudhirsetu Seva Sanstha are eligible for tax deduction under Section 80G of the Income Tax Act.
            You will receive a donation receipt that can be used for tax purposes.
          </p>
          <div className="flex items-center text-red-700 font-medium">
            <span>Learn more about tax benefits</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-8">
            For any queries regarding donations or to discuss other ways to support us, please feel free to contact us.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition-colors"
          >
            Contact Us
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </section>
      </div>
    </div>
  );
};

export default Donations; 