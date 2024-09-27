import {ReactNode} from "react";
import {Simulation, Vec2} from "@/simulation/simulation";
import {createArray} from "@/util/util";

import "./simulationRenderer.css"
import {useListenerOnWindow, useManualRerender} from "@/util/hooks";

function SimulationCell({position, simulation}: {
    position: Vec2,
    simulation: Simulation,
}): ReactNode {
    const atom = simulation.getAtomAt(position);

    if (atom === null) return <div className='simulation-atom empty'></div>;

    console.log('Rerendered atom');

    return <div className='simulation-atom'>
        {atom.atomType.symbol}
        {
            createArray(atom.valenceElectrons, i => <div className="simulation-valence-electron" key={i}/>)
        }
    </div>;
}

export function SimulationRenderer({simulation}: { simulation: Simulation }): ReactNode {
    const rerender = useManualRerender();
    console.log('Rerendered simulation');

    useListenerOnWindow("contextmenu", e => {
        e.preventDefault();
        simulation.simulateStep();
        console.log('Done with step');
        rerender();
    });


    return <div className="electricicty-sim-renderer">
        <div className="simulation-grid">
            {
                createArray(simulation.height, y =>
                    <div className='simulation-row' key={y}>
                        {
                            createArray(simulation.width, x =>
                                <SimulationCell {...{s: rerender.state}} position={new Vec2(x, y)} simulation={simulation} key={x}/>
                            )
                        }
                    </div>
                )
            }
        </div>
    </div>;
}