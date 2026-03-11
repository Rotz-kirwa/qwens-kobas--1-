export type DeliveryMethod = "pickup" | "door";

export interface CountyDeliveryConfig {
  county: string;
  points: string[];
  pickupFee: number;
  doorFee: number;
  eta: string;
}

export const kenyaDeliveryLocations: CountyDeliveryConfig[] = [
  { county: "Baringo", points: ["Kabarnet Town", "Eldama Ravine", "Marigat Centre"], pickupFee: 180, doorFee: 320, eta: "2-4 business days" },
  { county: "Bomet", points: ["Bomet Town", "Sotik Town", "Longisa Centre"], pickupFee: 170, doorFee: 300, eta: "2-4 business days" },
  { county: "Bungoma", points: ["Bungoma Town", "Webuye", "Kimilili"], pickupFee: 170, doorFee: 290, eta: "2-4 business days" },
  { county: "Busia", points: ["Busia Town", "Malaba", "Funyula"], pickupFee: 180, doorFee: 310, eta: "2-4 business days" },
  { county: "Elgeyo-Marakwet", points: ["Iten", "Kapsowar", "Chebara"], pickupFee: 190, doorFee: 330, eta: "2-4 business days" },
  { county: "Embu", points: ["Embu Town", "Runyenjes", "Manyatta"], pickupFee: 160, doorFee: 280, eta: "1-3 business days" },
  { county: "Garissa", points: ["Garissa Town", "Hulugho", "Modika"], pickupFee: 240, doorFee: 420, eta: "3-5 business days" },
  { county: "Homa Bay", points: ["Homa Bay Town", "Oyugis", "Mbita"], pickupFee: 190, doorFee: 330, eta: "2-4 business days" },
  { county: "Isiolo", points: ["Isiolo Town", "Merti", "Kinna"], pickupFee: 220, doorFee: 390, eta: "3-5 business days" },
  { county: "Kajiado", points: ["Kitengela", "Kajiado Town", "Ngong"], pickupFee: 140, doorFee: 230, eta: "1-2 business days" },
  { county: "Kakamega", points: ["Kakamega Town", "Mumias", "Lurambi"], pickupFee: 170, doorFee: 300, eta: "2-4 business days" },
  { county: "Kericho", points: ["Kericho Town", "Litein", "Ainamoi"], pickupFee: 160, doorFee: 280, eta: "2-4 business days" },
  { county: "Kiambu", points: ["Thika", "Kiambu Town", "Ruiru"], pickupFee: 120, doorFee: 200, eta: "Same day / next day" },
  { county: "Kilifi", points: ["Kilifi Town", "Malindi", "Mariakani"], pickupFee: 210, doorFee: 360, eta: "2-4 business days" },
  { county: "Kirinyaga", points: ["Kerugoya", "Kutus", "Wang'uru"], pickupFee: 160, doorFee: 270, eta: "1-3 business days" },
  { county: "Kisii", points: ["Kisii Town", "Ogembo", "Suneka"], pickupFee: 180, doorFee: 310, eta: "2-4 business days" },
  { county: "Kisumu", points: ["Kisumu CBD", "Kondele", "Maseno"], pickupFee: 170, doorFee: 300, eta: "2-4 business days" },
  { county: "Kitui", points: ["Kitui Town", "Mwingi", "Mutomo"], pickupFee: 190, doorFee: 340, eta: "2-4 business days" },
  { county: "Kwale", points: ["Ukunda", "Kwale Town", "Msambweni"], pickupFee: 210, doorFee: 370, eta: "2-4 business days" },
  { county: "Laikipia", points: ["Nanyuki", "Nyahururu", "Rumuruti"], pickupFee: 180, doorFee: 320, eta: "2-4 business days" },
  { county: "Lamu", points: ["Lamu Town", "Mpeketoni", "Mokowe"], pickupFee: 260, doorFee: 460, eta: "4-6 business days" },
  { county: "Machakos", points: ["Machakos Town", "Mlolongo", "Athi River"], pickupFee: 130, doorFee: 220, eta: "1-2 business days" },
  { county: "Makueni", points: ["Wote", "Makindu", "Emali"], pickupFee: 170, doorFee: 300, eta: "2-4 business days" },
  { county: "Mandera", points: ["Mandera Town", "Elwak", "Rhamu"], pickupFee: 280, doorFee: 490, eta: "4-6 business days" },
  { county: "Marsabit", points: ["Marsabit Town", "Moyale", "Laisamis"], pickupFee: 260, doorFee: 450, eta: "4-6 business days" },
  { county: "Meru", points: ["Meru Town", "Maua", "Mikinduri"], pickupFee: 170, doorFee: 300, eta: "1-3 business days" },
  { county: "Migori", points: ["Migori Town", "Awendo", "Rongo"], pickupFee: 190, doorFee: 330, eta: "2-4 business days" },
  { county: "Mombasa", points: ["Mombasa CBD", "Nyali", "Changamwe"], pickupFee: 190, doorFee: 330, eta: "2-4 business days" },
  { county: "Murang'a", points: ["Murang'a Town", "Kenol", "Kangema"], pickupFee: 140, doorFee: 230, eta: "1-2 business days" },
  { county: "Nairobi", points: ["Adams Arcade", "CBD Moi Avenue", "Westlands"], pickupFee: 70, doorFee: 160, eta: "Same day / next day" },
  { county: "Nakuru", points: ["Nakuru CBD", "Naivasha", "Molo"], pickupFee: 150, doorFee: 260, eta: "1-3 business days" },
  { county: "Nandi", points: ["Kapsabet", "Nandi Hills", "Mosoriot"], pickupFee: 170, doorFee: 300, eta: "2-4 business days" },
  { county: "Narok", points: ["Narok Town", "Kilgoris", "Mai Mahiu"], pickupFee: 180, doorFee: 310, eta: "2-4 business days" },
  { county: "Nyamira", points: ["Nyamira Town", "Keroka", "Nyansiongo"], pickupFee: 180, doorFee: 310, eta: "2-4 business days" },
  { county: "Nyandarua", points: ["Ol Kalou", "Nyahururu", "Engineer"], pickupFee: 170, doorFee: 300, eta: "2-4 business days" },
  { county: "Nyeri", points: ["Nyeri Town", "Karatina", "Othaya"], pickupFee: 150, doorFee: 250, eta: "1-3 business days" },
  { county: "Samburu", points: ["Maralal", "Baragoi", "Wamba"], pickupFee: 240, doorFee: 420, eta: "3-5 business days" },
  { county: "Siaya", points: ["Siaya Town", "Ugunja", "Bondo"], pickupFee: 180, doorFee: 310, eta: "2-4 business days" },
  { county: "Taita-Taveta", points: ["Voi", "Wundanyi", "Taveta"], pickupFee: 210, doorFee: 360, eta: "2-4 business days" },
  { county: "Tana River", points: ["Hola", "Bura", "Garsen"], pickupFee: 250, doorFee: 440, eta: "3-5 business days" },
  { county: "Tharaka-Nithi", points: ["Chuka", "Kathwana", "Marimanti"], pickupFee: 180, doorFee: 320, eta: "2-4 business days" },
  { county: "Trans Nzoia", points: ["Kitale", "Kiminini", "Endebess"], pickupFee: 180, doorFee: 320, eta: "2-4 business days" },
  { county: "Turkana", points: ["Lodwar", "Kakuma", "Lokichogio"], pickupFee: 290, doorFee: 510, eta: "4-6 business days" },
  { county: "Uasin Gishu", points: ["Eldoret CBD", "Zion Mall", "Burnt Forest"], pickupFee: 170, doorFee: 300, eta: "2-4 business days" },
  { county: "Vihiga", points: ["Mbale", "Luanda", "Chavakali"], pickupFee: 170, doorFee: 290, eta: "2-4 business days" },
  { county: "Wajir", points: ["Wajir Town", "Griftu", "Habaswein"], pickupFee: 280, doorFee: 490, eta: "4-6 business days" },
  { county: "West Pokot", points: ["Kapenguria", "Makutano", "Chepareria"], pickupFee: 220, doorFee: 390, eta: "3-5 business days" },
];

export const defaultKenyaDelivery = kenyaDeliveryLocations.find(
  (location) => location.county === "Nairobi",
) ?? kenyaDeliveryLocations[0];

export const getCountyDelivery = (county: string) =>
  kenyaDeliveryLocations.find((location) => location.county === county) ?? defaultKenyaDelivery;
