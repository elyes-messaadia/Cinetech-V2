import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import commentService from '../../services/commentService';
import LoadingSpinner from '../common/LoadingSpinner';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';

const CommentSection = ({ mediaId, mediaType }) => {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Fonction pour charger les commentaires et leurs réponses
  const loadComments = useCallback(async () => {
    // Éviter les requêtes inutiles
    if (loading && hasLoaded) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer les commentaires depuis l'API
      const commentsData = await commentService.getMediaComments(mediaId, mediaType);
      
      setComments(commentsData || []);
      setTotalPages(Math.ceil((commentsData?.length || 0) / 10) || 1);
      setHasLoaded(true);
    } catch (err) {
      console.error('Erreur lors du chargement des commentaires:', err);
      setError('Une erreur est survenue lors du chargement des commentaires.');
    } finally {
      setLoading(false);
    }
  }, [mediaId, mediaType, loading, hasLoaded]);
  
  // Charger les commentaires lors du premier rendu uniquement
  useEffect(() => {
    if (!hasLoaded) {
      loadComments();
    }
  }, [loadComments, hasLoaded]);
  
  // Réinitialiser l'état de chargement lorsque le mediaId change
  useEffect(() => {
    setHasLoaded(false);
  }, [mediaId, mediaType]);
  
  // Soumettre un nouveau commentaire
  const handleSubmitComment = useCallback(async (e) => {
    e.preventDefault();
    
    if (!newComment.trim() || !isAuthenticated) return;
    
    try {
      const commentData = {
        media_id: parseInt(mediaId, 10),
        media_type: mediaType,
        content: newComment,
        parent_id: replyingTo || null,
        is_spoiler: false
      };
      
      // Envoyer le commentaire à l'API
      await commentService.createComment(commentData);
      
      // Recharger tous les commentaires pour s'assurer d'avoir les données à jour
      setHasLoaded(false);
      
      // Réinitialiser le formulaire
      setNewComment('');
      setReplyingTo(null);
      
    } catch (err) {
      console.error('Erreur lors de l\'ajout du commentaire:', err);
      setError('Une erreur est survenue lors de l\'ajout du commentaire.');
    }
  }, [newComment, isAuthenticated, mediaId, mediaType, replyingTo, setHasLoaded]);
  
  // Commencer à répondre à un commentaire
  const handleReply = useCallback((commentId) => {
    if (!isAuthenticated) {
      alert('Vous devez être connecté pour répondre aux commentaires');
      return;
    }
    
    setReplyingTo(commentId);
    // Attendre que le DOM soit mis à jour avant de faire le scroll
    setTimeout(() => {
      const element = document.getElementById('comment-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, [isAuthenticated]);
  
  // Gérer les "j'aime" sur un commentaire
  const handleLike = useCallback((commentId, isReply = false, parentId = null) => {
    if (!isAuthenticated) {
      alert('Vous devez être connecté pour aimer les commentaires');
      return;
    }
    
    // Mettre à jour l'UI localement en attendant la mise en œuvre de l'API
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
    
    // TODO: Implémenter l'API pour les likes
  }, [isAuthenticated]);
  
  // Changer de page
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    const commentsSection = document.getElementById('comments');
    if (commentsSection) {
      window.scrollTo({
        top: commentsSection.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  }, []);
  
  // Annuler la réponse
  const cancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);
  
  // Filtrer les commentaires en fonction de la page active
  const paginatedComments = useMemo(() => {
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    return comments.slice(startIndex, endIndex);
  }, [comments, page]);
  
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
              placeholder={replyingTo ? "Écrivez votre réponse..." : "Partagez votre avis..."}
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
            {paginatedComments.map(comment => (
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
                      <h4 className="text-white font-medium">{comment.username || comment.author}</h4>
                      <span className="text-gray-400 text-sm">
                        {comment.created_at 
                          ? new Date(comment.created_at).toLocaleDateString('fr-FR') 
                          : comment.date}
                      </span>
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
                        <span>{comment.likes || 0}</span>
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
                            <h5 className="text-white font-medium">{reply.username || reply.author}</h5>
                            <span className="text-gray-400 text-xs">
                              {reply.created_at 
                                ? new Date(reply.created_at).toLocaleDateString('fr-FR') 
                                : reply.date}
                            </span>
                          </div>
                          
                          <div className="mt-1 text-gray-300 text-sm">
                            {reply.content}
                          </div>
                          
                          <button 
                            onClick={() => handleLike(reply.id, true, comment.id)}
                            className="mt-2 flex items-center text-gray-400 hover:text-primary text-xs"
                          >
                            <HandThumbUpIcon className="w-3 h-3 mr-1" />
                            <span>{reply.likes || 0}</span>
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