const Gallery = () => {
  const galleries = [
    {
      title: 'Blood Donation Camps',
      images: [
        { src: '/images/blood-donation-1.jpg', alt: 'Blood donation camp in progress' },
        { src: '/images/blood-donation-2.jpg', alt: 'Volunteers at blood donation camp' },
        { src: '/images/blood-donation-3.jpg', alt: 'Blood donation awareness session' },
        { src: '/images/blood-donation-4.jpg', alt: 'Community blood donation drive' },
      ]
    },
    {
      title: 'Cancer Awareness Programs',
      images: [
        { src: '/images/cancer-1.jpg', alt: 'Cancer awareness workshop' },
        { src: '/images/cancer-2.jpg', alt: 'Cancer screening camp' },
        { src: '/images/cancer-3.jpg', alt: 'Cancer awareness presentation' },
        { src: '/images/cancer-4.jpg', alt: 'Community cancer awareness program' },
      ]
    },
    {
      title: 'Eye Care Camps',
      images: [
        { src: '/images/eye-care-1.jpg', alt: 'Eye checkup camp' },
        { src: '/images/eye-care-2.jpg', alt: 'Eye screening in progress' },
        { src: '/images/eye-care-3.jpg', alt: 'Eye care awareness session' },
        { src: '/images/eye-care-4.jpg', alt: 'Community eye care program' },
      ]
    }
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Our Gallery</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
            Take a look at the moments we've captured while serving our community through various healthcare initiatives.
          </p>
        </div>

        {/* Gallery Sections */}
        <div className="space-y-16">
          {galleries.map((gallery) => (
            <section key={gallery.title} className="space-y-8">
              <h2 className="text-2xl font-bold">{gallery.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {gallery.images.map((image) => (
                  <div
                    key={image.src}
                    className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                      [Placeholder for {image.alt}]
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Make a Difference?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join us in our mission to serve the community. Your support can help us reach more people in need.
          </p>
          <div className="space-x-4">
            <a
              href="/contact"
              className="inline-block bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors"
            >
              Get Involved
            </a>
            <a
              href="/services"
              className="inline-block border-2 border-red-700 text-red-700 px-6 py-3 rounded-lg font-semibold hover:bg-red-700 hover:text-white transition-colors"
            >
              Our Services
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery; 