import { EBike, FilterState, KeuzeHulpState } from './types';

export const bikes: EBike[] = [
  {
    id: '1',
    slug: 'gazelle-cityzen-c380',
    brand: 'Gazelle',
    model: 'CityZen C380 HMB',
    year: 2025,
    price: 2799,
    priceCategory: 'midden',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'midden',
    motorBrand: 'Bosch',
    torque: 75,
    supportLevels: 4,
    batteryCapacity: 500,
    rangeManufacturer: 130,
    rangePractical: 85,
    chargeTime: 4.5,
    batteryRemovable: true,
    frameType: 'hoog-instap',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 23.5,
    maxWeight: 130,
    gearType: 'naaf',
    gearCount: 8,
    gearBrand: 'Shimano Nexus',
    suitableFor: ['woon-werk', 'recreatief'],
    scoreOverall: 8.7,
    scorePriceQuality: 8.2,
    scoreComfort: 9.0,
    scoreRange: 8.5,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Gazelle CityZen C380 HMB is een veelzijdige e-bike met krachtige Bosch middenmotor. Perfect voor dagelijks woon-werkverkeer en recreatieve ritten.',
    highlights: ['Krachtige Bosch Performance Line motor', 'Geïntegreerde 500Wh accu', 'Comfortabel en stabiel', 'Uitstekende remmen']
  },
  {
    id: '2',
    slug: 'gazelle-ultimate-c380',
    brand: 'Gazelle',
    model: 'Ultimate C380+ HMB',
    year: 2025,
    price: 3499,
    priceCategory: 'premium',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'midden',
    motorBrand: 'Bosch',
    torque: 85,
    supportLevels: 4,
    batteryCapacity: 625,
    rangeManufacturer: 170,
    rangePractical: 110,
    chargeTime: 5.0,
    batteryRemovable: true,
    frameType: 'laag-instap',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 25.0,
    maxWeight: 140,
    gearType: 'naaf',
    gearCount: 8,
    gearBrand: 'Shimano Nexus',
    suitableFor: ['woon-werk', 'recreatief', 'transport'],
    scoreOverall: 9.1,
    scorePriceQuality: 8.0,
    scoreComfort: 9.5,
    scoreRange: 9.2,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'Het vlaggenschip van Gazelle. De Ultimate C380+ biedt maximaal comfort met een grote accu en krachtige motor.',
    highlights: ['Bosch Performance Line CX motor', 'Extra grote 625Wh accu', 'Laag instapframe', 'Premium afwerking']
  },
  {
    id: '3',
    slug: 'gazelle-medeo-t10',
    brand: 'Gazelle',
    model: 'Medeo T10 HMB',
    year: 2025,
    price: 2499,
    priceCategory: 'midden',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'midden',
    motorBrand: 'Bosch',
    torque: 65,
    supportLevels: 4,
    batteryCapacity: 400,
    rangeManufacturer: 100,
    rangePractical: 65,
    chargeTime: 3.5,
    batteryRemovable: true,
    frameType: 'sportief',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 21.0,
    maxWeight: 130,
    gearType: 'derailleur',
    gearCount: 10,
    gearBrand: 'Shimano Deore',
    suitableFor: ['woon-werk', 'sportief', 'recreatief'],
    scoreOverall: 8.3,
    scorePriceQuality: 8.5,
    scoreComfort: 7.8,
    scoreRange: 7.5,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Gazelle Medeo T10 is een sportieve e-bike die licht aanvoelt en vlot rijdt. Ideaal voor actieve fietsers.',
    highlights: ['Lichtgewicht sportief frame', 'Bosch Active Line Plus', '10-versnellingen derailleur', 'Vlotte wegligging']
  },
  {
    id: '4',
    slug: 'batavus-finez-e-go-exclusive',
    brand: 'Batavus',
    model: 'Finez E-go Exclusive',
    year: 2025,
    price: 2599,
    priceCategory: 'midden',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'midden',
    motorBrand: 'Bosch',
    torque: 65,
    supportLevels: 4,
    batteryCapacity: 500,
    rangeManufacturer: 130,
    rangePractical: 80,
    chargeTime: 4.5,
    batteryRemovable: true,
    frameType: 'laag-instap',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 24.0,
    maxWeight: 130,
    gearType: 'naaf',
    gearCount: 7,
    gearBrand: 'Shimano Nexus',
    suitableFor: ['woon-werk', 'recreatief', 'transport'],
    scoreOverall: 8.4,
    scorePriceQuality: 8.6,
    scoreComfort: 8.8,
    scoreRange: 8.0,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Batavus Finez E-go Exclusive combineert Nederlands vakmanschap met Bosch technologie. Een betrouwbare allrounder.',
    highlights: ['Laag instap voor gemakkelijk op- en afstappen', 'Bosch Active Line Plus motor', 'Geïntegreerde verlichting', 'Stabiel en comfortabel']
  },
  {
    id: '5',
    slug: 'batavus-altura-e-go-power',
    brand: 'Batavus',
    model: 'Altura E-go Power',
    year: 2025,
    price: 3199,
    priceCategory: 'premium',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'midden',
    motorBrand: 'Bosch',
    torque: 85,
    supportLevels: 4,
    batteryCapacity: 625,
    rangeManufacturer: 160,
    rangePractical: 100,
    chargeTime: 5.0,
    batteryRemovable: true,
    frameType: 'hoog-instap',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 26.0,
    maxWeight: 150,
    gearType: 'naaf',
    gearCount: 8,
    gearBrand: 'Shimano Nexus',
    suitableFor: ['woon-werk', 'recreatief', 'transport'],
    scoreOverall: 8.8,
    scorePriceQuality: 7.9,
    scoreComfort: 9.2,
    scoreRange: 9.0,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Batavus Altura E-go Power is een krachtige toerfiets met groot bereik. Geschikt voor langere ritten.',
    highlights: ['Bosch Performance Line CX motor', 'Grote 625Wh accu', 'Extra stevig frame', 'Geschikt voor zwaardere belasting']
  },
  {
    id: '6',
    slug: 'batavus-velder-e-go',
    brand: 'Batavus',
    model: 'Velder E-go',
    year: 2025,
    price: 1799,
    priceCategory: 'budget',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'naaf-achter',
    motorBrand: 'Shimano',
    torque: 40,
    supportLevels: 3,
    batteryCapacity: 400,
    rangeManufacturer: 100,
    rangePractical: 60,
    chargeTime: 4.0,
    batteryRemovable: true,
    frameType: 'laag-instap',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 22.0,
    maxWeight: 120,
    gearType: 'naaf',
    gearCount: 7,
    gearBrand: 'Shimano Nexus',
    suitableFor: ['recreatief', 'woon-werk'],
    scoreOverall: 7.4,
    scorePriceQuality: 8.8,
    scoreComfort: 7.5,
    scoreRange: 7.0,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Batavus Velder E-go is een betaalbare instap e-bike. Ideaal voor kortere ritten en boodschappen.',
    highlights: ['Scherp geprijsd', 'Lichtgewicht', 'Eenvoudig in gebruik', 'Betrouwbare naafmotor']
  },
  {
    id: '7',
    slug: 'stella-livorno-superior',
    brand: 'Stella',
    model: 'Livorno Superior',
    year: 2025,
    price: 1999,
    priceCategory: 'budget',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'midden',
    motorBrand: 'Bafang',
    torque: 65,
    supportLevels: 5,
    batteryCapacity: 522,
    rangeManufacturer: 140,
    rangePractical: 80,
    chargeTime: 5.0,
    batteryRemovable: true,
    frameType: 'laag-instap',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 24.5,
    maxWeight: 130,
    gearType: 'naaf',
    gearCount: 7,
    gearBrand: 'Shimano Nexus',
    suitableFor: ['woon-werk', 'recreatief'],
    scoreOverall: 7.8,
    scorePriceQuality: 9.0,
    scoreComfort: 8.0,
    scoreRange: 7.8,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Stella Livorno Superior biedt middenmotor-kwaliteit voor een scherpe prijs. Direct van de fabrikant.',
    highlights: ['Uitstekende prijs-kwaliteit', 'Krachtige middenmotor', 'Grote accu voor de prijs', 'Direct van fabrikant']
  },
  {
    id: '8',
    slug: 'stella-vicenza-sport',
    brand: 'Stella',
    model: 'Vicenza Sport',
    year: 2025,
    price: 2399,
    priceCategory: 'midden',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'midden',
    motorBrand: 'Bafang',
    torque: 80,
    supportLevels: 5,
    batteryCapacity: 600,
    rangeManufacturer: 160,
    rangePractical: 95,
    chargeTime: 5.5,
    batteryRemovable: true,
    frameType: 'sportief',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 23.0,
    maxWeight: 130,
    gearType: 'derailleur',
    gearCount: 9,
    gearBrand: 'Shimano Alivio',
    suitableFor: ['woon-werk', 'sportief', 'recreatief'],
    scoreOverall: 8.1,
    scorePriceQuality: 8.8,
    scoreComfort: 7.5,
    scoreRange: 8.5,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Stella Vicenza Sport is een sportieve e-bike met groot bereik. Geschikt voor actieve fietsers die waarde zoeken.',
    highlights: ['Sportief frame', 'Grote 600Wh accu', 'Krachtige 80Nm motor', 'Scherpe prijs voor deze specs']
  },
  {
    id: '9',
    slug: 'giant-dailytour-e-plus-1',
    brand: 'Giant',
    model: 'DailyTour E+ 1',
    year: 2025,
    price: 2899,
    priceCategory: 'midden',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'midden',
    motorBrand: 'Giant SyncDrive',
    torque: 70,
    supportLevels: 5,
    batteryCapacity: 500,
    rangeManufacturer: 125,
    rangePractical: 80,
    chargeTime: 4.0,
    batteryRemovable: true,
    frameType: 'hoog-instap',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 22.5,
    maxWeight: 136,
    gearType: 'derailleur',
    gearCount: 10,
    gearBrand: 'Shimano Deore',
    suitableFor: ['woon-werk', 'recreatief'],
    scoreOverall: 8.5,
    scorePriceQuality: 8.3,
    scoreComfort: 8.5,
    scoreRange: 8.0,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Giant DailyTour E+ 1 combineert Giant\'s eigen motorsysteem met een lichtgewicht frame. Betrouwbaar en veelzijdig.',
    highlights: ['Giant SyncDrive motor (by Yamaha)', 'Lichtgewicht aluminium frame', 'EnergyPak accu', 'RideControl display']
  },
  {
    id: '10',
    slug: 'giant-explore-e-plus-2',
    brand: 'Giant',
    model: 'Explore E+ 2 GTS',
    year: 2025,
    price: 3299,
    priceCategory: 'premium',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'midden',
    motorBrand: 'Giant SyncDrive',
    torque: 80,
    supportLevels: 5,
    batteryCapacity: 625,
    rangeManufacturer: 155,
    rangePractical: 100,
    chargeTime: 4.5,
    batteryRemovable: true,
    frameType: 'sportief',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 24.0,
    maxWeight: 150,
    gearType: 'derailleur',
    gearCount: 11,
    gearBrand: 'Shimano Deore',
    suitableFor: ['sportief', 'recreatief', 'off-road'],
    scoreOverall: 8.9,
    scorePriceQuality: 8.1,
    scoreComfort: 8.2,
    scoreRange: 9.0,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Giant Explore E+ 2 is gebouwd voor avontuur. Geschikt voor zowel geasfalteerde als onverharde paden.',
    highlights: ['Geschikt voor off-road', 'Krachtige SyncDrive Sport motor', 'Grote accu', 'Brede banden voor grip']
  },
  {
    id: '11',
    slug: 'cube-touring-hybrid-one-500',
    brand: 'Cube',
    model: 'Touring Hybrid ONE 500',
    year: 2025,
    price: 2399,
    priceCategory: 'midden',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'midden',
    motorBrand: 'Bosch',
    torque: 65,
    supportLevels: 4,
    batteryCapacity: 500,
    rangeManufacturer: 130,
    rangePractical: 80,
    chargeTime: 4.5,
    batteryRemovable: true,
    frameType: 'sportief',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 23.0,
    maxWeight: 130,
    gearType: 'derailleur',
    gearCount: 10,
    gearBrand: 'Shimano Deore',
    suitableFor: ['woon-werk', 'recreatief', 'sportief'],
    scoreOverall: 8.2,
    scorePriceQuality: 8.5,
    scoreComfort: 7.8,
    scoreRange: 8.0,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Cube Touring Hybrid ONE 500 is een veelzijdige touring e-bike met sportieve uitstraling en betrouwbare Bosch motor.',
    highlights: ['Duits design en kwaliteit', 'Bosch Active Line Plus', 'Sportief maar comfortabel', 'Complete uitrusting']
  },
  {
    id: '12',
    slug: 'cube-supreme-hybrid-one-625',
    brand: 'Cube',
    model: 'Supreme Hybrid ONE 625',
    year: 2025,
    price: 3099,
    priceCategory: 'premium',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'midden',
    motorBrand: 'Bosch',
    torque: 85,
    supportLevels: 4,
    batteryCapacity: 625,
    rangeManufacturer: 165,
    rangePractical: 105,
    chargeTime: 5.0,
    batteryRemovable: true,
    frameType: 'laag-instap',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 25.5,
    maxWeight: 140,
    gearType: 'naaf',
    gearCount: 5,
    gearBrand: 'Shimano Nexus',
    suitableFor: ['woon-werk', 'recreatief', 'transport'],
    scoreOverall: 8.6,
    scorePriceQuality: 8.0,
    scoreComfort: 9.0,
    scoreRange: 9.0,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Cube Supreme Hybrid ONE 625 is een premium stadsfiets met laag instap en grote accu. Luxe en comfort.',
    highlights: ['Bosch Performance Line CX', 'Grote 625Wh accu', 'Laag instap comfort', 'Premium componenten']
  },
  {
    id: '13',
    slug: 'trek-verve-plus-3',
    brand: 'Trek',
    model: 'Verve+ 3',
    year: 2025,
    price: 2799,
    priceCategory: 'midden',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'midden',
    motorBrand: 'Bosch',
    torque: 65,
    supportLevels: 4,
    batteryCapacity: 500,
    rangeManufacturer: 125,
    rangePractical: 80,
    chargeTime: 4.5,
    batteryRemovable: true,
    frameType: 'laag-instap',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 23.5,
    maxWeight: 136,
    gearType: 'naaf',
    gearCount: 8,
    gearBrand: 'Shimano Nexus',
    suitableFor: ['woon-werk', 'recreatief'],
    scoreOverall: 8.4,
    scorePriceQuality: 8.1,
    scoreComfort: 8.8,
    scoreRange: 8.0,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Trek Verve+ 3 is een comfortabele stads e-bike met betrouwbare Bosch aandrijving. Populair bij forenzen.',
    highlights: ['Ergonomisch ontwerp', 'Bosch Active Line Plus', 'IsoZone comfort systeem', 'Geïntegreerde verlichting']
  },
  {
    id: '14',
    slug: 'trek-powerfly-5',
    brand: 'Trek',
    model: 'Powerfly 5',
    year: 2025,
    price: 3699,
    priceCategory: 'premium',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'midden',
    motorBrand: 'Bosch',
    torque: 85,
    supportLevels: 4,
    batteryCapacity: 625,
    rangeManufacturer: 120,
    rangePractical: 70,
    chargeTime: 5.0,
    batteryRemovable: true,
    frameType: 'sportief',
    frameMaterial: 'Aluminium',
    wheelSize: 29,
    weight: 24.0,
    maxWeight: 136,
    gearType: 'derailleur',
    gearCount: 12,
    gearBrand: 'Shimano Deore',
    suitableFor: ['sportief', 'off-road'],
    scoreOverall: 8.7,
    scorePriceQuality: 7.8,
    scoreComfort: 7.5,
    scoreRange: 8.0,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Trek Powerfly 5 is een elektrische mountainbike voor serieuze off-road avonturen. Krachtig en robuust.',
    highlights: ['E-MTB voor off-road', 'Bosch Performance Line CX', '29 inch wielen', 'Vering voorvork (120mm)']
  },
  {
    id: '15',
    slug: 'specialized-como-3-0',
    brand: 'Specialized',
    model: 'Turbo Como 3.0',
    year: 2025,
    price: 3199,
    priceCategory: 'premium',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'midden',
    motorBrand: 'Specialized',
    torque: 50,
    supportLevels: 3,
    batteryCapacity: 530,
    rangeManufacturer: 130,
    rangePractical: 85,
    chargeTime: 4.0,
    batteryRemovable: false,
    frameType: 'laag-instap',
    frameMaterial: 'Aluminium',
    wheelSize: 27.5,
    weight: 21.5,
    maxWeight: 127,
    gearType: 'naaf',
    gearCount: 8,
    gearBrand: 'Shimano Nexus',
    suitableFor: ['woon-werk', 'recreatief'],
    scoreOverall: 8.5,
    scorePriceQuality: 7.5,
    scoreComfort: 9.0,
    scoreRange: 8.2,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Specialized Turbo Como 3.0 voelt als een gewone fiets, maar dan met superkrachten. Fluisterstil en elegant.',
    highlights: ['Eigen Specialized motor', 'Zeer stille aandrijving', 'Strak geïntegreerd design', 'Mission Control app']
  },
  {
    id: '16',
    slug: 'cortina-e-common-hub',
    brand: 'Cortina',
    model: 'E-Common Hub',
    year: 2025,
    price: 1599,
    priceCategory: 'budget',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'naaf-voor',
    motorBrand: 'Cortina',
    torque: 30,
    supportLevels: 3,
    batteryCapacity: 418,
    rangeManufacturer: 90,
    rangePractical: 55,
    chargeTime: 4.0,
    batteryRemovable: true,
    frameType: 'laag-instap',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 21.0,
    maxWeight: 120,
    gearType: 'naaf',
    gearCount: 7,
    gearBrand: 'Shimano Nexus',
    suitableFor: ['recreatief', 'woon-werk'],
    scoreOverall: 7.0,
    scorePriceQuality: 9.0,
    scoreComfort: 7.2,
    scoreRange: 6.5,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Cortina E-Common Hub is de perfecte instap e-bike. Betaalbaar en eenvoudig voor dagelijks gebruik.',
    highlights: ['Laagste instapprijs', 'Eenvoudig en betrouwbaar', 'Lichtgewicht', 'Ideaal als eerste e-bike']
  },
  {
    id: '17',
    slug: 'cortina-e-foss-pro',
    brand: 'Cortina',
    model: 'E-Foss Pro',
    year: 2025,
    price: 2199,
    priceCategory: 'midden',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'midden',
    motorBrand: 'Bafang',
    torque: 65,
    supportLevels: 4,
    batteryCapacity: 504,
    rangeManufacturer: 120,
    rangePractical: 75,
    chargeTime: 5.0,
    batteryRemovable: true,
    frameType: 'hoog-instap',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 23.5,
    maxWeight: 130,
    gearType: 'naaf',
    gearCount: 8,
    gearBrand: 'Shimano Nexus',
    suitableFor: ['woon-werk', 'recreatief'],
    scoreOverall: 7.9,
    scorePriceQuality: 8.5,
    scoreComfort: 8.0,
    scoreRange: 7.5,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Cortina E-Foss Pro biedt middenmotor-prestaties voor een betaalbare prijs. Stoer en functioneel.',
    highlights: ['Middenmotor voor scherpe prijs', 'Stoer uiterlijk', 'Praktische uitrusting', 'Goede prijs-kwaliteit']
  },
  {
    id: '18',
    slug: 'sparta-m10ti',
    brand: 'Sparta',
    model: 'M10Ti',
    year: 2025,
    price: 2699,
    priceCategory: 'midden',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'midden',
    motorBrand: 'Bosch',
    torque: 65,
    supportLevels: 4,
    batteryCapacity: 500,
    rangeManufacturer: 130,
    rangePractical: 82,
    chargeTime: 4.5,
    batteryRemovable: true,
    frameType: 'laag-instap',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 24.0,
    maxWeight: 130,
    gearType: 'naaf',
    gearCount: 8,
    gearBrand: 'Shimano Nexus',
    suitableFor: ['woon-werk', 'recreatief', 'transport'],
    scoreOverall: 8.3,
    scorePriceQuality: 8.3,
    scoreComfort: 8.5,
    scoreRange: 8.0,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Sparta M10Ti is een robuuste Hollandse e-bike met bewezen Bosch technologie. Betrouwbaar voor dagelijks gebruik.',
    highlights: ['Betrouwbare Bosch motor', 'Hollands merk', 'Stabiel en robuust', 'Goed uitgerust']
  },
  {
    id: '19',
    slug: 'sparta-d-rule-m8tb',
    brand: 'Sparta',
    model: 'D-Rule M8Tb',
    year: 2025,
    price: 2299,
    priceCategory: 'midden',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'midden',
    motorBrand: 'Bosch',
    torque: 65,
    supportLevels: 4,
    batteryCapacity: 500,
    rangeManufacturer: 130,
    rangePractical: 78,
    chargeTime: 4.5,
    batteryRemovable: true,
    frameType: 'hoog-instap',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 23.5,
    maxWeight: 130,
    gearType: 'naaf',
    gearCount: 8,
    gearBrand: 'Shimano Nexus',
    suitableFor: ['woon-werk', 'recreatief'],
    scoreOverall: 8.0,
    scorePriceQuality: 8.6,
    scoreComfort: 8.0,
    scoreRange: 7.8,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Sparta D-Rule M8Tb is een stoere herenfiets met Bosch middenmotor. Sportieve uitstraling, comfortabel rijgedrag.',
    highlights: ['Sportieve herenfiets', 'Bosch Active Line Plus', 'Goede prijs-kwaliteit', 'Robuust frame']
  },
  {
    id: '20',
    slug: 'tenways-cgo600-pro',
    brand: 'Tenways',
    model: 'CGO600 Pro',
    year: 2025,
    price: 1499,
    priceCategory: 'budget',
    images: ['/images/bikes/placeholder.jpg'],
    motorType: 'naaf-achter',
    motorBrand: 'Mivice',
    torque: 35,
    supportLevels: 4,
    batteryCapacity: 360,
    rangeManufacturer: 100,
    rangePractical: 55,
    chargeTime: 3.5,
    batteryRemovable: false,
    frameType: 'sportief',
    frameMaterial: 'Aluminium',
    wheelSize: 28,
    weight: 16.0,
    maxWeight: 120,
    gearType: 'naaf',
    gearCount: 1,
    gearBrand: 'Single speed',
    suitableFor: ['woon-werk', 'recreatief'],
    scoreOverall: 7.6,
    scorePriceQuality: 9.2,
    scoreComfort: 6.8,
    scoreRange: 6.5,
    affiliateUrl: '#',
    testRideUrl: '#',
    description: 'De Tenways CGO600 Pro is een ultralichte e-bike die eruitziet als een gewone fiets. Perfect voor de stad.',
    highlights: ['Slechts 16 kg', 'Strak minimalistisch design', 'Riemaandrijving (onderhoudsvrij)', 'Zeer betaalbaar']
  }
];

