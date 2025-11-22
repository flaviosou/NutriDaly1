export const calculateBMI = (weightKg?: number, heightCm?: number) => {
    if (!weightKg || !heightCm || heightCm === 0 || weightKg === 0) {
        return { value: 0, category: 'Dados insuficientes', color: '#64748b', progress: 0 }; // slate-500
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const value = parseFloat(bmi.toFixed(1));

    if (value < 18.5) {
        return { 
            value, 
            category: 'Abaixo do peso', 
            color: '#3b82f6', // blue-500
            progress: (value / 18.5) * 25 
        };
    }
    if (value < 25) {
        return { 
            value, 
            category: 'Peso normal', 
            color: '#22c55e', // green-500
            progress: 25 + ((value - 18.5) / (24.9 - 18.5)) * 25 
        };
    }
    if (value < 30) {
        return { 
            value, 
            category: 'Sobrepeso', 
            color: '#f97316', // orange-500
            progress: 50 + ((value - 25) / (29.9 - 25)) * 25 
        };
    }
    return { 
        value, 
        category: 'Obesidade', 
        color: '#ef4444', // red-500
        progress: 75 + Math.min(((value - 30) / (40 - 30)) * 25, 25) 
    };
};
