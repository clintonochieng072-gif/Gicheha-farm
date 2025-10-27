import React from "react";
import { FaLeaf, FaUsers, FaAward, FaHeart } from "react-icons/fa";

const About = () => {
  const values = [
    {
      icon: <FaLeaf className="text-primary-600 text-3xl" />,
      title: "Sustainability",
      description:
        "We practice sustainable farming methods that protect our environment and ensure long-term food security.",
    },
    {
      icon: <FaUsers className="text-primary-600 text-3xl" />,
      title: "Community",
      description:
        "We work closely with local farmers and communities to create opportunities and share knowledge.",
    },
    {
      icon: <FaAward className="text-primary-600 text-3xl" />,
      title: "Quality",
      description:
        "Every product meets our high standards of quality, freshness, and nutritional value.",
    },
    {
      icon: <FaHeart className="text-primary-600 text-3xl" />,
      title: "Passion",
      description:
        "We are passionate about farming and committed to providing the best products to our customers.",
    },
  ];

  const team = [
    {
      name: "John Gicheha",
      role: "Founder & Farmer",
      image: "/images/team/john.jpg",
      bio: "With over 20 years of farming experience, John leads our sustainable farming initiatives.",
    },
    {
      name: "Mary Wanjiku",
      role: "Farm Manager",
      image: "/images/team/mary.jpg",
      bio: "Mary oversees daily operations and ensures our products meet the highest quality standards.",
    },
    {
      name: "David Kiprop",
      role: "Quality Control",
      image: "/images/team/david.jpg",
      bio: "David manages our quality assurance processes and product testing.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-6">
              About Gicheha Farm Rongai
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Learn about our journey, our values, and our commitment to
              providing fresh, organic produce while supporting sustainable
              farming practices.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-secondary-600">
                <p>
                  Founded in 2005, Gicheha Farm Rongai started as a small family
                  farm with a simple mission: to grow the freshest, most
                  nutritious produce possible. What began as a modest operation
                  has grown into a thriving agricultural enterprise that serves
                  communities across Kenya.
                </p>
                <p>
                  We believe that healthy food starts with healthy soil. That's
                  why we use only organic farming methods, avoiding synthetic
                  pesticides and fertilizers. Our commitment to sustainability
                  extends beyond our fields – we actively work to preserve
                  biodiversity and support local ecosystems.
                </p>
                <p>
                  Today, we proudly supply fresh vegetables, fruits, dairy
                  products, and more to families who value quality and
                  freshness. Every product we grow tells a story of dedication,
                  care, and respect for nature.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/farm/farm-overview.jpg"
                alt="Gicheha Farm Overview"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">
              Our Values
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              These core values guide everything we do, from how we farm to how
              we serve our customers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-secondary-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">
              Meet Our Team
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Get to know the dedicated people behind Gicheha Farm who work
              tirelessly to bring you the best.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="text-center bg-secondary-50 p-6 rounded-lg"
              >
                <div className="w-32 h-32 mx-auto mb-4 bg-secondary-200 rounded-full flex items-center justify-center">
                  <span className="text-4xl text-secondary-600 font-bold">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-secondary-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">20+</div>
              <div className="text-primary-100">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-primary-100">Acres Farmed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-primary-100">Products</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
