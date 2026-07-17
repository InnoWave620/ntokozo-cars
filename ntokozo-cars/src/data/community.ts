export interface CommunityProject {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  impactMetric?: string;
}

export const MOCK_COMMUNITY_PROJECTS: CommunityProject[] = [
  {
    id: 'c001',
    title: 'Winter Warmth Drive',
    description: 'Ntokozo Cars team distributed blankets, warm clothes, and hot meals to over 300 homeless families across Johannesburg central during the coldest winter weeks.',
    date: 'June 2025',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80',
    impactMetric: '300+ Families Helped',
  },
  {
    id: 'c002',
    title: 'Soweto Youth School Support',
    description: 'Donating school uniforms, stationery kits, and custom study materials to support primary school students in Soweto, ensuring every child starts the school term with confidence.',
    date: 'January 2025',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80',
    impactMetric: '150+ Students Supported',
  },
  {
    id: 'c003',
    title: 'Community Feeding Kitchen',
    description: 'Partnering with local soup kitchens to fund and serve nutritious weekly meals to child-headed households and vulnerable elderly residents in our local communities.',
    date: 'Ongoing Project',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80',
    impactMetric: '1,200+ Meals Served Monthly',
  },
];
