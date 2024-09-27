import {chooseRandomFrom, createArray} from "@/util/util";

export class AtomType {
    public readonly groupNumber: number;
    public readonly symbol: string;

    private constructor(symbol: string, groupNumber: number) {
        this.symbol = symbol;
        this.groupNumber = groupNumber;
    }

    public get effectiveNuclearCharge() {
        return this.groupNumber;
    }

    public get valenceElectrons() {
        return this.groupNumber;
    }

    public static readonly PHOSPHOROUS: AtomType = new AtomType("P", 5);
    public static readonly BORON: AtomType = new AtomType("B", 3);
    public static readonly SILICON: AtomType = new AtomType("Si", 4);
}

class Atom {
    public readonly atomType: AtomType;
    private _valenceElectrons: number;

    public constructor(atomType: AtomType) {
        this.atomType = atomType;
        this._valenceElectrons = atomType.valenceElectrons;
    }

    public resetToInitialState(): void {
        this._valenceElectrons = this.atomType.valenceElectrons;
    }

    public get valenceElectrons() {
        return this._valenceElectrons;
    }

    public get charge() {
        return this.atomType.effectiveNuclearCharge - this._valenceElectrons;
    }

    removeElectron() {
        this._valenceElectrons--;
    }

    addElectron() {
        this._valenceElectrons++;
    }
}

export class Vec2 {
    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public static add(a: Vec2, b: Vec2): Vec2 {
        return new Vec2(a.x + b.x, a.y + b.y);
    }
}

export class Simulation {
    private readonly grid: (Atom | null)[][];
    public readonly width: number;
    public readonly height: number;

    public constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.grid = createArray(width, () => createArray(height, null))
    }

    public fillRegion(
        x0: number, y0: number, x1: number, y1: number,
        mappingFunction: (prev: AtomType | null) => AtomType | null
    ) {
        for (let x = x0; x < x1; x++) {
            for (let y = y0; y < y1; y++) {
                const newAtomType = mappingFunction(this.grid[x][y]?.atomType ?? null);
                this.grid[x][y] = newAtomType ? new Atom(newAtomType) : null;
            }
        }
        this.resetAtomsToInitialStates();
    }

    public resetAtomsToInitialStates() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.grid[x][y]?.resetToInitialState();
            }
        }
    }

    public getAtomAt(point: Vec2): Atom | null {
        return this.grid[point.x]?.[point.y] ?? null;
    }

    public getFieldAtPoint(x: number, y: number): Vec2 {
        return new Vec2(0, 0);
    }

    public simulateStep() {
        // Atoms that want to donate an electron to each atom
        const electronsFrom: Map<Atom, Atom[]> = new Map;

        this.grid.forEach((row, x) => row.forEach((currentAtom, y) => {
            if (currentAtom === null) return;

            // TODO: account for electric field

            const currentPoint = new Vec2(x, y);
            const neighborPoint = Vec2.add(
                currentPoint,
                chooseRandomFrom(new Vec2(0, -1), new Vec2(0, 1), new Vec2(-1, 0), new Vec2(1, 0))
            );
            const neighborAtom = this.getAtomAt(neighborPoint);

            if (neighborAtom === null) return;

            // Electron can only jump to next atom if the other atom currently
            // has less valence electrons

            if (neighborAtom.valenceElectrons > currentAtom.valenceElectrons) return;

            if (!electronsFrom.has(neighborAtom)) electronsFrom.set(neighborAtom, []);
            (electronsFrom.get(neighborAtom) as Atom[]).push(currentAtom);
        }));

        for (const [targetAtom, possibleSourceAtoms] of electronsFrom.entries()) {
            // Choose a random atom from the list to accept the electron from
            const sourceAtom = chooseRandomFrom(...possibleSourceAtoms);

            sourceAtom.removeElectron();
            targetAtom.addElectron();
        }
    }
}