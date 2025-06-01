require('dotenv').config();
const { Client, Databases, Storage, Permission, Role, ID } = require('node-appwrite');

// Configuration Appwrite depuis les variables d'environnement
const client = new Client();
const databases = new Databases(client);
const storage = new Storage(client);

// Variables de configuration sécurisées
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
const BUCKET_ID = process.env.APPWRITE_BUCKET_ID;
const DATABASE_ID = process.env.DATABASE_ID;
const DATABASE_NAME = process.env.DATABASE_NAME;

// Vérification des variables d'environnement
function checkEnvironmentVariables() {
    const requiredVars = [
        'APPWRITE_ENDPOINT',
        'APPWRITE_PROJECT_ID', 
        'APPWRITE_API_KEY',
        'APPWRITE_BUCKET_ID',
        'DATABASE_ID',
        'DATABASE_NAME'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        console.error('❌ Variables d\'environnement manquantes:');
        missingVars.forEach(varName => console.error(`   - ${varName}`));
        console.error('\n💡 Vérifiez votre fichier .env');
        process.exit(1);
    }

    console.log('✅ Variables d\'environnement chargées');
}

// Configuration du client
client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

// Configuration des collections (version simplifiée)
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
            { key: 'isVerified', type: 'boolean', required: false },
            { key: 'followersCount', type: 'integer', required: false },
            { key: 'followingCount', type: 'integer', required: false },
            { key: 'videosCount', type: 'integer', required: false },
            { key: 'createdAt', type: 'datetime', required: true },
            { key: 'updatedAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'username_index', type: 'unique', attributes: ['username'] },
            { key: 'email_index', type: 'unique', attributes: ['email'] }
        ]
    },
    {
        id: 'videos',
        name: 'Videos',
        attributes: [
            { key: 'userId', type: 'string', size: 36, required: true },
            { key: 'title', type: 'string', size: 200, required: false },
            { key: 'description', type: 'string', size: 1000, required: false },
            { key: 'videoUrl', type: 'string', size: 500, required: true },
            { key: 'thumbnailUrl', type: 'string', size: 500, required: false },
            { key: 'duration', type: 'integer', required: true },
            { key: 'viewsCount', type: 'integer', required: false },
            { key: 'likesCount', type: 'integer', required: false },
            { key: 'commentsCount', type: 'integer', required: false },
            { key: 'isPublic', type: 'boolean', required: false },
            { key: 'createdAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'user_videos_index', type: 'key', attributes: ['userId'] },
            { key: 'views_index', type: 'key', attributes: ['viewsCount'] }
        ]
    },
    {
        id: 'comments',
        name: 'Comments',
        attributes: [
            { key: 'videoId', type: 'string', size: 36, required: true },
            { key: 'userId', type: 'string', size: 36, required: true },
            { key: 'content', type: 'string', size: 1000, required: true },
            { key: 'likesCount', type: 'integer', required: false },
            { key: 'createdAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'video_comments_index', type: 'key', attributes: ['videoId'] },
            { key: 'user_comments_index', type: 'key', attributes: ['userId'] }
        ]
    },
    {
        id: 'likes',
        name: 'Likes',
        attributes: [
            { key: 'userId', type: 'string', size: 36, required: true },
            { key: 'targetId', type: 'string', size: 36, required: true },
            { key: 'targetType', type: 'string', size: 20, required: true },
            { key: 'createdAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'user_likes_index', type: 'key', attributes: ['userId'] },
            { key: 'unique_like_index', type: 'unique', attributes: ['userId', 'targetId', 'targetType'] }
        ]
    },
    {
        id: 'follows',
        name: 'Follows',
        attributes: [
            { key: 'followerId', type: 'string', size: 36, required: true },
            { key: 'followingId', type: 'string', size: 36, required: true },
            { key: 'createdAt', type: 'datetime', required: true }
        ],
        indexes: [
            { key: 'follower_index', type: 'key', attributes: ['followerId'] },
            { key: 'following_index', type: 'key', attributes: ['followingId'] },
            { key: 'unique_follow_index', type: 'unique', attributes: ['followerId', 'followingId'] }
        ]
    }
];

// Fonction pour créer la base de données
async function createDatabase() {
    try {
        console.log('🗄️ Création de la base de données...');
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
        
        const collection = await databases.createCollection(
            DATABASE_ID,
            collectionConfig.id,
            collectionConfig.name,
            [
                Permission.read(Role.any()),
                Permission.write(Role.users()),
                Permission.create(Role.users()),
                Permission.update(Role.users())
            ]
        );

        // Ajouter les attributs
        for (const attr of collectionConfig.attributes) {
            console.log(`  📝 Ajout de l'attribut "${attr.key}"...`);
            
            try {
                switch (attr.type) {
                    case 'string':
                        await databases.createStringAttribute(
                            DATABASE_ID,
                            collectionConfig.id,
                            attr.key,
                            attr.size,
                            attr.required
                        );
                        break;
                    case 'integer':
                        await databases.createIntegerAttribute(
                            DATABASE_ID,
                            collectionConfig.id,
                            attr.key,
                            attr.required
                        );
                        break;
                    case 'boolean':
                        await databases.createBooleanAttribute(
                            DATABASE_ID,
                            collectionConfig.id,
                            attr.key,
                            attr.required
                        );
                        break;
                    case 'datetime':
                        await databases.createDatetimeAttribute(
                            DATABASE_ID,
                            collectionConfig.id,
                            attr.key,
                            attr.required
                        );
                        break;
                }
                
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (attrError) {
                console.log(`    ⚠️ Erreur attribut "${attr.key}":`, attrError.message);
            }
        }

        console.log(`  ⏳ Attente de synchronisation...`);
        await new Promise(resolve => setTimeout(resolve, 3000));

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
                await new Promise(resolve => setTimeout(resolve, 1000));
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

// Fonction principale
async function setupTikTokDatabase() {
    try {
        console.log('🔐 Configuration sécurisée TikTok Clone Backend\n');
        
        checkEnvironmentVariables();
        console.log('');

        await createDatabase();
        console.log('');

        for (let i = 0; i < collections.length; i++) {
            const collectionConfig = collections[i];
            console.log(`\n📊 Progression: ${i + 1}/${collections.length}`);
            await createCollection(collectionConfig);
        }

        console.log('\n🎉 Configuration terminée avec succès !');
        console.log(`\n📋 Collections créées: ${collections.length}`);
        collections.forEach((col, index) => {
            console.log(`   ${index + 1}. ${col.name}`);
        });

        console.log('\n🔐 Variables sécurisées dans .env');
        console.log('🎯 Votre backend TikTok Clone sécurisé est prêt !');

    } catch (error) {
        console.error('❌ Erreur générale:', error.message);
        process.exit(1);
    }
}

// Exécution du script
if (require.main === module) {
    setupTikTokDatabase()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Erreur fatale:', error);
            process.exit(1);
        });
}

module.exports = { setupTikTokDatabase };

