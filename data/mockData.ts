import { User, UserRole, Goal, Restriction, Recipe, RecipeCategory, RecipeStatus, Comment, Chat } from '../types';

const initialComments: Comment[] = [
    { id: 'com1', authorId: 'member456', authorName: 'Beto Fitness', authorAvatar: `https://i.pravatar.cc/150?u=member456`, text: 'Parece delicioso! Vou testar hoje mesmo.', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'com2', authorId: 'member123', authorName: 'Carlos Cozinha', authorAvatar: `https://i.pravatar.cc/150?u=member123`, text: 'Ótima dica para um almoço rápido. Adorei!', createdAt: new Date().toISOString() },
];


// This becomes the single source of truth for user data in the mock app.
// 'let' is used to allow modification for simulation purposes.
export let mockUsers: User[] = [
    {
        uid: 'admin123', name: 'Admin User', email: 'admin@daily.com', role: UserRole.Admin,
        preferences: { goal: Goal.MaintainWeight, restrictions: [] }, createdAt: new Date().toISOString(),
        avatarUrl: `https://i.pravatar.cc/150?u=admin123`,
        age: 30, heightCm: 180, weightKg: 75, bio: 'Gerenciando a comunidade NutriDaily.',
        following: ['member123'], followers: ['member123', 'member456'],
    },
    {
        uid: 'member123', name: 'Ana Chef', email: 'member@daily.com', role: UserRole.Member,
        preferences: { goal: Goal.GainMass, restrictions: [Restriction.Lactose] }, createdAt: new Date().toISOString(),
        avatarUrl: `https://i.pravatar.cc/150?u=member123`,
        age: 28, heightCm: 165, weightKg: 60, bio: 'Amante de comida saudável e criativa. Compartilhando minhas melhores receitas com vocês!',
        following: ['admin123', 'member456'], followers: ['admin123'],
    },
     {
        uid: 'member456', name: 'Beto Fitness', email: 'member2@daily.com', role: UserRole.Member,
        preferences: { goal: Goal.GainMass, restrictions: [] }, createdAt: new Date().toISOString(),
        avatarUrl: `https://i.pravatar.cc/150?u=member456`,
        age: 32, heightCm: 185, weightKg: 85, bio: 'Foco em performance e nutrição esportiva.',
        following: [], followers: ['member123'],
    },
    {
        uid: 'member789', name: 'Carlos Cozinha', email: 'member3@daily.com', role: UserRole.Member,
        preferences: { goal: Goal.LoseWeight, restrictions: [Restriction.Gluten] }, createdAt: new Date().toISOString(),
        avatarUrl: `https://i.pravatar.cc/150?u=member789`,
        age: 45, heightCm: 175, weightKg: 90, bio: '',
        following: [], followers: ['admin123'],
    },
];

const mainUser = mockUsers.find(u => u.uid === 'member123');
const secondUser = mockUsers.find(u => u.uid === 'member456');


export let mockRecipes: Recipe[] = [
    { 
        id: 'rec1', authorId: 'member123', authorName: mainUser?.name ?? 'User', authorAvatar: mainUser?.avatarUrl,
        title: 'Salada Caesar com Frango Grelhado', 
        description: 'Uma salada clássica, perfeita para um almoço leve e nutritivo. O frango grelhado adiciona uma dose de proteína, enquanto o molho Caesar caseiro dá o toque final de sabor.',
        category: RecipeCategory.Lunch,
        ingredients: ['200g de peito de frango', '1 alface romana', 'Croutons a gosto', 'Queijo parmesão ralado', 'Molho Caesar'],
        instructions: 'Grelhe o frango. Lave e corte a alface. Monte a salada com todos os ingredientes e sirva.',
        tags: ['saudável', 'low carb'], imageUrl: 'https://picsum.photos/seed/salad/400/300',
        likes: 15, likedBy: ['member789', 'admin123'], status: RecipeStatus.Approved, createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        comments: initialComments,
    },
    { 
        id: 'rec2', authorId: 'member123', authorName: mainUser?.name ?? 'User', authorAvatar: mainUser?.avatarUrl,
        title: 'Omelete de Espinafre e Queijo', 
        description: 'Rápido, fácil e cheio de proteína para começar o dia com energia. Uma opção versátil para o café da manhã ou um jantar leve.',
        category: RecipeCategory.Breakfast,
        ingredients: ['3 ovos', '1 xícara de espinafre', '50g de queijo minas', 'Sal e pimenta a gosto'],
        instructions: 'Bata os ovos. Refogue o espinafre. Misture tudo e cozinhe em uma frigideira antiaderente.',
        tags: ['rápido', 'proteína'], imageUrl: 'https://picsum.photos/seed/omelette/400/300',
        likes: 22, likedBy: [], status: RecipeStatus.Pending, createdAt: new Date().toISOString(),
        comments: [],
    },
    { 
        id: 'rec3', authorId: 'member456', authorName: secondUser?.name ?? 'Another User', authorAvatar: secondUser?.avatarUrl,
        title: 'Sopa de Abóbora com Gengibre', 
        description: 'Aconchegante e cheia de sabor para aquecer os dias frios. O gengibre dá um toque picante e termogênico.',
        category: RecipeCategory.Dinner,
        ingredients: ['500g de abóbora', '1 colher de sopa de gengibre ralado', '1 cebola', 'Caldo de legumes'],
        instructions: 'Cozinhe a abóbora com os temperos. Bata no liquidificador até ficar cremosa e sirva quente.',
        tags: ['vegano', 'confort food'], imageUrl: 'https://picsum.photos/seed/soup/400/300',
        likes: 30, likedBy: ['member123'], status: RecipeStatus.Approved, createdAt: new Date(Date.now() - 86400000).toISOString(), // yesterday
        comments: [],
    }
];

export let mockChats: Chat[] = [
    {
        id: 'chat1',
        participantIds: ['member123', 'admin123'],
        messages: [
            { id: 'msg1', senderId: 'member123', text: 'Olá! Adorei a plataforma.', createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
            { id: 'msg2', senderId: 'admin123', text: 'Oi Ana! Que bom que gostou. Seja bem-vinda!', createdAt: new Date(Date.now() - 3600000).toISOString() },
        ]
    }
];
