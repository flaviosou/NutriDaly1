import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Goal, Restriction } from '../types';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [goal, setGoal] = useState<Goal>(Goal.MaintainWeight);
    const [restrictions, setRestrictions] = useState<Restriction[]>([]);
    const [error, setError] = useState('');
    const { register, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    const handleRestrictionChange = (restriction: Restriction) => {
        setRestrictions(prev => 
            prev.includes(restriction) 
            ? prev.filter(r => r !== restriction)
            : [...prev, restriction]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        const success = await register({
            name, 
            email, 
            password, 
            age: parseInt(age, 10),
            heightCm: parseInt(height, 10),
            weightKg: parseInt(weight, 10),
            preferences: { goal, restrictions }
        });
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Este email já está em uso.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-primary">
                    Crie sua conta
                </h2>
                 <p className="mt-2 text-center text-sm text-gray-600">
                    Complete seus dados para uma experiência personalizada.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input id="name" label="Nome Completo" type="text" value={name} onChange={e => setName(e.target.value)} required />
                        <Input id="email" label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        <Input id="password" label="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        <Input id="confirmPassword" label="Confirmar Senha" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                        
                        <div className="grid grid-cols-3 gap-4">
                             <Input id="age" label="Idade" type="number" value={age} onChange={e => setAge(e.target.value)} required />
                             <Input id="height" label="Altura (cm)" type="number" value={height} onChange={e => setHeight(e.target.value)} required />
                             <Input id="weight" label="Peso (kg)" type="number" value={weight} onChange={e => setWeight(e.target.value)} required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900">Qual seu objetivo?</label>
                            <select value={goal} onChange={e => setGoal(e.target.value as Goal)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6">
                                {Object.values(Goal).map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-900">Restrições Alimentares</label>
                            <div className="mt-2 space-y-2">
                                {Object.values(Restriction).map(r => (
                                    <div key={r} className="flex items-center">
                                        <input id={r} name={r} type="checkbox" checked={restrictions.includes(r)} onChange={() => handleRestrictionChange(r)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                        <label htmlFor={r} className="ml-3 block text-sm text-gray-900 capitalize">{r}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}
                        
                        <div>
                            <Button type="submit" isLoading={loading}>
                                Criar conta
                            </Button>
                        </div>
                    </form>
                    <div className="mt-6 text-center text-sm">
                        <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
                            Já tem uma conta? Faça login
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default RegisterPage;