// const samplpelistings = [
//   {
//     engine: "W16",
//     company: "Snaptags",
//     color: "Khaki",
//     mileage: 4,
//     image: {
//       url: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2Fyc3xlbnwwfHwwfHx8MA%3D%3D",
//       filename: "carListing",
//     },
//     price: 305334,
//     description:
//       "Luxury performance car with W16 engine for ultimate speed and comfort.",
//   },
//   {
//     engine: "V8",
//     company: "Apex Motors",
//     color: "Red",
//     mileage: 7,
//     image: {
//       url: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNhcnN8ZW58MHx8MHx8fDA%3D",
//       filename: "carListing",
//     },
//     price: 87500,
//     description:
//       "Powerful V8 muscle car built for adrenaline rush and speed enthusiasts.",
//   },
//   {
//     engine: "V6",
//     company: "UrbanDrive",
//     color: "Blue",
//     mileage: 2,
//     image: {
//       url: "https://images.unsplash.com/photo-1555353540-64580b51c258?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNhcnN8ZW58MHx8MHx8fDA%3D",
//       filename: "carListing",
//     },
//     price: 40500,
//     description:
//       "Reliable city cruiser with efficient performance and stylish design.",
//   },
//   {
//     engine: "Electric",
//     company: "VoltEdge",
//     color: "White",
//     mileage: 9,
//     image: {
//       url: "https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGNhcnN8ZW58MHx8MHx8fDA%3D",
//       filename: "carListing",
//     },
//     price: 65900,
//     description:
//       "Eco-friendly electric vehicle with state-of-the-art technology features.",
//   },
//   {
//     engine: "Hybrid",
//     company: "GreenMotion",
//     color: "Silver",
//     mileage: 1,
//     image: {
//       url: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2Fyc3xlbnwwfHwwfHx8MA%3D%3D",
//       filename: "carListing",
//     },
//     price: 49500,
//     description:
//       "Hybrid vehicle combining efficiency with comfort and stunning aesthetics.",
//   },
//   {
//     engine: "V12",
//     company: "Royal Rides",
//     color: "Black",
//     mileage: 6,
//     image: {
//       url: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNhcnN8ZW58MHx8MHx8fDA%3D",
//       filename: "carListing",
//     },
//     price: 220000,
//     description:
//       "Top-of-the-line V12 luxury sports car, delivering sheer dominance on roads.",
//   },
//   {
//     engine: "V6 Turbo",
//     company: "StormWheels",
//     color: "Yellow",
//     mileage: 5,
//     image: {
//       url: "https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGNhcnN8ZW58MHx8MHx8fDA%3D",
//       filename: "carListing",
//     },
//     price: 78000,
//     description:
//       "Sporty V6 Turbo beast, perfect for high-speed rides and off-road adventures.",
//   },
//   {
//     engine: "Inline-4",
//     company: "EcoMotors",
//     color: "Green",
//     mileage: 8,
//     image: {
//       url: "https://images.unsplash.com/photo-1555353540-64580b51c258?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNhcnN8ZW58MHx8MHx8fDA%3D",
//       filename: "carListing",
//     },
//     price: 28500,
//     description:
//       "Compact and fuel-efficient, ideal for city driving and daily commuting.",
//   },
//   {
//     engine: "Electric",
//     company: "ZenithDrive",
//     color: "Gray",
//     mileage: 3,
//     image: {
//       url: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNhcnN8ZW58MHx8MHx8fDA%3D",
//       filename: "carListing",
//     },
//     price: 72000,
//     description:
//       "Next-gen electric sedan with smart features and ultra-modern design.",
//   },
//   {
//     engine: "V10",
//     company: "VelocityX",
//     color: "Orange",
//     mileage: 10,
//     image: {
//       url: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2Fyc3xlbnwwfHwwfHx8MA%3D%3D",
//       filename: "carListing",
//     },
//     price: 150000,
//     description:
//       "Dynamic V10 supercar, engineered for speed, thrill, and luxury experience.",
//   },
// ];
// export default { data: samplpelistings };
