import React, { useState } from 'react';
import { Upload, Camera, Music, Palette, Sparkles } from 'lucide-react';

const CreatePage = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const createOptions = [
    {
      id: 'upload',
      icon: Upload,
      title: 'Télécharger une vidéo',
      description: 'Importez une vidéo depuis votre appareil',
      color: '#FF0050'
    },
    {
      id: 'camera',
      icon: Camera,
      title: 'Enregistrer',
      description: 'Filmez directement avec votre caméra',
      color: '#00F2EA'
    },
    {
      id: 'music',
      icon: Music,
      title: 'Ajouter de la musique',
      description: 'Choisissez un son pour votre vidéo',
      color: '#9C27B0'
    },
    {
      id: 'effects',
      icon: Sparkles,
      title: 'Effets spéciaux',
      description: 'Ajoutez des filtres et effets',
      color: '#FF6B35'
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>➕ Créer</h1>
        <p>Partagez votre créativité avec le monde</p>
      </div>

      <div className="create-content">
        <div className="create-options">
          {createOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.id}
                className={`create-option ${selectedOption === option.id ? 'selected' : ''}`}
                onClick={() => setSelectedOption(option.id)}
              >
                <div className="option-icon" style={{ backgroundColor: option.color }}>
                  <IconComponent size={32} color="white" />
                </div>
                <div className="option-info">
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {selectedOption && (
          <div className="create-workspace">
            <div className="workspace-placeholder">
              <Palette size={48} color="#ccc" />
              <h3>Zone de création</h3>
              <p>Fonctionnalité "{createOptions.find(o => o.id === selectedOption)?.title}" en développement</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePage;
