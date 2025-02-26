import { Calendar, MapPin, Users, Clock, Heart, Activity } from 'lucide-react';

const Impact = () => {
  const upcomingEvents = [
    {
      title: 'Blood Donation Drive',
      date: 'March 30, 2024',
      time: '9:00 AM - 4:00 PM',
      location: 'Nandanvan Complex, Panvel',
      expectedParticipants: '100+',
      type: 'blood-donation'
    },
    {
      title: 'Eye Check-up Camp',
      date: 'April 5, 2024',
      time: '10:00 AM - 5:00 PM',
      location: 'Community Center, Kharghar',
      expectedParticipants: '150+',
      type: 'eye-care'
    },
    {
      title: 'Cancer Awareness Program',
      date: 'April 15, 2024',
      time: '11:00 AM - 3:00 PM',
      location: 'Town Hall, Panvel',
      expectedParticipants: '200+',
      type: 'cancer-awareness'
    }
  ];

  const pastEvents = [
    {
      title: 'Mega Blood Donation Camp',
      date: 'February 14, 2024',
      location: 'Central Park, Panvel',
      impact: '250+ donors',
      type: 'blood-donation',
      highlights: ['Record number of first-time donors', 'Partnership with 3 major hospitals']
    },
    {
      title: 'Thalassemia Awareness Drive',
      date: 'January 25, 2024',
      location: 'Multiple Schools, Panvel',
      impact: '1000+ students reached',
      type: 'thalassemia',
      highlights: ['Free testing for 200 students', 'Educational sessions for parents']
    },
    {
      title: 'Women\'s Health Camp',
      date: 'January 10, 2024',
      location: 'Community Center, Kharghar',
      impact: '300+ women screened',
      type: 'cancer-awareness',
      highlights: ['Free mammography sessions', 'Health awareness workshops']
    },
    {
      title: 'Rural Eye Care Initiative',
      date: 'December 20, 2023',
      location: 'Various Villages, Raigad',
      impact: '400+ eye check-ups',
      type: 'eye-care',
      highlights: ['50+ cataract surgeries arranged', 'Free spectacles distribution']
    }
  ];

  const impactStats = [
    {
      title: 'Lives Impacted',
      value: '9,800+',
      icon: Heart,
      description: 'Through various healthcare initiatives'
    },
    {
      title: 'Blood Units Collected',
      value: '5,000+',
      icon: Activity,
      description: 'From our blood donation camps'
    },
    {
      title: 'Volunteers',
      value: '200+',
      icon: Users,
      description: 'Active community members'
    }
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Our Efforts</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
            Together, we're making a difference in our community through various healthcare initiatives and awareness programs.
          </p>
        </div>

        {/* Impact Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {impactStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.title} className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="inline-block p-3 bg-red-50 rounded-full mb-4">
                  <IconComponent className="w-8 h-8 text-red-700" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{stat.title}</h4>
                <p className="text-gray-600">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Upcoming Events */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div key={event.title} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-5 h-5 mr-2" />
                        <span>Expected: {event.expectedParticipants}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <a
                    href="/contact"
                    className="block text-center px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
                  >
                    Register Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Past Events */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Past Events & Their Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastEvents.map((event) => (
              <div key={event.title} className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-green-600 font-semibold">
                    <Users className="w-5 h-5 mr-2" />
                    <span>{event.impact}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Highlights:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {event.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-red-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Want to Make a Difference?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join us in our upcoming events and help us create a positive impact in our community.
          </p>
          <div className="space-x-4">
            <a
              href="/contact"
              className="inline-block bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors"
            >
              Register for Events
            </a>
            <a
              href="/contact"
              className="inline-block border-2 border-red-700 text-red-700 px-6 py-3 rounded-lg font-semibold hover:bg-red-700 hover:text-white transition-colors"
            >
              Become a Volunteer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impact; 