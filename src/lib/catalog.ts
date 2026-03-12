/**
 * @deprecated 
 * This catalog is for fallback purposes only. 
 * Please use the MongoDB API routes (/api/products) for real product data.
 */
export interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  createdAt: string;
  description: string;
  features: string[];
  outOfStock?: boolean;
}

export const CATALOG: Product[] = [
  {
    id: 1,
    slug: 'classic-stethoscope-iii',
    name: 'Classic Stethoscope III',
    category: 'Diagnostics',
    price: 4250,
    originalPrice: 4900,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjfv7G5fB1b67d_rspMIn-69RhN059Gi6WjIYTn7TxI_cPAgk7y49cizr4mOg_wlViFz3Fc3t1GVgzKtowHTzxVojxJTZILrh1lBPj8PSV5h63CQkQROBxjZGANA5JTGuk2Laxz3Tnnq6Qk-qYlEUfCEd9moCAl9ZpJQ5nju7EcePK80g8Cc0H0kfhghejA9Kvbdi-5p3fX0OG_83R4mFtsjjWr--vpXbrbumS1GLz77Y0gCwEAoLjhm-M7i0NQiLaiWpgA9YhpQ',
    badge: 'New',
    createdAt: '2025-01-01',
    description: 'Precision-engineered for clinical excellence. The Classic III delivers high acoustic sensitivity for exceptional performance when doing general physical assessment.',
    features: ['High acoustic sensitivity', 'Dual single-piece tunable diaphragms', 'Versatile pediatric side', 'Easy-to-clean smooth surface'],
  },
  {
    id: 2,
    slug: 'precision-scalpel-set',
    name: 'Precision Scalpel Set',
    category: 'Surgery',
    price: 1890,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKVd8MH2HFNM5Jiq53iKbYwSos9ZqxTB3BCnn02hWGsiq2hdnRumXCtQ08Ki7X5iFc-YXTw-nZirWI5GMKKbDHb47vSOSlESml0D8VAOfHOtg-glW3GAKvB3BCL2f7ZMEPzJA3Rc_xgR3sA_hGAS8LgwttyViSz69yVoe5d13bLWpuYSSFkobUAZp-9gTtRnr5XXenJGKVRg_iYFj4Jw-ynbfiEnibVrPulixV7m39BVAx0W17rMLsADC1DgsmF5yeoaq9dA0BMg',
    badge: '🔥 Hot Now',
    createdAt: '2024-12-15',
    description: 'Professional grade surgical scalpel set. Crafted from high-carbon steel for superior sharpness and durability during precision procedures.',
    features: ['Premium stainless steel', 'Ergonomic handle grip', 'Autoclave safe', '10 specialized blades included'],
  },
  {
    id: 3,
    slug: 'digital-monitor-pro',
    name: 'Digital Monitor Pro',
    category: 'Diagnostics',
    price: 6750,
    originalPrice: 7900,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBtXqfiIuOASxsjtC1c9Qq3SafTDjPa23wCVCIAmkl_5vY36KQ8vgzgjVQ-6s8oS1KmMHRWHXbYyyZcWwtcizRVGF0d4V3tr-Q60r581ToMbKg-IeSRn830OJAEjIG4OeLmuGqzqKMRwCctWyUyid8S67AGOuBRu4DQdMNn1pvJtGKZqbAkQWSh8cSGO2HPLWYWVITCd_uObN53_WHFR189T2SWkjSTTnK9Ua_fprfsCDH6i_t1qhQGmg5n9zKtt497TW1scnHKw',
    badge: 'Sale -15%',
    createdAt: '2024-11-20',
    description: 'Advanced digital monitoring system for precise vital tracking. Features a high-resolution display and wireless connectivity for modern clinics.',
    features: ['Real-time vital tracking', 'Bluetooth connectivity', 'Long-lasting battery', 'High-res OLED display'],
  },
  {
    id: 4,
    slug: 'emergency-kit-platinum',
    name: 'Emergency Kit Platinum',
    category: 'Kits',
    price: 12400,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtkcaYxxo7jsdRTcQ1xFU8dLnpoVIYD_uLN1FpAVWlcZPQ5jz11S2fQUTNvsk417wDiprrtdDiWkKRuCk-OVZmDN78ZVDywCin2BistP5UELelrIqtHaC6tgoDCLoMYy-7Nna2B7P66bul-gZzd2MkHkza071bNBWIjAZLBHHNBDPHlI4oSM4uTzlm-R6vZV1TRouqK56mDT8grw9g7T563CV5ceiskZhQJHQDcvD17Sdjqq9vuPyJwoBUn60BqzB_81Paew6sWg',
    createdAt: '2024-10-10',
    description: 'Comprehensive emergency response kit. contains everything needed for critical care in pre-hospital and clinic environments.',
    features: ['Rugged waterproof casing', 'Organized trauma supplies', 'Diagnostic essentials included', 'Compact and portable'],
  },
  {
    id: 5,
    slug: 'ent-diagnostic-set',
    name: 'ENT Diagnostic Set',
    category: 'Diagnostics',
    price: 8150,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1yzKL1O75DFGPLS0q7tt-3-RMQt9Hz2x-kQhTjTqeY91GY0wC7WL0bGRQCi_-u7l6izsTU9wPIsdQ37B9R9c1fL17E4m8YqTIw2gLjmFGsu6IChuUPgZeGg12o4S91WFrPInEnMkn4z5BsmRHDmyuwfwkRPmbQ-EIVqEHxMQSCpqUoN7b6MPlSjYL8Rq2j_BNKO5PdZ_wNOOEYuMfCd-zZfkZ5L395dSQRTb9UnILy_RXjg5qg51rLVfwY4h4Y6027PXYMBYDFg',
    createdAt: '2024-09-05',
    outOfStock: true,
    description: 'Dual-purpose ENT set with fiber optic lighting. includes high-quality otoscope and ophthalmoscope attachments for detailed examinations.',
    features: ['Fiber optic illumination', 'Adjustable light intensity', 'Durable carrying case', 'Multiple specula sizes'],
  },
  {
    id: 6,
    slug: 'titanium-forceps-set',
    name: 'Titanium Forceps Set',
    category: 'Surgery',
    price: 3200,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO9AnlrHZ-Gtr6_PwUVH69nP3hTipfpT05I0SsEt0Rvm1hOjkqpGNYO9V_yMAxvHTofWiWdZE6LbRSQSR4UABbafqNmTUyv9YdC0UAa8Yb2iPEmanI46MSuVT3T6cITJy3dqnuce75nNFCq-8i4CRYNMzemXvsg9cgKUscIBycruKpPsb6PkJfOisdYH0eeEbZs-TOn1EV-bz_3dlT4aYHPlfq3j4JD2y5UVEw3nvMCyRk1x9S0gzR5hxS1k7MM_O5fNTnEi4Iww',
    createdAt: '2024-08-12',
    description: 'Ultralight titanium forceps designed for microsurgery. Non-magnetic and highly resistant to corrosion from sterilization.',
    features: ['Grade 5 Titanium', 'Precision tips', 'Non-magnetic', 'Heat resistant'],
  },
  {
    id: 7,
    slug: 'portable-o2-conc',
    name: 'Portable O2 Conc.',
    category: 'Kits',
    price: 14900,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9c_Gq9U0cgl7QOUuDQAPOKRRSaoVGFSvwuEiEZ22WmlxpGhyId2x0bobfOgcyvGXWO21WbGoOBVdrgGvuJlMEpd4o5IM3Sp0fdUptUvIoueTSlNo5AB62BBskSvdMKSfdZ45PR73kqx8I1CpcY7P0RtMqyujgmCCDU00_OJUOkynxLNnsRvkm4nvdwgIe1pz5tTUHpZGG0rX4iN4_5IdBwiynR_9IkcWsAtAAub0UzpruWxwkRm0AycgVyrg7BQuuyAkwB-ja1g',
    createdAt: '2024-07-20',
    description: 'Lightweight portable oxygen concentrator. Silent operation and long battery life for patients on the move.',
    features: ['Compact design', 'Ultra-silent operation', 'Double battery system', 'FAA approved'],
  },
  {
    id: 8,
    slug: 'instrument-tray-xl',
    name: 'Instrument Tray XL',
    category: 'Surgery',
    price: 950,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfuig3VhxU5XorBOfWK8tdkVO-0nlFWYR4Z9y3v3D0CrRxeQdchYoE-cG11iIfsyVq_f1wFVKRdDv16IGVu9fE5c6W9WkHSQRpXmB2CQBAj_-eOrP9vKagkkvqrjBwhIuoT43dgS-moM4o6mF7EUh1kRW7r8yRFeIsok6qMfg-ilwV_xa-UkTqrzcCmA0-A7B7gC5NbV1Ncnaq4FOc5DfSUdvRLRmFSP3siXKAMKt5IzIw7KUguoXLQ2LSBzEXoi_hQTbExlILTQ',
    createdAt: '2024-06-15',
    description: 'Extra-large stainless steel instrument tray. Features high side walls and easy-to-clean rounded corners.',
    features: ['304 Stainless steel', 'Seamless construction', 'Rounded safety edges', 'Chemical resistant'],
  },
];
