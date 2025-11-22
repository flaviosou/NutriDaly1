import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { Recipe, User, UserRole, RecipeStatus, Comment, Chat, Message, DataContextType } from '../types';
import { mockUsers, mockRecipes, mockChats } from '../data/mockData';

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
    const [chats, setChats] = useState<Chat[]>(mockChats);

    const addRecipe = (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'status' | 'authorName' | 'authorAvatar' | 'comments'>, author: User) => {
        const newRecipe: Recipe = {
            ...recipeData,
            id: `rec-${Date.now()}`,
            createdAt: new Date().toISOString(),
            likes: 0,
            likedBy: [],
            authorName: author.name,
            authorAvatar: author.avatarUrl,
            status: author.role === UserRole.Admin ? RecipeStatus.Approved : RecipeStatus.Pending,
            comments: [],
        };
        setRecipes(prev => [newRecipe, ...prev]);
        mockRecipes.unshift(newRecipe);
    };

    const toggleLikeRecipe = (recipeId: string, userId: string) => {
        const recipeIndex = mockRecipes.findIndex(r => r.id === recipeId);
        if (recipeIndex === -1) return;

        const recipe = mockRecipes[recipeIndex];
        const isLiked = recipe.likedBy.includes(userId);
        if (isLiked) {
            recipe.likes--;
            recipe.likedBy = recipe.likedBy.filter(uid => uid !== userId);
        } else {
            recipe.likes++;
            recipe.likedBy.push(userId);
        }
        setRecipes([...mockRecipes]);
    };

    const addComment = (recipeId: string, author: User, text: string) => {
        const newComment: Comment = {
            id: `com-${Date.now()}`,
            authorId: author.uid,
            authorName: author.name,
            authorAvatar: author.avatarUrl,
            text,
            createdAt: new Date().toISOString(),
        };
        const recipeIndex = mockRecipes.findIndex(r => r.id === recipeId);
        if (recipeIndex !== -1) {
            mockRecipes[recipeIndex].comments.push(newComment);
            setRecipes([...mockRecipes]);
        }
    };
    
    const followUser = (targetUserId: string, currentUserId: string) => {
        const targetUser = mockUsers.find(u => u.uid === targetUserId);
        const currentUser = mockUsers.find(u => u.uid === currentUserId);
        if (targetUser && currentUser) {
            if (!targetUser.followers.includes(currentUserId)) {
                targetUser.followers.push(currentUserId);
            }
            if (!currentUser.following.includes(targetUserId)) {
                currentUser.following.push(targetUserId);
            }
        }
    };

    const unfollowUser = (targetUserId: string, currentUserId: string) => {
        const targetUser = mockUsers.find(u => u.uid === targetUserId);
        const currentUser = mockUsers.find(u => u.uid === currentUserId);
        if (targetUser && currentUser) {
            targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);
            currentUser.following = currentUser.following.filter(id => id !== targetUserId);
        }
    };

    const getChatForUsers = (userId1: string, userId2: string): Chat | undefined => {
        let chat = mockChats.find(c => 
            (c.participantIds[0] === userId1 && c.participantIds[1] === userId2) ||
            (c.participantIds[0] === userId2 && c.participantIds[1] === userId1)
        );

        if (!chat) {
            chat = {
                id: `chat-${Date.now()}`,
                participantIds: [userId1, userId2],
                messages: []
            };
            mockChats.push(chat);
            setChats([...mockChats]);
        }
        return chat;
    };
    
    const sendMessageToChat = (chatId: string, senderId: string, text: string) => {
        const chatIndex = mockChats.findIndex(c => c.id === chatId);
        if (chatIndex !== -1) {
            const newMessage: Message = {
                id: `msg-${Date.now()}`,
                senderId,
                text,
                createdAt: new Date().toISOString()
            };
            mockChats[chatIndex].messages.push(newMessage);
            setChats([...mockChats]);
        }
    };

    const updateRecipeStatus = (recipeId: string, status: RecipeStatus) => {
        const recipeIndex = mockRecipes.findIndex(r => r.id === recipeId);
        if (recipeIndex !== -1) {
            mockRecipes[recipeIndex].status = status;
            setRecipes([...mockRecipes]);
        }
    };

    const updateUserRole = (userId: string, role: UserRole) => {
        const userIndex = mockUsers.findIndex(u => u.uid === userId);
        if (userIndex !== -1) {
            mockUsers[userIndex].role = role;
        }
    };

    const getAllUsers = () => {
        return mockUsers.filter(u => u.role !== UserRole.Admin);
    }
    
    const getUserById = useCallback((userId: string): User | undefined => {
        return mockUsers.find(u => u.uid === userId);
    }, []);

    const getRecipesByAuthor = useCallback((authorId: string): Recipe[] => {
        return recipes.filter(r => r.authorId === authorId);
    }, [recipes]);
    
    const getSavedRecipes = useCallback((userId: string): Recipe[] => {
        return recipes.filter(r => r.likedBy.includes(userId));
    }, [recipes]);

    const getCommunityRecipes = useCallback((): Recipe[] => {
        return recipes.filter(r => r.status === RecipeStatus.Approved);
    }, [recipes]);
    
    const getLatestCommunityRecipe = useCallback((): Recipe | undefined => {
        const communityRecipes = getCommunityRecipes();
        return [...communityRecipes].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    }, [getCommunityRecipes]);

    return (
        <DataContext.Provider value={{ 
            recipes, addRecipe, toggleLikeRecipe, addComment, updateRecipeStatus, 
            updateUserRole, getAllUsers, getUserById, getRecipesByAuthor, 
            getSavedRecipes, getCommunityRecipes, getLatestCommunityRecipe,
            followUser, unfollowUser, getChatForUsers, sendMessageToChat,
        }}>
            {children}
        </DataContext.Provider>
    );
};