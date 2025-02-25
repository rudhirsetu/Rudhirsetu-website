const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center pt-20 pb-8 md:pt-24 md:pb-12">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-red-900" />
        <img
          src="/images/hero-bg.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Text Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight animate-fade-in">
                Transforming Lives,{' '}
                <span className="text-[#FECACA] block mt-2">
                  Empowering Communities
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-100 leading-relaxed max-w-2xl mx-auto animate-fade-in-delay">
                Join us in our mission to make a difference through blood donation, healthcare support, and community service.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-delay-2">
              <a
                href="/contact"
                className="w-full sm:w-auto text-center px-8 py-4 bg-white text-[#9B2C2C] rounded-lg font-semibold hover:bg-[#FECACA] transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Involved
              </a>
              <a
                href="/services"
                className="w-full sm:w-auto text-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#9B2C2C] transform hover:-translate-y-1 transition-all duration-200"
              >
                Our Services
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pt-8 max-w-4xl mx-auto animate-fade-in-delay-3">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#FECACA]">50+</div>
                <div className="text-sm sm:text-base text-gray-100">Blood Camps</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#FECACA]">9800+</div>
                <div className="text-sm sm:text-base text-gray-100">Lives Impacted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#FECACA]">15K+</div>
                <div className="text-sm sm:text-base text-gray-100">Eye Checkups</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#FECACA]">20K+</div>
                <div className="text-sm sm:text-base text-gray-100">People Reached</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 