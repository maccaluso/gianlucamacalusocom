export interface project {
  id: number,
  name: string,
  slug: string,
  description: string,
  year: string,
  cover: string,
  images: projectImage[],
  skills: string[],
  mates: projectMate[]
}

export interface projectImage {
  fileName: string,
  caption: string,
  alt: string
}

export interface projectMate {
  name: string,
  role: string
}

export const projects:project[] = [
  {
    id: 1,
    name: 'Malossicom',
    slug: '01-malossi-com',
    description: `
      This was the first project I did for the motorcycle and scooter parts company Malossi©. It's a Wordpress© custom theme hosted
      on WPEngine© infrastructure with CDN caching, SEO optimization and faster than light UI responsiveness. 
      It featured also a custom made International Store locator base on Google Maps© functionalities and apis.
    `,
    year: '2014',
    cover: 'cover.jpeg',
    images: [
      { fileName: 'home.jpeg', caption: 'Home page with its widgets', alt: 'Home page' },
      { fileName: 'blog-roll.jpeg', caption: 'The website blog roll', alt: 'Blog roll' },
      { fileName: 'single-post.jpeg', caption: 'Single post page template', alt: 'Single post'  },
      { fileName: 'store-locator.jpeg', caption: 'Custom store locator based on Google Maps©', alt: 'Store locator'  }
    ],
    skills: ['art direction', 'UI/UX', 'frontend dev', 'backend dev'],
    mates: [
      { name: 'Egidio Rimoli', role: 'Project Lead' }
    ]
  },
  {
    id: 2,
    name: 'Malossi Store',
    slug: '02-malossi-store',
    description: `
      Malossi Store is a unique eCommerce web application developed in .NET by Fabio Ferrari and targeted to the final customer. 
      I designed and coded the user interface, and wrote the markup, CSS and frontend functionalities, included a multimedia product viewer with 3D capabilities. 
      It's able to search parts, based on a giant database of motorcycles and scooter brands and models.
      It was also possible to configure and cache user based queries and provide useful up-sells and cross-sells hints at checkout.
    `,
    year: '2015',
    cover: 'cover.jpeg',
    images: [
      { fileName: 'home.jpeg', caption: '', alt: 'Home page' },
      { fileName: 'carrello.jpeg', caption: 'Cart page with up sells and cross sells', alt: 'Cart' },
      { fileName: 'checkout.jpeg', caption: '', alt: 'Checkout' },
      { fileName: 'scheda-modello.jpeg', caption: '', alt: 'Model page'  },
      { fileName: 'scheda-prodotto.jpeg', caption: '', alt: 'Product page'  }
    ],
    skills: ['art direction', 'UI/UX', 'frontend dev'],
    mates: [
      { name: 'Egidio Rimoli', role: 'Project Lead' }, { name: 'Fabio Ferrari', role: 'Backend development' }
    ]
  },
  {
    id: 3,
    name: 'Malossi Commerce System',
    slug: '03-malossi-commerce-system',
    description: `
      Egidio Rimoli, Head of digital at Malossi©, asked me to plan and develop the logo, icons and UI/UX of this
      B2B eCommerce website used by resellers to find info about products and buy their stocks for final customers.
      Every reseller had his personalized discounts, frequenly purchased items and personal area with invoices, order history and 
      prsonalized documentation knowledge base. It uses the same tech stack of B2C eCommerce platform.
    `,
    year: '2016',
    cover: 'cover.jpeg',
    images: [
      { fileName: 'Family-Index.jpeg', caption: '', alt: 'Family index' },
      { fileName: 'FileIn.jpeg', caption: '', alt: 'File in' },
      { fileName: 'modello-list.jpeg', caption: '', alt: 'Model list'  },
      { fileName: 'Product-Index.jpeg', caption: '', alt: 'Product index'  },
      { fileName: 'Stat-Clienti.jpeg', caption: '', alt: 'Client stats'  }
    ],
    skills: ['art direction', 'UI/UX', 'frontend dev'],
    mates: [
      { name: 'Egidio Rimoli', role: 'Project Lead' }, { name: 'Fabio Ferrari', role: 'Backend development' }
    ]
  },
  {
    id: 4,
    name: 'Placeof',
    slug: '04-placeof',
    description: `
      Placeof was an experimental social network for book enthusiasts.
      After logging in, users were able to add their favourite books, including authors, summaries and places detailed in the book.
      Besides common information, book cards showed the geographical path featured in the book over a world map,
      so users could follow the story also with a visual rappresentation of book places and their relationships.
      Combine this with social functionalities (e.g. liking&sharing) and here you have your "literature rabbit hole"!
      For the project I designed the UI, developed the UX and coded the frontend in Angular.
    `,
    year: '2016',
    cover: 'cover.jpeg',
    images: [
      { fileName: 'add-book-form.jpeg', caption: '', alt: 'Add book form' },
      { fileName: 'author-profile.jpeg', caption: '', alt: 'Author profile' },
      { fileName: 'book-card.jpeg', caption: '', alt: 'Book card'  },
      { fileName: 'book-places-1.jpeg', caption: '', alt: 'Book places 1'  },
      { fileName: 'book-places-2.jpeg', caption: '', alt: 'Book places 2'  },
      { fileName: 'book-places-3.jpeg', caption: '', alt: 'Book places 3'  },
      { fileName: 'book-places-intro-1.jpeg', caption: '', alt: 'Book places intro 1'  },
      { fileName: 'book-places-intro-2.jpeg', caption: '', alt: 'Book places intro 2'  },
      { fileName: 'user-profile.jpeg', caption: '', alt: 'User profile'  },
    ],
    skills: ['art direction', 'UI/UX', 'frontend dev'],
    mates: [
      { name: 'Mauro Ferrario', role: 'Project Lead & Backend development' }
    ]
  },
  {
    id: 5,
    name: 'Michielan Museum',
    slug: '05-michielan-museum',
    description: `
      Creative director Roberto Pomi (Moville) asked me to develop the interaction design for Michielan Museum of Ice cream.
      Located in Jiaxing - Zhejiang, China - the museum tells the story of ice cream through history. 
      For this project I developed a wall screen application with ice-cream based recipes, a rotary table application (something like the "Wheel of Fortune")
      aimed for showing basic nutrition facts and properties about ice cream tastes, a virtual ice cream making machine and 
      a custom platform game for kids called "Michi, the ice cream maker" with the collaboration of Roberto Fazio and Sara Colaone.  
    `,
    year: '2017',
    cover: 'cover.jpeg',
    images: [
      { fileName: 'virtual-ice-cream-machine.jpeg', caption: '', alt: 'Virtual ice cream machine' },
      { fileName: 'rotary-table-app.jpeg', caption: '', alt: 'Rotary table app' },
      { fileName: 'wall-screen-app.jpeg', caption: '', alt: 'Wall screen app'  },
      { fileName: 'ipad-stands-1.jpeg', caption: '', alt: 'Ipad stands 1'  },
      { fileName: 'ipad-stands-2.jpeg', caption: '', alt: 'Ipad stands 2'  },
      { fileName: 'michi-welcome-screen.jpeg', caption: '', alt: 'Michi - Welcome screen'  },
      { fileName: 'michi-level-one.jpeg', caption: '', alt: 'Michi - Level one'  },
      { fileName: 'michi-level-two.jpeg', caption: '', alt: 'Michi - Level two'  },
      { fileName: 'michi-level-three.jpeg', caption: '', alt: 'Michi - Level three'  },
      { fileName: 'michi-game-options.jpeg', caption: '', alt: 'Michi - Game options'  },
      { fileName: 'michi-victory-screen.jpeg', caption: '', alt: 'Michi - Victory screen'  }
    ],
    skills: ['interaction desing', 'exhibit design', 'game design', 'coding'],
    mates: [
      { name: 'Roberto Pomi', role: 'Creative direction & Project Lead' }, 
      { name: 'Sara Colaone', role: 'Illustration' },
      { name: 'Roberto Fazio', role: 'Unity development' }
    ]
  },
  {
    id: 6,
    name: 'Waterfall',
    slug: '06-waterfall',
    description: `
      This project was thought and developed with Apparati Effimeri, lead architectural projection mapping and interaction design company.
      Visually, it consisted in an infinite stream of raylights, rain drops and flowers, capable of detecting and avoiding up to four visitors.
      Technically the goal was achieved by a double projection from front and top, a visualizing software written in Processing and a C++ server for
      presence tracking making use of real time data coming from a network of MS Kinect and the OpenCV library.
    `,
    year: '2017',
    cover: 'cover.jpeg',
    images: [
      { fileName: 'waterfall-1.jpeg', caption: '', alt: 'Waterfall 1' },
      { fileName: 'waterfall-2.jpeg', caption: '', alt: 'Waterfall 2' },
      { fileName: 'waterfall-3.jpeg', caption: '', alt: 'Waterfall 3'  }
    ],
    skills: ['art direction', 'interaction design', 'creative coding'],
    mates: [
      { name: 'Marco Grassivaro', role: 'Project Lead' },
      { name: 'Federico Bigi', role: 'Project Lead' },
      { name: 'Riccardo Spezialetti', role: 'Computer vision & Coding' }
    ]
  },
  {
    id: 7,
    name: 'La via della libertà',
    slug: '07-la-via-della-liberta',
    description: `
      "La via della libertà" is a spatial computing web project developed by Francesco Bagni. Through interactive maps, longform stories
      and a system of location based physical interaction with the web application, tells the fictional story of an italian partisan
      during WWII, in the area of the Enza river near Reggio Emilia, Italy. Fictional events follow the places of real world events 
      that took place at the time, bringing visitors in a journey of hints and tips about historic and geographical landscape of the area.
      For the project I developed and coded a completely "Vanilla Javascript" web application and the Mapbox.js© custom style it uses.
    `,
    year: '2018',
    cover: 'cover.jpeg',
    images: [
      { fileName: 'interactive-map.jpeg', caption: '', alt: 'Interactive map' },
      { fileName: 'comuni-vetto.jpeg', caption: '', alt: 'Towns: Vetto' },
      { fileName: 'cronologia-e-personaggi.jpeg', caption: '', alt: 'History and characters'  },
      { fileName: 'episodi-casa-di-pasquale-marconi.jpeg', caption: '', alt: 'Episodes: Pasquale Marconi\'s house'  },
      { fileName: 'tracce-1.jpeg', caption: '', alt: 'Marks 1'  },
      { fileName: 'tracce-2.jpeg', caption: '', alt: 'Marks 2'  }
    ],
    skills: ['frontend dev'],
    mates: [
      { name: 'Francesco Bagni', role: 'UI/UX Lead' },
      { name: 'Malica Worms', role: 'Art direction' }
    ]
  },
  {
    id: 8,
    name: 'Ideas to move',
    slug: '08-ideas-to-move',
    description: `
      Ideas to Move is an EU funded web project about International Cooperation. 
      It consists in a progressive web application for mobiles with blogging, storytelling and social features, 
      supported by a network of information websites focused on the purpose of disseminating knowledge upon the activities, mission
      and humanitarian goals of international cooperation.
      The PWA was written in Angular, hosted on Firebase© infrastructure and maked use of their real-time data capabilities.
      The websites were written in Vanilla Javascript.
    `,
    year: '2018',
    cover: 'cover.jpeg',
    images: [
      { fileName: 'bestpractices-1.jpeg', caption: '', alt: 'Best practices 1' },
      { fileName: 'bestpractices-2.jpeg', caption: '', alt: 'Best practices 2' },
      { fileName: 'bestpractices-about-page.jpeg', caption: '', alt: 'Best practices: About page' },
      { fileName: 'bestpractices-longform-story.jpeg', caption: '', alt: 'Best practices: Longform story' },
      { fileName: 'cooperation-1.jpeg', caption: '', alt: 'What is international cooperation 1' },
      { fileName: 'cooperation-3.jpeg', caption: '', alt: 'What is international cooperation 2' },
      { fileName: 'cooperation-1.jpeg', caption: '', alt: 'What is international cooperation 3' },
      { fileName: 'ideastomove-eu-have-your-say-1.jpeg', caption: '', alt: 'Ideas to move: Have your say 1'  },
      { fileName: 'ideastomove-eu-have-your-say-2.jpeg', caption: '', alt: 'Ideas to move: Have your say 2'  },
      { fileName: 'ideastomove-eu-keyword-discriminazione.jpeg', caption: '', alt: 'Ideas to move: Discrimination keyword'  },
      { fileName: 'ideastomove-eu-keyword-felicita.jpeg', caption: '', alt: 'Ideas to move: Happiness keyword'  },
      { fileName: 'ideastomove-eu-keyword-francia-coloniale-1.jpeg', caption: '', alt: 'Ideas to move: Imperial France keyword 1'  },
      { fileName: 'ideastomove-eu-keyword-francia-coloniale-2.jpeg', caption: '', alt: 'Ideas to move: Imperial France keyword 2'  },
      { fileName: 'ideastomove-eu-profile.jpeg', caption: '', alt: 'Ideas to move: Profile'  },
      { fileName: 'ideastomove-eu-stories.jpeg', caption: '', alt: 'Ideas to move: Stories'  },
      { fileName: 'ideastomove-eu-story-denti-piu-bianchi-1.jpeg', caption: '', alt: 'Ideas to move: Whiter teeth story 1'  },
      { fileName: 'ideastomove-eu-story-denti-piu-bianchi-2.jpeg', caption: '', alt: 'Ideas to move: Whiter teeth story 2'  },
      { fileName: 'ideastomove-eu.jpeg', caption: '', alt: 'Ideas to move'  },
    ],
    skills: ['frontend dev', 'backend architecture'],
    mates: [
      { name: 'Francesco Bagni', role: 'UI/UX Lead' },
      { name: 'Malica Worms', role: 'Art direction' }
    ]
  }
]