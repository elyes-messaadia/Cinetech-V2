import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import tmdbService from '../../services/tmdbService';
import LoadingSpinner from '../common/LoadingSpinner';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';

const CommentSection = ({ mediaId, mediaType }) => {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  // Charger les commentaires
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        
        // Récupérer les critiques de TMDb (en tant que commentaires)
        const data = await tmdbService.getComments(mediaType, mediaId, page);
        
        // Pour le développement, ajouter des commentaires fictifs si aucun n'est disponible
        let processedComments = data.results || [];
        
        if (processedComments.length === 0 && page === 1) {
          processedComments = generateDummyComments();
        }
        
        // Transformer les critiques en format de commentaires
        const formattedComments = processedComments.map(review => ({
          id: review.id,
          author: review.author || 'Anonyme',
          content: review.content,
          date: review.created_at ? new Date(review.created_at).toLocaleDateString('fr-FR') : 'Date inconnue',
          avatar: review.author_details?.avatar_path ? 
            `https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}` : null,
          likes: Math.floor(Math.random() * 15), // Simuler des likes pour le développement
          replies: generateDummyReplies(review.id) // Simuler des réponses pour le développement
        }));
        
        setComments(formattedComments);
        setTotalPages(data.total_pages || 1);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des commentaires:', err);
        setError('Une erreur est survenue lors du chargement des commentaires.');
        setLoading(false);
      }
    };
    
    fetchComments();
  }, [mediaId, mediaType, page]);
  
  // Générer des commentaires fictifs pour le développement
  const generateDummyComments = () => {
    return [
      {
        id: 'dummy-1',
        author: 'Cinéphile Passionné',
        content: 'Ce film est absolument incroyable ! Les performances des acteurs sont exceptionnelles et la réalisation est à couper le souffle. Je recommande vivement !',
        created_at: new Date().toISOString(),
        author_details: { avatar_path: null }
      },
      {
        id: 'dummy-2',
        author: 'Critique Amateur',
        content: 'J\'ai passé un bon moment, mais l\'histoire aurait pu être plus développée. Les effets spéciaux compensent le manque de profondeur des personnages secondaires.',
        created_at: new Date(Date.now() - 86400000).toISOString(), // Hier
        author_details: { avatar_path: null }
      }
    ];
  };
  
  // Générer des réponses fictives pour le développement
  const generateDummyReplies = (commentId) => {
    if (Math.random() > 0.5) return []; // 50% de chance d'avoir des réponses
    
    return [
      {
        id: `reply-${commentId}-1`,
        author: 'Fan Enthousiaste',
        content: 'Je suis complètement d\'accord avec toi ! J\'ai adoré ce moment où...',
        date: new Date(Date.now() - 43200000).toISOString(), // 12h avant
        likes: Math.floor(Math.random() * 5)
      }
    ];
  };
  
  // Soumettre un nouveau commentaire
  const handleSubmitComment = (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    // Simuler l'ajout d'un commentaire
    const newCommentObj = {
      id: `comment-${Date.now()}`,
      author: user?.username || 'Vous',
      content: newComment,
      date: new Date().toLocaleDateString('fr-FR'),
      avatar: null,
      likes: 0,
      replies: []
    };
    
    // Ajouter à la liste des commentaires
    if (replyingTo) {
      // Ajouter une réponse
      setComments(prevComments => prevComments.map(comment => 
        comment.id === replyingTo
          ? {
              ...comment,
              replies: [...(comment.replies || []), {
                id: `reply-${Date.now()}`,
                author: user?.username || 'Vous',
                content: newComment,
                date: new Date().toLocaleDateString('fr-FR'),
                likes: 0
              }]
            }
          : comment
      ));
      
      // Réinitialiser
      setReplyingTo(null);
    } else {
      // Ajouter un nouveau commentaire
      setComments(prevComments => [newCommentObj, ...prevComments]);
    }
    
    // Réinitialiser le formulaire
    setNewComment('');
  };
  
  // Commencer à répondre à un commentaire
  const handleReply = (commentId) => {
    if (!isAuthenticated) {
      alert('Vous devez être connecté pour répondre aux commentaires');
      return;
    }
    
    setReplyingTo(commentId);
    document.getElementById('comment-form').scrollIntoView({ behavior: 'smooth' });
  };
  
  // Simuler un "j'aime" sur un commentaire
  const handleLike = (commentId, isReply = false, parentId = null) => {
    if (!isAuthenticated) {
      alert('Vous devez être connecté pour aimer les commentaires');
      return;
    }
    
    if (isReply && parentId) {
      // Like sur une réponse
      setComments(prevComments => prevComments.map(comment => 
        comment.id === parentId
          ? {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === commentId
                  ? { ...reply, likes: reply.likes + 1 }
                  : reply
              )
            }
          : comment
      ));
    } else {
      // Like sur un commentaire principal
      setComments(prevComments => prevComments.map(comment => 
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      ));
    }
  };
  
  // Changer de page
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, document.getElementById('comments').offsetTop - 100);
  };
  
  // Annuler la réponse
  const cancelReply = () => {
    setReplyingTo(null);
  };
  
  return (
    <div className="bg-background-light rounded-lg p-6">
      {/* Formulaire de nouveau commentaire */}
      <div id="comment-form" className="mb-8">
        <h3 className="text-white text-lg font-medium mb-4">
          {replyingTo 
            ? 'Répondre à un commentaire' 
            : 'Laisser un commentaire'}
        </h3>
        
        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Partagez votre avis..."
              className="w-full p-3 bg-background border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary text-white"
              rows="4"
              required
            />
            
            <div className="flex justify-between items-center">
              {replyingTo && (
                <button
                  type="button"
                  onClick={cancelReply}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Annuler
                </button>
              )}
              
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded ml-auto"
              >
                {replyingTo ? 'Répondre' : 'Commenter'}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-background-dark/30 p-4 rounded text-center">
            <p className="text-gray-300 mb-2">
              Vous devez être connecté pour laisser un commentaire.
            </p>
            <a 
              href="/login" 
              className="text-primary hover:text-primary-light font-medium"
            >
              Se connecter
            </a>
          </div>
        )}
      </div>
      
      {/* Liste des commentaires */}
      <div className="space-y-6">
        <h3 className="text-white text-lg font-medium">
          {comments.length} commentaire{comments.length !== 1 ? 's' : ''}
        </h3>
        
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded">
            {error}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">
              Aucun commentaire pour le moment. Soyez le premier à donner votre avis !
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map(comment => (
              <div key={comment.id} className="border-b border-gray-700 pb-6 last:border-0">
                {/* Commentaire principal */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    {comment.avatar ? (
                      <img 
                        src={comment.avatar} 
                        alt={comment.author} 
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <UserCircleIcon className="w-10 h-10 text-gray-500" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-white font-medium">{comment.author}</h4>
                      <span className="text-gray-400 text-sm">{comment.date}</span>
                    </div>
                    
                    <div className="mt-2 text-gray-300 whitespace-pre-line">
                      {comment.content}
                    </div>
                    
                    <div className="mt-3 flex gap-4">
                      <button 
                        onClick={() => handleLike(comment.id)}
                        className="flex items-center text-gray-400 hover:text-primary text-sm"
                      >
                        <HandThumbUpIcon className="w-4 h-4 mr-1" />
                        <span>{comment.likes}</span>
                      </button>
                      
                      <button 
                        onClick={() => handleReply(comment.id)}
                        className="flex items-center text-gray-400 hover:text-primary text-sm"
                      >
                        <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
                        <span>Répondre</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Réponses */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-12 space-y-4">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="flex gap-3 pt-3 border-t border-gray-700/50">
                        <div className="flex-shrink-0">
                          <UserCircleIcon className="w-8 h-8 text-gray-500" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h5 className="text-white font-medium">{reply.author}</h5>
                            <span className="text-gray-400 text-xs">{reply.date}</span>
                          </div>
                          
                          <div className="mt-1 text-gray-300 text-sm">
                            {reply.content}
                          </div>
                          
                          <button 
                            onClick={() => handleLike(reply.id, true, comment.id)}
                            className="mt-2 flex items-center text-gray-400 hover:text-primary text-xs"
                          >
                            <HandThumbUpIcon className="w-3 h-3 mr-1" />
                            <span>{reply.likes}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  page === num 
                    ? 'bg-primary text-white' 
                    : 'bg-background-dark text-gray-300 hover:bg-primary/30'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection; 