export interface project {
  id: number,
  name: string,
  slug: string,
  description: string,
  year: string,
  images: projectImage[]
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
    year: '2012',
    images: [
      { fileName: 'blog-roll.jpeg', caption: '', alt: 'Blog roll' },
      { fileName: 'home.jpeg', caption: '', alt: 'Home page' },
      { fileName: 'single-post.jpeg', caption: '', alt: 'Single post'  },
      { fileName: 'store-locator.jpeg', caption: '', alt: 'Store locator'  }
    ]
  },
  {
    id: 2,
    name: 'Malossi Store',
    slug: '02-malossi-store',
    description: 'Copper mug art party fam, gastropub butcher master cleanse tattooed narwhal mukbang taxidermy kale chips. Adaptogen twee schlitz waistcoat taxidermy flannel. Mixtape small batch YOLO tbh, affogato gatekeep pour-over umami craft beer truffaut cloud bread. You probably haven\'t heard of them taiyaki bodega boys venmo aesthetic +1. Literally pok pok pickled vegan. Shaman neutral milk hotel meh marfa vexillologist poke fingerstache.',
    year: '2014',
    images: [
      { fileName: 'home.jpeg', caption: '', alt: 'Home page' },
      { fileName: 'carrello.jpeg', caption: 'Cart page with up sells and cross sells', alt: 'Cart' },
      { fileName: 'checkout.jpeg', caption: '', alt: 'Checkout' },
      { fileName: 'scheda-modello.jpeg', caption: '', alt: 'Model page'  },
      { fileName: 'scheda-prodotto.jpeg', caption: '', alt: 'Product page'  }
    ]
  },
  {
    id: 3,
    name: 'Malossi Commerce System',
    slug: '03-malossi-commerce-system',
    description: 'Tbh ascot edison bulb, semiotics shaman polaroid wayfarers. Migas listicle photo booth bicycle rights. Whatever activated charcoal schlitz yuccie green juice selvage microdosing prism raw denim. Wayfarers humblebrag fanny pack selfies succulents post-ironic la croix PBR&B tbh ramps messenger bag forage.',
    year: '2013',
    images: [
      { fileName: 'Family-Index.jpeg', caption: '', alt: 'Family index' },
      { fileName: 'FileIn.jpeg', caption: '', alt: 'File in' },
      { fileName: 'modello-list.jpeg', caption: '', alt: 'Model list'  },
      { fileName: 'Product-Index.jpeg', caption: '', alt: 'Product index'  },
      { fileName: 'Stat-Clienti.jpeg', caption: '', alt: 'Client stats'  }
    ]
  },
  {
    id: 4,
    name: 'Placeof',
    slug: '04-placeof',
    description: 'Tbh ascot edison bulb, semiotics shaman polaroid wayfarers. Migas listicle photo booth bicycle rights. Whatever activated charcoal schlitz yuccie green juice selvage microdosing prism raw denim. Wayfarers humblebrag fanny pack selfies succulents post-ironic la croix PBR&B tbh ramps messenger bag forage.',
    year: '2014',
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
    ]
  }
]