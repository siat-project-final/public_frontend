import React from 'react';
import Header from '../components/common/Header';

const Home = () => {
  return (
    <>
      <Header />
      <main className="main">
        {/* Hero Section */}
        <section id="hero" className="hero section dark-background">
          <img src="/assets/img/hero-bg.jpg" alt="" data-aos="fade-in" />
          <div className="container">
            <h2 data-aos="fade-up">
              Learning Today,
              <br />
              Leading Tomorrow
            </h2>
            <p data-aos="fade-up" data-aos-delay="200">
              We are team of talented designers making websites with Bootstrap
            </p>
            <div className="d-flex mt-4" data-aos="fade-up" data-aos-delay="300">
              <a href="/courses" className="btn-get-started">
                Get Started
              </a>
            </div>
          </div>
        </section>

        {/* About, Counts, Why Us, Features, Courses, Trainers 영역도 별도 컴포넌트화 가능 */}
      </main>
    </>
  );
};

export default Home;
