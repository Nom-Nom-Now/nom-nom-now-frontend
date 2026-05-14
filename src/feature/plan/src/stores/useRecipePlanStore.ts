import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Recipe } from '../shared/types';

export const useRecipePlanStore = defineStore('recipeList', () => {
    const recipes = ref<Recipe[]>([]);
    const isLoading = ref(false);

    function getStartOfWeek(date: Date): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        d.setHours(0, 0, 0, 0);
        return new Date(d.setDate(diff));
    }

    function isWeekBeforeAccountCreation(
        weekStart: Date | undefined,
        accountCreatedAt: Date | undefined,
    ): boolean {
        if (!weekStart || !accountCreatedAt) {
            return false;
        }

        return getStartOfWeek(weekStart).getTime() < getStartOfWeek(accountCreatedAt).getTime();
    }

    function getWeekSeed(weekStart?: Date): number {
        if (!weekStart) {
            return Date.now();
        }

        return Math.floor(weekStart.getTime() / (1000 * 60 * 60 * 24 * 7));
    }

    function shuffleRecipesForWeek(allRecipes: Recipe[], weekStart?: Date): Recipe[] {
        const shuffledRecipes = [...allRecipes];
        let seed = getWeekSeed(weekStart);

        for (let index = shuffledRecipes.length - 1; index > 0; index -= 1) {
            seed = (seed * 9301 + 49297) % 233280;
            const swapIndex = seed % (index + 1);

            const currentRecipe = shuffledRecipes[index]!;
            shuffledRecipes[index] = shuffledRecipes[swapIndex]!;
            shuffledRecipes[swapIndex] = currentRecipe;
        }

        return shuffledRecipes;
    }

    async function fetchRecipes(weekStart?: Date, accountCreatedAt?: Date) {
        if (isWeekBeforeAccountCreation(weekStart, accountCreatedAt)) {
            recipes.value = [];
            return;
        }

        isLoading.value = true;
        try {
            // Platzhalter
            const availableRecipes: Recipe[] = [
                {
                    id: '1',
                    title: 'Lasagne',
                    imageUrl:
                        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
                    duration: '30min',
                    cost: '€€',
                    description:
                        'Klassische italienische Lasagne mit Bolognese. Klassische italienische Lasagne mit Bolognese. Klassische italienische Lasagne mit Bolognese. Klassische italienische Lasagne mit Bolognese.',
                },
                {
                    id: '2',
                    title: 'Caesar Salad',
                    imageUrl:
                        'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
                    duration: '15min',
                    cost: '€',
                    description: 'Frischer Salat mit Croutons und Parmesan',
                },
                {
                    id: '3',
                    title: 'Spaghetti Carbonara',
                    imageUrl:
                        'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop',
                    duration: '25min',
                    cost: '€',
                    description:
                        'Cremige Pasta mit Speck, Ei und Pecorino nach römischer Art.',
                },
                {
                    id: '4',
                    title: 'Pad Thai',
                    imageUrl:
                        'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop',
                    duration: '35min',
                    cost: '€€',
                    description:
                        'Gebratene Reisnudeln mit Garnelen, Erdnüssen und Limette.',
                },
                {
                    id: '5',
                    title: 'Burger Classic',
                    imageUrl:
                        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
                    duration: '20min',
                    cost: '€€',
                    description:
                        'Saftiger Rindfleisch-Burger mit Cheddar, Salat und hausgemachter Sauce.',
                },
                {
                    id: '6',
                    title: 'Sushi Platte',
                    imageUrl:
                        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
                    duration: '60min',
                    cost: '€€€',
                    description:
                        'Verschiedene Nigiri und Maki Rollen mit frischem Fisch.',
                },
                {
                    id: '7',
                    title: 'Tomatensuppe',
                    imageUrl:
                        'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
                    duration: '40min',
                    cost: '€',
                    description:
                        'Samtige Tomatensuppe mit Basilikum und einem Klecks Crème fraîche.',
                },
            ];

            recipes.value = shuffleRecipesForWeek(availableRecipes, weekStart);
        } finally {
            isLoading.value = false;
        }
    }

    return { recipes, isLoading, fetchRecipes };
});
