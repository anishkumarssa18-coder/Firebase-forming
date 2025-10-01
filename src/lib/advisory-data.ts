export type AdvisoryArticle = {
  id: string;
  title: string;
  category: 'Crop Care' | 'Soil Management' | 'Government Schemes' | 'Pest Control';
  summary: string;
  imageId: string;
  url: string;
};

export const advisoryArticles: AdvisoryArticle[] = [
  {
    id: 'cc-01',
    title: 'Effective Wheat Cultivation Techniques',
    category: 'Crop Care',
    summary: 'Learn about the best practices for wheat cultivation, from sowing to harvesting, to maximize your yield.',
    imageId: 'crop-care-1',
    url: '#',
  },
  {
    id: 'sm-01',
    title: 'Understanding Soil pH and Its Importance',
    category: 'Soil Management',
    summary: 'Discover how soil pH affects nutrient availability and crop health. Includes tips for testing and amendment.',
    imageId: 'soil-management-1',
    url: '#',
  },
  {
    id: 'gs-01',
    title: 'Guide to Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'Government Schemes',
    summary: 'A comprehensive overview of the flagship crop insurance scheme, including eligibility and application process.',
    imageId: 'govt-scheme-1',
    url: '#',
  },
  {
    id: 'pc-01',
    title: 'Integrated Pest Management (IPM) for Cotton',
    category: 'Pest Control',
    summary: 'Implement sustainable and effective pest control strategies for your cotton crops using IPM principles.',
    imageId: 'pest-control-1',
    url: '#',
  },
  {
    id: 'cc-02',
    title: 'Advanced Irrigation Methods for Sugarcane',
    category: 'Crop Care',
    summary: 'Explore drip and sprinkler irrigation systems to conserve water and improve sugarcane growth.',
    imageId: 'irrigation-1',
    url: '#',
  },
  {
    id: 'sm-02',
    title: 'The Role of Organic Matter in Soil Health',
    category: 'Soil Management',
    summary: 'Learn how to improve soil structure, water retention, and fertility by increasing organic matter.',
    imageId: 'soil-management-1',
    url: '#',
  },
  {
    id: 'gs-02',
    title: 'How to Benefit from the PM-KISAN Scheme',
    category: 'Government Schemes',
    summary: 'Step-by-step guide to enrolling in and receiving benefits from the PM-KISAN income support scheme.',
    imageId: 'govt-scheme-1',
    url: '#',
  },
  {
    id: 'pc-02',
    title: 'Natural Remedies for Common Vegetable Pests',
    category: 'Pest Control',
    summary: 'Use neem oil, garlic spray, and other organic solutions to protect your vegetable garden from pests.',
    imageId: 'pest-control-1',
    url: '#',
  },
];

export const advisoryCategories = [
  'Crop Care',
  'Soil Management',
  'Government Schemes',
  'Pest Control',
];