export function getAllBrands(): string[] {
  const brands = [...new Set(bikes.map(b => b.brand))];
  return brands.sort();
}

export function filterBikes(filters: FilterState): EBike[] {
  let result = [...bikes];

  // Price range
  result = result.filter(b => b.price >= filters.priceRange[0] && b.price <= filters.priceRange[1]);

  // Brands
  if (filters.brands.length > 0) {
    result = result.filter(b => filters.brands.includes(b.brand));
  }

  // Motor types
  if (filters.motorTypes.length > 0) {
    result = result.filter(b => filters.motorTypes.includes(b.motorType));
  }

  // Frame types
  if (filters.frameTypes.length > 0) {
    result = result.filter(b => filters.frameTypes.includes(b.frameType));
  }

  // Suitable for
  if (filters.suitableFor.length > 0) {
    result = result.filter(b => filters.suitableFor.some(s => b.suitableFor.includes(s as any)));
  }

  // Min range
  if (filters.minRange > 0) {
    result = result.filter(b => b.rangePractical >= filters.minRange);
  }

  // Sort
  switch (filters.sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'score':
      result.sort((a, b) => b.scoreOverall - a.scoreOverall);
      break;
    case 'range':
      result.sort((a, b) => b.rangePractical - a.rangePractical);
      break;
    case 'newest':
      result.sort((a, b) => b.year - a.year);
      break;
  }

  return result;
}

