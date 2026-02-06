import React, { useState, useEffect } from 'react';

const VictoriaLite = () => {
  const [gameState, setGameState] = useState({
    money: 8000,
    population: 10000,
    stability: 75,
    militaryPower: 50,
    technology: 30,
    influence: 40,
    happiness: 65,
    year: 1837,
    month: 9,
    selectedAction: null
  });

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [tradeOffers, setTradeOffers] = useState([]);
  const [warLog, setWarLog] = useState([]);

  const countries = [
    { id: 1, name: 'Kerajaan Baru', population: 15000, stability: 80, militaryPower: 60, money: 12000 },
    { id: 2, name: 'Republik Timur', population: 12000, stability: 65, militaryPower: 70, money: 9000 },
    { id: 3, name: 'Kesultanan Selatan', population: 8000, stability: 70, militaryPower: 45, money: 6000 },
    { id: 4, name: 'Persemakmuran Barat', population: 18000, stability: 85, militaryPower: 55, money: 15000 }
  ];

  // Generate random trade offers
  useEffect(() => {
    const offers = [
      { id: 1, from: 'Kerajaan Baru', resource: 'Minyak', price: 150, quantity: 100 },
      { id: 2, from: 'Republik Timur', resource: 'Emas', price: 200, quantity: 50 },
      { id: 3, from: 'Kesultanan Selatan', resource: 'Rempah', price: 120, quantity: 80 },
      { id: 4, from: 'Persemakmuran Barat', resource: 'Besi', price: 80, quantity: 200 }
    ];
    setTradeOffers(offers);
  }, []);

  const handleInvestment = (type) => {
    let cost = 0;
    let benefit = 0;

    switch(type) {
      case 'infrastructure':
        cost = 1000;
        benefit = 5;
        if (gameState.money >= cost) {
          setGameState(prev => ({
            ...prev,
            money: prev.money - cost,
            stability: prev.stability + benefit,
            happiness: prev.happiness + 3
          }));
        }
        break;
      case 'education':
        cost = 800;
        benefit = 3;
        if (gameState.money >= cost) {
          setGameState(prev => ({
            ...prev,
            money: prev.money - cost,
            technology: prev.technology + benefit,
            happiness: prev.happiness + 2
          }));
        }
        break;
      case 'military':
        cost = 1200;
        benefit = 10;
        if (gameState.money >= cost) {
          setGameState(prev => ({
            ...prev,
            money: prev.money - cost,
            militaryPower: prev.militaryPower + benefit
          }));
        }
        break;
    }
  };

  const handleTrade = (offerId) => {
    const offer = tradeOffers.find(o => o.id === offerId);
    if (offer && gameState.money >= (offer.price * offer.quantity)) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - (offer.price * offer.quantity),
        stability: prev.stability + 2
      }));
      setTradeOffers(prev => prev.filter(o => o.id !== offerId));
    }
  };

  const handleWar = (countryId) => {
    const enemy = countries.find(c => c.id === countryId);
    if (!enemy) return;

    // Simple battle calculation
    const ourPower = gameState.militaryPower + Math.random() * 20;
    const enemyPower = enemy.militaryPower + Math.random() * 20;

    if (ourPower > enemyPower) {
      const gain = Math.floor(enemy.money * 0.3);
      setWarLog(prev => [...prev, `${gameState.year}: Kemenangan atas ${enemy.name}! Mendapatkan ${gain} uang.`]);
      setGameState(prev => ({
        ...prev,
        money: prev.money + gain,
        militaryPower: prev.militaryPower - 5,
        stability: prev.stability - 3
      }));
    } else {
      setWarLog(prev => [...prev, `${gameState.year}: Kekalahan melawan ${enemy.name}. Kehilangan 500 uang.`]);
      setGameState(prev => ({
        ...prev,
        money: prev.money - 500,
        militaryPower: prev.militaryPower - 10,
        stability: prev.stability - 5
      }));
    }
  };

  const handleDebt = (amount) => {
    setGameState(prev => ({
      ...prev,
      money: prev.money + amount,
      stability: prev.stability - 2
    }));
  };

  const advanceTime = () => {
    setGameState(prev => {
      const newMonth = prev.month + 1;
      const newYear = newMonth > 12 ? prev.year + 1 : prev.year;
      const finalMonth = newMonth > 12 ? 1 : newMonth;
      
      return {
        ...prev,
        year: newYear,
        month: finalMonth,
        money: prev.money + 100, // Income per turn
        stability: Math.max(0, Math.min(100, prev.stability + (Math.random() * 2 - 1))),
        population: prev.population + Math.floor(Math.random() * 100)
      };
    });
  };

  const getMonthName = (month) => {
    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return months[month];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-yellow-600/30 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-yellow-400">Victoria Lite</h1>
          <div className="text-right">
            <div className="text-xl font-semibold">{getMonthName(gameState.month)} {gameState.year}</div>
            <button 
              onClick={advanceTime}
              className="mt-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Lanjutkan Waktu
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-yellow-600/30">
            <h2 className="text-xl font-bold mb-4 text-yellow-400">Statistik Negara</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Uang:</span>
                <span className="text-green-400">${gameState.money.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Penduduk:</span>
                <span>{gameState.population.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Stabilitas:</span>
                <span className={`${gameState.stability > 70 ? 'text-green-400' : gameState.stability > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {gameState.stability}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Kekuatan Militer:</span>
                <span>{gameState.militaryPower}</span>
              </div>
              <div className="flex justify-between">
                <span>Teknologi:</span>
                <span>{gameState.technology}</span>
              </div>
              <div className="flex justify-between">
                <span>Pengaruh:</span>
                <span>{gameState.influence}</span>
              </div>
              <div className="flex justify-between">
                <span>Kebahagiaan:</span>
                <span className={`${gameState.happiness > 70 ? 'text-green-400' : gameState.happiness > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {gameState.happiness}%
                </span>
              </div>
            </div>
          </div>

          {/* Investment Options */}
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-blue-600/30">
            <h2 className="text-xl font-bold mb-4 text-blue-400">Investasi</h2>
            <div className="space-y-3">
              <button 
                onClick={() => handleInvestment('infrastructure')}
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-left"
              >
                <div className="font-semibold">Infrastruktur ($1000)</div>
                <div className="text-sm opacity-80">+5 Stabilitas</div>
              </button>
              <button 
                onClick={() => handleInvestment('education')}
                className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-left"
              >
                <div className="font-semibold">Pendidikan ($800)</div>
                <div className="text-sm opacity-80">+3 Teknologi</div>
              </button>
              <button 
                onClick={() => handleInvestment('military')}
                className="w-full p-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-left"
              >
                <div className="font-semibold">Militer ($1200)</div>
                <div className="text-sm opacity-80">+10 Kekuatan Militer</div>
              </button>
            </div>
          </div>

          {/* Debt System */}
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-orange-600/30">
            <h2 className="text-xl font-bold mb-4 text-orange-400">Utang</h2>
            <div className="space-y-2">
              <button 
                onClick={() => handleDebt(2000)}
                className="w-full p-2 bg-orange-600 hover:bg-orange-700 rounded text-sm"
              >
                Pinjam $2000 (-2% Stabilitas)
              </button>
              <button 
                onClick={() => handleDebt(5000)}
                className="w-full p-2 bg-orange-700 hover:bg-orange-800 rounded text-sm"
              >
                Pinjam $5000 (-5% Stabilitas)
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trade Offers */}
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-green-600/30">
            <h2 className="text-xl font-bold mb-4 text-green-400">Penawaran Perdagangan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tradeOffers.map(offer => (
                <div key={offer.id} className="bg-gray-800/50 p-4 rounded-lg border border-green-500/30">
                  <div className="font-semibold">{offer.resource}</div>
                  <div className="text-sm text-gray-300">Dari: {offer.from}</div>
                  <div className="text-sm">Harga: ${offer.price} per unit</div>
                  <div className="text-sm">Jumlah: {offer.quantity}</div>
                  <div className="text-sm font-bold">Total: ${(offer.price * offer.quantity).toLocaleString()}</div>
                  <button 
                    onClick={() => handleTrade(offer.id)}
                    className="mt-2 w-full p-2 bg-green-600 hover:bg-green-700 rounded text-sm"
                  >
                    Beli
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Countries & War */}
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-red-600/30">
            <h2 className="text-xl font-bold mb-4 text-red-400">Negara Lain</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {countries.map(country => (
                <div key={country.id} className="bg-gray-800/50 p-4 rounded-lg border border-red-500/30">
                  <div className="font-semibold">{country.name}</div>
                  <div className="text-sm">Penduduk: {country.population.toLocaleString()}</div>
                  <div className="text-sm">Stabilitas: {country.stability}%</div>
                  <div className="text-sm">Kekuatan Militer: {country.militaryPower}</div>
                  <div className="text-sm">Uang: ${country.money.toLocaleString()}</div>
                  <button 
                    onClick={() => handleWar(country.id)}
                    className="mt-2 w-full p-2 bg-red-600 hover:bg-red-700 rounded text-sm"
                  >
                    Perang!
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* War Log */}
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
            <h2 className="text-xl font-bold mb-4 text-gray-400">Catatan Perang</h2>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {warLog.slice(-10).map((log, index) => (
                <div key={index} className="text-sm bg-gray-800/30 p-2 rounded">{log}</div>
              ))}
              {warLog.length === 0 && <div className="text-gray-500 text-sm">Belum ada catatan perang...</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictoriaLite;
