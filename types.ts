export enum UserRole {
  Member = 'member',
  Admin = 'admin',
}

export enum Goal {
  LoseWeight = 'Emagrecer',
  GainMass = 'Ganho de massa',
  MaintainWeight = 'Manter peso',
}

export enum Restriction {
  Lactose = 'lactose',
  Gluten = 'glúten',
  Vegetarian = 'vegetariano',
  Vegan = 'vegano',
}

export interface UserPreferences {
  goal: Goal;
  restrictions: Restriction[];
  dailyCalories?: number;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  preferences: UserPreferences;
  createdAt: string; // ISO string
  avatarUrl?: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  bio?: string;
  following: string[]; // array of user uids
  followers: string[]; // array of user uids
}

export enum RecipeCategory {
    Breakfast = 'Café da manhã',
    Lunch = 'Almoço',
    Dinner = 'Jantar',
    Snack = 'Lanche',
    Dessert = 'Sobremesa'
}

export enum RecipeStatus {
    Approved = 'aprovado',
    Pending = 'pendente',
    Hidden = 'oculto'
}

export interface Comment {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    text: string;
    createdAt: string; // ISO string
}

export interface Recipe {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  description: string;
  category: RecipeCategory;
  ingredients: string[];
  instructions: string;
  tags: string[];
  imageUrl: string;
  likes: number;
  likedBy: string[]; // array of user uids
  status: RecipeStatus;
  createdAt: string; // ISO string
  comments: Comment[];
}

export interface Favorite {
  id: string;
  userId: string;
  recipeId: string;
  createdAt: string; // ISO string
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string; // ISO string
}

export interface Chat {
  id: string;
  participantIds: [string, string];
  messages: Message[];
}

export interface DataContextType {
    recipes: Recipe[];
    addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'status' | 'authorName' | 'authorAvatar' | 'comments'>, author: User) => void;
    toggleLikeRecipe: (recipeId: string, userId: string) => void;
    addComment: (recipeId: string, author: User, text: string) => void;
    updateRecipeStatus: (recipeId: string, status: RecipeStatus) => void;
    updateUserRole: (userId: string, role: UserRole) => void;
    getAllUsers: () => User[];
    getUserById: (userId: string) => User | undefined;
    getRecipesByAuthor: (authorId: string) => Recipe[];
    getSavedRecipes: (userId: string) => Recipe[];
    getCommunityRecipes: () => Recipe[];
    getLatestCommunityRecipe: () => Recipe | undefined;
    followUser: (targetUserId: string, currentUserId: string) => void;
    unfollowUser: (targetUserId: string, currentUserId: string) => void;
    getChatForUsers: (userId1: string, userId2: string) => Chat | undefined;
    sendMessageToChat: (chatId: string, senderId: string, text: string) => void;
}


// Para o AuthContext
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (data: Omit<User, 'uid' | 'role' | 'createdAt' | 'avatarUrl' | 'following' | 'followers' | 'bio'> & { password?: string }) => Promise<boolean>;
  updateUserProfile: (updatedData: Partial<Pick<User, 'name' | 'avatarUrl' | 'preferences' | 'age' | 'heightCm' | 'weightKg' | 'bio'>>) => void;
}