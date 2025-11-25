import { CityLocationMap } from '../types/locations';

export const cityLocations: CityLocationMap = {
  madrid: [
    {
      id: 'madrid-1',
      name: 'Museo del Prado',
      description: "One of the world's finest art museums, housing masterpieces by Velázquez, Goya, and El Greco. Allow 2-3 hours minimum.",
      lat: 40.4138,
      lng: -3.6921,
      category: 'Museum'
    },
    {
      id: 'madrid-2',
      name: 'Royal Palace of Madrid',
      description: "Spain's official royal residence. Stunning baroque architecture with over 3,000 rooms. Visit early morning to avoid crowds.",
      lat: 40.4179,
      lng: -3.7143,
      category: 'Historic Site'
    },
    {
      id: 'madrid-3',
      name: 'Plaza Mayor',
      description: "Madrid's grand central square surrounded by beautiful historic buildings. Perfect spot for coffee and people-watching.",
      lat: 40.4155,
      lng: -3.7074,
      category: 'Landmark'
    },
    {
      id: 'madrid-4',
      name: 'Retiro Park',
      description: "A beautiful 125-hectare park perfect for relaxing strolls. Don't miss the Crystal Palace and rowing boats on the lake.",
      lat: 40.4153,
      lng: -3.6844,
      category: 'Park'
    },
    {
      id: 'madrid-5',
      name: 'Gran Vía',
      description: "Madrid's most famous shopping street. Lined with stunning early 20th-century architecture, shops, and theaters.",
      lat: 40.4201,
      lng: -3.7064,
      category: 'Shopping'
    },
    {
      id: 'madrid-6',
      name: 'Puerta del Sol',
      description: 'The symbolic center of Spain and Madrid. Home to the famous Tío Pepe sign and the Bear and Strawberry Tree statue.',
      lat: 40.4169,
      lng: -3.7035,
      category: 'Landmark'
    },
    {
      id: 'madrid-7',
      name: 'Mercado de San Miguel',
      description: 'Historic covered market offering delicious tapas and local delicacies. A foodie paradise near Plaza Mayor.',
      lat: 40.4155,
      lng: -3.7089,
      category: 'Food & Drink'
    },
    {
      id: 'madrid-8',
      name: 'Reina Sofía Museum',
      description: "Home to Picasso's Guernica and modern Spanish art. Essential for art lovers. Free entry Mon-Sat 7-9pm, Sun 1:30-7pm.",
      lat: 40.408,
      lng: -3.6947,
      category: 'Museum'
    }
  ],
  segovia: [
    {
      id: 'segovia-1',
      name: 'Roman Aqueduct',
      description: "Incredible 2,000-year-old Roman engineering marvel. The symbol of Segovia. Best photos from Plaza del Azoguejo.",
      lat: 40.9481,
      lng: -4.1187,
      category: 'Historic Site'
    },
    {
      id: 'segovia-2',
      name: 'Alcázar of Segovia',
      description: "Fairy-tale castle that inspired Disney's Cinderella Castle. Don't miss the tower climb for panoramic views!",
      lat: 40.9531,
      lng: -4.1312,
      category: 'Historic Site'
    },
    {
      id: 'segovia-3',
      name: 'Segovia Cathedral',
      description: 'The "Lady of Spanish Cathedrals" - stunning Gothic architecture in the heart of the old town.',
      lat: 40.9529,
      lng: -4.1251,
      category: 'Religious Site'
    },
    {
      id: 'segovia-4',
      name: 'Plaza Mayor',
      description: "Segovia's charming main square. Surrounded by cafes and shops, perfect for a leisurely break.",
      lat: 40.949,
      lng: -4.1251,
      category: 'Landmark'
    },
    {
      id: 'segovia-5',
      name: 'Mesón de Cándido',
      description: "THE place for cochinillo (roast suckling pig) - Segovia's signature dish. Reserve ahead! Near the Aqueduct.",
      lat: 40.9483,
      lng: -4.118,
      category: 'Food & Drink'
    },
    {
      id: 'segovia-6',
      name: 'José María Restaurant',
      description: "Another excellent traditional restaurant famous for cochinillo. Locals' favorite with warm atmosphere.",
      lat: 40.9495,
      lng: -4.1255,
      category: 'Food & Drink'
    },
    {
      id: 'segovia-7',
      name: 'Mirador de la Pradera de San Marcos',
      description: "Beautiful viewpoint offering stunning vistas of the Alcázar and city walls. Short walk from the center.",
      lat: 40.9515,
      lng: -4.1335,
      category: 'Viewpoint'
    },
    {
      id: 'segovia-8',
      name: 'Jewish Quarter',
      description: 'Historic neighborhood with narrow medieval streets. Rich history and charming atmosphere for exploring.',
      lat: 40.951,
      lng: -4.127,
      category: 'Historic Site'
    }
  ]
};

export const madridLocations = cityLocations.madrid;
export const segoviaLocations = cityLocations.segovia;
