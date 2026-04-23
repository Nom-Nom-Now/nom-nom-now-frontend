import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Recipe } from '../shared/types';

export const useRecipeListStore = defineStore('recipeList', () => {
  const recipes = ref<Recipe[]>([]);
  const isLoading = ref(false);

  // TODO: mit richtiger Api austauschen
  async function fetchRecipes() {
    isLoading.value = true;
    try {
      // Platzhalter
      recipes.value = [
        {
          id: '1',
          title: 'Lasagne',
          imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
          duration: '30min',
          cost: '€€',
          description: 'Klassische italienische Lasagne mit Bolognese. Klassische italienische Lasagne mit Bolognese. Klassische italienische Lasagne mit Bolognese. Klassische italienische Lasagne mit Bolognese.',
        },
        {
          id: '2',
          title: 'Caesar Salad',
          imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
          duration: '15min',
          cost: '€',
          description: 'Frischer Salat mit Croutons und Parmesan',
        },
        {
          id: '3',
          title: 'Spaghetti Carbonara',
          imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop',
          duration: '25min',
          cost: '€',
          description: 'Cremige Pasta mit Speck, Ei und Pecorino nach römischer Art.',
        },
        {
          id: '4',
          title: 'Pad Thai',
          imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop',
          duration: '35min',
          cost: '€€',
          description: 'Gebratene Reisnudeln mit Garnelen, Erdnüssen und Limette.',
        },
        {
          id: '5',
          title: 'Burger Classic',
          imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
          duration: '20min',
          cost: '€€',
          description: 'Saftiger Rindfleisch-Burger mit Cheddar, Salat und hausgemachter Sauce.',
        },
        {
          id: '6',
          title: 'Sushi Platte',
          imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
          duration: '60min',
          cost: '€€€',
          description: 'Verschiedene Nigiri und Maki Rollen mit frischem Fisch.',
        },
        {
          id: '7',
          title: 'Tomatensuppe',
          imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
          duration: '40min',
          cost: '€',
          description: 'Samtige Tomatensuppe mit Basilikum und einem Klecks Crème fraîche.',
        },
        {
          id: '8',
          title: 'Tacos al Pastor',
          imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
          duration: '45min',
          cost: '€€',
          description: 'Mexikanische Tacos mit mariniertem Schweinefleisch und Ananas.',
        },
        {
          id: '9',
          title: 'Risotto ai Funghi',
          imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop',
          duration: '35min',
          cost: '€€',
          description: 'Cremiges Pilzrisotto mit Parmesan und frischem Thymian.',
        },
        {
          id: '10',
          title: 'Pancakes',
          imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
          duration: '15min',
          cost: '€',
          description: 'Fluffige Pancakes mit Ahornsirup und frischen Beeren.',
        },
        {
          id: '11',
          title: 'Griechischer Salat',
          imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
          duration: '10min',
          cost: '€',
          description: 'Frischer Salat mit Feta, Oliven, Gurke und Tomaten.',
        },
        {
          id: '12',
          title: 'Ramen',
          imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&h=300&fit=crop',
          duration: '50min',
          cost: '€€',
          description: 'Japanische Nudelsuppe mit reichhaltiger Brühe und weichem Ei.',
        },
        {
          id: '13',
          title: 'Fish & Chips',
          imageUrl: 'https://images.unsplash.com/photo-1551164634-0a19b52d3e68?w=400&h=300&fit=crop',
          duration: '30min',
          cost: '€€',
          description: 'Knusprig panierter Fisch mit goldenen Pommes und Erbsenpüree.',
        },
        {
          id: '14',
          title: 'Falafel Bowl',
          imageUrl: 'https://images.unsplash.com/photo-1547058881-aa0edd92aab3?w=400&h=300&fit=crop',
          duration: '25min',
          cost: '€',
          description: 'Knusprige Falafel mit Hummus, Tabouleh und Tahini-Dressing.',
        },
        {
          id: '15',
          title: 'Wiener Schnitzel',
          imageUrl: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=400&h=300&fit=crop',
          duration: '30min',
          cost: '€€',
          description: 'Klassisches paniertes Kalbsschnitzel mit Zitrone und Kartoffelsalat.',
        },
        {
          id: '16',
          title: 'Pho Bo',
          imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
          duration: '55min',
          cost: '€€',
          description: 'Vietnamesische Rindfleischsuppe mit Reisnudeln und frischen Kräutern.',
        },
        {
          id: '17',
          title: 'Margherita Pizza',
          imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
          duration: '40min',
          cost: '€',
          description: 'Klassische Pizza mit Tomatensoße, Mozzarella und frischem Basilikum.',
        },
        {
          id: '18',
          title: 'Bibimbap',
          imageUrl: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400&h=300&fit=crop',
          duration: '35min',
          cost: '€€',
          description: 'Koreanische Reisschüssel mit Gemüse, Ei und scharfer Gochujang-Sauce.',
        },
        {
          id: '19',
          title: 'Crêpes Suzette',
          imageUrl: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&h=300&fit=crop',
          duration: '20min',
          cost: '€',
          description: 'Dünne französische Pfannkuchen mit Orangenbutter und Grand Marnier.',
        },
        {
          id: '20',
          title: 'Pulled Pork Sandwich',
          imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop',
          duration: '180min',
          cost: '€€',
          description: 'Langsam gegartes Schweinefleisch mit BBQ-Sauce und Coleslaw.',
        },
      ];
    } finally {
      isLoading.value = false;
    }
  }

  return { recipes, isLoading, fetchRecipes };
});
