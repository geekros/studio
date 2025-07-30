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

import { Button } from "@/components/base/button";
import { useLanguage } from "@/hooks/context/language";
import { ChevronDownIcon, LoaderCircleIcon, MicIcon, MicOffIcon, PowerIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/base/dropdown-menu";
import { useEffect, useState } from "react";
import { AssistantConnectVisualizer } from "./visualizer";
import { useLibs } from "@/libs";

type AssistantConnectProps = {
    className?: string;
};

interface state {
    error: string;
    interval: any;
    stream: MediaStream;
    audios: InputDeviceInfo[];
    active_audio: InputDeviceInfo;
    active_audio_track: MediaStreamTrack;
    enabled: boolean;
    loading: boolean;
    connected: boolean;
}

const default_state: state = {
    error: "",
    interval: null,
    stream: new MediaStream(),
    audios: [],
    active_audio: {} as InputDeviceInfo,
    active_audio_track: {} as MediaStreamTrack,
    enabled: true,
    loading: false,
    connected: false,
};

export function AssistantConnect({ className }: AssistantConnectProps) {
    const { lang } = useLanguage();

    const device = useLibs.device.MediaDevice;

    const [microphone, setMicrophone] = useState<state>(default_state);

    const [heights, setHeights] = useState<number[]>([50, 50, 50, 50, 50]);

    const updateMicrophone = (value: state) => {
        setMicrophone((prev: any) => ({ ...prev, ...value }));
    };

    function onDeviceDisable() {
        if (microphone.active_audio_track) {
            microphone.enabled = !microphone.enabled;
            microphone.active_audio_track.enabled = !microphone.enabled;
            updateMicrophone(microphone);
        }
    }

    function onConnect() {
        device.GetAudio(
            (stream: MediaStream, audios: InputDeviceInfo[], active_audio: InputDeviceInfo, active_audio_track: MediaStreamTrack) => {
                setTimeout(() => {
                    const audio: any = document.getElementById("audio_connect_stream");
                    audio.srcObject = stream;
                    audio.onloadedmetadata = function (_e: any) {
                        audio.play();
                    };
                }, 500);
                microphone.stream = stream;
                microphone.audios = audios;
                microphone.active_audio = active_audio;
                microphone.active_audio_track = active_audio_track;
                microphone.enabled = !active_audio_track.enabled;
                microphone.loading = false;
                microphone.connected = true;
                microphone.interval = setInterval(() => {
                    if (microphone.connected) {
                        setHeights((prev) => prev.map((h, i) => (i === 2 ? h : Math.floor(50 + Math.random() * 30))));
                    } else {
                        setHeights((prev) => prev.map((h, i) => (i === 2 ? h : 50)));
                    }
                }, 500);
                updateMicrophone(microphone);
            },
            (error: any) => {
                microphone.error = error.message;
                microphone.loading = false;
                microphone.connected = false;
                updateMicrophone(microphone);
            }
        );
    }

    function onDisconnect() {
        microphone.connected = false;
        setHeights((prev) => prev.map((h, i) => (i === 2 ? h : 50)));
        clearInterval(microphone.interval);
        updateMicrophone(microphone);
    }

    useEffect(() => {
        return () => clearInterval(microphone.interval);
    }, []);

    return (
        <div className={"w-full h-[380px] " + className}>
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-auto h-auto space-y-8">
                    <div className="w-full h-[100px] flex items-center justify-center space-x-3">
                        {Array.from({ length: 5 }).map((_, i) => {
                            const isCenter = i === 2;
                            const height = heights[i];
                            if (isCenter) {
                                return (
                                    <div
                                        key={i}
                                        className={`bg-muted-foreground/10 rounded-full transition-all duration-500 ease-in-out transform ${
                                            !microphone.connected ? "opacity-100 scale-100" : "opacity-100 scale-100"
                                        }`}
                                        style={{
                                            width: !microphone.connected ? "100px" : "50px",
                                            height: !microphone.connected ? "100px" : "50px",
                                            backgroundColor: "rgb(255, 255, 255)",
                                            backgroundImage: "radial-gradient(at 76% 31%, rgb(0, 208, 250) 0px, transparent 50%), radial-gradient(at 20% 81%, rgb(0, 216, 255) 0px, transparent 50%)",
                                            backgroundSize: "300% 300%",
                                            filter: "drop-shadow(rgba(255, 255, 255, 0.5) 0px 0px 45px)",
                                            animation: "20s ease 0s infinite normal none running gradient-animation, 2s ease-out 0s infinite alternate none running rotate-animation",
                                        }}
                                    ></div>
                                );
                            } else {
                                return (
                                    <div
                                        key={i}
                                        className={`w-[50px] h-[50px] bg-muted-foreground/10 rounded-full transition-all duration-500 ease-in-out transform ${
                                            !microphone.connected ? "opacity-0 scale-100" : "opacity-100 scale-100 animate-pulse"
                                        }`}
                                        style={{
                                            height: `${height}px`,
                                        }}
                                    ></div>
                                );
                            }
                        })}
                    </div>
                    <div className="w-full">
                        {!microphone.connected ? (
                            <div className="w-full flex items-center justify-center">
                                <Button onClick={onConnect} disabled={microphone.loading} className="w-auto" size="sm" variant="secondary">
                                    {microphone.loading ? <LoaderCircleIcon className="w-4 h-4 animate-spin" /> : <MicIcon className="w-4 h-4" />}
                                    <span className="text-xs">{lang(microphone.loading ? "common.connecting" : "common.connect")}</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="w-full flex items-center justify-center space-x-2">
                                <div className="w-auto">
                                    <Button className="w-full" size="sm" variant="secondary">
                                        {microphone.enabled ? (
                                            <div onClick={onDeviceDisable}>
                                                <MicOffIcon className="w-4 h-4 mr-1" />
                                            </div>
                                        ) : (
                                            <div onClick={onDeviceDisable}>
                                                <MicIcon className="w-4 h-4 mr-1" />
                                            </div>
                                        )}
                                        <span className="text-xs mr-1">
                                            <AssistantConnectVisualizer stream={microphone.stream} bands={6} />
                                        </span>
                                        <div className="border-border border-l pl-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <span>
                                                        <ChevronDownIcon className="w-4 h-4" />
                                                    </span>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" side="top">
                                                    <DropdownMenuLabel className="uppercase">Microphone</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuRadioGroup value={microphone.active_audio?.deviceId || ""}>
                                                        {microphone.audios.map((item: any) => {
                                                            return (
                                                                <DropdownMenuRadioItem className="text-xs text-muted-foreground" key={item.deviceId} value={item.deviceId}>
                                                                    {item.label}
                                                                </DropdownMenuRadioItem>
                                                            );
                                                        })}
                                                    </DropdownMenuRadioGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </Button>
                                </div>
                                <div className="w-auto">
                                    <Button onClick={onDisconnect} disabled={microphone.loading} className="w-full" size="sm" variant="destructive">
                                        {microphone.loading ? <LoaderCircleIcon className="w-4 h-4 animate-spin" /> : <PowerIcon className="w-4 h-4" />}
                                        <span className="text-xs">{lang("common.disconnect")}</span>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
