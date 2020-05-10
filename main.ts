 namespace SpriteWrapper {
    const objects: { [id: string]: SpriteWrapper } = {};

    /**
     * Classes that wrap a Sprite and want to register instances
     * of it implement this interface. The onDestroyed method is called
     * when the corresponding sprite is destroyed.
     */
    export interface SpriteWrapper {
        sprite: Sprite;
        destroy(): void;
        onDestroyed(): void;
    }

	
    /**
     * An abstract base class you can use to derive your classes from.
     * All instances are registered with the "register" function after
     * being created.
     */
    export abstract class Support implements SpriteWrapper {
        public readonly sprite: Sprite;

        /**
         * Registers this instance by calling the register function
         * to be able to look this instance up with "fromSprite" again.
         */
        constructor(sprite: Sprite) {
            this.sprite = sprite;
            register(this);
        }

        /**
         * Gets called, when the associated sprite got destroyed.
         */
        public onDestroyed(): void { };


        /**
         * Destroys the associated sprite
         */
        public destroy(): void {
            this.sprite.destroy();
        }
    }

    /**
     * Registers a SpriteWrapper object whose onDestroyed
     * mehtod is called, when the wrapped sprite is destroyed.
     */
    function register(object: SpriteWrapper): void {
        objects[object.sprite.id] = object;

        object.sprite.onDestroyed(() => {
            object.onDestroyed();
            delete objects[object.sprite.id];
        });
    }

    /**
     * Return the object that is associated with the given sprite.
     * This can be useful when a sprite is retrieved e.g. with
     * sprites.onOverlap(...) and you want to have the
     * corresponding SpriteWrapper object.
     * 
     */
    export function fromSprite(sprite: Sprite): SpriteWrapper {
        return objects[sprite.id];
    }

    /**
     * Returns all registered SpriteWrapper objects
     */
    export function all(): SpriteWrapper[] {
        console.log("all");
        return Object.keys(objects).map(key => objects[key]);
    }
}
