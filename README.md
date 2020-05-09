
# pxt-spritewrapper ![Build Status Abzeichen](https://github.com/ractive/pxt-spritewrapper/workflows/MakeCode/badge.svg)

This extension allows you to easily wrap a sprite in a class and get the corresponding class instance
when given a given sprite. Your class needs to extend the `SpriteWrapper.Support` base class.
Your object's `onDestroyed` method is set as a callback to the sprite's `onDestroyed` method.
Whenever the sprite gets destroyed, the `onDestroyed` method of your object is called, so that you can
do some clanup. To destroy an object yourself, call the `destroy` method of its 
sprite or call the `destroy` method directly on the object.

Here's a very simple space shooter game that demonstrates how to use it:
```
class EnemySpaceShip extends SpriteWrapper.Support {
    private static readonly image: Image = img`
        5 5 5 5 5 5 d
        . 5 5 5 5 d .
        . . 5 5 d . .
        . . . 5 . . .
    `;

    constructor(xPos: number) {
        super(sprites.create(EnemySpaceShip.image, SpriteKind.Enemy));
        this.sprite.setFlag(SpriteFlag.AutoDestroy, true);
        this.sprite.y = 0;
        this.sprite.x = xPos;
        this.sprite.vy = 50;
    }

    public gotHit() {
        info.changeScoreBy(10);
        this.destroy();
    }
}

class SpaceShip extends SpriteWrapper.Support {
    private static readonly image: Image = img`
        . . . d . . .
        . . 1 1 d . .
        . 1 1 1 1 d .
        1 1 1 1 1 1 d
    `;

    constructor() {
        super(sprites.create(SpaceShip.image, SpriteKind.Player));
        this.sprite.setFlag(SpriteFlag.AutoDestroy, true);
        this.sprite.y = scene.screenHeight() - 10;
        this.sprite.setFlag(SpriteFlag.StayInScreen, true);

        controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
            this.flyLeft();
        });
        controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
            this.flyRight();
        });
        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            this.shoot();
        });
    }

    public onDestroyed() {
        music.powerDown.play();
        game.over(false);
    }

    public flyLeft() {
        this.sprite.vy = 0;
        this.sprite.vx = -50;
    }

    public flyRight() {
        this.sprite.vy = 0;
        this.sprite.vx = 50;
    }

    public shoot() {
        sprites.createProjectileFromSprite(img`
            1
        `, this.sprite, 0, -70);
    }
}

const player: SpaceShip = new SpaceShip();

game.onUpdateInterval(1000, () => {
   new EnemySpaceShip(randint(0, scene.screenWidth()));
});

sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, (playerSprite: Sprite, enemySprite: Sprite) => {
    SpriteWrapper.fromSprite(playerSprite).destroy();
    SpriteWrapper.fromSprite(enemySprite).destroy();
});

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, (projectileSprite: Sprite, enemySprite: Sprite) => {
    (SpriteWrapper.fromSprite(enemySprite) as EnemySpaceShip).gotHit();
    projectileSprite.destroy();
});
```


## Using it in your project

To use this extension in your project, choose "Advanced > Extensions..." and enter `https://github.com/ractive/pxt-spritewrapper` in the search box.

#### Metadata (used for search, rendering)

* for PXT/arcade
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
