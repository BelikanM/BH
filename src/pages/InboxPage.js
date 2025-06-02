import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { databases, DATABASE_ID, COLLECTIONS, Query } from '../services/appwrite';
import { 
    MessageCircle, 
    Search, 
    Plus, 
    Phone, 
    Video, 
    MoreHorizontal,
    Send,
    Smile,
    Paperclip,
    Image,
    Mic,
    Heart,
    Reply,
    Forward,
    Trash2,
    Archive,
    Star,
    Circle,
    CheckCircle,
    Clock,
    Users,
    Settings
} from 'lucide-react';

const InboxPage = () => {
    const { user, userProfile } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // all, unread, groups, archived
    const [isTyping, setIsTyping] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [messageFilter, setMessageFilter] = useState('all'); // all, media, links
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const emojis = ['😀', '😂', '❤️', '👍', '👎', '😍', '😢', '😮', '😡', '🎉', '🔥', '💯'];

    useEffect(() => {
        if (user) {
            loadConversations();
            simulateOnlineUsers();
        }
    }, [user]);

    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation.id);
            markAsRead(selectedConversation.id);
        }
    }, [selectedConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadConversations = async () => {
        try {
            // Simuler des conversations
            const mockConversations = [
                {
                    id: '1',
                    type: 'direct',
                    participant: {
                        id: 'user1',
                        name: 'Alice Martin',
                        username: 'alice_m',
                        avatar: null,
                        isOnline: true,
                        lastSeen: new Date().toISOString()
                    },
                    lastMessage: {
                        text: 'Salut ! Comment ça va ?',
                        timestamp: new Date(Date.now() - 300000).toISOString(),
                        senderId: 'user1',
                        type: 'text'
                    },
                    unreadCount: 2,
                    isPinned: true,
                    isArchived: false
                },
                {
                    id: '2',
                    type: 'direct',
                    participant: {
                        id: 'user2',
                        name: 'Bob Dupont',
                        username: 'bob_d',
                        avatar: null,
                        isOnline: false,
                        lastSeen: new Date(Date.now() - 3600000).toISOString()
                    },
                    lastMessage: {
                        text: 'Super vidéo ! 👍',
                        timestamp: new Date(Date.now() - 1800000).toISOString(),
                        senderId: user.$id,
                        type: 'text'
                    },
                    unreadCount: 0,
                    isPinned: false,
                    isArchived: false
                },
                {
                    id: '3',
                    type: 'group',
                    name: 'Équipe Créateurs',
                    participants: [
                        { id: 'user3', name: 'Charlie', avatar: null },
                        { id: 'user4', name: 'Diana', avatar: null },
                        { id: 'user5', name: 'Eve', avatar: null }
                    ],
                    lastMessage: {
                        text: 'Réunion demain à 14h',
                        timestamp: new Date(Date.now() - 7200000).toISOString(),
                        senderId: 'user3',
                        senderName: 'Charlie',
                        type: 'text'
                    },
                    unreadCount: 5,
                    isPinned: false,
                    isArchived: false
                }
            ];

            setConversations(mockConversations);
        } catch (error) {
            console.error('Erreur chargement conversations:', error);
        }
    };

    const loadMessages = async (conversationId) => {
        try {
            // Simuler des messages
            const mockMessages = [
                {
                    id: '1',
                    text: 'Salut ! Comment ça va ?',
                    senderId: 'user1',
                    senderName: 'Alice Martin',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    type: 'text',
                    status: 'read',
                    reactions: [{ emoji: '👍', users: ['user2'] }]
                },
                {
                    id: '2',
                    text: 'Ça va bien merci ! Et toi ?',
                    senderId: user.$id,
                    senderName: userProfile?.displayName || 'Vous',
                    timestamp: new Date(Date.now() - 3300000).toISOString(),
                    type: 'text',
                    status: 'read'
                },
                {
                    id: '3',
                    text: 'J\'ai vu ta dernière vidéo, elle est géniale ! 🔥',
                    senderId: 'user1',
                    senderName: 'Alice Martin',
                    timestamp: new Date(Date.now() - 1800000).toISOString(),
                    type: 'text',
                    status: 'read',
                    reactions: [{ emoji: '❤️', users: [user.$id] }]
                },
                {
                    id: '4',
                    text: 'Merci beaucoup ! Ça me fait plaisir 😊',
                    senderId: user.$id,
                    senderName: userProfile?.displayName || 'Vous',
                    timestamp: new Date(Date.now() - 900000).toISOString(),
                    type: 'text',
                    status: 'delivered'
                },
                {
                    id: '5',
                    text: 'Tu prépares quelque chose de nouveau ?',
                    senderId: 'user1',
                    senderName: 'Alice Martin',
                    timestamp: new Date(Date.now() - 300000).toISOString(),
                    type: 'text',
                    status: 'sent'
                }
            ];

            setMessages(mockMessages);
        } catch (error) {
            console.error('Erreur chargement messages:', error);
        }
    };

    const simulateOnlineUsers = () => {
        // Simuler des utilisateurs en ligne
        setOnlineUsers(new Set(['user1', 'user3', 'user5']));
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const message = {
            id: Date.now().toString(),
            text: newMessage,
            senderId: user.$id,
            senderName: userProfile?.displayName || 'Vous',
            timestamp: new Date().toISOString(),
            type: 'text',
            status: 'sending'
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');

        // Simuler l'envoi
        setTimeout(() => {
            setMessages(prev => prev.map(msg => 
                msg.id === message.id ? { ...msg, status: 'sent' } : msg
            ));
        }, 1000);

        // Simuler la livraison
        setTimeout(() => {
            setMessages(prev => prev.map(msg => 
                msg.id === message.id ? { ...msg, status: 'delivered' } : msg
            ));
        }, 2000);
    };

    const markAsRead = async (conversationId) => {
        setConversations(prev => prev.map(conv => 
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        ));
    };

    const handleTyping = () => {
        setIsTyping(true);
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
        }, 2000);
    };

    const addReaction = (messageId, emoji) => {
        setMessages(prev => prev.map(msg => {
            if (msg.id === messageId) {
                const reactions = msg.reactions || [];
                const existingReaction = reactions.find(r => r.emoji === emoji);
                
                if (existingReaction) {
                    if (existingReaction.users.includes(user.$id)) {
                        // Retirer la réaction
                        existingReaction.users = existingReaction.users.filter(id => id !== user.$id);
                        if (existingReaction.users.length === 0) {
                            return { ...msg, reactions: reactions.filter(r => r.emoji !== emoji) };
                        }
                    } else {
                        // Ajouter la réaction
                        existingReaction.users.push(user.$id);
                    }
                } else {
                    // Nouvelle réaction
                    reactions.push({ emoji, users: [user.$id] });
                }
                
                return { ...msg, reactions };
            }
            return msg;
        }));
    };

    const toggleMessageSelection = (messageId) => {
        setSelectedMessages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(messageId)) {
                newSet.delete(messageId);
            } else {
                newSet.add(messageId);
            }
            return newSet;
        });
    };

    const deleteSelectedMessages = () => {
        setMessages(prev => prev.filter(msg => !selectedMessages.has(msg.id)));
        setSelectedMessages(new Set());
        setIsSelectionMode(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getFilteredConversations = () => {
        let filtered = conversations;

        // Filtrer par onglet
        switch (activeTab) {
            case 'unread':
                filtered = filtered.filter(conv => conv.unreadCount > 0);
                break;
            case 'groups':
                filtered = filtered.filter(conv => conv.type === 'group');
                break;
            case 'archived':
                filtered = filtered.filter(conv => conv.isArchived);
                break;
        }

        // Filtrer par recherche
        if (searchQuery) {
            filtered = filtered.filter(conv => {
                if (conv.type === 'direct') {
                    return conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           conv.participant.username.toLowerCase().includes(searchQuery.toLowerCase());
                } else {
                    return conv.name.toLowerCase().includes(searchQuery.toLowerCase());
                }
            });
        }

        // Trier par épinglés puis par dernière activité
        return filtered.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
        });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'À l\'instant';
        } else if (diffInHours < 24) {
            return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 48) {
            return 'Hier';
        } else {
            return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        }
    };

    const getMessageStatus = (status) => {
        switch (status) {
            case 'sending':
                return <Clock size={12} className="text-gray-400" />;
            case 'sent':
                return <Circle size={12} className="text-gray-400" />;
            case 'delivered':
                return <CheckCircle size={12} className="text-blue-400" />;
            case 'read':
                return <CheckCircle size={12} className="text-green-400" />;
            default:
                return null;
        }
    };

    if (!user) {
        return (
            <div className="page-container">
                <div className="auth-required">
                    <span className="auth-icon">🔒</span>
                    <h3>Connexion requise</h3>
                    <p>Connectez-vous pour accéder à vos messages</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container inbox-page">
            <div className="inbox-layout">
                {/* Sidebar des conversations */}
                <div className="conversations-sidebar">
                    <div className="sidebar-header">
                        <h2><MessageCircle size={24} /> Messages</h2>
                        <button className="new-message-button">
                            <Plus size={20} />
                        </button>
                    </div>

                    {/* Recherche */}
                    <div className="search-bar">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher des conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Onglets */}
                    <div className="conversation-tabs">
                        <button 
                            className={activeTab === 'all' ? 'active' : ''}
                            onClick={() => setActiveTab('all')}
                        >
                            Tous
                        </button>
                        <button 
                            className={activeTab === 'unread' ? 'active' : ''}
                            onClick={() => setActiveTab('unread')}
                        >
                            Non lus
                        </button>
                        <button 
                            className={activeTab === 'groups' ? 'active' : ''}
                            onClick={() => setActiveTab('groups')}
                        >
                            Groupes
                        </button>
                    </div>

                    {/* Liste des conversations */}
                    <div className="conversations-list">
                        {getFilteredConversations().map((conversation) => (
                            <div
                                key={conversation.id}
                                className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                                onClick={() => setSelectedConversation(conversation)}
                            >
                                <div className="conversation-avatar">
                                    {conversation.type === 'direct' ? (
                                        <>
                                            {conversation.participant.avatar ? (
                                                <img src={conversation.participant.avatar} alt={conversation.participant.name} />
                                            ) : (
                                                <span>{conversation.participant.name[0]}</span>
                                            )}
                                            {onlineUsers.has(conversation.participant.id) && (
                                                <div className="online-indicator"></div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="group-avatar">
                                            <Users size={20} />
                                        </div>
                                    )}
                                    {conversation.isPinned && (
                                        <div className="pinned-indicator">📌</div>
                                    )}
                                </div>

                                <div className="conversation-content">
                                    <div className="conversation-header">
                                        <h4>
                                            {conversation.type === 'direct' 
                                                ? conversation.participant.name 
                                                : conversation.name
                                            }
                                        </h4>
                                        <span className="timestamp">
                                            {formatTime(conversation.lastMessage.timestamp)}
                                        </span>
                                    </div>
                                    
                                    <div className="conversation-preview">
                                        <p className="last-message">
                                            {conversation.type === 'group' && conversation.lastMessage.senderId !== user.$id && (
                                                <span className="sender-name">{conversation.lastMessage.senderName}: </span>
                                            )}
                                            {conversation.lastMessage.text}
                                        </p>
                                        {conversation.unreadCount > 0 && (
                                            <div className="unread-badge">
                                                {conversation.unreadCount}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Zone de chat */}
                <div className="chat-area">
                    {selectedConversation ? (
                        <>
                            {/* Header du chat */}
                            <div className="chat-header">
                                <div className="chat-participant-info">
                                    <div className="participant-avatar">
                                        {selectedConversation.type === 'direct' ? (
                                            <>
                                                {selectedConversation.participant.avatar ? (
                                                    <img src={selectedConversation.participant.avatar} alt={selectedConversation.participant.name} />
                                                ) : (
                                                    <span>{selectedConversation.participant.name[0]}</span>
                                                )}
                                                {onlineUsers.has(selectedConversation.participant.id) && (
                                                    <div className="online-indicator"></div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="group-avatar">
                                                <Users size={24} />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="participant-details">
                                        <h3>
                                            {selectedConversation.type === 'direct' 
                                                ? selectedConversation.participant.name 
                                                : selectedConversation.name
                                            }
                                        </h3>
                                        <p className="status">
                                            {selectedConversation.type === 'direct' ? (
                                                onlineUsers.has(selectedConversation.participant.id) 
                                                    ? 'En ligne' 
                                                    : `Vu ${formatTime(selectedConversation.participant.lastSeen)}`
                                            ) : (
                                                `${selectedConversation.participants.length} membres`
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="chat-actions">
                                    {isSelectionMode ? (
                                        <div className="selection-actions">
                                            <button onClick={() => setIsSelectionMode(false)}>
                                                Annuler
                                            </button>
                                            <button onClick={deleteSelectedMessages} className="delete-button">
                                                <Trash2 size={16} />
                                                Supprimer ({selectedMessages.size})
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button className="action-button">
                                                <Phone size={20} />
                                            </button>
                                            <button className="action-button">
                                                <Video size={20} />
                                            </button>
                                            <button 
                                                onClick={() => setIsSelectionMode(true)}
                                                className="action-button"
                                            >
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="messages-container">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`message ${message.senderId === user.$id ? 'own' : 'other'} ${selectedMessages.has(message.id) ? 'selected' : ''}`}
                                        onClick={() => isSelectionMode && toggleMessageSelection(message.id)}
                                    >
                                        {message.senderId !== user.$id && selectedConversation.type === 'group' && (
                                            <div className="message-sender">{message.senderName}</div>
                                        )}
                                        
                                        <div className="message-content">
                                            <div className="message-bubble">
                                                <p>{message.text}</p>
                                                
                                                {/* Réactions */}
                                                {message.reactions && message.reactions.length > 0 && (
                                                    <div className="message-reactions">
                                                        {message.reactions.map((reaction, index) => (
                                                            <button
                                                                key={index}
                                                                className={`reaction ${reaction.users.includes(user.$id) ? 'own' : ''}`}
                                                                onClick={() => addReaction(message.id, reaction.emoji)}
                                                            >
                                                                {reaction.emoji} {reaction.users.length}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="message-meta">
                                                <span className="message-time">
                                                    {formatTime(message.timestamp)}
                                                </span>
                                                {message.senderId === user.$id && (
                                                    <span className="message-status">
                                                        {getMessageStatus(message.status)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions rapides */}
                                        <div className="message-actions">
                                            <button onClick={() => setShowEmojiPicker(message.id)}>
                                                <Smile size={14} />
                                            </button>
                                            <button>
                                                <Reply size={14} />
                                            </button>
                                            <button>
                                                <Forward size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                
                                {isTyping && (
                                    <div className="typing-indicator">
                                        <div className="typing-dots">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                        <span>En train d'écrire...</span>
                                    </div>
                                )}
                                
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Zone de saisie */}
                            <div className="message-input-area">
                                {showEmojiPicker && (
                                    <div className="emoji-picker">
                                        {emojis.map((emoji, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    if (typeof showEmojiPicker === 'string') {
                                                        addReaction(showEmojiPicker, emoji);
                                                    } else {
                                                        setNewMessage(prev => prev + emoji);
                                                    }
                                                    setShowEmojiPicker(false);
                                                }}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="input-container">
                                    <button className="attachment-button">
                                        <Paperclip size={20} />
                                    </button>
                                    
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => {
                                            setNewMessage(e.target.value);
                                            handleTyping();
                                        }}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Tapez votre message..."
                                        className="message-input"
                                    />
                                    
                                    <button 
                                        onClick={() => setShowEmojiPicker(true)}
                                        className="emoji-button"
                                    >
                                        <Smile size={20} />
                                    </button>
                                    
                                    <button 
                                        onClick={sendMessage}
                                        disabled={!newMessage.trim()}
                                        className="send-button"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="no-conversation-selected">
                            <MessageCircle size={64} />
                            <h3>Sélectionnez une conversation</h3>
                            <p>Choisissez une conversation pour commencer à discuter</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InboxPage;

