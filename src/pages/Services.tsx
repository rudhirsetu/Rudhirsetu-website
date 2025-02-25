const Services = () => {
  const services = [
    {
      title: 'Blood Donation',
      description: 'Regular blood donation drives and emergency support services.',
      features: [
        'Monthly Blood Donation Camps',
        'Emergency Blood Support',
        'Association with Blood Centers & Hospitals',
        '50+ Camps Annually',
        '9800+ Emergencies Supported'
      ],
      image: '/images/blood-donation.jpg',
      color: 'bg-red-600'
    },
    {
      title: 'Thalassemia Support',
      description: 'Comprehensive support system for Thalassemia patients.',
      features: [
        'Awareness Camps',
        'Free Testing Camps',
        'Comprehensive Patient Support',
        'Adoption of 68 Thalassemia Patients',
        '20,000+ People Educated'
      ],
      image: '/images/thalassemia.jpg',
      color: 'bg-blue-600'
    },
    {
      title: 'Eye Care',
      description: 'Free eye care services for the community.',
      features: [
        'Free Eye Checkup Camps',
        'Free Cataract Screening',
        'Free Operations',
        '15,000+ Checkups Completed',
        '1200+ Operations Performed'
      ],
      image: '/images/eye-care.jpg',
      color: 'bg-green-600'
    },
    {
      title: 'Cancer Awareness',
      description: 'Focus on early detection and prevention of cancer.',
      features: [
        'Focus on Cervical and Breast Cancer',
        'Free Awareness & Testing Camps',
        'Free Cancer Vaccinations',
        '20,000+ Women Reached',
        '8,500+ People Screened'
      ],
      image: '/images/cancer-awareness.jpg',
      color: 'bg-purple-600'
    }
  ];

  return (
    <div className="py-12">
      {/* Header */}
      <div className="container mx-auto px-4 mb-16">
        <h1 className="text-4xl font-bold text-center mb-4">Our Services</h1>
        <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto text-balance">
          We provide comprehensive healthcare and support services to empower communities and transform lives.
        </p>
      </div>

      {/* Services */}
      <div className="space-y-24">
        {services.map((service, index) => (
          <section key={service.title} className={`py-16 ${index % 2 === 1 ? 'bg-gray-50' : ''}`}>
            <div className="container mx-auto px-4">
              <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                <div className="w-full md:w-1/2">
                  <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                    <div className={`${service.color} w-full h-full flex items-center justify-center text-white text-lg`}>
                      [Placeholder for {service.title} Image]
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 space-y-6">
                  <h2 className="text-3xl font-bold">{service.title}</h2>
                  <p className="text-xl text-gray-600">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <svg className="w-6 h-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-6 px-6 py-3 bg-white border-2 border-red-700 text-red-700 rounded-lg font-semibold hover:bg-red-700 hover:text-white transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Need Our Services?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Contact us to learn more about our services or to request support.
        </p>
        <a
          href="/contact"
          className="inline-block bg-red-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-colors"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default Services; 