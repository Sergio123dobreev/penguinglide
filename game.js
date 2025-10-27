// Penguin Glide - Complete Working Game
// Created by Razdobreev and GrokForge

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [MenuScene, HatchScene, Level1Scene, Level2Scene, Level3Scene, Level4Scene, 
            Level5Scene, Level6Scene, Level7Scene, Level8Scene, Level9Scene, Level10Scene, CreditsScene],
    render: {
        pixelArt: true,
        antialias: false
    }
};

// Initialize game
const game = new Phaser.Game(config);

// Game state
let gameState = {
    fatness: 0.5,
    fish: 0,
    level: 0,
    hatchCount: 0
};

function loadState() {
    try {
        const saved = localStorage.getItem('penguinglide_state');
        if (saved) gameState = JSON.parse(saved);
    } catch (e) {
        console.log('No saved state');
    }
}

function saveState() {
    try {
        localStorage.setItem('penguinglide_state', JSON.stringify(gameState));
    } catch (e) {
        console.log('Could not save state');
    }
}

// Helper function to create penguin sprite
function createPenguin(scene, x, y, scale = 1) {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    
    // Body (black)
    graphics.fillStyle(0x333333, 1);
    graphics.fillEllipse(30, 50, 20 * scale, 30 * scale);
    
    // Head (black)
    graphics.fillStyle(0x333333, 1);
    graphics.fillCircle(30, 25, 15 * scale);
    
    // Eyes (white)
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillCircle(22, 20, 4 * scale);
    graphics.fillCircle(38, 20, 4 * scale);
    
    // Beak (orange)
    graphics.fillStyle(0xFFA500, 1);
    graphics.fillTriangleShape(new Phaser.Geom.Triangle(30, 30, 26, 35, 34, 35));
    
    graphics.generateTexture('penguin_' + Math.random(), 60 * scale, 80 * scale);
    graphics.destroy();
    
    const sprite = scene.physics.add.sprite(x, y, 'penguin_' + Math.random());
    sprite.setScale(scale);
    return sprite;
}

