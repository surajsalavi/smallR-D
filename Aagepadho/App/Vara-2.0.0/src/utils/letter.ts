import { BlockName } from '../types';
import Block from './block';
import VaraChar from './char';
import LetterPart, { LetterPartProps } from './letterpart';
import Line from './line';
import RenderBase from './renderbase';

export interface LetterProps {
    x: number;
    y: number;
    width: number;
    ctx: CanvasRenderingContext2D;
    parent: Line;
    character: VaraChar;
}

let letterId = 0;

export default class Letter extends RenderBase {
    x: number;
    y: number;
    width: number;
    character: VaraChar;
    id: number;

    parts: LetterPart[];

    drawnParts: LetterPart[];
    name: BlockName;

    rootBlock: Block;

    constructor(props: LetterProps) {
        super(props);

        this.x = props.x;
        this.y = props.y;
        this.width = props.width;
        this.parts = [];
        this.drawnParts = [];
        this.name = 'letter';

        this.character = props.character;

        this.id = letterId;
        letterId++;

        this.rootBlock = this.getParent('block', this) as Block;
    }

    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Add a new part to the queue
     * @param part The part to be added
     */
    addPart(part: Omit<LetterPartProps, 'ctx' | 'parent'>) {
        this.parts.push(
            new LetterPart({
                ...part,
                ctx: this.ctx,
                parent: this,
            })
        );

        // Update the total path length stored in the main block.
        if (this.rootBlock) {
            this.rootBlock.modifyPathLength(part.pathLength, 'increment');
        }
    }

    setParent(parent: Line) {
        this.parent = parent;
    }

    isDone() {
        return this.parts.length === 0;
    }

    /**
     * Remove the first item from the queue. Used when a part has been drawn completely.
     *
     * The removed item is moved to the drawnParts array
     */
    dequeue() {
        const removedItem = this.parts.shift();
        if (removedItem) this.drawnParts.push(removedItem);
    }

    /**
     * Render the current letter
     * @param rafTime The time value received from requestAnimationFrame
     */
    render(rafTime: number, previousRAFTime: number) {
        this.ctx.save();
        this.ctx.scale(this.rootBlock.scale, this.rootBlock.scale);
        this.ctx.translate(this.x, this.y);

        const delta = (rafTime - previousRAFTime) / 1000;

        if (this.parts.length > 0) {
            const part = this.parts[0];
            if (part.dashOffset > part.pathLength) {
                this.dequeue();
            } else {
                part.draw(delta);
            }
        }

        this.drawnParts.forEach(drawnPart => {
            drawnPart.paint();
        });

        this.ctx.restore();
    }

    /**
     * Paints the paths whose animations are complete
     */
    paint() {
        this.ctx.save();
        this.ctx.scale(this.rootBlock.scale, this.rootBlock.scale);
        this.ctx.translate(this.x, this.y);

        this.drawnParts.forEach(drawnPart => {
            drawnPart.paint();
        });

        this.ctx.restore();
    }
}
