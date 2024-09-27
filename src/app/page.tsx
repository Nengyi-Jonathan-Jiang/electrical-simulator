"use client"

import {useEffect, useState} from "react";
import {AtomType, Simulation} from "@/simulation/simulation";
import {SimulationRenderer} from "@/app/components/simulationRenderer";
import {useAnimation, useListenerOnWindow, useManualRerender} from "@/util/hooks";

export default function Home() {
    const rerender = useManualRerender();
    // const [simulation] = useState(() => new Simulation(30, 12));
    //
    // useEffect(() => {
    //     simulation.fillRegion(0, 1, 15, 11, () => (
    //         Math.random() > 0.1 ? AtomType.SILICON : AtomType.BORON
    //     ));
    //     simulation.fillRegion(15, 1, 30, 11, () => (
    //         Math.random() > 0.1 ? AtomType.SILICON : AtomType.PHOSPHOROUS
    //     ));
    //     rerender();
    // }, []);
    const [simulation] = useState(() => new Simulation(6, 3));

    useEffect(() => {
        simulation.fillRegion(0, 0, 3, 3, () => (
            Math.random() > 0.1 ? AtomType.SILICON : AtomType.BORON
        ));
        simulation.fillRegion(3, 0, 6, 3, () => (
            Math.random() > 0.1 ? AtomType.SILICON : AtomType.PHOSPHOROUS
        ));
        rerender();
    }, []);

    return (
        <main>
            <SimulationRenderer simulation={simulation}/>
        </main>
    );
}
