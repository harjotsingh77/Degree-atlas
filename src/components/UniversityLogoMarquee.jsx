import { Link } from 'react-router-dom';

const popularUniversities = [
  {
    name: 'Chitkara University',
    shortName: 'Chitkara University',
    slug: 'chitkara-university-punjab',
    logo: '/images/logos/chitkara.png',
    badge: 'NAAC A+',
  },
  {
    name: 'Lovely Professional University',
    shortName: 'LPU Online',
    slug: 'lovely-professional-university',
    logo: '/images/logos/lpu.png',
    badge: 'NAAC A++',
  },
  {
    name: 'Chandigarh University',
    shortName: 'Chandigarh University',
    slug: 'chandigarh-university',
    logo: '/images/logos/cu.png',
    badge: 'NAAC A+',
  },
  {
    name: 'Online Manipal',
    shortName: 'Manipal Online',
    slug: 'manipal-online',
    logo: '/images/logos/manipal.png',
    badge: 'NAAC A++',
  },
  {
    name: 'Thapar Institute of Engineering & Technology',
    shortName: 'Thapar Institute',
    slug: 'thapar-institute',
    logo: '/images/logos/thapar.png',
    badge: 'NAAC A+',
  },
  {
    name: 'BITS Pilani',
    shortName: 'BITS Pilani',
    slug: 'bits-pilani',
    logo: '/images/logos/bits.png',
    badge: 'Top Tier',
  },
  {
    name: 'University of Delhi',
    shortName: 'Delhi University',
    slug: 'university-of-delhi',
    logo: '/images/logos/du.png',
    badge: 'NIRF #1',
  },
  {
    name: 'Amrita Vishwa Vidyapeetham',
    shortName: 'Amrita Ahead',
    slug: 'amrita-vishwa-vidyapeetham',
    logo: '/images/logos/amrita.png',
    badge: 'NAAC A++',
  },
  {
    name: 'Guru Nanak Dev University',
    shortName: 'GNDU Amritsar',
    slug: 'guru-nanak-dev-university',
    logo: '/images/logos/gndu.png',
    badge: 'NAAC A++',
  },
  {
    name: 'Indian Institute of Science',
    shortName: 'IISc Bengaluru',
    slug: 'iisc-bengaluru',
    logo: '/images/logos/iisc.png',
    badge: 'NIRF #1',
  },
  {
    name: 'Banaras Hindu University',
    shortName: 'BHU Varanasi',
    slug: 'banaras-hindu-university',
    logo: '/images/logos/bhu.png',
    badge: 'NIRF #5',
  },
  {
    name: 'Jamia Millia Islamia',
    shortName: 'Jamia Millia Islamia',
    slug: 'jamia-millia-islamia',
    logo: '/images/logos/jamia.png',
    badge: 'NAAC A++',
  },
  {
    name: 'Punjab Agricultural University',
    shortName: 'PAU Ludhiana',
    slug: 'punjab-agricultural-university',
    logo: '/images/logos/pau.png',
    badge: 'ICAR #1',
  },
  {
    name: 'IK Gujral Punjab Technical University',
    shortName: 'IKG-PTU',
    slug: 'ik-gujral-ptu',
    logo: '/images/logos/ptu.png',
    badge: 'State Govt',
  },
];

export function UniversityLogoMarquee() {
  // Duplicate array twice for seamless continuous infinite marquee
  const trackItems = [...popularUniversities, ...popularUniversities];

  return (
    <div className="uni-marquee-section" aria-label="Popular Universities Marquee">
      <div className="uni-marquee-wrapper">
        <div className="uni-marquee-track">
          {trackItems.map((uni, idx) => (
            <Link
              key={`${uni.slug}-${idx}`}
              to={`/universities/${uni.slug}`}
              className="uni-marquee-card"
              title={`${uni.name} · ${uni.badge} · Explore Degrees`}
            >
              <div className="uni-marquee-logo-wrap">
                <img
                  src={uni.logo}
                  alt={uni.name}
                  className="uni-marquee-logo-img"
                  loading="lazy"
                />
              </div>
              <div className="uni-marquee-info">
                <span className="uni-marquee-title">{uni.shortName}</span>
                <span className="uni-marquee-badge">{uni.badge}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