export function getBikeBySlug(slug: string): EBike | undefined {
  return bikes.find(b => b.slug === slug);
}

export function getRecommendations(state: KeuzeHulpState): EBike[] {
  const scored = bikes.map(bike => {
    let score = 0;

    // Budget match (most important)
    if (bike.price >= state.budget[0] && bike.price <= state.budget[1]) {
      score += 30;
    } else if (bike.price < state.budget[0]) {
      score += 15;
    }

    // Usage match
    const usageOverlap = state.gebruiksDoel.filter(g => bike.suitableFor.includes(g));
    score += usageOverlap.length * 15;

    // Frame preference
    if (state.frameVoorkeur && state.frameVoorkeur !== 'geen-voorkeur') {
      if (bike.frameType === state.frameVoorkeur) score += 10;
    }

    // Range for commuters
    if (state.woonWerkAfstand && state.gebruiksDoel.includes('woon-werk')) {
      const neededRange = state.woonWerkAfstand * 2 * 1.3; // round trip + 30% buffer
      if (bike.rangePractical >= neededRange) {
        score += 15;
      } else if (bike.rangePractical >= state.woonWerkAfstand * 2) {
        score += 8;
      }
    }

    // Bonus for overall score
    score += bike.scoreOverall * 2;

    // Knowledge level adjustments
    if (state.kennisNiveau === 'beginner') {
      if (bike.frameType === 'laag-instap') score += 5;
      if (bike.gearType === 'naaf') score += 3;
    } else if (state.kennisNiveau === 'expert') {
      if (bike.motorType === 'midden') score += 3;
    }

    return { bike, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(s => s.bike);
}

export function getSimilarBikes(bike: EBike, count: number = 3): EBike[] {
  const scored = bikes
    .filter(b => b.id !== bike.id)
    .map(b => {
      let similarity = 0;

      // Same price category
      if (b.priceCategory === bike.priceCategory) similarity += 3;

      // Similar price (within 500 euro)
      if (Math.abs(b.price - bike.price) <= 500) similarity += 2;

      // Same motor type
      if (b.motorType === bike.motorType) similarity += 2;

      // Same frame type
      if (b.frameType === bike.frameType) similarity += 2;

      // Overlapping usage
      const overlap = b.suitableFor.filter(s => bike.suitableFor.includes(s));
      similarity += overlap.length;

      // Similar range
      if (Math.abs(b.rangePractical - bike.rangePractical) <= 20) similarity += 1;

      return { bike: b, similarity };
    });

  return scored
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, count)
    .map(s => s.bike);
}
