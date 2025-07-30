// Copyright 2024 GEEKROS, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { useLibs } from "@/libs";
import { LocalAudioVisualizer } from "@/libs/visualizer";
import { useEffect, useRef, useState } from "react";

type AssistantConnectVisualizerProps = {
    className?: string;
    stream: MediaStream;
    bands?: number;
};

export function AssistantConnectVisualizer({ className, stream, bands = 6 }: AssistantConnectVisualizerProps) {
    const [frequencies, setFrequencies] = useState<Float32Array[]>([]);

    const visualizerRef = useRef<LocalAudioVisualizer | null>(null);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const summedFrequencies = frequencies.map((bandFrequencies: any) => {
        const sum = (bandFrequencies as number[]).reduce((a, b) => a + b, 0);
        return Math.sqrt(sum / bandFrequencies.length);
    });

    useEffect(() => {
        if (!stream) return;

        const visualizer = useLibs.visualizer.LocalAudioVisualizer.onIntialize(stream);
        visualizerRef.current = visualizer;

        const update = () => {
            const data = visualizer.getFrequencyBands(bands, 100, 600);
            setFrequencies(data);
        };

        intervalRef.current = setInterval(update, 30);

        return () => {
            visualizer.destroy();
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [stream]);

    return (
        <div className={"w-full flex flex-row gap-2 h-full items-center justify-center border-0 rounded-sm " + className}>
            <audio id="audio_connect_stream" className="hidden" muted></audio>
            <div className="h-1 flex flex-row items-center gap-1">
                {summedFrequencies.map((frequency, index) => {
                    const width = 4;
                    const minHeight = 2;
                    const maxHeight = 20;
                    const height = Math.max(minHeight, Math.min(maxHeight, frequency * maxHeight));
                    return (
                        <div
                            key={"frequency-" + index}
                            className="bg-primary rounded-md"
                            style={{ height: height, width: width, transition: "background-color 0.35s ease-out, transform 0.25s ease-out", transform: "none" }}
                        ></div>
                    );
                })}
            </div>
        </div>
    );
}
