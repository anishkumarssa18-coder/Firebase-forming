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
    summary: 'Maximize your wheat yield by learning about best practices for land preparation, seed selection, sowing times, and harvesting. This guide covers optimal irrigation schedules and nutrient management to ensure a healthy and abundant crop.',
    imageId: 'crop-care-1',
    url: '#',
  },
  {
    id: 'sm-01',
    title: 'Understanding Soil pH and Its Importance',
    category: 'Soil Management',
    summary: 'Discover how soil pH is a master variable affecting nutrient availability, crop health, and microbial activity. This article provides tips for affordable soil testing, interpreting results, and using amendments like lime or sulfur to correct pH imbalances.',
    imageId: 'soil-management-1',
    url: '#',
  },
  {
    id: 'gs-01',
    title: 'Guide to Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'Government Schemes',
    summary: 'A comprehensive overview of the flagship crop insurance scheme. Learn about eligibility criteria, the application process, required documents, and how to file a claim for crop losses due to natural calamities, pests, or diseases.',
    imageId: 'govt-scheme-1',
    url: '#',
  },
  {
    id: 'pc-01',
    title: 'Integrated Pest Management (IPM) for Cotton',
    category: 'Pest Control',
    summary: 'Implement sustainable and effective pest control for your cotton crops. This guide covers monitoring for pests like bollworms and whiteflies, using biological controls, and applying pesticides judiciously as a last resort to protect the ecosystem.',
    imageId: 'pest-control-1',
    url: '#',
  },
  {
    id: 'cc-02',
    title: 'Advanced Irrigation Methods for Sugarcane',
    category: 'Crop Care',
    summary: 'Explore modern irrigation techniques like drip and sprinkler systems to conserve water and improve sugarcane growth. Learn about scheduling irrigation based on crop growth stages to ensure higher yields and better juice quality.',
    imageId: 'irrigation-1',
    url: '#',
  },
  {
    id: 'sm-02',
    title: 'The Role of Organic Matter in Soil Health',
    category: 'Soil Management',
    summary: 'Learn how to improve soil structure, water retention, and fertility by increasing organic matter. This article discusses the benefits of compost, farmyard manure, and cover crops for building healthy, productive soil over the long term.',
    imageId: 'soil-management-1',
    url: '#',
  },
  {
    id: 'gs-02',
    title: 'How to Benefit from the PM-KISAN Scheme',
    category: 'Government Schemes',
    summary: 'A step-by-step guide to enrolling in and receiving benefits from the PM-KISAN income support scheme. Understand the eligibility requirements, how to complete eKYC, and check your beneficiary status online.',
    imageId: 'govt-scheme-1',
    url: '#',
  },
  {
    id: 'pc-02',
    title: 'Natural Remedies for Common Vegetable Pests',
    category: 'Pest Control',
    summary: 'Protect your vegetable garden from pests like aphids, mites, and caterpillars using organic solutions. This guide provides recipes for neem oil, garlic spray, and other homemade remedies that are safe for you and the environment.',
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
