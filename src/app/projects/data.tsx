export interface project {
  id: number,
  name: string,
  slug: string,
  description: string,
  year: string,
  cover: string,
  images: projectImage[],
  skills: string[]
}

export interface projectImage {
  fileName: string,
  caption: string,
  alt: string
}

export const projects:project[] = [
  {
    id: 1,
    name: 'Malossicom',
    slug: '01-malossi-com',
    description: 'I\'m baby pinterest coloring book salvia forage jianbing franzen vexillologist williamsburg. Hella ramps Brooklyn, lyft drinking vinegar plaid heirloom seitan grailed bitters blog. Pok pok mixtape cred cronut, poutine poke tote bag pour-over af thundercats lomo post-ironic. Hot chicken fanny pack organic, deep v man bun mixtape williamsburg squid marfa selfies. Beard JOMO pop-up activated charcoal synth.',
    year: '2014',
    cover: 'cover.jpeg',
    images: [
      { fileName: 'blog-roll.jpeg', caption: '', alt: 'Blog roll' },
      { fileName: 'home.jpeg', caption: '', alt: 'Home page' },
      { fileName: 'single-post.jpeg', caption: '', alt: 'Single post'  },
      { fileName: 'store-locator.jpeg', caption: '', alt: 'Store locator'  }
    ],
    skills: ['art direction', 'UI/UX', 'frontend dev', 'backend dev']
  },
  {
    id: 2,
    name: 'Malossi Store',
    slug: '02-malossi-store',
    description: 'Copper mug art party fam, gastropub butcher master cleanse tattooed narwhal mukbang taxidermy kale chips. Adaptogen twee schlitz waistcoat taxidermy flannel. Mixtape small batch YOLO tbh, affogato gatekeep pour-over umami craft beer truffaut cloud bread. You probably haven\'t heard of them taiyaki bodega boys venmo aesthetic +1. Literally pok pok pickled vegan. Shaman neutral milk hotel meh marfa vexillologist poke fingerstache.',
    year: '2015',
    cover: 'cover.jpeg',
    images: [
      { fileName: 'home.jpeg', caption: '', alt: 'Home page' },
      { fileName: 'carrello.jpeg', caption: 'Cart page with up sells and cross sells', alt: 'Cart' },
      { fileName: 'checkout.jpeg', caption: '', alt: 'Checkout' },
      { fileName: 'scheda-modello.jpeg', caption: '', alt: 'Model page'  },
      { fileName: 'scheda-prodotto.jpeg', caption: '', alt: 'Product page'  }
    ],
    skills: ['art direction', 'UI/UX', 'frontend dev']
  },
  {
    id: 3,
    name: 'Malossi Commerce System',
    slug: '03-malossi-commerce-system',
    description: 'Tbh ascot edison bulb, semiotics shaman polaroid wayfarers. Migas listicle photo booth bicycle rights. Whatever activated charcoal schlitz yuccie green juice selvage microdosing prism raw denim. Wayfarers humblebrag fanny pack selfies succulents post-ironic la croix PBR&B tbh ramps messenger bag forage.',
    year: '2016',
    cover: 'cover.jpeg',
    images: [
      { fileName: 'Family-Index.jpeg', caption: '', alt: 'Family index' },
      { fileName: 'FileIn.jpeg', caption: '', alt: 'File in' },
      { fileName: 'modello-list.jpeg', caption: '', alt: 'Model list'  },
      { fileName: 'Product-Index.jpeg', caption: '', alt: 'Product index'  },
      { fileName: 'Stat-Clienti.jpeg', caption: '', alt: 'Client stats'  }
    ],
    skills: ['art direction', 'UI/UX', 'frontend dev']
  },
  {
    id: 4,
    name: 'Placeof',
    slug: '04-placeof',
    description: 'Tbh ascot edison bulb, semiotics shaman polaroid wayfarers. Migas listicle photo booth bicycle rights. Whatever activated charcoal schlitz yuccie green juice selvage microdosing prism raw denim. Wayfarers humblebrag fanny pack selfies succulents post-ironic la croix PBR&B tbh ramps messenger bag forage.',
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
      { fileName: 'user-profile.jpeg', caption: '', alt: 'Book places intro 2User profile'  },
    ],
    skills: ['art direction', 'UI/UX', 'frontend dev']
  },
  {
    id: 5,
    name: 'Michielan Museum',
    slug: '05-michielan-museum',
    description: 'Tbh ascot edison bulb, semiotics shaman polaroid wayfarers. Migas listicle photo booth bicycle rights. Whatever activated charcoal schlitz yuccie green juice selvage microdosing prism raw denim. Wayfarers humblebrag fanny pack selfies succulents post-ironic la croix PBR&B tbh ramps messenger bag forage.',
    year: '2017',
    cover: 'cover.jpeg',
    images: [
      { fileName: 'rotary-table-app.jpeg', caption: '', alt: 'Rotary table app' },
      { fileName: 'virtual-ice-cream-machine.jpeg', caption: '', alt: 'Virtual ice cream machine' },
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
    skills: ['interaction desing', 'exhibit design', 'game design', 'coding']
  },
  {
    id: 6,
    name: 'Waterfall',
    slug: '06-waterfall',
    description: 'Tbh ascot edison bulb, semiotics shaman polaroid wayfarers. Migas listicle photo booth bicycle rights. Whatever activated charcoal schlitz yuccie green juice selvage microdosing prism raw denim. Wayfarers humblebrag fanny pack selfies succulents post-ironic la croix PBR&B tbh ramps messenger bag forage.',
    year: '2017',
    cover: 'cover.jpeg',
    images: [
      { fileName: 'waterfall-1.jpeg', caption: '', alt: 'Waterfall 1' },
      { fileName: 'waterfall-2.jpeg', caption: '', alt: 'Waterfall 2' },
      { fileName: 'waterfall-3.jpeg', caption: '', alt: 'Waterfall 3'  }
    ],
    skills: ['interaction design', 'creative coding']
  },
  {
    id: 7,
    name: 'La via della libertà',
    slug: '07-la-via-della-liberta',
    description: 'Tbh ascot edison bulb, semiotics shaman polaroid wayfarers. Migas listicle photo booth bicycle rights. Whatever activated charcoal schlitz yuccie green juice selvage microdosing prism raw denim. Wayfarers humblebrag fanny pack selfies succulents post-ironic la croix PBR&B tbh ramps messenger bag forage.',
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
    skills: ['frontend dev']
  },
  {
    id: 8,
    name: 'Ideas to move',
    slug: '08-ideas-to-move',
    description: 'Tbh ascot edison bulb, semiotics shaman polaroid wayfarers. Migas listicle photo booth bicycle rights. Whatever activated charcoal schlitz yuccie green juice selvage microdosing prism raw denim. Wayfarers humblebrag fanny pack selfies succulents post-ironic la croix PBR&B tbh ramps messenger bag forage.',
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
    skills: ['frontend dev', 'backend architecture']
  }
]