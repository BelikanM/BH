const { Client, Databases, Storage, Permission, Role, ID } = require('node-appwrite');

// Configuration Appwrite
const client = new Client();
const databases = new Databases(client);
const storage = new Storage(client);

// Variables de configuration
const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '67bb24ad002378e79e38';
const APPWRITE_API_KEY = 'standard_3f73de9c98e0013d3f9474426e8fced16bd8b783a1c18b056d34713cd9776621781ac96561cc0e8959ec86b484952d265eb6c5b070334e400eaa91174db365f044904d82ca94cd0f5efceebe6adfd188b2502cfb6d3721ac6a3b1bd14dafda2eaa00713133b050fbc3095fc92bda0b64ddf27cef1d1737f810497aa56fd4a289';
const BUCKET_ID = '68284595002f12395db2';

// Configuration du client
client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

// Configuration de la base de données
const DATABASE_ID = 'tiktok_clone';
const DATABASE_NAME = 'TikTok Clone Database';

// Configuration des collections
const collections = [
    {
        id: 'users',
        name: 'Users',
        attributes: [
            { key: 'username', type: 'string', size: 50, required: true },
            { key: 'displayName', type: 'string', size: 100, required: true },
            { key: 'email', type: 'string', size: 320, required: true },
            { key: 'bio', type: 'string', size: 500, required: false },
            { key: 'profilePicture', type: 'string', size: 500, required: false },
            { key: 'coverImage', type: 'string', size: 500, required: false },
            { key: 'isVerified', type: 'boolean', required: true, default: false },
            { key: 'isPrivate', type: 'boolean', required: true, default: false },
            { key: 'followersCount', type: 'integer', required: true, default: 0 },
            { key: 'followingCount', type: 'integer', required: true, default: 0 },
            { key: 'videosCount', type: 'integer', required: true, default: 0 },
            { key: 'likesCount', type: 'integer', required: true, default: 0 },
            { key: 'dateOfBirth', type: 'datetime', required: false },
            { key: 'country', type: 'string', size: 100, required: false },
            { key: 'language', type: 'string', size: 10, required: false, default: 'en' },
            { key: 'isActive', type: 'boolean', required: true, default: true },
            { key: 'lastSeen', type: 'datetime', required: false },
            { key: 'createdAt', type: 'datetime', required: true },
            { key: 'updatedAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'username_index', type: 'unique', attributes: ['username'] },
            { key: 'email_index', type: 'unique', attributes: ['email'] },
            { key: 'verified_index', type: 'key', attributes: ['isVerified'] },
            { key: 'followers_index', type: 'key', attributes: ['followersCount'] },
            { key: 'created_date_index', type: 'key', attributes: ['createdAt'] }
        ]
    },
    {
        id: 'videos',
        name: 'Videos',
        attributes: [
            { key: 'userId', type: 'string', size: 36, required: true },
            { key: 'title', type: 'string', size: 200, required: false },
            { key: 'description', type: 'string', size: 2000, required: false },
            { key: 'videoUrl', type: 'string', size: 500, required: true },
            { key: 'thumbnailUrl', type: 'string', size: 500, required: false },
            { key: 'duration', type: 'integer', required: true }, // en secondes
            { key: 'width', type: 'integer', required: true },
            { key: 'height', type: 'integer', required: true },
            { key: 'fileSize', type: 'integer', required: true }, // en bytes
            { key: 'hashtags', type: 'string', size: 1000, required: false }, // JSON array
            { key: 'mentions', type: 'string', size: 1000, required: false }, // JSON array
            { key: 'musicId', type: 'string', size: 36, required: false },
            { key: 'effectsUsed', type: 'string', size: 1000, required: false }, // JSON array
            { key: 'viewsCount', type: 'integer', required: true, default: 0 },
            { key: 'likesCount', type: 'integer', required: true, default: 0 },
            { key: 'commentsCount', type: 'integer', required: true, default: 0 },
            { key: 'sharesCount', type: 'integer', required: true, default: 0 },
            { key: 'downloadsCount', type: 'integer', required: true, default: 0 },
            { key: 'isPublic', type: 'boolean', required: true, default: true },
            { key: 'allowComments', type: 'boolean', required: true, default: true },
            { key: 'allowDuet', type: 'boolean', required: true, default: true },
            { key: 'allowStitch', type: 'boolean', required: true, default: true },
            { key: 'allowDownload', type: 'boolean', required: true, default: true },
            { key: 'isReported', type: 'boolean', required: true, default: false },
            { key: 'isFeatured', type: 'boolean', required: true, default: false },
            { key: 'location', type: 'string', size: 200, required: false },
            { key: 'createdAt', type: 'datetime', required: true },
            { key: 'updatedAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'user_videos_index', type: 'key', attributes: ['userId'] },
            { key: 'views_index', type: 'key', attributes: ['viewsCount'] },
            { key: 'likes_index', type: 'key', attributes: ['likesCount'] },
            { key: 'public_index', type: 'key', attributes: ['isPublic'] },
            { key: 'featured_index', type: 'key', attributes: ['isFeatured'] },
            { key: 'music_index', type: 'key', attributes: ['musicId'] },
            { key: 'created_date_index', type: 'key', attributes: ['createdAt'] },
            { key: 'trending_index', type: 'key', attributes: ['createdAt', 'viewsCount', 'likesCount'] }
        ]
    },
    {
        id: 'comments',
        name: 'Comments',
        attributes: [
            { key: 'videoId', type: 'string', size: 36, required: true },
            { key: 'userId', type: 'string', size: 36, required: true },
            { key: 'parentCommentId', type: 'string', size: 36, required: false }, // Pour les réponses
            { key: 'content', type: 'string', size: 1000, required: true },
            { key: 'mentions', type: 'string', size: 500, required: false }, // JSON array
            { key: 'likesCount', type: 'integer', required: true, default: 0 },
            { key: 'repliesCount', type: 'integer', required: true, default: 0 },
            { key: 'isReported', type: 'boolean', required: true, default: false },
            { key: 'isHidden', type: 'boolean', required: true, default: false },
            { key: 'isPinned', type: 'boolean', required: true, default: false },
            { key: 'createdAt', type: 'datetime', required: true },
            { key: 'updatedAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'video_comments_index', type: 'key', attributes: ['videoId'] },
            { key: 'user_comments_index', type: 'key', attributes: ['userId'] },
            { key: 'parent_comment_index', type: 'key', attributes: ['parentCommentId'] },
            { key: 'likes_index', type: 'key', attributes: ['likesCount'] },
            { key: 'pinned_index', type: 'key', attributes: ['isPinned'] },
            { key: 'created_date_index', type: 'key', attributes: ['createdAt'] }
        ]
    },
    {
        id: 'likes',
        name: 'Likes',
        attributes: [
            { key: 'userId', type: 'string', size: 36, required: true },
            { key: 'targetId', type: 'string', size: 36, required: true }, // Video ID ou Comment ID
            { key: 'targetType', type: 'string', size: 20, required: true }, // 'video' ou 'comment'
            { key: 'createdAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'user_likes_index', type: 'key', attributes: ['userId'] },
            { key: 'target_likes_index', type: 'key', attributes: ['targetId', 'targetType'] },
            { key: 'unique_like_index', type: 'unique', attributes: ['userId', 'targetId', 'targetType'] },
            { key: 'created_date_index', type: 'key', attributes: ['createdAt'] }
        ]
    },
    {
        id: 'follows',
        name: 'Follows',
        attributes: [
            { key: 'followerId', type: 'string', size: 36, required: true },
            { key: 'followingId', type: 'string', size: 36, required: true },
            { key: 'isAccepted', type: 'boolean', required: true, default: true }, // Pour les comptes privés
            { key: 'createdAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'follower_index', type: 'key', attributes: ['followerId'] },
            { key: 'following_index', type: 'key', attributes: ['followingId'] },
            { key: 'unique_follow_index', type: 'unique', attributes: ['followerId', 'followingId'] },
            { key: 'accepted_index', type: 'key', attributes: ['isAccepted'] },
            { key: 'created_date_index', type: 'key', attributes: ['createdAt'] }
        ]
    },
    {
        id: 'music',
        name: 'Music',
        attributes: [
            { key: 'title', type: 'string', size: 200, required: true },
            { key: 'artist', type: 'string', size: 200, required: true },
            { key: 'audioUrl', type: 'string', size: 500, required: true },
            { key: 'coverImageUrl', type: 'string', size: 500, required: false },
            { key: 'duration', type: 'integer', required: true }, // en secondes
            { key: 'genre', type: 'string', size: 100, required: false },
            { key: 'isOriginal', type: 'boolean', required: true, default: false },
            { key: 'originalCreatorId', type: 'string', size: 36, required: false },
            { key: 'usageCount', type: 'integer', required: true, default: 0 },
            { key: 'isActive', type: 'boolean', required: true, default: true },
            { key: 'isTrending', type: 'boolean', required: true, default: false },
            { key: 'createdAt', type: 'datetime', required: true },
            { key: 'updatedAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'title_index', type: 'key', attributes: ['title'] },
            { key: 'artist_index', type: 'key', attributes: ['artist'] },
            { key: 'usage_index', type: 'key', attributes: ['usageCount'] },
            { key: 'trending_index', type: 'key', attributes: ['isTrending'] },
            { key: 'original_creator_index', type: 'key', attributes: ['originalCreatorId'] },
            { key: 'created_date_index', type: 'key', attributes: ['createdAt'] }
        ]
    },
    {
        id: 'hashtags',
        name: 'Hashtags',
        attributes: [
            { key: 'name', type: 'string', size: 100, required: true },
            { key: 'description', type: 'string', size: 500, required: false },
            { key: 'usageCount', type: 'integer', required: true, default: 0 },
            { key: 'isTrending', type: 'boolean', required: true, default: false },
            { key: 'isBlocked', type: 'boolean', required: true, default: false },
            { key: 'category', type: 'string', size: 100, required: false },
            { key: 'createdAt', type: 'datetime', required: true },
            { key: 'updatedAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'name_index', type: 'unique', attributes: ['name'] },
            { key: 'usage_index', type: 'key', attributes: ['usageCount'] },
            { key: 'trending_index', type: 'key', attributes: ['isTrending'] },
            { key: 'category_index', type: 'key', attributes: ['category'] },
            { key: 'created_date_index', type: 'key', attributes: ['createdAt'] }
        ]
    },
    {
        id: 'notifications',
        name: 'Notifications',
        attributes: [
            { key: 'userId', type: 'string', size: 36, required: true },
            { key: 'fromUserId', type: 'string', size: 36, required: false },
            { key: 'type', type: 'string', size: 50, required: true }, // like, comment, follow, mention, etc.
            { key: 'title', type: 'string', size: 200, required: true },
            { key: 'message', type: 'string', size: 500, required: true },
            { key: 'targetId', type: 'string', size: 36, required: false }, // Video ID, Comment ID, etc.
            { key: 'targetType', type: 'string', size: 20, required: false },
            { key: 'imageUrl', type: 'string', size: 500, required: false },
            { key: 'isRead', type: 'boolean', required: true, default: false },
            { key: 'isClicked', type: 'boolean', required: true, default: false },
            { key: 'createdAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'user_notifications_index', type: 'key', attributes: ['userId'] },
            { key: 'from_user_index', type: 'key', attributes: ['fromUserId'] },
            { key: 'type_index', type: 'key', attributes: ['type'] },
            { key: 'read_index', type: 'key', attributes: ['isRead'] },
            { key: 'target_index', type: 'key', attributes: ['targetId', 'targetType'] },
            { key: 'created_date_index', type: 'key', attributes: ['createdAt'] }
        ]
    },
    {
        id: 'reports',
        name: 'Reports',
        attributes: [
            { key: 'reporterId', type: 'string', size: 36, required: true },
            { key: 'targetId', type: 'string', size: 36, required: true },
            { key: 'targetType', type: 'string', size: 20, required: true }, // user, video, comment
            { key: 'reason', type: 'string', size: 100, required: true },
            { key: 'description', type: 'string', size: 1000, required: false },
            { key: 'status', type: 'string', size: 20, required: true, default: 'pending' }, // pending, reviewed, resolved
            { key: 'reviewedBy', type: 'string', size: 36, required: false },
            { key: 'reviewedAt', type: 'datetime', required: false },
            { key: 'action', type: 'string', size: 100, required: false }, // warning, content_removed, user_banned, etc.
            { key: 'createdAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'reporter_index', type: 'key', attributes: ['reporterId'] },
            { key: 'target_index', type: 'key', attributes: ['targetId', 'targetType'] },
            { key: 'status_index', type: 'key', attributes: ['status'] },
            { key: 'reason_index', type: 'key', attributes: ['reason'] },
            { key: 'reviewed_by_index', type: 'key', attributes: ['reviewedBy'] },
            { key: 'created_date_index', type: 'key', attributes: ['createdAt'] }
        ]
    },
    {
        id: 'messages',
        name: 'Messages',
        attributes: [
            { key: 'senderId', type: 'string', size: 36, required: true },
            { key: 'receiverId', type: 'string', size: 36, required: true },
            { key: 'content', type: 'string', size: 2000, required: false },
            { key: 'messageType', type: 'string', size: 20, required: true, default: 'text' }, // text, image, video, audio
            { key: 'mediaUrl', type: 'string', size: 500, required: false },
            { key: 'thumbnailUrl', type: 'string', size: 500, required: false },
            { key: 'isRead', type: 'boolean', required: true, default: false },
            { key: 'isDelivered', type: 'boolean', required: true, default: false },
            { key: 'replyToMessageId', type: 'string', size: 36, required: false },
            { key: 'isDeleted', type: 'boolean', required: true, default: false },
            { key: 'createdAt', type: 'datetime', required: true },
            { key: 'updatedAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'sender_index', type: 'key', attributes: ['senderId'] },
            { key: 'receiver_index', type: 'key', attributes: ['receiverId'] },
            { key: 'conversation_index', type: 'key', attributes: ['senderId', 'receiverId'] },
            { key: 'read_index', type: 'key', attributes: ['isRead'] },
            { key: 'message_type_index', type: 'key', attributes: ['messageType'] },
            { key: 'reply_index', type: 'key', attributes: ['replyToMessageId'] },
            { key: 'created_date_index', type: 'key', attributes: ['createdAt'] }
        ]
    },
    {
        id: 'challenges',
        name: 'Challenges',
        attributes: [
            { key: 'title', type: 'string', size: 200, required: true },
            { key: 'description', type: 'string', size: 1000, required: true },
            { key: 'creatorId', type: 'string', size: 36, required: true },
            { key: 'hashtag', type: 'string', size: 100, required: true },
            { key: 'bannerImageUrl', type: 'string', size: 500, required: false },
            { key: 'musicId', type: 'string', size: 36, required: false },
            { key: 'participantsCount', type: 'integer', required: true, default: 0 },
            { key: 'videosCount', type: 'integer', required: true, default: 0 },
            { key: 'viewsCount', type: 'integer', required: true, default: 0 },
            { key: 'isOfficial', type: 'boolean', required: true, default: false },
            { key: 'isFeatured', type: 'boolean', required: true, default: false },
            { key: 'isActive', type: 'boolean', required: true, default: true },
            { key: 'startDate', type: 'datetime', required: true },
            { key: 'endDate', type: 'datetime', required: false },
            { key: 'createdAt', type: 'datetime', required: true },
            { key: 'updatedAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'creator_index', type: 'key', attributes: ['creatorId'] },
            { key: 'hashtag_index', type: 'unique', attributes: ['hashtag'] },
            { key: 'participants_index', type: 'key', attributes: ['participantsCount'] },
            { key: 'official_index', type: 'key', attributes: ['isOfficial'] },
            { key: 'featured_index', type: 'key', attributes: ['isFeatured'] },
            { key: 'active_index', type: 'key', attributes: ['isActive'] },
            { key: 'start_date_index', type: 'key', attributes: ['startDate'] },
            { key: 'created_date_index', type: 'key', attributes: ['createdAt'] }
        ]
    },
    {
        id: 'user_settings',
        name: 'UserSettings',
        attributes: [
            { key: 'userId', type: 'string', size: 36, required: true },
            { key: 'pushNotifications', type: 'boolean', required: true, default: true },
            { key: 'emailNotifications', type: 'boolean', required: true, default: true },
            { key: 'privateAccount', type: 'boolean', required: true, default: false },
            { key: 'allowComments', type: 'string', size: 20, required: true, default: 'everyone' }, // everyone, friends, off
            { key: 'allowDuets', type: 'string', size: 20, required: true, default: 'everyone' },
            { key: 'allowStitch', type: 'string', size: 20, required: true, default: 'everyone' },
            { key: 'allowDownloads', type: 'boolean', required: true, default: true },
            { key: 'whoCanSendMessages', type: 'string', size: 20, required: true, default: 'everyone' },
            { key: 'dataUsage', type: 'string', size: 20, required: true, default: 'auto' }, // auto, wifi_only, unlimited
            { key: 'autoplayVideos', type: 'boolean', required: true, default: true },
            { key: 'showInSearch', type: 'boolean', required: true, default: true },
            { key: 'suggestToFriends', type: 'boolean', required: true, default: true },
            { key: 'createdAt', type: 'datetime', required: true },
            { key: 'updatedAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'user_settings_index', type: 'unique', attributes: ['userId'] },
            { key: 'private_index', type: 'key', attributes: ['privateAccount'] },
            { key: 'search_index', type: 'key', attributes: ['showInSearch'] }
        ]
    }
];

// Fonction pour créer la base de données
async function createDatabase() {
    try {
        console.log('🗄️ Création de la base de données TikTok Clone...');
        const database = await databases.create(DATABASE_ID, DATABASE_NAME);
        console.log('✅ Base de données créée:', database.name);
        return database;
    } catch (error) {
        if (error.code === 409) {
            console.log('ℹ️ La base de données existe déjà');
            return await databases.get(DATABASE_ID);
        }
        throw error;
    }
}

// Fonction pour créer une collection
async function createCollection(collectionConfig) {
    try {
        console.log(`📁 Création de la collection "${collectionConfig.name}"...`);
        
        // Créer la collection avec permissions
        const collection = await databases.createCollection(
            DATABASE_ID,
            collectionConfig.id,
            collectionConfig.name,
            [
                Permission.read(Role.any()),
                Permission.write(Role.users()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())
            ]
        );

        // Ajouter les attributs
        for (const attr of collectionConfig.attributes) {
            console.log(`  📝 Ajout de l'attribut "${attr.key}" (${attr.type})...`);
            
            try {
                switch (attr.type) {
                    case 'string':
                        await databases.createStringAttribute(
                            DATABASE_ID,
                            collectionConfig.id,
                            attr.key,
                            attr.size,
                            attr.required,
                            attr.default || null
                        );
                        break;
                    case 'integer':
                        await databases.createIntegerAttribute(
                            DATABASE_ID,
                            collectionConfig.id,
                            attr.key,
                            attr.required,
                            attr.min || null,
                            attr.max || null,
                            attr.default || null
                        );
                        break;
                    case 'double':
                        await databases.createFloatAttribute(
                            DATABASE_ID,
                            collectionConfig.id,
                            attr.key,
                            attr.required,
                            attr.min || null,
                            attr.max || null,
                            attr.default || null
                        );
                        break;
                    case 'boolean':
                        await databases.createBooleanAttribute(
                            DATABASE_ID,
                            collectionConfig.id,
                            attr.key,
                            attr.required,
                            attr.default || null
                        );
                        break;
                    case 'datetime':
                        await databases.createDatetimeAttribute(
                            DATABASE_ID,
                            collectionConfig.id,
                            attr.key,
                            attr.required,
                            attr.default || null
                        );
                        break;
                }
                
                // Pause pour éviter les problèmes de synchronisation
                await new Promise(resolve => setTimeout(resolve, 1500));
                
            } catch (attrError) {
                console.log(`    ⚠️ Erreur attribut "${attr.key}":`, attrError.message);
            }
        }

        // Attendre que tous les attributs soient créés
        console.log(`  ⏳ Attente de la synchronisation des attributs...`);
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Ajouter les index
        for (const index of collectionConfig.indexes) {
            console.log(`  🔍 Création de l'index "${index.key}"...`);
            try {
                await databases.createIndex(
                    DATABASE_ID,
                    collectionConfig.id,
                    index.key,
                    index.type,
                    index.attributes
                );
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (indexError) {
                console.log(`    ⚠️ Erreur index "${index.key}":`, indexError.message);
            }
        }

        console.log(`✅ Collection "${collectionConfig.name}" créée avec succès`);
        return collection;

    } catch (error) {
        if (error.code === 409) {
            console.log(`ℹ️ La collection "${collectionConfig.name}" existe déjà`);
        } else {
            console.error(`❌ Erreur lors de la création de "${collectionConfig.name}":`, error.message);
        }
    }
}

// Fonction pour vérifier et configurer le bucket de stockage
async function configureBucket() {
    try {
        console.log('🪣 Vérification du bucket de stockage...');
        const bucket = await storage.getBucket(BUCKET_ID);
        console.log('✅ Bucket trouvé:', bucket.name);
        return bucket;
    } catch (error) {
        if (error.code === 404) {
            console.log('❌ Bucket non trouvé. Veuillez créer le bucket manuellement dans la console Appwrite.');
            console.log(`   Bucket ID attendu: ${BUCKET_ID}`);
        } else {
            console.error('❌ Erreur bucket:', error.message);
        }
    }
}

// Fonction principale
async function setupTikTokDatabase() {
    try {
        console.log('🚀 Début de la configuration de la base de données TikTok Clone...\n');

        // Vérifier le bucket
        await configureBucket();
        console.log('');

        // Créer la base de données
        await createDatabase();
        console.log('');

        // Créer toutes les collections
        for (let i = 0; i < collections.length; i++) {
            const collectionConfig = collections[i];
            console.log(`\n📊 Progression: ${i + 1}/${collections.length}`);
            await createCollection(collectionConfig);
            console.log('');
        }

        console.log('🎉 Configuration terminée avec succès !');
        console.log('\n📋 Résumé:');
        console.log(`   Base de données: ${DATABASE_NAME} (ID: ${DATABASE_ID})`);
        console.log(`   Collections créées: ${collections.length}`);
        console.log(`   Bucket de stockage: ${BUCKET_ID}`);
        
        console.log('\n📂 Collections créées:');
        collections.forEach((col, index) => {
            console.log(`   ${index + 1}. ${col.name} (${col.attributes.length} attributs, ${col.indexes.length} index)`);
        });

        console.log('\n🔧 Fonctionnalités supportées:');
        console.log('   ✅ Gestion des utilisateurs et profils');
        console.log('   ✅ Upload et gestion des vidéos');
        console.log('   ✅ Système de likes et commentaires');
        console.log('   ✅ Système de follow/unfollow');
        console.log('   ✅ Gestion de la musique et hashtags');
        console.log('   ✅ Système de notifications');
        console.log('   ✅ Messagerie privée');
        console.log('   ✅ Challenges et défis');
        console.log('   ✅ Système de signalement');
        console.log('   ✅ Paramètres utilisateur');

    } catch (error) {
        console.error('❌ Erreur générale:', error.message);
        process.exit(1);
    }
}

// Fonction pour insérer des données de test
async function insertSampleData() {
    try {
        console.log('\n📊 Insertion de données de test...');

        // Musiques de test
        const sampleMusic = [
            {
                title: 'Original Sound',
                artist: 'TikTok',
                audioUrl: 'https://example.com/original-sound.mp3',
                duration: 30,
                isOriginal: true,
                usageCount: 1000
            },
            {
                title: 'Trending Beat',
                artist: 'Popular Artist',
                audioUrl: 'https://example.com/trending-beat.mp3',
                duration: 45,
                isOriginal: false,
                isTrending: true,
                usageCount: 5000
            }
        ];

        for (const music of sampleMusic) {
            await databases.createDocument(
                DATABASE_ID,
                'music',
                ID.unique(),
                {
                    ...music,
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            );
        }

        // Hashtags de test
        const sampleHashtags = [
            { name: 'fyp', description: 'For You Page', usageCount: 1000000, isTrending: true },
            { name: 'viral', description: 'Viral content', usageCount: 500000, isTrending: true },
            { name: 'dance', description: 'Dance videos', usageCount: 300000, category: 'Entertainment' },
            { name: 'comedy', description: 'Funny videos', usageCount: 250000, category: 'Entertainment' }
        ];

        for (const hashtag of sampleHashtags) {
            await databases.createDocument(
                DATABASE_ID,
                'hashtags',
                ID.unique(),
                {
                    ...hashtag,
                    isBlocked: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            );
        }

        // Challenge de test
        const sampleChallenge = {
            title: 'Dance Challenge 2024',
            description: 'Show us your best dance moves!',
            creatorId: 'system',
            hashtag: 'dancechallenge2024',
            participantsCount: 1500,
            videosCount: 3000,
            viewsCount: 1000000,
            isOfficial: true,
            isFeatured: true,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 jours
        };

        await databases.createDocument(
            DATABASE_ID,
            'challenges',
            ID.unique(),
            {
                ...sampleChallenge,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        );

        console.log('✅ Données de test insérées');

    } catch (error) {
        console.error('❌ Erreur lors de l\'insertion des données:', error.message);
    }
}

// Exécution du script
if (require.main === module) {
    setupTikTokDatabase()
        .then(() => {
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });

            readline.question('\n❓ Voulez-vous insérer des données de test ? (y/N): ', (answer) => {
                if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                    insertSampleData().finally(() => {
                        readline.close();
                        console.log('\n🎯 Votre backend TikTok Clone est prêt !');
                        console.log('📱 Vous pouvez maintenant commencer à développer votre application.');
                        process.exit(0);
                    });
                } else {
                    readline.close();
                    console.log('\n🎯 Votre backend TikTok Clone est prêt !');
                    console.log('📱 Vous pouvez maintenant commencer à développer votre application.');
                    process.exit(0);
                }
            });
        })
        .catch((error) => {
            console.error('❌ Erreur fatale:', error);
            process.exit(1);
        });
}

module.exports = { setupTikTokDatabase, insertSampleData };

