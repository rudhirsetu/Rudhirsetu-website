import Hero from '../components/Hero';

const Home = () => {
  const keyAreas = [
    {
      title: 'Blood Donation',
      description: 'Monthly camps and emergency support with blood centers & hospitals',
      icon: '🩸',
    },
    {
      title: 'Thalassemia Support',
      description: 'Free testing camps and comprehensive patient support for 68+ patients',
      icon: '🏥',
    },
    {
      title: 'Eye Care',
      description: 'Free eye checkups, cataract screening & operations',
      icon: '👁️',
    },
    {
      title: 'Cancer Awareness',
      description: 'Focus on cervical and breast cancer awareness with free testing camps',
      icon: '🎗️',
    },
  ];

  const impactStats = [
    { label: 'Blood Donation Camps', value: '50+', subtext: 'Annually' },
    { label: 'Emergencies Supported', value: '9800+', subtext: 'And counting' },
    { label: 'Eye Checkups', value: '15,000+', subtext: 'Completed' },
    { label: 'Cancer Awareness', value: '20,000+', subtext: 'Women reached' },
  ];

  return (
    <div className="space-y-16">
      <Hero />
      
      {/* Key Focus Areas */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Key Focus Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {keyAreas.map((area) => (
            <div key={area.title} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">{area.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{area.title}</h3>
              <p className="text-gray-600">{area.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="bg-red-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-red-700 mb-2">{stat.value}</div>
                <div className="text-xl font-semibold mb-1">{stat.label}</div>
                <div className="text-gray-600">{stat.subtext}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 text-center py-16">
        <h2 className="text-3xl font-bold mb-6">Join Us in Making a Difference!</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Whether you want to donate, volunteer, or partner with us, your support can help transform lives.
        </p>
        <div className="space-x-4">
          <a
            href="/contact"
            className="inline-block bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors"
          >
            Contact Us
          </a>
          <a
            href="/services"
            className="inline-block border-2 border-red-700 text-red-700 px-6 py-3 rounded-lg font-semibold hover:bg-red-700 hover:text-white transition-colors"
          >
            Learn More
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home; 