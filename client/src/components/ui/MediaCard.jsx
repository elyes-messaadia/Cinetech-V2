import { useState } from 'react';
import { Link } from 'react-router-dom';

// Image placeholder encodée en base64 (version simplifiée grise)
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAKACAMAAAC5ltSmAAAAQlBMVEUAAABoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhE8etxAAAAFXRSTlMA0BDwgMCgIHDQYOCwUJBAkDBwoFDY908/AAABrklEQVR42u3c227CMAyF4aSHpj0A3d7/VWfYkIANqQE58vp9N3ORH8sxjdO2AQAAAAAAAAAAAABgbKvHz6FHXW8IGMQWMIgtYBBbwCC2gEFsAYPYTrX1Tl64Ei6XVLdeWsTLJdWtl5pwy9pcd5+1Nd2VgkFKwCAlYJASMEgJGKQEDFICBikBg5SAQUrAICVgkBIwSAkYpEwy2S0pKrq20bW1ru11batrra6tdG2payabyFi+4ixVfZxr3amWi64tdc1kExnpRCaq1rrFZc/3mEU7vqz+OrgH1zLZLC2iTpWc2iIpndJuTqE+iDqt9Yvctcn8Mqx1arJ3K+SXpOTcZU9GNtA/kZKdSJu8QFVL2e7cVE3pkLbDMsulpO+Zx5Z4/vLKOGpV3z+gj9a6Occ7Mdk4XrJ8/lf/rHP58wj1iJWcl6lj6qMB+zGQlEwS6Mn82n2XJP+wdfHq/FPz2lZnkCebX58tZZLdm0z1slrL291B5nZ/VkTrR2OO0fqBnmu03nHkHK13LL1H610f5NFaAQEBB6IFUdvWZIcW++63Yw4AAAAAAAAAAAAAwP/xA9zoL1fPcbegAAAAAElFTkSuQmCC';

const MediaCard = ({ media, type }) => {
  const [imageError, setImageError] = useState(false);

  // Vérifier si les données requises sont disponibles
  if (!media || !media.id) {
    return (
      <div className="bg-gray-800 rounded-lg w-64 h-96 animate-pulse"></div>
    );
  }

  // Déterminer automatiquement le type si non fourni
  const mediaType = type || (media.title ? 'movie' : 'tv');
  
  // Obtenir le titre selon le type
  const title = mediaType === 'movie' ? media.title : media.name;
  
  // Chemin de navigation vers la page de détails
  const detailPath = `/${mediaType}/${media.id}`;

  // Gestion des erreurs d'image
  const handleImageError = () => {
    console.log("Erreur de chargement d'image pour:", title);
    setImageError(true);
  };

  return (
    <div className="flex-none w-64 min-w-64 transition-transform duration-300 hover:scale-105">
      <Link to={detailPath} className="block h-full">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg h-full">
          {/* Affiche du film/série */}
          <div className="relative aspect-[2/3] bg-gray-700">
            {!imageError && media.poster_path ? (
              <img 
                src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={handleImageError}
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center bg-gray-800 text-center p-4 text-gray-400"
                style={{ 
                  backgroundImage: `url(${PLACEHOLDER_IMAGE})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}
              >
                <span className="bg-black bg-opacity-70 p-2 rounded">{title || "Image non disponible"}</span>
              </div>
            )}
            
            {/* Badge de note */}
            {media.vote_average > 0 && (
              <div className="absolute bottom-2 left-2 bg-primary text-white text-sm font-bold px-2 py-1 rounded-md">
                {Math.round(media.vote_average * 10) / 10}
              </div>
            )}
          </div>
          
          {/* Informations sur le média */}
          <div className="p-4">
            <h3 className="text-lg font-semibold line-clamp-2 mb-2">{title}</h3>
            
            <div className="text-sm text-gray-400">
              {media.release_date && (
                <span>
                  {new Date(media.release_date).getFullYear()}
                </span>
              )}
              {media.first_air_date && (
                <span>
                  {new Date(media.first_air_date).getFullYear()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MediaCard; 