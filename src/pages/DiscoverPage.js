import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, Users, Gamepad2 } from 'lucide-react';

const DiscoverPage = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [loading, setLoading] = useState(true);

  // Données de jeux simulées
  const mockGames = [
    {
      id: 1,
      title: "The Legend of Zelda: Breath of the Wild",
      genre: "Adventure",
      rating: 4.9,
      players: "1 Player",
      releaseDate: "2017-03-03",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=400&fit=crop",
      description: "Explore a vast open world in this acclaimed adventure game."
    },
    {
      id: 2,
      title: "Cyberpunk 2077",
      genre: "RPG",
      rating: 4.2,
      players: "1 Player",
      releaseDate: "2020-12-10",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=400&fit=crop",
      description: "An open-world RPG set in a dystopian future."
    },
    {
      id: 3,
      title: "Among Us",
      genre: "Multiplayer",
      rating: 4.5,
      players: "4-10 Players",
      releaseDate: "2018-06-15",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=400&fit=crop",
      description: "Social deduction game with friends."
    },
    {
      id: 4,
      title: "Minecraft",
      genre: "Sandbox",
      rating: 4.8,
      players: "1-8 Players",
      releaseDate: "2011-11-18",
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=400&fit=crop",
      description: "Build and explore in this creative sandbox world."
    },
    {
      id: 5,
      title: "Call of Duty: Warzone",
      genre: "Shooter",
      rating: 4.3,
      players: "1-150 Players",
      releaseDate: "2020-03-10",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=400&fit=crop",
      description: "Battle royale shooter with intense combat."
    },
    {
      id: 6,
      title: "Animal Crossing: New Horizons",
      genre: "Simulation",
      rating: 4.7,
      players: "1-8 Players",
      releaseDate: "2020-03-20",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
      description: "Create your perfect island paradise."
    }
  ];

  const genres = ['all', 'Adventure', 'RPG', 'Multiplayer', 'Sandbox', 'Shooter', 'Simulation'];

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setGames(mockGames);
      setFilteredGames(mockGames);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = games;

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par genre
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(game => game.genre === selectedGenre);
    }

    // Trier
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default: // popularity
        filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredGames(filtered);
  }, [searchTerm, selectedGenre, sortBy, games]);

  const GameCard = ({ game }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
          {game.genre}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800">{game.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{game.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="ml-1 text-sm font-medium">{game.rating}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Users className="w-4 h-4 mr-1" />
            <span className="text-sm">{game.players}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{new Date(game.releaseDate).getFullYear()}</span>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 flex items-center">
            <Gamepad2 className="w-4 h-4 mr-1" />
            Play
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Discover Games</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Genre Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredGames.length === 0 ? (
          <div className="text-center py-12">
            <Gamepad2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No games found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;

