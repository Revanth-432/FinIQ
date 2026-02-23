export const scenarios = [
    {
        id: '1',
        title: 'The Unexpected Bonus',
        description: 'You just received a ₹50,000 performance bonus at work. What do you do with it?',
        difficulty: 'Easy',
        icon: 'Gift',
        color: 'bg-purple-50 border-purple-100',
        question: 'Your bank account just hit ₹50,000 extra. Your friends are planning a trip to Bali, but you also have high-interest credit card debt.',
        options: [
            {
                id: 'A',
                text: 'Go to Bali with friends ✈️',
                feedback: '❌ Financial Hit! You had fun, but your credit card debt grew due to 36% interest. You are now poorer than before.',
                xp: 10,
                isOptimal: false
            },
            {
                id: 'B',
                text: 'Pay off Credit Card Debt 💳',
                feedback: '✅ Smart Move! You saved yourself ₹18,000 in future interest payments. Your net worth just went up!',
                xp: 100,
                isOptimal: true
            }
        ]
    },
    {
        id: '2',
        title: 'The "Hot" Crypto Tip',
        description: 'Your colleague swears this new coin will go 100x in a week.',
        difficulty: 'Medium',
        icon: 'TrendingUp',
        color: 'bg-orange-50 border-orange-100',
        question: 'Ravi from IT says "MoonCoin" is the next Bitcoin. He is putting his rent money in. He tells you to join him before it is too late.',
        options: [
            {
                id: 'A',
                text: 'Invest ₹10,000 (FOMO) 🚀',
                feedback: '❌ Ouch! It was a "Rug Pull". The coin value went to zero in 2 days. You lost your entire investment.',
                xp: 0,
                isOptimal: false
            },
            {
                id: 'B',
                text: 'Ignore and buy Index Fund 📉',
                feedback: '✅ Wealth Protection! "MoonCoin" crashed, but your Index Fund grew steadily. Boring is profitable.',
                xp: 100,
                isOptimal: true
            }
        ]
    },
    {
        id: '3',
        title: 'The New Car Upgrade',
        description: 'You got a promotion! Is it time to upgrade your ride?',
        difficulty: 'Hard',
        icon: 'Car',
        color: 'bg-blue-50 border-blue-100',
        question: 'Your salary jumped by 30%. You drive an old Swift. The bank is offering you a pre-approved loan for a new SUV at "only" ₹15k/month.',
        options: [
            {
                id: 'A',
                text: 'Buy the SUV 🚘',
                feedback: '⚠️ Lifestyle Inflation! The EMI is affordable, but insurance + fuel + depreciation will eat 50% of your new raise.',
                xp: 20,
                isOptimal: false
            },
            {
                id: 'B',
                text: 'Keep the Swift & Invest 💰',
                feedback: '✅ Freedom Move! By driving the old car, you invest the difference. In 5 years, that money can buy the SUV in CASH.',
                xp: 150,
                isOptimal: true
            }
        ]
    }
];