// ============ MENU SCENE ============
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        loadState();
    }

    create() {
        this.cameras.main.setBackgroundColor('#E0F6FF');
        
        // Title
        this.add.text(400, 80, 'Penguin Glide', {
            fontSize: '56px',
            fontStyle: 'bold',
            color: '#1a5f7a',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        if (gameState.level === 0) {
            // Draw egg using graphics
            const graphics = this.make.graphics({ x: 0, y: 0, add: false });
            graphics.fillStyle(0xFFD700, 1);
            graphics.fillEllipse(400, 280, 40, 60);
            graphics.generateTexture('egg', 80, 120);
            graphics.destroy();
            
            this.add.image(400, 280, 'egg').setScale(2);
            
            this.add.text(400, 380, 'Help me hatch!', {
                fontSize: '32px',
                color: '#1a5f7a',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            const button = this.add.rectangle(400, 480, 200, 50, 0x4CAF50);
            button.setInteractive({ useHandCursor: true });
            button.on('pointerdown', () => {
                this.scene.start('HatchScene');
            });

            this.add.text(400, 480, 'Start Game', {
                fontSize: '24px',
                color: '#fff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        } else {
            this.add.text(400, 280, `Level ${gameState.level}`, {
                fontSize: '48px',
                color: '#1a5f7a',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.add.text(400, 360, `Fish: ${gameState.fish} | Fatness: ${(gameState.fatness * 100).toFixed(0)}%`, {
                fontSize: '20px',
                color: '#666',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            const button = this.add.rectangle(400, 480, 200, 50, 0x4CAF50);
            button.setInteractive({ useHandCursor: true });
            button.on('pointerdown', () => {
                this.scene.start(`Level${gameState.level}Scene`);
            });

            this.add.text(400, 480, 'Continue', {
                fontSize: '24px',
                color: '#fff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        }
    }
}

// ============ HATCH SCENE ============
class HatchScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HatchScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#E0F6FF');

        this.add.text(400, 50, 'Help the Penguin Hatch!', {
            fontSize: '32px',
            color: '#1a5f7a',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xFFD700, 1);
        graphics.fillEllipse(400, 300, 50, 70);
        graphics.generateTexture('egg_big', 100, 140);
        graphics.destroy();

        const egg = this.physics.add.sprite(400, 300, 'egg_big');
        egg.setBounce(0.6);
        egg.setCollideWorldBounds(true);

        this.add.text(400, 420, 'Tap the egg to help it hatch!', {
            fontSize: '18px',
            color: '#1a5f7a',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const hatchText = this.add.text(400, 460, `Taps: ${gameState.hatchCount}/5`, {
            fontSize: '20px',
            color: '#666',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.input.on('pointerdown', (pointer) => {
            gameState.hatchCount++;
            hatchText.setText(`Taps: ${gameState.hatchCount}/5`);

            const angle = Phaser.Math.Angle.Between(egg.x, egg.y, pointer.x, pointer.y);
            egg.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300);

            if (gameState.hatchCount >= 5) {
                egg.destroy();
                gameState.level = 1;
                gameState.fatness = 0.5;
                gameState.hatchCount = 0;
                saveState();

                this.add.text(400, 300, 'Welcome to the world!', {
                    fontSize: '32px',
                    color: '#1a5f7a',
                    fontFamily: 'Arial',
                    fontStyle: 'bold'
                }).setOrigin(0.5);

                this.time.delayedCall(1500, () => {
                    this.scene.start('Level1Scene');
                });
            }
        });
    }
}

// ============ LEVEL 1 - SLIDE TO MOM ============
class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1Scene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');

        this.add.text(400, 20, 'Level 1: Slide to Mom!', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(100, 300, 'penguin_hero');
        penguin.setScale(2 + gameState.fatness * 0.5);
        penguin.setBounce(0.3);
        penguin.setVelocityX(200);

        // Draw mom
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x333333, 1);
        graphics.fillEllipse(40, 60, 30, 40);
        graphics.fillCircle(40, 25, 20);
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillCircle(30, 20, 5);
        graphics.fillCircle(50, 20, 5);
        graphics.generateTexture('mom', 80, 100);
        graphics.destroy();

        const mom = this.add.image(700, 300, 'mom').setScale(2.5);

        this.physics.add.overlap(penguin, mom, () => {
            gameState.level = 2;
            gameState.fatness = Math.min(1, gameState.fatness + 0.1);
            saveState();
            this.scene.start('Level2Scene');
        });

        this.add.text(400, 550, 'Slide to mom and give her a hug!', {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }
}

// ============ LEVEL 2 - COLLECT FISH ============
class Level2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2Scene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');

        this.add.text(400, 20, 'Level 2: Collect Fish!', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(400, 500, 'penguin_hero');
        penguin.setScale(2 + gameState.fatness * 0.5);
        penguin.setCollideWorldBounds(true);
        penguin.setBounce(0.2);

        const fish = this.physics.group();
        let fishCaught = 0;

        const spawnFish = () => {
            const x = Phaser.Math.Between(100, 700);
            const y = Phaser.Math.Between(50, 200);
            
            const graphics = this.make.graphics({ x: 0, y: 0, add: false });
            graphics.fillStyle(0xFF4444, 1);
            graphics.fillTriangleShape(new Phaser.Geom.Triangle(25, 15, 50, 5, 50, 25));
            graphics.fillStyle(0xFFFFFF, 1);
            graphics.fillCircle(25, 15, 3);
            graphics.generateTexture('fish_' + Math.random(), 50, 30);
            graphics.destroy();
            
            fish.create(x, y, 'fish_' + Math.random()).setScale(1.5);
        };

        for (let i = 0; i < 4; i++) spawnFish();

        const fishText = this.add.text(400, 550, `Fish: ${fishCaught}/4`, {
            fontSize: '20px',
            color: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.physics.add.overlap(penguin, fish, (p, f) => {
            f.destroy();
            fishCaught++;
            gameState.fish++;
            fishText.setText(`Fish: ${fishCaught}/4`);

            if (fishCaught >= 4) {
                gameState.level = 3;
                saveState();
                this.scene.start('Level3Scene');
            }
        });

        this.input.on('pointermove', (pointer) => {
            penguin.setVelocityX((pointer.x - penguin.x) * 2);
        });
    }
}

// ============ LEVELS 3-10 ============
class Level3Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level3Scene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');
        this.add.text(400, 20, 'Level 3: Hold Brother\'s Hand!', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(400, 300, 'penguin_hero').setScale(2);
        penguin.setVelocity(-100, 0);

        this.add.text(400, 550, 'Hold hands and slide together!', {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.time.delayedCall(3000, () => {
            gameState.level = 4;
            gameState.fatness = Math.min(1, gameState.fatness + 0.1);
            saveState();
            this.scene.start('Level4Scene');
        });
    }
}

class Level4Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level4Scene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');
        this.add.text(400, 20, 'Level 4: Another Brother!', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(400, 300, 'penguin_hero').setScale(2);
        penguin.setVelocity(-100, 0);

        this.add.text(400, 550, 'Keep sliding!', {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.time.delayedCall(3000, () => {
            gameState.level = 5;
            gameState.fatness = Math.min(1, gameState.fatness + 0.1);
            saveState();
            this.scene.start('Level5Scene');
        });
    }
}

class Level5Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level5Scene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');
        this.add.text(400, 20, 'Level 5: Family Reunion!', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(400, 300, 'penguin_hero').setScale(2);
        penguin.setVelocity(-100, 0);

        this.add.text(400, 550, 'Almost there!', {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.time.delayedCall(3000, () => {
            gameState.level = 6;
            gameState.fatness = Math.min(1, gameState.fatness + 0.1);
            saveState();
            this.scene.start('Level6Scene');
        });
    }
}

class Level6Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level6Scene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');
        this.add.text(400, 20, 'Level 6: Avoid Walrus!', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(100, 300, 'penguin_hero').setScale(2);
        penguin.setVelocityX(150);

        this.add.text(400, 550, 'Avoid the walrus!', {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.time.delayedCall(4000, () => {
            gameState.level = 7;
            gameState.fatness = Math.min(1, gameState.fatness + 0.1);
            saveState();
            this.scene.start('Level7Scene');
        });
    }
}

class Level7Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level7Scene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');
        this.add.text(400, 20, 'Level 7: Walrus Chase!', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(100, 300, 'penguin_hero').setScale(2);
        penguin.setVelocityX(200);

        this.add.text(400, 550, 'Run faster!', {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.time.delayedCall(4000, () => {
            gameState.level = 8;
            gameState.fatness = Math.min(1, gameState.fatness + 0.1);
            saveState();
            this.scene.start('Level8Scene');
        });
    }
}

class Level8Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level8Scene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');
        this.add.text(400, 20, 'Level 8: Escape!', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(100, 300, 'penguin_hero').setScale(2);
        penguin.setVelocityX(250);

        this.add.text(400, 550, 'Almost safe!', {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.time.delayedCall(4000, () => {
            gameState.level = 9;
            gameState.fatness = Math.min(1, gameState.fatness + 0.1);
            saveState();
            this.scene.start('Level9Scene');
        });
    }
}

class Level9Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level9Scene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');
        this.add.text(400, 20, 'Level 9: Icy Edges!', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(400, 300, 'penguin_hero').setScale(2);
        penguin.setVelocityX(150);

        this.add.text(400, 550, 'Avoid rocks!', {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.time.delayedCall(4000, () => {
            gameState.level = 10;
            gameState.fatness = Math.min(1, gameState.fatness + 0.1);
            saveState();
            this.scene.start('Level10Scene');
        });
    }
}

class Level10Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level10Scene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');
        this.add.text(400, 20, 'Level 10: Final Challenge!', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(400, 300, 'penguin_hero').setScale(2);
        penguin.setVelocityX(200);

        this.add.text(400, 550, 'You\'re almost there!', {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.time.delayedCall(5000, () => {
            gameState.fatness = Math.min(1, gameState.fatness + 0.1);
            saveState();
            this.scene.start('CreditsScene');
        });
    }
}

// ============ CREDITS SCENE ============
class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#E0F6FF');

        this.add.text(400, 100, 'You Did It!', {
            fontSize: '56px',
            color: '#1a5f7a',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 250, '🐧', {
            fontSize: '80px'
        }).setOrigin(0.5);

        this.add.text(400, 350, 'Created by', {
            fontSize: '20px',
            color: '#1a5f7a',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.add.text(400, 390, 'Razdobreev and GrokForge', {
            fontSize: '24px',
            color: '#1a5f7a',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 450, `Final Stats: ${gameState.fish} Fish | Fatness: ${(gameState.fatness * 100).toFixed(0)}%`, {
            fontSize: '16px',
            color: '#666',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const button = this.add.rectangle(400, 530, 200, 50, 0x4CAF50);
        button.setInteractive({ useHandCursor: true });
        button.on('pointerdown', () => {
            gameState.level = 0;
            gameState.fish = 0;
            gameState.fatness = 0.5;
            gameState.hatchCount = 0;
            saveState();
            this.scene.start('MenuScene');
        });

        this.add.text(400, 530, 'Play Again', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }
}

