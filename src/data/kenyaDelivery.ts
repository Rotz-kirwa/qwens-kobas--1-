export type DeliveryMethod = "pickup" | "door";

export interface CountyDeliveryConfig {
  county: string;
  points: string[];
  pickupFee: number;
  doorFee: number;
  eta: string;
}

const deliverySeed: Omit<CountyDeliveryConfig, "pickupFee" | "doorFee">[] = [
  { county: "Baringo", points: ["Kabarnet Town", "Eldama Ravine", "Marigat Centre"], eta: "2-4 business days" },
  { county: "Bomet", points: ["Bomet Town", "Sotik Town", "Longisa Centre"], eta: "2-4 business days" },
  { county: "Bungoma", points: ["Bungoma Town", "Webuye", "Kimilili"], eta: "2-4 business days" },
  { county: "Busia", points: ["Busia Town", "Malaba", "Funyula"], eta: "2-4 business days" },
  { county: "Elgeyo-Marakwet", points: ["Iten", "Kapsowar", "Chebara"], eta: "2-4 business days" },
  { county: "Embu", points: ["Embu Town", "Runyenjes", "Manyatta"], eta: "1-3 business days" },
  { county: "Garissa", points: ["Garissa Town", "Hulugho", "Modika"], eta: "3-5 business days" },
  { county: "Homa Bay", points: ["Homa Bay Town", "Oyugis", "Mbita"], eta: "2-4 business days" },
  { county: "Isiolo", points: ["Isiolo Town", "Merti", "Kinna"], eta: "3-5 business days" },
  { county: "Kajiado", points: ["Kitengela", "Kajiado Town", "Ngong"], eta: "1-2 business days" },
  { county: "Kakamega", points: ["Kakamega Town", "Mumias", "Lurambi"], eta: "2-4 business days" },
  { county: "Kericho", points: ["Kericho Town", "Litein", "Ainamoi"], eta: "2-4 business days" },
  { county: "Kiambu", points: ["Thika", "Kiambu Town", "Ruiru"], eta: "Same day / next day" },
  { county: "Kilifi", points: ["Kilifi Town", "Malindi", "Mariakani"], eta: "2-4 business days" },
  { county: "Kirinyaga", points: ["Kerugoya", "Kutus", "Wang'uru"], eta: "1-3 business days" },
  { county: "Kisii", points: ["Kisii Town", "Ogembo", "Suneka"], eta: "2-4 business days" },
  { county: "Kisumu", points: ["Kisumu CBD", "Kondele", "Maseno"], eta: "2-4 business days" },
  { county: "Kitui", points: ["Kitui Town", "Mwingi", "Mutomo"], eta: "2-4 business days" },
  { county: "Kwale", points: ["Ukunda", "Kwale Town", "Msambweni"], eta: "2-4 business days" },
  { county: "Laikipia", points: ["Nanyuki", "Nyahururu", "Rumuruti"], eta: "2-4 business days" },
  { county: "Lamu", points: ["Lamu Town", "Mpeketoni", "Mokowe"], eta: "4-6 business days" },
  { county: "Machakos", points: ["Machakos Town", "Mlolongo", "Athi River"], eta: "1-2 business days" },
  { county: "Makueni", points: ["Wote", "Makindu", "Emali"], eta: "2-4 business days" },
  { county: "Mandera", points: ["Mandera Town", "Elwak", "Rhamu"], eta: "4-6 business days" },
  { county: "Marsabit", points: ["Marsabit Town", "Moyale", "Laisamis"], eta: "4-6 business days" },
  { county: "Meru", points: ["Meru Town", "Maua", "Mikinduri"], eta: "1-3 business days" },
  { county: "Migori", points: ["Migori Town", "Awendo", "Rongo"], eta: "2-4 business days" },
  { county: "Mombasa", points: ["Mombasa CBD", "Nyali", "Changamwe"], eta: "2-4 business days" },
  { county: "Murang'a", points: ["Murang'a Town", "Kenol", "Kangema"], eta: "1-2 business days" },
  { county: "Nairobi", points: ["Adams Arcade", "CBD Moi Avenue", "Westlands"], eta: "Same day / next day" },
  { county: "Nakuru", points: ["Nakuru CBD", "Naivasha", "Molo"], eta: "1-3 business days" },
  { county: "Nandi", points: ["Kapsabet", "Nandi Hills", "Mosoriot"], eta: "2-4 business days" },
  { county: "Narok", points: ["Narok Town", "Kilgoris", "Mai Mahiu"], eta: "2-4 business days" },
  { county: "Nyamira", points: ["Nyamira Town", "Keroka", "Nyansiongo"], eta: "2-4 business days" },
  { county: "Nyandarua", points: ["Ol Kalou", "Nyahururu", "Engineer"], eta: "2-4 business days" },
  { county: "Nyeri", points: ["Nyeri Town", "Karatina", "Othaya"], eta: "1-3 business days" },
  { county: "Samburu", points: ["Maralal", "Baragoi", "Wamba"], eta: "3-5 business days" },
  { county: "Siaya", points: ["Siaya Town", "Ugunja", "Bondo"], eta: "2-4 business days" },
  { county: "Taita-Taveta", points: ["Voi", "Wundanyi", "Taveta"], eta: "2-4 business days" },
  { county: "Tana River", points: ["Hola", "Bura", "Garsen"], eta: "3-5 business days" },
  { county: "Tharaka-Nithi", points: ["Chuka", "Kathwana", "Marimanti"], eta: "2-4 business days" },
  { county: "Trans Nzoia", points: ["Kitale", "Kiminini", "Endebess"], eta: "2-4 business days" },
  { county: "Turkana", points: ["Lodwar", "Kakuma", "Lokichogio"], eta: "4-6 business days" },
  { county: "Uasin Gishu", points: ["Eldoret CBD", "Zion Mall", "Burnt Forest"], eta: "2-4 business days" },
  { county: "Vihiga", points: ["Mbale", "Luanda", "Chavakali"], eta: "2-4 business days" },
  { county: "Wajir", points: ["Wajir Town", "Griftu", "Habaswein"], eta: "4-6 business days" },
  { county: "West Pokot", points: ["Kapenguria", "Makutano", "Chepareria"], eta: "3-5 business days" },
];

export const kenyaDeliveryLocations: CountyDeliveryConfig[] = deliverySeed.map((location) => ({
  ...location,
  pickupFee: 1,
  doorFee: 1,
}));

export const defaultKenyaDelivery = kenyaDeliveryLocations.find(
  (location) => location.county === "Nairobi",
) ?? kenyaDeliveryLocations[0];

export const getCountyDelivery = (county: string) =>
  kenyaDeliveryLocations.find((location) => location.county === county) ?? defaultKenyaDelivery;
