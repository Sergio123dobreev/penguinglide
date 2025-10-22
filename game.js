// Penguin Glide - Complete Game with 10 Levels
// Created by Razdobreev and GrokForge

const gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [BootScene, MenuScene, HatchScene, Level1Scene, Level2Scene, Level3Scene, 
            Level4Scene, Level5Scene, Level6Scene, Level7Scene, Level8Scene, 
            Level9Scene, Level10Scene, CreditsScene]
};

const game = new Phaser.Game(gameConfig);

// ============ GAME STATE ============
let gameState = {
    fatness: 0.5,
    fish: 0,
    level: 0,
    hatchCount: 0
};

function loadGameState() {
    const saved = localStorage.getItem('penguinglide');
    if (saved) gameState = JSON.parse(saved);
    return gameState;
}

function saveGameState() {
    localStorage.setItem('penguinglide', JSON.stringify(gameState));
}

// ============ BOOT SCENE ============
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load Phaser assets
        this.load.image('egg', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxlbGxpcHNlIGN4PSI0MCIgY3k9IjUwIiByeD0iMzAiIHJ5PSI0MCIgZmlsbD0iI0ZGRDcwMCIgc3Ryb2tlPSIjRkZCMzAwIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=');
        this.load.image('penguin', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGVsbGlwc2UgY3g9IjMwIiBjeT0iNTAiIHJ4PSIyMCIgcnk9IjMwIiBmaWxsPSIjMzMzMzMzIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSIyNSIgcj0iMTUiIGZpbGw9IiMzMzMzMzMiLz48Y2lyY2xlIGN4PSIyMiIgY3k9IjIwIiByPSI0IiBmaWxsPSIjRkZGRkZGIi8+PGNpcmNsZSBjeD0iMzgiIGN5PSIyMCIgcj0iNCIgZmlsbD0iI0ZGRkZGRiIvPjxwb2x5Z29uIHBvaW50cz0iMzAsMzAgMjYsMzUgMzQsMzUiIGZpbGw9IiNGRkE1MDAiLz48L3N2Zz4=');
        this.load.image('mom', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxlbGxpcHNlIGN4PSI0MCIgY3k9IjYwIiByeD0iMjUiIHJ5PSIzNSIgZmlsbD0iIzMzMzMzMyIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iMjUiIHI9IjIwIiBmaWxsPSIjMzMzMzMzIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSIyMCIgcj0iNSIgZmlsbD0iI0ZGRkZGRiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMjAiIHI9IjUiIGZpbGw9IiNGRkZGRkYiLz48L3N2Zz4=');
        this.load.image('fish', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBvbHlnb24gcG9pbnRzPSIxMCwxNSAzNSw1IDM1LDI1IiBmaWxsPSIjRkY0NDQ0Ii8+PGNpcmNsZSBjeD0iMTAiIGN5PSIxNSIgcj0iMyIgZmlsbD0iI0ZGRkZGRiIvPjwvc3ZnPg==');
        this.load.image('walrus', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxlbGxpcHNlIGN4PSI1MCIgY3k9IjMwIiByeD0iNDUiIHJ5PSIyNSIgZmlsbD0iIzhCOEI4QiIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjUiIHI9IjgiIGZpbGw9IiM2NjY2NjYiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjI1IiByPSI4IiBmaWxsPSIjNjY2NjY2Ii8+PHBvbHlnb24gcG9pbnRzPSI0MCw0MCA0MCw1NSA0NSwzNSIgZmlsbD0iI0ZGQTUwMCIvPjxwb2x5Z29uIHBvaW50cz0iNjAsNDAgNjAsNTUgNTUsNDUiIGZpbGw9IiNGRkE1MDAiLz48L3N2Zz4=');
        this.load.image('rock', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBvbHlnb24gcG9pbnRzPSIxMCwzMCAzMCwxMCA1MCwyMCA1MCw0MCAzMCw1MCIgZmlsbD0iIzk5OTk5OSIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=');
    }

    create() {
        loadGameState();
        this.scene.start('MenuScene');
    }
}

// ============ MENU SCENE ============
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#E0F6FF');

        this.add.text(400, 100, 'Penguin Glide', {
            fontSize: '48px',
            color: '#1a5f7a',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        if (gameState.level === 0) {
            this.add.image(400, 300, 'egg').setScale(2);
            this.add.text(400, 450, 'Help me hatch!', {
                fontSize: '32px',
                color: '#1a5f7a',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            const button = this.add.rectangle(400, 520, 200, 50, 0x4CAF50);
            button.setInteractive({ useHandCursor: true });
            button.on('pointerdown', () => this.scene.start('HatchScene'));

            this.add.text(400, 520, 'Start Game', {
                fontSize: '24px',
                color: '#fff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
        } else {
            this.add.image(400, 300, 'penguin').setScale(2 + gameState.fatness * 0.5);
            this.add.text(400, 450, `Level ${gameState.level}`, {
                fontSize: '32px',
                color: '#1a5f7a',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            const button = this.add.rectangle(400, 520, 200, 50, 0x4CAF50);
            button.setInteractive({ useHandCursor: true });
            button.on('pointerdown', () => this.scene.start(`Level${gameState.level}Scene`));

            this.add.text(400, 520, 'Continue', {
                fontSize: '24px',
                color: '#fff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
        }

        this.add.text(50, 550, `Fish: ${gameState.fish} | Fatness: ${(gameState.fatness * 100).toFixed(0)}%`, {
            fontSize: '16px',
            color: '#1a5f7a',
            fontFamily: 'Arial'
        });
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
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const egg = this.physics.add.sprite(400, 300, 'egg');
        egg.setScale(2);
        egg.setBounce(0.6);
        egg.setCollideWorldBounds(true);

        this.add.text(400, 450, 'Tap the egg to help it hatch!', {
            fontSize: '18px',
            color: '#1a5f7a',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const hatchText = this.add.text(400, 480, `Taps: ${gameState.hatchCount}/5`, {
            fontSize: '16px',
            color: '#666',
            fontFamily: 'Arial'
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
                saveGameState();

                this.add.image(400, 300, 'penguin').setScale(2);
                this.add.text(400, 450, 'Welcome to the world!', {
                    fontSize: '28px',
                    color: '#1a5f7a',
                    fontFamily: 'Arial'
                }).setOrigin(0.5);

                const btn = this.add.rectangle(400, 520, 200, 50, 0x4CAF50);
                btn.setInteractive({ useHandCursor: true });
                btn.on('pointerdown', () => this.scene.start('Level1Scene'));

                this.add.text(400, 520, 'Continue', {
                    fontSize: '24px',
                    color: '#fff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5);
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
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(100, 300, 'penguin');
        penguin.setScale(2 + gameState.fatness * 0.5);
        penguin.setBounce(0.3);
        penguin.setVelocityX(200);

        const mom = this.add.image(700, 300, 'mom').setScale(2.5);

        this.physics.add.overlap(penguin, mom, () => {
            gameState.level = 2;
            gameState.fatness = Math.min(1, gameState.fatness + 0.1);
            saveGameState();
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
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(400, 500, 'penguin');
        penguin.setScale(2 + gameState.fatness * 0.5);
        penguin.setCollideWorldBounds(true);
        penguin.setBounce(0.2);

        const fish = this.physics.group();
        let fishCaught = 0;

        const spawnFish = () => {
            const x = Phaser.Math.Between(100, 700);
            const y = Phaser.Math.Between(50, 200);
            fish.create(x, y, 'fish').setScale(1.5);
        };

        for (let i = 0; i < 4; i++) spawnFish();

        this.physics.add.overlap(penguin, fish, (p, f) => {
            f.destroy();
            fishCaught++;
            gameState.fish++;

            if (fishCaught >= 4) {
                gameState.level = 3;
                saveGameState();
                this.scene.start('Level3Scene');
            }
        });

        // Simple touch controls
        this.input.on('pointermove', (pointer) => {
            penguin.setVelocityX((pointer.x - penguin.x) * 2);
        });

        this.add.text(400, 550, `Fish: ${fishCaught}/4`, {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setName('fishText');

        this.physics.add.overlap(penguin, fish, (p, f) => {
            f.destroy();
            fishCaught++;
            gameState.fish++;
            this.children.getByName('fishText').setText(`Fish: ${fishCaught}/4`);
        });
    }
}

// ============ LEVELS 3-5 - BROTHERS ============
class Level3Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level3Scene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');
        this.add.text(400, 20, 'Level 3: Hold Brother\'s Hand!', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(400, 300, 'penguin').setScale(2);
        const brother = this.physics.add.sprite(450, 300, 'penguin').setScale(2);

        penguin.setVelocity(-100, 0);
        brother.setVelocity(-100, 0);

        this.time.delayedCall(3000, () => {
            gameState.level = 4;
            saveGameState();
            this.scene.start('Level4Scene');
        });

        this.add.text(400, 550, 'Hold hands and slide together!', {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
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
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(400, 300, 'penguin').setScale(2);
        penguin.setVelocity(-100, 0);

        this.time.delayedCall(3000, () => {
            gameState.level = 5;
            saveGameState();
            this.scene.start('Level5Scene');
        });

        this.add.text(400, 550, 'Keep sliding!', {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
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
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(400, 300, 'penguin').setScale(2);
        penguin.setVelocity(-100, 0);

        this.time.delayedCall(3000, () => {
            gameState.level = 6;
            saveGameState();
            this.scene.start('Level6Scene');
        });

        this.add.text(400, 550, 'Almost there!', {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }
}

// ============ LEVELS 6-8 - WALRUS PATROL ============
class Level6Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level6Scene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');
        this.add.text(400, 20, 'Level 6: Avoid Walrus!', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(100, 300, 'penguin').setScale(2);
        const walrus = this.physics.add.sprite(700, 300, 'walrus').setScale(1.5);

        penguin.setVelocityX(150);
        walrus.setVelocityX(-150);

        this.time.delayedCall(4000, () => {
            gameState.level = 7;
            saveGameState();
            this.scene.start('Level7Scene');
        });

        this.add.text(400, 550, 'Avoid the walrus!', {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
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
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(100, 300, 'penguin').setScale(2);
        penguin.setVelocityX(200);

        this.time.delayedCall(4000, () => {
            gameState.level = 8;
            saveGameState();
            this.scene.start('Level8Scene');
        });

        this.add.text(400, 550, 'Run faster!', {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
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
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(100, 300, 'penguin').setScale(2);
        penguin.setVelocityX(250);

        this.time.delayedCall(4000, () => {
            gameState.level = 9;
            saveGameState();
            this.scene.start('Level9Scene');
        });

        this.add.text(400, 550, 'Almost safe!', {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }
}

// ============ LEVELS 9-10 - EDGES & OBSTACLES ============
class Level9Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level9Scene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');
        this.add.text(400, 20, 'Level 9: Icy Edges!', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(400, 300, 'penguin').setScale(2);
        penguin.setVelocityX(150);

        const rocks = this.physics.group();
        rocks.create(300, 300, 'rock');
        rocks.create(500, 300, 'rock');

        this.physics.add.collider(penguin, rocks);

        this.time.delayedCall(4000, () => {
            gameState.level = 10;
            saveGameState();
            this.scene.start('Level10Scene');
        });

        this.add.text(400, 550, 'Avoid rocks!', {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
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
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const penguin = this.physics.add.sprite(400, 300, 'penguin').setScale(2);
        penguin.setVelocityX(200);

        this.time.delayedCall(5000, () => {
            this.scene.start('CreditsScene');
        });

        this.add.text(400, 550, 'You\'re almost there!', {
            fontSize: '16px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
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
            fontSize: '48px',
            color: '#1a5f7a',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.image(400, 250, 'penguin').setScale(3);

        this.add.text(400, 380, 'Created by', {
            fontSize: '20px',
            color: '#1a5f7a',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.add.text(400, 420, 'Razdobreev and GrokForge', {
            fontSize: '24px',
            color: '#1a5f7a',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 480, `Final Stats: ${gameState.fish} Fish | Fatness: ${(gameState.fatness * 100).toFixed(0)}%`, {
            fontSize: '16px',
            color: '#666',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const button = this.add.rectangle(400, 550, 200, 50, 0x4CAF50);
        button.setInteractive({ useHandCursor: true });
        button.on('pointerdown', () => {
            gameState.level = 0;
            gameState.fish = 0;
            gameState.fatness = 0.5;
            gameState.hatchCount = 0;
            saveGameState();
            this.scene.start('MenuScene');
        });

        this.add.text(400, 550, 'Play Again', {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }
}

