import { useState } from 'react';

export const LOGO_MAP = {
  'chitkara-online': '/images/logos/chitkara.png',
  'chitkara-university-punjab': '/images/logos/chitkara.png',
  'chandigarh-university': '/images/logos/cu.png',
  'lovely-professional-university': '/images/logos/lpu.png',
  'guru-nanak-dev-university': '/images/logos/gndu.png',
  'thapar-institute': '/images/logos/thapar.png',
  'punjab-agricultural-university': '/images/logos/pau.png',
  'central-university-of-punjab': '/images/logos/cupb.jpg',
  'ik-gujral-ptu': '/images/logos/ptu.png',
  'punjabi-university': '/images/logos/punjabi_uni.png',
  'khalsa-college-amritsar': '/images/logos/khalsa.png',
  'iisc-bengaluru': '/images/logos/iisc.png',
  'jawaharlal-nehru-university': '/images/logos/jnu.png',
  'manipal-online': '/images/logos/manipal.png',
  'manipal-academy-of-higher-education': '/images/logos/manipal.png',
  'manipal-university-jaipur': '/images/logos/manipal.png',
  'jamia-millia-islamia': '/images/logos/jamia.png',
  'university-of-delhi': '/images/logos/du.png',
  'banaras-hindu-university': '/images/logos/bhu.png',
  'bits-pilani': '/images/logos/bits.png',
  'amrita-vishwa-vidyapeetham': '/images/logos/amrita.png',
  'jadavpur-university': '/images/logos/jadavpur.png',
  'aligarh-muslim-university': '/images/logos/amu.png',
  'amity-university-online': '/images/logos/amity_university_online.png',
  'nmims-online': '/images/logos/nmims_online.jpg',
  'jain-university-online': '/images/logos/jain_university_online.png',
  'dpu-col-pune': '/images/logos/dpu_col_pune.png',
  'ignou-delhi': '/images/logos/ignou_delhi.svg',
  'iit-madras-online': '/images/logos/iit_madras.png',
  'srm-online': '/images/logos/srm_online.svg',
  'upes-online': '/images/logos/upes_online.jpg',
  'gla-university-online': '/images/logos/gla_university_online.png',
  'symbiosis-skills-university': '/images/logos/symbiosis_skills_university.svg',
  'shiv-nadar-university': '/images/logos/shiv_nadar_university.png',
  'sastra-university': '/images/logos/sastra_university.png',
  'alagappa-university': '/images/logos/alagappa_university.png',
  'andhra-university': '/images/logos/andhra_university.png',
  'sharda-university': '/images/logos/sharda_university.png',
  'bharathiar-university': '/images/logos/bharathiar_university.svg',
  'hits-chennai': '/images/logos/hits_chennai.png',
  'iit-guwahati-online': '/images/logos/iit_guwahati_online.png',
  'iim-kozhikode-online': '/images/logos/iim_kozhikode_online.png',
  'kl-university-online': '/images/logos/kl_university_online.svg',
  'vit-online': '/images/logos/vit.png',
  'university-of-mysore': '/images/logos/university_of_mysore.png',
  'kurukshetra-university': '/images/logos/kurukshetra_university.png',
  'mizoram-university': '/images/logos/mizoram_university.svg',
  'utkal-university': '/images/logos/utkal_university.png',
  'jamia-hamdard-online': '/images/logos/jamia_hamdard_online.svg',
  'christ-university': '/images/logos/christ_university.png',
  'graphic-era-online': '/images/logos/graphic_era_online.png',
  'mdu-rohtak-online': '/images/logos/mdu_rohtak_online.svg',
  'loyola-college-chennai': '/images/logos/loyola_college_chennai.png',
  'st-xaviers-college-kolkata': '/images/logos/st_xaviers_college_kolkata.jpg',
  'mithibai-college-mumbai': '/images/logos/mithibai_college_mumbai.png',
  'mcc-chennai': '/images/logos/mcc_chennai.png',
  'anna-university-online': '/images/logos/anna_university_online.jpg',
  'university-of-hyderabad': '/images/logos/university_of_hyderabad.png',
  'sppu-pune-online': '/images/logos/sppu_pune_online.png',
  'mumbai-university-idol': '/images/logos/mumbai_university_idol.svg',
  'osmania-university': '/images/logos/osmania_university.svg',
  'calcutta-university': '/images/logos/calcutta_university.png',
  'iit-roorkee-online': '/images/logos/iit_roorkee_online.png',
  'iim-ahmedabad-online': '/images/logos/iim_ahmedabad_online.png',
  'iim-bangalore-online': '/images/logos/iim_bangalore_online.png',
  'iim-calcutta-online': '/images/logos/iim_calcutta_online.png',
  'kiit-university-online': '/images/logos/kiit_university_online.png',
  'symbiosis-ssodl-pune': '/images/logos/symbiosis_ssodl_pune.svg',
  'pdeu-gandhinagar-online': '/images/logos/pdeu_gandhinagar_online.png',
  'icfai-online-hyderabad': '/images/logos/icfai_online_hyderabad.png',
  'periyar-university-online': '/images/logos/periyar_university_online.png',
  'banasthali-vidyapith-online': '/images/logos/banasthali_vidyapith_online.png',
  'miranda-house-delhi': '/images/logos/miranda_house_delhi.svg',
  'hindu-college-delhi': '/images/logos/hindu_college_delhi.svg',
  'st-stephens-delhi': '/images/logos/st_stephens_delhi.svg',
  'presidency-college-chennai': '/images/logos/presidency_college_chennai.svg',
  'hansraj-college-delhi': '/images/logos/hansraj_college_delhi.png',
  'lady-shri-ram-college': '/images/logos/lady_shri_ram_college.png',
  'fergusson-college-pune': '/images/logos/fergusson_college_pune.svg',
  'arsd-college-delhi': '/images/logos/arsd_college_delhi.png'
};

export function UniversityLogo({ id, name, short = 'UNI', size = 52, logoUrl }) {
  const [imgError, setImgError] = useState(false);
  const src = logoUrl || LOGO_MAP[id];

  if (src && !imgError) {
    return (
      <div
        className="uni-logo-mark uni-real-logo"
        style={{
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          borderRadius: Math.round(size * 0.22),
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          flexShrink: 0,
          padding: Math.max(3, Math.round(size * 0.08)),
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
        aria-label={name || short}
      >
        <img
          src={src}
          alt={name || short}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
            borderRadius: Math.round(size * 0.14),
          }}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback monogram
  return (
    <div
      className="uni-logo-mark"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.24),
        background: 'linear-gradient(135deg, #1E1B4B 0%, #DC2626 100%)',
        display: 'grid',
        placeItems: 'center',
        color: '#FFFFFF',
        fontWeight: 800,
        fontSize: size * 0.35,
        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
        flexShrink: 0,
      }}
    >
      {short ? short.slice(0, 3) : 'UNI'}
    </div>
  );
}

export default UniversityLogo;
