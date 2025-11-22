import React, { useState } from 'react';
import ProfileSettings from '../components/settings/ProfileSettings';
import AccountSettings from '../components/settings/AccountSettings';
import AppearanceSettings from '../components/settings/AppearanceSettings';

type SettingsTab = 'profile' | 'account' | 'appearance';

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettings />;
            case 'account':
                return <AccountSettings />;
            case 'appearance':
                return <AppearanceSettings />;
            default:
                return null;
        }
    };
    
    const TabButton = ({ tabName, label }: { tabName: SettingsTab, label: string }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabName ? 'bg-primary text-white' : 'bg-transparent text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-slate-700'}`}
        >
            {label}
        </button>
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Configurações</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie seu perfil, conta e preferências.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Tabs Navigation */}
                <div className="md:w-1/4">
                    <div className="flex md:flex-col gap-2 p-2 bg-light-card dark:bg-dark-card rounded-lg shadow-sm border border-light-border dark:border-dark-border">
                        <TabButton tabName="profile" label="Perfil" />
                        <TabButton tabName="account" label="Conta" />
                        <TabButton tabName="appearance" label="Aparência" />
                    </div>
                </div>

                {/* Tab Content */}
                <div className="md:w-3/4">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;